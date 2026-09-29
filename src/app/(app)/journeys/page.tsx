"use client";

import { useMemo, useState, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { ListLayout } from "@/components/layout";
import { JourneyFilters } from "@/components/features/journeys/journey-filters";
import { JourneyTable } from "@/components/features/journeys/journey-table";
import { getLeads, getCompanyById } from "@/lib/data/repositories";
import type {
  AcquisitionSource,
  ConversionMechanism,
  DisplayStage,
} from "@/types";

function JourneysContent() {
  const searchParams = useSearchParams();
  const [search, setSearch] = useState("");

  const source = (searchParams.get("source") ?? undefined) as
    | AcquisitionSource
    | undefined;
  const stage = (searchParams.get("stage") ?? undefined) as
    | DisplayStage
    | undefined;
  const conversion = (searchParams.get("conversion") ?? undefined) as
    | ConversionMechanism
    | undefined;

  const leads = useMemo(() => getLeads({ source, stage }), [source, stage]);

  const filtered = useMemo(() => {
    let result = leads;

    if (conversion) {
      result = result.filter((p) => p.conversionMechanism === conversion);
    }

    if (search) {
      const q = search.toLowerCase();
      result = result.filter((person) => {
        if (person.name.toLowerCase().includes(q)) return true;
        if (person.email.toLowerCase().includes(q)) return true;
        const company = getCompanyById(person.companyId);
        if (company && company.name.toLowerCase().includes(q)) return true;
        return false;
      });
    }

    return result;
  }, [leads, conversion, search]);

  const sorted = useMemo(
    () =>
      [...filtered].sort((a, b) => b.createdAt.localeCompare(a.createdAt)),
    [filtered],
  );

  return (
    <ListLayout
      title="Journeys"
      subtitle="Explore complete customer paths across marketing, website, communication and sales."
      filters={
        <JourneyFilters
          search={search}
          onSearchChange={setSearch}
          resultCount={sorted.length}
        />
      }
    >
      <JourneyTable data={sorted} />
    </ListLayout>
  );
}

export default function JourneysPage() {
  return (
    <Suspense>
      <JourneysContent />
    </Suspense>
  );
}
