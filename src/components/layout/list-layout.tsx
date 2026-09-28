import { PageHeader } from "./page-header";

interface ListLayoutProps {
  title: string;
  subtitle?: string;
  filters?: React.ReactNode;
  actions?: React.ReactNode;
  children: React.ReactNode;
}

export function ListLayout({
  title,
  subtitle,
  filters,
  actions,
  children,
}: ListLayoutProps) {
  return (
    <div className="flex flex-col gap-6">
      <PageHeader title={title} subtitle={subtitle} actions={actions} />
      {filters && (
        <div className="flex items-center gap-3">{filters}</div>
      )}
      <div className="w-full">{children}</div>
    </div>
  );
}
