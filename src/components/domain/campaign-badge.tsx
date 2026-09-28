import { Badge } from "@/components/ui/atoms/badge";
import { cn } from "@/lib/utils";

interface CampaignBadgeProps {
  campaign: string;
  className?: string;
}

export function CampaignBadge({ campaign, className }: CampaignBadgeProps) {
  return (
    <Badge variant="outline" className={cn("font-normal", className)}>
      {campaign}
    </Badge>
  );
}
