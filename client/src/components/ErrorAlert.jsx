import React, { useState } from 'react';
import { AlertCircle, RefreshCw, ChevronDown, ChevronUp, X, ShieldAlert } from 'lucide-react';

export function ErrorAlert({ error, onRetry, onDismiss }) {
  const [showDetails, setShowDetails] = useState(false);

  if (!error) return null;

  return (
    <div className="w-full max-w-4xl mx-auto mb-6 p-5 rounded-3xl bg-red-50/90 dark:bg-red-950/40 border border-red-200 dark:border-red-900/60 shadow-lg text-red-900 dark:text-red-200 animate-in fade-in duration-200">
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-start gap-3">
          <div className="w-9 h-9 rounded-xl bg-red-100 dark:bg-red-900/60 text-red-600 dark:text-red-400 flex items-center justify-center shrink-0 mt-0.5">
            <AlertCircle className="w-5 h-5" />
          </div>

          <div>
            <h4 className="font-bold text-base text-red-900 dark:text-red-100">
              {error.title || 'Cooking AI Encountered an Issue'}
            </h4>
            <p className="text-xs sm:text-sm text-red-700 dark:text-red-300 mt-1 leading-relaxed">
              {error.message}
            </p>

            {/* Action buttons */}
            <div className="mt-3 flex items-center gap-2 flex-wrap">
              {error.canRetry && onRetry && (
                <button
                  type="button"
                  onClick={onRetry}
                  className="inline-flex items-center gap-1.5 px-3.5 py-1.5 bg-red-600 hover:bg-red-700 text-white rounded-xl text-xs font-bold transition shadow-xs"
                >
                  <RefreshCw className="w-3.5 h-3.5" />
                  <span>Try Again</span>
                </button>
              )}

              {(error.rawOutput || error.issues) && (
                <button
                  type="button"
                  onClick={() => setShowDetails(!showDetails)}
                  className="inline-flex items-center gap-1 px-3 py-1.5 bg-red-100 dark:bg-red-900/40 hover:bg-red-200 dark:hover:bg-red-900/70 text-red-800 dark:text-red-200 rounded-xl text-xs font-semibold transition"
                >
                  <span>{showDetails ? 'Hide Diagnostics' : 'Inspect AI Output Diagnostics'}</span>
                  {showDetails ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
                </button>
              )}
            </div>

            {/* Diagnostic viewer */}
            {showDetails && (
              <div className="mt-3 p-3 rounded-xl bg-stone-900 text-stone-200 text-xs font-mono overflow-x-auto max-h-48 border border-stone-800">
                <div className="text-[10px] text-stone-400 font-bold uppercase mb-1">
                  Raw Output Received:
                </div>
                <pre>{typeof error.rawOutput === 'object' ? JSON.stringify(error.rawOutput, null, 2) : String(error.rawOutput)}</pre>

                {error.issues && (
                  <div className="mt-2 pt-2 border-t border-stone-800">
                    <div className="text-[10px] text-amber-400 font-bold uppercase mb-1">
                      Schema Validation Issues:
                    </div>
                    <pre>{JSON.stringify(error.issues, null, 2)}</pre>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>

        {onDismiss && (
          <button
            type="button"
            onClick={onDismiss}
            className="p-1 rounded-lg text-red-400 hover:text-red-700 dark:hover:text-red-100 transition"
          >
            <X className="w-4 h-4" />
          </button>
        )}
      </div>
    </div>
  );
}
