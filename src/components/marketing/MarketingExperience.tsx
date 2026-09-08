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
import { Database, Cpu, LayoutDashboard, BarChart3 } from "lucide-react";

function DataPipelinePreview() {
  const reduced = useReducedMotion();

  return (
    <div className="product-preview relative overflow-hidden rounded-[2rem] border border-line bg-dark-product shadow-2xl min-h-[460px]">
      
      {/* Background Grid */}
      <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.03)_1px,transparent_1px)] bg-[size:40px_40px]" />

      {!reduced && (
        <style dangerouslySetInnerHTML={{ __html: `
          @keyframes pulseLine1 {
            0%, 100% { stroke: rgba(255,255,255,0.05); }
            10%, 25% { stroke: rgba(23,107,104,0.5); }
          }
          @keyframes pulseLine2 {
            0%, 100% { stroke: rgba(255,255,255,0.05); }
            40%, 60% { stroke: rgba(23,107,104,0.5); }
          }
          @keyframes movePacket1 {
            0% { left: 15%; top: 50%; opacity: 0; transform: scale(0.5); }
            5% { opacity: 1; transform: scale(1); }
            25% { left: 50%; top: 50%; opacity: 1; transform: scale(1); }
            26%, 100% { opacity: 0; transform: scale(0.5); }
          }
          @keyframes movePacket2 {
            0%, 37% { left: 50%; top: 50%; opacity: 0; transform: scale(0.5); }
            38% { opacity: 1; transform: scale(1); }
            62% { left: 85%; top: 25%; opacity: 1; transform: scale(1); }
            63%, 100% { opacity: 0; transform: scale(0.5); }
          }
          @keyframes movePacket3 {
            0%, 37% { left: 50%; top: 50%; opacity: 0; transform: scale(0.5); }
            38% { opacity: 1; transform: scale(1); }
            62% { left: 85%; top: 75%; opacity: 1; transform: scale(1); }
            63%, 100% { opacity: 0; transform: scale(0.5); }
          }
          @keyframes nodeProcessor {
            0%, 25%, 100% { box-shadow: 0 0 0px transparent; border-color: rgba(255,255,255,0.05); background-color: rgba(255,255,255,0.02); }
            30%, 40% { box-shadow: 0 0 30px rgba(23,107,104,0.3); border-color: rgba(23,107,104,0.6); background-color: rgba(23,107,104,0.1); }
          }
          @keyframes nodeDest {
            0%, 62%, 100% { box-shadow: 0 0 0px transparent; border-color: rgba(255,255,255,0.05); background-color: rgba(255,255,255,0.02); }
            66%, 76% { box-shadow: 0 0 25px rgba(23,107,104,0.2); border-color: rgba(23,107,104,0.4); background-color: rgba(23,107,104,0.05); }
          }
        `}} />
      )}

      {/* SVG Connecting Lines */}
      <svg className="absolute inset-0 w-full h-full pointer-events-none" preserveAspectRatio="none">
        <line x1="15%" y1="50%" x2="50%" y2="50%" stroke="rgba(255,255,255,0.05)" strokeWidth="2" strokeDasharray="4 4" style={{ animation: reduced ? 'none' : 'pulseLine1 4s infinite' }} />
        <line x1="50%" y1="50%" x2="85%" y2="25%" stroke="rgba(255,255,255,0.05)" strokeWidth="2" strokeDasharray="4 4" style={{ animation: reduced ? 'none' : 'pulseLine2 4s infinite' }} />
        <line x1="50%" y1="50%" x2="85%" y2="75%" stroke="rgba(255,255,255,0.05)" strokeWidth="2" strokeDasharray="4 4" style={{ animation: reduced ? 'none' : 'pulseLine2 4s infinite' }} />
      </svg>

      {/* Data Packets */}
      {!reduced && (
        <>
          <div className="absolute w-3 h-3 bg-accent rounded-full shadow-[0_0_15px_rgba(23,107,104,1)] -ml-1.5 -mt-1.5 z-10" style={{ animation: 'movePacket1 4s infinite' }} />
          <div className="absolute w-3 h-3 bg-accent rounded-full shadow-[0_0_15px_rgba(23,107,104,1)] -ml-1.5 -mt-1.5 z-10" style={{ animation: 'movePacket2 4s infinite' }} />
          <div className="absolute w-3 h-3 bg-accent rounded-full shadow-[0_0_15px_rgba(23,107,104,1)] -ml-1.5 -mt-1.5 z-10" style={{ animation: 'movePacket3 4s infinite' }} />
        </>
      )}

      {/* Nodes (Pods) */}
      <div className="absolute left-[15%] top-[50%] -translate-x-1/2 -translate-y-1/2 flex flex-col items-center z-20">
        <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-md flex items-center justify-center text-white/60 mb-3">
          <Database size={24} />
        </div>
        <span className="text-[10px] sm:text-[11px] font-bold text-white/50 tracking-widest uppercase whitespace-nowrap">Data Source</span>
      </div>

      <div className="absolute left-[50%] top-[50%] -translate-x-1/2 -translate-y-1/2 flex flex-col items-center z-20">
        <div className="relative w-16 h-16 sm:w-20 sm:h-20 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-md flex items-center justify-center text-accent mb-3" style={{ animation: reduced ? 'none' : 'nodeProcessor 4s infinite' }}>
          <Cpu size={32} />
        </div>
        <span className="text-[10px] sm:text-[11px] font-bold text-white/70 tracking-widest uppercase whitespace-nowrap">Taskora Engine</span>
      </div>

      <div className="absolute left-[85%] top-[25%] -translate-x-1/2 -translate-y-1/2 flex flex-col items-center z-20">
        <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-md flex items-center justify-center text-white/60 mb-3" style={{ animation: reduced ? 'none' : 'nodeDest 4s infinite' }}>
          <LayoutDashboard size={24} />
        </div>
        <span className="text-[10px] sm:text-[11px] font-bold text-white/50 tracking-widest uppercase whitespace-nowrap">Dashboard</span>
      </div>

      <div className="absolute left-[85%] top-[75%] -translate-x-1/2 -translate-y-1/2 flex flex-col items-center z-20">
        <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-md flex items-center justify-center text-white/60 mb-3" style={{ animation: reduced ? 'none' : 'nodeDest 4s infinite' }}>
          <BarChart3 size={24} />
        </div>
        <span className="text-[10px] sm:text-[11px] font-bold text-white/50 tracking-widest uppercase whitespace-nowrap">Analytics</span>
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
              <DataPipelinePreview />
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
