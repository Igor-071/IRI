import { PageHeader } from "@/components/layout";
import { IntegrationGrid } from "@/components/features/integrations/integration-grid";
import { integrations } from "@/data";

export default function IntegrationsPage() {
  return (
    <div className="space-y-6">
      <PageHeader
        title="Integrations"
        subtitle="Sources feeding acquisition, behavioral, communication and sales data."
      />
      <IntegrationGrid integrations={integrations} />
    </div>
  );
}
