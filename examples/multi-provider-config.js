#!/usr/bin/env node

/**
 * Multi-Provider Configuration Example
 * Demonstrates how to configure and use multiple AI providers with GLM Image MCP Server
 */

const fs = require('fs');
const path = require('path');

// Configuration examples for different MCP clients
const configurations = {
  // Claude Desktop configuration
  claudeDesktop: {
    name: "Claude Desktop",
    config: {
      mcpServers: {
        "glm-image-mcp": {
          command: "npx",
          args: ["glm-image-mcp"],
          env: {
            "OPENROUTER_API_KEY": "your-openrouter-api-key-here",
            "OPENROUTER_MODEL": "x-ai/grok-4-fast:free",
            "GEMINI_API_KEY": "your-gemini-api-key-here",
            "GEMINI_MODEL": "gemini-2.5-pro"
          }
        }
      }
    }
  },

  // GLM 4.6 configuration
  glm46: {
    name: "GLM 4.6",
    config: {
      mcpServers: {
        "glm-image-mcp": {
          command: "node",
          args: ["glm-image-mcp.js"],
          cwd: "/path/to/glm-image-mcp",
          env: {
            "OPENROUTER_API_KEY": "your-openrouter-api-key-here",
            "GEMINI_API_KEY": "your-gemini-api-key-here"
          }
        }
      }
    }
  },

  // Local development configuration
  localDev: {
    name: "Local Development",
    config: {
      mcpServers: {
        "glm-image-mcp": {
          command: "node",
          args: ["glm-image-mcp.js"],
          cwd: __dirname + "/..",
          env: {
            "OPENROUTER_API_KEY": process.env.OPENROUTER_API_KEY || "your-openrouter-api-key-here",
            "OPENROUTER_MODEL": "x-ai/grok-4-fast:free",
            "GEMINI_API_KEY": process.env.GEMINI_API_KEY || "your-gemini-api-key-here",
            "GEMINI_MODEL": "gemini-2.5-pro"
          }
        }
      }
    }
  },

  // Production configuration with fallbacks
  production: {
    name: "Production with Fallbacks",
    config: {
      mcpServers: {
        "glm-image-mcp": {
          command: "npx",
          args: ["glm-image-mcp@latest"],
          env: {
            "OPENROUTER_API_KEY": process.env.OPENROUTER_API_KEY,
            "OPENROUTER_MODEL": "anthropic/claude-3-sonnet",
            "GEMINI_API_KEY": process.env.GEMINI_API_KEY,
            "GEMINI_MODEL": "gemini-1.5-pro"
          }
        }
      }
    }
  }
};

// Provider-specific configurations
const providerConfigs = {
  openrouter: {
    name: "OpenRouter",
    description: "Multiple AI models with flexible pricing",
    models: {
      free: "x-ai/grok-4-fast:free",
      balanced: "anthropic/claude-3-sonnet",
      premium: "anthropic/claude-3-opus",
      vision: "openai/gpt-4-vision-preview"
    },
    setup: {
      apiKeyUrl: "https://openrouter.ai/keys",
      envVar: "OPENROUTER_API_KEY"
    }
  },

  gemini: {
    name: "Google Gemini",
    description: "Fast and reliable vision models",
    models: {
      fast: "gemini-1.5-flash",
      pro: "gemini-2.5-pro",
      latest: "gemini-1.5-pro"
    },
    setup: {
      apiKeyUrl: "https://aistudio.google.com/app/apikey",
      envVar: "GEMINI_API_KEY"
    }
  }
};

/**
 * Generate configuration file for specific client
 * @param {string} clientType - Type of client (claude, glm, local, production)
 */
function generateConfig(clientType) {
  const config = configurations[clientType];
  if (!config) {
    console.error(`❌ Unknown client type: ${clientType}`);
    console.log('Available types:', Object.keys(configurations).join(', '));
    return;
  }

  const configPath = `./examples/config-${clientType}.json`;
  fs.writeFileSync(configPath, JSON.stringify(config.config, null, 2));
  
  console.log(`✅ Configuration generated: ${configPath}`);
  console.log(`📋 Client: ${config.name}`);
  console.log(`🔧 Usage: Copy the configuration to your MCP client settings`);
}

/**
 * Show provider comparison
 */
function showProviderComparison() {
  console.log('\n🎯 Provider Comparison');
  console.log('=' .repeat(50));
  
  Object.entries(providerConfigs).forEach(([key, provider]) => {
    console.log(`\n📊 ${provider.name}`);
    console.log(`   Description: ${provider.description}`);
    console.log(`   API Key: ${provider.setup.envVar}`);
    console.log(`   Setup: ${provider.setup.apiKeyUrl}`);
    console.log(`   Models:`);
    
    Object.entries(provider.models).forEach(([type, model]) => {
      console.log(`     ${type}: ${model}`);
    });
  });
}

/**
 * Show setup instructions
 */
function showSetupInstructions() {
  console.log(`
🚀 Multi-Provider Setup Instructions

1️⃣  Choose Your Providers:
   • OpenRouter: Multiple models, including free options
   • Google Gemini: Fast, reliable vision models

2️⃣  Get API Keys:
   • OpenRouter: https://openrouter.ai/keys
   • Google Gemini: https://aistudio.google.com/app/apikey

3️⃣  Set Environment Variables:
   export OPENROUTER_API_KEY="your-openrouter-key"
   export GEMINI_API_KEY="your-gemini-key"

4️⃣  Configure MCP Client:
   Choose your client type and generate configuration:
   node examples/multi-provider-config.js claude
   node examples/multi-provider-config.js glm
   node examples/multi-provider-config.js local
   node examples/multi-provider-config.js production

5️⃣  Test Configuration:
   node examples/basic-analysis.js

💡 Tips:
• Set both API keys for automatic fallback
• Use free models for testing (x-ai/grok-4-fast:free)
• Choose models based on your needs (speed vs accuracy)
• Keep API keys secure and never commit them to git
`);
}

/**
 * Validate current environment setup
 */
function validateSetup() {
  console.log('\n🔍 Environment Validation');
  console.log('=' .repeat(30));
  
  const checks = [
    {
      name: 'Node.js',
      check: () => {
        const version = process.version;
        const major = parseInt(version.slice(1).split('.')[0]);
        return major >= 14;
      },
      message: 'Node.js >= 14.0.0 required'
    },
    {
      name: 'OpenRouter API Key',
      check: () => !!process.env.OPENROUTER_API_KEY,
      message: 'Set OPENROUTER_API_KEY environment variable'
    },
    {
      name: 'Gemini API Key',
      check: () => !!process.env.GEMINI_API_KEY,
      message: 'Set GEMINI_API_KEY environment variable'
    },
    {
      name: 'MCP Server File',
      check: () => fs.existsSync('../glm-image-mcp.js'),
      message: 'glm-image-mcp.js should be in parent directory'
    }
  ];
  
  let allPassed = true;
  
  checks.forEach(({ name, check, message }) => {
    const passed = check();
    const status = passed ? '✅' : '❌';
    console.log(`${status} ${name}: ${passed ? 'OK' : message}`);
    if (!passed) allPassed = false;
  });
  
  if (allPassed) {
    console.log('\n🎉 All checks passed! Ready to use GLM Image MCP Server.');
  } else {
    console.log('\n⚠️  Some checks failed. Please fix the issues above.');
  }
}

/**
 * Show usage examples
 */
function showUsageExamples() {
  console.log(`
📚 Usage Examples

1️⃣  Generate Configuration:
   node examples/multi-provider-config.js claude
   node examples/multi-provider-config.js glm
   node examples/multi-provider-config.js local
   node examples/multi-provider-config.js production

2️⃣  Compare Providers:
   node examples/multi-provider-config.js --compare

3️⃣  Validate Setup:
   node examples/multi-provider-config.js --validate

4️⃣  Show Setup Instructions:
   node examples/multi-provider-config.js --help

5️⃣  Test with Examples:
   node examples/basic-analysis.js

🔧 Configuration Files Generated:
   ./examples/config-claude.json     - Claude Desktop
   ./examples/config-glm.json        - GLM 4.6
   ./examples/config-local.json      - Local Development
   ./examples/config-production.json - Production
`);
}

// Command line interface
const args = process.argv.slice(2);
const command = args[0];

switch (command) {
  case 'claude':
  case 'glm':
  case 'local':
  case 'production':
    generateConfig(command);
    break;
    
  case '--compare':
    showProviderComparison();
    break;
    
  case '--validate':
    validateSetup();
    break;
    
  case '--help':
  case '-h':
    showSetupInstructions();
    showUsageExamples();
    break;
    
  default:
    console.log('🔧 GLM Image MCP Server - Multi-Provider Configuration');
    console.log('\nUsage:');
    console.log('  node examples/multi-provider-config.js <type>');
    console.log('  node examples/multi-provider-config.js --compare');
    console.log('  node examples/multi-provider-config.js --validate');
    console.log('  node examples/multi-provider-config.js --help');
    console.log('\nTypes:', Object.keys(configurations).join(', '));
    break;
}

module.exports = {
  configurations,
  providerConfigs,
  generateConfig,
  showProviderComparison,
  validateSetup
};