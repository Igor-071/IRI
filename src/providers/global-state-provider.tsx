"use client"

import { createContext, useContext, useState, type ReactNode } from "react"

interface GlobalState {
  theme: "light" | "dark"
  user: { name: string; email: string } | null
  toggleTheme: () => void
  setUser: (user: { name: string; email: string } | null) => void
}

const GlobalStateContext = createContext<GlobalState | undefined>(undefined)

export function useGlobalState() {
  const context = useContext(GlobalStateContext)
  if (context === undefined) {
    throw new Error("useGlobalState must be used within a GlobalStateProvider")
  }
  return context
}

interface GlobalStateProviderProps {
  children: ReactNode
}

export function GlobalStateProvider({ children }: GlobalStateProviderProps) {
  const [theme, setTheme] = useState<"light" | "dark">("light")
  const [user, setUser] = useState<{ name: string; email: string } | null>({
    name: "John Doe",
    email: "john@example.com",
  })

  const toggleTheme = () => {
    setTheme((prev) => (prev === "light" ? "dark" : "light"))
  }

  const value: GlobalState = {
    theme,
    user,
    toggleTheme,
    setUser,
  }

  return (
    <GlobalStateContext.Provider value={value}>
      <div
        className={`min-h-screen transition-colors ${
          theme === "dark" ? "bg-gray-900 text-white" : "bg-white text-gray-900"
        }`}
      >
        {children}
      </div>
    </GlobalStateContext.Provider>
  )
}
