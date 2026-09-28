import { Search, Bell } from "lucide-react";

interface GlobalHeaderProps {
  children?: React.ReactNode;
}

export function GlobalHeader({ children }: GlobalHeaderProps) {
  return (
    <header className="flex h-14 items-center justify-between border-b border-border bg-background px-6">
      {/* Left: page header slot */}
      <div className="flex items-center gap-4">{children}</div>

      {/* Right: search, notification, avatar */}
      <div className="flex items-center gap-3">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <input
            type="text"
            placeholder="Search leads, companies or emails..."
            className="h-8 w-64 rounded-md border border-input bg-muted pl-9 pr-3 text-sm text-foreground placeholder:text-muted-foreground focus:border-ring focus:outline-none"
            readOnly
          />
        </div>
        <button
          type="button"
          className="flex h-8 w-8 items-center justify-center rounded-md text-muted-foreground hover:bg-accent hover:text-foreground"
        >
          <Bell className="h-4 w-4" />
        </button>
        <div className="flex h-7 w-7 items-center justify-center rounded-full bg-secondary text-xs font-medium text-secondary-foreground">
          IK
        </div>
      </div>
    </header>
  );
}
