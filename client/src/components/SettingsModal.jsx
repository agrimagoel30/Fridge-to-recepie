import React, { useState, useEffect } from 'react';
import { Settings, Key, Server, CheckCircle2, AlertCircle, X } from 'lucide-react';

export function SettingsModal({
  isOpen,
  onClose,
  customApiKey,
  setCustomApiKey
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

        {/* Header */}
        <div className="flex items-center justify-between mb-5">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-orange-100 dark:bg-orange-950/70 text-orange-600 dark:text-orange-400 flex items-center justify-center">
              <Settings className="w-4 h-4" />
            </div>
            <div>
              <h3 className="font-bold text-stone-900 dark:text-stone-100 text-base">Settings</h3>
              <p className="text-xs text-stone-500 dark:text-stone-400">
                API keys are never stored or sent to the browser bundle
              </p>
            </div>
          </div>
          <button onClick={onClose} className="p-1 rounded-full text-stone-400 hover:text-stone-700 dark:hover:text-stone-200 transition">
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="space-y-4">

          {/* Backend Status */}
          <div className="p-3.5 rounded-2xl bg-stone-50 dark:bg-stone-950 border border-stone-200/80 dark:border-stone-800 text-xs">
            <div className="flex items-center justify-between">
              <span className="font-semibold text-stone-700 dark:text-stone-300 flex items-center gap-1.5">
                <Server className="w-3.5 h-3.5 text-blue-500" />
                Backend Server
              </span>
              {checkingHealth ? (
                <span className="text-stone-400 font-medium">Connecting...</span>
              ) : health?.status === 'healthy' ? (
                <span className="text-emerald-600 dark:text-emerald-400 font-bold flex items-center gap-1">
                  <CheckCircle2 className="w-3.5 h-3.5" /> Online
                </span>
              ) : (
                <span className="text-amber-500 font-bold flex items-center gap-1">
                  <AlertCircle className="w-3.5 h-3.5" /> Offline
                </span>
              )}
            </div>
          </div>

          {/* AI Model Info */}
          <div className="p-3.5 rounded-2xl bg-stone-50 dark:bg-stone-950 border border-stone-200/80 dark:border-stone-800 text-xs">
            <div className="flex items-center justify-between">
              <span className="font-semibold text-stone-700 dark:text-stone-300">AI Model</span>
              <span className="font-bold text-stone-900 dark:text-stone-100">Groq — LLaMA 3 70B</span>
            </div>
            <p className="text-stone-400 mt-1">llama3-70b-8192 · Fast inference · Free tier</p>
          </div>

          {/* API Key Override */}
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label className="text-xs font-bold text-stone-700 dark:text-stone-300 flex items-center gap-1">
                <Key className="w-3.5 h-3.5 text-orange-500" />
                Groq API Key Override
              </label>
              <span className="text-[10px] text-stone-400">Session only — not persisted</span>
            </div>
            <input
              type="password"
              value={customApiKey}
              onChange={(e) => setCustomApiKey(e.target.value)}
              placeholder="gsk_... (leave blank to use server key)"
              className="w-full px-3.5 py-2.5 rounded-xl bg-stone-50 dark:bg-stone-950 border border-stone-300 dark:border-stone-800 text-stone-900 dark:text-stone-100 text-sm placeholder:text-stone-400 focus:ring-2 focus:ring-orange-500 focus:outline-none"
            />
            <p className="text-[11px] text-stone-500 dark:text-stone-400 mt-1">
              Optional. Get a free key at <a href="https://console.groq.com" target="_blank" rel="noreferrer" className="text-orange-500 hover:underline">console.groq.com</a>
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
