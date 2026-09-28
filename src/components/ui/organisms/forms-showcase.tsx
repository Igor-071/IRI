"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/atoms/card"
import { InvoiceForm } from "@/components/ui/molecules/invoice-form"
import { ProfileForm } from "@/components/ui/molecules/profile-form"
import { NewsletterForm } from "@/components/ui/molecules/newsletter-form"
import { CheckSquare, Code, Shield, Zap } from "lucide-react"

export function FormsShowcase() {
  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <CheckSquare className="w-5 h-5" />
            Standardized Form Handling Showcase
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="flex items-center gap-2 p-3 bg-blue-50 rounded-lg">
              <Code className="w-5 h-5 text-blue-600" />
              <div>
                <div className="font-semibold text-sm">React Hook Form</div>
                <div className="text-xs text-muted-foreground">Client-side validation</div>
              </div>
            </div>
            <div className="flex items-center gap-2 p-3 bg-green-50 rounded-lg">
              <Shield className="w-5 h-5 text-green-600" />
              <div>
                <div className="font-semibold text-sm">Zod Schema</div>
                <div className="text-xs text-muted-foreground">Type-safe validation</div>
              </div>
            </div>
            <div className="flex items-center gap-2 p-3 bg-purple-50 rounded-lg">
              <Zap className="w-5 h-5 text-purple-600" />
              <div>
                <div className="font-semibold text-sm">Server Actions</div>
                <div className="text-xs text-muted-foreground">Server-side processing</div>
              </div>
            </div>
            <div className="flex items-center gap-2 p-3 bg-orange-50 rounded-lg">
              <CheckSquare className="w-5 h-5 text-orange-600" />
              <div>
                <div className="font-semibold text-sm">Progressive Enhancement</div>
                <div className="text-xs text-muted-foreground">Works without JS</div>
              </div>
            </div>
          </div>

          <div className="text-sm text-muted-foreground space-y-2">
            <p>
              <strong>Key Features:</strong>
            </p>
            <ul className="list-disc list-inside space-y-1 ml-4">
              <li>Server-first validation with Zod schemas ensures security</li>
              <li>Client-side validation provides instant feedback</li>
              <li>Forms work without JavaScript (progressive enhancement)</li>
              <li>Consistent error handling and loading states</li>
              <li>Type-safe form data with TypeScript integration</li>
            </ul>
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
        <InvoiceForm />
        <ProfileForm />
        <NewsletterForm />
      </div>
    </div>
  )
}
