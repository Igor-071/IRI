import type { Company } from "@/types";
import { cn } from "@/lib/utils";

interface CompanyIdentityProps {
  company: Company;
  compact?: boolean;
  className?: string;
}

export function CompanyIdentity({
  company,
  compact = false,
  className,
}: CompanyIdentityProps) {
  return (
    <div className={cn("min-w-0", className)}>
      <p className="truncate text-sm font-medium text-foreground">
        {company.name}
      </p>
      {!compact && (
        <p className="truncate text-xs text-muted-foreground">
          {company.industry} &middot; {company.location}
        </p>
      )}
    </div>
  );
}
