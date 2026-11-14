import React, { useState } from 'react';
import { Sparkles, Plus, Trash2, ArrowRight, Utensils, Clock, Flame } from 'lucide-react';

const COMMON_PANTRY_ITEMS = [
  '🥚 Eggs',
  '🧀 Cheese',
  '🧅 Onions',
  '🍚 Rice',
  '🍅 Tomatoes',
  '🍗 Chicken',
  '🧄 Garlic',
  '🥛 Milk',
  '🥔 Potatoes',
  '🥦 Broccoli',
  '🍞 Bread',
  '🧈 Butter'
];

const PRESET_STORIES = [
  {
    name: 'Midnight Fried Rice',
    ingredients: '3 cold eggs, leftover jasmine rice, 1 yellow onion, 2 tbsp soy sauce, sesame oil',
    diet: ['Vegetarian Option', 'Quick']
  },
  {
    name: 'Rustic Pasta Night',
    ingredients: 'Spaghetti, cherry tomatoes, garlic cloves, parmesan cheese, olive oil',
    diet: ['Vegetarian']
  },
  {
    name: 'Pantry Cleanout Bowl',
    ingredients: 'Canned black beans, bell pepper, avocado, lime, leftover corn, cilantro',
    diet: ['Vegan', 'Gluten-Free']
  }
];

const DIETARY_OPTIONS = [
  'Vegetarian',
  'Vegan',
  'Gluten-Free',
  'Dairy-Free',
  'High-Protein',
  'Under 20 Mins'
];

export function FridgeInput({
  onSubmit,
  loading = false,
  initialText = ''
}) {
  const [text, setText] = useState(initialText);
  const [selectedDiets, setSelectedDiets] = useState([]);
  const [targetServings, setTargetServings] = useState(2);

  const handleAddChip = (chip) => {
    // Strip emoji if present
    const clean = chip.replace(/[\u{1F300}-\u{1F9FF}]/gu, '').trim();
    if (text.toLowerCase().includes(clean.toLowerCase())) return;
    setText(prev => {
      const trimmed = prev.trim();
      return trimmed ? `${trimmed}, ${clean}` : clean;
    });
  };

  const toggleDiet = (diet) => {
    setSelectedDiets(prev =>
      prev.includes(diet) ? prev.filter(d => d !== diet) : [...prev, diet]
    );
  };

  const handleApplyPreset = (preset) => {
    setText(preset.ingredients);
    setSelectedDiets(preset.diet);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!text.trim() || loading) return;
    onSubmit({
      prompt: text.trim(),
      dietaryPreferences: selectedDiets,
      servings: targetServings
    });
  };

  return (
    <div className="w-full max-w-4xl mx-auto">
      {/* Hero Header */}
      <div className="text-center mb-8">
        <div className="inline-flex items-center gap-2 px-3 py-1 bg-orange-100 text-orange-800 dark:bg-orange-950/70 dark:text-orange-300 rounded-full text-xs font-semibold mb-3">
          <Sparkles className="w-3.5 h-3.5" />
          <span>Transform Leftovers into Culinary Masterpieces</span>
        </div>
        <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold tracking-tight font-['Playfair_Display',serif] text-stone-900 dark:text-stone-100 mb-3">
          What is in your fridge today?
        </h1>
        <p className="text-stone-600 dark:text-stone-400 max-w-xl mx-auto text-sm sm:text-base">
          Type or paste your random ingredients. Our AI chef creates a structured step-by-step recipe with scalable portions and smart substitutions.
        </p>
      </div>

      {/* Main Input Card */}
      <div className="bg-white dark:bg-stone-900 rounded-3xl shadow-xl shadow-stone-200/50 dark:shadow-stone-950/50 border border-stone-200/80 dark:border-stone-800 p-6 sm:p-8">
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Text Area */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <label htmlFor="fridge-input" className="text-sm font-bold text-stone-700 dark:text-stone-300 flex items-center gap-2">
                <Utensils className="w-4 h-4 text-orange-500" />
                <span>Your Available Ingredients</span>
              </label>
              {text && (
                <button
                  type="button"
                  onClick={() => setText('')}
                  className="text-xs text-stone-400 hover:text-red-500 flex items-center gap-1 transition"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                  Clear
                </button>
              )}
            </div>

            <div className="relative">
              <textarea
                id="fridge-input"
                rows={4}
                value={text}
                onChange={(e) => setText(e.target.value)}
                placeholder="e.g. 3 eggs, half a red onion, cup of leftover rice, cheddar cheese, splash of soy sauce, 2 cloves garlic..."
                className="w-full px-4 py-3.5 bg-stone-50 dark:bg-stone-950 border border-stone-300 dark:border-stone-800 rounded-2xl text-stone-900 dark:text-stone-100 placeholder:text-stone-400 focus:outline-none focus:ring-2 focus:ring-orange-500/40 focus:border-orange-500 transition resize-none text-base sm:text-lg"
              />
            </div>
          </div>

          {/* Quick Item Tag Buttons */}
          <div>
            <div className="text-xs font-semibold text-stone-500 dark:text-stone-400 mb-2">
              Quick Add Pantry Staples:
            </div>
            <div className="flex flex-wrap gap-1.5 sm:gap-2">
              {COMMON_PANTRY_ITEMS.map((item) => (
                <button
                  key={item}
                  type="button"
                  onClick={() => handleAddChip(item)}
                  className="inline-flex items-center gap-1 px-2.5 py-1 text-xs rounded-full bg-stone-100 hover:bg-orange-50 hover:text-orange-700 hover:border-orange-200 dark:bg-stone-800 dark:hover:bg-stone-700 text-stone-700 dark:text-stone-300 border border-stone-200 dark:border-stone-700 transition"
                >
                  <Plus className="w-3 h-3 text-stone-400" />
                  <span>{item}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Dietary Filters & Servings Grid */}
          <div className="pt-2 border-t border-stone-100 dark:border-stone-800/80 grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="md:col-span-2">
              <label className="text-xs font-semibold text-stone-500 dark:text-stone-400 block mb-2">
                Dietary Preferences (Optional)
              </label>
              <div className="flex flex-wrap gap-1.5">
                {DIETARY_OPTIONS.map((diet) => {
                  const isSelected = selectedDiets.includes(diet);
                  return (
                    <button
                      key={diet}
                      type="button"
                      onClick={() => toggleDiet(diet)}
                      className={`px-3 py-1 rounded-xl text-xs font-medium transition ${
                        isSelected
                          ? 'bg-orange-600 text-white shadow-sm'
                          : 'bg-stone-100 dark:bg-stone-800 text-stone-600 dark:text-stone-400 hover:bg-stone-200 dark:hover:bg-stone-700'
                      }`}
                    >
                      {diet}
                    </button>
                  );
                })}
              </div>
            </div>

            <div>
              <label className="text-xs font-semibold text-stone-500 dark:text-stone-400 block mb-2">
                Initial Servings
              </label>
              <div className="flex items-center gap-2">
                {[1, 2, 4, 6].map((num) => (
                  <button
                    key={num}
                    type="button"
                    onClick={() => setTargetServings(num)}
                    className={`flex-1 py-1 rounded-xl text-xs font-bold transition ${
                      targetServings === num
                        ? 'bg-stone-900 text-white dark:bg-white dark:text-stone-900'
                        : 'bg-stone-100 dark:bg-stone-800 text-stone-600 dark:text-stone-400 hover:bg-stone-200'
                    }`}
                  >
                    {num} {num === 1 ? 'serving' : 'servings'}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Action Row */}
          <div className="pt-2 flex flex-col sm:flex-row items-center justify-between gap-4">
            {/* Quick Demo Preset Pills */}
            <div className="flex items-center gap-1.5 w-full sm:w-auto overflow-x-auto pb-1 sm:pb-0">
              <span className="text-xs font-semibold text-stone-400 shrink-0">Try Preset:</span>
              {PRESET_STORIES.map(p => (
                <button
                  key={p.name}
                  type="button"
                  onClick={() => handleApplyPreset(p)}
                  className="shrink-0 px-2.5 py-1 text-xs rounded-lg bg-orange-50 text-orange-700 border border-orange-200/60 dark:bg-orange-950/40 dark:text-orange-300 dark:border-orange-900/60 hover:bg-orange-100 transition"
                >
                  {p.name}
                </button>
              ))}
            </div>

            {/* Submit button */}
            <button
              type="submit"
              disabled={loading || !text.trim()}
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2.5 px-8 py-3.5 bg-gradient-to-r from-orange-600 via-amber-600 to-orange-600 hover:from-orange-500 hover:to-amber-500 text-white rounded-2xl font-bold shadow-lg shadow-orange-500/25 transition disabled:opacity-50 disabled:cursor-not-allowed group"
            >
              {loading ? (
                <>
                  <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  <span>Chef is Thinking...</span>
                </>
              ) : (
                <>
                  <Flame className="w-5 h-5 group-hover:scale-110 transition" />
                  <span>Generate Recipe</span>
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition" />
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
