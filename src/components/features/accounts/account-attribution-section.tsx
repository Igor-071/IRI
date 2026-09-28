"use client";

import { useMemo } from "react";
import Link from "next/link";
import { getAccountAttribution } from "@/lib/attribution/account-attribution";
import { SourceBadge } from "@/components/domain/source-badge";
import { DateTime } from "@/components/domain/date-time";
import { cn } from "@/lib/utils";
import { Handshake } from "lucide-react";

const RELATIONSHIP_TYPE_LABELS: Record<string, string> = {
  existing_client_referral: "Existing Client Referral",
  partner_introduction: "Partner Introduction",
  personal_network: "Personal Network",
  investor_connection: "Investor Connection",
};

interface AccountAttributionSectionProps {
  companyId: string;
  className?: string;
}

export function AccountAttributionSection({
  companyId,
  className,
}: AccountAttributionSectionProps) {
  const attribution = useMemo(
    () => getAccountAttribution(companyId),
    [companyId],
  );

  return (
    <div className={cn("flex flex-col gap-4", className)}>
      <p className="text-xs text-muted-foreground">
        Account journeys aggregate attribution from multiple people.
      </p>

      <div className="grid gap-6 sm:grid-cols-3">
        {/* Earliest Account Touch */}
        <div className="flex flex-col gap-1.5">
          <span className="text-[10px] font-semibold tracking-wider text-muted-foreground uppercase">
            Earliest Account Touch
          </span>
          {attribution.earliest ? (
            <>
              <SourceBadge source={attribution.earliest.source} />
              <Link
                href={`/leads/${attribution.earliest.personId}`}
                className="text-xs text-primary hover:underline"
              >
                {attribution.earliest.personName}
              </Link>
              <DateTime
                date={attribution.earliest.timestamp}
                format="datetime"
                className="text-xs"
              />
            </>
          ) : (
            <span className="text-sm text-muted-foreground">Unknown</span>
          )}
        </div>

        {/* Latest Marketing Influence */}
        <div className="flex flex-col gap-1.5">
          <span className="text-[10px] font-semibold tracking-wider text-muted-foreground uppercase">
            Latest Marketing Influence
          </span>
          {attribution.latestMarketing ? (
            <>
              <SourceBadge source={attribution.latestMarketing.source} />
              <Link
                href={`/leads/${attribution.latestMarketing.personId}`}
                className="text-xs text-primary hover:underline"
              >
                {attribution.latestMarketing.personName}
              </Link>
              <DateTime
                date={attribution.latestMarketing.timestamp}
                format="datetime"
                className="text-xs"
              />
            </>
          ) : (
            <span className="text-sm text-muted-foreground">Unknown</span>
          )}
        </div>

        {/* Relationship Influence */}
        <div className="flex flex-col gap-1.5">
          <span className="text-[10px] font-semibold tracking-wider text-muted-foreground uppercase">
            Relationship Influence
          </span>
          {attribution.relationships.length > 0 ? (
            attribution.relationships.map((rel) => (
              <div key={`${rel.personId}-${rel.type}`} className="flex flex-col gap-0.5">
                <div className="flex items-center gap-1.5">
                  <Handshake className="size-3 text-muted-foreground" />
                  <Link
                    href={`/leads/${rel.personId}`}
                    className="text-xs text-primary hover:underline"
                  >
                    {rel.personName}
                  </Link>
                </div>
                <span className="text-xs text-muted-foreground">
                  {RELATIONSHIP_TYPE_LABELS[rel.type] ?? rel.type}
                </span>
                <span className="text-xs text-muted-foreground">
                  introduced by {rel.referrerName} ({rel.referrerCompany})
                </span>
                {rel.notes && (
                  <span className="text-xs text-muted-foreground/70">
                    {rel.notes}
                  </span>
                )}
              </div>
            ))
          ) : (
            <span className="text-sm text-muted-foreground">None</span>
          )}
        </div>
      </div>
    </div>
  );
}
