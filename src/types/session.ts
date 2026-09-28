import type { AcquisitionSource } from "./attribution";

export interface Session {
  id: string;
  personId: string;
  source: AcquisitionSource;
  medium: string;
  startedAt: string;
  landingPage: string;
  referrer: string;
  campaign?: string;
  content?: string;
  pageviews: number;
  duration: number;
  sourceSystem: string;
}
