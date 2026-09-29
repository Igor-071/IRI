"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import { Search, Bell, Building2, User, Briefcase } from "lucide-react";
import { globalSearch, type SearchResult } from "@/lib/search";

interface GlobalHeaderProps {
  children?: React.ReactNode;
}

const TYPE_ICONS: Record<SearchResult["type"], React.ReactNode> = {
  company: <Building2 className="size-3.5 shrink-0 text-muted-foreground" />,
  person: <User className="size-3.5 shrink-0 text-muted-foreground" />,
  opportunity: <Briefcase className="size-3.5 shrink-0 text-muted-foreground" />,
};

const TYPE_LABELS: Record<SearchResult["type"], string> = {
  company: "Companies",
  person: "People",
  opportunity: "Opportunities",
};

function getResultHref(result: SearchResult): string {
  switch (result.type) {
    case "company":
      return `/accounts/${result.id}`;
    case "person":
      return `/leads/${result.id}`;
    case "opportunity":
      return `/leads/${result.id}`;
    default:
      return "/";
  }
}

export function GlobalHeader({ children }: GlobalHeaderProps) {
  const router = useRouter();
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<SearchResult[]>([]);
  const [open, setOpen] = useState(false);
  const [activeIndex, setActiveIndex] = useState(-1);
  const containerRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Run search on query change
  useEffect(() => {
    if (!query.trim()) {
      setResults([]);
      setOpen(false);
      return;
    }
    const hits = globalSearch(query);
    setResults(hits);
    setOpen(hits.length > 0);
    setActiveIndex(-1);
  }, [query]);

  // Close on click outside
  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  const navigate = useCallback(
    (result: SearchResult) => {
      setQuery("");
      setOpen(false);
      router.push(getResultHref(result));
    },
    [router],
  );

  // Group results by type
  const grouped = results.reduce<Record<string, SearchResult[]>>(
    (acc, r) => {
      (acc[r.type] ??= []).push(r);
      return acc;
    },
    {},
  );

  // Flat list for keyboard navigation
  const flatResults = Object.values(grouped).flat();

  function handleKeyDown(e: React.KeyboardEvent) {
    if (!open) return;
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setActiveIndex((i) => Math.min(i + 1, flatResults.length - 1));
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setActiveIndex((i) => Math.max(i - 1, 0));
    } else if (e.key === "Enter" && activeIndex >= 0) {
      e.preventDefault();
      navigate(flatResults[activeIndex]);
    } else if (e.key === "Escape") {
      setOpen(false);
      inputRef.current?.blur();
    }
  }

  return (
    <header className="flex h-14 items-center justify-between border-b border-border bg-background px-6">
      {/* Left: page header slot */}
      <div className="flex items-center gap-4">{children}</div>

      {/* Right: search, notification, avatar */}
      <div className="flex items-center gap-3">
        <div ref={containerRef} className="relative">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <input
            ref={inputRef}
            type="text"
            placeholder="Search leads, companies or emails..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onFocus={() => {
              if (results.length > 0) setOpen(true);
            }}
            onKeyDown={handleKeyDown}
            className="h-8 w-64 rounded-md border border-input bg-muted pl-9 pr-3 text-sm text-foreground placeholder:text-muted-foreground focus:border-ring focus:outline-none"
          />

          {/* Results dropdown */}
          {open && (
            <div className="absolute right-0 top-full z-50 mt-1 w-80 overflow-hidden rounded-md border border-border bg-popover shadow-lg">
              {(["person", "company", "opportunity"] as const).map((type) => {
                const group = grouped[type];
                if (!group || group.length === 0) return null;
                return (
                  <div key={type}>
                    <div className="px-3 py-1.5 text-[10px] font-semibold tracking-wider text-muted-foreground uppercase">
                      {TYPE_LABELS[type]}
                    </div>
                    {group.map((result) => {
                      const flatIdx = flatResults.indexOf(result);
                      return (
                        <button
                          key={`${result.type}-${result.id}`}
                          type="button"
                          className={`flex w-full items-center gap-2.5 px-3 py-2 text-left transition-colors hover:bg-accent ${
                            flatIdx === activeIndex ? "bg-accent" : ""
                          }`}
                          onMouseDown={(e) => {
                            e.preventDefault();
                            navigate(result);
                          }}
                        >
                          {TYPE_ICONS[result.type]}
                          <div className="min-w-0 flex-1">
                            <div className="truncate text-sm text-foreground">
                              {result.title}
                            </div>
                            <div className="truncate text-xs text-muted-foreground">
                              {result.subtitle}
                            </div>
                          </div>
                        </button>
                      );
                    })}
                  </div>
                );
              })}
            </div>
          )}
        </div>
        <button
          type="button"
          className="flex h-8 w-8 items-center justify-center rounded-md text-muted-foreground hover:bg-accent hover:text-foreground"
        >
          <Bell className="h-4 w-4" />
        </button>
        <div className="flex h-7 w-7 items-center justify-center rounded-full bg-secondary text-xs font-medium text-secondary-foreground">
          IK
        </div>
      </div>
    </header>
  );
}
