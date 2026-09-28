import { Badge } from "@/components/ui/atoms/badge";
import { cn } from "@/lib/utils";

const systemLabels: Record<string, string> = {
  website_tracker: "Website Tracker",
  hubspot: "HubSpot",
  cal_com: "Cal.com",
  gmail: "Gmail",
  manual: "Manual",
  linkedin: "LinkedIn",
  google_analytics: "Google Analytics",
  google_ads: "Google Ads",
  meta_ads: "Meta Ads",
};

interface SourceSystemChipProps {
  system: string;
  className?: string;
}

export function SourceSystemChip({ system, className }: SourceSystemChipProps) {
  const label =
    systemLabels[system] ??
    system
      .replace(/_/g, " ")
      .replace(/\b\w/g, (c) => c.toUpperCase());

  return (
    <Badge
      variant="outline"
      className={cn(
        "text-[10px] px-1.5 py-0 font-normal text-muted-foreground",
        className
      )}
    >
      {label}
    </Badge>
  );
}
