export type OpportunityStage =
  | "discovery"
  | "qualified"
  | "proposal"
  | "negotiation"
  | "won"
  | "lost";

export interface Opportunity {
  id: string;
  companyId: string;
  primaryContactId: string;
  name: string;
  value: number;
  stage: OpportunityStage;
  ownerId: string;
  createdAt: string;
  expectedClose?: string;
  closedAt?: string;
  lostReason?: string;
  lostAtStage?: OpportunityStage;
}
