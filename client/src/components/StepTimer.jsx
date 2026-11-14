import React from 'react';
import { useStepTimer } from '../hooks/useStepTimer';
import { Play, Pause, RotateCcw, Bell, Check } from 'lucide-react';

export function StepTimer({ durationMinutes = 5, stepLabel = 'Step Timer' }) {
  const {
    isRunning,
    isCompleted,
    startTimer,
    pauseTimer,
    resetTimer,
    formattedTime,
    progressPercentage
  } = useStepTimer(durationMinutes);

  return (
    <div className={`mt-3 p-3 rounded-xl border transition-all ${
      isCompleted
        ? 'bg-emerald-50 dark:bg-emerald-950/40 border-emerald-300 dark:border-emerald-800'
        : isRunning
        ? 'bg-amber-50/70 dark:bg-amber-950/30 border-amber-300 dark:border-amber-800'
        : 'bg-stone-50 dark:bg-stone-950 border-stone-200 dark:border-stone-800'
    }`}>
      <div className="flex items-center justify-between gap-3">
        {/* Timer Label & Digital Display */}
        <div className="flex items-center gap-2.5">
          <div className={`w-7 h-7 rounded-lg flex items-center justify-center ${
            isCompleted
              ? 'bg-emerald-500 text-white animate-bounce'
              : isRunning
              ? 'bg-amber-500 text-white animate-pulse'
              : 'bg-stone-200 dark:bg-stone-800 text-stone-600 dark:text-stone-300'
          }`}>
            {isCompleted ? <Check className="w-4 h-4" /> : <Bell className="w-3.5 h-3.5" />}
          </div>
          <div>
            <div className="text-[10px] font-bold uppercase tracking-wider text-stone-500 dark:text-stone-400">
              {stepLabel} ({durationMinutes} min)
            </div>
            <div className="text-base font-mono font-bold text-stone-900 dark:text-stone-100">
              {formattedTime}
            </div>
          </div>
        </div>

        {/* Action Controls */}
        <div className="flex items-center gap-1.5">
          {isRunning ? (
            <button
              type="button"
              onClick={pauseTimer}
              className="p-1.5 rounded-lg bg-stone-200 dark:bg-stone-800 text-stone-700 dark:text-stone-200 hover:bg-stone-300 transition"
              title="Pause"
            >
              <Pause className="w-3.5 h-3.5" />
            </button>
          ) : (
            <button
              type="button"
              onClick={startTimer}
              disabled={isCompleted}
              className="p-1.5 rounded-lg bg-orange-600 hover:bg-orange-700 text-white transition disabled:opacity-40"
              title="Start Timer"
            >
              <Play className="w-3.5 h-3.5" />
            </button>
          )}

          <button
            type="button"
            onClick={resetTimer}
            className="p-1.5 rounded-lg text-stone-400 hover:text-stone-700 dark:hover:text-stone-200 transition"
            title="Reset"
          >
            <RotateCcw className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Mini Progress Bar */}
      <div className="w-full bg-stone-200 dark:bg-stone-800 h-1.5 rounded-full mt-2.5 overflow-hidden">
        <div
          className={`h-full transition-all duration-300 ${
            isCompleted
              ? 'bg-emerald-500'
              : isRunning
              ? 'bg-amber-500'
              : 'bg-orange-500'
          }`}
          style={{ width: `${Math.min(100, progressPercentage)}%` }}
        />
      </div>
    </div>
  );
}
