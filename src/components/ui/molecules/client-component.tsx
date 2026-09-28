"use client"

import { useGlobalState } from "@/providers/global-state-provider"
import { Button } from "@/components/ui/atoms/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/atoms/card"
import { Moon, Sun, User } from "lucide-react"

export function ClientComponent() {
  const { theme, user, toggleTheme, setUser } = useGlobalState()

  return (
    <Card className="mb-6">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <User className="w-5 h-5" />
          Client Component (Interactive)
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex items-center justify-between">
          <span>Current Theme: {theme}</span>
          <Button onClick={toggleTheme} variant="outline" size="sm">
            {theme === "light" ? <Moon className="w-4 h-4" /> : <Sun className="w-4 h-4" />}
            Toggle Theme
          </Button>
        </div>

        <div className="flex items-center justify-between">
          <span>User: {user?.name || "Not logged in"}</span>
          <Button
            onClick={() => setUser(user ? null : { name: "Jane Smith", email: "jane@example.com" })}
            variant="outline"
            size="sm"
          >
            {user ? "Logout" : "Login"}
          </Button>
        </div>

        <div className="text-sm text-muted-foreground">
          ✨ This component uses useState and can interact with user events
        </div>
      </CardContent>
    </Card>
  )
}
