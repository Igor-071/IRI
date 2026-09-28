"use client";

import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import type { AskAnswer as AskAnswerType } from "@/lib/ask";

interface AskAnswerProps {
  answer: AskAnswerType;
  onChipClick?: (value: string) => void;
}

export function AskAnswer({ answer, onChipClick }: AskAnswerProps) {
  // Prompt chips: render as clickable suggestions
  if (answer.type === "prompt_chips") {
    return (
      <div className="rounded-lg border border-border bg-card p-6">
        <p className="text-sm text-muted-foreground">{answer.summary}</p>
        {answer.items && answer.items.length > 0 && (
          <div className="mt-4 flex flex-wrap gap-2">
            {answer.items.map((item) => (
              <button
                key={item.label}
                onClick={() => onChipClick?.(item.value)}
                className="rounded-full border border-border bg-background px-3 py-1.5 text-xs text-muted-foreground transition-colors hover:border-primary/50 hover:text-foreground"
              >
                {item.value}
              </button>
            ))}
          </div>
        )}
      </div>
    );
  }

  const detailEntries = answer.details
    ? Object.entries(answer.details).filter(
        ([, v]) => v !== undefined && v !== null,
      )
    : [];

  return (
    <div className="rounded-lg border border-border bg-card p-6 space-y-4">
      {/* Title */}
      <h3 className="text-base font-semibold text-foreground">
        {answer.title}
      </h3>

      {/* Summary */}
      <p className="text-sm text-muted-foreground">{answer.summary}</p>

      {/* Structured facts grid */}
      {detailEntries.length > 0 && (
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
          {detailEntries.map(([label, value]) => (
            <div
              key={label}
              className="rounded-md border border-border bg-background px-3 py-2"
            >
              <span className="block text-[11px] text-muted-foreground">
                {label}
              </span>
              <span className="block text-sm font-medium text-foreground">
                {String(value)}
              </span>
            </div>
          ))}
        </div>
      )}

      {/* Items list */}
      {answer.items && answer.items.length > 0 && (
        <ul className="space-y-1.5">
          {answer.items.map((item, i) => (
            <li key={i} className="flex items-baseline justify-between text-sm">
              {item.href ? (
                <Link
                  href={item.href}
                  className="text-foreground hover:text-primary transition-colors"
                >
                  {item.label}
                </Link>
              ) : (
                <span className="text-foreground">{item.label}</span>
              )}
              <span className="ml-2 text-muted-foreground shrink-0">
                {item.value}
              </span>
            </li>
          ))}
        </ul>
      )}

      {/* CTA button */}
      {answer.cta && (
        <div className="pt-2">
          <Button variant="outline" size="sm" asChild>
            <Link href={answer.cta.href}>
              {answer.cta.label}
              <ArrowRight className="ml-1.5 h-3.5 w-3.5" />
            </Link>
          </Button>
        </div>
      )}
    </div>
  );
}
