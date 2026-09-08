"use client";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { ArrowRight, ArrowUpRight, Check, Layers2, Users } from "lucide-react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useReducedMotion } from "framer-motion";
import { Brand } from "@/components/shared/Brand";
import { MarketingSmoothScroll } from "@/components/scroll/MarketingSmoothScroll";
import { motion, AnimatePresence } from "framer-motion";
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
function LivingPreview() {
  const [phase, setPhase] = useState(0);
  const reduced = useReducedMotion();
  const root = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (reduced) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && phase === 0) setPhase(1);
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

  const TaskCard = () => {
    const isDone = phase >= 4;
    const isDoing = phase === 3;
    
    return (
      <motion.div
        layoutId="marketing-task"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ type: "spring", bounce: 0, duration: 0.6 }}
        className={`relative rounded-xl border p-5 shadow-sm transition-colors duration-500 ${
          isDone ? "bg-success-soft/30 border-success/30" : "bg-white border-line shadow-md"
        }`}
      >
        <div className="flex justify-between items-start mb-4">
          <span className={`badge ${isDone ? "badge-success" : isDoing ? "badge-amber" : "badge-TODO"}`}>
            {isDone ? "Complete" : isDoing ? "In Progress" : "To do"}
          </span>
          <AnimatePresence>
            {phase >= 2 && (
              <motion.div
                layoutId="marketing-avatar"
                initial={{ scale: 0, opacity: 0, rotate: -45 }}
                animate={{ scale: 1, opacity: 1, rotate: 0 }}
                transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                className="avatar !h-8 !w-8 !text-[11px] font-bold !bg-accent !text-white ring-4 ring-white shadow-sm"
              >
                AK
              </motion.div>
            )}
          </AnimatePresence>
        </div>
        <h4 className="text-[15px] font-semibold text-ink leading-snug mb-1">
          Prepare launch assets
        </h4>
        <p className="text-[13px] text-muted leading-relaxed line-clamp-2">
          Compile all final marketing materials, including screenshots and social copy.
        </p>
        <div className="mt-5 pt-4 flex items-center justify-between border-t border-line border-dashed text-[12px] font-medium text-muted">
          <span>{isDone ? "Delivered" : phase >= 2 ? "Assigned to Alex" : "Unassigned"}</span>
          {isDone && (
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: "spring", bounce: 0.4 }}
            >
              <Check size={16} className="text-success" strokeWidth={3} />
            </motion.div>
          )}
        </div>
      </motion.div>
    );
  };

  return (
    <div
      ref={root}
      className="product-preview overflow-hidden rounded-[2rem] border border-line bg-white shadow-2xl"
    >
      <div className="px-6 py-5 sm:px-8 sm:py-6 border-b border-line/60 bg-white flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-accent-soft text-accent shadow-sm">
            <Layers2 size={24} />
          </div>
          <div>
            <h2 className="text-base font-bold tracking-tight text-ink">Website Launch</h2>
            <p className="mt-0.5 flex items-center gap-2 text-[12px] font-medium text-muted">
              <Users size={14} className="opacity-70" />
              <span>3 Members</span>
              <span className="h-1 w-1 rounded-full bg-line-strong" />
              <span>1 Active Task</span>
            </p>
          </div>
        </div>
        <div className="w-full sm:w-56">
          <div className="mb-2 flex justify-between text-[11px] font-bold tracking-wider uppercase text-muted">
            <span>Progress</span>
            <span className={`transition-colors duration-500 ${phase >= 4 ? "text-success" : ""}`}>
              {phase >= 4 ? "100%" : phase >= 3 ? "50%" : "0%"}
            </span>
          </div>
          <div className="h-2 w-full overflow-hidden rounded-full bg-surface">
            <motion.div
              className="h-full bg-success"
              initial={{ width: "0%" }}
              animate={{ width: phase >= 4 ? "100%" : phase >= 3 ? "50%" : "0%" }}
              transition={{ type: "spring", bounce: 0, duration: 1 }}
            />
          </div>
        </div>
      </div>
      <div className="grid gap-6 p-6 sm:p-8 sm:grid-cols-3 bg-canvas/40 min-h-[380px]">
        {/* To Do Column */}
        <div className="flex flex-col gap-4">
          <h3 className="flex items-center gap-2 text-[11px] font-bold tracking-widest text-muted uppercase">
            To Do 
            <span className="flex h-5 min-w-[20px] items-center justify-center rounded-full bg-surface text-ink px-1.5 opacity-60">
              {phase < 3 ? "1" : "0"}
            </span>
          </h3>
          {phase > 0 && phase < 3 && <TaskCard />}
        </div>
        
        {/* In Progress Column */}
        <div className="flex flex-col gap-4">
          <h3 className="flex items-center gap-2 text-[11px] font-bold tracking-widest text-muted uppercase">
            In Progress 
            <span className="flex h-5 min-w-[20px] items-center justify-center rounded-full bg-surface text-ink px-1.5 opacity-60">
              {phase === 3 ? "1" : "0"}
            </span>
          </h3>
          {phase === 3 && <TaskCard />}
        </div>

        {/* Done Column */}
        <div className="flex flex-col gap-4">
          <h3 className="flex items-center gap-2 text-[11px] font-bold tracking-widest text-muted uppercase">
            Done 
            <span className="flex h-5 min-w-[20px] items-center justify-center rounded-full bg-surface text-ink px-1.5 opacity-60">
              {phase >= 4 ? "1" : "0"}
            </span>
          </h3>
          {phase >= 4 && <TaskCard />}
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
