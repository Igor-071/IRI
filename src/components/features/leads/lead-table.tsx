"use client";

import { useRouter } from "next/navigation";
import { DataTable } from "@/components/ui/data-table";
import {
  PersonIdentity,
  SourceBadge,
  StageBadge,
  OwnerChip,
  MoneyValue,
  DateTime,
} from "@/components/domain";
import { getLastMarketingTouch } from "@/lib/attribution/touchpoints";
import { getFirstTouchSource, getDisplayStage } from "@/lib/attribution/derived";
import { getConversionLabel } from "@/lib/config/conversions";
import {
  getCompanyById,
  getOpportunityByPersonId,
} from "@/lib/data/repositories";
import type { ColumnDef } from "@tanstack/react-table";
import type { Person } from "@/types";

const columns: ColumnDef<Person, unknown>[] = [
  {
    id: "contact",
    header: "Contact",
    cell: ({ row }) => <PersonIdentity person={row.original} compact />,
    enableSorting: false,
  },
  {
    id: "company",
    header: "Company",
    cell: ({ row }) => {
      const company = getCompanyById(row.original.companyId);
      return (
        <span className="text-sm text-muted-foreground truncate">
          {company?.name ?? "\u2014"}
        </span>
      );
    },
    enableSorting: false,
  },
  {
    id: "firstTouch",
    header: "First Touch",
    cell: ({ row }) => (
      <SourceBadge source={getFirstTouchSource(row.original.id)} />
    ),
    enableSorting: false,
  },
  {
    id: "lastMarketingTouch",
    header: "Last Marketing Touch",
    cell: ({ row }) => {
      const tp = getLastMarketingTouch(row.original.id);
      if (!tp) {
        return <SourceBadge source="unknown" />;
      }
      return <SourceBadge source={tp.source} />;
    },
    enableSorting: false,
  },
  {
    id: "conversion",
    header: "Conversion",
    cell: ({ row }) => (
      <span className="text-sm text-muted-foreground">
        {getConversionLabel(row.original.conversionMechanism)}
      </span>
    ),
    enableSorting: false,
  },
  {
    id: "stage",
    header: "Stage",
    cell: ({ row }) => <StageBadge stage={getDisplayStage(row.original.id)} />,
    enableSorting: false,
  },
  {
    id: "owner",
    header: "Owner",
    cell: ({ row }) => <OwnerChip ownerId={row.original.ownerId} />,
    enableSorting: false,
  },
  {
    id: "value",
    header: "Value",
    accessorFn: (row) => getOpportunityByPersonId(row.id)?.value ?? 0,
    cell: ({ row }) => {
      const opp = getOpportunityByPersonId(row.original.id);
      return opp ? (
        <MoneyValue value={opp.value} />
      ) : (
        <span className="text-xs text-muted-foreground">{"\u2014"}</span>
      );
    },
    enableSorting: true,
  },
  {
    id: "created",
    header: "Created",
    accessorFn: (row) => row.createdAt,
    cell: ({ row }) => (
      <DateTime date={row.original.createdAt} format="relative" />
    ),
    enableSorting: true,
    sortingFn: "alphanumeric",
  },
];

interface LeadTableProps {
  data: Person[];
  emptyMessage?: string;
}

export function LeadTable({
  data,
  emptyMessage = "No leads match these filters.",
}: LeadTableProps) {
  const router = useRouter();

  return (
    <DataTable
      columns={columns}
      data={data}
      onRowClick={(row) => router.push(`/leads/${row.id}`)}
      emptyMessage={emptyMessage}
    />
  );
}
