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
    let visible = true;
    const observer = new IntersectionObserver(
      ([entry]) => (visible = entry.isIntersecting),
      { threshold: 0.2 },
    );
    if (root.current) observer.observe(root.current);
    const timer = window.setInterval(() => {
      if (visible && !document.hidden) setPhase((value) => (value + 1) % 3);
    }, 3200);
    return () => {
      observer.disconnect();
      window.clearInterval(timer);
    };
  }, [reduced]);
  const progress = [20, 40, 60][phase];
  return (
    <div
      ref={root}
      className="product-preview overflow-hidden rounded-2xl border border-line bg-white"
    >
      <div className="flex items-center justify-between bg-dark-product px-5 py-4 text-dark-text">
        <span className="flex items-center gap-2 text-sm font-semibold">
          <Layers2 size={17} />
          Launch workspace
        </span>
        <span className="flex items-center gap-2 text-[11px] opacity-75">
          <span className="h-1.5 w-1.5 rounded-full bg-[#72c5a0]" />
          Project active
        </span>
      </div>
      <div className="grid gap-4 p-4 sm:p-5 xl:grid-cols-[1fr_230px]">
        <div className="min-w-0">
          <div className="mb-4 flex items-end justify-between gap-4 border-b border-line pb-4">
            <div>
              <p className="eyebrow mb-2">Website launch</p>
              <h2 className="text-xl">Tasks in motion</h2>
            </div>
            <span className="flex -space-x-2">
              {["AK", "RM", "JL"].map((name, index) => (
                <span
                  key={name}
                  className={`avatar !border-2 !border-white transition-all ${index <= phase ? "!bg-brand-soft !text-accent" : ""}`}
                >
                  {name}
                </span>
              ))}
            </span>
          </div>
          <div className="grid gap-3 sm:grid-cols-3">
            {tasks.map((task, index) => {
              const status =
                index < phase
                  ? "DONE"
                  : index === phase
                    ? "IN_PROGRESS"
                    : "TODO";
              return (
                <div
                  key={task}
                  className={`task-card transition-all duration-500 ${status === "DONE" ? "completion-pulse" : ""}`}
                >
                  <span className={`badge badge-${status}`}>
                    {status === "DONE"
                      ? "Done"
                      : status === "IN_PROGRESS"
                        ? "In progress"
                        : "To do"}
                  </span>
                  <p className="mt-4 min-h-10 text-xs leading-relaxed font-semibold">
                    {task}
                  </p>
                  <div className="mt-4 flex items-center justify-between border-t border-line pt-3 text-[10px] text-muted">
                    <span>{status === "DONE" ? "Complete" : "Assigned"}</span>
                    {status === "DONE" ? (
                      <Check size={14} className="text-success" />
                    ) : (
                      <span className="avatar !h-6 !w-6 !text-[9px]">AK</span>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
        <div className="space-y-4">
          <ProjectConstellation />
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
            <p className="mt-3 flex items-center gap-2 text-[11px] text-muted">
              <Users size={13} />3 people moving one plan forward
            </p>
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
          <section className="mx-auto grid max-w-7xl items-center gap-12 px-5 py-16 md:px-10 lg:grid-cols-[.8fr_1.2fr] lg:py-24">
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
              <div data-hero className="mt-8 flex flex-wrap gap-3">
                <Link href="/register" className="btn btn-primary">
                  Create your workspace
                  <ArrowRight size={17} />
                </Link>
                <a href="#story" className="btn btn-secondary">
                  See how it works
                </a>
              </div>
              <div
                data-hero
                className="mt-8 grid max-w-md grid-cols-3 gap-3 text-xs"
              >
                <div>
                  <strong className="block text-base text-ink">1 place</strong>
                  <span className="text-muted">for every plan</span>
                </div>
                <div>
                  <strong className="block text-base text-ink">3 states</strong>
                  <span className="text-muted">from idea to done</span>
                </div>
                <div>
                  <strong className="block text-base text-ink">0 noise</strong>
                  <span className="text-muted">around the work</span>
                </div>
              </div>
            </div>
            <div data-stage>
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
          <section data-final className="mx-auto max-w-7xl px-5 py-16 md:px-10">
            <div className="flex flex-col items-start justify-between gap-6 rounded-2xl bg-dark-product p-8 text-dark-text md:flex-row md:items-center md:p-10">
              <div>
                <p className="eyebrow mb-3 !text-white/60">Your next project</p>
                <h2 className="text-2xl tracking-tight">
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
          </section>
        </main>
        <footer className="mx-auto flex max-w-7xl flex-col justify-between gap-4 border-t border-line px-5 py-7 sm:flex-row md:px-10">
          <Brand />
          <p className="self-start text-xs text-muted sm:self-center">
            {brand.tagline}
          </p>
        </footer>
      </div>
    </MarketingSmoothScroll>
  );
}
