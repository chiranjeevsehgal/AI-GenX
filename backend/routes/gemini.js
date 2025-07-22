const express = require('express');
const router = express.Router();
const { validateGeminiRequest } = require('../middleware/validation');
const { generateContent } = require('../controllers/gemini');
const { auth } = require('../middleware/clerkAuth');

// Rate limiting specific to Gemini API (30 requests per minute)
const rateLimit = require('express-rate-limit');

const geminiRateLimit = rateLimit({
  windowMs: 60 * 1000, // 1 minute
  max: 30, // 30 requests per minute
  message: {
    error: 'Too Many Requests',
    message: 'Too many Gemini API requests, please try again later.',
    retryAfter: 60
  },
  standardHeaders: true,
  legacyHeaders: false
});

// Apply rate limiting to all Gemini routes
router.use(geminiRateLimit);

// POST /api/gemini/generate - Generate content using Gemini API
// router.post('/generate', validateGeminiRequest, generateContent);
router.post('/generate', auth, generateContent);

module.exports = router;