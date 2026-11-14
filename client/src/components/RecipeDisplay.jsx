import React, { useState } from 'react';
import { IngredientList } from './IngredientList';
import { StepChecklist } from './StepChecklist';
import { NutritionCard } from './NutritionCard';
import { RefinementLoop } from './RefinementLoop';
import {
  Clock,
  Users,
  Flame,
  Globe,
  Printer,
  Bookmark,
  Share2,
  Sparkles,
  ArrowLeft,
  ChefHat,
  Check,
  Zap,
  RotateCcw
} from 'lucide-react';

export function RecipeDisplay({
  recipe,
  onReset,
  onRefine,
  refining = false,
  isSaved = false,
  onToggleSave,
  onUpdateRecipe,
  providerInfo = '',
  latencyMs = null
}) {
  const [currentServings, setCurrentServings] = useState(recipe.servings || 2);
  const [copied, setCopied] = useState(false);

  // Scalable servings handler
  const handleServingsChange = (delta) => {
    setCurrentServings(prev => Math.max(1, Math.min(24, prev + delta)));
  };

  // Ingredient swap handler: updates ingredient in place and updates step text references
  const handleApplySwap = (ingredientId, chosenSwap) => {
    onUpdateRecipe(prev => {
      const targetIng = prev.ingredients.find(i => i.id === ingredientId);
      if (!targetIng) return prev;

      const oldName = targetIng.name;
      const newName = chosenSwap.name;

      const updatedIngredients = prev.ingredients.map(ing => {
        if (ing.id === ingredientId) {
          return {
            ...ing,
            name: `${chosenSwap.name} (Substituted)`,
            amount: chosenSwap.amount || ing.amount,
            unit: chosenSwap.unit || ing.unit,
            notes: `Substituted for ${oldName} (${chosenSwap.impact || 'alternative'})`,
            swaps: ing.swaps.filter(s => s.name !== chosenSwap.name)
          };
        }
        return ing;
      });

      // Update steps if they referenced the old ingredient name
      const updatedSteps = prev.steps.map(st => ({
        ...st,
        instruction: st.instruction.replaceAll(new RegExp(oldName, 'gi'), newName),
        ingredientsUsed: st.ingredientsUsed.map(u => u.toLowerCase() === oldName.toLowerCase() ? newName : u)
      }));

      return {
        ...prev,
        ingredients: updatedIngredients,
        steps: updatedSteps,
        refinementsApplied: [
          ...(prev.refinementsApplied || []),
          `Swapped ${oldName} with ${newName}`
        ]
      };
    });
  };

  const handleShare = () => {
    const summary = `${recipe.title}\n${recipe.tagline}\nTime: ${recipe.totalTimeMinutes}m | Servings: ${currentServings}\nGenerated with Fridge-to-Recipe AI`;
    navigator.clipboard.writeText(summary);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  return (
    <div className="w-full max-w-5xl mx-auto space-y-8 animate-in fade-in duration-300">
      {/* Top Navigation & Action Row */}
      <div className="flex items-center justify-between gap-3 no-print">
        <button
          onClick={onReset}
          className="inline-flex items-center gap-2 px-3.5 py-2 rounded-xl bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 text-stone-700 dark:text-stone-300 hover:bg-stone-50 text-xs font-semibold shadow-xs transition"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Back to Fridge</span>
        </button>

        <div className="flex items-center gap-2">
          {/* Share Button */}
          <button
            onClick={handleShare}
            className="p-2 sm:px-3 sm:py-2 rounded-xl bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 text-stone-700 dark:text-stone-300 hover:bg-stone-50 text-xs font-semibold shadow-xs transition inline-flex items-center gap-1.5"
            title="Copy Recipe Summary"
          >
            {copied ? <Check className="w-4 h-4 text-emerald-500" /> : <Share2 className="w-4 h-4" />}
            <span className="hidden sm:inline">{copied ? 'Copied!' : 'Share'}</span>
          </button>

          {/* Print / Export PDF */}
          <button
            onClick={() => window.print()}
            className="p-2 sm:px-3 sm:py-2 rounded-xl bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 text-stone-700 dark:text-stone-300 hover:bg-stone-50 text-xs font-semibold shadow-xs transition inline-flex items-center gap-1.5"
            title="Print Recipe"
          >
            <Printer className="w-4 h-4" />
            <span className="hidden sm:inline">Print / PDF</span>
          </button>

          {/* Bookmark / Save Recipe */}
          <button
            onClick={() => onToggleSave(recipe)}
            className={`px-3 py-2 rounded-xl text-xs font-bold border transition inline-flex items-center gap-1.5 ${
              isSaved
                ? 'bg-orange-50 border-orange-300 text-orange-700 dark:bg-orange-950/60 dark:border-orange-800 dark:text-orange-300'
                : 'bg-white dark:bg-stone-900 border-stone-200 dark:border-stone-800 text-stone-700 dark:text-stone-300 hover:bg-stone-50'
            }`}
          >
            <Bookmark className={`w-4 h-4 ${isSaved ? 'fill-orange-500 text-orange-500' : ''}`} />
            <span>{isSaved ? 'Saved to Book' : 'Save Recipe'}</span>
          </button>
        </div>
      </div>

      {/* Hero Recipe Header Card */}
      <div className="bg-white dark:bg-stone-900 rounded-3xl p-6 sm:p-10 border border-stone-200/80 dark:border-stone-800 shadow-xl shadow-stone-200/40 dark:shadow-stone-950/50 relative overflow-hidden">
        {/* Decorative corner tag */}
        <div className="flex flex-wrap items-center justify-between gap-3 mb-3">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="px-3 py-1 rounded-full text-xs font-bold bg-orange-100 text-orange-800 dark:bg-orange-950/80 dark:text-orange-300">
              {recipe.cuisine || 'Chef Special'}
            </span>
            <span className="px-3 py-1 rounded-full text-xs font-bold bg-stone-100 text-stone-700 dark:bg-stone-800 dark:text-stone-300">
              {recipe.difficulty} Difficulty
            </span>
            {recipe.dietaryTags?.map(tag => (
              <span
                key={tag}
                className="px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-emerald-50 text-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-300 border border-emerald-200/60 dark:border-emerald-900"
              >
                {tag}
              </span>
            ))}
          </div>

          {/* AI Metadata pill */}
          <div className="text-[11px] text-stone-400 dark:text-stone-500 flex items-center gap-1.5 font-medium">
            <Zap className="w-3.5 h-3.5 text-amber-500" />
            <span>{providerInfo}</span>
            {latencyMs && <span>({latencyMs}ms)</span>}
          </div>
        </div>

        {/* Title & Tagline */}
        <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-stone-900 dark:text-stone-100 font-['Playfair_Display',serif] tracking-tight mb-2">
          {recipe.title}
        </h1>
        <p className="text-base sm:text-lg font-medium text-orange-600 dark:text-orange-400 mb-4">
          {recipe.tagline}
        </p>
        <p className="text-stone-600 dark:text-stone-400 text-sm sm:text-base leading-relaxed max-w-3xl mb-6">
          {recipe.description}
        </p>

        {/* Recipe Quick Metrics Grid */}
        <div className="pt-6 border-t border-stone-100 dark:border-stone-800 grid grid-cols-2 sm:grid-cols-4 gap-4">
          {/* Prep Time */}
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-orange-50 dark:bg-orange-950/50 text-orange-600 dark:text-orange-400 flex items-center justify-center">
              <Clock className="w-5 h-5" />
            </div>
            <div>
              <div className="text-[11px] font-semibold text-stone-400">Prep Time</div>
              <div className="text-sm font-bold text-stone-800 dark:text-stone-200">
                {recipe.prepTimeMinutes} mins
              </div>
            </div>
          </div>

          {/* Cook Time */}
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-amber-50 dark:bg-amber-950/50 text-amber-600 dark:text-amber-400 flex items-center justify-center">
              <Flame className="w-5 h-5" />
            </div>
            <div>
              <div className="text-[11px] font-semibold text-stone-400">Cook Time</div>
              <div className="text-sm font-bold text-stone-800 dark:text-stone-200">
                {recipe.cookTimeMinutes} mins
              </div>
            </div>
          </div>

          {/* Total Time */}
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-50 dark:bg-emerald-950/50 text-emerald-600 dark:text-emerald-400 flex items-center justify-center">
              <Clock className="w-5 h-5" />
            </div>
            <div>
              <div className="text-[11px] font-semibold text-stone-400">Total Time</div>
              <div className="text-sm font-bold text-stone-800 dark:text-stone-200">
                {recipe.totalTimeMinutes} mins
              </div>
            </div>
          </div>

          {/* Servings Stepper */}
          <div className="flex items-center gap-3 bg-stone-50 dark:bg-stone-950/80 p-2 rounded-2xl border border-stone-200/80 dark:border-stone-800">
            <div className="w-8 h-8 rounded-lg bg-stone-200 dark:bg-stone-800 text-stone-700 dark:text-stone-200 flex items-center justify-center">
              <Users className="w-4 h-4" />
            </div>
            <div className="flex-1">
              <div className="text-[10px] font-bold text-stone-400 uppercase">Servings</div>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => handleServingsChange(-1)}
                  disabled={currentServings <= 1}
                  className="w-5 h-5 rounded bg-stone-200 dark:bg-stone-800 hover:bg-stone-300 dark:hover:bg-stone-700 flex items-center justify-center text-xs font-bold disabled:opacity-30"
                >
                  -
                </button>
                <span className="text-sm font-bold text-stone-900 dark:text-stone-100 min-w-4 text-center">
                  {currentServings}
                </span>
                <button
                  type="button"
                  onClick={() => handleServingsChange(1)}
                  className="w-5 h-5 rounded bg-stone-200 dark:bg-stone-800 hover:bg-stone-300 dark:hover:bg-stone-700 flex items-center justify-center text-xs font-bold"
                >
                  +
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Two-Column Content: Ingredients on Left, Steps on Right */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Column (5 cols): Ingredients & Nutrition */}
        <div className="lg:col-span-5 space-y-6">
          <IngredientList
            ingredients={recipe.ingredients}
            currentServings={currentServings}
            originalServings={recipe.servings}
            onApplySwap={handleApplySwap}
          />

          <NutritionCard
            nutrition={recipe.nutritionPerServing}
            currentServings={currentServings}
            originalServings={recipe.servings}
          />

          {/* Pantry staples notice */}
          {recipe.pantryStaplesNeeded && recipe.pantryStaplesNeeded.length > 0 && (
            <div className="p-4 rounded-2xl bg-stone-100/70 dark:bg-stone-900/60 border border-stone-200 dark:border-stone-800 text-xs text-stone-600 dark:text-stone-400">
              <strong className="text-stone-800 dark:text-stone-200">Basic Staples Assumed on Hand: </strong>
              <span>{recipe.pantryStaplesNeeded.join(', ')}</span>
            </div>
          )}
        </div>

        {/* Right Column (7 cols): Step Checklist with Timers & Focus Mode */}
        <div className="lg:col-span-7 space-y-6">
          <StepChecklist
            steps={recipe.steps}
            recipeTitle={recipe.title}
          />

          {/* Chef's Pro Tips */}
          {recipe.chefTips && recipe.chefTips.length > 0 && (
            <div className="bg-amber-50/60 dark:bg-amber-950/20 rounded-2xl p-6 border border-amber-200/80 dark:border-amber-900/40">
              <h4 className="font-bold text-amber-900 dark:text-amber-200 text-sm sm:text-base flex items-center gap-2 mb-3">
                <ChefHat className="w-5 h-5 text-amber-600 dark:text-amber-400" />
                <span>Executive Chef's Insights & Zero-Waste Tips</span>
              </h4>
              <ul className="space-y-2 text-xs sm:text-sm text-amber-950 dark:text-amber-300 list-disc list-inside">
                {recipe.chefTips.map((tip, i) => (
                  <li key={i} className="leading-relaxed">{tip}</li>
                ))}
              </ul>
            </div>
          )}

          {/* AI Refinement Loop (Stretch Goal) */}
          <div className="no-print">
            <RefinementLoop
              onRefine={onRefine}
              refining={refining}
              refinementsApplied={recipe.refinementsApplied}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
