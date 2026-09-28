import type { AcquisitionSource, ConversionMechanism } from "./attribution";

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
  displayStage: DisplayStage;
  firstTouchSource: AcquisitionSource;
  conversionMechanism: ConversionMechanism;
  conversionChannel: AcquisitionSource;
  selfReportedSource?: string;
  createdAt: string;
}
