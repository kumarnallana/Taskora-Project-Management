"use client";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { ArrowRight, ArrowUpRight, Check, Layers2, Users } from "lucide-react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useReducedMotion } from "framer-motion";
import { Brand } from "@/components/shared/Brand";
import { MarketingSmoothScroll } from "@/components/scroll/MarketingSmoothScroll";
import { ProjectConstellation } from "./three/ProjectConstellation";
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
const tasks = [
  "Gather launch feedback",
  "Build project workspace",
  "Prepare release notes",
];

function LivingPreview() {
  const [phase, setPhase] = useState(0);
  const reduced = useReducedMotion();
  const root = useRef<HTMLDivElement>(null);


  useEffect(() => {
    if (reduced) return;
    let timeoutId: number;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && phase === 0) {
          // Start the choreography once visible
          setPhase(1);
        }
      },
      { threshold: 0.5 },
    );
    if (root.current) observer.observe(root.current);

    return () => observer.disconnect();
  }, [reduced, phase]);

  useEffect(() => {
    if (reduced || phase === 0 || phase >= 5) return;
    
    const timings = [0, 1500, 1800, 2000, 1500];
    const timer = window.setTimeout(() => {
      setPhase((p) => Math.min(p + 1, 5));
    }, timings[phase]);

    return () => window.clearTimeout(timer);
  }, [phase, reduced]);

  const progress = phase >= 5 ? 60 : phase >= 3 ? 40 : 20;
  return (
    <div
      ref={root}
      className="product-preview overflow-hidden rounded-2xl border border-line bg-white shadow-2xl"
    >
      <div className="flex items-center justify-between bg-dark-product px-5 py-4 text-dark-text border-b border-white/5 shadow-sm">
        <span className="flex items-center gap-2 text-[13px] font-semibold tracking-wide">
          <Layers2 size={16} className="text-accent" />
          Taskora Workspace
        </span>
        <div className="flex items-center gap-4">
          <span className="hidden sm:flex items-center gap-2 text-[11px] font-medium opacity-60">
            Design Handoff
          </span>
          <span className="flex items-center gap-2 text-[11px] font-medium opacity-90">
            <span className="h-1.5 w-1.5 rounded-full bg-success shadow-[0_0_8px_rgba(23,107,104,0.8)]" />
            Active
          </span>
        </div>
      </div>
      <div className="grid gap-6 p-5 sm:p-7 xl:grid-cols-[1fr_240px] bg-canvas/30">
        <div className="min-w-0 flex flex-col">
          <div className="mb-6 flex items-end justify-between gap-4 border-b border-line pb-5">
            <div>
              <p className="eyebrow mb-2">Website launch</p>
              <h2 className="text-xl font-semibold tracking-tight text-ink">Tasks in motion</h2>
            </div>
            <span className="flex -space-x-2">
              {["AK", "RM", "JL"].map((name, index) => (
                <span
                  key={name}
                  className={`avatar !h-8 !w-8 !border-2 !border-white transition-colors duration-500 ${phase >= 2 && index === 0 ? "!bg-accent-soft !text-accent shadow-sm z-10" : "z-0"}`}
                >
                  {name}
                </span>
              ))}
            </span>
          </div>
          <div className="grid gap-4 sm:grid-cols-3">
            {tasks.map((task, index) => {
              let status = "DONE";
              let showAssignee = true;
              
              if (index === 1) {
                status = phase >= 4 ? "DONE" : phase >= 3 ? "IN_PROGRESS" : "TODO";
                showAssignee = phase >= 2;
              } else if (index === 2) {
                status = "TODO";
                showAssignee = false;
              }

              return (
                <div
                  key={task}
                  className={`task-card transition-all duration-700 shadow-sm flex flex-col ${
                    index === 1 && phase === 1 ? "ring-2 ring-accent ring-offset-2 ring-offset-canvas scale-[1.02]" : ""
                  } ${status === "DONE" && index === 1 && phase === 4 ? "completion-pulse bg-success-soft/20 border-success/30" : "bg-white"}`}
                  style={{ opacity: index === 1 && phase === 0 ? 0 : 1, transform: index === 1 && phase === 0 ? "translateY(10px)" : "translateY(0)" }}
                >
                  <span className={`badge badge-${status} w-fit transition-colors duration-500`}>
                    {status === "DONE"
                      ? "Done"
                      : status === "IN_PROGRESS"
                        ? "In progress"
                        : "To do"}
                  </span>
                  <p className="mt-4 mb-4 flex-1 text-[13px] leading-relaxed font-semibold text-ink">
                    {task}
                  </p>
                  <div className="mt-auto flex items-center justify-between border-t border-line pt-3 text-[11px] font-medium text-muted">
                    <span>{status === "DONE" ? "Complete" : showAssignee ? "Assigned" : "Unassigned"}</span>
                    {status === "DONE" ? (
                      <Check size={16} className="text-success" />
                    ) : showAssignee ? (
                      <span className="avatar !h-6 !w-6 !text-[9px] !bg-accent-soft !text-accent">AK</span>
                    ) : (
                      <span className="h-6 w-6 rounded-full border border-dashed border-line flex items-center justify-center text-line-strong">+</span>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
        <div className="space-y-4">
          <ProjectConstellation phase={phase} />
          <div className="rounded-xl bg-surface-muted p-4">
            <div className="mb-2 flex justify-between text-xs">
              <span className="text-muted">Project progress</span>
              <span className="font-semibold">{progress}%</span>
            </div>
            <div className="progress-track !h-2">
              <div
                className="progress-fill"
                style={{ width: `${progress}%` }}
              />
            </div>
          </div>
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
      gsap
        .timeline()
        .from("[data-hero]", {
          opacity: 0,
          y: 22,
          duration: 0.65,
          stagger: 0.1,
          ease: "power3.out",
        })
        .from(
          "[data-stage]",
          { opacity: 0, y: 28, duration: 0.65, ease: "power3.out" },
          "-=.25",
        );
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
              <LivingPreview />
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
