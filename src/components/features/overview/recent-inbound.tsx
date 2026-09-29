"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { companies } from "@/data";
import { getOpportunityByPersonId } from "@/lib/data/repositories";
import { getFirstTouchSource, getDisplayStage, getLeadPeople } from "@/lib/attribution/derived";
import {
  PersonIdentity,
  SourceBadge,
  StageBadge,
  MoneyValue,
  OwnerChip,
  DateTime,
} from "@/components/domain";
import { DataTable } from "@/components/ui/data-table";
import type { ColumnDef } from "@tanstack/react-table";
import type { Person } from "@/types";
import {
  Card,
  CardHeader,
  CardTitle,
  CardAction,
  CardContent,
} from "@/components/ui/card";

const companyMap = new Map(companies.map((c) => [c.id, c]));

const recentLeads = [...getLeadPeople()]
  .sort((a, b) => b.createdAt.localeCompare(a.createdAt))
  .slice(0, 8);

const columns: ColumnDef<Person, unknown>[] = [
  {
    id: "contact",
    header: "Contact",
    cell: ({ row }) => (
      <PersonIdentity person={row.original} compact />
    ),
    enableSorting: false,
  },
  {
    id: "company",
    header: "Company",
    cell: ({ row }) => {
      const company = companyMap.get(row.original.companyId);
      return (
        <span className="text-sm text-muted-foreground truncate">
          {company?.name ?? "—"}
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
    id: "stage",
    header: "Stage",
    cell: ({ row }) => (
      <StageBadge stage={getDisplayStage(row.original.id)} />
    ),
    enableSorting: false,
  },
  {
    id: "value",
    header: "Value",
    cell: ({ row }) => {
      const opp = getOpportunityByPersonId(row.original.id);
      return opp ? <MoneyValue value={opp.value} /> : <span className="text-xs text-muted-foreground">—</span>;
    },
    enableSorting: false,
  },
  {
    id: "owner",
    header: "Owner",
    cell: ({ row }) => (
      <OwnerChip ownerId={row.original.ownerId} />
    ),
    enableSorting: false,
  },
  {
    id: "created",
    header: "Created",
    cell: ({ row }) => (
      <DateTime date={row.original.createdAt} format="relative" />
    ),
    enableSorting: false,
  },
];

export function RecentInbound() {
  const router = useRouter();

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-sm">Recent inbound</CardTitle>
        <CardAction>
          <Link
            href="/leads"
            className="text-xs font-medium text-primary hover:text-primary/80"
          >
            View all leads →
          </Link>
        </CardAction>
      </CardHeader>
      <CardContent className="px-0">
        <DataTable
          columns={columns}
          data={recentLeads}
          onRowClick={(row) => router.push(`/leads/${row.id}`)}
        />
      </CardContent>
    </Card>
  );
}
