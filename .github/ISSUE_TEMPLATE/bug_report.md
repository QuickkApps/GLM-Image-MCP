---
name: Bug Report
about: Create a report to help us improve
title: '[BUG] '
labels: bug
assignees: ''

---

## 🐛 Bug Description
A clear and concise description of what the bug is.

## 🔄 Reproduction Steps
Steps to reproduce the behavior:
1. Go to '...'
2. Click on '....'
3. Scroll down to '....'
4. See error

## 🎯 Expected Behavior
A clear and concise description of what you expected to happen.

## 📸 Current Behavior
A clear and concise description of what actually happened.

## 🖼️ Screenshots
If applicable, add screenshots to help explain your problem.

## 🖥️ Environment
**Please complete the following information:**
- **OS**: [e.g. Windows 10, macOS 12.0, Ubuntu 20.04]
- **Node.js version**: [e.g. 16.14.0]
- **Package version**: [e.g. 2.1.0]
- **MCP Client**: [e.g. Claude Desktop, GLM 4.6, Other]

## 🔧 Configuration
**Please provide your MCP configuration:**
```json
{
  "mcpServers": {
    "image-analyzer": {
      "command": "...",
      "args": [...],
      "env": {
        "OPENROUTER_API_KEY": "***",
        "GEMINI_API_KEY": "***"
      }
    }
  }
}
```

## 📋 Command Used
**Please provide the exact command/tool call that caused the issue:**
```json
{
  "tool": "analyze_image",
  "arguments": {
    "image_path": "...",
    "prompt": "...",
    "provider": "...",
    "model": "..."
  }
}
```

## 📝 Error Messages
**Please copy and paste any error messages:**
```
Paste error messages here
```

## 📎 Additional Context
Add any other context about the problem here.

## 🔍 Debug Information
**Please run the following commands and provide the output:**
```bash
# Node.js version
node --version

# npm version
npm --version

# Test MCP server syntax
node -c glm-image-mcp.js

# Check if image file exists and is readable
ls -la /path/to/your/image.jpg
```

## ✅ Checklist
- [ ] I have searched existing issues for similar problems
- [ ] I have provided all requested information
- [ ] I have included relevant error messages
- [ ] I have included my configuration (with API keys redacted)
- [ ] I have included steps to reproduce the issue