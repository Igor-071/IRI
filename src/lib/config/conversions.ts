import type { ConversionMechanism } from "@/types";

const conversionLabels: Record<ConversionMechanism, string> = {
  contact_form: "Contact Form",
  book_a_call: "Book a Call",
  email_inquiry: "Email Inquiry",
  newsletter_signup: "Newsletter Signup",
};

export function getConversionLabel(mechanism: ConversionMechanism): string {
  return conversionLabels[mechanism];
}
