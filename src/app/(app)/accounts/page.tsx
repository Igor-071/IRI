"use client";

import { useMemo, useState, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { ListLayout } from "@/components/layout";
import { AccountFilters } from "@/components/features/accounts/account-filters";
import { AccountTable } from "@/components/features/accounts/account-table";
import { getAccounts } from "@/lib/data/repositories";
import { getAccountEarliestTouch } from "@/lib/journeys";
import { sourceConfig } from "@/lib/config/sources";
import type { AcquisitionSource } from "@/types";

function sourceLabelToKey(label: string): AcquisitionSource {
  for (const [key, config] of Object.entries(sourceConfig)) {
    if (config.label === label) return key as AcquisitionSource;
  }
  return "unknown";
}

function AccountsContent() {
  const searchParams = useSearchParams();
  const [search, setSearch] = useState("");

  const source = (searchParams.get("source") ?? undefined) as
    | AcquisitionSource
    | undefined;
  const owner = searchParams.get("owner") ?? undefined;

  const allAccounts = useMemo(() => getAccounts(), []);

  const filtered = useMemo(() => {
    let result = allAccounts;

    if (source) {
      result = result.filter((company) => {
        const touch = getAccountEarliestTouch(company.id);
        if (!touch) return source === "unknown";
        return sourceLabelToKey(touch.source) === source;
      });
    }

    if (owner) {
      result = result.filter((company) => company.ownerId === owner);
    }

    if (search) {
      const q = search.toLowerCase();
      result = result.filter(
        (company) =>
          company.name.toLowerCase().includes(q) ||
          company.domain.toLowerCase().includes(q),
      );
    }

    return result;
  }, [allAccounts, source, owner, search]);

  const sorted = useMemo(
    () =>
      [...filtered].sort((a, b) => b.createdAt.localeCompare(a.createdAt)),
    [filtered],
  );

  return (
    <ListLayout
      title="Accounts"
      subtitle="B2B accounts and their commercial relationships."
      filters={
        <AccountFilters
          search={search}
          onSearchChange={setSearch}
          resultCount={sorted.length}
        />
      }
    >
      <AccountTable data={sorted} />
    </ListLayout>
  );
}

export default function AccountsPage() {
  return (
    <Suspense>
      <AccountsContent />
    </Suspense>
  );
}
