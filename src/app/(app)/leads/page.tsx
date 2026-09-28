import { PageHeader } from "@/components/layout";

export default function LeadsPage() {
  return (
    <div className="space-y-6">
      <PageHeader
        title="Inbound Leads"
        subtitle="All inbound contacts and their acquisition context."
      />
      <div className="rounded-lg border border-border bg-card p-8 text-center text-sm text-muted-foreground">
        Leads table — Phase 7
      </div>
    </div>
  );
}
