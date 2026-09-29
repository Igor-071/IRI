import type { ConversionMechanism } from "./attribution";

export type LeadStatus = "new" | "contacted" | "qualified" | "disqualified";

export type DisplayStage =
  | "new"
  | "contacted"
  | "qualified"
  | "discovery"
  | "proposal"
  | "negotiation"
  | "won"
  | "lost"
  | "disqualified";

export interface Person {
  id: string;
  name: string;
  email: string;
  title: string;
  companyId: string;
  ownerId: string;
  leadStatus: LeadStatus;
  conversionMechanism: ConversionMechanism;
  selfReportedSource?: string;
  createdAt: string;
}
