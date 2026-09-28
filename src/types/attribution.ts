export type AcquisitionSource =
  | "google_organic"
  | "google_ads"
  | "linkedin_organic"
  | "linkedin_ads"
  | "meta"
  | "referral"
  | "event"
  | "email"
  | "direct"
  | "unknown";

export type ConversionMechanism =
  | "contact_form"
  | "book_a_call"
  | "email_inquiry"
  | "newsletter_signup";

export type AttributionModel =
  | "first_touch"
  | "last_touch"
  | "conversion_touch";

export type AttributionStatus = "full" | "partial" | "unknown";

export interface Touchpoint {
  source: AcquisitionSource;
  medium: string;
  sessionId: string;
  timestamp: string;
  landingPage: string;
  referrer: string;
  campaign?: string;
  content?: string;
  isConversion: boolean;
  conversionMechanism?: ConversionMechanism;
}

export type RelationshipType =
  | "existing_client_referral"
  | "partner_introduction"
  | "personal_network"
  | "investor_connection";

export interface RelationshipAttribution {
  personId: string;
  type: RelationshipType;
  referrerName: string;
  referrerCompany: string;
  referrerPersonId?: string;
  notes?: string;
}

export interface SelfReportedAttribution {
  personId: string;
  response: string;
  category?: string;
}
