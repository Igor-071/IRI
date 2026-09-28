import type { Company, Person, Session, Event, RelationshipAttribution, SelfReportedAttribution } from "@/types";

import {
  heroCompanies,
  heroPeople,
  heroSessions,
  heroEvents,
  heroRelationships,
  heroSelfReported,
} from "./heroes";

import {
  generatedCompanies,
  generatedPeople,
  generatedSessions,
  generatedEvents,
  generatedSelfReported,
} from "./generated";

import { ledger } from "./ledger";

// Re-export static data
export { campaigns } from "./heroes";
export { integrations } from "./heroes";
export { workspace, users } from "./heroes";
export { ledger } from "./ledger";

// Merged datasets
export const companies: Company[] = [...heroCompanies, ...generatedCompanies];
export const people: Person[] = [...heroPeople, ...generatedPeople];
export const sessions: Session[] = [...heroSessions, ...generatedSessions];
export const events: Event[] = [...heroEvents, ...generatedEvents];
export const relationships: RelationshipAttribution[] = heroRelationships;
export const selfReported: SelfReportedAttribution[] = [...heroSelfReported, ...generatedSelfReported];
