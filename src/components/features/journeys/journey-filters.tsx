"use client";

import { useCallback } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Search, X } from "lucide-react";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/atoms/select";
import { Button } from "@/components/ui/button";
import { sourceConfig } from "@/lib/config/sources";
import { displayStageConfig } from "@/lib/config/stages";
import type {
  AcquisitionSource,
  ConversionMechanism,
  DisplayStage,
} from "@/types";

const SOURCE_OPTIONS = (Object.keys(sourceConfig) as AcquisitionSource[]).map(
  (key) => ({ value: key, label: sourceConfig[key].label }),
);

const STAGE_OPTIONS = (Object.keys(displayStageConfig) as DisplayStage[]).map(
  (key) => ({ value: key, label: displayStageConfig[key].label }),
);

const CONVERSION_OPTIONS: { value: ConversionMechanism; label: string }[] = [
  { value: "contact_form", label: "Contact Form" },
  { value: "book_a_call", label: "Book a Call" },
  { value: "email_inquiry", label: "Email Inquiry" },
  { value: "newsletter_signup", label: "Newsletter Signup" },
];

interface JourneyFiltersProps {
  search: string;
  onSearchChange: (value: string) => void;
  resultCount: number;
}

export function JourneyFilters({
  search,
  onSearchChange,
  resultCount,
}: JourneyFiltersProps) {
  const router = useRouter();
  const searchParams = useSearchParams();

  const source = searchParams.get("source") ?? "";
  const stage = searchParams.get("stage") ?? "";
  const conversion = searchParams.get("conversion") ?? "";

  const hasFilters = source || stage || conversion || search;

  const updateParam = useCallback(
    (key: string, value: string) => {
      const params = new URLSearchParams(searchParams.toString());
      if (value) {
        params.set(key, value);
      } else {
        params.delete(key);
      }
      router.replace(`/journeys?${params.toString()}`, { scroll: false });
    },
    [router, searchParams],
  );

  const clearAll = useCallback(() => {
    onSearchChange("");
    router.replace("/journeys", { scroll: false });
  }, [router, onSearchChange]);

  return (
    <div className="flex flex-wrap items-center gap-3">
      <div className="relative">
        <Search className="absolute left-2.5 top-1/2 size-3.5 -translate-y-1/2 text-muted-foreground" />
        <Input
          placeholder="Search journeys..."
          value={search}
          onChange={(e) => onSearchChange(e.target.value)}
          className="h-8 w-[200px] pl-8 text-sm"
        />
      </div>

      <Select
        value={source}
        onValueChange={(v) => updateParam("source", v === "__all__" ? "" : v)}
      >
        <SelectTrigger size="sm" className="w-fit min-w-[130px]">
          <SelectValue placeholder="First Touch" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="__all__">All Sources</SelectItem>
          {SOURCE_OPTIONS.map((opt) => (
            <SelectItem key={opt.value} value={opt.value}>
              {opt.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      <Select
        value={stage}
        onValueChange={(v) => updateParam("stage", v === "__all__" ? "" : v)}
      >
        <SelectTrigger size="sm" className="w-fit min-w-[120px]">
          <SelectValue placeholder="Stage" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="__all__">All Stages</SelectItem>
          {STAGE_OPTIONS.map((opt) => (
            <SelectItem key={opt.value} value={opt.value}>
              {opt.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      <Select
        value={conversion}
        onValueChange={(v) =>
          updateParam("conversion", v === "__all__" ? "" : v)
        }
      >
        <SelectTrigger size="sm" className="w-fit min-w-[130px]">
          <SelectValue placeholder="Conversion" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="__all__">All Conversions</SelectItem>
          {CONVERSION_OPTIONS.map((opt) => (
            <SelectItem key={opt.value} value={opt.value}>
              {opt.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      {hasFilters && (
        <Button
          variant="ghost"
          size="sm"
          onClick={clearAll}
          className="h-8 text-xs text-muted-foreground"
        >
          <X className="mr-1 size-3" />
          Clear filters
        </Button>
      )}

      <span className="ml-auto text-xs text-muted-foreground">
        {resultCount} {resultCount === 1 ? "journey" : "journeys"}
      </span>
    </div>
  );
}
