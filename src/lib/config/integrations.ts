import type { Integration, IntegrationCategory } from "@/types";

const categoryConfig: Record<
  IntegrationCategory,
  { label: string; order: number }
> = {
  analytics: { label: "Analytics", order: 0 },
  advertising: { label: "Advertising", order: 1 },
  lead_capture: { label: "Inbound capture", order: 2 },
  crm: { label: "CRM", order: 3 },
  communication: { label: "Communication", order: 4 },
  scheduling: { label: "Scheduling", order: 5 },
  content: { label: "Content", order: 6 },
  automation: { label: "Automation", order: 7 },
};

export function getCategoryLabel(category: IntegrationCategory): string {
  return categoryConfig[category].label;
}

export function groupIntegrationsByCategory(
  integrations: Integration[]
): { category: IntegrationCategory; label: string; items: Integration[] }[] {
  const grouped = new Map<IntegrationCategory, Integration[]>();

  for (const integration of integrations) {
    const existing = grouped.get(integration.category);
    if (existing) {
      existing.push(integration);
    } else {
      grouped.set(integration.category, [integration]);
    }
  }

  return Array.from(grouped.entries())
    .map(([category, items]) => ({
      category,
      label: categoryConfig[category].label,
      items,
    }))
    .sort(
      (a, b) => categoryConfig[a.category].order - categoryConfig[b.category].order
    );
}
