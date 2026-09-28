import type { Company, Person, Session, Event } from "@/types";

// ---------------------------------------------------------------------------
// Company
// ---------------------------------------------------------------------------

export const vectorCompany: Company = {
  id: "company_vector",
  name: "Vector Group",
  domain: "vectorgroup.com",
  industry: "Manufacturing",
  size: "5,000+",
  location: "Vienna, Austria",
  ownerId: "usr_igor",
  createdAt: "2026-09-09",
};

// ---------------------------------------------------------------------------
// People
// ---------------------------------------------------------------------------

export const vectorPeople: Person[] = [
  {
    id: "person_anna_keller",
    name: "Anna Keller",
    email: "anna.keller@vectorgroup.com",
    title: "Director of Digital Transformation",
    companyId: "company_vector",
    ownerId: "usr_igor",
    displayStage: "qualified",
    firstTouchSource: "unknown",
    conversionMechanism: "contact_form",
    conversionChannel: "direct",
    createdAt: "2026-09-09T14:20:00+02:00",
  },
];

// ---------------------------------------------------------------------------
// Sessions
// ---------------------------------------------------------------------------

export const vectorSessions: Session[] = [
  {
    id: "sess_vector_001",
    personId: "person_anna_keller",
    source: "direct",
    medium: "none",
    startedAt: "2026-09-09T13:50:00+02:00",
    landingPage: "/",
    referrer: "",
    pageviews: 4,
    duration: 480,
    sourceSystem: "website_tracker",
  },
];

// ---------------------------------------------------------------------------
// Events
// ---------------------------------------------------------------------------

export const vectorEvents: Event[] = [
  // ---- Session 1: Sep 9 (Direct — Conversion) ----
  {
    id: "evt_vector_001",
    personId: "person_anna_keller",
    sessionId: "sess_vector_001",
    type: "session_started",
    category: "acquisition",
    timestamp: "2026-09-09T13:50:00+02:00",
    description: "Direct visit",
    metadata: {},
    sourceSystem: "website_tracker",
  },
  {
    id: "evt_vector_002",
    personId: "person_anna_keller",
    sessionId: "sess_vector_001",
    type: "page_viewed",
    category: "website",
    timestamp: "2026-09-09T13:52:00+02:00",
    description: "Viewed services",
    metadata: { page: "/services", pageTitle: "Services" },
    sourceSystem: "website_tracker",
  },
  {
    id: "evt_vector_003",
    personId: "person_anna_keller",
    sessionId: "sess_vector_001",
    type: "page_viewed",
    category: "website",
    timestamp: "2026-09-09T14:00:00+02:00",
    description: "Viewed digital transformation",
    metadata: { page: "/services/digital-transformation", pageTitle: "Digital Transformation" },
    sourceSystem: "website_tracker",
  },
  {
    id: "evt_vector_004",
    personId: "person_anna_keller",
    sessionId: "sess_vector_001",
    type: "page_viewed",
    category: "website",
    timestamp: "2026-09-09T14:10:00+02:00",
    description: "Viewed contact",
    metadata: { page: "/contact", pageTitle: "Contact" },
    sourceSystem: "website_tracker",
  },
  {
    id: "evt_vector_005",
    personId: "person_anna_keller",
    sessionId: "sess_vector_001",
    type: "form_submitted",
    category: "conversion",
    timestamp: "2026-09-09T14:20:00+02:00",
    description: "Contact form submission",
    metadata: { formType: "contact_form" },
    sourceSystem: "resend",
  },

  // ---- Post-conversion events ----
  {
    id: "evt_vector_006",
    personId: "person_anna_keller",
    type: "lead_created",
    category: "crm",
    timestamp: "2026-09-09T14:20:00+02:00",
    description: "Lead created",
    metadata: {},
    sourceSystem: "hubspot",
  },
  {
    id: "evt_vector_007",
    personId: "person_anna_keller",
    type: "email_sent",
    category: "communication",
    timestamp: "2026-09-09T15:10:00+02:00",
    description: "Igor \u2192 Anna \u2014 First response",
    metadata: { from: "usr_igor", to: "person_anna_keller", responseTimeMinutes: 50 },
    sourceSystem: "email",
  },
  {
    id: "evt_vector_008",
    personId: "person_anna_keller",
    type: "email_received",
    category: "communication",
    timestamp: "2026-09-10T09:30:00+02:00",
    description: "Anna \u2192 Igor \u2014 Digital operations context",
    metadata: { subject: "RE: Vector Group inquiry" },
    sourceSystem: "email",
  },
  {
    id: "evt_vector_009",
    personId: "person_anna_keller",
    type: "meeting_completed",
    category: "meeting",
    timestamp: "2026-09-15T14:00:00+02:00",
    description: "Discovery call \u2014 60 min",
    metadata: { meetingType: "discovery" },
    sourceSystem: "calendar",
  },
  {
    id: "evt_vector_010",
    personId: "person_anna_keller",
    type: "email_sent",
    category: "communication",
    timestamp: "2026-09-15T16:30:00+02:00",
    description: "Discovery recap",
    metadata: { subject: "Discovery recap \u2014 Vector Group" },
    sourceSystem: "email",
  },
  {
    id: "evt_vector_011",
    personId: "person_anna_keller",
    type: "opportunity_created",
    category: "crm",
    timestamp: "2026-09-17T10:00:00+02:00",
    description: "Digital Operations Platform \u2014 \u20ac160K",
    metadata: { opportunityName: "Digital Operations Platform", opportunityValue: 160000 },
    sourceSystem: "sales_tracker",
  },
  {
    id: "evt_vector_012",
    personId: "person_anna_keller",
    type: "email_received",
    category: "communication",
    timestamp: "2026-09-19T11:00:00+02:00",
    description: "Anna \u2192 Igor \u2014 Technical requirements",
    metadata: { subject: "Technical requirements for platform" },
    sourceSystem: "email",
  },
  {
    id: "evt_vector_013",
    personId: "person_anna_keller",
    type: "email_sent",
    category: "communication",
    timestamp: "2026-09-19T14:00:00+02:00",
    description: "Igor \u2192 Anna \u2014 Technical clarification",
    metadata: { subject: "RE: Technical requirements for platform" },
    sourceSystem: "email",
  },
  {
    id: "evt_vector_014",
    personId: "person_anna_keller",
    type: "email_received",
    category: "communication",
    timestamp: "2026-09-24T06:00:00+02:00",
    description: "Anna \u2192 Igor \u2014 Follow-up questions",
    metadata: { subject: "Follow-up questions on scope" },
    sourceSystem: "email",
  },
];
