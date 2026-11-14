import React from 'react';
import { ChefHat, Bookmark, Settings, Moon, Sun, ShieldAlert, Sparkles } from 'lucide-react';

export function Navbar({
  savedCount = 0,
  onOpenSaved,
  onOpenSettings,
  onToggleSimulator,
  isSimulatorOpen,
  darkMode,
  setDarkMode,
  onNewRecipe
}) {
  return (
    <header className="sticky top-0 z-40 backdrop-blur-md bg-white/80 dark:bg-stone-900/80 border-b border-stone-200 dark:border-stone-800 transition-colors">
      <div className="max-w-6xl mx-auto px-4 h-16 flex items-center justify-between">
        {/* Brand / Logo */}
        <div 
          onClick={onNewRecipe}
          className="flex items-center gap-3 cursor-pointer group"
        >
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-orange-500 to-amber-400 flex items-center justify-center text-white shadow-md shadow-orange-500/20 group-hover:scale-105 transition">
            <ChefHat className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-bold text-lg tracking-tight bg-gradient-to-r from-stone-900 via-orange-800 to-stone-900 dark:from-white dark:via-orange-300 dark:to-white bg-clip-text text-transparent">
                Fridge to Recipe
              </span>
              <span className="hidden sm:inline-block px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider bg-orange-100 text-orange-700 dark:bg-orange-950/60 dark:text-orange-300 rounded-full">
                AI Chef
              </span>
            </div>
            <p className="hidden sm:block text-xs text-stone-500 dark:text-stone-400">
              Zero Waste • Smart Substitutions • Step Timers
            </p>
          </div>
        </div>

        {/* Action Controls */}
        <div className="flex items-center gap-2">
          {/* AI Output Robustness Tester button for reviewer */}
          <button
            onClick={onToggleSimulator}
            title="AI Robustness & Failure Mode Tester"
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold border transition ${
              isSimulatorOpen
                ? 'bg-purple-100 text-purple-700 border-purple-300 dark:bg-purple-950/70 dark:text-purple-300 dark:border-purple-800'
                : 'bg-stone-100 text-stone-700 hover:bg-stone-200 border-stone-200 dark:bg-stone-800 dark:text-stone-300 dark:border-stone-700'
            }`}
          >
            <ShieldAlert className="w-3.5 h-3.5 text-purple-600 dark:text-purple-400" />
            <span className="hidden md:inline">Bad AI Output</span> Studio
          </button>

          {/* Saved Recipes count button */}
          <button
            onClick={onOpenSaved}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium bg-stone-100 hover:bg-stone-200 text-stone-700 dark:bg-stone-800 dark:hover:bg-stone-700 dark:text-stone-300 border border-stone-200 dark:border-stone-700 transition"
          >
            <Bookmark className="w-3.5 h-3.5 text-orange-500" />
            <span className="hidden sm:inline">Saved</span>
            {savedCount > 0 && (
              <span className="px-1.5 py-0.2 bg-orange-500 text-white rounded-full text-[10px] font-bold">
                {savedCount}
              </span>
            )}
          </button>

          {/* Settings Modal (API Key, Provider) */}
          <button
            onClick={onOpenSettings}
            title="Configure LLM Provider & Key"
            className="p-2 rounded-lg text-stone-600 hover:text-stone-900 hover:bg-stone-100 dark:text-stone-400 dark:hover:text-stone-100 dark:hover:bg-stone-800 transition"
          >
            <Settings className="w-4 h-4" />
          </button>

          {/* Dark Mode Toggle */}
          <button
            onClick={() => setDarkMode(!darkMode)}
            title={darkMode ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
            className="p-2 rounded-lg text-stone-600 hover:text-stone-900 hover:bg-stone-100 dark:text-stone-400 dark:hover:text-stone-100 dark:hover:bg-stone-800 transition"
          >
            {darkMode ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4 text-stone-600" />}
          </button>
        </div>
      </div>
    </header>
  );
}
