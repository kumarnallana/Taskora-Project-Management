"use client";
import dynamic from "next/dynamic";
import { useEffect, useRef, useState } from "react";
import { useReducedMotion } from "framer-motion";
const Scene = dynamic(() => import("./ProjectConstellationCanvas"), {
  ssr: false,
});
export function ProjectConstellation({ phase = 0 }: { phase?: number }) {
  const root = useRef<HTMLDivElement>(null);
  const reduced = useReducedMotion();
  const [eligible, setEligible] = useState(false);
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    const canvas = document.createElement("canvas");
    setEligible(
      window.innerWidth >= 768 &&
        !reduced &&
        Boolean(canvas.getContext("webgl2") || canvas.getContext("webgl")),
    );
  }, [reduced]);
  useEffect(() => {
    if (!root.current || !eligible) return;
    const observer = new IntersectionObserver(
      ([entry]) => setVisible(entry.isIntersecting && !document.hidden),
      { threshold: 0.1 },
    );
    observer.observe(root.current);
    const update = () => setVisible(!document.hidden);
    document.addEventListener("visibilitychange", update);
    return () => {
      observer.disconnect();
      document.removeEventListener("visibilitychange", update);
    };
  }, [eligible]);
  return (
    <div
      ref={root}
      className="constellation-fallback relative h-52 overflow-hidden rounded-xl"
      aria-hidden="true"
    >
      {eligible && visible && <Scene phase={phase} />}
      <div className="pointer-events-none absolute inset-x-4 bottom-4 flex justify-between text-[10px] uppercase tracking-[.18em] text-white/60">
        <span>People</span>
        <span>Project</span>
        <span>Tasks</span>
      </div>
    </div>
  );
}
