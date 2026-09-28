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
import { ownerOptions } from "@/lib/config/owners";
import type { AcquisitionSource, AttributionStatus, DisplayStage } from "@/types";

const SOURCE_OPTIONS = (Object.keys(sourceConfig) as AcquisitionSource[]).map(
  (key) => ({ value: key, label: sourceConfig[key].label })
);

const STAGE_OPTIONS = (Object.keys(displayStageConfig) as DisplayStage[]).map(
  (key) => ({ value: key, label: displayStageConfig[key].label })
);

const ATTRIBUTION_OPTIONS: { value: AttributionStatus; label: string }[] = [
  { value: "full", label: "Full" },
  { value: "partial", label: "Partial" },
  { value: "unknown", label: "Unknown" },
];

interface LeadFiltersProps {
  search: string;
  onSearchChange: (value: string) => void;
  resultCount: number;
}

export function LeadFilters({
  search,
  onSearchChange,
  resultCount,
}: LeadFiltersProps) {
  const router = useRouter();
  const searchParams = useSearchParams();

  const source = searchParams.get("source") ?? "";
  const stage = searchParams.get("stage") ?? "";
  const attribution = searchParams.get("attribution") ?? "";
  const owner = searchParams.get("owner") ?? "";

  const hasFilters = source || stage || attribution || owner || search;

  const updateParam = useCallback(
    (key: string, value: string) => {
      const params = new URLSearchParams(searchParams.toString());
      if (value) {
        params.set(key, value);
      } else {
        params.delete(key);
      }
      router.replace(`/leads?${params.toString()}`, { scroll: false });
    },
    [router, searchParams]
  );

  const clearAll = useCallback(() => {
    onSearchChange("");
    router.replace("/leads", { scroll: false });
  }, [router, onSearchChange]);

  return (
    <div className="flex flex-wrap items-center gap-3">
      <div className="relative">
        <Search className="absolute left-2.5 top-1/2 size-3.5 -translate-y-1/2 text-muted-foreground" />
        <Input
          placeholder="Search leads..."
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
        value={attribution}
        onValueChange={(v) =>
          updateParam("attribution", v === "__all__" ? "" : v)
        }
      >
        <SelectTrigger size="sm" className="w-fit min-w-[130px]">
          <SelectValue placeholder="Attribution" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="__all__">All Attribution</SelectItem>
          {ATTRIBUTION_OPTIONS.map((opt) => (
            <SelectItem key={opt.value} value={opt.value}>
              {opt.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      <Select
        value={owner}
        onValueChange={(v) => updateParam("owner", v === "__all__" ? "" : v)}
      >
        <SelectTrigger size="sm" className="w-fit min-w-[120px]">
          <SelectValue placeholder="Owner" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="__all__">All Owners</SelectItem>
          {ownerOptions.map((opt) => (
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
        {resultCount} {resultCount === 1 ? "lead" : "leads"}
      </span>
    </div>
  );
}
