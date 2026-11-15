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

const GROQ_MODEL = 'llama-3.3-70b-versatile';
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
  // Priority: key passed from client settings modal → server .env variable
  const groqKey = apiKey || process.env.GROQ_API_KEY;

  // ── Groq call ─────────────────────────────────────────────────────────────
  if (groqKey) {
    try {
      let userPrompt;

      if (refinement && currentRecipe) {
        userPrompt = `Existing recipe JSON:\n${JSON.stringify(currentRecipe)}\n\nUser request to edit/refine this recipe:\n"${refinement}"\nUpdate the recipe while preserving the core structure and returning valid JSON only.`;
      } else {
        userPrompt = `Home cook fridge inventory:\n"${prompt}"\nCreate an extraordinary, practical, delicious recipe based on these ingredients.`;
      }

      const response = await fetch(GROQ_API_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${groqKey}`
        },
        body: JSON.stringify({
          model: GROQ_MODEL,
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
        throw new Error(`Groq API error ${response.status}: ${errBody?.error?.message || response.statusText}`);
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
          provider: `Groq (${GROQ_MODEL})`,
          data: validated.data
        };
      }

      // Groq replied but the JSON failed schema validation
      return {
        success: false,
        provider: 'Groq',
        error: validated.error,
        rawOutput: validated.rawOutput,
        issues: validated.issues
      };

    } catch (err) {
      console.error('[Groq Error]', err.message);
      return {
        success: false,
        provider: 'Groq',
        error: `Groq API call failed: ${err.message}`
      };
    }
  }

  // ── Fallback: Zero-Config Intelligent Mock Engine ─────────────────────────
  // Runs automatically when no GROQ_API_KEY is set, so the app never crashes
  // during local dev or reviewer testing without an API key.
  console.info('[LLM] No GROQ_API_KEY found — using built-in mock engine');
  const mockResult = generateMockRecipe(prompt, refinement, currentRecipe);
  const validated = validateAndSanitizeRecipe(mockResult);

  return {
    success: true,
    provider: 'Built-in Intelligent Engine (Zero-Config Mode — add GROQ_API_KEY to enable real AI)',
    isMock: true,
    data: validated.data
  };
}
