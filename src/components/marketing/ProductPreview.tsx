"use client";
import { useEffect, useRef, useState } from "react";
import {
  Check,
  Circle,
  CircleDot,
  Layers2,
  RotateCcw,
  Users,
} from "lucide-react";
import { gsap } from "gsap";
import { useReducedMotion } from "framer-motion";
import { ProjectConstellation } from "./three/ProjectConstellation";
import { demoPhases, demoTasks } from "@data/marketing";

export function ProductPreview() {
  const root = useRef<HTMLDivElement>(null);
  const timeline = useRef<gsap.core.Timeline | null>(null);
  const [phase, setPhase] = useState(5);
  const [canReplay, setCanReplay] = useState(false);
  const reduced = useReducedMotion();
  useEffect(() => {
    setCanReplay(false);
    if (reduced !== false || !root.current) {
      setPhase(5);
      return;
    }
    setPhase(0);
    let intersecting = false;
    const story = gsap.timeline({ paused: true });
    timeline.current = story;
    for (let index = 1; index < demoPhases.length; index++)
      story.call(
        () => {
          setPhase(index);
          if (index === 5) setCanReplay(true);
        },
        [],
        index * 1.6,
      );
    const update = () => {
      if (intersecting && !document.hidden) story.play();
      else story.pause();
    };
    const observer = new IntersectionObserver(
      ([entry]) => {
        intersecting = entry.isIntersecting;
        update();
      },
      { threshold: 0.25 },
    );
    observer.observe(root.current);
    document.addEventListener("visibilitychange", update);
    return () => {
      story.kill();
      timeline.current = null;
      observer.disconnect();
      document.removeEventListener("visibilitychange", update);
    };
  }, [reduced]);
  useEffect(() => {
    if (reduced !== false || !root.current) return;
    const context = gsap.context(() => {
      gsap.fromTo(
        "[data-demo-caption]",
        { opacity: 0, y: 5 },
        { opacity: 1, y: 0, duration: 0.3 },
      );
      gsap.fromTo(
        "[data-focal-task]",
        { backgroundColor: "var(--accent-soft)" },
        { backgroundColor: "var(--surface)", duration: 0.7 },
      );
    }, root);
    return () => context.revert();
  }, [phase, reduced]);
  const tasks = demoTasks.map((task, index) => ({
    ...task,
    status:
      index === 0 || (index === 1 && phase >= 4) || (index === 4 && phase >= 5)
        ? "DONE"
        : index === 1 || (index === 4 && phase >= 3)
          ? "IN_PROGRESS"
          : "TODO",
  }));
  const done = tasks.filter((task) => task.status === "DONE").length;
  const progress = (done / tasks.length) * 100;
  return (
    <div ref={root} className="product-preview" data-phase={phase}>
      <div className="preview-chrome">
        <span className="flex items-center gap-2">
          <Layers2 size={16} />
          Taskora <span className="px-2 text-muted">/</span> Website launch
        </span>
        <span className="demo-label">Product walkthrough</span>
      </div>
      <div className="preview-layout">
        <div className="preview-work">
          <div className="preview-heading">
            <div>
              <p className="eyebrow mb-2">A shared direction</p>
              <h2>Launch something great.</h2>
              <p className="mt-2 text-sm text-muted">
                The plan, the people, and the next step.
              </p>
            </div>
            <div className="flex -space-x-2" aria-label="Three project members">
              {["AK", "RM", "JL"].map((person) => (
                <span key={person} className="avatar border-2 border-white">
                  {person}
                </span>
              ))}
            </div>
          </div>
          <div className="preview-statuses" aria-label="Task counts">
            <span>
              <i className="status-dot" />
              To do{" "}
              <strong>
                {tasks.filter((task) => task.status === "TODO").length}
              </strong>
            </span>
            <span>
              <i className="status-dot active" />
              In progress{" "}
              <strong>
                {tasks.filter((task) => task.status === "IN_PROGRESS").length}
              </strong>
            </span>
            <span>
              <i className="status-dot done" />
              Done <strong>{done}</strong>
            </span>
          </div>
          <div className="preview-task-list">
            {tasks.map((task, index) => (
              <div
                key={task.id}
                className="preview-task"
                data-focal-task={index === 4 ? "" : undefined}
              >
                <span
                  className={
                    task.status === "DONE"
                      ? "text-success"
                      : task.status === "IN_PROGRESS"
                        ? "text-amber"
                        : "text-muted"
                  }
                >
                  {task.status === "DONE" ? (
                    <Check size={17} />
                  ) : task.status === "IN_PROGRESS" ? (
                    <CircleDot size={17} />
                  ) : (
                    <Circle size={17} />
                  )}
                </span>
                <div className="min-w-0">
                  <p className={task.status === "DONE" ? "text-muted" : ""}>
                    {index === 4 && phase === 0 ? "Your next task" : task.title}
                  </p>
                  {index === 4 && (
                    <span className="preview-task-detail">
                      {phase === 0
                        ? "A place in the plan"
                        : phase === 1
                          ? "Ready for an owner"
                          : phase < 3
                            ? "Assigned to Alex"
                            : phase < 5
                              ? "Alex is on it"
                              : "Ready for launch"}
                    </span>
                  )}
                </div>
                <span className={`badge badge-${task.status}`}>
                  {task.status === "DONE"
                    ? "Done"
                    : task.status === "IN_PROGRESS"
                      ? "In progress"
                      : "To do"}
                </span>
                <span className="avatar preview-owner">
                  {index === 4 && phase < 2 ? "—" : task.person}
                </span>
              </div>
            ))}
          </div>
          <div className="preview-bottom">
            <Users size={15} />
            <span>Clear ownership. Shared progress.</span>
            <span className="ml-auto text-ink">5 tasks</span>
          </div>
        </div>
        <aside className="preview-context" aria-label="Project progress">
          <div>
            <p className="text-xs text-white/65">Connected by one goal</p>
            <h3 className="mt-2 text-lg">A team in motion.</h3>
          </div>
          <ProjectConstellation phase={phase} progress={progress} />
          <div className="preview-progress">
            <div className="mb-3 flex items-end justify-between">
              <span className="text-sm text-white/70">Project progress</span>
              <strong className="text-3xl font-medium tracking-tight">
                {progress}
                <span className="text-base text-white/65">%</span>
              </strong>
            </div>
            <div
              role="progressbar"
              aria-label="Demo project completion"
              aria-valuenow={progress}
              aria-valuemin={0}
              aria-valuemax={100}
              className="progress-track"
            >
              <div
                className="progress-fill"
                style={{ width: `${progress}%` }}
              />
            </div>
          </div>
          <p className="mt-3 text-xs text-white/65">
            {done} of 5 tasks complete
          </p>
        </aside>
      </div>
      <div className="preview-narration">
        <span className="narration-step">
          {String(phase + 1).padStart(2, "0")} / 06
        </span>
        <div data-demo-caption>
          <strong>{demoPhases[phase].label}</strong>
          <p>{demoPhases[phase].detail}</p>
        </div>
        <button
          type="button"
          className="replay-button"
          aria-label="Replay product walkthrough"
          disabled={!canReplay}
          onClick={() => {
            setCanReplay(false);
            setPhase(0);
            timeline.current?.restart();
          }}
        >
          <RotateCcw size={15} />
          <span>Replay</span>
        </button>
      </div>
    </div>
  );
}
