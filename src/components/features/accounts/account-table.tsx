"use client";

import { useRouter } from "next/navigation";
import { DataTable } from "@/components/ui/data-table";
import {
  CompanyIdentity,
  SourceBadge,
  OwnerChip,
  MoneyValue,
  DateTime,
} from "@/components/domain";
import {
  getPeopleByCompanyId,
  getOpportunitiesByCompanyId,
} from "@/lib/data/repositories";
import { getAccountEarliestTouch } from "@/lib/journeys";
import { sourceConfig } from "@/lib/config/sources";
import { getAccountMetrics } from "@/lib/metrics/account-metrics";
import type { ColumnDef } from "@tanstack/react-table";
import type { Company, AcquisitionSource } from "@/types";

function sourceLabelToKey(label: string): AcquisitionSource {
  for (const [key, config] of Object.entries(sourceConfig)) {
    if (config.label === label) return key as AcquisitionSource;
  }
  return "unknown";
}

const columns: ColumnDef<Company, unknown>[] = [
  {
    id: "company",
    header: "Company",
    cell: ({ row }) => <CompanyIdentity company={row.original} />,
    enableSorting: false,
  },
  {
    id: "contacts",
    header: "Contacts",
    cell: ({ row }) => {
      const count = getPeopleByCompanyId(row.original.id).length;
      return (
        <span className="text-sm tabular-nums text-muted-foreground">
          {count}
        </span>
      );
    },
    enableSorting: false,
  },
  {
    id: "firstTouch",
    header: "First Touch",
    cell: ({ row }) => {
      const touch = getAccountEarliestTouch(row.original.id);
      if (!touch) return <SourceBadge source="unknown" />;
      const sourceKey = sourceLabelToKey(touch.source);
      return <SourceBadge source={sourceKey} />;
    },
    enableSorting: false,
  },
  {
    id: "opportunities",
    header: "Opportunities",
    cell: ({ row }) => {
      const opps = getOpportunitiesByCompanyId(row.original.id);
      return (
        <span className="text-sm tabular-nums text-muted-foreground">
          {opps.length}
        </span>
      );
    },
    enableSorting: false,
  },
  {
    id: "pipeline",
    header: "Open Pipeline",
    accessorFn: (row) => getAccountMetrics(row.id).openPipeline,
    cell: ({ row }) => {
      const metrics = getAccountMetrics(row.original.id);
      return metrics.openPipeline > 0 ? (
        <MoneyValue value={metrics.openPipeline} />
      ) : (
        <span className="text-xs text-muted-foreground">{"\u2014"}</span>
      );
    },
    enableSorting: true,
  },
  {
    id: "lastActivity",
    header: "Last Activity",
    accessorFn: (row) => getAccountMetrics(row.id).lastActivity ?? "",
    cell: ({ row }) => {
      const metrics = getAccountMetrics(row.original.id);
      return metrics.lastActivity ? (
        <DateTime date={metrics.lastActivity} format="relative" />
      ) : (
        <span className="text-xs text-muted-foreground">{"\u2014"}</span>
      );
    },
    enableSorting: true,
    sortingFn: "alphanumeric",
  },
  {
    id: "owner",
    header: "Owner",
    cell: ({ row }) => <OwnerChip ownerId={row.original.ownerId} />,
    enableSorting: false,
  },
];

interface AccountTableProps {
  data: Company[];
  emptyMessage?: string;
}

export function AccountTable({
  data,
  emptyMessage = "No accounts match these filters.",
}: AccountTableProps) {
  const router = useRouter();

  return (
    <DataTable
      columns={columns}
      data={data}
      onRowClick={(row) => router.push(`/accounts/${row.id}`)}
      emptyMessage={emptyMessage}
    />
  );
}
