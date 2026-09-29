/**
 * Deterministic seed data generator for IRI prototype.
 * Uses mulberry32 PRNG — run twice → byte-identical output.
 *
 * Usage: npx tsx scripts/generate-seed.ts
 */

import { writeFileSync, mkdirSync } from "node:fs";
import { join } from "node:path";

// ── PRNG ────────────────────────────────────────────────────────────────────

function mulberry32(seed: number) {
  return function () {
    seed |= 0;
    seed = (seed + 0x6d2b79f5) | 0;
    let t = Math.imul(seed ^ (seed >>> 15), 1 | seed);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

const rand = mulberry32(20260927);

function randInt(min: number, max: number): number {
  return Math.floor(rand() * (max - min + 1)) + min;
}

function pick<T>(arr: readonly T[]): T {
  return arr[Math.floor(rand() * arr.length)];
}

function shuffle<T>(arr: T[]): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(rand() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

function weightedPick<T>(items: T[], weights: number[]): T {
  const total = weights.reduce((s, w) => s + w, 0);
  let r = rand() * total;
  for (let i = 0; i < items.length; i++) {
    r -= weights[i];
    if (r <= 0) return items[i];
  }
  return items[items.length - 1];
}

// ── Pools ───────────────────────────────────────────────────────────────────

const FIRST_NAMES = [
  "Lars", "Stefan", "Henrik", "Marcus", "Andreas", "Oliver", "Jonas",
  "Tobias", "Christoph", "Florian", "Emil", "Gustav", "Mikael", "Peter",
  "Karl", "Jakob", "Daniel", "Simon", "Niklas", "Rasmus",
  "Maria", "Eva", "Julia", "Laura", "Sandra", "Petra", "Christina",
  "Johanna", "Katarina", "Helena", "Astrid", "Camilla", "Lena", "Birgit",
  "Sophia", "Hannah", "Ida", "Maja", "Linnea", "Frida",
];

const LAST_NAMES = [
  "Lindgren", "Johansson", "Berg", "Ström", "Olsson", "Fischer",
  "Schneider", "Becker", "Krüger", "Moser", "Huber", "Lehmann",
  "Jacobsen", "Madsen", "Andersen", "Petersen", "Poulsen", "Lund",
  "de Vries", "Jansen", "Bakker", "Visser", "van Dam", "Smit",
  "Kowalski", "Patel", "Thompson", "Clarke", "Ward", "Ellis",
  "Dupont", "Lambert", "Persson", "Nyberg", "Ekström", "Sjöberg",
  "Hedström", "Karlsen", "Wiklund", "Ljung",
];

const COMPANY_PREFIXES = [
  "Apex", "Zenith", "Vertex", "Pinnacle", "Prism", "Nexus", "Forge",
  "Catalyst", "Vantage", "Horizon", "Summit", "Alloy", "Cipher", "Flux",
  "Pylon", "Astra", "Nova", "Orion", "Helios", "Titan",
  "Crest", "Arc", "Ridge", "Shore", "Haven", "Core", "Grid",
  "Shift", "Pulse", "Spark", "Stone", "River", "Field", "Lane",
  "Fern", "Oak", "Iron", "Slate", "Ember", "Drift",
];

const COMPANY_SUFFIXES = [
  "Systems", "Group", "Labs", "Technologies", "Solutions", "Partners",
  "Digital", "Analytics", "Corp", "AG", "GmbH", "AB",
  "AS", "BV", "Holdings", "Ventures", "Industries", "Services",
];

const INDUSTRIES = [
  "Technology", "FinTech", "Healthcare", "Manufacturing", "SaaS",
  "Logistics", "Professional Services", "Energy", "Automotive",
  "Retail", "Financial Services", "Insurance", "Real Estate",
  "Education Technology", "Media", "Telecommunications",
];

const LOCATIONS = [
  "Stockholm, Sweden", "Gothenburg, Sweden", "Malmö, Sweden",
  "Copenhagen, Denmark", "Aarhus, Denmark",
  "Oslo, Norway", "Bergen, Norway",
  "Helsinki, Finland",
  "Berlin, Germany", "Munich, Germany", "Hamburg, Germany", "Frankfurt, Germany",
  "Vienna, Austria", "Zurich, Switzerland",
  "Amsterdam, Netherlands", "Rotterdam, Netherlands",
  "London, UK", "Manchester, UK",
  "Paris, France", "Lyon, France",
  "Brussels, Belgium", "Warsaw, Poland", "Prague, Czech Republic",
];

const SIZES = ["11–50", "51–200", "201–500", "500–1,000", "1,000–5,000", "5,000+"];

const TITLES = [
  "CEO", "CTO", "CIO", "COO", "Chief Digital Officer",
  "VP Product", "VP Innovation", "VP Engineering", "VP Technology",
  "Head of Product", "Head of Strategy", "Head of Engineering",
  "Head of Digital", "Head of Innovation",
  "Director of Digital Transformation", "Director of Technology",
  "Digital Product Director", "Innovation Director",
  "Product Manager", "Engineering Manager",
];

const PAGES = [
  "/", "/services", "/services/ai-product-development", "/services/product-strategy",
  "/services/digital-transformation", "/services/software-engineering",
  "/contact", "/work", "/about", "/engagement",
];

const CONTENT_TITLES = [
  "Product Strategy in the AI Era",
  "Building AI-Native Products",
  "Digital Transformation Without the Theatre",
  "From Prototype to Production",
  "Product Discovery for Enterprise Teams",
  "The ROI of Design-Led Development",
  "Scaling Product Teams in 2026",
];

const CASE_STUDIES = [
  "AI Transformation Case Study",
  "Enterprise AI Search Case Study",
  "Healthcare Digital Transformation",
  "FinTech Modernization Case Study",
  "Supply Chain Visibility Case Study",
  "Product Intelligence Case Study",
  "Connected Vehicle Platform Case Study",
];

type Source = "google_organic" | "google_ads" | "linkedin_organic" | "linkedin_ads"
  | "referral" | "event" | "meta" | "email" | "unknown";

type ConvMech = "contact_form" | "book_a_call" | "email_inquiry" | "newsletter_signup";
type AttrStatus = "full" | "partial_a" | "partial_b" | "unknown";

const OWNERS = ["usr_igor", "usr_elma", "usr_adnan"];

// ── Non-hero ledger entries ─────────────────────────────────────────────────

interface LedgerRef {
  companyId: string;
  companyName: string;
  domain: string;
  industry: string;
  size: string;
  location: string;
  oppName: string;
  oppValue: number;
  stage: string;
  source: Source;
  ownerId: string;
  contactName: string;
  contactId: string;
  contactEmail: string;
  contactTitle: string;
  createdAt: string;
  closedAt?: string;
  expectedClose?: string;
}

const LEDGER_REFS: LedgerRef[] = [
  // Won
  { companyId: "company_brightline", companyName: "Brightline Energy", domain: "brightline-energy.com", industry: "Energy", size: "201–500", location: "Oslo, Norway", oppName: "Energy Data Platform", oppValue: 95000, stage: "won", source: "referral", ownerId: "usr_adnan", contactName: "Lukas Richter", contactId: "person_lukas_richter", contactEmail: "lukas.richter@brightline-energy.com", contactTitle: "CTO", createdAt: "2026-04-22", closedAt: "2026-07-16" },
  { companyId: "company_kestrel", companyName: "Kestrel Automotive", domain: "kestrelauto.com", industry: "Automotive", size: "1,000–5,000", location: "Gothenburg, Sweden", oppName: "Connected Vehicle Portal", oppValue: 85000, stage: "won", source: "referral", ownerId: "usr_elma", contactName: "Henrik Dahl", contactId: "person_henrik_dahl", contactEmail: "henrik.dahl@kestrelauto.com", contactTitle: "Head of Digital", createdAt: "2026-02-18", closedAt: "2026-06-05" },
  { companyId: "company_lumen", companyName: "Lumen Financial", domain: "lumenfinancial.com", industry: "Financial Services", size: "500–1,000", location: "London, UK", oppName: "Customer Portal Rebuild", oppValue: 60000, stage: "won", source: "google_organic", ownerId: "usr_adnan", contactName: "Sophie Andersen", contactId: "person_sophie_andersen", contactEmail: "sophie.andersen@lumenfinancial.com", contactTitle: "VP Product", createdAt: "2026-03-10", closedAt: "2026-05-20" },
  { companyId: "company_solvik", companyName: "Solvik Group", domain: "solvikgroup.com", industry: "Professional Services", size: "51–200", location: "Stockholm, Sweden", oppName: "Product Discovery Sprint", oppValue: 55000, stage: "won", source: "linkedin_organic", ownerId: "usr_igor", contactName: "Erik Lindqvist", contactId: "person_erik_lindqvist", contactEmail: "erik.lindqvist@solvikgroup.com", contactTitle: "CEO", createdAt: "2026-05-05", closedAt: "2026-07-02" },
  { companyId: "company_fjord", companyName: "Fjord Analytics", domain: "fjordanalytics.com", industry: "SaaS", size: "51–200", location: "Bergen, Norway", oppName: "Analytics MVP", oppValue: 45000, stage: "won", source: "google_organic", ownerId: "usr_elma", contactName: "Nils Berglund", contactId: "person_nils_berglund", contactEmail: "nils.berglund@fjordanalytics.com", contactTitle: "Head of Product", createdAt: "2026-06-02", closedAt: "2026-08-07" },
  { companyId: "company_praxis", companyName: "Praxis Consulting", domain: "praxisconsulting.com", industry: "Professional Services", size: "11–50", location: "Zurich, Switzerland", oppName: "Client Platform Refresh", oppValue: 30000, stage: "won", source: "google_ads", ownerId: "usr_adnan", contactName: "Clara Hoffmann", contactId: "person_clara_hoffmann", contactEmail: "clara.hoffmann@praxisconsulting.com", contactTitle: "Managing Director", createdAt: "2026-01-27", closedAt: "2026-03-20" },
  { companyId: "company_tessera", companyName: "Tessera Insurance", domain: "tesserainsurance.com", industry: "Insurance", size: "201–500", location: "Copenhagen, Denmark", oppName: "Claims Prototype", oppValue: 25000, stage: "won", source: "linkedin_ads", ownerId: "usr_elma", contactName: "Johan Eriksen", contactId: "person_johan_eriksen", contactEmail: "johan.eriksen@tesserainsurance.com", contactTitle: "Innovation Director", createdAt: "2026-06-16", closedAt: "2026-08-14" },
  { companyId: "company_verde", companyName: "Verde Mobility", domain: "verdemobility.com", industry: "Automotive", size: "500–1,000", location: "Munich, Germany", oppName: "UX & Architecture Audit", oppValue: 25000, stage: "won", source: "google_ads", ownerId: "usr_adnan", contactName: "Katrin Bauer", contactId: "person_katrin_bauer", contactEmail: "katrin.bauer@verdemobility.com", contactTitle: "Head of Product", createdAt: "2026-07-20", closedAt: "2026-09-04" },
  // Lost
  { companyId: "company_halden", companyName: "Halden Manufacturing", domain: "haldenmanufacturing.com", industry: "Manufacturing", size: "1,000–5,000", location: "Hamburg, Germany", oppName: "Factory Data Platform", oppValue: 75000, stage: "lost", source: "google_organic", ownerId: "usr_adnan", contactName: "Martin Holst", contactId: "person_martin_holst", contactEmail: "martin.holst@haldenmanufacturing.com", contactTitle: "VP Innovation", createdAt: "2026-04-20", closedAt: "2026-06-18" },
  { companyId: "company_norrland", companyName: "Norrland Energy", domain: "norrlandenergy.com", industry: "Energy", size: "500–1,000", location: "Stockholm, Sweden", oppName: "Grid Analytics Pilot", oppValue: 50000, stage: "lost", source: "linkedin_organic", ownerId: "usr_igor", contactName: "Anders Nyström", contactId: "person_anders_nystrom", contactEmail: "anders.nystrom@norrlandenergy.com", contactTitle: "Head of Innovation", createdAt: "2026-07-14", closedAt: "2026-09-08" },
  { companyId: "company_vireo", companyName: "Vireo Retail Group", domain: "vireoretail.com", industry: "Retail", size: "201–500", location: "Amsterdam, Netherlands", oppName: "Commerce Replatform", oppValue: 45000, stage: "lost", source: "google_ads", ownerId: "usr_adnan", contactName: "Lisa Wendt", contactId: "person_lisa_wendt", contactEmail: "lisa.wendt@vireoretail.com", contactTitle: "Director of Technology", createdAt: "2026-05-18", closedAt: "2026-08-01" },
  { companyId: "company_coral", companyName: "Coral Hospitality", domain: "coralhospitality.com", industry: "Real Estate", size: "201–500", location: "Barcelona, Spain", oppName: "Booking Experience Redesign", oppValue: 40000, stage: "lost", source: "meta", ownerId: "usr_adnan", contactName: "Annika Strand", contactId: "person_annika_strand", contactEmail: "annika.strand@coralhospitality.com", contactTitle: "Head of Digital", createdAt: "2026-05-28", closedAt: "2026-07-10" },
  // Open
  { companyId: "company_stratum", companyName: "Stratum Bank", domain: "stratumbank.com", industry: "Financial Services", size: "5,000+", location: "Frankfurt, Germany", oppName: "Digital Banking Platform", oppValue: 220000, stage: "negotiation", source: "linkedin_ads", ownerId: "usr_igor", contactName: "Frederik Holm", contactId: "person_frederik_holm", contactEmail: "frederik.holm@stratumbank.com", contactTitle: "Chief Digital Officer", createdAt: "2026-07-22", expectedClose: "2026-10-24" },
  { companyId: "company_baltic", companyName: "Baltic Freight Group", domain: "balticfreight.com", industry: "Logistics", size: "1,000–5,000", location: "Riga, Latvia", oppName: "Shipment Tracking Platform", oppValue: 140000, stage: "proposal", source: "google_organic", ownerId: "usr_adnan", contactName: "Jānis Kalniņš", contactId: "person_janis_kalnins", contactEmail: "janis.kalnins@balticfreight.com", contactTitle: "VP Innovation", createdAt: "2026-08-12", expectedClose: "2026-10-30" },
  { companyId: "company_veldt", companyName: "Veldt Partners", domain: "veldtpartners.com", industry: "Professional Services", size: "201–500", location: "Amsterdam, Netherlands", oppName: "Client Intelligence Platform", oppValue: 120000, stage: "proposal", source: "referral", ownerId: "usr_elma", contactName: "Pieter van der Berg", contactId: "person_pieter_van_der_berg", contactEmail: "pieter.vanderberg@veldtpartners.com", contactTitle: "Managing Partner", createdAt: "2026-08-18", expectedClose: "2026-10-31" },
  { companyId: "company_aurora", companyName: "Aurora Mobility", domain: "auroramobility.com", industry: "Automotive", size: "500–1,000", location: "Oslo, Norway", oppName: "Fleet Operations Suite", oppValue: 110000, stage: "qualified", source: "linkedin_organic", ownerId: "usr_igor", contactName: "Signe Haugen", contactId: "person_signe_haugen", contactEmail: "signe.haugen@auroramobility.com", contactTitle: "Director of Digital Transformation", createdAt: "2026-09-01", expectedClose: "2026-11-14" },
  { companyId: "company_hartmann", companyName: "Hartmann Industrie", domain: "hartmannindustrie.de", industry: "Manufacturing", size: "5,000+", location: "Munich, Germany", oppName: "AI Quality Inspection", oppValue: 90000, stage: "discovery", source: "referral", ownerId: "usr_elma", contactName: "Klaus Hartmann", contactId: "person_klaus_hartmann", contactEmail: "klaus.hartmann@hartmannindustrie.de", contactTitle: "VP Innovation", createdAt: "2026-09-10", expectedClose: "2026-12-12" },
  { companyId: "company_cobalt", companyName: "Cobalt Retail Tech", domain: "cobaltretail.com", industry: "Retail", size: "201–500", location: "Berlin, Germany", oppName: "Personalization Engine", oppValue: 65000, stage: "discovery", source: "google_ads", ownerId: "usr_adnan", contactName: "Max Voss", contactId: "person_max_voss", contactEmail: "max.voss@cobaltretail.com", contactTitle: "Head of Product", createdAt: "2026-09-16", expectedClose: "2026-11-28" },
  { companyId: "company_polaris", companyName: "Polaris Energy", domain: "polarisenergy.com", industry: "Energy", size: "500–1,000", location: "Stavanger, Norway", oppName: "Customer Energy Portal", oppValue: 60000, stage: "qualified", source: "event", ownerId: "usr_adnan", contactName: "Elias Svensson", contactId: "person_elias_svensson", contactEmail: "elias.svensson@polarisenergy.com", contactTitle: "Head of Digital", createdAt: "2026-09-03", expectedClose: "2026-11-20" },
];

// ── Source distribution targets ─────────────────────────────────────────────
// §9.3 first-touch distribution (80 leads):
//   Google Organic: 17, Google Ads: 15, LinkedIn Organic: 12, LinkedIn Ads: 8,
//   Referral: 6, Event: 4, Meta: 5, Email: 2, Unknown: 11
//
// Hero leads (11 with lead_created — Michael Brown has none) by source:
//   google_organic: 1 (John), google_ads: 1 (Emma), linkedin_organic: 2 (Sarah, Ingrid),
//   linkedin_ads: 1 (David), direct: 1 (Thomas), event: 1 (Marta),
//   meta: 3 (Felix,Nina,Tobias), unknown: 1 (Anna)
//   → heroes with marketing first touch: 9 full
//   → Thomas: partial(a), Anna: unknown
//
// Non-hero ledger (19) by source (all full — marketing session + conversion):
//   google_organic: 4, google_ads: 4, linkedin_organic: 3, linkedin_ads: 2,
//   referral: 4, event: 1, meta: 1, email: 0, unknown: 0
//
// Remaining no-opp leads (50 = 80 - 11 - 19):
//   google_organic: 12, google_ads: 10, linkedin_organic: 7, linkedin_ads: 5,
//   referral: 2, event: 2, meta: 1, email: 2, unknown: 9

const NO_OPP_SOURCE_COUNTS: Record<Source, number> = {
  google_organic: 12,
  google_ads: 10,
  linkedin_organic: 7,
  linkedin_ads: 5,
  referral: 2,       // §9.3: 6 total = 0 hero + 4 ledger + 2 no-opp
  event: 2,
  meta: 1,
  email: 2,
  unknown: 9,         // 3 partial(a) + 6 unknown
};

// ── Attribution status targets ──────────────────────────────────────────────
// Total: 58 full, 15 partial, 7 unknown = 80
// Heroes: 9 full + 1 partial(a) (Thomas) + 1 unknown (Anna) = 11
// Ledger (19): all have marketing sessions + conversion → 19 full
// Need from no-opp (50): 58-9-19 = 30 full, 15-1 = 14 partial, 7-1 = 6 unknown
//
// §9.3 §5.4 partial split:
//   Partial (a): no marketing touch + self-reported/relationship → first touch = unknown
//     Atlas (hero) + 3 generated = 4 total partial(a)
//   Partial (b): marketing touch + no tracked conversion → first touch = marketing source
//     11 generated = 11 total partial(b)
//   Total partial: 4 + 11 = 15 ✓
//
// Source allocation:
//   41 marketing no-opp sources (12+10+7+5+2+2+1+2) → 30 full + 11 partial(b)
//   9 unknown no-opp sources → 3 partial(a) + 6 unknown

// ── Multi-touch source pairs ────────────────────────────────────────────────
// When a full lead needs a different marketing source for middle sessions
const MULTI_TOUCH_PAIRS: Record<string, Source[]> = {
  google_organic: ["linkedin_organic", "email"],
  google_ads: ["google_organic", "linkedin_ads"],
  linkedin_organic: ["google_organic", "email"],
  linkedin_ads: ["linkedin_organic", "google_ads"],
  referral: ["google_organic", "linkedin_organic"],
  event: ["google_organic", "linkedin_organic"],
  meta: ["google_organic", "linkedin_ads"],
  email: ["google_organic", "linkedin_organic"],
};

// ── Landing pages per source ────────────────────────────────────────────────
const SOURCE_LANDING_PAGES: Record<string, string[]> = {
  google_organic: ["/blog/product-strategy-ai-era", "/blog/building-ai-native-products", "/services/ai-product-development", "/services/digital-transformation"],
  google_ads: ["/services/ai-product-development", "/services/product-strategy", "/services/software-engineering", "/engagement"],
  linkedin_organic: ["/blog/scaling-product-teams-2026", "/blog/digital-transformation-without-theatre", "/work", "/about"],
  linkedin_ads: ["/services/product-strategy", "/services/digital-transformation", "/engagement"],
  referral: ["/", "/services", "/work", "/about"],
  event: ["/", "/services/ai-product-development", "/engagement"],
  meta: ["/", "/services", "/work"],
  email: ["/blog/roi-design-led-development", "/blog/prototype-to-production", "/services/ai-product-development"],
  direct: ["/", "/contact", "/services", "/about"],
};

// ── Helpers ─────────────────────────────────────────────────────────────────

interface GenCompany {
  id: string;
  name: string;
  domain: string;
  industry: string;
  size: string;
  location: string;
  ownerId: string;
  createdAt: string;
}

interface GenPerson {
  id: string;
  name: string;
  email: string;
  title: string;
  companyId: string;
  ownerId: string;
  leadStatus: string;
  conversionMechanism: string;
  selfReportedSource?: string;
  createdAt: string;
}

interface GenSession {
  id: string;
  personId: string;
  source: string;
  medium: string;
  startedAt: string;
  landingPage: string;
  referrer: string;
  campaign?: string;
  pageviews: number;
  duration: number;
  sourceSystem: string;
}

interface GenEvent {
  id: string;
  personId: string;
  sessionId?: string;
  type: string;
  category: string;
  timestamp: string;
  description: string;
  metadata: Record<string, unknown>;
  sourceSystem: string;
}

const companies: GenCompany[] = [];
const people: GenPerson[] = [];
const sessions: GenSession[] = [];
const events: GenEvent[] = [];

let companyCounter = 0;
let personCounter = 0;
let sessionCounter = 0;
let eventCounter = 0;

function genId(prefix: string, counter: number): string {
  return `${prefix}_gen_${String(counter).padStart(3, "0")}`;
}

function addDays(dateStr: string, days: number): string {
  const d = new Date(dateStr);
  d.setDate(d.getDate() + days);
  return d.toISOString().replace("Z", "+02:00").replace(/\.\d{3}/, "");
}

function addMinutes(dateStr: string, minutes: number): string {
  const d = new Date(dateStr);
  d.setMinutes(d.getMinutes() + minutes);
  return d.toISOString().replace("Z", "+02:00").replace(/\.\d{3}/, "");
}

function formatDate(d: Date): string {
  return d.toISOString().split("T")[0];
}

function toTimestamp(d: Date): string {
  return d.toISOString().replace("Z", "+02:00").replace(/\.\d{3}/, "");
}

function sourceToMedium(source: Source | "direct"): string {
  if (source === "google_ads" || source === "linkedin_ads" || source === "meta") return "cpc";
  if (source === "google_organic") return "organic";
  if (source === "linkedin_organic") return "social";
  if (source === "referral") return "referral";
  if (source === "event") return "none";
  if (source === "email") return "email";
  return "none";
}

function sourceToReferrer(source: Source | "direct"): string {
  if (source === "google_organic" || source === "google_ads") return "google.com";
  if (source === "linkedin_organic" || source === "linkedin_ads") return "linkedin.com";
  if (source === "meta") return rand() > 0.5 ? "facebook.com" : "instagram.com";
  return "";
}

function sourceToCampaign(source: Source | "direct"): string | undefined {
  const campaigns: Record<string, string[]> = {
    google_ads: ["camp_ai_transformation_q3", "camp_enterprise_ai_search", "camp_ai_healthcare"],
    linkedin_ads: ["camp_product_innovation_europe", "camp_nordics_expansion"],
    linkedin_organic: ["camp_linkedin_founder_content", "camp_ai_product_strategy", "camp_q3_executive_content"],
    google_organic: ["camp_digital_transformation_search"],
    meta: ["camp_website_retargeting"],
    event: ["camp_enterprise_innovation_leaders"],
  };
  const pool = campaigns[source];
  return pool ? pick(pool) : undefined;
}

function sourceSystem(dateStr: string): string {
  return dateStr >= "2026-09-15" ? "sales_tracker" : "hubspot";
}

function pickConvMech(source: Source): ConvMech {
  if (source === "email") return "email_inquiry";
  if (source === "event") return rand() > 0.5 ? "contact_form" : "email_inquiry";
  const r = rand();
  if (r < 0.6) return "contact_form";
  if (r < 0.8) return "book_a_call";
  if (r < 0.9) return "newsletter_signup";
  return "email_inquiry";
}

function convMechToEventType(mech: ConvMech): string {
  switch (mech) {
    case "contact_form": return "form_submitted";
    case "book_a_call": return "booking_submitted";
    case "email_inquiry": return "email_inquiry_received";
    case "newsletter_signup": return "newsletter_signup";
  }
}

function convMechToSourceSystem(mech: ConvMech): string {
  switch (mech) {
    case "contact_form": return "resend";
    case "book_a_call": return "cal_com";
    case "email_inquiry": return "email";
    case "newsletter_signup": return "kit";
  }
}

function pickLandingPage(source: string): string {
  const pages = SOURCE_LANDING_PAGES[source] ?? PAGES;
  return pick(pages);
}

// ── Response time pool ──────────────────────────────────────────────────────
// Target mean: 2h 18m (138 min). Pre-computed to hit exact average.
// Heroes contribute: 17, 45, 22, 45, 50, 90, 75 = 344 min from 7 heroes with responses
// (Felix, Nina, Tobias have no response in hero data)
// Need generated response times to average to ~138 min overall

const RESPONSE_TIMES_MINUTES = [
  // Fast responses (< 1h) — 18 leads
  12, 15, 18, 20, 22, 25, 28, 30, 32, 35, 38, 40, 42, 45, 48, 50, 52, 55,
  // Medium responses (1h-3h) — 20 leads
  65, 72, 78, 85, 90, 95, 100, 108, 115, 120, 125, 130, 135, 140, 145, 150, 155, 160, 165, 170,
  // Slow responses (3h-6h) — 15 leads
  182, 185, 188, 190, 192, 195, 198, 200, 205, 210, 215, 220, 225, 230, 235,
  // Slower (5h-7h) — 7 leads
  310, 340, 360, 380, 400, 410, 420,
  // No response — 9 leads (unknown attribution, some partial)
];

// Shuffle and distribute
const shuffledResponseTimes = shuffle([...RESPONSE_TIMES_MINUTES]);
let responseTimeIdx = 0;

function getResponseTime(): number | null {
  if (responseTimeIdx >= shuffledResponseTimes.length) return randInt(60, 300);
  return shuffledResponseTimes[responseTimeIdx++];
}

// ── Stage assignment helpers ────────────────────────────────────────────────

// leadStatus for opp-linked people: always "qualified" (they have opportunities)
function leadStatusForOpp(): string {
  return "qualified";
}

// Funnel: 80 leads → 44 qualified → 26 opp → 17 proposal → 10 won
// Qualified+ breakdown:
//   26 opp leads (all qualified+) → leadStatus "qualified"
//   Michael Brown is NOT a lead (no lead_created event)
//   Sarah Johnson: leadStatus "qualified"
//   Need from 50 generated no-opp leads: 44 - 26 - 1 (Sarah) = 17 qualified
//   3 waiting leads are "contacted"
//   Remaining 50 - 3 - 17 = 30 non-qualified non-waiting leads
const noOppStagePool: string[] = [];
for (let i = 0; i < 17; i++) noOppStagePool.push("qualified");
for (let i = 0; i < 10; i++) noOppStagePool.push("new");
for (let i = 0; i < 6; i++) noOppStagePool.push("contacted");
for (let i = 0; i < 14; i++) noOppStagePool.push("disqualified");
const shuffledStages = shuffle(noOppStagePool);
let stageIdx = 0;

// ── Multi-session journey builder ───────────────────────────────────────────

interface JourneySession {
  source: Source | "direct";
  hasConversion: boolean;
  convMech?: ConvMech;
  dayOffset: number; // days before conversion date (0 = conversion day)
}

/**
 * Build a multi-session journey for a lead.
 *
 * Full leads: 2-6 sessions over 3-21 days, first session = assigned marketing source,
 * ~40% get a different marketing source in a middle session,
 * ~50% convert in Direct sessions.
 *
 * Partial(b): 1-3 marketing sessions, NO conversion event.
 *
 * Partial(a): 1 direct session with conversion.
 *
 * Unknown: 1 direct session with conversion.
 */
function buildJourney(
  firstTouchSource: Source,
  attrStatus: AttrStatus,
  convMech: ConvMech,
): JourneySession[] {
  if (attrStatus === "partial_a" || attrStatus === "unknown") {
    // Single direct session with conversion
    return [{ source: "direct", hasConversion: true, convMech, dayOffset: 0 }];
  }

  if (attrStatus === "partial_b") {
    // 1-3 marketing sessions, NO conversion event
    const sessionCount = weightedPick([1, 2, 3], [40, 40, 20]);
    const sessionsOut: JourneySession[] = [];
    for (let s = 0; s < sessionCount; s++) {
      const dayOffset = (sessionCount - 1 - s) * randInt(2, 7);
      sessionsOut.push({
        source: firstTouchSource,
        hasConversion: false,
        dayOffset,
      });
    }
    return sessionsOut;
  }

  // Full lead: multi-session journey
  // Use more 3+ session journeys to allow room for different middle sources
  const sessionCount = weightedPick([2, 3, 4, 5, 6], [15, 35, 25, 15, 10]);
  const journeySpanDays = randInt(3, 21);
  const convertInDirect = rand() < 0.5;

  // For multi-touch diversity: place a different marketing source in the
  // LAST non-conversion session so getLastMarketingTouch returns a different
  // source from getFirstTouch. For 2-session leads, the second session is
  // already the conversion — to get different first/last, make the conversion
  // session use a different marketing source (when not converting in Direct).
  const wantDifferentLastTouch = rand() < 0.45;

  const sessionsOut: JourneySession[] = [];

  // Compute day offsets: spread sessions across journey span
  const dayOffsets: number[] = [];
  dayOffsets.push(journeySpanDays); // first session (earliest)
  dayOffsets.push(0); // conversion session (latest)
  for (let m = 0; m < sessionCount - 2; m++) {
    dayOffsets.push(randInt(1, journeySpanDays - 1));
  }
  dayOffsets.sort((a, b) => b - a); // descending: earliest first

  // Find the index of the last non-conversion session
  const lastMiddleIdx = sessionCount >= 3 ? sessionCount - 2 : -1;

  for (let s = 0; s < sessionCount; s++) {
    const isFirst = s === 0;
    const isLast = s === sessionCount - 1;

    let source: Source | "direct";
    if (isFirst) {
      source = firstTouchSource;
    } else if (isLast) {
      // Conversion session
      if (convertInDirect) {
        source = "direct";
      } else if (wantDifferentLastTouch && sessionCount === 2) {
        // 2-session lead: conversion session uses different marketing source
        const pairs = MULTI_TOUCH_PAIRS[firstTouchSource];
        source = pairs ? pick(pairs) : firstTouchSource;
      } else {
        source = firstTouchSource;
      }
    } else if (s === lastMiddleIdx && wantDifferentLastTouch) {
      // Last middle session: use a different marketing source
      // This ensures getLastMarketingTouch returns something different
      const pairs = MULTI_TOUCH_PAIRS[firstTouchSource];
      source = pairs ? pick(pairs) : firstTouchSource;
    } else {
      // Other middle sessions: mix of direct and same source
      source = rand() < 0.4 ? "direct" : firstTouchSource;
    }

    sessionsOut.push({
      source,
      hasConversion: isLast,
      convMech: isLast ? convMech : undefined,
      dayOffset: dayOffsets[s],
    });
  }

  return sessionsOut;
}

/**
 * Generate session + event records for a journey.
 * Returns the lead date string (timestamp of conversion / last session).
 */
function emitJourney(
  personId: string,
  journeySessions: JourneySession[],
  conversionDate: Date,
): string {
  let leadDateStr = "";

  for (const js of journeySessions) {
    const sessionDate = new Date(conversionDate.getTime() - js.dayOffset * 86400000);
    const sessStartTime = new Date(
      sessionDate.getTime() + randInt(8, 17) * 3600000 + randInt(0, 59) * 60000,
    );
    const sessDuration = randInt(120, 900);
    const sessStartStr = toTimestamp(sessStartTime);

    sessionCounter++;
    const sessId = genId("sess", sessionCounter);

    sessions.push({
      id: sessId,
      personId,
      source: js.source === "unknown" ? "direct" : js.source,
      medium: sourceToMedium(js.source),
      startedAt: sessStartStr,
      landingPage: pickLandingPage(js.source),
      referrer: sourceToReferrer(js.source),
      campaign: sourceToCampaign(js.source),
      pageviews: randInt(2, 6),
      duration: sessDuration,
      sourceSystem: "website_tracker",
    });

    // session_started event
    eventCounter++;
    events.push({
      id: genId("evt", eventCounter),
      personId,
      sessionId: sessId,
      type: "session_started",
      category: "acquisition",
      timestamp: sessStartStr,
      description: js.source === "direct" ? "Direct visit" : `${js.source} visit`,
      metadata: {},
      sourceSystem: "website_tracker",
    });

    // Page views (2-5 per session)
    const pvCount = randInt(2, 5);
    for (let p = 0; p < pvCount; p++) {
      eventCounter++;
      const pvTime = addMinutes(sessStartStr, (p + 1) * randInt(1, 4));
      const pageType = rand();
      let pageUrl: string;
      let evtType: string;
      let evtDesc: string;
      if (pageType < 0.15) {
        const title = pick(CONTENT_TITLES);
        pageUrl = `/blog/${title.toLowerCase().replace(/\s+/g, "-").replace(/[^a-z0-9-]/g, "")}`;
        evtType = "blog_post_viewed";
        evtDesc = `Read: ${title}`;
      } else if (pageType < 0.25) {
        const cs = pick(CASE_STUDIES);
        pageUrl = `/work/${cs.toLowerCase().replace(/\s+/g, "-").replace(/[^a-z0-9-]/g, "")}`;
        evtType = "case_study_viewed";
        evtDesc = `Viewed: ${cs}`;
      } else {
        pageUrl = pick(PAGES);
        evtType = "page_viewed";
        evtDesc = `Viewed ${pageUrl}`;
      }
      events.push({
        id: genId("evt", eventCounter),
        personId,
        sessionId: sessId,
        type: evtType,
        category: "website",
        timestamp: pvTime,
        description: evtDesc,
        metadata: { page: pageUrl },
        sourceSystem: "website_tracker",
      });
    }

    // Conversion event (only in the conversion session)
    if (js.hasConversion && js.convMech) {
      const convTime = addMinutes(sessStartStr, randInt(5, 20));
      leadDateStr = convTime;

      eventCounter++;
      events.push({
        id: genId("evt", eventCounter),
        personId,
        sessionId: sessId,
        type: convMechToEventType(js.convMech),
        category: "conversion",
        timestamp: convTime,
        description: `${js.convMech} conversion`,
        metadata: { formType: js.convMech },
        sourceSystem: convMechToSourceSystem(js.convMech),
      });
    }
  }

  // For partial(b) with no conversion, use the last session start as lead date
  if (!leadDateStr) {
    const lastSession = journeySessions[journeySessions.length - 1];
    const lastDate = new Date(conversionDate.getTime() - lastSession.dayOffset * 86400000);
    leadDateStr = toTimestamp(new Date(
      lastDate.getTime() + randInt(8, 17) * 3600000 + randInt(0, 59) * 60000,
    ));
  }

  return leadDateStr;
}

// ── Generate ledger company leads ───────────────────────────────────────────

for (const ref of LEDGER_REFS) {
  companyCounter++;
  const company: GenCompany = {
    id: ref.companyId,
    name: ref.companyName,
    domain: ref.domain,
    industry: ref.industry,
    size: ref.size,
    location: ref.location,
    ownerId: ref.ownerId,
    createdAt: ref.createdAt,
  };
  companies.push(company);

  const convMech = pickConvMech(ref.source);

  // Lead date: createdAt minus some days for journey
  const oppDate = new Date(ref.createdAt + "T10:00:00+02:00");
  const conversionDate = new Date(oppDate.getTime() - randInt(7, 30) * 86400000);

  // Build multi-session journey for ledger leads (all are full)
  const journeySessions = buildJourney(ref.source, "full", convMech);
  const leadDateStr = emitJourney(ref.contactId, journeySessions, conversionDate);

  personCounter++;
  const person: GenPerson = {
    id: ref.contactId,
    name: ref.contactName,
    email: ref.contactEmail,
    title: ref.contactTitle,
    companyId: ref.companyId,
    ownerId: ref.ownerId,
    leadStatus: leadStatusForOpp(),
    conversionMechanism: convMech,
    createdAt: leadDateStr,
  };
  people.push(person);

  // lead_created
  eventCounter++;
  events.push({
    id: genId("evt", eventCounter),
    personId: ref.contactId,
    type: "lead_created",
    category: "crm",
    timestamp: leadDateStr,
    description: "Lead created",
    metadata: {},
    sourceSystem: sourceSystem(leadDateStr),
  });

  // First response email
  const respTime = getResponseTime();
  if (respTime !== null) {
    eventCounter++;
    const respTimestamp = addMinutes(leadDateStr, respTime);
    events.push({
      id: genId("evt", eventCounter),
      personId: ref.contactId,
      type: "email_sent",
      category: "communication",
      timestamp: respTimestamp,
      description: `First response`,
      metadata: { from: ref.ownerId, to: ref.contactId, responseTimeMinutes: respTime },
      sourceSystem: "email",
    });
  }

  // Opportunity created
  eventCounter++;
  const oppTimestamp = oppDate.toISOString().replace("Z", "+02:00").replace(/\.\d{3}/, "");
  events.push({
    id: genId("evt", eventCounter),
    personId: ref.contactId,
    type: "opportunity_created",
    category: "crm",
    timestamp: oppTimestamp,
    description: `${ref.oppName} — €${(ref.oppValue / 1000).toFixed(0)}K`,
    metadata: { opportunityName: ref.oppName, opportunityValue: ref.oppValue },
    sourceSystem: sourceSystem(oppTimestamp),
  });

  // Stage progression + deal outcome
  if (ref.stage === "won" && ref.closedAt) {
    eventCounter++;
    events.push({
      id: genId("evt", eventCounter),
      personId: ref.contactId,
      type: "proposal_sent",
      category: "revenue",
      timestamp: addDays(oppTimestamp, randInt(14, 30)),
      description: `Proposal sent — €${ref.oppValue.toLocaleString("en-GB")}`,
      metadata: { proposalValue: ref.oppValue },
      sourceSystem: sourceSystem(ref.closedAt),
    });
    eventCounter++;
    events.push({
      id: genId("evt", eventCounter),
      personId: ref.contactId,
      type: "deal_won",
      category: "revenue",
      timestamp: ref.closedAt + "T16:00:00+02:00",
      description: `Deal won — €${ref.oppValue.toLocaleString("en-GB")}`,
      metadata: { dealValue: ref.oppValue },
      sourceSystem: sourceSystem(ref.closedAt),
    });
  } else if (ref.stage === "lost" && ref.closedAt) {
    eventCounter++;
    events.push({
      id: genId("evt", eventCounter),
      personId: ref.contactId,
      type: "deal_lost",
      category: "revenue",
      timestamp: ref.closedAt + "T10:00:00+02:00",
      description: `Deal lost`,
      metadata: { dealValue: ref.oppValue },
      sourceSystem: sourceSystem(ref.closedAt),
    });
  } else if (ref.stage === "proposal" || ref.stage === "negotiation") {
    eventCounter++;
    events.push({
      id: genId("evt", eventCounter),
      personId: ref.contactId,
      type: "proposal_sent",
      category: "revenue",
      timestamp: addDays(oppTimestamp, randInt(14, 28)),
      description: `Proposal sent — €${ref.oppValue.toLocaleString("en-GB")}`,
      metadata: { proposalValue: ref.oppValue },
      sourceSystem: sourceSystem(addDays(oppTimestamp, 20)),
    });
  }
}

// ── Generate no-opportunity leads ───────────────────────────────────────────

const usedCompanyNames = new Set<string>(
  [...companies.map((c) => c.name), "Acme Inc", "Northstar Health", "Atlas Systems",
   "Nordica Labs", "Vector Group", "Helix Finance", "Meridian Logistics", "Orbit Retail"]
);

// ── Attribution-aware source + status assignment ──────────────────────────
// Heroes: 9 full, 1 partial(a) (Thomas: direct with relationship), 1 unknown (Anna)
// Michael Brown has no lead_created → not a lead
// Ledger (19): all have marketing sessions + conversion → 19 full
// Need from no-opp (50): 58-9-19=30 full, 15-1=14 partial (3 partial_a + 11 partial_b), 7-1=6 unknown
//
// Source allocation:
//   41 marketing no-opp sources (12+10+7+5+2+2+1+2) → 30 full + 11 partial(b)
//   9 unknown no-opp sources → 3 partial(a) + 6 unknown

// Build coordinated source+status pairs
interface NoOppLead { source: Source; attrStatus: AttrStatus; }
const noOppLeads: NoOppLead[] = [];

// Marketing sources: 41 total → 30 full + 11 partial(b)
const marketingSources: Source[] = [];
for (const [source, count] of Object.entries(NO_OPP_SOURCE_COUNTS)) {
  if (source !== "unknown") {
    for (let i = 0; i < count; i++) {
      marketingSources.push(source as Source);
    }
  }
}
const shuffledMarketingSources = shuffle(marketingSources);
for (let i = 0; i < shuffledMarketingSources.length; i++) {
  noOppLeads.push({
    source: shuffledMarketingSources[i],
    attrStatus: i < 30 ? "full" : "partial_b",
  });
}

// Unknown sources (9 total): 3 partial(a) + 6 unknown
for (let i = 0; i < 9; i++) {
  noOppLeads.push({
    source: "unknown",
    attrStatus: i < 3 ? "partial_a" : "unknown",
  });
}

// Shuffle all no-opp leads together
const shuffledNoOppLeads = shuffle(noOppLeads);

// Self-reported attributions for partial(a) leads
const SELF_REPORTED_RESPONSES = [
  "A colleague mentioned your company at a conference.",
  "Heard about you through an industry contact.",
  "Someone on our team had worked with you before.",
  "A partner recommended reaching out.",
];

interface GenSelfReported {
  personId: string;
  response: string;
}
const generatedSelfReported: GenSelfReported[] = [];

// Waiting leads: 3 generated + Anna Keller (hero). Generate at indices 0,1,2
const WAITING_OFFSETS_HOURS = [73, 98, 120]; // 3d 1h, 4d 2h, 5d 0h
const NOW = new Date("2026-09-27T12:00:00+02:00");

// Pre-generate 18 companies for the 50 no-opp leads (target: 45 total companies)
// 45 - 8 (hero) - 19 (ledger) = 18
const NO_OPP_COMPANY_COUNT = 18;
interface NoOppCompany {
  id: string;
  name: string;
  domain: string;
  industry: string;
  size: string;
  location: string;
  ownerId: string;
  createdAt: string;
}
const noOppCompanies: NoOppCompany[] = [];
for (let c = 0; c < NO_OPP_COMPANY_COUNT; c++) {
  companyCounter++;
  let compName: string;
  do {
    compName = `${pick(COMPANY_PREFIXES)} ${pick(COMPANY_SUFFIXES)}`;
  } while (usedCompanyNames.has(compName));
  usedCompanyNames.add(compName);

  const compId = genId("company", companyCounter);
  const domain = compName.toLowerCase().replace(/\s+/g, "").replace(/[^a-z0-9]/g, "") + ".com";
  const industry = pick(INDUSTRIES);
  const size = pick(SIZES);
  const location = pick(LOCATIONS);
  const ownerId = pick(OWNERS);
  const monthRange = randInt(1, 9);
  const dayRange = randInt(1, 28);
  const createdAtDate = formatDate(new Date(2026, monthRange - 1, dayRange));

  const comp: NoOppCompany = { id: compId, name: compName, domain, industry, size, location, ownerId, createdAt: createdAtDate };
  noOppCompanies.push(comp);
  companies.push(comp);
}

// Distribute 50 leads across the 18 companies (some companies get multiple leads)
const companyAssignments: number[] = [];
for (let i = 0; i < 50; i++) {
  companyAssignments.push(i % NO_OPP_COMPANY_COUNT);
}
const shuffledAssignments = shuffle(companyAssignments);

for (let i = 0; i < 50; i++) {
  const { source, attrStatus } = shuffledNoOppLeads[i];
  const assignedCompany = noOppCompanies[shuffledAssignments[i]];

  // Lead date: spread across Jan-Sep 2026
  const leadBase = new Date(2026, randInt(0, 8), randInt(1, 28), randInt(8, 17), randInt(0, 59));

  // Waiting leads
  let isWaiting = false;
  if (i < 3) {
    isWaiting = true;
    // Adjust lead date to be recent enough
    const waitingHours = WAITING_OFFSETS_HOURS[i];
    const lastEmailTime = new Date(NOW.getTime() - waitingHours * 3600000);
    // Lead was created 7-14 days before the waiting email
    leadBase.setTime(lastEmailTime.getTime() - randInt(7, 14) * 86400000);
  }

  // Person
  personCounter++;
  const firstName = pick(FIRST_NAMES);
  const lastName = pick(LAST_NAMES);
  const personName = `${firstName} ${lastName}`;
  const personId = genId("person", personCounter);
  const email = `${firstName.toLowerCase()}.${lastName.toLowerCase().replace(/[^a-z]/g, "")}@${assignedCompany.domain}`;
  const title = pick(TITLES);

  // Conversion mechanism:
  // Partial(b) = no tracked conversion, CRM records email_inquiry as the mechanism
  const convMech = attrStatus === "partial_b" ? "email_inquiry" as ConvMech : pickConvMech(source);

  const leadStatus = isWaiting ? "contacted" : shuffledStages[stageIdx++];

  // Build journey and emit sessions/events
  const journeySessions = buildJourney(source, attrStatus, convMech);
  const leadDateStr = emitJourney(personId, journeySessions, leadBase);

  people.push({
    id: personId,
    name: personName,
    email,
    title,
    companyId: assignedCompany.id,
    ownerId: assignedCompany.ownerId,
    leadStatus,
    conversionMechanism: convMech,
    createdAt: leadDateStr,
  });

  // Self-reported attribution for partial(a) leads only
  // Partial(a) = direct session + self-reported evidence → no marketing touch detected
  if (attrStatus === "partial_a") {
    generatedSelfReported.push({
      personId,
      response: pick(SELF_REPORTED_RESPONSES),
    });
  }

  // lead_created
  eventCounter++;
  events.push({
    id: genId("evt", eventCounter),
    personId,
    type: "lead_created",
    category: "crm",
    timestamp: leadDateStr,
    description: "Lead created",
    metadata: {},
    sourceSystem: sourceSystem(leadDateStr),
  });

  // First response (skip for some unknown leads)
  if (attrStatus !== "unknown" || rand() > 0.5) {
    const respTime = getResponseTime();
    if (respTime !== null) {
      eventCounter++;
      const respTimestamp = addMinutes(leadDateStr, respTime);
      events.push({
        id: genId("evt", eventCounter),
        personId,
        type: "email_sent",
        category: "communication",
        timestamp: respTimestamp,
        description: "First response",
        metadata: { from: assignedCompany.ownerId, to: personId, responseTimeMinutes: respTime },
        sourceSystem: "email",
      });

      // Waiting leads: add inbound email at specific time
      if (isWaiting) {
        const waitingHours = WAITING_OFFSETS_HOURS[i];
        const lastEmailTime = new Date(NOW.getTime() - waitingHours * 3600000);
        const lastEmailStr = lastEmailTime.toISOString().replace("Z", "+02:00").replace(/\.\d{3}/, "");
        eventCounter++;
        events.push({
          id: genId("evt", eventCounter),
          personId,
          type: "email_received",
          category: "communication",
          timestamp: lastEmailStr,
          description: "Follow-up question",
          metadata: { subject: "Follow-up" },
          sourceSystem: "email",
        });
      }
    }
  }
}

// ── Write output files ──────────────────────────────────────────────────────

const outDir = join(process.cwd(), "src/data/generated");
mkdirSync(outDir, { recursive: true });

function toTS(varName: string, typeName: string, data: unknown[]): string {
  return `import type { ${typeName} } from "@/types";\n\nexport const ${varName}: ${typeName}[] = ${JSON.stringify(data, null, 2)};\n`;
}

writeFileSync(
  join(outDir, "companies.ts"),
  toTS("generatedCompanies", "Company", companies),
);

writeFileSync(
  join(outDir, "people.ts"),
  toTS("generatedPeople", "Person", people),
);

writeFileSync(
  join(outDir, "sessions.ts"),
  toTS("generatedSessions", "Session", sessions),
);

writeFileSync(
  join(outDir, "events.ts"),
  toTS("generatedEvents", "Event", events),
);

writeFileSync(
  join(outDir, "self-reported.ts"),
  toTS("generatedSelfReported", "SelfReportedAttribution", generatedSelfReported),
);

// Index file
writeFileSync(
  join(outDir, "index.ts"),
  `export { generatedCompanies } from "./companies";
export { generatedPeople } from "./people";
export { generatedSessions } from "./sessions";
export { generatedEvents } from "./events";
export { generatedSelfReported } from "./self-reported";
`,
);

console.log(`Generated:`);
console.log(`  Companies: ${companies.length}`);
console.log(`  People: ${people.length}`);
console.log(`  Sessions: ${sessions.length}`);
console.log(`  Events: ${events.length}`);
console.log(`  Self-reported: ${generatedSelfReported.length}`);
