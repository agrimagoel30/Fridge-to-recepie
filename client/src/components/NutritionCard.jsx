import React from 'react';
import { Activity, Zap, PieChart } from 'lucide-react';

export function NutritionCard({ nutrition, currentServings = 2, originalServings = 2 }) {
  if (!nutrition) return null;

  const ratio = (currentServings || 1) / (originalServings || 1);
  const calories = Math.round(nutrition.calories || 450);
  const protein = Math.round(nutrition.proteinGrams || 20);
  const carbs = Math.round(nutrition.carbsGrams || 45);
  const fat = Math.round(nutrition.fatGrams || 18);
  const fiber = Math.round(nutrition.fiberGrams || 4);

  return (
    <div className="bg-white dark:bg-stone-900 rounded-2xl p-6 border border-stone-200/80 dark:border-stone-800 shadow-sm">
      <div className="flex items-center justify-between mb-4">
        <h4 className="font-bold text-stone-900 dark:text-stone-100 flex items-center gap-2 text-sm sm:text-base">
          <Activity className="w-4 h-4 text-orange-500" />
          <span>Estimated Nutrition (Per Serving)</span>
        </h4>
        <span className="text-[11px] font-semibold text-stone-400">
          AI Estimate
        </span>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-5 gap-3 text-center">
        {/* Calories */}
        <div className="p-3 rounded-xl bg-orange-50/60 dark:bg-orange-950/30 border border-orange-100 dark:border-orange-900/40">
          <div className="text-xl sm:text-2xl font-extrabold text-orange-600 dark:text-orange-400">
            {calories}
          </div>
          <div className="text-[11px] font-medium text-stone-500 dark:text-stone-400">
            Calories
          </div>
        </div>

        {/* Protein */}
        <div className="p-3 rounded-xl bg-blue-50/60 dark:bg-blue-950/30 border border-blue-100 dark:border-blue-900/40">
          <div className="text-xl sm:text-2xl font-extrabold text-blue-600 dark:text-blue-400">
            {protein}g
          </div>
          <div className="text-[11px] font-medium text-stone-500 dark:text-stone-400">
            Protein
          </div>
        </div>

        {/* Carbs */}
        <div className="p-3 rounded-xl bg-amber-50/60 dark:bg-amber-950/30 border border-amber-100 dark:border-amber-900/40">
          <div className="text-xl sm:text-2xl font-extrabold text-amber-600 dark:text-amber-400">
            {carbs}g
          </div>
          <div className="text-[11px] font-medium text-stone-500 dark:text-stone-400">
            Carbs
          </div>
        </div>

        {/* Fats */}
        <div className="p-3 rounded-xl bg-emerald-50/60 dark:bg-emerald-950/30 border border-emerald-100 dark:border-emerald-900/40">
          <div className="text-xl sm:text-2xl font-extrabold text-emerald-600 dark:text-emerald-400">
            {fat}g
          </div>
          <div className="text-[11px] font-medium text-stone-500 dark:text-stone-400">
            Healthy Fats
          </div>
        </div>

        {/* Fiber */}
        <div className="p-3 rounded-xl bg-purple-50/60 dark:bg-purple-950/30 border border-purple-100 dark:border-purple-900/40 col-span-2 sm:col-span-1">
          <div className="text-xl sm:text-2xl font-extrabold text-purple-600 dark:text-purple-400">
            {fiber}g
          </div>
          <div className="text-[11px] font-medium text-stone-500 dark:text-stone-400">
            Dietary Fiber
          </div>
        </div>
      </div>
    </div>
  );
}
