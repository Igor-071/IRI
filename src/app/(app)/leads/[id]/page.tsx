import { notFound } from "next/navigation";
import Link from "next/link";
import { RecordDetailLayout } from "@/components/layout";
import { LeadIdentityHeader } from "@/components/features/leads/lead-identity-header";
import { EngagementSummary } from "@/components/features/leads/engagement-summary";
import { LeadContextRail } from "@/components/features/leads/lead-context-rail";
import { AttributionSummary } from "@/components/features/attribution/attribution-summary";
import { JourneyTimeline } from "@/components/features/journey/journey-timeline";
import {
  getPersonById,
  getCompanyById,
  getEventsByPersonId,
} from "@/lib/data/repositories";
import { ChevronRight } from "lucide-react";

export default async function LeadDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const person = getPersonById(id);

  if (!person) {
    notFound();
  }

  const company = getCompanyById(person.companyId);
  const events = getEventsByPersonId(person.id);
  const lastActivity = events.length > 0 ? events[events.length - 1].timestamp : undefined;

  const breadcrumb = (
    <div className="flex items-center gap-1 text-sm text-muted-foreground">
      <Link href="/leads" className="hover:text-foreground transition-colors">
        Leads
      </Link>
      <ChevronRight className="size-3" />
      <span className="text-foreground">{person.name}</span>
    </div>
  );

  const header = (
    <LeadIdentityHeader
      person={person}
      company={company}
      lastActivityDate={lastActivity}
    />
  );

  const sidebar = (
    <LeadContextRail personId={person.id} companyId={person.companyId} />
  );

  return (
    <RecordDetailLayout
      breadcrumb={breadcrumb}
      header={header}
      sidebar={sidebar}
    >
      <div className="flex flex-col gap-8">
        {/* Engagement */}
        <EngagementSummary personId={person.id} />

        {/* Attribution */}
        <section>
          <h2 className="mb-4 text-sm font-semibold text-foreground">
            Attribution
          </h2>
          <div className="rounded-lg border border-border bg-card p-4">
            <AttributionSummary personId={person.id} />
          </div>
        </section>

        {/* Journey */}
        <section id="journey">
          <h2 className="mb-4 text-sm font-semibold text-foreground">
            Customer journey
          </h2>
          <div className="rounded-lg border border-border bg-card p-4">
            <JourneyTimeline personId={person.id} />
          </div>
        </section>
      </div>
    </RecordDetailLayout>
  );
}
