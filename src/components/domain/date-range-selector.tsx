"use client";

import { useRouter, usePathname, useSearchParams } from "next/navigation";
import { useCallback } from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/atoms/select";

const DATE_RANGES = [
  { value: "7d", label: "Last 7 Days" },
  { value: "30d", label: "Last 30 Days" },
  { value: "90d", label: "Last 90 Days" },
  { value: "quarter", label: "This Quarter" },
  { value: "year", label: "This Year" },
] as const;

const DEFAULT_RANGE = "year";

interface DateRangeSelectorProps {
  className?: string;
}

export function DateRangeSelector({ className }: DateRangeSelectorProps) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const currentRange = searchParams.get("range") ?? DEFAULT_RANGE;

  const handleChange = useCallback(
    (value: string) => {
      const params = new URLSearchParams(searchParams.toString());
      if (value === DEFAULT_RANGE) {
        params.delete("range");
      } else {
        params.set("range", value);
      }
      const qs = params.toString();
      router.push(qs ? `${pathname}?${qs}` : pathname);
    },
    [router, pathname, searchParams],
  );

  return (
    <Select value={currentRange} onValueChange={handleChange}>
      <SelectTrigger className={className ?? "w-[140px] h-8 text-xs"}>
        <SelectValue />
      </SelectTrigger>
      <SelectContent>
        {DATE_RANGES.map((range) => (
          <SelectItem key={range.value} value={range.value} className="text-xs">
            {range.label}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}
