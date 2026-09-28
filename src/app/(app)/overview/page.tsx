import { PageHeader } from "@/components/layout";

export default function OverviewPage() {
  return (
    <div className="space-y-6">
      <PageHeader
        title="Overview"
        subtitle="Inbound performance at a glance."
      />
      <div className="rounded-lg border border-border bg-card p-8 text-center text-sm text-muted-foreground">
        Overview content — Phase 6
      </div>
    </div>
  );
}
