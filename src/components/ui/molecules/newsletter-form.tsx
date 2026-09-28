"use client"

import { useActionState } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { newsletterSchema, type FormState, type NewsletterFormData } from "@/lib/schemas"
import { subscribeNewsletter } from "@/lib/actions"
import { Button } from "@/components/ui/atoms/button"
import { Input } from "@/components/ui/atoms/input"
import { Label } from "@/components/ui/atoms/label"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/atoms/card"
import { Loader2, Mail } from "lucide-react"

const preferences = [
  { id: "tech", label: "Technology Updates" },
  { id: "product", label: "Product Announcements" },
  { id: "marketing", label: "Marketing Tips" },
  { id: "events", label: "Event Invitations" },
]

export function NewsletterForm() {
  const initialState: FormState = { message: "", errors: {} }
  const [state, formAction, isPending] = useActionState(subscribeNewsletter, initialState)

  const {
    formState: { errors },
    reset,
  } = useForm<NewsletterFormData>({
    resolver: zodResolver(newsletterSchema),
    defaultValues: {
      email: "",
      preferences: [],
    },
  })

  // Reset form on successful submission
  if (state.success && !isPending) {
    setTimeout(() => reset(), 2000)
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Mail className="w-5 h-5" />
          Newsletter Subscription
        </CardTitle>
      </CardHeader>
      <CardContent>
        <form action={formAction} className="space-y-4">
          <div>
            <Label htmlFor="email">Email Address</Label>
            <Input id="email" name="email" type="email" placeholder="your@email.com" disabled={isPending} />
            {errors.email && <p className="text-sm text-red-500 mt-1">{errors.email.message}</p>}
            {state.errors?.email && <p className="text-sm text-red-500 mt-1">{state.errors.email[0]}</p>}
          </div>

          <div>
            <Label>Subscription Preferences</Label>
            <div className="space-y-2 mt-2">
              {preferences.map((preference) => (
                <div key={preference.id} className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    id={preference.id}
                    name="preferences"
                    value={preference.id}
                    disabled={isPending}
                    className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                  />
                  <Label htmlFor={preference.id} className="text-sm font-normal">
                    {preference.label}
                  </Label>
                </div>
              ))}
            </div>
            {errors.preferences && <p className="text-sm text-red-500 mt-1">{errors.preferences.message}</p>}
            {state.errors?.preferences && <p className="text-sm text-red-500 mt-1">{state.errors.preferences[0]}</p>}
          </div>

          <Button type="submit" disabled={isPending} className="w-full">
            {isPending ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                Subscribing...
              </>
            ) : (
              "Subscribe to Newsletter"
            )}
          </Button>

          {state.message && (
            <div
              className={`text-sm p-3 rounded-md ${state.success
                ? "bg-green-50 text-green-700 border border-green-200"
                : "bg-red-50 text-red-700 border border-red-200"
                }`}
            >
              {state.message}
            </div>
          )}
        </form>
      </CardContent>
    </Card>
  )
}
