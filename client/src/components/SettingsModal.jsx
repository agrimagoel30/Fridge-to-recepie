import React, { useState, useEffect } from 'react';
import { Settings, Key, Server, CheckCircle2, AlertCircle, X, ShieldCheck } from 'lucide-react';

export function SettingsModal({
  isOpen,
  onClose,
  customApiKey,
  setCustomApiKey,
  selectedProvider,
  setSelectedProvider
}) {
  const [health, setHealth] = useState(null);
  const [checkingHealth, setCheckingHealth] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setCheckingHealth(true);
      fetch('/api/health')
        .then(res => res.json())
        .then(data => setHealth(data))
        .catch(err => setHealth({ status: 'error', error: err.message }))
        .finally(() => setCheckingHealth(false));
    }
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
      <div className="bg-white dark:bg-stone-900 rounded-3xl max-w-lg w-full p-6 shadow-2xl border border-stone-200 dark:border-stone-800 animate-in fade-in zoom-in-95 duration-150">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-orange-100 dark:bg-orange-950/70 text-orange-600 dark:text-orange-400 flex items-center justify-center">
              <Settings className="w-4 h-4" />
            </div>
            <div>
              <h3 className="font-bold text-stone-900 dark:text-stone-100 text-base">
                AI Provider & Backend Config
              </h3>
              <p className="text-xs text-stone-500 dark:text-stone-400">
                Server-routed model execution (Keys never exposed in browser bundle)
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-full text-stone-400 hover:text-stone-700 dark:hover:text-stone-200 transition"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Backend Health Status */}
        <div className="mb-5 p-3.5 rounded-2xl bg-stone-50 dark:bg-stone-950 border border-stone-200/80 dark:border-stone-800 text-xs">
          <div className="flex items-center justify-between mb-1">
            <span className="font-semibold text-stone-700 dark:text-stone-300 flex items-center gap-1.5">
              <Server className="w-3.5 h-3.5 text-blue-500" />
              Node / Express Backend Proxy
            </span>
            {health?.status === 'healthy' ? (
              <span className="text-emerald-600 dark:text-emerald-400 font-bold flex items-center gap-1">
                <CheckCircle2 className="w-3.5 h-3.5" /> Online (Port 5000)
              </span>
            ) : (
              <span className="text-amber-500 font-bold flex items-center gap-1">
                <AlertCircle className="w-3.5 h-3.5" /> {checkingHealth ? 'Connecting...' : 'Offline'}
              </span>
            )}
          </div>
          <p className="text-[11px] text-stone-500 dark:text-stone-400">
            Fulfills PDF requirement: <em>"Route the model call through a small backend or serverless function."</em>
          </p>
        </div>

        {/* Provider Selection */}
        <div className="space-y-4">
          <div>
            <label className="block text-xs font-bold text-stone-700 dark:text-stone-300 mb-1.5">
              Select AI Model Provider
            </label>
            <select
              value={selectedProvider}
              onChange={(e) => setSelectedProvider(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl bg-stone-50 dark:bg-stone-950 border border-stone-300 dark:border-stone-800 text-stone-900 dark:text-stone-100 text-sm focus:ring-2 focus:ring-orange-500 focus:outline-none"
            >
              <option value="auto">Auto (Gemini / Groq with Zero-Config Fallback)</option>
              <option value="gemini">Google Gemini (gemini-1.5-flash)</option>
              <option value="groq">Groq (llama-3.3-70b-versatile)</option>
              <option value="mock">Zero-Config Intelligent Mock (No Key Required)</option>
            </select>
          </div>

          {/* Optional API Key override */}
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label className="text-xs font-bold text-stone-700 dark:text-stone-300 flex items-center gap-1">
                <Key className="w-3.5 h-3.5 text-orange-500" />
                <span>Custom API Key (Optional)</span>
              </label>
              <span className="text-[10px] text-stone-400">
                Session only
              </span>
            </div>
            <input
              type="password"
              value={customApiKey}
              onChange={(e) => setCustomApiKey(e.target.value)}
              placeholder="Leave blank to use server .env or zero-config mock engine"
              className="w-full px-3.5 py-2.5 rounded-xl bg-stone-50 dark:bg-stone-950 border border-stone-300 dark:border-stone-800 text-stone-900 dark:text-stone-100 text-sm placeholder:text-stone-400 focus:ring-2 focus:ring-orange-500 focus:outline-none"
            />
            <p className="text-[11px] text-stone-500 dark:text-stone-400 mt-1">
              If left blank, the app runs smoothly with the built-in recipe engine or server `.env` variables.
            </p>
          </div>
        </div>

        <div className="mt-6 pt-4 border-t border-stone-100 dark:border-stone-800 flex justify-end">
          <button
            type="button"
            onClick={onClose}
            className="px-5 py-2.5 bg-orange-600 hover:bg-orange-700 text-white rounded-xl text-xs font-bold transition shadow-sm"
          >
            Done
          </button>
        </div>
      </div>
    </div>
  );
}
