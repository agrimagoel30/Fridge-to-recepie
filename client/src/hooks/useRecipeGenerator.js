import { useState, useRef, useCallback } from 'react';
import { sanitizeClientRecipe } from '../utils/recipeValidator';

export function useRecipeGenerator({ customApiKey = '', selectedProvider = 'auto' } = {}) {
  const [recipe, setRecipe] = useState(null);
  const [loading, setLoading] = useState(false);
  const [refining, setRefining] = useState(false);
  const [error, setError] = useState(null);
  const [activePrompt, setActivePrompt] = useState('');
  const [providerInfo, setProviderInfo] = useState('');
  const [latencyMs, setLatencyMs] = useState(null);

  // History stack for undo/redo
  const [history, setHistory] = useState([]);

  // Race condition mitigation: monotonic request ID counter & AbortController
  const requestIdRef = useRef(0);
  const abortControllerRef = useRef(null);

  /**
   * Main recipe generation
   */
  const generateRecipe = useCallback(async ({
    prompt,
    dietaryPreferences = [],
    servings = 2,
    simulateFailure = null
  }) => {
    if (!prompt || !prompt.trim()) {
      setError({
        title: 'Empty Fridge Input',
        message: 'Please tell us what ingredients you have in your fridge or pantry to cook with.',
        canRetry: false
      });
      return;
    }

    // 1. Cancel previous in-flight request if any
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }

    // 2. Increment request ID and create new controller
    const thisRequestId = ++requestIdRef.current;
    const controller = new AbortController();
    abortControllerRef.current = controller;

    setLoading(true);
    setError(null);
    setActivePrompt(prompt);

    // Timeout guard (30 seconds)
    const timeoutId = setTimeout(() => {
      if (requestIdRef.current === thisRequestId) {
        controller.abort();
      }
    }, 30000);

    try {
      const response = await fetch('/api/recipe/generate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          prompt,
          dietaryPreferences,
          servings,
          provider: selectedProvider,
          apiKey: customApiKey,
          simulateFailure
        }),
        signal: controller.signal
      });

      clearTimeout(timeoutId);

      // 3. Stale Response Guard: if user triggered another action, discard this response
      if (thisRequestId !== requestIdRef.current) {
        console.warn(`[Stale Response Discarded] Ignored response for request #${thisRequestId}`);
        return;
      }

      const result = await response.json().catch(parseErr => ({
        success: false,
        error: `Invalid server response (HTTP ${response.status}): ${parseErr.message}`
      }));

      if (!response.ok || !result.success) {
        throw {
          title: result.isSimulated ? 'Simulated AI Failure' : 'Recipe Generation Issue',
          message: result.error || 'Failed to generate recipe from AI model',
          rawOutput: result.rawOutput,
          issues: result.issues,
          canRetry: true
        };
      }

      // Sanitize data defensively
      const cleanRecipe = sanitizeClientRecipe(result.data);

      setRecipe(cleanRecipe);
      setHistory(prev => [...prev, cleanRecipe]);
      setProviderInfo(result.provider || 'AI Kitchen Assistant');
      setLatencyMs(result.latencyMs || null);
      setError(null);
    } catch (err) {
      clearTimeout(timeoutId);

      // Check if stale request was superseded
      if (thisRequestId !== requestIdRef.current) {
        return;
      }

      if (err.name === 'AbortError') {
        setError({
          title: 'Request Timed Out or Cancelled',
          message: 'The AI model took longer than 30 seconds to reply or the request was cancelled.',
          canRetry: true
        });
      } else {
        setError({
          title: err.title || 'Error Contacting Kitchen AI',
          message: err.message || 'An unexpected network error occurred.',
          rawOutput: err.rawOutput,
          issues: err.issues,
          canRetry: true
        });
      }
    } finally {
      if (thisRequestId === requestIdRef.current) {
        setLoading(false);
      }
    }
  }, [customApiKey, selectedProvider]);

  /**
   * Refinement loop: edits existing recipe without clearing UI
   */
  const refineRecipe = useCallback(async (refinementPrompt) => {
    if (!recipe || !refinementPrompt || !refinementPrompt.trim()) return;

    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }

    const thisRequestId = ++requestIdRef.current;
    const controller = new AbortController();
    abortControllerRef.current = controller;

    setRefining(true);
    setError(null);

    try {
      const response = await fetch('/api/recipe/refine', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          currentRecipe: recipe,
          refinementPrompt: refinementPrompt.trim(),
          provider: selectedProvider,
          apiKey: customApiKey
        }),
        signal: controller.signal
      });

      if (thisRequestId !== requestIdRef.current) return;

      const result = await response.json();
      if (!response.ok || !result.success) {
        throw new Error(result.error || 'Failed to apply recipe refinement');
      }

      const updatedRecipe = sanitizeClientRecipe(result.data);
      setRecipe(updatedRecipe);
      setHistory(prev => [...prev, updatedRecipe]);
    } catch (err) {
      if (thisRequestId !== requestIdRef.current) return;
      if (err.name !== 'AbortError') {
        setError({
          title: 'Refinement Failed',
          message: err.message || 'Could not update the recipe with your requested tweaks.',
          canRetry: false
        });
      }
    } finally {
      if (thisRequestId === requestIdRef.current) {
        setRefining(false);
      }
    }
  }, [recipe, customApiKey, selectedProvider]);

  /**
   * Allows direct client-side state manipulation (e.g. ingredient swap or servicing scale)
   */
  const updateRecipeLocally = useCallback((updater) => {
    setRecipe(prev => {
      const next = typeof updater === 'function' ? updater(prev) : updater;
      return next;
    });
  }, []);

  /**
   * Reset / clear current recipe to return to clean fridge input
   */
  const resetRecipe = useCallback(() => {
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }
    setRecipe(null);
    setError(null);
    setActivePrompt('');
  }, []);

  return {
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
    resetRecipe,
    history
  };
}
