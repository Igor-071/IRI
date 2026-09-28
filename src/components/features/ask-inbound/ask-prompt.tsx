"use client";

import { useState, useCallback } from "react";
import { ArrowRight } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { PROMPT_CHIPS } from "@/lib/ask";

interface AskPromptProps {
  onSubmit: (query: string) => void;
}

export function AskPrompt({ onSubmit }: AskPromptProps) {
  const [query, setQuery] = useState("");

  const handleSubmit = useCallback(() => {
    const trimmed = query.trim();
    if (!trimmed) return;
    onSubmit(trimmed);
  }, [query, onSubmit]);

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      if (e.key === "Enter") {
        e.preventDefault();
        handleSubmit();
      }
    },
    [handleSubmit],
  );

  const handleChipClick = useCallback(
    (value: string) => {
      setQuery(value);
      onSubmit(value);
    },
    [onSubmit],
  );

  return (
    <div className="space-y-4">
      <div className="flex gap-2">
        <Input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Ask about leads, journeys, pipeline or attribution…"
          className="h-12 text-base"
        />
        <Button
          onClick={handleSubmit}
          size="lg"
          className="h-12 px-4"
          disabled={!query.trim()}
        >
          <ArrowRight className="h-4 w-4" />
        </Button>
      </div>

      <div className="flex flex-wrap gap-2">
        {PROMPT_CHIPS.map((chip) => (
          <button
            key={chip.label}
            onClick={() => handleChipClick(chip.value)}
            className="rounded-full border border-border bg-card px-3 py-1.5 text-xs text-muted-foreground transition-colors hover:border-primary/50 hover:text-foreground"
          >
            {chip.value}
          </button>
        ))}
      </div>
    </div>
  );
}
