# GLM Image MCP Server

🚀 **Enhanced Model Context Protocol (MCP) server for focused image analysis using OpenRouter and Google Gemini vision models**

[![npm version](https://badge.fury.io/js/glm-image-mcp.svg)](https://badge.fury.io/js/glm-image-mcp)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![Node.js Version](https://img.shields.io/badge/node-%3E%3D14.0.0-brightgreen)](https://nodejs.org/)
[![MCP Compatible](https://img.shields.io/badge/MCP-Compatible-blue)](https://modelcontextprotocol.io/)

## ✨ Features

### 🎯 Multi-Provider Support
- **OpenRouter**: Access to multiple vision models including x-ai/grok-4-fast:free, Claude, and more
- **Google Gemini**: Direct access to Gemini 1.5 Pro and Flash models
- **Flexible Switching**: Choose provider per request or set environment defaults
- **Auto-Detection**: Automatically detects available API keys and selects the best provider

### 🔧 Advanced Image Analysis
- **Basic Analysis**: Analyze entire images with customizable prompts
- **Focused Analysis**: Analyze specific aspects (text, faces, objects, colors, layout)
- **Smart Validation**: Robust parameter and image validation with security checks
- **Error Handling**: Comprehensive error reporting and graceful fallbacks

### 🚀 Performance & Security
- **Fast Processing**: Optimized for quick image analysis
- **Memory Efficient**: Handles large images without memory leaks
- **Security First**: Input validation and sanitization against malicious content
- **Cross-Platform**: Works on Windows, macOS, and Linux

## 📁 Project Structure

```
glm-image-mcp/
├── glm-image-mcp.js                    # Main MCP server ⭐
├── package.json                        # Package configuration
├── README.md                          # This file
├── LICENSE                            # MIT License
├── .gitignore                         # Git ignore rules
├── .github/
│   └── workflows/
│       └── test.yml                   # GitHub Actions workflow
├── utils/
│   └── validation.js                  # Input validation utilities
└── examples/
    ├── basic-analysis.js              # Basic usage examples
    └── multi-provider-config.js       # Multi-provider configuration
```

## 🚀 Quick Start

### Option 1: Install Directly from GitHub (Recommended)

```bash
# Install globally using npx (no npm publish needed)
npx github:QuickkApps/GLM-Image-MCP

# Or install globally using git
npm install -g git+https://github.com/QuickkApps/GLM-Image-MCP.git

# Or install locally
npm install git+https://github.com/QuickkApps/GLM-Image-MCP.git
```

### Option 2: Clone from GitHub

```bash
git clone https://github.com/QuickkApps/GLM-Image-MCP.git
cd GLM-Image-MCP
npm install
```

### Option 3: Use directly from GitHub (npx)

```bash
npx github:QuickkApps/GLM-Image-MCP
```

## 🔧 Configuration

### 1. Set API Keys

Choose one or both providers:

```bash
# For OpenRouter (recommended for model variety)
export OPENROUTER_API_KEY="your-openrouter-api-key"
export OPENROUTER_MODEL="x-ai/grok-4-fast:free"

# For Google Gemini (fast and reliable)
export GEMINI_API_KEY="your-gemini-api-key"
export GEMINI_MODEL="gemini-2.5-pro"
```

### 2. MCP Client Configuration

Configure your MCP client (like Claude Desktop, GLM, or any MCP-compatible IDE):

```json
{
  "mcpServers": {
    "image-analyzer": {
      "command": "npx",
      "args": ["github:QuickkApps/GLM-Image-MCP"],
      "env": {
        "OPENROUTER_API_KEY": "your-openrouter-key",
        "OPENROUTER_MODEL": "x-ai/grok-4-fast:free",
        "GEMINI_API_KEY": "your-gemini-key",
        "GEMINI_MODEL": "gemini-2.5-pro"
      }
    }
  }
}
```

### 4. Model Configuration

You can set custom models via environment variables:

```bash
# For OpenRouter models
export OPENROUTER_MODEL="anthropic/claude-3-sonnet"
export OPENROUTER_MODEL="openai/gpt-4-vision-preview"
export OPENROUTER_MODEL="x-ai/grok-4-fast:free"

# For Google Gemini models
export GEMINI_MODEL="gemini-1.5-flash"
export GEMINI_MODEL="gemini-2.5-pro"
export GEMINI_MODEL="gemini-1.5-pro"

# Use with npx
OPENROUTER_MODEL="anthropic/claude-3-sonnet" npx github:QuickkApps/GLM-Image-MCP
GEMINI_MODEL="gemini-1.5-flash" npx github:QuickkApps/GLM-Image-MCP
```

### 3. Local Development Configuration

For local development:

```json
{
  "mcpServers": {
    "image-analyzer": {
      "command": "node",
      "args": ["glm-image-mcp.js"],
      "cwd": "/path/to/glm-image-mcp",
      "env": {
        "OPENROUTER_API_KEY": "your-openrouter-key",
        "GEMINI_API_KEY": "your-gemini-key"
      }
    }
  }
}
```

## 🛠️ Available Tools

### `analyze_image` - Comprehensive Image Analysis
Analyze images with provider and model selection.

**Parameters:**
- `image_path` (string, required): Path to image file
- `prompt` (string, required): Analysis prompt
- `provider` (string, optional): "openrouter" or "gemini" (auto-detects if not specified)
- `model` (string, optional): Specific model to use (overrides environment default)

### `describe_image` - Quick Image Description
Describe an image in detail with a default descriptive prompt.

**Parameters:**
- `image_path` (string, required): Path to image file
- `prompt` (string, optional): Custom prompt (uses default if not provided)
- `provider` (string, optional): "openrouter" or "gemini"
- `model` (string, optional): Specific model to use

### `focused_analyze_image` - Focused Analysis
Analyze specific aspects of an image with focused prompts.

**Parameters:**
- `image_path` (string, required): Path to image file
- `focus_area` (string, optional): Specific area ("text", "faces", "objects", "colors", "layout")
- `prompt` (string, optional): Custom focused analysis prompt
- `provider` (string, optional): "openrouter" or "gemini"
- `model` (string, optional): Specific model to use

## 📊 Usage Examples

### Basic Analysis with Auto-Detection
```json
{
  "image_path": "/path/to/image.jpg",
  "prompt": "Describe what you see in this image"
  // Automatically detects available provider
}
```

### OpenRouter with Specific Model
```json
{
  "image_path": "/path/to/image.jpg",
  "prompt": "Analyze this image in detail",
  "provider": "openrouter",
  "model": "anthropic/claude-3-sonnet"
}
```

### Gemini for Fast Analysis
```json
{
  "image_path": "/path/to/image.jpg",
  "prompt": "What objects do you see in this image?",
  "provider": "gemini",
  "model": "gemini-1.5-flash"
}
```

### Focused Analysis
```json
{
  "image_path": "/path/to/document.jpg",
  "focus_area": "text",
  "provider": "gemini"
}
```

### Custom Focused Analysis
```json
{
  "image_path": "/path/to/chart.jpg",
  "prompt": "Extract all data points and trends from this chart",
  "provider": "openrouter",
  "model": "x-ai/grok-4-fast:free"
}
```

## 🎯 Provider Comparison

| Feature | OpenRouter | Google Gemini |
|---------|-------------|---------------|
| **Model Variety** | 50+ vision models | Gemini 1.5 Pro/Flash |
| **Speed** | Fast | Very Fast |
| **Cost** | Variable (per model) | Competitive |
| **Accuracy** | High | Excellent |
| **Best For** | Model flexibility | Speed & consistency |
| **Free Models** | Yes (grok-4-fast) | Limited quota |

## 🔧 API Key Setup

### OpenRouter API Key
1. Visit [OpenRouter.ai](https://openrouter.ai/)
2. Sign up and get your API key
3. Set environment variable: `export OPENROUTER_API_KEY="your-key"`

### Google Gemini API Key
1. Visit [Google AI Studio](https://aistudio.google.com/)
2. Create a new API key
3. Set environment variable: `export GEMINI_API_KEY="your-key"`

## 🧪 Testing

### Quick Test
```bash
# Test installation
npx glm-image-mcp --help

# Test with sample image (if you have one)
node examples/basic-analysis.js
```

### Integration Test
```bash
# Clone and test locally
git clone https://github.com/your-username/glm-image-mcp.git
cd glm-image-mcp
npm install
npm test
```

## 🔄 Model Selection Priority

1. **Request `model` parameter**: Overrides all environment defaults
2. **Request `provider` only**: Uses that provider's default model
3. **No parameters**: Auto-detects provider based on available API keys
4. **Environment variables**: Set defaults when no request parameters provided

## 🚨 Troubleshooting

### Common Issues

**Server Won't Start**
```bash
# Check Node.js version
node --version  # Should be >= 14.0.0

# Check dependencies
npm install

# Test syntax
node -c glm-image-mcp.js
```

**API Key Issues**
```
Error: No API keys found. Please set either GEMINI_API_KEY or OPENROUTER_API_KEY
```
*Solution*: Set the correct environment variables

**Invalid Provider**
```
Error: Invalid provider: invalid_provider
```
*Solution*: Use "openrouter" or "gemini"

**Image File Issues**
```
Error: Image file not found: /path/to/image.jpg
```
*Solution*: Verify the file path and that the file exists

**Unsupported Format**
```
Error: Unsupported image format: .gif. Supported formats: .jpg, .jpeg, .png, .webp, .bmp, .tiff
```
*Solution*: Convert image to supported format

## 🔒 Security Features

- ✅ API keys are never logged or exposed
- ✅ Input validation prevents malicious content
- ✅ Image buffers are validated for format and size
- ✅ File size limits (50MB max)
- ✅ Path traversal protection
- ✅ Comprehensive error handling

## 📈 Performance

| Metric | Value |
|--------|-------|
| **Startup Time** | < 2 seconds |
| **Analysis Time** | 3-10 seconds (depends on image size and model) |
| **Memory Usage** | ~50MB base + image size |
| **Supported Formats** | JPEG, PNG, WebP, BMP, TIFF |
| **Max File Size** | 50MB |

## 🤝 Integration with MCP Clients

This MCP server works seamlessly with any MCP-compatible client:

### Claude Desktop
```json
{
  "mcpServers": {
    "image-analyzer": {
      "command": "npx",
      "args": ["glm-image-mcp"]
    }
  }
}
```

### GLM 4.6
1. Configure MCP settings in your GLM 4.6 interface
2. Select provider per request or set defaults
3. Choose model based on your needs
4. Receive text responses optimized for GLM 4.6 processing

### Other MCP Clients
Any MCP-compatible client can use this server with the standard configuration format.

## 📦 Dependencies

- **@modelcontextprotocol/sdk** (^1.19.1) - MCP framework
- **node-fetch** (^2.6.7) - HTTP requests
- **sharp** (^0.33.0) - Image processing (optional, for enhanced validation)

## 🚀 Deployment Options

### 1. npm Package (Recommended)
```bash
npm install -g glm-image-mcp
glm-image-mcp
```

### 2. Direct from GitHub
```bash
npx github:QuickkApps/GLM-Image-MCP

# With custom model
OPENROUTER_MODEL="anthropic/claude-3-sonnet" npx github:QuickkApps/GLM-Image-MCP
GEMINI_MODEL="gemini-1.5-flash" npx github:QuickkApps/GLM-Image-MCP
```

### 3. Docker (Coming Soon)
```bash
docker run -e OPENROUTER_API_KEY=your-key glm-image-mcp
```

### 4. GitHub Actions
Use in CI/CD pipelines with GitHub Actions workflow included.

## 🤝 Contributing

We welcome contributions! Please see our [Contributing Guidelines](CONTRIBUTING.md) for details.

### Development Setup
```bash
git clone https://github.com/your-username/glm-image-mcp.git
cd glm-image-mcp
npm install
npm test
```

### Pull Request Process
1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- [Model Context Protocol](https://modelcontextprotocol.io/) for the MCP framework
- [OpenRouter](https://openrouter.ai/) for providing access to multiple AI models
- [Google Gemini](https://ai.google.dev/) for the powerful vision API
- The MCP community for feedback and contributions

## 📞 Support

- 💬 Discord: [arshagor190](https://discord.com/users/arshagor190)
- 🐛 Issues: [GitHub Issues](https://github.com/QuickkApps/GLM-Image-MCP/issues)
- 💬 Discussions: [GitHub Discussions](https://github.com/QuickkApps/GLM-Image-MCP/discussions)

---

**🚀 Simple, reliable, and powerful image analysis for the MCP ecosystem**

Made with ❤️ by [QuicKK Apps]