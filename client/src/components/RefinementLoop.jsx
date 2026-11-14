import React, { useState } from 'react';
import { Sparkles, Send, Flame, Leaf, Zap, RefreshCw } from 'lucide-react';

const REFINEMENT_SUGGESTIONS = [
  { label: '🔥 Make it spicy', prompt: 'Make this recipe spicier with hot peppers or chili flakes' },
  { label: '🌱 100% Vegan', prompt: 'Convert this into a strictly vegan version with plant-based swaps' },
  { label: '⚡ 15-Min Express', prompt: 'Simplify the steps and cooking time to finish in under 15 minutes' },
  { label: '🧀 Extra Creamy/Cheesy', prompt: 'Make the sauce richer and more velvety or cheesy' },
  { label: '🍳 Air Fryer Version', prompt: 'Adapt the cooking steps for an air fryer instead of stovetop' },
];

export function RefinementLoop({ onRefine, refining = false, refinementsApplied = [] }) {
  const [text, setText] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!text.trim() || refining) return;
    onRefine(text.trim());
    setText('');
  };

  const handleSuggestion = (prompt) => {
    if (refining) return;
    onRefine(prompt);
  };

  return (
    <div className="bg-gradient-to-br from-stone-900 to-stone-800 text-white rounded-3xl p-6 sm:p-8 shadow-xl relative overflow-hidden">
      {/* Decorative background glow */}
      <div className="absolute top-0 right-0 w-64 h-64 bg-orange-500/10 rounded-full blur-3xl pointer-events-none" />

      <div className="relative z-10">
        <div className="flex items-center gap-2 mb-2">
          <div className="w-8 h-8 rounded-xl bg-orange-500/20 text-orange-400 flex items-center justify-center">
            <Sparkles className="w-4 h-4" />
          </div>
          <div>
            <h4 className="font-bold text-base sm:text-lg">
              Refine & Tweak Recipe (AI Feedback Loop)
            </h4>
            <p className="text-xs text-stone-400">
              Ask the chef to adjust heat, dietary constraints, cooking gear, or prep time without losing the dish.
            </p>
          </div>
        </div>

        {/* Refinements applied tag list */}
        {refinementsApplied && refinementsApplied.length > 0 && (
          <div className="my-3 flex items-center gap-2 flex-wrap">
            <span className="text-xs text-stone-400">Applied Tweaks:</span>
            {refinementsApplied.map((ref, idx) => (
              <span
                key={idx}
                className="text-xs px-2.5 py-0.5 rounded-full bg-orange-500/20 text-orange-300 border border-orange-500/30"
              >
                ✓ {ref}
              </span>
            ))}
          </div>
        )}

        {/* Input Form */}
        <form onSubmit={handleSubmit} className="mt-4 flex gap-2">
          <input
            type="text"
            value={text}
            onChange={(e) => setText(e.target.value)}
            disabled={refining}
            placeholder="e.g. 'Can I do this in an air fryer?' or 'Swap heavy cream with Greek yogurt'..."
            className="flex-1 px-4 py-3 bg-stone-800/80 border border-stone-700 rounded-xl text-stone-100 placeholder:text-stone-500 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent text-sm transition"
          />

          <button
            type="submit"
            disabled={refining || !text.trim()}
            className="px-5 py-3 bg-orange-600 hover:bg-orange-500 text-white rounded-xl font-bold text-sm transition flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed shadow-md shadow-orange-600/30"
          >
            {refining ? (
              <>
                <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                <span className="hidden sm:inline">Refining...</span>
              </>
            ) : (
              <>
                <Send className="w-4 h-4" />
                <span className="hidden sm:inline">Refine</span>
              </>
            )}
          </button>
        </form>

        {/* Suggestion Chips */}
        <div className="mt-4 flex items-center gap-2 flex-wrap">
          <span className="text-xs text-stone-400 shrink-0">Quick Tweak:</span>
          {REFINEMENT_SUGGESTIONS.map((item) => (
            <button
              key={item.label}
              type="button"
              disabled={refining}
              onClick={() => handleSuggestion(item.prompt)}
              className="text-xs px-3 py-1.5 rounded-lg bg-stone-800 hover:bg-stone-700 text-stone-300 hover:text-white border border-stone-700 transition disabled:opacity-50"
            >
              {item.label}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
