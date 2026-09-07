import Link from "next/link";
import {
  ArrowUpRight,
  ArrowRight,
  Check,
  Circle,
  Layers2,
  Users,
  LayoutGrid,
} from "lucide-react";
import { Brand } from "@/components/shared/Brand";
import { brand } from "@data/brand";
import { values, previewColumns } from "@data/marketing";

export default function Landing() {
  return (
    <>
      <header className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-5 py-6 md:px-10">
        <Brand />
        <nav className="flex items-center gap-3 sm:gap-6" aria-label="Main">
          <Link href="/login" className="text-sm font-medium">
            Sign In
          </Link>
          <Link href="/register" className="btn btn-primary">
            Get Started
            <ArrowUpRight size={16} />
          </Link>
        </nav>
      </header>
      <main id="main">
        <section className="mx-auto grid max-w-7xl items-center gap-12 px-5 pt-14 pb-20 md:px-10 lg:grid-cols-[1.05fr_1fr] lg:gap-16 lg:pt-24 lg:pb-28">
          <div>
            <div className="eyebrow mb-7 flex items-center gap-3">
              <span className="h-px w-8 bg-accent" />
              Less noise. More momentum.
            </div>
            <h1 className="hero-title">
              Keep every
              <br />
              project <span className="text-accent italic">moving.</span>
            </h1>
            <p className="mt-7 max-w-md text-lg leading-relaxed text-muted">
              {brand.description} A little more clarity. A lot more forward.
            </p>
            <div className="mt-9 flex flex-wrap items-center gap-6">
              <Link href="/register" className="btn btn-primary">
                Create your workspace
                <ArrowRight size={17} />
              </Link>
              <a
                href="#how-it-works"
                className="inline-flex min-h-11 items-center gap-2 text-sm font-medium"
              >
                Take a closer look
                <ArrowUpRight size={16} />
              </a>
            </div>
            <p className="mt-7 flex items-center gap-2 text-xs text-muted">
              <Check size={14} className="text-accent" />A focused space for you
              and your team.
            </p>
          </div>
          <div className="relative rounded-2xl border border-line bg-[#ebe8e2] p-4 sm:p-7">
            <div className="card overflow-hidden shadow-xl shadow-black/5">
              <div className="flex items-center justify-between border-b border-line px-5 py-4">
                <span className="flex items-center gap-2 text-xs font-semibold">
                  <Layers2 size={16} className="text-accent" />
                  Taskora workspace
                </span>
                <span className="text-[10px] text-muted">Product preview</span>
              </div>
              <div className="p-5 sm:p-6">
                <div className="eyebrow mb-3">A shared plan</div>
                <h2 className="text-xl tracking-tight">Website launch</h2>
                <p className="mt-2 text-xs text-muted">
                  Good work starts with a clear direction.
                </p>
                <div className="mt-5 mb-6 flex items-center justify-between border-b border-line pb-4">
                  <span className="flex items-center gap-2 text-xs text-muted">
                    <Users size={14} />
                    Your project team
                  </span>
                  <span className="badge badge-IN_PROGRESS">In progress</span>
                </div>
                <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
                  {previewColumns.map((column, index) => (
                    <div
                      key={column.label}
                      className="rounded-lg bg-canvas p-2.5"
                    >
                      <div className="mb-3 flex items-center gap-1.5 text-[10px] font-semibold">
                        <span
                          className={`h-1.5 w-1.5 rounded-full ${index === 2 ? "bg-[#47725a]" : index === 1 ? "bg-[#b98a3e]" : "bg-[#98958f]"}`}
                        />
                        {column.label}
                        <span className="ml-auto text-muted">
                          {column.tasks.length}
                        </span>
                      </div>
                      {column.tasks.map((task) => (
                        <div
                          key={task}
                          className="mb-2 rounded-md border border-line bg-white px-3 py-4 text-[11px] leading-relaxed"
                        >
                          <span className="mb-3 block h-1 w-7 rounded bg-[#dfc1c9]" />
                          {task}
                          <div className="mt-4 flex items-center justify-between">
                            <Circle size={10} className="text-muted" />
                            <span className="h-4 w-4 rounded-full bg-[#e8e5df]" />
                          </div>
                        </div>
                      ))}
                    </div>
                  ))}
                </div>
              </div>
            </div>
            <p className="mt-5 text-center text-[11px] tracking-wide text-muted">
              ONE PROJECT. ONE TEAM. A CLEAR WAY FORWARD.
            </p>
          </div>
        </section>
        <section id="how-it-works" className="border-y border-line bg-white">
          <div className="mx-auto max-w-7xl px-5 py-16 md:px-10 md:py-20">
            <div className="flex flex-col justify-between gap-4 md:flex-row md:items-end">
              <div>
                <p className="eyebrow mb-4">Built around the work</p>
                <h2 className="text-3xl tracking-tight md:text-4xl">
                  Everything you need.
                  <br />
                  Room to focus.
                </h2>
              </div>
              <p className="max-w-sm leading-relaxed text-muted">
                From the first idea to the last task, keep your team aligned
                without adding more to their plate.
              </p>
            </div>
            <div className="mt-12 grid gap-8 md:grid-cols-3">
              {values.map((value) => (
                <article
                  key={value.number}
                  className="border-t border-line pt-6"
                >
                  <span className="text-xs text-accent">/ {value.number}</span>
                  <h3 className="mt-5 mb-3 text-lg">{value.title}</h3>
                  <p className="max-w-sm leading-relaxed text-muted">
                    {value.description}
                  </p>
                </article>
              ))}
            </div>
          </div>
        </section>
        <section className="mx-auto max-w-7xl px-5 py-16 md:px-10">
          <div className="flex flex-col items-start justify-between gap-8 rounded-2xl bg-[#2b2928] px-8 py-12 text-white md:flex-row md:items-center md:px-12">
            <div>
              <LayoutGrid size={24} className="mb-5 text-[#d3a7b3]" />
              <h2 className="text-3xl tracking-tight">
                Make space for your next project.
              </h2>
              <p className="mt-3 text-[#bbb6b2]">
                Bring the plan, the people, and the progress together.
              </p>
            </div>
            <Link href="/register" className="btn bg-white text-ink">
              Get Started
              <ArrowUpRight size={17} />
            </Link>
          </div>
        </section>
      </main>
      <footer className="mx-auto flex max-w-7xl flex-col justify-between gap-4 border-t border-line px-5 py-7 sm:flex-row md:px-10">
        <Brand />
        <p className="self-start text-xs text-muted sm:self-center">
          {brand.tagline}
        </p>
      </footer>
    </>
  );
}
