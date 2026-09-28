import Link from "next/link";

export default function NotFound() {
  return (
    <div className="flex h-screen flex-col items-center justify-center gap-4">
      <h1 className="text-lg font-semibold text-foreground">
        Record not found
      </h1>
      <p className="text-sm text-muted-foreground">
        The requested lead or account is not available in the current workspace.
      </p>
      <Link
        href="/overview"
        className="text-sm text-primary underline-offset-4 hover:underline"
      >
        Return to overview
      </Link>
    </div>
  );
}
