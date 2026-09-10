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
    <div className="card flex flex-col items-center justify-center p-12 text-center shadow-sm border border-line bg-canvas/30 min-h-[300px]">
      <div className="relative mb-6 flex h-20 w-20 items-center justify-center rounded-3xl bg-white shadow-sm ring-1 ring-line">
        <div className="absolute -right-2 -top-2 flex h-8 w-8 items-center justify-center rounded-full bg-canvas ring-4 ring-white">
          <FolderOpen size={14} className="text-muted" />
        </div>
        <div className="h-2 w-8 rounded-full bg-line-strong opacity-20" />
      </div>
      <h2 className="text-lg font-semibold tracking-tight text-ink">{title}</h2>
      <p className="mt-2 mb-6 max-w-sm text-[15px] leading-relaxed text-muted">
        {description}
      </p>
      {children}
    </div>
  );
}
