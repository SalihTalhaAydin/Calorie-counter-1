const OpenAI = require('openai');
const Anthropic = require('@anthropic-ai/sdk');
const { GoogleGenerativeAI } = require('@google/generative-ai');
const axios = require('axios');
const logger = require('../utils/logger');

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
const anthropic = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });
const genAI = new GoogleGenerativeAI(process.env.GOOGLE_AI_API_KEY);

const NUTRITION_SYSTEM_PROMPT = `You are a precise nutrition calculator. Return EXACT numbers only.

RULES:
1. Always return exact whole numbers (no ranges)
2. Use reliable sources (USDA, brand websites)
3. Calculate modifications precisely
4. Return JSON format only
5. Show calculation reasoning

Format: {"calories": 350, "protein": 25, "carbs": 15, "fat": 22, "fiber": 3, "sugar": 5, "reasoning": "calculation steps"}`;

class AIService {
  static async calculateNutrition(foodDescription, model = 'gpt-4') {
    const prompt = `Calculate exact nutrition for: "${foodDescription}"

Requirements:
- Exact whole numbers only
- Show calculation steps
- Return JSON format only
- Be consistent if asked multiple times`;

    try {
      let result;
      const startTime = Date.now();

      switch (model.toLowerCase()) {
        case 'gpt-4':
        case 'gpt-3.5-turbo':
          result = await this.callOpenAI(prompt, model);
          break;
        case 'claude':
        case 'claude-3-sonnet':
          result = await this.callClaude(prompt);
          break;
        case 'gemini':
        case 'gemini-pro':
          result = await this.callGemini(prompt);
          break;
        case 'deepseek':
          result = await this.callDeepSeek(prompt);
          break;
        default:
          throw new Error(`Unsupported model: ${model}`);
      }

      const responseTime = Date.now() - startTime;
      
      logger.info(`AI calculation completed`, {
        model,
        food: foodDescription,
        responseTime,
        success: true
      });

      return {
        ...result,
        model,
        responseTime,
        timestamp: new Date().toISOString()
      };

    } catch (error) {
      logger.error(`AI calculation failed`, {
        model,
        food: foodDescription,
        error: error.message
      });
      throw error;
    }
  }

  static async callOpenAI(prompt, model = 'gpt-4') {
    const response = await openai.chat.completions.create({
      model: model === 'gpt-4' ? 'gpt-4-1106-preview' : 'gpt-3.5-turbo-1106',
      messages: [
        { role: 'system', content: NUTRITION_SYSTEM_PROMPT },
        { role: 'user', content: prompt }
      ],
      temperature: 0.1,
      max_tokens: 500
    });

    const content = response.choices[0].message.content;
    return this.parseNutritionResponse(content);
  }

  static async callClaude(prompt) {
    const response = await anthropic.messages.create({
      model: 'claude-3-sonnet-20240229',
      max_tokens: 500,
      temperature: 0.1,
      system: NUTRITION_SYSTEM_PROMPT,
      messages: [
        { role: 'user', content: prompt }
      ]
    });

    const content = response.content[0].text;
    return this.parseNutritionResponse(content);
  }

  static async callGemini(prompt) {
    const model = genAI.getGenerativeModel({ model: 'gemini-pro' });
    const fullPrompt = `${NUTRITION_SYSTEM_PROMPT}\n\n${prompt}`;
    
    const result = await model.generateContent(fullPrompt);
    const response = await result.response;
    const content = response.text();
    
    return this.parseNutritionResponse(content);
  }

  static async callDeepSeek(prompt) {
    const response = await axios.post('https://api.deepseek.com/v1/chat/completions', {
      model: 'deepseek-chat',
      messages: [
        { role: 'system', content: NUTRITION_SYSTEM_PROMPT },
        { role: 'user', content: prompt }
      ],
      temperature: 0.1,
      max_tokens: 500
    }, {
      headers: {
        'Authorization': `Bearer ${process.env.DEEPSEEK_API_KEY}`,
        'Content-Type': 'application/json'
      }
    });

    const content = response.data.choices[0].message.content;
    return this.parseNutritionResponse(content);
  }

  static parseNutritionResponse(content) {
    try {
      // Extract JSON from response
      const jsonMatch = content.match(/\{[\s\S]*\}/);
      if (!jsonMatch) {
        throw new Error('No JSON found in response');
      }

      const parsed = JSON.parse(jsonMatch[0]);
      
      // Validate required fields
      const required = ['calories', 'protein', 'carbs', 'fat'];
      for (const field of required) {
        if (typeof parsed[field] !== 'number') {
          throw new Error(`Missing or invalid ${field}`);
        }
      }

      // Ensure whole numbers
      return {
        calories: Math.round(parsed.calories),
        protein: Math.round(parsed.protein),
        carbs: Math.round(parsed.carbs),
        fat: Math.round(parsed.fat),
        fiber: Math.round(parsed.fiber || 0),
        sugar: Math.round(parsed.sugar || 0),
        reasoning: parsed.reasoning || 'No reasoning provided'
      };

    } catch (error) {
      logger.error('Failed to parse AI response:', { content, error: error.message });
      throw new Error('Invalid response format from AI model');
    }
  }

  static async testConsistency(foodDescription, model, runs = 5) {
    const results = [];
    
    for (let i = 0; i < runs; i++) {
      try {
        const result = await this.calculateNutrition(foodDescription, model);
        results.push(result);
        
        // Add small delay between requests
        await new Promise(resolve => setTimeout(resolve, 1000));
      } catch (error) {
        logger.error(`Consistency test failed on run ${i + 1}:`, error);
        results.push({ error: error.message });
      }
    }

    return this.analyzeConsistency(results);
  }

  static analyzeConsistency(results) {
    const validResults = results.filter(r => !r.error);
    
    if (validResults.length === 0) {
      return {
        consistent: false,
        error: 'All requests failed',
        results
      };
    }

    const metrics = ['calories', 'protein', 'carbs', 'fat'];
    const analysis = {};
    
    metrics.forEach(metric => {
      const values = validResults.map(r => r[metric]);
      const min = Math.min(...values);
      const max = Math.max(...values);
      const variance = max - min;
      
      analysis[metric] = {
        values,
        min,
        max,
        variance,
        consistent: variance <= 2 // Allow 2 unit variance
      };
    });

    const overallConsistent = metrics.every(m => analysis[m].consistent);

    return {
      consistent: overallConsistent,
      totalRuns: results.length,
      successfulRuns: validResults.length,
      analysis,
      results
    };
  }
}

module.exports = AIService;
