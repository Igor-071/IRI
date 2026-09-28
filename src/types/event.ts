export type EventCategory =
  | "acquisition"
  | "website"
  | "content"
  | "conversion"
  | "communication"
  | "meeting"
  | "crm"
  | "revenue";

export type EventType =
  | "session_started"
  | "page_viewed"
  | "case_study_viewed"
  | "blog_post_viewed"
  | "social_visit"
  | "form_submitted"
  | "booking_submitted"
  | "email_inquiry"
  | "newsletter_signup"
  | "lead_created"
  | "lead_qualified"
  | "lead_disqualified"
  | "email_sent"
  | "email_received"
  | "email_opened"
  | "meeting_booked"
  | "meeting_completed"
  | "opportunity_created"
  | "stage_changed"
  | "proposal_sent"
  | "deal_won"
  | "deal_lost"
  | "note_added";

export type EventImportance = "low" | "medium" | "high";

export interface EventMetadata {
  page?: string;
  pageTitle?: string;
  searchQuery?: string;
  formType?: string;
  subject?: string;
  from?: string;
  to?: string;
  responseTimeMinutes?: number;
  meetingType?: string;
  opportunityName?: string;
  opportunityValue?: number;
  fromStage?: string;
  toStage?: string;
  proposalValue?: number;
  dealValue?: number;
  lostReason?: string;
  content?: string;
  articleTitle?: string;
  caseStudyTitle?: string;
  [key: string]: unknown;
}

export interface Event {
  id: string;
  personId: string;
  sessionId?: string;
  type: EventType;
  category: EventCategory;
  timestamp: string;
  description: string;
  metadata: EventMetadata;
  sourceSystem: string;
}
