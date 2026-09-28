import { PageHeader } from "@/components/layout";

export default function AccountsPage() {
  return (
    <div className="space-y-6">
      <PageHeader title="Accounts" subtitle="B2B accounts and relationships." />
      <div className="rounded-lg border border-border bg-card p-8 text-center text-sm text-muted-foreground">
        Accounts table — Phase 9
      </div>
    </div>
  );
}
