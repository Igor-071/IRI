"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  Inbox,
  Building2,
  GitFork,
  Route,
  Plug,
  MessageSquare,
} from "lucide-react";
import { WORKSPACE_NAME } from "@/lib/config/constants";

const navItems = [
  { href: "/overview", label: "Overview", icon: LayoutDashboard },
  { href: "/leads", label: "Inbound Leads", icon: Inbox },
  { href: "/accounts", label: "Accounts", icon: Building2 },
  { href: "/attribution", label: "Attribution", icon: GitFork },
  { href: "/journeys", label: "Journeys", icon: Route },
  { href: "/integrations", label: "Integrations", icon: Plug },
];

const secondaryItems = [
  { href: "/ask-inbound", label: "Ask Inbound", icon: MessageSquare },
];

export function Sidebar() {
  const pathname = usePathname();

  function isActive(href: string) {
    if (href === "/overview") return pathname === "/overview";
    return pathname.startsWith(href);
  }

  return (
    <aside className="flex h-screen w-60 flex-col border-r border-sidebar-border bg-sidebar">
      {/* Logo */}
      <div className="flex h-14 items-center px-5">
        <span className="text-sm font-semibold tracking-tight text-foreground">
          Inbound Revenue Intelligence
        </span>
      </div>

      {/* Main navigation */}
      <nav className="flex-1 space-y-0.5 px-3 py-2">
        {navItems.map((item) => {
          const Icon = item.icon;
          const active = isActive(item.href);
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center gap-3 rounded-md px-3 py-2 text-sm transition-colors ${
                active
                  ? "bg-sidebar-accent text-sidebar-accent-foreground"
                  : "text-sidebar-foreground hover:bg-sidebar-accent/50 hover:text-sidebar-accent-foreground"
              }`}
            >
              <Icon className="h-4 w-4 shrink-0" />
              {item.label}
            </Link>
          );
        })}

        {/* Separator */}
        <div className="my-3 border-t border-sidebar-border" />

        {secondaryItems.map((item) => {
          const Icon = item.icon;
          const active = isActive(item.href);
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center gap-3 rounded-md px-3 py-2 text-sm transition-colors ${
                active
                  ? "bg-sidebar-accent text-sidebar-accent-foreground"
                  : "text-sidebar-foreground hover:bg-sidebar-accent/50 hover:text-sidebar-accent-foreground"
              }`}
            >
              <Icon className="h-4 w-4 shrink-0" />
              {item.label}
            </Link>
          );
        })}
      </nav>

      {/* Workspace area */}
      <div className="border-t border-sidebar-border px-4 py-3">
        <div className="flex items-center gap-2">
          <div className="flex h-7 w-7 items-center justify-center rounded-md bg-primary text-xs font-bold text-primary-foreground">
            M
          </div>
          <div className="flex flex-col">
            <span className="text-xs font-medium text-sidebar-accent-foreground">
              {WORKSPACE_NAME}
            </span>
            <span className="text-[10px] text-muted-foreground">
              Sample data
            </span>
          </div>
        </div>
      </div>
    </aside>
  );
}
