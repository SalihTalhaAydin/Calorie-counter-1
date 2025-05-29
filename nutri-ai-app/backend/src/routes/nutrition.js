const express = require('express');
const { body, validationResult } = require('express-validator');
const rateLimit = require('express-rate-limit');
const NutritionController = require('../controllers/nutritionController');
const { optionalAuth } = require('../middleware/auth');

const router = express.Router();

// Rate limiting for AI calls
const aiRateLimit = rateLimit({
  windowMs: 1 * 60 * 1000, // 1 minute
  max: 10, // 10 requests per minute
  message: { error: 'Too many AI requests, please wait a minute' }
});

// Validation middleware
const validateCalculation = [
  body('food')
    .trim()
    .isLength({ min: 3, max: 500 })
    .withMessage('Food description must be between 3 and 500 characters'),
  body('model')
    .optional()
    .isIn(['gpt-4', 'gpt-3.5-turbo', 'claude', 'gemini', 'deepseek'])
    .withMessage('Invalid model selection')
];

const validateConsistencyTest = [
  ...validateCalculation,
  body('runs')
    .optional()
    .isInt({ min: 2, max: 10 })
    .withMessage('Runs must be between 2 and 10')
];

// Middleware to handle validation errors
const handleValidationErrors = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      error: 'Validation failed',
      details: errors.array()
    });
  }
  next();
};

// Routes
router.post('/calculate', 
  aiRateLimit,
  optionalAuth,
  validateCalculation,
  handleValidationErrors,
  NutritionController.calculate
);

router.post('/test-consistency',
  aiRateLimit,
  optionalAuth,
  validateConsistencyTest,
  handleValidationErrors,
  NutritionController.testConsistency
);

router.get('/models',
  NutritionController.getModels
);

module.exports = router;
