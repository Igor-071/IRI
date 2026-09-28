import type { Person } from "@/types";
import { Avatar, AvatarFallback } from "@/components/ui/atoms/avatar";
import { cn } from "@/lib/utils";

function getInitials(name: string): string {
  const parts = name.split(" ").filter(Boolean);
  if (parts.length === 0) return "?";
  if (parts.length === 1) return parts[0][0].toUpperCase();
  return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
}

interface PersonIdentityProps {
  person: Person;
  showEmail?: boolean;
  compact?: boolean;
  className?: string;
}

export function PersonIdentity({
  person,
  showEmail = false,
  compact = false,
  className,
}: PersonIdentityProps) {
  return (
    <div className={cn("flex items-center gap-2.5", className)}>
      <Avatar size="sm">
        <AvatarFallback className="text-[10px]">
          {getInitials(person.name)}
        </AvatarFallback>
      </Avatar>
      <div className="min-w-0">
        <p className="truncate text-sm font-medium text-foreground">
          {person.name}
        </p>
        {!compact && (
          <p className="truncate text-xs text-muted-foreground">
            {person.title}
          </p>
        )}
        {showEmail && (
          <p className="truncate text-xs text-muted-foreground">
            {person.email}
          </p>
        )}
      </div>
    </div>
  );
}
