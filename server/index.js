import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { generateRecipeWithLLM } from './services/llm.js';
import { validateAndSanitizeRecipe } from './schemas/recipeSchema.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Enable CORS and JSON parsing
app.use(cors());
app.use(express.json({ limit: '1mb' }));

// Request logging middleware
app.use((req, res, next) => {
  const start = Date.now();
  res.on('finish', () => {
    const duration = Date.now() - start;
    console.log(`[${req.method}] ${req.originalUrl} - ${res.statusCode} (${duration}ms)`);
  });
  next();
});

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({
    status: 'healthy',
    timestamp: new Date().toISOString(),
    configuredProviders: {
      gemini: !!process.env.GEMINI_API_KEY,
      groq: !!process.env.GROQ_API_KEY,
      openai: !!process.env.OPENAI_API_KEY
    },
    defaultProvider: process.env.GEMINI_API_KEY ? 'gemini' : (process.env.GROQ_API_KEY ? 'groq' : 'mock')
  });
});

// Generate Recipe endpoint
app.post('/api/recipe/generate', async (req, res) => {
  const startTime = Date.now();
  const { prompt, dietaryPreferences, servings, provider, apiKey, simulateFailure } = req.body;

  if (!prompt || typeof prompt !== 'string' || prompt.trim().length === 0) {
    return res.status(400).json({
      success: false,
      error: 'Prompt cannot be empty. Please enter ingredients from your fridge.'
    });
  }

  // Combine dietary preferences if supplied
  let enrichedPrompt = prompt.trim();
  if (Array.isArray(dietaryPreferences) && dietaryPreferences.length > 0) {
    enrichedPrompt += `\nDietary constraints/preferences: ${dietaryPreferences.join(', ')}.`;
  }
  if (servings && Number(servings) > 0) {
    enrichedPrompt += `\nTarget default servings: ${servings}.`;
  }

  try {
    const result = await generateRecipeWithLLM({
      prompt: enrichedPrompt,
      apiKey,
      provider: provider || 'auto',
      simulateFailure
    });

    const latencyMs = Date.now() - startTime;

    if (!result.success) {
      return res.status(422).json({
        success: false,
        error: result.error || 'Failed to generate a valid recipe structure',
        rawOutput: result.rawOutput,
        issues: result.issues,
        isSimulated: !!result.isSimulated,
        latencyMs
      });
    }

    return res.json({
      success: true,
      data: result.data,
      provider: result.provider,
      isMock: !!result.isMock,
      latencyMs
    });
  } catch (error) {
    console.error('Recipe generation error:', error);
    return res.status(500).json({
      success: false,
      error: `Internal Server Error: ${error.message}`,
      latencyMs: Date.now() - startTime
    });
  }
});

// Refine Recipe endpoint (Stretch requirement: follow-up prompts that edit existing result)
app.post('/api/recipe/refine', async (req, res) => {
  const startTime = Date.now();
  const { currentRecipe, refinementPrompt, provider, apiKey, simulateFailure } = req.body;

  if (!currentRecipe || typeof currentRecipe !== 'object') {
    return res.status(400).json({
      success: false,
      error: 'Current recipe object is required for refinement'
    });
  }

  if (!refinementPrompt || typeof refinementPrompt !== 'string' || refinementPrompt.trim().length === 0) {
    return res.status(400).json({
      success: false,
      error: 'Refinement prompt cannot be empty'
    });
  }

  try {
    const result = await generateRecipeWithLLM({
      prompt: '',
      refinement: refinementPrompt.trim(),
      currentRecipe,
      apiKey,
      provider: provider || 'auto',
      simulateFailure
    });

    const latencyMs = Date.now() - startTime;

    if (!result.success) {
      return res.status(422).json({
        success: false,
        error: result.error || 'Failed to refine recipe',
        rawOutput: result.rawOutput,
        latencyMs
      });
    }

    return res.json({
      success: true,
      data: result.data,
      provider: result.provider,
      latencyMs
    });
  } catch (error) {
    console.error('Refinement error:', error);
    return res.status(500).json({
      success: false,
      error: `Refinement error: ${error.message}`,
      latencyMs: Date.now() - startTime
    });
  }
});

// Direct validator endpoint
app.post('/api/validate', (req, res) => {
  const { rawJson } = req.body;
  const result = validateAndSanitizeRecipe(rawJson);
  res.json(result);
});

app.listen(PORT, () => {
  console.log(`[Fridge-to-Recipe API Server] listening on http://localhost:${PORT}`);
});
