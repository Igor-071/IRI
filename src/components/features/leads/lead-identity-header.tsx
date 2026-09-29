import Link from "next/link";
import type { Person, Company } from "@/types";
import { Avatar, AvatarFallback } from "@/components/ui/atoms/avatar";
import { StageBadge } from "@/components/domain/stage-badge";
import { getDisplayStage } from "@/lib/attribution/derived";
import { OwnerChip } from "@/components/domain/owner-chip";
import { DateTime } from "@/components/domain/date-time";
import { Building2, Mail } from "lucide-react";

function getInitials(name: string): string {
  const parts = name.split(" ").filter(Boolean);
  if (parts.length === 0) return "?";
  if (parts.length === 1) return parts[0][0].toUpperCase();
  return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
}

interface LeadIdentityHeaderProps {
  person: Person;
  company: Company | undefined;
  lastActivityDate: string | undefined;
}

export function LeadIdentityHeader({
  person,
  company,
  lastActivityDate,
}: LeadIdentityHeaderProps) {
  return (
    <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
      {/* Left: Identity */}
      <div className="flex items-start gap-4">
        <Avatar size="lg">
          <AvatarFallback className="text-sm">
            {getInitials(person.name)}
          </AvatarFallback>
        </Avatar>
        <div className="flex flex-col gap-1">
          <h1 className="text-lg font-semibold text-foreground">
            {person.name}
          </h1>
          <p className="text-sm text-muted-foreground">{person.title}</p>
          <div className="flex flex-wrap items-center gap-3 text-xs text-muted-foreground">
            <span className="inline-flex items-center gap-1">
              <Mail className="size-3" />
              {person.email}
            </span>
            {company && (
              <Link
                href={`/accounts/${company.id}`}
                className="inline-flex items-center gap-1 text-primary hover:underline"
              >
                <Building2 className="size-3" />
                {company.name}
              </Link>
            )}
          </div>
        </div>
      </div>

      {/* Right: Stage, Owner, Last Activity */}
      <div className="flex flex-wrap items-center gap-3">
        <StageBadge stage={getDisplayStage(person.id)} />
        <OwnerChip ownerId={person.ownerId} />
        {lastActivityDate && (
          <DateTime
            date={lastActivityDate}
            format="relative"
            className="text-xs"
          />
        )}
      </div>
    </div>
  );
}
