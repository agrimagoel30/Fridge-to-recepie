import { useState, useEffect, useCallback } from 'react';

const STORAGE_KEY = 'fridge_recipe_saved_collection_v1';

export function useSavedRecipes() {
  const [savedRecipes, setSavedRecipes] = useState(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      return stored ? JSON.parse(stored) : [];
    } catch (e) {
      console.error('Failed to load saved recipes from localStorage:', e);
      return [];
    }
  });

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(savedRecipes));
    } catch (e) {
      console.error('Failed to persist saved recipes to localStorage:', e);
    }
  }, [savedRecipes]);

  const saveRecipe = useCallback((recipe) => {
    if (!recipe || !recipe.id) return;
    setSavedRecipes(prev => {
      if (prev.some(r => r.id === recipe.id)) {
        return prev.map(r => r.id === recipe.id ? { ...recipe, savedAt: Date.now() } : r);
      }
      return [{ ...recipe, savedAt: Date.now() }, ...prev];
    });
  }, []);

  const removeRecipe = useCallback((id) => {
    setSavedRecipes(prev => prev.filter(r => r.id !== id));
  }, []);

  const isSaved = useCallback((id) => {
    return savedRecipes.some(r => r.id === id);
  }, [savedRecipes]);

  const toggleSave = useCallback((recipe) => {
    if (!recipe) return;
    if (isSaved(recipe.id)) {
      removeRecipe(recipe.id);
    } else {
      saveRecipe(recipe);
    }
  }, [isSaved, removeRecipe, saveRecipe]);

  return {
    savedRecipes,
    saveRecipe,
    removeRecipe,
    isSaved,
    toggleSave
  };
}
