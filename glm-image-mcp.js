#!/usr/bin/env node

const { Server } = require('@modelcontextprotocol/sdk/server/index.js');
const { StdioServerTransport } = require('@modelcontextprotocol/sdk/server/stdio.js');
const {
  CallToolRequestSchema,
  ListToolsRequestSchema,
} = require('@modelcontextprotocol/sdk/types.js');
const fetch = require('node-fetch');
const fs = require('fs');
const path = require('path');

// Import modules
const ValidationUtils = require('./utils/validation');

const server = new Server(
  {
    name: 'glm-image-mcp',
    version: '2.1.0',
  },
  {
    capabilities: {
      tools: {},
    },
  }
);

// Initialize utilities
const validator = new ValidationUtils();

/**
 * Detect available providers based on API keys
 * @returns {string} - The first available provider ('gemini', 'openrouter', or throws error)
 */
function detectAvailableProvider() {
  // Check for Gemini API key first
  if (process.env.GEMINI_API_KEY) {
    console.error('Detected Gemini API key, using Gemini provider');
    return 'gemini';
  }
  
  // Check for OpenRouter API key
  if (process.env.OPENROUTER_API_KEY) {
    console.error('Detected OpenRouter API key, using OpenRouter provider');
    return 'openrouter';
  }
  
  // No API keys found
  throw new Error('No API keys found. Please set either GEMINI_API_KEY or OPENROUTER_API_KEY environment variable');
}

/**
 * Get API configuration based on provider
 * @param {string} provider - Provider name ('openrouter' or 'gemini'). If null, will auto-detect
 * @returns {Object} - API configuration
 */
function getAPIConfig(provider, model = null) {
  // Auto-detect provider if not specified
  if (!provider) {
    provider = detectAvailableProvider();
  }
  switch (provider) {
    case 'gemini':
      const geminiApiKey = process.env.GEMINI_API_KEY;
      const geminiModel = model || process.env.GEMINI_MODEL || 'gemini-2.5-pro';
      
      if (!geminiApiKey) {
        throw new Error('GEMINI_API_KEY environment variable is required for Gemini provider');
      }
      
      return {
        apiKey: geminiApiKey,
        model: geminiModel,
        provider: 'gemini'
      };
      
    case 'openrouter':
    default:
      const openRouterApiKey = process.env.OPENROUTER_API_KEY;
      const openRouterModel = model || process.env.OPENROUTER_MODEL || 'x-ai/grok-4-fast:free';
      
      if (!openRouterApiKey) {
        throw new Error('OPENROUTER_API_KEY environment variable is required for OpenRouter provider');
      }
      
      return {
        apiKey: openRouterApiKey,
        model: openRouterModel,
        provider: 'openrouter'
      };
  }
}

/**
 * Call OpenRouter vision API
 * @param {string} base64Image - Base64 encoded image
 * @param {string} imageType - Image MIME type
 * @param {string} prompt - Analysis prompt
 * @param {Object} config - API configuration
 * @returns {Promise<string>} - API response
 */
async function callOpenRouterAPI(base64Image, imageType, prompt, config) {
  const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${config.apiKey}`,
      'Content-Type': 'application/json',
      'HTTP-Referer': 'https://kilocode.ai',
      'X-Title': 'Kilo Code Enhanced MCP Server',
    },
    body: JSON.stringify({
      model: config.model,
      messages: [
        {
          role: 'user',
          content: [
            {
              type: 'text',
              text: prompt,
            },
            {
              type: 'image_url',
              image_url: {
                url: `data:${imageType};base64,${base64Image}`,
              },
            },
          ],
        },
      ],
    }),
  });
  
  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`OpenRouter API error: ${response.statusText} - ${errorText}`);
  }
  
  const result = await response.json();
  return result.choices[0].message.content;
}

/**
 * Call Google Gemini vision API
 * @param {string} base64Image - Base64 encoded image
 * @param {string} imageType - Image MIME type
 * @param {string} prompt - Analysis prompt
 * @param {Object} config - API configuration
 * @returns {Promise<string>} - API response
 */
async function callGeminiAPI(base64Image, imageType, prompt, config) {
  const requestBody = {
    contents: [
      {
        parts: [
          {
            text: prompt
          },
          {
            inline_data: {
              mime_type: imageType,
              data: base64Image
            }
          }
        ]
      }
    ]
  };

  const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/${config.model}:generateContent?key=${config.apiKey}`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(requestBody),
  });
  
  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`Gemini API error: ${response.statusText} - ${errorText}`);
  }
  
  const result = await response.json();
  
  if (result.candidates && result.candidates.length > 0) {
    return result.candidates[0].content.parts[0].text;
  } else {
    throw new Error('No response generated by Gemini API');
  }
}

// List available tools
server.setRequestHandler(ListToolsRequestSchema, async () => {
  return {
    tools: [
      {
        name: 'analyze_image',
        description: 'Analyze an image using OpenRouter or Google Gemini vision models',
        inputSchema: {
          type: 'object',
          properties: {
            image_path: {
              type: 'string',
              description: 'Path to the image file',
            },
            prompt: {
              type: 'string',
              description: 'What to analyze about the image',
            },
            provider: {
              type: 'string',
              description: 'AI provider to use (openrouter or gemini). If not specified, will auto-detect based on available API keys',
              enum: ['openrouter', 'gemini']
            },
            model: {
              type: 'string',
              description: 'Specific model to use (optional - overrides environment default)',
            },
          },
          required: ['image_path'],
        },
      },
      {
        name: 'describe_image',
        description: 'Describe an image in detail (alias for analyze_image with default prompt)',
        inputSchema: {
          type: 'object',
          properties: {
            image_path: {
              type: 'string',
              description: 'Path to the image file',
            },
            prompt: {
              type: 'string',
              description: 'Custom prompt for image description (optional - uses default if not provided)',
            },
            provider: {
              type: 'string',
              description: 'AI provider to use (openrouter or gemini). If not specified, will auto-detect based on available API keys',
              enum: ['openrouter', 'gemini']
            },
            model: {
              type: 'string',
              description: 'Specific model to use (optional - overrides environment default)',
            },
          },
          required: ['image_path'],
        },
      },
      {
        name: 'focused_analyze_image',
        description: 'Analyze specific aspects of an image with focused prompts',
        inputSchema: {
          type: 'object',
          properties: {
            image_path: {
              type: 'string',
              description: 'Path to the image file',
            },
            focus_area: {
              type: 'string',
              description: 'Specific area to focus on (e.g., "text", "faces", "objects", "colors", "layout")',
            },
            prompt: {
              type: 'string',
              description: 'Custom prompt for focused analysis (overrides focus_area if provided)',
            },
            provider: {
              type: 'string',
              description: 'AI provider to use (openrouter or gemini). If not specified, will auto-detect based on available API keys',
              enum: ['openrouter', 'gemini']
            },
            model: {
              type: 'string',
              description: 'Specific model to use (optional - overrides environment default)',
            },
          },
          required: ['image_path'],
        },
      },
    ],
  };
});

// Handle tool calls
server.setRequestHandler(CallToolRequestSchema, async (request) => {
  const { name, arguments: args } = request.params;

  try {
    if (name === 'analyze_image') {
      const { image_path, prompt, provider, model } = args;
      
      // Get API configuration (will auto-detect if provider not specified)
      const config = getAPIConfig(provider, model);
      
      // Read and validate image file
      const imageBuffer = fs.readFileSync(image_path);
      if (!validator.validateImageBuffer(imageBuffer)) {
        throw new Error('Invalid or corrupted image file');
      }
      
      const base64Image = imageBuffer.toString('base64');
      
      // Determine image type from file extension
      const imageType = image_path.toLowerCase().endsWith('.png') ? 'image/png' : 'image/jpeg';
      
      // Call appropriate API based on provider
      let analysis;
      if (config.provider === 'gemini') {
        analysis = await callGeminiAPI(base64Image, imageType, prompt, config);
      } else {
        analysis = await callOpenRouterAPI(base64Image, imageType, prompt, config);
      }
      
      return {
        content: [
          {
            type: 'text',
            text: analysis,
          },
        ],
      };
      
    } else if (name === 'describe_image') {
      const { image_path, prompt, provider, model } = args;
      
      // Get API configuration
      const config = getAPIConfig(provider, model);
      
      // Read and validate image file
      const imageBuffer = fs.readFileSync(image_path);
      if (!validator.validateImageBuffer(imageBuffer)) {
        throw new Error('Invalid or corrupted image file');
      }
      
      const base64Image = imageBuffer.toString('base64');
      const imageType = image_path.toLowerCase().endsWith('.png') ? 'image/png' : 'image/jpeg';
      
      // Call appropriate API
      let analysis;
      if (config.provider === 'gemini') {
        analysis = await callGeminiAPI(base64Image, imageType, prompt, config);
      } else {
        analysis = await callOpenRouterAPI(base64Image, imageType, prompt, config);
      }
      
      return {
        content: [
          {
            type: 'text',
            text: analysis,
          },
        ],
      };
      
    } else if (name === 'focused_analyze_image') {
      const { image_path, focus_area, prompt, provider, model } = args;
      
      // Use custom prompt if provided, otherwise generate from focus_area
      const finalPrompt = prompt || `Analyze the ${focus_area} in this image and provide detailed insights.`;
      
      // Get API configuration
      const config = getAPIConfig(provider, model);
      
      // Read and validate image file
      const imageBuffer = fs.readFileSync(image_path);
      if (!validator.validateImageBuffer(imageBuffer)) {
        throw new Error('Invalid or corrupted image file');
      }
      
      const base64Image = imageBuffer.toString('base64');
      const imageType = image_path.toLowerCase().endsWith('.png') ? 'image/png' : 'image/jpeg';
      
      // Call appropriate API
      let analysis;
      if (config.provider === 'gemini') {
        analysis = await callGeminiAPI(base64Image, imageType, finalPrompt, config);
      } else {
        analysis = await callOpenRouterAPI(base64Image, imageType, finalPrompt, config);
      }
      
      return {
        content: [
          {
            type: 'text',
            text: analysis,
          },
        ],
      };
      
    } else {
      throw new Error(`Unknown tool: ${name}`);
    }
  } catch (error) {
    return {
      content: [
        {
          type: 'text',
          text: `Error: ${error.message}`,
        },
      ],
      isError: true,
    };
  }
});

async function main() {
  try {
    const transport = new StdioServerTransport();
    await server.connect(transport);
    console.error('GLM Image MCP Server running on stdio');
    console.error('Supported providers: OpenRouter, Google Gemini');
    console.error('Available tools: analyze_image');
    console.error('Server ready for MCP connections from any IDE or extension');
  } catch (error) {
    console.error('Failed to start GLM Image MCP Server:', error.message);
    process.exit(1);
  }
}

// Handle process termination gracefully
process.on('SIGINT', () => {
  console.error('\nShutting down GLM Image MCP Server...');
  process.exit(0);
});

process.on('SIGTERM', () => {
  console.error('\nShutting down GLM Image MCP Server...');
  process.exit(0);
});

// Start server if this file is run directly
if (require.main === module) {
  main().catch((error) => {
    console.error('Server error:', error);
    process.exit(1);
  });
}