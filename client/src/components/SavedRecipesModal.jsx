import React from 'react';
import { Bookmark, Trash2, ArrowRight, Download, X, Clock, Users } from 'lucide-react';

export function SavedRecipesModal({
  isOpen,
  onClose,
  savedRecipes = [],
  onSelectRecipe,
  onRemoveRecipe
}) {
  if (!isOpen) return null;

  const handleExportJson = () => {
    const dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(savedRecipes, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute('href', dataStr);
    downloadAnchor.setAttribute('download', `saved_recipes_${Date.now()}.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
      <div className="bg-white dark:bg-stone-900 rounded-3xl max-w-xl w-full p-6 shadow-2xl border border-stone-200 dark:border-stone-800 animate-in fade-in zoom-in-95 duration-150 flex flex-col max-h-[85vh]">
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-stone-100 dark:border-stone-800 shrink-0">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-orange-100 dark:bg-orange-950/70 text-orange-600 dark:text-orange-400 flex items-center justify-center">
              <Bookmark className="w-4 h-4" />
            </div>
            <div>
              <h3 className="font-bold text-stone-900 dark:text-stone-100 text-base">
                Saved Recipe Book
              </h3>
              <p className="text-xs text-stone-500 dark:text-stone-400">
                {savedRecipes.length} {savedRecipes.length === 1 ? 'recipe' : 'recipes'} stored locally
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {savedRecipes.length > 0 && (
              <button
                type="button"
                onClick={handleExportJson}
                className="p-1.5 rounded-lg text-stone-500 hover:text-stone-800 dark:text-stone-400 dark:hover:text-stone-100 hover:bg-stone-100 dark:hover:bg-stone-800 text-xs flex items-center gap-1 transition"
                title="Export as JSON"
              >
                <Download className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Export</span>
              </button>
            )}
            <button
              onClick={onClose}
              className="p-1.5 rounded-full text-stone-400 hover:text-stone-700 dark:hover:text-stone-200 transition"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Content list */}
        <div className="py-4 overflow-y-auto space-y-3 flex-1">
          {savedRecipes.length === 0 ? (
            <div className="text-center py-12">
              <Bookmark className="w-12 h-12 text-stone-300 dark:text-stone-700 mx-auto mb-3" />
              <p className="text-sm font-semibold text-stone-600 dark:text-stone-400">
                No saved recipes yet
              </p>
              <p className="text-xs text-stone-400 dark:text-stone-500 mt-1">
                Click the bookmark icon on any recipe to save it for your next cooking session.
              </p>
            </div>
          ) : (
            savedRecipes.map((r) => (
              <div
                key={r.id}
                className="p-4 rounded-2xl border border-stone-200/80 dark:border-stone-800 hover:border-orange-300 dark:hover:border-orange-800 bg-stone-50/50 dark:bg-stone-950/40 transition flex items-center justify-between gap-3 group"
              >
                <div className="flex-1 min-w-0">
                  <h4 className="font-bold text-stone-900 dark:text-stone-100 text-sm truncate">
                    {r.title}
                  </h4>
                  <p className="text-xs text-stone-500 dark:text-stone-400 truncate mt-0.5">
                    {r.tagline || r.description}
                  </p>
                  <div className="flex items-center gap-3 mt-2 text-[11px] text-stone-400">
                    <span className="flex items-center gap-1">
                      <Clock className="w-3 h-3" /> {r.totalTimeMinutes}m
                    </span>
                    <span className="flex items-center gap-1">
                      <Users className="w-3 h-3" /> {r.servings} servings
                    </span>
                    <span className="px-1.5 py-0.2 rounded bg-stone-200/70 dark:bg-stone-800 text-stone-700 dark:text-stone-300 text-[10px]">
                      {r.difficulty}
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-2 shrink-0">
                  <button
                    type="button"
                    onClick={() => {
                      onSelectRecipe(r);
                      onClose();
                    }}
                    className="p-2 rounded-xl bg-orange-600 hover:bg-orange-700 text-white text-xs font-semibold flex items-center gap-1 shadow-sm transition"
                    title="Cook this recipe"
                  >
                    <span>Cook</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>

                  <button
                    type="button"
                    onClick={() => onRemoveRecipe(r.id)}
                    className="p-2 rounded-xl text-stone-400 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-950/40 transition"
                    title="Remove from saved"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
