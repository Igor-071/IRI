import { cn } from "@/lib/utils";

interface RecordDetailLayoutProps {
  breadcrumb?: React.ReactNode;
  header: React.ReactNode;
  sidebar?: React.ReactNode;
  children: React.ReactNode;
  className?: string;
}

export function RecordDetailLayout({
  breadcrumb,
  header,
  sidebar,
  children,
  className,
}: RecordDetailLayoutProps) {
  return (
    <div className={cn("mx-auto w-full max-w-[1400px] flex flex-col gap-6", className)}>
      {breadcrumb && (
        <nav className="text-sm text-muted-foreground">{breadcrumb}</nav>
      )}
      <div className="w-full">{header}</div>
      <div className="flex gap-8">
        <div className="min-w-0 flex-1">{children}</div>
        {sidebar && (
          <aside className="hidden w-80 shrink-0 lg:block">{sidebar}</aside>
        )}
      </div>
    </div>
  );
}
