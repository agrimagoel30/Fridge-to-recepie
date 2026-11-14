import React, { useState, useEffect } from 'react';
import { Navbar } from './components/Navbar';
import { FridgeInput } from './components/FridgeInput';
import { RecipeDisplay } from './components/RecipeDisplay';
import { ErrorAlert } from './components/ErrorAlert';
import { SettingsModal } from './components/SettingsModal';
import { SavedRecipesModal } from './components/SavedRecipesModal';
import { BadOutputSimulator } from './components/BadOutputSimulator';
import { useRecipeGenerator } from './hooks/useRecipeGenerator';
import { useSavedRecipes } from './hooks/useSavedRecipes';
import { ChefHat, ShieldCheck, Heart, Sparkles } from 'lucide-react';

export function App() {
  // Dark mode toggle
  const [darkMode, setDarkMode] = useState(() => {
    try {
      const stored = localStorage.getItem('fridge_theme');
      if (stored) return stored === 'dark';
      return window.matchMedia('(prefers-color-scheme: dark)').matches;
    } catch {
      return false;
    }
  });

  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark');
      localStorage.setItem('fridge_theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('fridge_theme', 'light');
    }
  }, [darkMode]);

  // Provider and API key settings
  const [selectedProvider, setSelectedProvider] = useState('auto');
  const [customApiKey, setCustomApiKey] = useState('');

  // Modals
  const [isSavedOpen, setIsSavedOpen] = useState(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [isSimulatorOpen, setIsSimulatorOpen] = useState(false);

  // Saved recipes hook
  const { savedRecipes, isSaved, toggleSave, removeRecipe } = useSavedRecipes();

  // Recipe Generator hook with race-condition prevention & Zod sanitation
  const {
    recipe,
    setRecipe,
    loading,
    refining,
    error,
    activePrompt,
    providerInfo,
    latencyMs,
    generateRecipe,
    refineRecipe,
    updateRecipeLocally,
    resetRecipe
  } = useRecipeGenerator({
    customApiKey,
    selectedProvider
  });

  // Handler for Bad AI Output Simulator
  const handleRunSimulation = (failureType) => {
    generateRecipe({
      prompt: activePrompt || 'Eggs, cheese, leftover rice',
      simulateFailure: failureType
    });
  };

  // Handler for Race Condition Test
  const handleRunRaceConditionTest = async () => {
    // 1. Dispatch Request 1 with slow delay
    generateRecipe({
      prompt: 'Request 1: Slow Cooked 12-Hour Beef Bourguignon',
      simulateFailure: 'slow_timeout'
    });

    // 2. Immediately dispatch Request 2 (Quick breakfast toast)
    setTimeout(() => {
      generateRecipe({
        prompt: 'Request 2: 2-Minute Quick Avocado Toast'
      });
    }, 200);
  };

  return (
    <div className="min-h-screen flex flex-col bg-stone-50 text-stone-900 dark:bg-stone-950 dark:text-stone-100 transition-colors">
      {/* Header Navigation */}
      <Navbar
        savedCount={savedRecipes.length}
        onOpenSaved={() => setIsSavedOpen(true)}
        onOpenSettings={() => setIsSettingsOpen(true)}
        onToggleSimulator={() => setIsSimulatorOpen(prev => !prev)}
        isSimulatorOpen={isSimulatorOpen}
        darkMode={darkMode}
        setDarkMode={setDarkMode}
        onNewRecipe={resetRecipe}
      />

      {/* Main Container */}
      <main className="flex-1 max-w-6xl w-full mx-auto px-4 py-8 sm:py-12">
        {/* Error / AI Failure Alert Banner */}
        {error && (
          <ErrorAlert
            error={error}
            onRetry={() => {
              if (activePrompt) {
                generateRecipe({ prompt: activePrompt });
              }
            }}
            onDismiss={() => {}}
          />
        )}

        {/* View Switch: Recipe Display vs Fridge Input */}
        {recipe ? (
          <RecipeDisplay
            recipe={recipe}
            onReset={resetRecipe}
            onRefine={refineRecipe}
            refining={refining}
            isSaved={isSaved(recipe.id)}
            onToggleSave={toggleSave}
            onUpdateRecipe={updateRecipeLocally}
            providerInfo={providerInfo}
            latencyMs={latencyMs}
          />
        ) : (
          <FridgeInput
            onSubmit={generateRecipe}
            loading={loading}
            initialText={activePrompt}
          />
        )}
      </main>

      {/* Footer */}
      <footer className="border-t border-stone-200/80 dark:border-stone-800 py-6 px-4 text-center text-xs text-stone-500 dark:text-stone-400 no-print">
        <div className="max-w-6xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="flex items-center gap-1.5 font-medium">
            <ChefHat className="w-4 h-4 text-orange-500" />
            <span>Fridge-to-Recipe AI Cooking Assistant</span>
          </div>
          <div className="flex items-center gap-4">
            <span className="flex items-center gap-1">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-500" />
              <span>Strict Zod Schema & Race-Condition Safe</span>
            </span>
            <span>•</span>
            <span>Built for Flam Assignment</span>
          </div>
        </div>
      </footer>

      {/* Modals & Panels */}
      <SavedRecipesModal
        isOpen={isSavedOpen}
        onClose={() => setIsSavedOpen(false)}
        savedRecipes={savedRecipes}
        onSelectRecipe={(r) => setRecipe(r)}
        onRemoveRecipe={removeRecipe}
      />

      <SettingsModal
        isOpen={isSettingsOpen}
        onClose={() => setIsSettingsOpen(false)}
        customApiKey={customApiKey}
        setCustomApiKey={setCustomApiKey}
        selectedProvider={selectedProvider}
        setSelectedProvider={setSelectedProvider}
      />

      <BadOutputSimulator
        isOpen={isSimulatorOpen}
        onClose={() => setIsSimulatorOpen(false)}
        onRunSimulation={handleRunSimulation}
        onRunRaceConditionTest={handleRunRaceConditionTest}
      />
    </div>
  );
}

export default App;
