import { validateAndSanitizeRecipe } from '../schemas/recipeSchema.js';
import { generateMockRecipe } from './mock.js';

const SYSTEM_PROMPT = `You are an elite Michelin-trained executive chef and culinary nutrition expert.
Your job is to transform a home cook's random fridge ingredients into an extraordinary, practical, delicious recipe.

CRITICAL INSTRUCTIONS:
1. You must respond with STRICT, VALID JSON ONLY. Do NOT include markdown code blocks, do not include preamble, do not include any notes outside the JSON.
2. The JSON schema must strictly conform to:
{
  "title": string,
  "tagline": string,
  "description": string,
  "prepTimeMinutes": integer,
  "cookTimeMinutes": integer,
  "totalTimeMinutes": integer,
  "servings": integer (typically 2),
  "difficulty": "Easy" | "Medium" | "Hard",
  "cuisine": string,
  "dietaryTags": [string],
  "matchedIngredients": [string],
  "pantryStaplesNeeded": [string],
  "ingredients": [
    {
      "id": string (e.g. "ing-1"),
      "name": string,
      "amount": number (positive decimal or integer),
      "unit": string (e.g. "grams", "cups", "tbsp", "whole"),
      "notes": string,
      "isFromFridge": boolean,
      "swaps": [
        {
          "name": string,
          "amount": number,
          "unit": string,
          "ratio": string,
          "impact": string
        }
      ]
    }
  ],
  "steps": [
    {
      "stepNumber": integer,
      "instruction": string,
      "durationMinutes": integer or null,
      "temperature": string,
      "proTip": string,
      "ingredientsUsed": [string]
    }
  ],
  "nutritionPerServing": {
    "calories": integer,
    "proteinGrams": integer,
    "carbsGrams": integer,
    "fatGrams": integer,
    "fiberGrams": integer
  },
  "chefTips": [string]
}

3. Ingredients MUST have smart, realistic 'swaps' (substitutes) so the user can click to substitute ingredients.
4. Steps MUST be detailed, sequential, actionable, and include durationMinutes wherever cooking or simmering is involved.`;

const CANDIDATE_MODELS = [
  'llama-3.1-8b-instant',
  'llama-3.3-70b-versatile',
  'llama3-70b-8192',
  'llama3-8b-8192',
  'mixtral-8x7b-32768'
];
const GROQ_API_URL = 'https://api.groq.com/openai/v1/chat/completions';

export async function generateRecipeWithLLM({
  prompt,
  refinement = null,
  currentRecipe = null,
  apiKey = null,
  simulateFailure = null
}) {
  // ── Simulation / failure-mode tests ────────────────────────────────────────
  if (simulateFailure) {
    if (simulateFailure === 'malformed_json') {
      return {
        success: false,
        isSimulated: true,
        error: 'Simulated bad output: LLM returned malformed truncated JSON: {"title": "Half Cooked Stew", "ingredients": [',
        rawOutput: '{"title": "Half Cooked Stew", "ingredients": ['
      };
    }
    if (simulateFailure === 'wrong_schema') {
      return {
        success: false,
        isSimulated: true,
        error: 'Simulated bad output: LLM returned wrong schema (missing required steps and ingredients array)',
        rawOutput: { note: 'Here is a recipe', randomText: 'Just cook everything together.' }
      };
    }
    if (simulateFailure === 'slow_timeout') {
      await new Promise(res => setTimeout(res, 12000));
      return {
        success: false,
        isSimulated: true,
        error: 'Simulated timeout: upstream model took too long to respond (> 10s).'
      };
    }
    if (simulateFailure === 'server_error') {
      throw new Error('Simulated upstream AI provider 500 internal server error');
    }
  }

  // ── Resolve Groq API key ───────────────────────────────────────────────────
  const groqKey = apiKey || process.env.GROQ_API_KEY;

  // ── Groq call with automatic model fallback ────────────────────────────────
  if (groqKey) {
    let lastError = null;
    let userPrompt;

    if (refinement && currentRecipe) {
      userPrompt = `Existing recipe JSON:\n${JSON.stringify(currentRecipe)}\n\nUser request to edit/refine this recipe:\n"${refinement}"\nUpdate the recipe while preserving the core structure and returning valid JSON only.`;
    } else {
      userPrompt = `Home cook fridge inventory:\n"${prompt}"\nCreate an extraordinary, practical, delicious recipe based on these ingredients.`;
    }

    // Try each model until one succeeds
    for (const modelName of CANDIDATE_MODELS) {
      try {
        const response = await fetch(GROQ_API_URL, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${groqKey}`
          },
          body: JSON.stringify({
            model: modelName,
            messages: [
              { role: 'system', content: SYSTEM_PROMPT },
              { role: 'user', content: userPrompt }
            ],
            response_format: { type: 'json_object' },
            temperature: 0.4,
            max_tokens: 4096
          })
        });

        if (!response.ok) {
          const errBody = await response.json().catch(() => ({}));
          const errMsg = errBody?.error?.message || response.statusText;
          // If model not found (404), try next model in the list
          if (response.status === 404 || errMsg.includes('does not exist')) {
            console.warn(`[Groq] Model ${modelName} not available, trying next fallback...`);
            lastError = errMsg;
            continue;
          }
          throw new Error(`Groq API error ${response.status}: ${errMsg}`);
        }

        const groqData = await response.json();
        const content = groqData.choices?.[0]?.message?.content;

        if (!content) {
          throw new Error('Groq returned an empty response');
        }

        const validated = validateAndSanitizeRecipe(content);

        if (validated.success) {
          return {
            success: true,
            provider: `Groq (${modelName})`,
            data: validated.data
          };
        }

        // Schema validation failed
        return {
          success: false,
          provider: `Groq (${modelName})`,
          error: validated.error,
          rawOutput: validated.rawOutput,
          issues: validated.issues
        };

      } catch (err) {
        console.warn(`[Groq] Failed with ${modelName}:`, err.message);
        lastError = err.message;
      }
    }

    console.error('[Groq] All candidate models failed, falling back to built-in engine:', lastError);
  }

  // ── Fallback: Zero-Config Intelligent Mock Engine ─────────────────────────
  console.info('[LLM] Using built-in resilient mock engine');
  const mockResult = generateMockRecipe(prompt, refinement, currentRecipe);
  const validated = validateAndSanitizeRecipe(mockResult);

  return {
    success: true,
    provider: 'Built-in Intelligent Engine (Resilient Mode)',
    isMock: true,
    data: validated.data
  };
}
