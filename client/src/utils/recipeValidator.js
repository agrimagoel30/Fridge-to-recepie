/**
 * Client-Side Defensive Recipe Sanitizer & Validator
 * Guarantees zero UI crashes even if LLM output is partially shaped or missing fields.
 */

export function sanitizeClientRecipe(raw) {
  if (!raw || typeof raw !== 'object') {
    throw new Error('Recipe data is not an object');
  }

  return {
    id: raw.id || `recipe-${Date.now()}`,
    title: raw.title || 'Untitled AI Recipe',
    tagline: raw.tagline || 'A custom dish crafted from your available ingredients',
    description: raw.description || 'No description provided.',
    prepTimeMinutes: Number(raw.prepTimeMinutes) || 10,
    cookTimeMinutes: Number(raw.cookTimeMinutes) || 15,
    totalTimeMinutes: Number(raw.totalTimeMinutes) || (Number(raw.prepTimeMinutes) || 10) + (Number(raw.cookTimeMinutes) || 15),
    servings: Number(raw.servings) || 2,
    difficulty: ['Easy', 'Medium', 'Hard'].includes(raw.difficulty) ? raw.difficulty : 'Easy',
    cuisine: raw.cuisine || 'Home Kitchen',
    dietaryTags: Array.isArray(raw.dietaryTags) ? raw.dietaryTags : [],
    matchedIngredients: Array.isArray(raw.matchedIngredients) ? raw.matchedIngredients : [],
    pantryStaplesNeeded: Array.isArray(raw.pantryStaplesNeeded) ? raw.pantryStaplesNeeded : ['Salt', 'Pepper', 'Oil'],
    ingredients: Array.isArray(raw.ingredients) ? raw.ingredients.map((ing, i) => ({
      id: ing.id || `ing-${i}-${Date.now()}`,
      name: ing.name || 'Pantry ingredient',
      amount: typeof ing.amount === 'number' ? ing.amount : parseFloat(ing.amount) || 1,
      unit: ing.unit || '',
      notes: ing.notes || '',
      isFromFridge: ing.isFromFridge !== undefined ? !!ing.isFromFridge : true,
      swaps: Array.isArray(ing.swaps) ? ing.swaps.map(s => ({
        name: s.name || 'Alternative ingredient',
        amount: typeof s.amount === 'number' ? s.amount : parseFloat(s.amount) || 1,
        unit: s.unit || '',
        ratio: s.ratio || '1:1 ratio',
        impact: s.impact || 'Alternative option'
      })) : []
    })) : [],
    steps: Array.isArray(raw.steps) ? raw.steps.map((st, i) => ({
      stepNumber: Number(st.stepNumber) || i + 1,
      instruction: st.instruction || 'Follow standard cooking procedure.',
      durationMinutes: st.durationMinutes ? Number(st.durationMinutes) : null,
      temperature: st.temperature || '',
      proTip: st.proTip || '',
      ingredientsUsed: Array.isArray(st.ingredientsUsed) ? st.ingredientsUsed : []
    })) : [],
    nutritionPerServing: {
      calories: Number(raw.nutritionPerServing?.calories) || 400,
      proteinGrams: Number(raw.nutritionPerServing?.proteinGrams) || 15,
      carbsGrams: Number(raw.nutritionPerServing?.carbsGrams) || 40,
      fatGrams: Number(raw.nutritionPerServing?.fatGrams) || 12,
      fiberGrams: Number(raw.nutritionPerServing?.fiberGrams) || 3,
    },
    chefTips: Array.isArray(raw.chefTips) ? raw.chefTips : [],
    refinementsApplied: Array.isArray(raw.refinementsApplied) ? raw.refinementsApplied : []
  };
}
