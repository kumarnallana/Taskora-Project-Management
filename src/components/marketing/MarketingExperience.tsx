"use client";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { ArrowRight, ArrowUpRight, Check, Layers2 } from "lucide-react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useReducedMotion } from "framer-motion";
import { Brand } from "@/components/shared/Brand";
import { MarketingSmoothScroll } from "@/components/scroll/MarketingSmoothScroll";
import { brand } from "@data/brand";

const steps = [
  {
    number: "01",
    label: "Plan",
    title: "Give the work a clear home.",
    text: "Shape the project, define the outcome, and make the next step visible.",
    state: "Project brief ready",
  },
  {
    number: "02",
    label: "Assign",
    title: "Connect people to progress.",
    text: "Bring in the right teammates and give every task a clear owner.",
    state: "3 teammates connected",
  },
  {
    number: "03",
    label: "Deliver",
    title: "See momentum build.",
    text: "Move work forward and watch completed tasks become project progress.",
    state: "60% delivered",
  },
];
function WorkspaceTaskCard({
  status,
  title,
  desc,
  tag,
  assignee,
  priority,
  isCompleted,
  isFocal,
}: {
  status: "TODO" | "IN_PROGRESS" | "DONE";
  title: string;
  desc: string;
  tag: string;
  assignee?: { initials: string; name: string };
  priority?: string;
  isCompleted?: boolean;
  isFocal?: boolean;
}) {
  return (
    <div
      className={`group relative rounded-xl border p-4 shadow-xs transition-all duration-200 hover:-translate-y-0.5 hover:shadow-md cursor-default ${
        isFocal
          ? "border-amber/40 bg-white ring-1 ring-amber/20 hover:border-amber/60 hover:ring-amber/30"
          : isCompleted
          ? "border-line/70 bg-surface/80 opacity-95 hover:border-line hover:bg-white"
          : "border-line bg-white hover:border-line-strong"
      }`}
    >
      <div className="flex items-center justify-between gap-2 mb-2">
        <span
          className={`badge ${
            status === "DONE"
              ? "badge-DONE"
              : status === "IN_PROGRESS"
              ? "badge-IN_PROGRESS"
              : "badge-TODO"
          }`}
        >
          {status === "DONE"
            ? "Completed"
            : status === "IN_PROGRESS"
            ? "In Progress"
            : "To Do"}
        </span>
        <span className="text-[11px] font-medium text-muted/70">{tag}</span>
      </div>

      <h4 className="text-[13px] sm:text-sm font-semibold text-ink leading-snug">
        {title}
      </h4>
      <p className="mt-1 text-[11px] sm:text-xs text-muted leading-relaxed line-clamp-2">
        {desc}
      </p>

      <div className="mt-3 pt-2.5 flex items-center justify-between border-t border-line/60 text-xs">
        {assignee ? (
          <div className="flex items-center gap-1.5 min-h-[24px]">
            <div
              className={`h-5 w-5 rounded-full font-bold text-[9px] flex items-center justify-center shadow-xs ${
                isFocal
                  ? "bg-accent text-white"
                  : "bg-surface-muted text-muted border border-line"
              }`}
            >
              {assignee.initials}
            </div>
            <span
              className={`text-[11px] font-medium ${
                isFocal ? "text-ink font-semibold" : "text-muted"
              }`}
            >
              {assignee.name}
            </span>
          </div>
        ) : (
          <span className="text-[11px] font-normal text-muted/70 flex items-center gap-1.5 min-h-[24px]">
            <span className="h-1.5 w-1.5 rounded-full bg-line-strong" />
            Unassigned
          </span>
        )}

        {isCompleted ? (
          <span className="flex items-center gap-1 text-[11px] font-semibold text-success">
            <Check size={13} strokeWidth={2.5} />
            Delivered
          </span>
        ) : priority ? (
          <span className="text-[11px] font-semibold text-amber">{priority}</span>
        ) : null}
      </div>
    </div>
  );
}

function ProductWorkspacePreview() {
  const [mobileColumn, setMobileColumn] = useState<"TODO" | "IN_PROGRESS" | "DONE">("IN_PROGRESS");

  return (
    <div className="product-preview overflow-hidden rounded-[1.75rem] border border-line bg-white shadow-2xl">
      {/* Window Chrome Header */}
      <div className="flex items-center justify-between border-b border-line bg-surface-muted/50 px-4 py-2.5 text-xs">
        <div className="flex items-center gap-2">
          <div className="flex gap-1.5">
            <span className="h-2 w-2 rounded-full bg-line-strong/80" />
            <span className="h-2 w-2 rounded-full bg-line-strong/80" />
            <span className="h-2 w-2 rounded-full bg-line-strong/80" />
          </div>
          <span className="ml-1.5 font-semibold text-ink/80">Taskora Workspace</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="inline-flex items-center gap-1 rounded-full bg-accent-soft px-2.5 py-0.5 text-[11px] font-semibold text-accent">
            Sprint 3
          </span>
          <span className="hidden sm:inline text-muted font-medium">Website launch</span>
        </div>
      </div>

      {/* Project Meta Bar */}
      <div className="border-b border-line/70 bg-white px-5 py-4 sm:px-6 sm:py-5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3.5">
            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-accent-soft text-accent shrink-0 shadow-xs">
              <Layers2 size={22} />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-base sm:text-lg font-bold tracking-tight text-ink">Website Launch</h2>
                <span className="badge badge-TODO !text-[10px] !py-0.5 !px-2">Sprint</span>
              </div>
              <div className="mt-0.5 flex flex-wrap items-center gap-2.5 text-xs text-muted">
                <span>3 members · 5 tasks</span>
                <span className="h-1 w-1 rounded-full bg-line-strong" />
                <div className="flex items-center -space-x-1.5">
                  <div
                    className="h-5 w-5 rounded-full bg-accent text-white flex items-center justify-center text-[9px] font-bold border-2 border-white shadow-xs"
                    title="Alex Rivera"
                  >
                    AR
                  </div>
                  <div
                    className="h-5 w-5 rounded-full bg-ink text-white flex items-center justify-center text-[9px] font-bold border-2 border-white shadow-xs"
                    title="Sasi Kumar"
                  >
                    SK
                  </div>
                  <div
                    className="h-5 w-5 rounded-full bg-surface-muted text-muted flex items-center justify-center text-[9px] font-bold border-2 border-white shadow-xs"
                    title="+2 members"
                  >
                    +2
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Progress Tracking Widget (Stable 60%) */}
          <div className="w-full sm:w-52 shrink-0">
            <div className="mb-1.5 flex items-center justify-between text-[11px] font-bold tracking-wider uppercase">
              <span className="text-muted">Progress</span>
              <span className="font-bold text-accent">60%</span>
            </div>
            <div className="h-2 w-full overflow-hidden rounded-full bg-surface-muted border border-line/50">
              <div className="h-full bg-accent rounded-full" style={{ width: "60%" }} />
            </div>
          </div>
        </div>
      </div>

      {/* Mobile Column Tabs (< 640px) */}
      <div className="sm:hidden flex border-b border-line bg-surface-muted/30 p-1.5 gap-1 text-xs">
        {(["TODO", "IN_PROGRESS", "DONE"] as const).map((col) => {
          const label = col === "TODO" ? "To Do" : col === "IN_PROGRESS" ? "In Progress" : "Done";
          const count = col === "TODO" ? 1 : 2;
          const isActive = mobileColumn === col;
          return (
            <button
              key={col}
              type="button"
              onClick={() => setMobileColumn(col)}
              className={`flex-1 py-1.5 px-2 text-center font-semibold rounded-lg text-[11px] transition-colors duration-150 flex items-center justify-center gap-1.5 ${
                isActive
                  ? "bg-white text-ink shadow-xs border border-line"
                  : "text-muted hover:text-ink"
              }`}
            >
              <span>{label}</span>
              <span className="text-[10px] opacity-70">({count})</span>
            </button>
          );
        })}
      </div>

      {/* Mobile Single Column Content */}
      <div className="sm:hidden p-4 bg-canvas/40 min-h-[290px] flex flex-col gap-3">
        {mobileColumn === "TODO" && (
          <WorkspaceTaskCard
            status="TODO"
            title="Release notes v1.2"
            desc="Compile change summary for the upcoming launch."
            tag="Docs"
          />
        )}
        {mobileColumn === "IN_PROGRESS" && (
          <>
            <WorkspaceTaskCard
              status="IN_PROGRESS"
              title="Build project workspace"
              desc="Configure boards, permission tiers, and team milestone tracking."
              tag="Core"
              assignee={{ initials: "AR", name: "Alex Rivera" }}
              priority="P1"
              isFocal
            />
            <WorkspaceTaskCard
              status="IN_PROGRESS"
              title="Design hero system"
              desc="Finalize visual tokens and responsive layout."
              tag="Design"
              assignee={{ initials: "SK", name: "Sasi" }}
            />
          </>
        )}
        {mobileColumn === "DONE" && (
          <>
            <WorkspaceTaskCard
              status="DONE"
              title="User flow audit"
              desc="All 5 core activation paths verified."
              tag="QA"
              assignee={{ initials: "JL", name: "Jess" }}
              isCompleted
            />
            <WorkspaceTaskCard
              status="DONE"
              title="Define brand tokens"
              desc="Approved color system and spacing scale."
              tag="Design"
              assignee={{ initials: "AR", name: "Alex" }}
              isCompleted
            />
          </>
        )}
      </div>

      {/* Desktop / Tablet 3-Column Board (>= 640px) */}
      <div className="hidden sm:grid sm:grid-cols-3 gap-4 p-5 sm:p-6 bg-canvas/40 min-h-[380px]">
        {/* Column 1: TO DO */}
        <div className="flex flex-col gap-3">
          <h3 className="flex items-center gap-2 text-[11px] font-bold tracking-widest text-muted uppercase">
            <span>To Do</span>
            <span className="flex h-5 min-w-[20px] items-center justify-center rounded-full bg-surface text-ink px-1.5 opacity-70 border border-line/60">
              1
            </span>
          </h3>
          <WorkspaceTaskCard
            status="TODO"
            title="Release notes v1.2"
            desc="Compile change summary for the upcoming launch."
            tag="Docs"
          />
        </div>

        {/* Column 2: IN PROGRESS */}
        <div className="flex flex-col gap-3">
          <h3 className="flex items-center gap-2 text-[11px] font-bold tracking-widest text-muted uppercase">
            <span>In Progress</span>
            <span className="flex h-5 min-w-[20px] items-center justify-center rounded-full bg-surface text-ink px-1.5 opacity-70 border border-line/60">
              2
            </span>
          </h3>
          <WorkspaceTaskCard
            status="IN_PROGRESS"
            title="Build project workspace"
            desc="Configure boards, permission tiers, and team milestone tracking."
            tag="Core"
            assignee={{ initials: "AR", name: "Alex Rivera" }}
            priority="P1"
            isFocal
          />
          <WorkspaceTaskCard
            status="IN_PROGRESS"
            title="Design hero system"
            desc="Finalize visual tokens and responsive layout."
            tag="Design"
            assignee={{ initials: "SK", name: "Sasi" }}
          />
        </div>

        {/* Column 3: DONE */}
        <div className="flex flex-col gap-3">
          <h3 className="flex items-center gap-2 text-[11px] font-bold tracking-widest text-muted uppercase">
            <span>Done</span>
            <span className="flex h-5 min-w-[20px] items-center justify-center rounded-full bg-surface text-ink px-1.5 opacity-70 border border-line/60">
              2
            </span>
          </h3>
          <WorkspaceTaskCard
            status="DONE"
            title="User flow audit"
            desc="All 5 core activation paths verified."
            tag="QA"
            assignee={{ initials: "JL", name: "Jess" }}
            isCompleted
          />
          <WorkspaceTaskCard
            status="DONE"
            title="Define brand tokens"
            desc="Approved color system and spacing scale."
            tag="Design"
            assignee={{ initials: "AR", name: "Alex" }}
            isCompleted
          />
        </div>
      </div>
    </div>
  );
}

export function MarketingExperience() {
  const root = useRef<HTMLDivElement>(null);
  const [scrolled, setScrolled] = useState(false);
  const reduced = useReducedMotion();
  useEffect(() => {
    const update = () => setScrolled(window.scrollY > 24);
    update();
    window.addEventListener("scroll", update, { passive: true });
    return () => window.removeEventListener("scroll", update);
  }, []);
  useEffect(() => {
    if (!root.current || reduced) return;
    gsap.registerPlugin(ScrollTrigger);
    const context = gsap.context(() => {
      gsap.from("[data-story]", {
        scrollTrigger: { trigger: "[data-story-grid]", start: "top 82%" },
        opacity: 0,
        y: 26,
        duration: 0.55,
        stagger: 0.12,
        ease: "power3.out",
      });
      gsap.from("[data-final]", {
        scrollTrigger: { trigger: "[data-final]", start: "top 88%" },
        opacity: 0,
        y: 20,
        duration: 0.55,
        ease: "power3.out",
      });
      gsap.from("[data-footer-group]", {
        scrollTrigger: { trigger: "[data-final]", start: "top 88%" },
        opacity: 0,
        y: 15,
        duration: 0.5,
        stagger: 0.05,
        ease: "power3.out",
      });
    }, root);
    return () => context.revert();
  }, [reduced]);
  return (
    <MarketingSmoothScroll>
      <div ref={root}>
        <header
          className={`marketing-header sticky top-0 z-30 border-b px-5 py-4 md:px-10 ${scrolled ? "scrolled border-line" : "border-transparent bg-canvas"}`}
        >
          <div className="mx-auto flex max-w-7xl items-center justify-between">
            <Brand />
            <nav className="flex items-center gap-3 sm:gap-6" aria-label="Main">
              <a
                href="#story"
                className="hidden text-sm text-muted md:inline-flex"
              >
                How it works
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
          <section className="mx-auto grid max-w-7xl items-center gap-12 px-5 py-16 md:px-10 xl:grid-cols-[.8fr_1.2fr] lg:py-24">
            <div>
              <p data-hero className="eyebrow mb-5">
                Projects. People. Progress.
              </p>
              <h1 data-hero className="hero-title">
                Keep every project <span className="text-accent">moving.</span>
              </h1>
              <p
                data-hero
                className="mt-6 max-w-lg text-lg leading-relaxed text-muted"
              >
                {brand.description}
              </p>
              <div data-hero className="mt-10 flex flex-wrap gap-4 items-center">
                <Link href="/register" className="btn btn-primary min-h-[48px] px-6 text-sm shadow-sm hover:shadow-md transition-shadow">
                  Create your workspace
                  <ArrowRight size={17} />
                </Link>
                <a href="#story" className="btn btn-secondary min-h-[48px] px-6 text-sm">
                  See how it works
                </a>
              </div>
            </div>
            <div data-stage className="relative z-10 w-full">
              <ProductWorkspacePreview />
            </div>
          </section>
          <section
            id="story"
            className="border-y border-line bg-white px-5 py-20 md:px-10"
          >
            <div className="mx-auto max-w-7xl">
              <div className="max-w-xl">
                <p className="eyebrow mb-4">A clear path through the work</p>
                <h2 className="text-3xl tracking-tight md:text-4xl">
                  Plan. Assign. Deliver.
                </h2>
                <p className="mt-4 leading-relaxed text-muted">
                  Taskora turns a shared goal into visible progress without
                  adding process for its own sake.
                </p>
              </div>
              <div data-story-grid className="mt-10 grid gap-5 md:grid-cols-3">
                {steps.map((step, index) => (
                  <article
                    data-story
                    key={step.label}
                    className="surface-raised p-6"
                  >
                    <div className="mb-8 flex items-center justify-between">
                      <span className="eyebrow">
                        {step.number} · {step.label}
                      </span>
                      <span
                        className={`h-2.5 w-2.5 rounded-full ${index === 2 ? "bg-success" : index === 1 ? "bg-[#A56A18]" : "bg-accent"}`}
                      />
                    </div>
                    <div className="mb-5 rounded-xl bg-canvas p-4">
                      <div className="mb-3 h-2 w-2/3 rounded-full bg-line" />
                      <div className="h-2 rounded-full bg-line">
                        <div
                          className="h-full rounded-full bg-accent transition-all"
                          style={{ width: `${34 + index * 28}%` }}
                        />
                      </div>
                      <p className="mt-3 text-[11px] font-semibold text-muted">
                        {step.state}
                      </p>
                    </div>
                    <h3 className="text-lg">{step.title}</h3>
                    <p className="mt-3 text-sm leading-relaxed text-muted">
                      {step.text}
                    </p>
                  </article>
                ))}
              </div>
            </div>
          </section>
          <section data-final className="w-full bg-dark-product text-dark-text pt-20 pb-12 rounded-t-[2.5rem] px-5 md:px-10 mt-16 overflow-hidden">
            <div className="mx-auto max-w-7xl">
              <div className="flex flex-col items-start justify-between gap-6 md:flex-row md:items-center border-b border-white/10 pb-16">
                <div>
                  <p className="eyebrow mb-3 !text-white/60">Your next project</p>
                  <h2 className="text-3xl tracking-tight">
                    Give your team a clear way forward.
                  </h2>
                  <p className="mt-3 text-sm text-white/65">
                    Start with the plan. Taskora will help you keep it moving.
                  </p>
                </div>
                <Link href="/register" className="btn bg-white text-ink">
                  Get Started
                  <ArrowRight size={17} />
                </Link>
              </div>
              
              <footer className="pt-12">
                <div className="grid gap-10 md:grid-cols-[2fr_1fr_1fr_1.5fr] lg:gap-8 pb-12">
                  <div data-footer-group>
                    <div className="flex items-center gap-2 mb-4">
                      <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-accent text-white">
                        <Check size={18} strokeWidth={3} />
                      </div>
                      <span className="text-xl font-bold tracking-tight text-white">Taskora</span>
                    </div>
                    <p className="text-sm text-white/60 max-w-xs">{brand.description}</p>
                  </div>
                  <div data-footer-group>
                    <h4 className="font-semibold text-white mb-4">Product</h4>
                    <ul className="space-y-3 text-sm text-white/60">
                      <li><a href="#story" className="hover:text-white transition-colors">How it works</a></li>
                      <li><Link href="/dashboard" className="hover:text-white transition-colors">Workspace</Link></li>
                    </ul>
                  </div>
                  <div data-footer-group>
                    <h4 className="font-semibold text-white mb-4">Access</h4>
                    <ul className="space-y-3 text-sm text-white/60">
                      <li><Link href="/login" className="hover:text-white transition-colors">Sign in</Link></li>
                      <li><Link href="/register" className="hover:text-white transition-colors">Create workspace</Link></li>
                    </ul>
                  </div>
                  <div data-footer-group className="flex flex-col justify-end items-start md:items-end gap-3 pb-2">
                    <span className="text-xs font-semibold tracking-widest text-white/30 uppercase">Plan</span>
                    <span className="text-xs font-semibold tracking-widest text-white/30 uppercase">Assign</span>
                    <span className="text-xs font-semibold tracking-widest text-white/30 uppercase">Deliver</span>
                  </div>
                </div>
                <div data-footer-group className="flex flex-col sm:flex-row justify-between items-center gap-4 pt-6 border-t border-white/5 text-[11px] text-white/40">
                  <div className="flex items-center gap-2">
                    <span className="font-semibold text-white/60">Taskora</span>
                    <span>&copy; {new Date().getFullYear()}</span>
                  </div>
                  <span>{brand.tagline}</span>
                </div>
              </footer>
            </div>
          </section>
        </main>
      </div>
    </MarketingSmoothScroll>
  );
}
