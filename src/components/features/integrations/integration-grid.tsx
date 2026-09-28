import type { Integration } from "@/types";
import { groupIntegrationsByCategory } from "@/lib/config/integrations";
import { IntegrationCard } from "./integration-card";

interface IntegrationGridProps {
  integrations: Integration[];
}

export function IntegrationGrid({ integrations }: IntegrationGridProps) {
  const groups = groupIntegrationsByCategory(integrations);

  return (
    <div className="space-y-8">
      {groups.map((group) => (
        <section key={group.category}>
          <h2 className="mb-3 text-sm font-medium text-muted-foreground">
            {group.label}
            <span className="ml-1.5 text-xs font-normal">
              ({group.items.length})
            </span>
          </h2>
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
            {group.items.map((integration) => (
              <IntegrationCard
                key={integration.id}
                integration={integration}
                highlight={integration.id === "int_website_tracker"}
              />
            ))}
          </div>
        </section>
      ))}
    </div>
  );
}
