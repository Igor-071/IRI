import { PageHeader } from "@/components/layout";

export default function JourneysPage() {
  return (
    <div className="space-y-6">
      <PageHeader
        title="Journeys"
        subtitle="Explore individual customer journeys."
      />
      <div className="rounded-lg border border-border bg-card p-8 text-center text-sm text-muted-foreground">
        Journeys table — Phase 13 (P2)
      </div>
    </div>
  );
}
