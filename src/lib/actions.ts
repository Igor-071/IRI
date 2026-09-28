"use server"
import { invoiceSchema, userProfileSchema, newsletterSchema, type FormState } from "@/lib/schemas"
import { revalidatePath } from "next/cache"

// Simulate database delay
const simulateDelay = () => new Promise((resolve) => setTimeout(resolve, 1000))

export async function createInvoice(prevState: FormState, formDataOrObject: FormData | any): Promise<FormState> {
  // Handle both FormData (direct form submission) and object (React Hook Form)
  let data: any
  if (formDataOrObject instanceof FormData) {
    data = {
      customerId: formDataOrObject.get("customerId"),
      amount: formDataOrObject.get("amount"),
      status: formDataOrObject.get("status"),
      description: formDataOrObject.get("description"),
    }
  } else {
    data = formDataOrObject
  }

  // 1. Validate form fields using Zod
  const validatedFields = invoiceSchema.safeParse(data)

  // 2. If validation fails, return errors
  if (!validatedFields.success) {
    return {
      errors: validatedFields.error.flatten().fieldErrors,
      message: "Validation Failed. Could not create invoice.",
      success: false,
    }
  }

  // 3. Simulate server processing
  await simulateDelay()

  // 4. Simulate random server error (20% chance)
  if (Math.random() < 0.2) {
    return {
      message: "Database Error: Failed to create invoice. Please try again.",
      success: false,
    }
  }

  // 5. Success case
  console.log("Invoice created:", validatedFields.data)
  revalidatePath("/dashboard/invoices")

  return {
    message: `Successfully created invoice for $${validatedFields.data.amount}!`,
    success: true,
  }
}

export async function updateUserProfile(prevState: FormState, formDataOrObject: FormData | any): Promise<FormState> {
  // Handle both FormData and object
  let data: any
  if (formDataOrObject instanceof FormData) {
    data = {
      name: formDataOrObject.get("name"),
      email: formDataOrObject.get("email"),
      age: formDataOrObject.get("age"),
      bio: formDataOrObject.get("bio"),
    }
  } else {
    data = formDataOrObject
  }

  const validatedFields = userProfileSchema.safeParse(data)

  if (!validatedFields.success) {
    return {
      errors: validatedFields.error.flatten().fieldErrors,
      message: "Validation Failed. Could not update profile.",
      success: false,
    }
  }

  await simulateDelay()

  console.log("Profile updated:", validatedFields.data)
  revalidatePath("/profile")

  return {
    message: `Profile updated successfully for ${validatedFields.data.name}!`,
    success: true,
  }
}

export async function subscribeNewsletter(prevState: FormState, formDataOrObject: FormData | any): Promise<FormState> {
  // Handle both FormData and object
  let data: any
  if (formDataOrObject instanceof FormData) {
    const preferences = formDataOrObject.getAll("preferences") as string[]
    data = {
      email: formDataOrObject.get("email"),
      preferences: preferences,
    }
  } else {
    data = formDataOrObject
  }

  const validatedFields = newsletterSchema.safeParse(data)

  if (!validatedFields.success) {
    return {
      errors: validatedFields.error.flatten().fieldErrors,
      message: "Validation Failed. Could not subscribe to newsletter.",
      success: false,
    }
  }

  await simulateDelay()

  console.log("Newsletter subscription:", validatedFields.data)

  return {
    message: `Successfully subscribed ${validatedFields.data.email} to newsletter!`,
    success: true,
  }
}
