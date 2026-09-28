import { z } from 'zod';

// Invoice form schema
export const invoiceSchema = z.object({
  customerId: z.string().min(1, { message: 'Customer is required.' }),
  amount: z.coerce.number().gt(0, { message: 'Please enter an amount greater than $0.' }),
  status: z.enum(['pending', 'paid'], { message: 'Please select an invoice status.' }),
  description: z.string().min(5, { message: 'Description must be at least 5 characters.' }),
});

// User profile form schema
export const userProfileSchema = z.object({
  name: z.string().min(2, { message: 'Name must be at least 2 characters.' }),
  email: z.string().email({ message: 'Please enter a valid email address.' }),
  age: z.coerce
    .number()
    .min(18, { message: 'Must be at least 18 years old.' })
    .max(120, { message: 'Age must be realistic.' }),
  bio: z.string().max(500, { message: 'Bio must be less than 500 characters.' }).optional(),
});

// Newsletter subscription schema
export const newsletterSchema = z.object({
  email: z.string().email({ message: 'Please enter a valid email address.' }),
  preferences: z.array(z.string()).min(1, { message: 'Please select at least one preference.' }),
});

// Define types for form states
export type FormState = {
  errors?: Record<string, string[]>;
  message?: string;
  success?: boolean;
};

export type InvoiceFormData = z.infer<typeof invoiceSchema>;
export type UserProfileFormData = z.infer<typeof userProfileSchema>;
export type NewsletterFormData = z.infer<typeof newsletterSchema>;

export type InvoiceFormInput = z.input<typeof invoiceSchema>;
export type UserProfileFormInput = z.input<typeof userProfileSchema>;
export type NewsletterFormInput = z.input<typeof newsletterSchema>;
