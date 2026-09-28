import { PageHeader } from "@/components/layout";

export default async function LeadDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  return (
    <div className="space-y-6">
      <PageHeader title="Lead Detail" subtitle={id} />
      <div className="rounded-lg border border-border bg-card p-8 text-center text-sm text-muted-foreground">
        Lead detail — Phase 8
      </div>
    </div>
  );
}
