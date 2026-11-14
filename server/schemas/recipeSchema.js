import { z } from 'zod';

export const SwapOptionSchema = z.object({
  name: z.string().min(1, 'Swap name is required'),
  amount: z.union([z.number(), z.string()]).transform(v => typeof v === 'string' ? parseFloat(v) || 1 : v),
  unit: z.string().default(''),
  ratio: z.string().default('1:1 swap'),
  impact: z.string().default('Alternative flavor or dietary option')
});

export const IngredientSchema = z.object({
  id: z.string().default(() => `ing-${Math.random().toString(36).substring(2, 9)}`),
  name: z.string().min(1, 'Ingredient name required'),
  amount: z.union([z.number(), z.string()]).transform(v => {
    if (typeof v === 'number') return v;
    const parsed = parseFloat(v);
    return isNaN(parsed) ? 1 : parsed;
  }),
  unit: z.string().default(''),
  notes: z.string().optional().default(''),
  isFromFridge: z.boolean().default(true),
  swaps: z.array(SwapOptionSchema).default([])
});

export const StepSchema = z.object({
  stepNumber: z.number().int().positive(),
  instruction: z.string().min(3, 'Instruction text required'),
  durationMinutes: z.union([z.number(), z.null()]).optional().default(null),
  temperature: z.string().optional().default(''),
  proTip: z.string().optional().default(''),
  ingredientsUsed: z.array(z.string()).default([])
});

export const NutritionSchema = z.object({
  calories: z.number().nonnegative().default(450),
  proteinGrams: z.number().nonnegative().default(20),
  carbsGrams: z.number().nonnegative().default(45),
  fatGrams: z.number().nonnegative().default(18),
  fiberGrams: z.number().nonnegative().default(4)
});

export const RecipeSchema = z.object({
  id: z.string().default(() => `recipe-${Date.now()}`),
  title: z.string().min(2, 'Recipe title required'),
  tagline: z.string().default('Delicious meal created from your pantry'),
  description: z.string().min(5, 'Recipe description required'),
  prepTimeMinutes: z.number().int().nonnegative().default(10),
  cookTimeMinutes: z.number().int().nonnegative().default(15),
  totalTimeMinutes: z.number().int().nonnegative().default(25),
  servings: z.number().int().positive().default(2),
  difficulty: z.enum(['Easy', 'Medium', 'Hard']).default('Easy'),
  cuisine: z.string().default('Home Style'),
  dietaryTags: z.array(z.string()).default([]),
  matchedIngredients: z.array(z.string()).default([]),
  pantryStaplesNeeded: z.array(z.string()).default(['Salt', 'Black pepper', 'Cooking oil']),
  ingredients: z.array(IngredientSchema).min(1, 'At least one ingredient is required'),
  steps: z.array(StepSchema).min(1, 'At least one step is required'),
  nutritionPerServing: NutritionSchema.default({
    calories: 450,
    proteinGrams: 20,
    carbsGrams: 45,
    fatGrams: 18,
    fiberGrams: 4
  }),
  chefTips: z.array(z.string()).default([]),
  refinementsApplied: z.array(z.string()).default([])
});

/**
 * Validates and sanitizes raw JSON output from LLM.
 * Returns { success: true, data: Recipe } or { success: false, error: string, details: any }
 */
export function validateAndSanitizeRecipe(rawJson) {
  try {
    let parsed = rawJson;
    if (typeof rawJson === 'string') {
      // Try to clean markdown code blocks if present
      let clean = rawJson.trim();
      if (clean.startsWith('```json')) {
        clean = clean.replace(/^```json\s*/i, '').replace(/```\s*$/i, '');
      } else if (clean.startsWith('```')) {
        clean = clean.replace(/^```\s*/i, '').replace(/```\s*$/i, '');
      }
      // Locate first { and last } to avoid hallucinated preamble or trailing notes
      const firstBrace = clean.indexOf('{');
      const lastBrace = clean.lastIndexOf('}');
      if (firstBrace !== -1 && lastBrace !== -1 && lastBrace > firstBrace) {
        clean = clean.slice(firstBrace, lastBrace + 1);
      }
      parsed = JSON.parse(clean);
    }

    if (!parsed || typeof parsed !== 'object') {
      return {
        success: false,
        error: 'Model returned non-object response',
        rawOutput: rawJson
      };
    }

    // Auto-calculate totalTimeMinutes if missing
    if (!parsed.totalTimeMinutes && (parsed.prepTimeMinutes || parsed.cookTimeMinutes)) {
      parsed.totalTimeMinutes = (parsed.prepTimeMinutes || 0) + (parsed.cookTimeMinutes || 0);
    }

    // Auto-assign stepNumber if missing
    if (Array.isArray(parsed.steps)) {
      parsed.steps = parsed.steps.map((st, idx) => ({
        ...st,
        stepNumber: st.stepNumber || idx + 1
      }));
    }

    const validationResult = RecipeSchema.safeParse(parsed);
    if (!validationResult.success) {
      const issueSummary = validationResult.error.issues
        .map(i => `${i.path.join('.') || 'root'}: ${i.message}`)
        .join('; ');
      return {
        success: false,
        error: `Recipe schema validation failed: ${issueSummary}`,
        issues: validationResult.error.issues,
        rawOutput: parsed
      };
    }

    return {
      success: true,
      data: validationResult.data
    };
  } catch (err) {
    return {
      success: false,
      error: `Failed to parse AI output: ${err.message}`,
      rawOutput: rawJson
    };
  }
}
