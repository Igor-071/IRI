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
    colorClass: "text-chart-2",
    isMarketingTouch: true,
  },
  google_ads: {
    label: "Google Ads",
    shortLabel: "Ads",
    colorClass: "text-chart-3",
    isMarketingTouch: true,
  },
  linkedin_organic: {
    label: "LinkedIn Organic",
    shortLabel: "LinkedIn",
    colorClass: "text-chart-2",
    isMarketingTouch: true,
  },
  linkedin_ads: {
    label: "LinkedIn Ads",
    shortLabel: "LI Ads",
    colorClass: "text-chart-3",
    isMarketingTouch: true,
  },
  meta: {
    label: "Meta",
    shortLabel: "Meta",
    colorClass: "text-chart-2",
    isMarketingTouch: true,
  },
  referral: {
    label: "Referral (web)",
    shortLabel: "Referral",
    colorClass: "text-dessert",
    isMarketingTouch: true,
  },
  event: {
    label: "Event",
    shortLabel: "Event",
    colorClass: "text-dessert",
    isMarketingTouch: true,
  },
  email: {
    label: "Email",
    shortLabel: "Email",
    colorClass: "text-muted-foreground",
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
    colorClass: "text-warning",
    isMarketingTouch: false,
  },
};

export function getSourceLabel(source: AcquisitionSource): string {
  return sourceConfig[source].label;
}

export function isMarketingTouch(source: AcquisitionSource): boolean {
  return sourceConfig[source].isMarketingTouch;
}
