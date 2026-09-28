"use client";

import { useMemo, useState } from "react";
import type { Touchpoint } from "@/types";
import {
  getFirstTouch,
  getLastMarketingTouch,
  getConversionTouch,
} from "@/lib/attribution/touchpoints";
import { getAttributionStatus } from "@/lib/attribution/status";
import { getPersonById } from "@/lib/data/repositories";
import {
  getSelfReportedByPersonId,
  getRelationshipsByPersonId,
} from "@/lib/data/repositories";
import { sourceConfig } from "@/lib/config/sources";
import { SourceBadge } from "@/components/domain/source-badge";
import { AttributionStatusBadge } from "@/components/domain/attribution-status-badge";
import { DateTime } from "@/components/domain/date-time";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/atoms/dialog";
import { Button } from "@/components/ui/atoms/button";
import { cn } from "@/lib/utils";
import { HelpCircle, User, MessageSquare } from "lucide-react";

const CONVERSION_MECHANISM_LABELS: Record<string, string> = {
  contact_form: "Contact Form",
  book_a_call: "Book a Call",
  email_inquiry: "Email Inquiry",
  newsletter_signup: "Newsletter Signup",
};

const RELATIONSHIP_TYPE_LABELS: Record<string, string> = {
  existing_client_referral: "Existing Client Referral",
  partner_introduction: "Partner Introduction",
  personal_network: "Personal Network",
  investor_connection: "Investor Connection",
};

interface AttributionSummaryProps {
  personId: string;
  className?: string;
}

interface TouchpointSectionProps {
  label: string;
  touchpoint: Touchpoint | undefined;
  isConversion?: boolean;
  unknownMessage?: string;
}

function TouchpointSection({
  label,
  touchpoint,
  isConversion = false,
  unknownMessage,
}: TouchpointSectionProps) {
  const [showWhy, setShowWhy] = useState(false);

  if (!touchpoint) {
    return (
      <div className="flex flex-col gap-1.5">
        <span className="text-[10px] font-semibold tracking-wider text-muted-foreground uppercase">
          {label}
        </span>
        <span className="text-sm text-muted-foreground">Unknown</span>
        {unknownMessage && (
          <p className="text-xs text-muted-foreground/70">
            {unknownMessage}
          </p>
        )}
      </div>
    );
  }

  const sourceCfg = sourceConfig[touchpoint.source];

  return (
    <div className="flex flex-col gap-1.5">
      <div className="flex items-center justify-between">
        <span className="text-[10px] font-semibold tracking-wider text-muted-foreground uppercase">
          {label}
        </span>
        <Button
          variant="ghost"
          size="sm"
          className="h-5 px-1 text-[10px] text-muted-foreground hover:text-foreground"
          onClick={() => setShowWhy(true)}
        >
          <HelpCircle className="mr-0.5 size-3" />
          Why?
        </Button>
      </div>

      <div className="flex items-center gap-2">
        {isConversion && touchpoint.conversionMechanism ? (
          <span className="text-sm font-medium text-foreground">
            {CONVERSION_MECHANISM_LABELS[touchpoint.conversionMechanism] ??
              touchpoint.conversionMechanism}
          </span>
        ) : (
          <SourceBadge source={touchpoint.source} />
        )}
      </div>

      <div className="flex flex-col gap-0.5 text-xs text-muted-foreground">
        <DateTime date={touchpoint.timestamp} format="datetime" />
        {touchpoint.landingPage && (
          <span className="truncate">{touchpoint.landingPage}</span>
        )}
      </div>

      {touchpoint.campaign && (
        <span className="text-xs text-muted-foreground">
          Campaign: {touchpoint.campaign}
        </span>
      )}

      {/* Why? Dialog */}
      <Dialog open={showWhy} onOpenChange={setShowWhy}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>{label} — Evidence</DialogTitle>
          </DialogHeader>
          <div className="flex flex-col gap-3 text-sm">
            <DetailRow label="Source" value={sourceCfg.label} />
            <DetailRow label="Timestamp" value={touchpoint.timestamp} />
            <DetailRow label="Source System" value={touchpoint.sessionId} />
            {touchpoint.referrer && (
              <DetailRow label="Referrer" value={touchpoint.referrer} />
            )}
            <DetailRow label="Landing Page" value={touchpoint.landingPage} />
            {touchpoint.campaign && (
              <DetailRow label="Campaign" value={touchpoint.campaign} />
            )}
            {touchpoint.conversionMechanism && (
              <DetailRow
                label="Conversion"
                value={
                  CONVERSION_MECHANISM_LABELS[touchpoint.conversionMechanism] ??
                  touchpoint.conversionMechanism
                }
              />
            )}
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}

function DetailRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex gap-3">
      <span className="w-28 shrink-0 text-muted-foreground">{label}</span>
      <span className="min-w-0 break-all text-foreground">{value}</span>
    </div>
  );
}

export function AttributionSummary({
  personId,
  className,
}: AttributionSummaryProps) {
  const person = useMemo(() => getPersonById(personId), [personId]);
  const firstTouch = useMemo(() => getFirstTouch(personId), [personId]);
  const lastMarketing = useMemo(
    () => getLastMarketingTouch(personId),
    [personId]
  );
  const conversionTouch = useMemo(
    () => getConversionTouch(personId),
    [personId]
  );
  const selfReported = useMemo(
    () => getSelfReportedByPersonId(personId),
    [personId]
  );
  const relationships = useMemo(
    () => getRelationshipsByPersonId(personId),
    [personId]
  );
  const status = useMemo(
    () => (person ? getAttributionStatus(person) : "unknown" as const),
    [person]
  );

  const noMarketingTouch = !firstTouch || !sourceConfig[firstTouch.source].isMarketingTouch;
  const unknownMessage =
    noMarketingTouch && !lastMarketing
      ? "No known marketing interaction was identified before conversion."
      : undefined;

  return (
    <div className={cn("flex flex-col gap-6", className)}>
      {/* Status */}
      <div className="flex items-center gap-2">
        <AttributionStatusBadge status={status} />
      </div>

      {/* Three-column attribution */}
      <div className="grid gap-6 sm:grid-cols-3">
        <TouchpointSection
          label="First Touch"
          touchpoint={firstTouch}
          unknownMessage={unknownMessage}
        />
        <TouchpointSection
          label="Last Marketing Touch"
          touchpoint={lastMarketing}
          unknownMessage={unknownMessage}
        />
        <TouchpointSection
          label="Conversion Touch"
          touchpoint={conversionTouch}
          isConversion
        />
      </div>

      {/* Self-Reported */}
      {selfReported && (
        <div className="flex flex-col gap-1.5 border-t border-border pt-4">
          <div className="flex items-center gap-1.5">
            <MessageSquare className="size-3 text-muted-foreground" />
            <span className="text-[10px] font-semibold tracking-wider text-muted-foreground uppercase">
              Self-Reported
            </span>
          </div>
          <p className="text-sm text-foreground">
            &ldquo;{selfReported.response}&rdquo;
          </p>
          {selfReported.category && (
            <span className="text-xs text-muted-foreground">
              Category: {selfReported.category}
            </span>
          )}
        </div>
      )}

      {/* Relationship */}
      {relationships.length > 0 && (
        <div className="flex flex-col gap-1.5 border-t border-border pt-4">
          <div className="flex items-center gap-1.5">
            <User className="size-3 text-muted-foreground" />
            <span className="text-[10px] font-semibold tracking-wider text-muted-foreground uppercase">
              Relationship
            </span>
          </div>
          {relationships.map((rel) => (
            <div key={rel.personId + rel.type} className="flex flex-col gap-0.5">
              <span className="text-sm text-foreground">
                {RELATIONSHIP_TYPE_LABELS[rel.type] ?? rel.type}
              </span>
              <span className="text-xs text-muted-foreground">
                {rel.referrerName} ({rel.referrerCompany})
              </span>
              {rel.notes && (
                <span className="text-xs text-muted-foreground/70">
                  {rel.notes}
                </span>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
