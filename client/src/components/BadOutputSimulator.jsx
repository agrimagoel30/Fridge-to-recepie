import React, { useState } from 'react';
import { ShieldAlert, AlertTriangle, Clock, RefreshCw, X, Zap, CheckCircle2 } from 'lucide-react';

export function BadOutputSimulator({
  isOpen,
  onClose,
  onRunSimulation,
  onRunRaceConditionTest
}) {
  const [raceTestStatus, setRaceTestStatus] = useState(null);

  if (!isOpen) return null;

  const handleRaceClick = async () => {
    setRaceTestStatus('running');
    try {
      await onRunRaceConditionTest();
      setRaceTestStatus('passed');
    } catch (e) {
      setRaceTestStatus('failed');
    }
  };

  return (
    <div className="fixed inset-x-0 bottom-0 sm:bottom-6 sm:right-6 sm:inset-x-auto z-50 max-w-md w-full p-4">
      <div className="bg-stone-900 text-stone-100 rounded-3xl p-6 shadow-2xl border border-purple-500/40 ring-1 ring-purple-500/20 animate-in slide-in-from-bottom duration-200">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-purple-600/30 text-purple-400 flex items-center justify-center">
              <ShieldAlert className="w-4 h-4" />
            </div>
            <div>
              <h4 className="font-bold text-sm text-white">AI Failure Mode Studio</h4>
              <p className="text-[11px] text-stone-400">
                Evaluation Test Suite for Flam Reviewers
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-stone-400 hover:text-white hover:bg-stone-800 transition"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <p className="text-xs text-stone-300 mb-4 leading-relaxed">
          Test how this app gracefully handles unpredictable AI behavior (20% assignment weight) without breaking or crashing:
        </p>

        <div className="space-y-2">
          {/* Malformed JSON */}
          <button
            type="button"
            onClick={() => onRunSimulation('malformed_json')}
            className="w-full text-left px-3.5 py-2.5 rounded-xl bg-stone-800 hover:bg-stone-700/80 border border-stone-700 text-xs flex items-center justify-between transition group"
          >
            <div className="flex items-center gap-2">
              <AlertTriangle className="w-3.5 h-3.5 text-amber-400" />
              <span className="font-semibold text-stone-200">Test 1: Malformed / Truncated JSON</span>
            </div>
            <span className="text-[10px] text-stone-400 group-hover:text-stone-200">Trigger</span>
          </button>

          {/* Schema Mismatch */}
          <button
            type="button"
            onClick={() => onRunSimulation('wrong_schema')}
            className="w-full text-left px-3.5 py-2.5 rounded-xl bg-stone-800 hover:bg-stone-700/80 border border-stone-700 text-xs flex items-center justify-between transition group"
          >
            <div className="flex items-center gap-2">
              <AlertTriangle className="w-3.5 h-3.5 text-rose-400" />
              <span className="font-semibold text-stone-200">Test 2: Schema Mismatch (Missing Steps)</span>
            </div>
            <span className="text-[10px] text-stone-400 group-hover:text-stone-200">Trigger</span>
          </button>

          {/* Slow Network / Timeout */}
          <button
            type="button"
            onClick={() => onRunSimulation('slow_timeout')}
            className="w-full text-left px-3.5 py-2.5 rounded-xl bg-stone-800 hover:bg-stone-700/80 border border-stone-700 text-xs flex items-center justify-between transition group"
          >
            <div className="flex items-center gap-2">
              <Clock className="w-3.5 h-3.5 text-blue-400" />
              <span className="font-semibold text-stone-200">Test 3: Slow AI Timeout (12s Delay)</span>
            </div>
            <span className="text-[10px] text-stone-400 group-hover:text-stone-200">Trigger</span>
          </button>

          {/* 500 Crash */}
          <button
            type="button"
            onClick={() => onRunSimulation('server_error')}
            className="w-full text-left px-3.5 py-2.5 rounded-xl bg-stone-800 hover:bg-stone-700/80 border border-stone-700 text-xs flex items-center justify-between transition group"
          >
            <div className="flex items-center gap-2">
              <RefreshCw className="w-3.5 h-3.5 text-red-400" />
              <span className="font-semibold text-stone-200">Test 4: Upstream API 500 Crash</span>
            </div>
            <span className="text-[10px] text-stone-400 group-hover:text-stone-200">Trigger</span>
          </button>

          {/* Race Condition Test */}
          <div className="pt-2 border-t border-stone-800">
            <button
              type="button"
              onClick={handleRaceClick}
              disabled={raceTestStatus === 'running'}
              className="w-full text-left px-3.5 py-2.5 rounded-xl bg-purple-950/40 hover:bg-purple-900/50 border border-purple-700/60 text-xs flex items-center justify-between transition disabled:opacity-50"
            >
              <div className="flex items-center gap-2">
                <Zap className="w-3.5 h-3.5 text-purple-400" />
                <span className="font-semibold text-purple-200">Test 5: Stale Race Condition Protection</span>
              </div>
              {raceTestStatus === 'passed' && (
                <span className="text-[10px] font-bold text-emerald-400 flex items-center gap-1">
                  <CheckCircle2 className="w-3 h-3" /> Protected
                </span>
              )}
            </button>
            <p className="text-[10px] text-stone-400 mt-1 px-1">
              Fires Request #1 and Request #2 in rapid succession; verifies Request #1 is cancelled & never overwrites Request #2.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
