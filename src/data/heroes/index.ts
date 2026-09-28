import type { Company, Person, Session, Event, RelationshipAttribution, SelfReportedAttribution } from "@/types";

// Companies
import { acmeCompany, acmePeople, acmeSessions, acmeEvents, acmeRelationships, acmeSelfReported } from "./acme";
import { northstarCompany, northstarPeople, northstarSessions, northstarEvents } from "./northstar";
import { atlasCompany, atlasPeople, atlasSessions, atlasEvents, atlasRelationships, atlasSelfReported } from "./atlas";
import { nordicaCompany, nordicaPeople, nordicaSessions, nordicaEvents, nordicaSelfReported } from "./nordica";
import { vectorCompany, vectorPeople, vectorSessions, vectorEvents } from "./vector";
import { helixCompany, helixPeople, helixSessions, helixEvents } from "./helix";
import { meridianCompany, meridianPeople, meridianSessions, meridianEvents, meridianSelfReported } from "./meridian";
import { orbitCompany, orbitPeople, orbitSessions, orbitEvents } from "./orbit";

// Static data
export { campaigns } from "./campaigns";
export { integrations } from "./integrations";
export { workspace, users } from "./users";

// Aggregated hero data
export const heroCompanies: Company[] = [
  acmeCompany,
  northstarCompany,
  atlasCompany,
  nordicaCompany,
  vectorCompany,
  helixCompany,
  meridianCompany,
  orbitCompany,
];

export const heroPeople: Person[] = [
  ...acmePeople,
  ...northstarPeople,
  ...atlasPeople,
  ...nordicaPeople,
  ...vectorPeople,
  ...helixPeople,
  ...meridianPeople,
  ...orbitPeople,
];

export const heroSessions: Session[] = [
  ...acmeSessions,
  ...northstarSessions,
  ...atlasSessions,
  ...nordicaSessions,
  ...vectorSessions,
  ...helixSessions,
  ...meridianSessions,
  ...orbitSessions,
];

export const heroEvents: Event[] = [
  ...acmeEvents,
  ...northstarEvents,
  ...atlasEvents,
  ...nordicaEvents,
  ...vectorEvents,
  ...helixEvents,
  ...meridianEvents,
  ...orbitEvents,
];

export const heroRelationships: RelationshipAttribution[] = [
  ...acmeRelationships,
  ...atlasRelationships,
];

export const heroSelfReported: SelfReportedAttribution[] = [
  ...acmeSelfReported,
  ...atlasSelfReported,
  ...nordicaSelfReported,
  ...meridianSelfReported,
];
