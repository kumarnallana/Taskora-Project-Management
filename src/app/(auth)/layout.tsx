import { Brand } from "@/components/shared/Brand";
import { FolderKanban, Users, CheckCheck } from "lucide-react";

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="grid min-h-dvh bg-canvas lg:grid-cols-2">
      <aside className="hidden flex-col justify-between border-r border-line p-12 lg:flex">
        <Brand />
        <div className="max-w-md">
          <p className="eyebrow mb-5">YOUR TEAM'S NEXT STEP</p>
          <h2 className="text-5xl leading-[1.12] tracking-tight">
            Bring the plan
            <br />
            and the people
            <br />
            together.
          </h2>
          <p className="mt-6 max-w-sm text-base leading-relaxed text-muted">
            A focused workspace for making progress. Clear projects, shared
            ownership, and work that moves forward.
          </p>
          <div className="card mt-9 divide-y divide-line px-5">
            <div className="flex items-center gap-4 py-5">
              <FolderKanban size={20} className="text-muted" />
              <div>
                <p className="text-sm font-semibold">Plan with clarity</p>
                <p className="mt-1 text-xs text-muted">
                  Give every project a shared direction.
                </p>
              </div>
            </div>
            <div className="flex items-center gap-4 py-5">
              <Users size={20} className="text-muted" />
              <div>
                <p className="text-sm font-semibold">Know who's on it</p>
                <p className="mt-1 text-xs text-muted">
                  Connect the right people to the work.
                </p>
              </div>
            </div>
            <div className="flex items-center gap-4 py-5">
              <CheckCheck size={20} className="text-muted" />
              <div>
                <p className="text-sm font-semibold">See what's moving</p>
                <p className="mt-1 text-xs text-muted">
                  Turn completed tasks into visible progress.
                </p>
              </div>
            </div>
          </div>
        </div>
        <p className="text-xs text-muted">Plan. Assign. Deliver.</p>
      </aside>
      <div className="flex min-h-dvh flex-col bg-white">
        <div className="px-6 pt-7 lg:hidden">
          <Brand />
        </div>
        <main
          id="main"
          className="flex flex-1 items-center justify-center px-6 py-12"
        >
          {children}
        </main>
      </div>
    </div>
  );
}
