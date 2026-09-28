import type { OpportunityStage, DisplayStage } from "@/types";

export interface StageConfig {
  label: string;
  colorClass: string;
}

export const opportunityStageConfig: Record<OpportunityStage, StageConfig> = {
  discovery: { label: "Discovery", colorClass: "text-muted-foreground" },
  qualified: { label: "Qualified", colorClass: "text-dessert" },
  proposal: { label: "Proposal", colorClass: "text-primary" },
  negotiation: { label: "Negotiation", colorClass: "text-warning" },
  won: { label: "Won", colorClass: "text-success" },
  lost: { label: "Lost", colorClass: "text-destructive" },
};

export const displayStageConfig: Record<DisplayStage, StageConfig> = {
  new: { label: "New", colorClass: "text-muted-foreground" },
  contacted: { label: "Contacted", colorClass: "text-muted-foreground" },
  qualified: { label: "Qualified", colorClass: "text-dessert" },
  discovery: { label: "Discovery", colorClass: "text-dessert" },
  proposal: { label: "Proposal", colorClass: "text-primary" },
  negotiation: { label: "Negotiation", colorClass: "text-warning" },
  won: { label: "Won", colorClass: "text-success" },
  lost: { label: "Lost", colorClass: "text-destructive" },
  disqualified: { label: "Disqualified", colorClass: "text-muted-foreground" },
};
