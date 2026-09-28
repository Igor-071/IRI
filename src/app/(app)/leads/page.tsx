"use client";

import { useMemo, useState, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { ListLayout } from "@/components/layout";
import { LeadFilters } from "@/components/features/leads/lead-filters";
import { LeadTable } from "@/components/features/leads/lead-table";
import { getLeads, getCompanyById } from "@/lib/data/repositories";
import type {
  AcquisitionSource,
  AttributionStatus,
  DisplayStage,
} from "@/types";

function LeadsContent() {
  const searchParams = useSearchParams();
  const [search, setSearch] = useState("");

  const source = (searchParams.get("source") ?? undefined) as
    | AcquisitionSource
    | undefined;
  const stage = (searchParams.get("stage") ?? undefined) as
    | DisplayStage
    | undefined;
  const attribution = (searchParams.get("attribution") ?? undefined) as
    | AttributionStatus
    | undefined;
  const owner = searchParams.get("owner") ?? undefined;

  const leads = useMemo(
    () =>
      getLeads({
        source,
        stage,
        attribution,
        owner,
      }),
    [source, stage, attribution, owner]
  );

  const filtered = useMemo(() => {
    if (!search) return leads;

    const q = search.toLowerCase();
    return leads.filter((person) => {
      if (person.name.toLowerCase().includes(q)) return true;
      if (person.email.toLowerCase().includes(q)) return true;
      const company = getCompanyById(person.companyId);
      if (company && company.name.toLowerCase().includes(q)) return true;
      return false;
    });
  }, [leads, search]);

  const sorted = useMemo(
    () =>
      [...filtered].sort((a, b) => b.createdAt.localeCompare(a.createdAt)),
    [filtered]
  );

  return (
    <ListLayout
      title="Inbound Leads"
      subtitle="All inbound contacts and their acquisition context."
      filters={
        <LeadFilters
          search={search}
          onSearchChange={setSearch}
          resultCount={sorted.length}
        />
      }
    >
      <LeadTable data={sorted} />
    </ListLayout>
  );
}

export default function LeadsPage() {
  return (
    <Suspense>
      <LeadsContent />
    </Suspense>
  );
}
