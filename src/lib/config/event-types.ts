import type { EventType, EventCategory, EventImportance } from "@/types";

export interface EventTypeConfig {
  label: string;
  category: EventCategory;
  importance: EventImportance;
}

export const eventTypeConfig: Record<EventType, EventTypeConfig> = {
  session_started: {
    label: "Session Started",
    category: "acquisition",
    importance: "low",
  },
  page_viewed: {
    label: "Page Viewed",
    category: "website",
    importance: "low",
  },
  case_study_viewed: {
    label: "Case Study Viewed",
    category: "content",
    importance: "medium",
  },
  blog_post_viewed: {
    label: "Blog Post Viewed",
    category: "content",
    importance: "medium",
  },
  social_visit: {
    label: "Social Visit",
    category: "acquisition",
    importance: "medium",
  },
  form_submitted: {
    label: "Contact Form Submitted",
    category: "conversion",
    importance: "high",
  },
  booking_submitted: {
    label: "Booking Submitted",
    category: "conversion",
    importance: "high",
  },
  email_inquiry: {
    label: "Email Inquiry",
    category: "conversion",
    importance: "high",
  },
  newsletter_signup: {
    label: "Newsletter Signup",
    category: "conversion",
    importance: "medium",
  },
  lead_created: {
    label: "Lead Created",
    category: "crm",
    importance: "high",
  },
  lead_qualified: {
    label: "Lead Qualified",
    category: "crm",
    importance: "medium",
  },
  lead_disqualified: {
    label: "Lead Disqualified",
    category: "crm",
    importance: "medium",
  },
  email_sent: {
    label: "Email Sent",
    category: "communication",
    importance: "low",
  },
  email_received: {
    label: "Email Received",
    category: "communication",
    importance: "medium",
  },
  email_opened: {
    label: "Email Opened",
    category: "communication",
    importance: "low",
  },
  meeting_booked: {
    label: "Meeting Booked",
    category: "meeting",
    importance: "medium",
  },
  meeting_completed: {
    label: "Meeting Completed",
    category: "meeting",
    importance: "medium",
  },
  opportunity_created: {
    label: "Opportunity Created",
    category: "crm",
    importance: "high",
  },
  stage_changed: {
    label: "Stage Changed",
    category: "crm",
    importance: "medium",
  },
  proposal_sent: {
    label: "Proposal Sent",
    category: "revenue",
    importance: "high",
  },
  deal_won: {
    label: "Deal Won",
    category: "revenue",
    importance: "high",
  },
  deal_lost: {
    label: "Deal Lost",
    category: "revenue",
    importance: "high",
  },
  note_added: {
    label: "Note Added",
    category: "crm",
    importance: "low",
  },
};
