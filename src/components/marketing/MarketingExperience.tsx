"use client";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import {
  ArrowRight,
  ArrowUpRight,
  Check,
  FolderKanban,
  Users,
} from "lucide-react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useReducedMotion } from "framer-motion";
import { Brand } from "@/components/shared/Brand";
import { MarketingSmoothScroll } from "@/components/scroll/MarketingSmoothScroll";
import { ProductPreview } from "./ProductPreview";
import { steps } from "@data/marketing";

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
    if (!root.current || reduced !== false) return;
    gsap.registerPlugin(ScrollTrigger);
    const context = gsap.context(() => {
      gsap.from("[data-hero]", {
        opacity: 0,
        y: 18,
        stagger: 0.08,
        duration: 0.65,
        ease: "power3.out",
      });
      gsap.from("[data-stage]", {
        opacity: 0,
        y: 20,
        duration: 0.7,
        delay: 0.15,
        ease: "power3.out",
      });
      gsap.utils.toArray<HTMLElement>("[data-story]").forEach((element) => {
        gsap.from(element, {
          scrollTrigger: { trigger: element, start: "top 88%", once: true },
          y: 18,
          opacity: 0,
          duration: 0.5,
        });
        gsap.from(element.querySelector("[data-moment]"), {
          scrollTrigger: { trigger: element, start: "top 75%", once: true },
          y: 8,
          opacity: 0.4,
          duration: 0.6,
          delay: 0.1,
        });
      });
      gsap.from("[data-footer-group]", {
        scrollTrigger: {
          trigger: "[data-footer]",
          start: "top 90%",
          once: true,
        },
        opacity: 0,
        y: 12,
        duration: 0.45,
        stagger: 0.07,
      });
    }, root);
    return () => context.revert();
  }, [reduced]);
  return (
    <MarketingSmoothScroll>
      <div ref={root} className="marketing">
        <header
          className={`marketing-header sticky top-0 z-30 ${scrolled ? "scrolled" : ""}`}
        >
          <div className="marketing-nav">
            <Brand />
            <nav className="flex items-center gap-4 sm:gap-7" aria-label="Main">
              <a
                href="#story"
                className="hidden text-sm text-muted md:inline-flex"
              >
                How it works
              </a>
              <Link href="/login" className="signin-link">
                Sign In
              </Link>
              <Link href="/register" className="btn btn-primary">
                Get Started
                <ArrowUpRight size={15} />
              </Link>
            </nav>
          </div>
        </header>
        <main id="main">
          <section className="marketing-hero">
            <div className="hero-narrative">
              <div>
                <p data-hero className="eyebrow mb-5 flex items-center gap-2">
                  <span className="status-dot done" />
                  Projects. People. Progress.
                </p>
                <h1 data-hero className="hero-title">
                  Keep every project
                  <br />
                  <span className="text-accent">moving.</span>
                </h1>
              </div>
              <div className="hero-support">
                <p data-hero>
                  Big ideas need a clear next step.
                  <br className="hidden sm:block" /> Bring your team and your
                  work together in one focused workspace.
                </p>
                <div
                  data-hero
                  className="mt-6 flex flex-wrap items-center gap-3"
                >
                  <Link href="/register" className="btn btn-primary">
                    Create your workspace
                    <ArrowRight size={16} />
                  </Link>
                  <a href="#story" className="btn btn-secondary">
                    Explore Taskora
                  </a>
                </div>
                <p data-hero className="hero-note">
                  <Check size={14} />
                  Built around the way work moves.
                </p>
              </div>
            </div>
            <div data-stage className="min-w-0">
              <ProductPreview />
            </div>
            <div className="hero-caption">
              <span>A little less process. A lot more clarity.</span>
              <a href="#story">
                See the whole picture
                <ArrowRight size={14} />
              </a>
            </div>
          </section>
          <section id="story" className="marketing-story">
            <div className="story-intro">
              <p className="eyebrow">A clear path through the work</p>
              <h2>
                From a shared idea
                <br />
                to a job well done.
              </h2>
              <p>Three simple moves. One connected workspace.</p>
            </div>
            <div className="story-grid">
              {steps.map((step, index) => (
                <article data-story key={step.label} className="story-item">
                  <div className="flex items-center justify-between">
                    <span className="eyebrow">
                      {step.number} / {step.label}
                    </span>
                    {index === 0 ? (
                      <FolderKanban size={18} />
                    ) : index === 1 ? (
                      <Users size={18} />
                    ) : (
                      <Check size={18} />
                    )}
                  </div>
                  <div data-moment className="story-moment">
                    {index === 0 ? (
                      <>
                        <span className="story-project-icon">
                          <FolderKanban size={23} />
                        </span>
                        <div>
                          <strong>Website launch</strong>
                          <p>A clear plan for what's next.</p>
                        </div>
                        <span className="ml-auto text-accent">
                          <Check size={16} />
                        </span>
                      </>
                    ) : index === 1 ? (
                      <>
                        <span className="avatar !bg-brand-soft !text-accent">
                          AK
                        </span>
                        <span className="connection-line" />
                        <div>
                          <strong>Prepare release notes</strong>
                          <p>Assigned to Alex</p>
                        </div>
                      </>
                    ) : (
                      <div className="w-full">
                        <div className="mb-3 flex justify-between">
                          <strong>3 of 5 tasks delivered</strong>
                          <span className="text-success">60%</span>
                        </div>
                        <div className="progress-track">
                          <div className="progress-fill w-3/5" />
                        </div>
                      </div>
                    )}
                  </div>
                  <h3>{step.title}</h3>
                  <p className="story-description">{step.text}</p>
                </article>
              ))}
            </div>
          </section>
          <section className="closing-cta">
            <div>
              <p className="eyebrow mb-4">Your next project starts here</p>
              <h2>
                A clear way forward.
                <br />
                <span className="text-accent">For the whole team.</span>
              </h2>
            </div>
            <div>
              <p>
                Start with the plan.
                <br />
                Make the next step a little clearer.
              </p>
              <Link href="/register" className="btn btn-primary mt-5">
                Get Started
                <ArrowRight size={16} />
              </Link>
            </div>
          </section>
        </main>
        <footer data-footer className="marketing-footer">
          <div className="footer-content">
            <div className="footer-groups">
              <div data-footer-group>
                <Brand />
                <p className="mt-4 text-sm text-white/65">
                  Project work, made clear.
                </p>
                <div className="footer-signal">
                  <span>Plan</span>
                  <ArrowRight size={12} />
                  <span>Assign</span>
                  <ArrowRight size={12} />
                  <span>Deliver</span>
                </div>
              </div>
              <nav data-footer-group aria-label="Product">
                <h2>Product</h2>
                <a href="#story">How it works</a>
                <Link href="/dashboard">Workspace</Link>
              </nav>
              <nav data-footer-group aria-label="Access">
                <h2>Access</h2>
                <Link href="/login">Sign in</Link>
                <Link href="/register">Create workspace</Link>
              </nav>
            </div>
            <div className="footer-rail">
              <span>© {new Date().getFullYear()} Taskora</span>
              <span>Plan. Assign. Deliver.</span>
              <span className="hidden sm:block">
                One workspace. Shared progress.
              </span>
            </div>
          </div>
        </footer>
      </div>
    </MarketingSmoothScroll>
  );
}
