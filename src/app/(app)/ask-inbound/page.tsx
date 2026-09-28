import { PageHeader } from "@/components/layout";
import { AskInboundContent } from "@/components/features/ask-inbound/ask-inbound-content";

export default function AskInboundPage() {
  return (
    <div className="space-y-6">
      <PageHeader
        title="Ask Inbound"
        subtitle="Ask questions across attribution, accounts, journeys, pipeline and revenue."
      />
      <AskInboundContent />
    </div>
  );
}
