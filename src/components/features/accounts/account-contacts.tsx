"use client";

import { useMemo } from "react";
import Link from "next/link";
import type { Person } from "@/types";
import {
  getPeopleByCompanyId,
  getEventsByPersonId,
  getOpportunityByPersonId,
} from "@/lib/data/repositories";
import { SourceBadge } from "@/components/domain/source-badge";
import { getFirstTouchSource } from "@/lib/attribution/derived";
import { DateTime } from "@/components/domain/date-time";
import { Avatar, AvatarFallback } from "@/components/ui/atoms/avatar";
import { Badge } from "@/components/ui/atoms/badge";
import { cn } from "@/lib/utils";

function getInitials(name: string): string {
  const parts = name.split(" ").filter(Boolean);
  if (parts.length === 0) return "?";
  if (parts.length === 1) return parts[0][0].toUpperCase();
  return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
}

interface AccountContactsProps {
  companyId: string;
  className?: string;
}

function ContactCard({ person }: { person: Person }) {
  const events = getEventsByPersonId(person.id);
  const lastActivity =
    events.length > 0 ? events[events.length - 1].timestamp : undefined;
  const opportunity = getOpportunityByPersonId(person.id);
  const isPrimary = !!opportunity;

  return (
    <Link
      href={`/leads/${person.id}`}
      className="group flex items-center gap-3 rounded-lg border border-border bg-card px-3 py-2.5 transition-colors hover:bg-muted/50"
    >
      <Avatar size="sm">
        <AvatarFallback className="text-[10px]">
          {getInitials(person.name)}
        </AvatarFallback>
      </Avatar>

      <div className="min-w-0 flex-1">
        <div className="flex items-center gap-2">
          <span className="truncate text-sm font-medium text-foreground">
            {person.name}
          </span>
          {isPrimary && (
            <Badge variant="secondary" className="text-[10px] font-normal text-primary">
              Primary contact
            </Badge>
          )}
        </div>
        <p className="truncate text-xs text-muted-foreground">{person.title}</p>
      </div>

      <div className="hidden shrink-0 items-center gap-3 sm:flex">
        <SourceBadge source={getFirstTouchSource(person.id)} />
        {lastActivity && (
          <DateTime date={lastActivity} format="relative" className="text-xs" />
        )}
      </div>
    </Link>
  );
}

export function AccountContacts({
  companyId,
  className,
}: AccountContactsProps) {
  const people = useMemo(
    () => getPeopleByCompanyId(companyId),
    [companyId],
  );

  if (people.length === 0) {
    return (
      <div className={cn("text-sm text-muted-foreground", className)}>
        No known contacts.
      </div>
    );
  }

  return (
    <div className={cn("flex flex-col gap-2", className)}>
      {people.map((person) => (
        <ContactCard key={person.id} person={person} />
      ))}
    </div>
  );
}
