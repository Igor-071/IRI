export type IntegrationCategory =
  | "analytics"
  | "advertising"
  | "lead_capture"
  | "crm"
  | "communication"
  | "scheduling"
  | "content"
  | "automation";

export type IntegrationStatus =
  | "connected"
  | "attention"
  | "archived"
  | "disconnected";

export interface Integration {
  id: string;
  name: string;
  category: IntegrationCategory;
  status: IntegrationStatus;
  lastSync?: string;
  recordCount?: number;
  description?: string;
  attentionNote?: string;
}
