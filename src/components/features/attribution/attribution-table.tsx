"use client";

import type { ColumnDef } from "@tanstack/react-table";
import type { AttributionModel } from "@/types";
import type { AttributionSourceRow } from "@/lib/metrics/attribution-metrics";
import { DataTable } from "@/components/ui/data-table";
import { SourceBadge } from "@/components/domain";
import { formatMoneyFull } from "@/lib/formatting/money";
import { formatPercent } from "@/lib/formatting/percent";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
} from "@/components/ui/card";

interface AttributionTableProps {
  rows: AttributionSourceRow[];
  model: AttributionModel;
  onSourceClick: (source: string) => void;
}

const columns: ColumnDef<AttributionSourceRow, unknown>[] = [
  {
    accessorKey: "source",
    header: "Source",
    enableSorting: false,
    cell: ({ row }) => <SourceBadge source={row.original.source} />,
  },
  {
    accessorKey: "leads",
    header: "Leads",
    cell: ({ row }) => (
      <span className="tabular-nums text-sm">{row.original.leads}</span>
    ),
  },
  {
    accessorKey: "qualified",
    header: "Qualified",
    cell: ({ row }) => (
      <span className="tabular-nums text-sm">{row.original.qualified}</span>
    ),
  },
  {
    accessorKey: "opportunities",
    header: "Opps",
    cell: ({ row }) => (
      <span className="tabular-nums text-sm">
        {row.original.opportunities}
      </span>
    ),
  },
  {
    accessorKey: "won",
    header: "Won",
    cell: ({ row }) => (
      <span className="tabular-nums text-sm">{row.original.won}</span>
    ),
  },
  {
    accessorKey: "leadToOppPercent",
    header: "Lead→Opp",
    cell: ({ row }) => (
      <span className="tabular-nums text-sm">
        {formatPercent(row.original.leadToOppPercent)}
      </span>
    ),
  },
  {
    accessorKey: "openPipeline",
    header: "Pipeline",
    cell: ({ row }) => (
      <span className="tabular-nums text-sm">
        {formatMoneyFull(row.original.openPipeline)}
      </span>
    ),
  },
  {
    accessorKey: "revenue",
    header: "Revenue",
    cell: ({ row }) => (
      <span className="tabular-nums text-sm">
        {formatMoneyFull(row.original.revenue)}
      </span>
    ),
  },
  {
    accessorKey: "avgDeal",
    header: "Avg Deal",
    cell: ({ row }) => (
      <span className="tabular-nums text-sm">
        {row.original.avgDeal > 0 ? formatMoneyFull(row.original.avgDeal) : "—"}
      </span>
    ),
  },
];

export function AttributionTable({
  rows,
  model,
  onSourceClick,
}: AttributionTableProps) {
  // Filter Direct for first_touch/last_touch models
  const filteredRows =
    model === "conversion_touch"
      ? rows
      : rows.filter((r) => r.source !== "direct");

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-sm">Attribution by source</CardTitle>
      </CardHeader>
      <CardContent>
        <DataTable
          columns={columns}
          data={filteredRows}
          onRowClick={(row) => onSourceClick(row.source)}
        />
      </CardContent>
    </Card>
  );
}
