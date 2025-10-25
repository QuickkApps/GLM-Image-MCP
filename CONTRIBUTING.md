# Contributing to GLM Image MCP Server

Thank you for your interest in contributing to GLM Image MCP Server! This document provides guidelines and information for contributors.

## 🤝 How to Contribute

### Reporting Bugs

1. **Search existing issues** first to avoid duplicates
2. **Use the bug report template** when creating new issues
3. **Provide detailed information**:
   - Node.js version
   - Operating system
   - Steps to reproduce
   - Expected vs actual behavior
   - Error messages and logs

### Suggesting Features

1. **Check existing feature requests** and issues
2. **Use the feature request template**
3. **Provide clear description** of the feature
4. **Explain the use case** and why it's valuable
5. **Consider implementation details** if you have ideas

### Code Contributions

#### Prerequisites

- Node.js >= 14.0.0
- Git
- Basic knowledge of JavaScript/Node.js
- Familiarity with MCP (Model Context Protocol)

#### Setup Development Environment

1. **Fork the repository**
   ```bash
   # Fork on GitHub, then clone your fork
   git clone https://github.com/your-username/glm-image-mcp.git
   cd glm-image-mcp
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   ```bash
   # Copy example environment file
   cp .env.example .env
   
   # Edit .env with your API keys
   # OPENROUTER_API_KEY=your_key_here
   # GEMINI_API_KEY=your_key_here
   ```

4. **Run tests**
   ```bash
   npm test
   ```

#### Making Changes

1. **Create a feature branch**
   ```bash
   git checkout -b feature/your-feature-name
   # or
   git checkout -b fix/your-bug-fix
   ```

2. **Make your changes**
   - Follow the existing code style
   - Add comments for complex logic
   - Update documentation if needed

3. **Test your changes**
   ```bash
   # Run existing tests
   npm test
   
   # Run linting
   npm run lint
   
   # Test manually with different configurations
   node glm-image-mcp.js
   ```

4. **Commit your changes**
   ```bash
   git add .
   git commit -m "feat: add new feature description"
   # or
   git commit -m "fix: resolve bug description"
   ```

5. **Push to your fork**
   ```bash
   git push origin feature/your-feature-name
   ```

6. **Create a Pull Request**
   - Use descriptive title
   - Reference related issues
   - Describe changes made
   - Include screenshots if applicable

## 📝 Code Style Guidelines

### JavaScript Standards

- Use **ES6+** features when appropriate
- Follow **camelCase** for variables and functions
- Use **PascalCase** for classes
- Add **JSDoc comments** for functions and classes
- Keep lines under **100 characters**
- Use **2 spaces** for indentation

### Example Code Style

```javascript
/**
 * Validates image analysis parameters
 * @param {Object} params - Input parameters
 * @param {string} params.image_path - Path to image file
 * @param {string} params.prompt - Analysis prompt
 * @returns {Object} - Validated parameters
 * @throws {Error} - If validation fails
 */
function validateAnalysisParams(params) {
  const { image_path, prompt } = params;
  
  if (!image_path) {
    throw new Error('image_path is required');
  }
  
  // Validate image exists
  if (!fs.existsSync(image_path)) {
    throw new Error(`Image file not found: ${image_path}`);
  }
  
  return { image_path, prompt: prompt.trim() };
}
```

## 🧪 Testing Guidelines

### Writing Tests

- **Unit tests** for individual functions
- **Integration tests** for API calls
- **Error handling tests** for edge cases
- **Performance tests** for critical paths

### Test Structure

```javascript
describe('ValidationUtils', () => {
  describe('validateImagePath', () => {
    it('should validate correct image path', () => {
      const result = validator.validateImagePath('./test-image.jpg');
      expect(result).toBe('./test-image.jpg');
    });
    
    it('should throw error for non-existent file', () => {
      expect(() => {
        validator.validateImagePath('./non-existent.jpg');
      }).toThrow('Image file not found');
    });
  });
});
```

### Running Tests

```bash
# Run all tests
npm test

# Run specific test file
npm test -- tests/validation.test.js

# Run tests with coverage
npm run test:coverage

# Run tests in watch mode
npm run test:watch
```

## 📚 Documentation Contributions

### Types of Documentation

- **README.md** - Main project documentation
- **API docs** - Function and class documentation
- **Examples** - Usage examples and tutorials
- **CHANGELOG.md** - Version history and changes

### Documentation Style

- Use **clear, concise language**
- Include **code examples** for complex features
- Add **screenshots** for visual features
- Keep **documentation up to date** with code changes

## 🏗️ Project Structure

```
glm-image-mcp/
├── glm-image-mcp.js          # Main MCP server
├── package.json              # Package configuration
├── README.md                 # Main documentation
├── LICENSE                   # MIT License
├── CONTRIBUTING.md           # This file
├── .gitignore               # Git ignore rules
├── .github/
│   ├── workflows/
│   │   └── test.yml         # CI/CD workflow
│   ├── ISSUE_TEMPLATE/
│   │   ├── bug_report.md    # Bug report template
│   │   └── feature_request.md # Feature request template
│   └── PULL_REQUEST_TEMPLATE.md # PR template
├── utils/
│   └── validation.js        # Validation utilities
├── tests/
│   ├── validation.test.js   # Validation tests
│   ├── integration.test.js   # Integration tests
│   └── fixtures/            # Test files
└── examples/
    ├── basic-analysis.js    # Basic usage
    └── multi-provider.js    # Multi-provider config
```

## 🚀 Release Process

### Version Management

- Follow **Semantic Versioning** (semver)
- **MAJOR**: Breaking changes
- **MINOR**: New features (backward compatible)
- **PATCH**: Bug fixes (backward compatible)

### Release Steps

1. **Update version** in package.json
2. **Update CHANGELOG.md** with changes
3. **Create Git tag**
   ```bash
   git tag v1.2.3
   git push origin v1.2.3
   ```
4. **Publish to npm** (for maintainers)
   ```bash
   npm publish
   ```

## 🏷️ Issue and PR Templates

### Bug Report Template

```markdown
**Describe the bug**
A clear description of what the bug is.

**To Reproduce**
Steps to reproduce the behavior:
1. Run command '...'
2. With configuration '...'
3. See error

**Expected behavior**
What you expected to happen.

**Environment:**
- OS: [e.g. Windows 10, macOS 12.0]
- Node.js version: [e.g. 16.14.0]
- Package version: [e.g. 1.2.0]

**Additional context**
Add any other context about the problem here.
```

### Feature Request Template

```markdown
**Feature Description**
A clear description of the feature you want to add.

**Problem Statement**
What problem does this feature solve?

**Proposed Solution**
How you envision this feature working.

**Alternatives Considered**
Other approaches you've considered.

**Additional Context**
Any other context or screenshots about the feature request.
```

## 🎯 Contribution Areas

### High Priority

- **Enhanced error handling** and user-friendly error messages
- **Performance optimizations** for large images
- **Additional image formats** support
- **More validation utilities**

### Medium Priority

- **Docker support** for containerized deployment
- **Configuration file** support
- **Logging improvements** and structured logging
- **Batch processing** capabilities

### Low Priority

- **Web interface** for testing
- **Plugin system** for custom providers
- **Caching mechanisms** for repeated analyses
- **Metrics and monitoring**

## 📞 Getting Help

### Communication Channels

- **GitHub Issues** - For bug reports and feature requests
- **GitHub Discussions** - For general questions and ideas
- **Email** - For private or security-related issues

### Code of Conduct

- Be **respectful** and **inclusive**
- Welcome **newcomers** and help them learn
- Focus on **constructive feedback**
- **Assume good intent** in all interactions

## 🏆 Recognition

### Contributors

All contributors will be recognized in:
- **README.md** - Contributors section
- **CHANGELOG.md** - For each release
- **GitHub contributors** - Automatic recognition

### Maintainer Guidelines

- **Review PRs** within 7 days
- **Respond to issues** within 3 days
- **Release new versions** regularly
- **Maintain documentation** quality

---

Thank you for contributing to GLM Image MCP Server! Your contributions help make this project better for everyone.

🚀 **Happy coding!**