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
import { ownerOptions } from "@/lib/config/owners";
import type { AcquisitionSource } from "@/types";

const SOURCE_OPTIONS = (Object.keys(sourceConfig) as AcquisitionSource[]).map(
  (key) => ({ value: key, label: sourceConfig[key].label }),
);

interface AccountFiltersProps {
  search: string;
  onSearchChange: (value: string) => void;
  resultCount: number;
}

export function AccountFilters({
  search,
  onSearchChange,
  resultCount,
}: AccountFiltersProps) {
  const router = useRouter();
  const searchParams = useSearchParams();

  const source = searchParams.get("source") ?? "";
  const owner = searchParams.get("owner") ?? "";

  const hasFilters = source || owner || search;

  const updateParam = useCallback(
    (key: string, value: string) => {
      const params = new URLSearchParams(searchParams.toString());
      if (value) {
        params.set(key, value);
      } else {
        params.delete(key);
      }
      router.replace(`/accounts?${params.toString()}`, { scroll: false });
    },
    [router, searchParams],
  );

  const clearAll = useCallback(() => {
    onSearchChange("");
    router.replace("/accounts", { scroll: false });
  }, [router, onSearchChange]);

  return (
    <div className="flex flex-wrap items-center gap-3">
      <div className="relative">
        <Search className="absolute left-2.5 top-1/2 size-3.5 -translate-y-1/2 text-muted-foreground" />
        <Input
          placeholder="Search accounts..."
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
        {resultCount} {resultCount === 1 ? "account" : "accounts"}
      </span>
    </div>
  );
}
