"use client";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import useSWR, { useSWRConfig } from "swr";
import {
  LayoutDashboard,
  FolderKanban,
  CheckCheck,
  Menu,
  LogOut,
  ArrowUpRight,
} from "lucide-react";
import { Brand } from "@/components/shared/Brand";
import { Avatar } from "@/components/shared/Avatar";
import { Dialog } from "@/components/shared/Dialog";
import { Loading, LoadError, ErrorMessage } from "@/components/shared/Feedback";
import { api, ApiError } from "@/services/api/client";
import { authApi } from "@/services/api/auth";
import { navigation } from "@data/navigation";
import type { User } from "@/types/domain";

const icons = {
  dashboard: LayoutDashboard,
  projects: FolderKanban,
  tasks: CheckCheck,
};
export function AppShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const { mutate } = useSWRConfig();
  const {
    data: user,
    error,
    mutate: retry,
  } = useSWR<User>(authApi.me, api, { shouldRetryOnError: false });
  const [drawer, setDrawer] = useState(false);
  const [busy, setBusy] = useState(false);
  const [logoutError, setLogoutError] = useState<unknown>();
  useEffect(() => {
    if (error instanceof ApiError && error.status === 401)
      router.replace("/login");
  }, [error, router]);
  if (error)
    return (
      <main id="main" className="mx-auto max-w-lg p-8">
        <LoadError error={error} retry={() => void retry()} />
      </main>
    );
  if (!user)
    return (
      <main id="main" className="p-8">
        <Loading />
      </main>
    );
  const current = navigation.find((item) => pathname.startsWith(item.href));
  const nav = (
    <nav aria-label="Workspace" className="space-y-1">
      {navigation.map((item) => {
        const Icon = icons[item.icon];
        const active = pathname.startsWith(item.href);
        return (
          <Link
            key={item.href}
            href={item.href}
            className={`nav-link ${active ? "active" : ""}`}
            aria-current={active ? "page" : undefined}
            onClick={() => setDrawer(false)}
          >
            <Icon size={18} strokeWidth={1.7} />
            {item.label}
          </Link>
        );
      })}
    </nav>
  );
  const account = (
    <div className="space-y-3 border-t border-line pt-5">
      <div className="flex min-w-0 items-center gap-3">
        <Avatar name={user.name} />
        <div className="min-w-0">
          <p className="truncate text-sm font-semibold">{user.name}</p>
          <p className="mt-1 truncate text-xs text-muted">{user.email}</p>
        </div>
      </div>
      <ErrorMessage error={logoutError} />
      <button
        className="nav-link w-full"
        disabled={busy}
        onClick={async () => {
          setBusy(true);
          setLogoutError(undefined);
          try {
            await authApi.logout();
            await mutate(() => true, undefined, { revalidate: false });
            router.replace("/login");
          } catch (failure) {
            setLogoutError(failure);
            setBusy(false);
          }
        }}
      >
        <LogOut size={16} />
        {busy ? "Signing out…" : "Sign out"}
      </button>
    </div>
  );
  return (
    <div className="min-h-dvh">
      <aside className="fixed inset-y-0 left-0 hidden w-60 flex-col border-r border-line bg-white px-5 py-8 lg:flex">
        <Brand href="/dashboard" />
        <p className="eyebrow mt-12 mb-4 px-3">Workspace</p>
        {nav}
        <div className="mt-auto">
          <div className="my-8 rounded-lg bg-canvas p-4">
            <p className="text-xs font-semibold">A little more clarity.</p>
            <p className="mt-2 text-xs leading-relaxed text-muted">
              Keep your team moving,
              <br />
              one task at a time.
            </p>
          </div>
          {account}
        </div>
      </aside>
      <div className="lg:pl-60">
        <header className="sticky top-0 z-20 flex h-20 items-center justify-between gap-3 border-b border-line bg-white/95 px-5 backdrop-blur-sm md:px-9">
          <div className="flex items-center gap-3">
            <button
              className="icon-button lg:hidden"
              aria-label="Open navigation"
              aria-expanded={drawer}
              onClick={() => setDrawer(true)}
            >
              <Menu size={20} />
            </button>
            <span className="text-sm font-medium">
              Workspace <span className="mx-2 text-line">/</span>{" "}
              <span className="text-muted">{current?.label || "Project"}</span>
            </span>
          </div>
          <Link
            href="/my-tasks"
            className="hidden items-center gap-2 text-xs text-muted sm:flex"
          >
            Your next move
            <ArrowUpRight size={15} />
          </Link>
          <span className="lg:hidden">
            <Avatar name={user.name} />
          </span>
        </header>
        <main
          id="main"
          className="mx-auto max-w-[1440px] px-5 py-8 md:px-9 md:py-10"
        >
          {children}
        </main>
        <footer className="mx-5 flex justify-between border-t border-line py-6 text-[11px] text-muted md:mx-9">
          <span>Taskora</span>
          <span>Plan. Assign. Deliver.</span>
        </footer>
      </div>
      {drawer && (
        <Dialog title="Your workspace" onClose={() => setDrawer(false)}>
          <div className="mb-8">{nav}</div>
          {account}
        </Dialog>
      )}
    </div>
  );
}
