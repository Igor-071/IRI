"use client";

import { useMemo } from "react";
import {
  getOpportunityByPersonId,
  getPeopleByCompanyId,
} from "@/lib/data/repositories";
import { OpportunitySummary } from "./opportunity-summary";
import { CommunicationSummary } from "./communication-summary";
import { RelatedContacts } from "./related-contacts";
import { cn } from "@/lib/utils";

interface LeadContextRailProps {
  personId: string;
  companyId: string;
  className?: string;
}

export function LeadContextRail({
  personId,
  companyId,
  className,
}: LeadContextRailProps) {
  const opportunity = useMemo(
    () => getOpportunityByPersonId(personId),
    [personId],
  );

  const relatedContacts = useMemo(() => {
    const all = getPeopleByCompanyId(companyId);
    return all.filter((p) => p.id !== personId);
  }, [companyId, personId]);

  return (
    <div className={cn("flex flex-col gap-6", className)}>
      {opportunity && <OpportunitySummary opportunity={opportunity} />}
      <CommunicationSummary personId={personId} />
      <RelatedContacts contacts={relatedContacts} />
    </div>
  );
}
