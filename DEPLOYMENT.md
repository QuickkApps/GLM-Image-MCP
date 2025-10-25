# 🚀 GLM Image MCP Server - Deployment Guide

This guide provides comprehensive instructions for deploying GLM Image MCP Server to GitHub and using it directly from the repository.

## 📋 Table of Contents

1. [GitHub Repository Setup](#github-repository-setup)
2. [Direct GitHub Usage](#direct-github-usage)
3. [npm Package Publishing](#npm-package-publishing)
4. [Docker Deployment](#docker-deployment)
5. [CI/CD Pipeline](#cicd-pipeline)
6. [Configuration Management](#configuration-management)

## 🐙 GitHub Repository Setup

### 1. Create GitHub Repository

1. **Go to GitHub**: [github.com](https://github.com)
2. **Click "New repository"**
3. **Repository name**: `glm-image-mcp`
4. **Description**: `Enhanced MCP server for focused image analysis using OpenRouter and Google Gemini vision models`
5. **Visibility**: Public (recommended) or Private
6. **Initialize with**: README (skip, we have one)
7. **Click "Create repository"**

### 2. Add Remote and Push

```bash
# Add your GitHub repository as remote
git remote add origin https://github.com/your-username/glm-image-mcp.git

# Push to GitHub
git push -u origin main
```

### 3. Configure Repository Settings

#### Repository Metadata
- **Description**: Enhanced MCP server for focused image analysis
- **Website**: `https://kilocode.ai`
- **Topics**: `mcp`, `image-analysis`, `ai`, `vision`, `openrouter`, `gemini`

#### Branch Protection
1. Go to Settings → Branches
2. Add rule for `main` branch
3. Require pull request reviews
4. Require status checks to pass
5. Include `test` and `lint` checks

#### GitHub Pages (Optional)
1. Go to Settings → Pages
2. Source: Deploy from a branch
3. Branch: `main` and `/ (root)`
4. This will serve your README.md as a website

## ⚡ Direct GitHub Usage

Users can use your MCP server directly from GitHub without cloning:

### Method 1: npx (Recommended)

```bash
# Use directly from npm registry (after publishing)
npx glm-image-mcp

# Or use directly from GitHub (development)
npx github:your-username/glm-image-mcp
```

### Method 2: GitHub Raw Files

```bash
# Download and run directly
curl -O https://raw.githubusercontent.com/your-username/glm-image-mcp/main/glm-image-mcp.js
npm install @modelcontextprotocol/sdk node-fetch sharp
node glm-image-mcp.js
```

### Method 3: GitHub CLI

```bash
# Clone and run
gh repo clone your-username/glm-image-mcp
cd glm-image-mcp
npm install
node glm-image-mcp.js
```

## 📦 npm Package Publishing

### 1. Prepare for Publishing

```bash
# Test the package
npm test

# Dry run to check package
npm pack --dry-run

# Build the package
npm pack
```

### 2. Publish to npm

```bash
# Login to npm
npm login

# Publish the package
npm publish

# Or publish with access token
npm publish --access public
```

### 3. Verify Publication

```bash
# Check if package is available
npm view glm-image-mcp

# Test installation
npm install -g glm-image-mcp
glm-image-mcp --help
```

### 4. Version Management

```bash
# Update version
npm version patch  # 2.1.0 -> 2.1.1
npm version minor  # 2.1.0 -> 2.2.0
npm version major  # 2.1.0 -> 3.0.0

# Publish new version
npm publish
git push --tags
```

## 🐳 Docker Deployment

### 1. Create Dockerfile

```dockerfile
FROM node:18-alpine

WORKDIR /app

# Copy package files
COPY package*.json ./

# Install dependencies
RUN npm ci --only=production

# Copy source code
COPY . .

# Create non-root user
RUN addgroup -g 1001 -S nodejs
RUN adduser -S mcpuser -u 1001

USER mcpuser

# Expose port (if needed)
EXPOSE 3000

# Start the server
CMD ["node", "glm-image-mcp.js"]
```

### 2. Build and Push Docker Image

```bash
# Build image
docker build -t glm-image-mcp:latest .

# Tag for Docker Hub
docker tag glm-image-mcp:latest your-username/glm-image-mcp:latest

# Push to Docker Hub
docker push your-username/glm-image-mcp:latest
```

### 3. Use Docker Image

```bash
# Pull and run
docker run -e OPENROUTER_API_KEY=your-key your-username/glm-image-mcp

# Or with docker-compose
version: '3.8'
services:
  glm-image-mcp:
    image: your-username/glm-image-mcp:latest
    environment:
      - OPENROUTER_API_KEY=${OPENROUTER_API_KEY}
      - GEMINI_API_KEY=${GEMINI_API_KEY}
    volumes:
      - ./images:/app/images
```

## 🔄 CI/CD Pipeline

### GitHub Actions Workflow

Your repository already includes a comprehensive GitHub Actions workflow (`.github/workflows/test.yml`) that:

- ✅ Tests on multiple Node.js versions
- ✅ Validates syntax and package structure
- ✅ Runs security audits
- ✅ Creates distribution packages
- ✅ Checks for sensitive data

### Automated Publishing

Create `.github/workflows/publish.yml` for automated npm publishing:

```yaml
name: Publish to npm

on:
  push:
    tags:
      - 'v*'

jobs:
  publish:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: '18'
          registry-url: 'https://registry.npmjs.org'
      - run: npm ci
      - run: npm publish
        env:
          NODE_AUTH_TOKEN: ${{ secrets.NPM_TOKEN }}
```

### Setup Secrets

1. Go to repository Settings → Secrets and variables → Actions
2. Add `NPM_TOKEN` with your npm automation token
3. Add `DOCKER_HUB_TOKEN` for Docker publishing

## ⚙️ Configuration Management

### Environment Variables

Create `.env.example` for users:

```bash
# OpenRouter Configuration
OPENROUTER_API_KEY=your-openrouter-api-key
OPENROUTER_MODEL=x-ai/grok-4-fast:free

# Google Gemini Configuration
GEMINI_API_KEY=your-gemini-api-key
GEMINI_MODEL=gemini-2.5-pro

# Server Configuration
NODE_ENV=production
LOG_LEVEL=info
MAX_FILE_SIZE=50MB
```

### Configuration Files

Provide multiple configuration examples:

#### Claude Desktop (`config-claude.json`)
```json
{
  "mcpServers": {
    "image-analyzer": {
      "command": "npx",
      "args": ["glm-image-mcp"],
      "env": {
        "OPENROUTER_API_KEY": "${OPENROUTER_API_KEY}",
        "GEMINI_API_KEY": "${GEMINI_API_KEY}"
      }
    }
  }
}
```

#### GLM 4.6 (`config-glm.json`)
```json
{
  "mcpServers": {
    "image-analyzer": {
      "command": "node",
      "args": ["glm-image-mcp.js"],
      "cwd": "/path/to/glm-image-mcp",
      "env": {
        "OPENROUTER_API_KEY": "${OPENROUTER_API_KEY}",
        "GEMINI_API_KEY": "${GEMINI_API_KEY}"
      }
    }
  }
}
```

## 📊 Monitoring and Analytics

### GitHub Analytics

1. Go to repository Insights → Traffic
2. Monitor clones and visitors
3. Track popular content

### npm Analytics

1. Go to [npmjs.com](https://www.npmjs.com) → your account
2. Check download statistics
3. Monitor package usage

### Error Tracking

Consider integrating error tracking:

```javascript
// In glm-image-mcp.js
if (process.env.NODE_ENV === 'production') {
  // Add error tracking service
  process.on('uncaughtException', (error) => {
    console.error('Uncaught exception:', error);
    // Send to error tracking service
  });
}
```

## 🔒 Security Considerations

### API Key Management

1. **Never commit API keys** to repository
2. **Use environment variables** for configuration
3. **Rotate keys regularly**
4. **Use read-only keys** when possible

### Dependency Security

```bash
# Audit dependencies
npm audit

# Fix vulnerabilities
npm audit fix

# Check for outdated packages
npm outdated
```

### Code Scanning

Enable GitHub Advanced Security:
1. Go to Settings → Security & analysis
2. Enable Code scanning
3. Enable Dependabot alerts
4. Enable Secret scanning

## 🚀 Performance Optimization

### Bundle Size

```bash
# Check bundle size
npm pack
ls -lh *.tgz

# Analyze dependencies
npm ls --depth=0
```

### Caching

Consider implementing response caching for repeated analyses:

```javascript
// Simple cache implementation
const cache = new Map();

function getCachedResponse(key) {
  return cache.get(key);
}

function setCachedResponse(key, value) {
  cache.set(key, value);
  // Clear cache after 1 hour
  setTimeout(() => cache.delete(key), 3600000);
}
```

## 📝 Release Process

### Automated Release

1. **Update version**: `npm version patch/minor/major`
2. **Push tag**: `git push --tags`
3. **GitHub Actions**: Automatically publishes to npm
4. **Create Release**: GitHub creates release from tag

### Manual Release

1. **Create tag**: `git tag v2.1.1`
2. **Push tag**: `git push origin v2.1.1`
3. **Create Release**: GitHub UI → Create new release
4. **Publish**: `npm publish`

## 🤝 Community Management

### Issues and PRs

1. **Review issues** regularly
2. **Label issues** for better organization
3. **Welcome contributors** with helpful responses
4. **Maintain documentation** with latest changes

### Communication

1. **GitHub Discussions** for questions
2. **Issues** for bug reports
3. **PRs** for contributions
4. **Releases** for announcements

## 📚 Additional Resources

### Documentation

- [Model Context Protocol](https://modelcontextprotocol.io/)
- [OpenRouter API](https://openrouter.ai/docs)
- [Google Gemini API](https://ai.google.dev/docs)

### Tools

- [GitHub CLI](https://cli.github.com/)
- [npm CLI](https://docs.npmjs.com/cli/v8)
- [Docker](https://docs.docker.com/)

---

## 🎉 Success!

Your GLM Image MCP Server is now deployed and ready for use! Users can:

1. **Install from npm**: `npm install -g glm-image-mcp`
2. **Use directly**: `npx glm-image-mcp`
3. **Clone from GitHub**: `git clone https://github.com/your-username/glm-image-mcp.git`
4. **Configure MCP clients** with provided examples

**Made with ❤️ by [QuicKK Apps]**