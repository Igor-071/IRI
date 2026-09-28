import { notFound } from "next/navigation";
import Link from "next/link";
import { RecordDetailLayout } from "@/components/layout";
import { AccountIdentityHeader } from "@/components/features/accounts/account-identity-header";
import { AccountKpiStrip } from "@/components/features/accounts/account-kpi-strip";
import { AccountContacts } from "@/components/features/accounts/account-contacts";
import { AccountOpportunities } from "@/components/features/accounts/account-opportunities";
import { AccountAttributionSection } from "@/components/features/accounts/account-attribution-section";
import { JourneyTimeline } from "@/components/features/journey/journey-timeline";
import { getCompanyById } from "@/lib/data/repositories";
import { ChevronRight } from "lucide-react";

export default async function AccountDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const company = getCompanyById(id);

  if (!company) {
    notFound();
  }

  const breadcrumb = (
    <div className="flex items-center gap-1 text-sm text-muted-foreground">
      <Link
        href="/accounts"
        className="hover:text-foreground transition-colors"
      >
        Accounts
      </Link>
      <ChevronRight className="size-3" />
      <span className="text-foreground">{company.name}</span>
    </div>
  );

  const header = <AccountIdentityHeader company={company} />;

  return (
    <RecordDetailLayout breadcrumb={breadcrumb} header={header}>
      <div className="flex flex-col gap-8">
        {/* KPI Strip */}
        <AccountKpiStrip companyId={company.id} />

        {/* Known Contacts */}
        <section>
          <h2 className="mb-4 text-sm font-semibold text-foreground">
            Known Contacts
          </h2>
          <AccountContacts companyId={company.id} />
        </section>

        {/* Opportunities */}
        <section>
          <h2 className="mb-4 text-sm font-semibold text-foreground">
            Opportunities
          </h2>
          <AccountOpportunities companyId={company.id} />
        </section>

        {/* Account Attribution */}
        <section>
          <h2 className="mb-4 text-sm font-semibold text-foreground">
            Account Attribution
          </h2>
          <div className="rounded-lg border border-border bg-card p-4">
            <AccountAttributionSection companyId={company.id} />
          </div>
        </section>

        {/* Account Journey */}
        <section>
          <h2 className="mb-4 text-sm font-semibold text-foreground">
            Account Journey
          </h2>
          <div className="rounded-lg border border-border bg-card p-4">
            <JourneyTimeline companyId={company.id} />
          </div>
        </section>
      </div>
    </RecordDetailLayout>
  );
}
