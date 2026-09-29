"use client";

import { useRouter } from "next/navigation";
import { DataTable } from "@/components/ui/data-table";
import {
  PersonIdentity,
  StageBadge,
  MoneyValue,
  JourneyPathDisplay,
} from "@/components/domain";
import { getConversionLabel } from "@/lib/config/conversions";
import {
  getCompanyById,
  getOpportunityByPersonId,
} from "@/lib/data/repositories";
import {
  getJourneyTouchCount,
  getJourneyDurationMinutes,
  getJourneyPathSegments,
} from "@/lib/journeys";
import { formatDuration } from "@/lib/formatting/duration";
import type { ColumnDef } from "@tanstack/react-table";
import type { Person } from "@/types";

const columns: ColumnDef<Person, unknown>[] = [
  {
    id: "contact",
    header: "Person",
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
    id: "path",
    header: "Path",
    cell: ({ row }) => (
      <JourneyPathDisplay
        segments={getJourneyPathSegments(row.original.id)}
      />
    ),
    enableSorting: false,
  },
  {
    id: "touches",
    header: "Touches",
    accessorFn: (row) => getJourneyTouchCount(row.id),
    cell: ({ row }) => (
      <span className="text-sm tabular-nums text-muted-foreground">
        {getJourneyTouchCount(row.original.id)}
      </span>
    ),
    enableSorting: true,
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
    id: "duration",
    header: "Duration",
    accessorFn: (row) => getJourneyDurationMinutes(row.id),
    cell: ({ row }) => (
      <span className="text-sm tabular-nums text-muted-foreground">
        {formatDuration(getJourneyDurationMinutes(row.original.id))}
      </span>
    ),
    enableSorting: true,
  },
  {
    id: "stage",
    header: "Stage",
    cell: ({ row }) => <StageBadge stage={row.original.displayStage} />,
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
];

interface JourneyTableProps {
  data: Person[];
}

export function JourneyTable({ data }: JourneyTableProps) {
  const router = useRouter();

  return (
    <DataTable
      columns={columns}
      data={data}
      onRowClick={(row) => router.push(`/leads/${row.id}#journey`)}
      emptyMessage="No journeys match these filters."
    />
  );
}
