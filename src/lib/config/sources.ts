import type { AcquisitionSource } from "@/types";

export interface SourceConfig {
  label: string;
  shortLabel: string;
  colorClass: string;
  isMarketingTouch: boolean;
}

export const sourceConfig: Record<AcquisitionSource, SourceConfig> = {
  google_organic: {
    label: "Google Organic",
    shortLabel: "Google",
    colorClass: "text-foreground",
    isMarketingTouch: true,
  },
  google_ads: {
    label: "Google Ads",
    shortLabel: "Ads",
    colorClass: "text-foreground",
    isMarketingTouch: true,
  },
  linkedin_organic: {
    label: "LinkedIn Organic",
    shortLabel: "LinkedIn",
    colorClass: "text-foreground",
    isMarketingTouch: true,
  },
  linkedin_ads: {
    label: "LinkedIn Ads",
    shortLabel: "LI Ads",
    colorClass: "text-foreground",
    isMarketingTouch: true,
  },
  meta: {
    label: "Meta",
    shortLabel: "Meta",
    colorClass: "text-foreground",
    isMarketingTouch: true,
  },
  referral: {
    label: "Referral (web)",
    shortLabel: "Referral",
    colorClass: "text-foreground",
    isMarketingTouch: true,
  },
  event: {
    label: "Event",
    shortLabel: "Event",
    colorClass: "text-foreground",
    isMarketingTouch: true,
  },
  email: {
    label: "Email",
    shortLabel: "Email",
    colorClass: "text-foreground",
    isMarketingTouch: true,
  },
  direct: {
    label: "Direct",
    shortLabel: "Direct",
    colorClass: "text-muted-foreground",
    isMarketingTouch: false,
  },
  unknown: {
    label: "Unknown",
    shortLabel: "Unknown",
    colorClass: "text-muted-foreground",
    isMarketingTouch: false,
  },
};

export function getSourceLabel(source: AcquisitionSource): string {
  const cfg = sourceConfig[source];
  if (!cfg) return source;
  return cfg.label;
}

export function isMarketingTouch(source: AcquisitionSource): boolean {
  const cfg = sourceConfig[source];
  if (!cfg) return false;
  return cfg.isMarketingTouch;
}
