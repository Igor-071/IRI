import Link from "next/link";
import type { Person } from "@/types";
import { Avatar, AvatarFallback } from "@/components/ui/atoms/avatar";
import { StageBadge } from "@/components/domain/stage-badge";
import { cn } from "@/lib/utils";
import { Users } from "lucide-react";

function getInitials(name: string): string {
  const parts = name.split(" ").filter(Boolean);
  if (parts.length === 0) return "?";
  if (parts.length === 1) return parts[0][0].toUpperCase();
  return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
}

interface RelatedContactsProps {
  contacts: Person[];
  className?: string;
}

export function RelatedContacts({
  contacts,
  className,
}: RelatedContactsProps) {
  if (contacts.length === 0) return null;

  return (
    <div className={cn("flex flex-col gap-3", className)}>
      <div className="flex items-center gap-1.5">
        <Users className="size-3 text-muted-foreground" />
        <span className="text-[10px] font-semibold tracking-wider text-muted-foreground uppercase">
          Related Contacts
        </span>
      </div>
      <div className="flex flex-col gap-1">
        {contacts.map((contact) => (
          <Link
            key={contact.id}
            href={`/leads/${contact.id}`}
            className="flex items-center gap-2.5 rounded-lg px-2 py-1.5 transition-colors hover:bg-muted"
          >
            <Avatar size="sm">
              <AvatarFallback className="text-[10px]">
                {getInitials(contact.name)}
              </AvatarFallback>
            </Avatar>
            <div className="min-w-0 flex-1">
              <p className="truncate text-sm font-medium text-foreground">
                {contact.name}
              </p>
              <p className="truncate text-xs text-muted-foreground">
                {contact.title}
              </p>
            </div>
            <StageBadge stage={contact.displayStage} />
          </Link>
        ))}
      </div>
    </div>
  );
}
