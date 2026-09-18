"use client";

import Link from "next/link";
import { SearchX } from "lucide-react";

/**
 * Designed empty state for the menu — shown when a search (or the outlet /
 * pure-veg filters) leaves no dishes to display.
 */
export type EmptyMenuStateProps = {
  /** The active search query (empty string when filters alone emptied the list). */
  query: string;
  /** Resets the menu to its full, unfiltered state. */
  onClearSearch: () => void;
  /** Category suggestions to try instead. */
  suggestions?: { slug: string; name: string }[];
  /** Called with a category slug when a suggestion is tapped. */
  onSelectSuggestion?: (slug: string) => void;
};

export function EmptyMenuState({
  query,
  onClearSearch,
  suggestions = [],
  onSelectSuggestion,
}: EmptyMenuStateProps) {
  return (
    <div className="rounded-2xl border border-dashed border-brass-soft bg-card px-6 py-14 text-center sm:py-20">
      <span className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-cream text-brass">
        <SearchX className="h-6 w-6" aria-hidden="true" />
      </span>

      <h2 className="mt-6 font-serif text-2xl font-semibold text-ink sm:text-3xl">
        We couldn&apos;t find that.
      </h2>
      <p className="mx-auto mt-3 max-w-md text-sm leading-relaxed text-ink-soft">
        {query ? (
          <>
            No dishes matched <span className="font-medium text-ink">&ldquo;{query}&rdquo;</span>. Try a
            different spelling, or browse the categories below.
          </>
        ) : (
          <>
            No dishes match the current filters. Try clearing them, or browse the categories below.
          </>
        )}
      </p>

      {suggestions.length > 0 && (
        <div className="mt-6 flex flex-wrap justify-center gap-2">
          {suggestions.map((suggestion) => (
            <button
              key={suggestion.slug}
              type="button"
              onClick={() => onSelectSuggestion?.(suggestion.slug)}
              className="rounded-full border border-border bg-card px-3.5 py-2 text-xs font-medium text-ink-soft transition-all duration-150 hover:border-brass hover:text-brand active:scale-[0.97] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brass"
            >
              {suggestion.name}
            </button>
          ))}
        </div>
      )}

      <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
        <button
          type="button"
          onClick={onClearSearch}
          className="inline-flex items-center justify-center rounded-md bg-brand px-5 py-3 text-sm font-semibold text-parchment transition-all duration-200 hover:bg-brand-deep active:scale-[0.98] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-parchment"
        >
          {query ? "Clear search" : "Clear filters"}
        </button>
        <Link
          href="/menu"
          onClick={onClearSearch}
          className="inline-flex items-center justify-center rounded-md border border-border bg-card px-5 py-3 text-sm font-medium text-ink-soft transition-all duration-200 hover:border-brass hover:text-brand active:scale-[0.98] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brass"
        >
          Explore full menu
        </Link>
      </div>
    </div>
  );
}
