import type { Company } from "@/types";
import { OwnerChip } from "@/components/domain/owner-chip";
import { Building2, Globe, MapPin, Users, Factory } from "lucide-react";

interface AccountIdentityHeaderProps {
  company: Company;
}

export function AccountIdentityHeader({
  company,
}: AccountIdentityHeaderProps) {
  return (
    <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
      {/* Left: Identity */}
      <div className="flex items-start gap-4">
        <div className="flex size-10 shrink-0 items-center justify-center rounded-lg bg-muted">
          <Building2 className="size-5 text-muted-foreground" />
        </div>
        <div className="flex flex-col gap-1">
          <h1 className="text-lg font-semibold text-foreground">
            {company.name}
          </h1>
          <div className="flex flex-wrap items-center gap-3 text-xs text-muted-foreground">
            <span className="inline-flex items-center gap-1">
              <Globe className="size-3" />
              {company.domain}
            </span>
            <span className="inline-flex items-center gap-1">
              <Factory className="size-3" />
              {company.industry}
            </span>
            <span className="inline-flex items-center gap-1">
              <Users className="size-3" />
              {company.size}
            </span>
            <span className="inline-flex items-center gap-1">
              <MapPin className="size-3" />
              {company.location}
            </span>
          </div>
        </div>
      </div>

      {/* Right: Owner */}
      <div className="flex items-center gap-3">
        <OwnerChip ownerId={company.ownerId} />
      </div>
    </div>
  );
}
