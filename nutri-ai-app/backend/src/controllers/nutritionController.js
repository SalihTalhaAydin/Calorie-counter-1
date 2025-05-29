const AIService = require('../services/aiService');
const Calculation = require('../models/Calculation');
const logger = require('../utils/logger');

class NutritionController {
  static async calculate(req, res, next) {
    try {
      const { food, model = 'gpt-4' } = req.body;
      
      if (!food || food.trim().length === 0) {
        return res.status(400).json({
          error: 'Food description is required'
        });
      }

      const result = await AIService.calculateNutrition(food, model);
      
      // Save to database
      const calculation = new Calculation({
        userId: req.user?.id || null,
        food: food.trim(),
        model,
        result,
        ipAddress: req.ip
      });
      
      await calculation.save();

      res.json({
        success: true,
        data: result,
        calculationId: calculation._id
      });

    } catch (error) {
      next(error);
    }
  }

  static async testConsistency(req, res, next) {
    try {
      const { food, model = 'gpt-4', runs = 5 } = req.body;
      
      if (!food || food.trim().length === 0) {
        return res.status(400).json({
          error: 'Food description is required'
        });
      }

      if (runs < 2 || runs > 10) {
        return res.status(400).json({
          error: 'Runs must be between 2 and 10'
        });
      }

      const analysis = await AIService.testConsistency(food, model, runs);
      
      // Save consistency test
      const calculation = new Calculation({
        userId: req.user?.id || null,
        food: food.trim(),
        model,
        result: analysis,
        type: 'consistency_test',
        ipAddress: req.ip
      });
      
      await calculation.save();

      res.json({
        success: true,
        data: analysis,
        testId: calculation._id
      });

    } catch (error) {
      next(error);
    }
  }

  static async getModels(req, res, next) {
    try {
      const models = [
        {
          id: 'gpt-4',
          name: 'GPT-4',
          provider: 'OpenAI',
          status: process.env.OPENAI_API_KEY ? 'available' : 'unavailable',
          description: 'Most accurate and consistent model'
        },
        {
          id: 'gpt-3.5-turbo',
          name: 'GPT-3.5 Turbo',
          provider: 'OpenAI',
          status: process.env.OPENAI_API_KEY ? 'available' : 'unavailable',
          description: 'Faster but less consistent than GPT-4'
        },
        {
          id: 'claude',
          name: 'Claude 3 Sonnet',
          provider: 'Anthropic',
          status: process.env.ANTHROPIC_API_KEY ? 'available' : 'unavailable',
          description: 'Good reasoning and consistency'
        },
        {
          id: 'gemini',
          name: 'Gemini Pro',
          provider: 'Google',
          status: process.env.GOOGLE_AI_API_KEY ? 'available' : 'unavailable',
          description: 'Fast and free tier available'
        },
        {
          id: 'deepseek',
          name: 'DeepSeek Chat',
          provider: 'DeepSeek',
          status: process.env.DEEPSEEK_API_KEY ? 'available' : 'unavailable',
          description: 'Cost-effective alternative'
        }
      ];

      res.json({
        success: true,
        data: models
      });

    } catch (error) {
      next(error);
    }
  }
}

module.exports = NutritionController;
