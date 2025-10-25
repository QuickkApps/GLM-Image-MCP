#!/usr/bin/env node

/**
 * Basic Image Analysis Example
 * Demonstrates how to use GLM Image MCP Server for image analysis
 */

const { spawn } = require('child_process');
const path = require('path');

// Example configurations for different use cases
const examples = {
  basic: {
    tool: 'analyze_image',
    parameters: {
      image_path: './examples/sample-image.jpg',
      prompt: 'Describe what you see in this image in detail'
    }
  },
  
  focused: {
    tool: 'focused_analyze_image',
    parameters: {
      image_path: './examples/sample-image.jpg',
      focus_area: 'text'
    }
  },
  
  custom: {
    tool: 'analyze_image',
    parameters: {
      image_path: './examples/sample-image.jpg',
      prompt: 'Extract any text, numbers, or data from this image',
      provider: 'gemini',
      model: 'gemini-1.5-flash'
    }
  }
};

/**
 * Execute MCP tool call
 * @param {string} tool - Tool name
 * @param {Object} parameters - Tool parameters
 */
async function executeToolCall(tool, parameters) {
  return new Promise((resolve, reject) => {
    console.log(`\n🔧 Calling tool: ${tool}`);
    console.log(`📋 Parameters:`, JSON.stringify(parameters, null, 2));
    
    // Simulate MCP server call (in real usage, this would be handled by MCP client)
    const mcpServer = spawn('node', ['glm-image-mcp.js'], {
      stdio: ['pipe', 'pipe', 'pipe'],
      env: {
        ...process.env,
        // Add your API keys here for testing
        // OPENROUTER_API_KEY: 'your-key-here',
        // GEMINI_API_KEY: 'your-key-here'
      }
    });
    
    // Send MCP request
    const request = {
      jsonrpc: '2.0',
      id: 1,
      method: 'tools/call',
      params: {
        name: tool,
        arguments: parameters
      }
    };
    
    mcpServer.stdin.write(JSON.stringify(request) + '\n');
    
    let response = '';
    mcpServer.stdout.on('data', (data) => {
      response += data.toString();
    });
    
    mcpServer.stderr.on('data', (data) => {
      console.error('Server error:', data.toString());
    });
    
    mcpServer.on('close', (code) => {
      if (code === 0) {
        try {
          const result = JSON.parse(response);
          console.log('✅ Success:', result);
          resolve(result);
        } catch (error) {
          console.log('📄 Server response:', response);
          resolve({ message: 'Server executed successfully' });
        }
      } else {
        reject(new Error(`Server exited with code ${code}`));
      }
    });
    
    // Timeout after 30 seconds
    setTimeout(() => {
      mcpServer.kill();
      reject(new Error('Request timeout'));
    }, 30000);
  });
}

/**
 * Run all examples
 */
async function runExamples() {
  console.log('🚀 GLM Image MCP Server - Basic Analysis Examples');
  console.log('=' .repeat(60));
  
  // Check if sample image exists
  const fs = require('fs');
  const sampleImagePath = './examples/sample-image.jpg';
  
  if (!fs.existsSync(sampleImagePath)) {
    console.log(`\n⚠️  Sample image not found at: ${sampleImagePath}`);
    console.log('Please add a sample image to test the examples.');
    console.log('You can download any image and save it as sample-image.jpg');
    console.log('See sample-image.txt for instructions.');
    return;
  }
  
  try {
    // Example 1: Basic analysis
    console.log('\n📸 Example 1: Basic Image Analysis');
    await executeToolCall(examples.basic.tool, examples.basic.parameters);
    
    // Example 2: Focused analysis
    console.log('\n🎯 Example 2: Focused Text Analysis');
    await executeToolCall(examples.focused.tool, examples.focused.parameters);
    
    // Example 3: Custom provider and model
    console.log('\n⚙️  Example 3: Custom Provider and Model');
    await executeToolCall(examples.custom.tool, examples.custom.parameters);
    
    console.log('\n✅ All examples completed successfully!');
    
  } catch (error) {
    console.error('\n❌ Error running examples:', error.message);
    console.log('\n💡 Make sure to:');
    console.log('   1. Install dependencies: npm install');
    console.log('   2. Set API keys (OPENROUTER_API_KEY or GEMINI_API_KEY)');
    console.log('   3. Add a sample image to ./examples/sample-image.jpg');
  }
}

/**
 * Show usage instructions
 */
function showUsage() {
  console.log(`
📖 GLM Image MCP Server - Usage Examples

This script demonstrates how to use the GLM Image MCP Server for image analysis.

🔧 Setup:
1. Install dependencies: npm install
2. Set API keys:
   export OPENROUTER_API_KEY="your-openrouter-key"
   # OR
   export GEMINI_API_KEY="your-gemini-key"
3. Add sample image: ./examples/sample-image.jpg

🚀 Run examples:
node examples/basic-analysis.js

📋 Available examples:
- Basic analysis: General image description
- Focused analysis: Specific aspect analysis (text, faces, objects, etc.)
- Custom configuration: Specific provider and model selection

🔗 For more information, see: README.md
`);
}

// Check command line arguments
if (process.argv.includes('--help') || process.argv.includes('-h')) {
  showUsage();
  process.exit(0);
}

// Run examples if called directly
if (require.main === module) {
  runExamples().catch(console.error);
}

module.exports = {
  examples,
  executeToolCall,
  runExamples
};