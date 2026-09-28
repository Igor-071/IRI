import type { AcquisitionSource } from "./attribution";

export type CampaignStatus = "active" | "paused" | "completed";

export interface Campaign {
  id: string;
  name: string;
  source: AcquisitionSource;
  status: CampaignStatus;
  startDate: string;
  endDate?: string;
}
