# Enhanced Multi-Provider Image Analysis MCP Server

A powerful Model Context Protocol (MCP) server that provides advanced image analysis capabilities using both OpenRouter and Google Gemini vision models. This server supports focused region detection, detailed analysis, and multi-provider switching.

## Features

- **Multi-Provider Support**: Choose between OpenRouter and Google Gemini
- **Focused Analysis**: Intelligent region detection and targeted analysis
- **Hybrid Mode**: Combine focused and full-image analysis
- **Backward Compatibility**: Works with existing OpenRouter configurations
- **Advanced Error Handling**: Robust error recovery and retry logic
- **Performance Optimization**: Concurrent processing with rate limiting

## Installation

```bash
npm install
```

## Configuration

### Environment Variables

Configure one or both providers:

#### OpenRouter Configuration
```bash
export OPENROUTER_API_KEY="your-openrouter-api-key"
export OPENROUTER_MODEL="x-ai/grok-4-fast:free"  # Optional
```

#### Google Gemini Configuration
```bash
export GEMINI_API_KEY="your-gemini-api-key"
export GEMINI_MODEL="gemini-1.5-flash"  # Optional
```

### Quick Start

1. **Set up environment variables** for your preferred provider(s)
2. **Start the server**:
   ```bash
   node openrouter-image-mcp-enhanced.js
   ```
3. **Configure your MCP client** (like GLM 4.6) to connect to the server

## Available Tools

### 1. `analyze_image`
Basic image analysis with provider selection.

**Parameters:**
- `image_path` (string, required): Path to the image file
- `prompt` (string, required): What to analyze about the image
- `provider` (string, optional): "openrouter" or "gemini" (default: "openrouter")

**Example:**
```json
{
  "image_path": "/path/to/image.jpg",
  "prompt": "Describe what you see in this image",
  "provider": "gemini"
}
```

### 2. `focused_analyze_image`
Advanced analysis with region detection and multiple analysis modes.

**Parameters:**
- `image_path` (string, required): Path to the image file
- `prompt` (string, required): What to analyze about the image
- `provider` (string, optional): "openrouter" or "gemini" (default: "openrouter")
- `analysis_mode` (string, optional): "focused", "hybrid", or "full" (default: "focused")
- `max_regions` (integer, optional): Maximum regions to analyze (default: 5, max: 10)
- `min_confidence` (number, optional): Minimum confidence threshold (default: 0.7, range: 0.1-1.0)

**Analysis Modes:**
- **focused**: Analyze only detected regions of interest
- **hybrid**: Analyze regions + full image for comprehensive results
- **full**: Skip region detection, analyze entire image

**Example:**
```json
{
  "image_path": "/path/to/medical-image.jpg",
  "prompt": "Analyze this medical image for anomalies",
  "provider": "gemini",
  "analysis_mode": "hybrid",
  "max_regions": 5,
  "min_confidence": 0.8
}
```

## Provider Comparison

| Feature | OpenRouter | Google Gemini |
|---------|------------|---------------|
| Model Variety | ✅ Multiple models available | ✅ Flash & Pro models |
| Speed | ⚡ Fast | ⚡ Very Fast |
| Cost | 💰 Variable | 💰 Lower cost |
| Analysis Quality | 🔥 Excellent | 🔥 Excellent |
| Rate Limits | 📊 Provider-dependent | 📊 Generous |

## Usage Examples

### Basic Analysis with Different Providers

**OpenRouter:**
```json
{
  "tool": "analyze_image",
  "arguments": {
    "image_path": "/path/to/technical-diagram.jpg",
    "prompt": "Explain this technical diagram",
    "provider": "openrouter"
  }
}
```

**Gemini:**
```json
{
  "tool": "analyze_image",
  "arguments": {
    "image_path": "/path/to/artwork.jpg",
    "prompt": "Analyze this artistic composition",
    "provider": "gemini"
  }
}
```

### Advanced Focused Analysis

**Medical Image Analysis:**
```json
{
  "tool": "focused_analyze_image",
  "arguments": {
    "image_path": "/path/to/xray.jpg",
    "prompt": "Identify potential medical issues in this X-ray",
    "provider": "gemini",
    "analysis_mode": "focused",
    "max_regions": 3,
    "min_confidence": 0.9
  }
}
```

**Technical Documentation:**
```json
{
  "tool": "focused_analyze_image",
  "arguments": {
    "image_path": "/path/to/schematic.jpg",
    "prompt": "Extract and explain all technical components",
    "provider": "openrouter",
    "analysis_mode": "hybrid",
    "max_regions": 8,
    "min_confidence": 0.7
  }
}
```

## Response Format

### Basic Analysis Response
```json
{
  "content": [
    {
      "type": "text",
      "text": "Detailed analysis of the image..."
    }
  ]
}
```

### Focused Analysis Response
```json
{
  "content": [
    {
      "type": "text",
      "text": "{\n  \"analysisType\": \"focused\",\n  \"regions\": [...],\n  \"metadata\": {...}\n}"
    }
  ]
}
```

## Supported Image Formats

- JPEG (.jpg, .jpeg)
- PNG (.png)
- WebP (.webp)
- BMP (.bmp)
- TIFF (.tiff)

Maximum file size: 50MB

## Error Handling

The server provides comprehensive error handling:

- **Validation Errors**: Invalid parameters or file formats
- **API Errors**: Provider-specific issues with retry logic
- **Network Errors**: Timeout handling with exponential backoff
- **Processing Errors**: Graceful fallbacks when region detection fails

## Performance Considerations

- **Concurrent Processing**: Up to 3 regions analyzed simultaneously
- **Rate Limiting**: Built-in delays to respect provider limits
- **Memory Management**: Efficient buffer handling for large images
- **Timeout Protection**: Configurable timeouts for all API calls

## MCP Client Configuration

Example configuration for GLM 4.6 or similar MCP clients:

```json
{
  "mcpServers": {
    "image-analyzer": {
      "command": "node",
