import React, { useState } from 'react';
import { scaleAmount, formatCulinaryQuantity } from '../utils/unitScaler';
import { RefreshCw, CheckCircle2, Circle, Sparkles, Info, X } from 'lucide-react';

export function IngredientList({
  ingredients = [],
  currentServings = 2,
  originalServings = 2,
  onApplySwap
}) {
  const [checkedIds, setCheckedIds] = useState(new Set());
  const [activeSwapIngId, setActiveSwapIngId] = useState(null);

  const toggleCheck = (id) => {
    setCheckedIds(prev => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const activeIngredientForSwap = ingredients.find(ing => ing.id === activeSwapIngId);

  return (
    <div className="bg-white dark:bg-stone-900 rounded-2xl p-6 border border-stone-200/80 dark:border-stone-800 shadow-sm relative">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h3 className="text-lg font-bold text-stone-900 dark:text-stone-100 flex items-center gap-2">
            <span>Ingredients & Pantry</span>
            <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-stone-100 dark:bg-stone-800 text-stone-600 dark:text-stone-400">
              {ingredients.length} items
            </span>
          </h3>
          <p className="text-xs text-stone-500 dark:text-stone-400">
            Check off items as you prep. Click "Swap" to replace with alternatives.
          </p>
        </div>

        {/* Counter Check Summary */}
        <div className="text-xs font-medium text-stone-500 dark:text-stone-400">
          Ready: <strong className="text-orange-600 dark:text-orange-400">{checkedIds.size}</strong>/{ingredients.length}
        </div>
      </div>

      {/* Ingredient Items */}
      <ul className="space-y-2.5">
        {ingredients.map((ing) => {
          const isChecked = checkedIds.has(ing.id);
          const scaledVal = scaleAmount(ing.amount, currentServings, originalServings);
          const formattedQty = formatCulinaryQuantity(scaledVal, ing.unit);
          const hasSwaps = ing.swaps && ing.swaps.length > 0;

          return (
            <li
              key={ing.id}
              className={`group flex items-start justify-between gap-3 p-3 rounded-xl border transition-all ${
                isChecked
                  ? 'bg-stone-50/80 dark:bg-stone-950/40 border-stone-200 dark:border-stone-800/60 opacity-60'
                  : 'bg-white dark:bg-stone-900 border-stone-200/70 dark:border-stone-800 hover:border-orange-200 dark:hover:border-stone-700'
              }`}
            >
              {/* Checkbox & Details */}
              <div
                onClick={() => toggleCheck(ing.id)}
                className="flex items-start gap-3 cursor-pointer select-none flex-1"
              >
                <button
                  type="button"
                  className="mt-0.5 text-stone-400 hover:text-orange-500 transition"
                >
                  {isChecked ? (
                    <CheckCircle2 className="w-5 h-5 text-emerald-500" />
                  ) : (
                    <Circle className="w-5 h-5" />
                  )}
                </button>

                <div>
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className={`font-semibold text-sm sm:text-base ${
                      isChecked ? 'line-through text-stone-400 dark:text-stone-500' : 'text-stone-900 dark:text-stone-100'
                    }`}>
                      <span className="text-orange-600 dark:text-orange-400 font-bold mr-1">
                        {formattedQty} {ing.unit}
                      </span>
                      {ing.name}
                    </span>

                    {ing.isFromFridge && (
                      <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-emerald-50 text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-300 border border-emerald-200/50 dark:border-emerald-900">
                        From Fridge
                      </span>
                    )}
                  </div>

                  {ing.notes && (
                    <p className="text-xs text-stone-500 dark:text-stone-400 mt-0.5">
                      {ing.notes}
                    </p>
                  )}
                </div>
              </div>

              {/* Swap Button if alternatives exist */}
              {hasSwaps && (
                <button
                  type="button"
                  onClick={() => setActiveSwapIngId(ing.id)}
                  className="shrink-0 inline-flex items-center gap-1 px-2.5 py-1 text-xs font-semibold rounded-lg bg-orange-50 hover:bg-orange-100 text-orange-700 dark:bg-orange-950/60 dark:hover:bg-orange-900/80 dark:text-orange-300 border border-orange-200 dark:border-orange-800 transition shadow-xs"
                >
                  <RefreshCw className="w-3 h-3 text-orange-600 dark:text-orange-400" />
                  <span>Swap ({ing.swaps.length})</span>
                </button>
              )}
            </li>
          );
        })}
      </ul>

      {/* Ingredient Swap Modal / Drawer */}
      {activeIngredientForSwap && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs">
          <div className="bg-white dark:bg-stone-900 rounded-3xl max-w-md w-full p-6 shadow-2xl border border-stone-200 dark:border-stone-800 animate-in fade-in zoom-in-95 duration-150">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-full bg-orange-100 dark:bg-orange-950/70 text-orange-600 dark:text-orange-300 flex items-center justify-center">
                  <RefreshCw className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="font-bold text-stone-900 dark:text-stone-100 text-base">
                    Ingredient Substitutes
                  </h4>
                  <p className="text-xs text-stone-500 dark:text-stone-400">
                    Replace <strong className="text-stone-800 dark:text-stone-200">{activeIngredientForSwap.name}</strong>
                  </p>
                </div>
              </div>

              <button
                onClick={() => setActiveSwapIngId(null)}
                className="p-1.5 rounded-full hover:bg-stone-100 dark:hover:bg-stone-800 text-stone-400 hover:text-stone-700 dark:hover:text-stone-200 transition"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-3 mt-4">
              {activeIngredientForSwap.swaps.map((swap, idx) => (
                <div
                  key={idx}
                  className="p-3.5 rounded-2xl border border-stone-200 dark:border-stone-800 hover:border-orange-300 dark:hover:border-orange-800 bg-stone-50/50 dark:bg-stone-950/40 transition flex flex-col justify-between gap-3"
                >
                  <div>
                    <div className="flex items-center justify-between mb-1">
                      <span className="font-bold text-stone-900 dark:text-stone-100 text-sm">
                        {swap.name}
                      </span>
                      <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-amber-100 text-amber-800 dark:bg-amber-950/60 dark:text-amber-300">
                        {swap.ratio || '1:1 ratio'}
                      </span>
                    </div>
                    <p className="text-xs text-stone-600 dark:text-stone-400">
                      {swap.impact}
                    </p>
                  </div>

                  <button
                    type="button"
                    onClick={() => {
                      onApplySwap(activeIngredientForSwap.id, swap);
                      setActiveSwapIngId(null);
                    }}
                    className="w-full py-2 px-3 text-xs font-bold rounded-xl bg-orange-600 hover:bg-orange-700 text-white transition flex items-center justify-center gap-1.5 shadow-sm"
                  >
                    <span>Use this Swap</span>
                  </button>
                </div>
              ))}
            </div>

            <div className="mt-4 pt-3 border-t border-stone-100 dark:border-stone-800 flex justify-end">
              <button
                type="button"
                onClick={() => setActiveSwapIngId(null)}
                className="px-4 py-2 text-xs font-semibold rounded-xl text-stone-600 hover:bg-stone-100 dark:text-stone-400 dark:hover:bg-stone-800 transition"
              >
                Keep Original Ingredient
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
