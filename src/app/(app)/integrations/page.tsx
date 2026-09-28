import { PageHeader } from "@/components/layout";

export default function IntegrationsPage() {
  return (
    <div className="space-y-6">
      <PageHeader
        title="Integrations"
        subtitle="Connected data sources and system health."
      />
      <div className="rounded-lg border border-border bg-card p-8 text-center text-sm text-muted-foreground">
        Integrations grid — Phase 11
      </div>
    </div>
  );
}
