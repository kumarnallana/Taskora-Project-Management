"use client";
import dynamic from "next/dynamic";
import { Component, useEffect, useRef, useState, type ReactNode } from "react";

const Scene = dynamic(() => import("./ProjectConstellationCanvas"), {
  ssr: false,
});
class SceneBoundary extends Component<
  { children: ReactNode },
  { failed: boolean }
> {
  state = { failed: false };
  static getDerivedStateFromError() {
    return { failed: true };
  }
  render() {
    return this.state.failed ? null : this.props.children;
  }
}

export function ProjectConstellation({
  phase,
  progress,
}: {
  phase: number;
  progress: number;
}) {
  const root = useRef<HTMLDivElement>(null);
  const [active, setActive] = useState(false);
  const [failed, setFailed] = useState(false);
  useEffect(() => {
    if (!root.current) return;
    const media = window.matchMedia(
      "(min-width: 768px) and (prefers-reduced-motion: no-preference)",
    );
    const device = navigator as Navigator & {
      deviceMemory?: number;
      connection?: { saveData?: boolean };
    };
    let intersecting = false;
    let capable: boolean | undefined;
    const update = () => {
      if (
        !media.matches ||
        !intersecting ||
        document.hidden ||
        device.connection?.saveData ||
        (device.deviceMemory && device.deviceMemory < 4)
      ) {
        setActive(false);
        return;
      }
      if (capable === undefined) {
        const canvas = document.createElement("canvas");
        const context = canvas.getContext("webgl2");
        capable = !!context;
        context?.getExtension("WEBGL_lose_context")?.loseContext();
      }
      setActive(!!capable);
    };
    const observer = new IntersectionObserver(
      ([entry]) => {
        intersecting = entry.isIntersecting;
        update();
      },
      { threshold: 0.1 },
    );
    observer.observe(root.current);
    media.addEventListener("change", update);
    document.addEventListener("visibilitychange", update);
    return () => {
      observer.disconnect();
      media.removeEventListener("change", update);
      document.removeEventListener("visibilitychange", update);
    };
  }, []);
  return (
    <div ref={root} className="constellation" aria-hidden="true">
      <svg className="constellation-static" viewBox="0 0 300 210">
        <g stroke="var(--constellation-line)" fill="none">
          <path d="M48 64L143 104L237 62M48 147L143 104L237 145M48 106H143" />
          <circle cx="143" cy="104" r="42" opacity=".3" />
          <circle
            cx="143"
            cy="104"
            r="42"
            pathLength="100"
            stroke="var(--constellation-done)"
            strokeDasharray={`${progress} 100`}
            transform="rotate(-90 143 104)"
            strokeWidth="2"
          />
        </g>
        <g fill="var(--constellation-member)">
          <circle cx="48" cy="64" r="8" />
          <circle cx="48" cy="106" r="8" />
          <circle cx="48" cy="147" r="8" />
        </g>
        <circle cx="143" cy="104" r="23" fill="var(--accent)" />
        <path
          d="m131 104 12-7 12 7-12 7z m-12 0 12 7 12-7"
          fill="none"
          stroke="var(--dark-text)"
          strokeWidth="1.5"
        />
        <rect
          x="229"
          y="54"
          width="16"
          height="16"
          rx="4"
          fill="var(--constellation-done)"
        />
        <rect
          x="229"
          y="137"
          width="16"
          height="16"
          rx="4"
          fill={
            phase >= 5
              ? "var(--constellation-done)"
              : "var(--constellation-active)"
          }
        />
      </svg>
      {active && !failed && (
        <div className="constellation-canvas">
          <SceneBoundary>
            <Scene
              phase={phase}
              progress={progress}
              onFailure={() => setFailed(true)}
            />
          </SceneBoundary>
        </div>
      )}
      <div className="constellation-labels">
        <span>People</span>
        <span>Project</span>
        <span>Progress</span>
      </div>
    </div>
  );
}
