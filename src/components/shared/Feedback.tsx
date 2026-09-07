import { FolderOpen, RefreshCw } from "lucide-react";
import type { ReactNode } from "react";

export function ErrorMessage({ error }: { error: unknown }) {
  if (!error) return null;
  return (
    <div className="error-message" role="alert">
      {error instanceof Error
        ? error.message
        : "Something went wrong. Please try again."}
    </div>
  );
}
export function Loading() {
  return (
    <div role="status" aria-label="Loading workspace" className="space-y-5">
      <span className="sr-only">Loading…</span>
      <div className="skeleton h-10 w-52" />
      <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
        <div className="skeleton h-44" />
        <div className="skeleton h-44" />
        <div className="skeleton h-44" />
      </div>
    </div>
  );
}
export function LoadError({
  error,
  retry,
}: {
  error: unknown;
  retry: () => void;
}) {
  return (
    <div className="card space-y-4 p-6">
      <ErrorMessage error={error} />
      <button className="btn btn-secondary" onClick={retry}>
        <RefreshCw size={16} />
        Try again
      </button>
    </div>
  );
}
export function EmptyState({
  title,
  description,
  children,
}: {
  title: string;
  description: string;
  children?: ReactNode;
}) {
  return (
    <div className="card flex flex-col items-center px-5 py-14 text-center">
      <span className="mb-5 rounded-xl bg-canvas p-4 text-muted">
        <FolderOpen size={26} strokeWidth={1.4} />
      </span>
      <h2 className="text-lg">{title}</h2>
      <p className="mt-2 mb-6 max-w-sm leading-relaxed text-muted">
        {description}
      </p>
      {children}
    </div>
  );
}
