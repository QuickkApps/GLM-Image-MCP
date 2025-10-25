const fs = require('fs');
const path = require('path');

/**
 * Input Validation Module
 * Validates and sanitizes input parameters for the MCP
 */
class ValidationUtils {
  constructor() {
    this.supportedImageFormats = ['.jpg', '.jpeg', '.png', '.webp', '.bmp', '.tiff'];
    this.maxFileSize = 50 * 1024 * 1024; // 50MB
    this.minPromptLength = 3;
    this.maxPromptLength = 1000;
  }

  /**
   * Validate analysis input parameters
   * @param {Object} params - Input parameters
   * @returns {Object} - Validated and sanitized parameters
   * @throws {Error} - If validation fails
   */
  validateAnalysisParams(params) {
    const {
      image_path,
      prompt,
      provider = 'openrouter',
      model
    } = params;

    if (!image_path) {
      throw new Error('image_path is required');
    }

    if (!prompt) {
      throw new Error('prompt is required');
    }

    // Validate provider
    const validatedProvider = this.validateProvider(provider);
    
    // Validate model if provided
    const validatedModel = model ? this.validateModel(model) : null;

    return {
      image_path: this.validateImagePath(image_path),
      prompt: this.validatePrompt(prompt),
      provider: validatedProvider,
      model: validatedModel
    };
  }

  /**
   * Validate provider parameter
   * @param {string} provider - AI provider name
   * @returns {string} - Validated provider
   * @throws {Error} - If validation fails
   */
  validateProvider(provider) {
    const validProviders = ['openrouter', 'gemini'];

    if (!validProviders.includes(provider)) {
      throw new Error(`Invalid provider: ${provider}. Valid providers: ${validProviders.join(', ')}`);
    }

    return provider;
  }

  /**
   * Validate model parameter
   * @param {string} model - Model name
   * @returns {string} - Validated model
   * @throws {Error} - If validation fails
   */
  validateModel(model) {
    if (typeof model !== 'string') {
      throw new Error('model must be a string');
    }

    const trimmedModel = model.trim();
    
    if (trimmedModel.length === 0) {
      throw new Error('model cannot be empty');
    }

    if (trimmedModel.length > 100) {
      throw new Error('model name too long (maximum 100 characters)');
    }

    // Basic validation for common model patterns
    const validPatterns = [
      /^gemini-[\w.-]+$/,
      /^[\w.-]+\/[\w.-]+$/,
      /^[\w.-]+$/,
      /^[\w.-]+\/[\w.-]+:[\w.-]+$/
    ];

    const isValidPattern = validPatterns.some(pattern => pattern.test(trimmedModel));
    
    if (!isValidPattern) {
      throw new Error(`Invalid model format: ${trimmedModel}. Expected formats like "gemini-1.5-flash", "openai/gpt-4-vision-preview", or "x-ai/grok-4-fast:free"`);
    }

    return trimmedModel;
  }

  /**
   * Validate image path and file
   * @param {string} imagePath - Image file path
   * @returns {string} - Validated image path
   * @throws {Error} - If validation fails
   */
  validateImagePath(imagePath) {
    if (typeof imagePath !== 'string') {
      throw new Error('image_path must be a string');
    }

    // Check if path is empty
    if (!imagePath.trim()) {
      throw new Error('image_path cannot be empty');
    }

    // Resolve path and check if it exists
    const resolvedPath = path.resolve(imagePath);
    
    if (!fs.existsSync(resolvedPath)) {
      throw new Error(`Image file not found: ${resolvedPath}`);
    }

    // Check if it's a file (not a directory)
    const stats = fs.statSync(resolvedPath);
    if (!stats.isFile()) {
      throw new Error(`Path is not a file: ${resolvedPath}`);
    }

    // Check file size
    if (stats.size > this.maxFileSize) {
      throw new Error(`Image file too large: ${stats.size} bytes (max: ${this.maxFileSize} bytes)`);
    }

    // Check file extension
    const ext = path.extname(resolvedPath).toLowerCase();
    if (!this.supportedImageFormats.includes(ext)) {
      throw new Error(`Unsupported image format: ${ext}. Supported formats: ${this.supportedImageFormats.join(', ')}`);
    }

    return resolvedPath;
  }

  /**
   * Validate prompt text
   * @param {string} prompt - User prompt
   * @returns {string} - Validated prompt
   * @throws {Error} - If validation fails
   */
  validatePrompt(prompt) {
    if (typeof prompt !== 'string') {
      throw new Error('prompt must be a string');
    }

    const trimmedPrompt = prompt.trim();

    if (trimmedPrompt.length < this.minPromptLength) {
      throw new Error(`prompt too short (minimum ${this.minPromptLength} characters)`);
    }

    if (trimmedPrompt.length > this.maxPromptLength) {
      throw new Error(`prompt too long (maximum ${this.maxPromptLength} characters)`);
    }

    // Check for potentially harmful content
    const harmfulPatterns = [
      /<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi,
      /javascript:/gi,
      /data:text\/html/gi
    ];

    for (const pattern of harmfulPatterns) {
      if (pattern.test(trimmedPrompt)) {
        throw new Error('prompt contains potentially harmful content');
      }
    }

    return trimmedPrompt;
  }

  /**
   * Validate image buffer
   * @param {Buffer} buffer - Image buffer
   * @returns {boolean} - True if valid
   */
  validateImageBuffer(buffer) {
    if (!Buffer.isBuffer(buffer)) {
      return false;
    }

    if (buffer.length === 0) {
      return false;
    }

    if (buffer.length > this.maxFileSize) {
      return false;
    }

    // Basic image format validation by checking magic numbers
    const signatures = {
      'jpeg': [0xFF, 0xD8, 0xFF],
      'png': [0x89, 0x50, 0x4E, 0x47],
      'webp': [0x52, 0x49, 0x46, 0x46],
      'bmp': [0x42, 0x4D]
    };

    for (const [format, signature] of Object.entries(signatures)) {
      if (buffer.length >= signature.length) {
        const matches = signature.every((byte, index) => buffer[index] === byte);
        if (matches) {
          return true;
        }
      }
    }

    return false;
  }
}

module.exports = ValidationUtils;
