import Link from "next/link";
import {
  ArrowUpRight,
  ArrowRight,
  Check,
  Layers2,
  Users,
  LayoutDashboard,
  FolderKanban,
  CheckCheck,
} from "lucide-react";
import { Brand } from "@/components/shared/Brand";
import { brand } from "@data/brand";
import { values, previewColumns } from "@data/marketing";
import { statuses } from "@data/tasks";

export default function Landing() {
  return (
    <>
      <header className="border-b border-line bg-white">
        <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-5 py-5 md:px-10">
          <Brand />
          <nav className="flex items-center gap-3 sm:gap-6" aria-label="Main">
            <a
              href="#workspace-preview"
              className="hidden text-sm text-muted md:inline-flex"
            >
              The workspace
            </a>
            <Link href="/login" className="text-sm font-medium">
              Sign In
            </Link>
            <Link href="/register" className="btn btn-primary">
              Get Started
              <ArrowUpRight size={16} />
            </Link>
          </nav>
        </div>
      </header>
      <main id="main">
        <section className="mx-auto max-w-7xl px-5 pt-14 pb-16 md:px-10 md:pt-20">
          <div className="mx-auto max-w-3xl text-center">
            <p className="eyebrow mb-5">PROJECTS. PEOPLE. PROGRESS.</p>
            <h1 className="hero-title">
              Keep every project
              <br className="hidden sm:block" />{" "}
              <span className="text-accent">moving.</span>
            </h1>
            <p className="mx-auto mt-6 max-w-xl text-base leading-relaxed text-muted sm:text-lg">
              {brand.description} A shared workspace that makes the next step
              clear.
            </p>
            <div className="mt-8 flex flex-wrap justify-center gap-3">
              <Link href="/register" className="btn btn-primary">
                Create your workspace
                <ArrowRight size={17} />
              </Link>
              <a href="#workspace-preview" className="btn btn-secondary">
                Explore the workspace
              </a>
            </div>
            <p className="mt-5 text-xs text-muted">
              One place for your team to plan, focus, and finish.
            </p>
          </div>
          <figure id="workspace-preview" className="mt-12 scroll-mt-6 md:mt-16">
            <div className="product-preview overflow-hidden rounded-xl border border-line bg-white">
              <div className="flex items-center justify-between gap-4 bg-dark-product px-5 py-3.5 text-dark-text">
                <span className="flex items-center gap-2 text-sm font-semibold">
                  <Layers2 size={17} />
                  Taskora workspace
                </span>
                <span className="text-[11px] opacity-80">Example project</span>
              </div>
              <div className="grid md:grid-cols-[170px_minmax(0,1fr)]">
                <div className="hidden border-r border-line p-4 md:block">
                  <p className="eyebrow mt-2 mb-5 px-2">Workspace</p>
                  <div className="nav-link">
                    <LayoutDashboard size={16} />
                    Dashboard
                  </div>
                  <div className="nav-link active">
                    <FolderKanban size={16} />
                    Projects
                  </div>
                  <div className="nav-link">
                    <CheckCheck size={16} />
                    My Tasks
                  </div>
                  <div className="mt-14 border-t border-line px-2 pt-5">
                    <p className="text-xs font-semibold">Website launch</p>
                    <p className="mt-2 text-[11px] text-muted">
                      A shared plan, in motion.
                    </p>
                  </div>
                </div>
                <div className="min-w-0 bg-canvas p-4 sm:p-6">
                  <div className="flex flex-wrap items-center justify-between gap-4">
                    <div>
                      <p className="eyebrow mb-2">Project workspace</p>
                      <h2 className="text-xl tracking-tight sm:text-2xl">
                        Website launch
                      </h2>
                      <p className="mt-2 flex items-center gap-2 text-xs text-muted">
                        <Users size={14} />3 members<span>·</span>5 tasks
                      </p>
                    </div>
                    <div className="w-36">
                      <div className="mb-2 flex justify-between text-xs">
                        <span className="text-muted">Progress</span>
                        <span className="font-semibold">40%</span>
                      </div>
                      <div className="progress-track">
                        <div className="progress-fill w-2/5" />
                      </div>
                      <p className="mt-2 text-[11px] text-muted">
                        2 of 5 tasks complete
                      </p>
                    </div>
                  </div>
                  <div className="mt-5 mb-5 flex gap-6 border-b border-line text-xs">
                    <span className="pb-3 text-muted">Overview</span>
                    <span className="border-b-2 border-accent pb-3 font-semibold text-accent">
                      Tasks
                    </span>
                    <span className="pb-3 text-muted">Members</span>
                  </div>
                  <div className="grid gap-3 sm:grid-cols-3">
                    {previewColumns.map((column, index) => (
                      <div
                        key={column.label}
                        className="min-w-0 rounded-lg bg-surface-muted p-3"
                      >
                        <div className="mb-3 flex items-center justify-between gap-2">
                          <span
                            className={`badge badge-${statuses[index].value}`}
                          >
                            {column.label}
                          </span>
                          <span className="text-xs text-muted">
                            {column.tasks.length}
                          </span>
                        </div>
                        <div className="space-y-3">
                          {column.tasks.map((task) => (
                            <div
                              key={task}
                              className="rounded-lg border border-line bg-white p-4"
                            >
                              <p className="text-xs leading-relaxed font-semibold">
                                {task}
                              </p>
                              <div className="mt-5 flex items-center justify-between border-t border-line pt-3">
                                <span className="text-[10px] text-muted">
                                  {index === 2
                                    ? "Completed"
                                    : "Assigned to team"}
                                </span>
                                {index === 2 ? (
                                  <Check size={14} className="text-success" />
                                ) : (
                                  <span className="flex -space-x-1">
                                    <span className="preview-avatar">A</span>
                                    <span className="preview-avatar">R</span>
                                  </span>
                                )}
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
            <figcaption className="mt-4 text-center text-xs text-muted">
              Your projects, tasks, and people — connected in one workspace.
            </figcaption>
          </figure>
        </section>
        <section className="mx-auto max-w-7xl px-5 pb-16 md:px-10">
          <div className="mb-8 flex flex-col justify-between gap-3 md:flex-row md:items-center">
            <h2 className="text-2xl tracking-tight">
              From a shared plan to work done.
            </h2>
            <p className="max-w-sm text-sm leading-relaxed text-muted">
              The essentials for a team that wants to spend more time doing.
            </p>
          </div>
          <div className="grid gap-5 md:grid-cols-3">
            {values.map((value) => (
              <article key={value.number} className="card p-6">
                <span className="mb-5 inline-flex h-8 w-8 items-center justify-center rounded-md bg-canvas text-xs font-semibold text-muted">
                  {value.number}
                </span>
                <h3 className="text-base">{value.title}</h3>
                <p className="mt-3 text-sm leading-relaxed text-muted">
                  {value.description}
                </p>
              </article>
            ))}
          </div>
        </section>
        <section className="border-y border-line bg-white">
          <div className="mx-auto flex max-w-7xl flex-col items-start justify-between gap-6 px-5 py-10 md:flex-row md:items-center md:px-10">
            <div>
              <h2 className="text-2xl tracking-tight">
                What will your team work on next?
              </h2>
              <p className="mt-2 text-sm text-muted">
                Give it a project. Give everyone a clear next step.
              </p>
            </div>
            <Link href="/register" className="btn btn-primary">
              Get Started
              <ArrowRight size={17} />
            </Link>
          </div>
        </section>
      </main>
      <footer className="mx-auto flex max-w-7xl flex-col justify-between gap-4 px-5 py-7 sm:flex-row md:px-10">
        <Brand />
        <p className="self-start text-xs text-muted sm:self-center">
          {brand.tagline}
        </p>
      </footer>
    </>
  );
}
