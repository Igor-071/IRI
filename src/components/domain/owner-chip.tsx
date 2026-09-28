import { getOwnerName, owners } from "@/lib/config/owners";
import { Avatar, AvatarFallback } from "@/components/ui/atoms/avatar";
import { cn } from "@/lib/utils";

interface OwnerChipProps {
  ownerId: string;
  className?: string;
}

export function OwnerChip({ ownerId, className }: OwnerChipProps) {
  const name = getOwnerName(ownerId);
  const owner = owners.find((o) => o.id === ownerId);
  const initials = owner?.initials ?? name.charAt(0).toUpperCase();

  return (
    <div className={cn("inline-flex items-center gap-1.5", className)}>
      <Avatar size="sm">
        <AvatarFallback className="text-[10px]">{initials}</AvatarFallback>
      </Avatar>
      <span className="text-xs text-muted-foreground">{name}</span>
    </div>
  );
}
