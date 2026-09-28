import type React from "react"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"
import { GlobalStateProvider } from "@/providers/global-state-provider"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "Next.js Server vs Client Showcase",
  description: "Demonstrating server and client component composition",
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <GlobalStateProvider>{children}</GlobalStateProvider>
      </body>
    </html>
  )
}
