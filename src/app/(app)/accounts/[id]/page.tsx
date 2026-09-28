import { PageHeader } from "@/components/layout";

export default async function AccountDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  return (
    <div className="space-y-6">
      <PageHeader title="Account Detail" subtitle={id} />
      <div className="rounded-lg border border-border bg-card p-8 text-center text-sm text-muted-foreground">
        Account detail — Phase 9
      </div>
    </div>
  );
}
