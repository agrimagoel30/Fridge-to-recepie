import React, { useState, useEffect } from 'react';
import { StepTimer } from './StepTimer';
import confetti from 'canvas-confetti';
import { CheckCircle2, Circle, Lightbulb, Flame, Award, Maximize2, Minimize2 } from 'lucide-react';

export function StepChecklist({ steps = [], recipeTitle = '' }) {
  const [completedSteps, setCompletedSteps] = useState(new Set());
  const [isFocusMode, setIsFocusMode] = useState(false);

  // Reset steps when recipe changes
  useEffect(() => {
    setCompletedSteps(new Set());
  }, [steps]);

  const toggleStep = (stepNumber) => {
    setCompletedSteps(prev => {
      const next = new Set(prev);
      if (next.has(stepNumber)) {
        next.delete(stepNumber);
      } else {
        next.add(stepNumber);
        // Trigger celebratory confetti if this is the final step
        if (next.size === steps.length) {
          try {
            confetti({
              particleCount: 120,
              spread: 70,
              origin: { y: 0.6 }
            });
          } catch (e) {
            // Ignore if confetti fails in headless or non-canvas environment
          }
        }
      }
      return next;
    });
  };

  const allCompleted = steps.length > 0 && completedSteps.size === steps.length;
  const progressPercent = steps.length > 0 ? (completedSteps.size / steps.length) * 100 : 0;

  return (
    <div className={`bg-white dark:bg-stone-900 rounded-2xl p-6 border border-stone-200/80 dark:border-stone-800 shadow-sm transition-all ${
      isFocusMode ? 'fixed inset-0 z-50 overflow-y-auto p-6 md:p-12 bg-white dark:bg-stone-950 rounded-none' : ''
    }`}>
      {/* Header & Controls */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-6">
        <div>
          <div className="flex items-center gap-2">
            <h3 className="text-lg sm:text-xl font-bold text-stone-900 dark:text-stone-100 flex items-center gap-2">
              <span>Step-by-Step Cooking Guide</span>
            </h3>
            <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-orange-100 text-orange-800 dark:bg-orange-950/70 dark:text-orange-300">
              {completedSteps.size} of {steps.length} done
            </span>
          </div>
          <p className="text-xs text-stone-500 dark:text-stone-400 mt-0.5">
            Check off steps as you cook. Tap timer to start waiting periods.
          </p>
        </div>

        <div className="flex items-center gap-2">
          {/* Kitchen Focus Mode Toggle */}
          <button
            type="button"
            onClick={() => setIsFocusMode(!isFocusMode)}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold bg-stone-100 hover:bg-stone-200 dark:bg-stone-800 dark:hover:bg-stone-700 text-stone-700 dark:text-stone-300 transition"
          >
            {isFocusMode ? (
              <>
                <Minimize2 className="w-3.5 h-3.5" />
                <span>Exit Focus Mode</span>
              </>
            ) : (
              <>
                <Maximize2 className="w-3.5 h-3.5" />
                <span>Kitchen Hands-Free Mode</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* Progress Bar */}
      <div className="w-full bg-stone-100 dark:bg-stone-800 h-2.5 rounded-full mb-6 overflow-hidden">
        <div
          className="bg-gradient-to-r from-orange-500 to-emerald-500 h-full transition-all duration-300 ease-out"
          style={{ width: `${progressPercent}%` }}
        />
      </div>

      {/* Completion Banner */}
      {allCompleted && (
        <div className="mb-6 p-4 rounded-2xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-300 dark:border-emerald-800 text-emerald-900 dark:text-emerald-200 flex items-center gap-3 animate-in fade-in duration-300">
          <div className="w-10 h-10 rounded-full bg-emerald-500 text-white flex items-center justify-center shrink-0">
            <Award className="w-6 h-6" />
          </div>
          <div>
            <h4 className="font-bold text-sm sm:text-base">Bon Appétit! All Cooking Steps Completed</h4>
            <p className="text-xs text-emerald-700 dark:text-emerald-300">
              Plate your dish, garnish with fresh herbs, and enjoy your zero-waste meal!
            </p>
          </div>
        </div>
      )}

      {/* Steps List */}
      <ol className="space-y-4">
        {steps.map((st) => {
          const isDone = completedSteps.has(st.stepNumber);

          return (
            <li
              key={st.stepNumber}
              className={`p-4 sm:p-5 rounded-2xl border transition-all ${
                isDone
                  ? 'bg-stone-50/70 dark:bg-stone-950/40 border-stone-200 dark:border-stone-800 opacity-60'
                  : 'bg-white dark:bg-stone-900 border-stone-200/80 dark:border-stone-800 hover:border-orange-200 dark:hover:border-stone-700 shadow-xs'
              } ${isFocusMode ? 'text-lg md:text-xl py-6' : ''}`}
            >
              <div className="flex items-start gap-4">
                {/* Step Number & Checkbox Button */}
                <button
                  type="button"
                  onClick={() => toggleStep(st.stepNumber)}
                  className="mt-0.5 shrink-0 select-none group"
                >
                  {isDone ? (
                    <CheckCircle2 className="w-6 h-6 text-emerald-500" />
                  ) : (
                    <div className="w-6 h-6 rounded-full border-2 border-stone-300 dark:border-stone-700 group-hover:border-orange-500 flex items-center justify-center text-xs font-bold text-stone-500 dark:text-stone-400">
                      {st.stepNumber}
                    </div>
                  )}
                </button>

                <div className="flex-1">
                  {/* Step Metadata Pills */}
                  <div className="flex items-center gap-2 mb-1.5 flex-wrap">
                    <span className="text-xs font-bold uppercase tracking-wider text-orange-600 dark:text-orange-400">
                      Step {st.stepNumber}
                    </span>

                    {st.temperature && (
                      <span className="inline-flex items-center gap-1 text-[11px] font-semibold px-2 py-0.5 rounded-full bg-red-50 text-red-700 dark:bg-red-950/60 dark:text-red-300 border border-red-200/40 dark:border-red-900">
                        <Flame className="w-3 h-3" />
                        <span>{st.temperature}</span>
                      </span>
                    )}

                    {st.ingredientsUsed && st.ingredientsUsed.length > 0 && (
                      <span className="text-[11px] text-stone-500 dark:text-stone-400">
                        Uses: <em>{st.ingredientsUsed.join(', ')}</em>
                      </span>
                    )}
                  </div>

                  {/* Instruction Prose */}
                  <p className={`font-medium leading-relaxed ${
                    isDone
                      ? 'line-through text-stone-400 dark:text-stone-500'
                      : 'text-stone-800 dark:text-stone-100'
                  } ${isFocusMode ? 'text-lg sm:text-xl leading-relaxed' : 'text-sm sm:text-base'}`}>
                    {st.instruction}
                  </p>

                  {/* Pro Tip Callout */}
                  {st.proTip && (
                    <div className="mt-3 p-3 rounded-xl bg-amber-50/70 dark:bg-amber-950/30 border border-amber-200/60 dark:border-amber-900/40 text-amber-900 dark:text-amber-200 text-xs flex items-start gap-2">
                      <Lightbulb className="w-4 h-4 text-amber-500 shrink-0 mt-0.5" />
                      <div>
                        <strong className="font-bold">Chef's Pro Tip: </strong>
                        <span>{st.proTip}</span>
                      </div>
                    </div>
                  )}

                  {/* Built-in Step Timer if duration is present */}
                  {st.durationMinutes && st.durationMinutes > 0 && (
                    <StepTimer
                      durationMinutes={st.durationMinutes}
                      stepLabel={`Step ${st.stepNumber} Timer`}
                    />
                  )}
                </div>
              </div>
            </li>
          );
        })}
      </ol>
    </div>
  );
}
