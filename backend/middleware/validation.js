const { body, validationResult } = require('express-validator');

// Available Gemini models
const AVAILABLE_MODELS = [
  'gemini-2.5-flash',
  'gemini-2.0-flash',
  'gemini-2.0-flash-lite'
];

// Validation for simplified Gemini API requests
const validateGeminiRequest = [
  body('model')
    .isString()
    .notEmpty()
    .withMessage('Model is required')
    .isIn(AVAILABLE_MODELS)
    .withMessage(`Invalid model specified. Available models: ${AVAILABLE_MODELS.join(', ')}`),
  
  body('jobDescription')
    .isString()
    .notEmpty()
    .withMessage('Job description is required')
    .isLength({ min: 10, max: 10000 })
    .withMessage('Job description must be between 10 and 10,000 characters'),
  
  body('resume')
    .optional()
    .isString()
    .withMessage('Resume must be a string')
    .isLength({ max: 20000 })
    .withMessage('Resume must be less than 20,000 characters'),
  
  // Custom validation middleware to check results
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        error: 'Validation Error',
        message: 'Invalid request data',
        details: errors.array()
      });
    }
    
    const { jobDescription, resume } = req.body;
    
    // Check total content size limits
    const totalContentSize = jobDescription.length + (resume ? resume.length : 0);
    const MAX_TOTAL_SIZE = 25000; // 25KB total content limit
    
    if (totalContentSize > MAX_TOTAL_SIZE) {
      return res.status(400).json({
        error: 'Content Too Large',
        message: `Total content size (${totalContentSize} chars) exceeds maximum limit of ${MAX_TOTAL_SIZE} characters`
      });
    }
    
    // Validate job description content quality
    if (jobDescription.trim().length < 10) {
      return res.status(400).json({
        error: 'Invalid Job Description',
        message: 'Job description is too short or contains only whitespace'
      });
    }
    
    // Check for potentially harmful content patterns
    const suspiciousPatterns = [
      /(<script|<iframe|javascript:|data:)/i,
      /(eval\s*\(|function\s*\()/i
    ];
    
    const contentToCheck = jobDescription + (resume || '');
    for (const pattern of suspiciousPatterns) {
      if (pattern.test(contentToCheck)) {
        return res.status(400).json({
          error: 'Invalid Content',
          message: 'Content contains potentially harmful patterns'
        });
      }
    }
    
    next();
  }
];

module.exports = {
  validateGeminiRequest
};