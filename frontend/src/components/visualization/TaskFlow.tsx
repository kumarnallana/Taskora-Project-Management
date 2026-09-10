"use client";
import { useId } from "react";
import { scaleLinear } from "d3-scale";
import { motion, useReducedMotion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import { AnimatedNumber } from "@/components/shared/AnimatedNumber";

export function TaskFlow({
  todo,
  inProgress,
  done,
}: {
  todo: number;
  inProgress: number;
  done: number;
}) {
  const reduced = useReducedMotion();
  const gridId = useId().replaceAll(":", "");
  const total = todo + inProgress + done;
  const percentage = total ? Math.round((done / total) * 100) : 0;
  const width = scaleLinear()
    .domain([0, Math.max(1, total)])
    .range([0, 560]);
  const rows = [
    { label: "To do", value: todo, tone: "var(--muted)", offset: 0 },
    {
      label: "In progress",
      value: inProgress,
      tone: "var(--amber)",
      offset: todo,
    },
    {
      label: "Done",
      value: done,
      tone: "var(--success)",
      offset: todo + inProgress,
    },
  ];
  return (
    <section className="delivery-flow" aria-labelledby={gridId + "-title"}>
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="eyebrow mb-2">Delivery overview</p>
          <h2 id={gridId + "-title"} className="text-xl tracking-tight">
            Work, moving forward.
          </h2>
        </div>
        <div className="text-right">
          <p className="text-3xl font-semibold tracking-tight">
            <AnimatedNumber value={percentage} />
            <span className="text-lg text-muted">%</span>
          </p>
          <p className="mt-1 text-xs text-muted">complete</p>
        </div>
      </div>
      <div className="flow-values">
        {rows.map((row, index) => (
          <div key={row.label}>
            <div className="mb-3 flex items-center justify-between gap-2">
              <span className="flex items-center gap-2 text-xs text-muted">
                <i
                  className="h-1.5 w-1.5 rounded-full"
                  style={{ background: row.tone }}
                />
                {row.label}
              </span>
              {index < 2 && <ArrowRight size={14} className="text-muted" />}
            </div>
            <p className="text-3xl font-semibold">
              <AnimatedNumber value={row.value} />
            </p>
            <p className="mt-2 text-xs text-muted">
              {total ? Math.round((row.value / total) * 100) : 0}% of work
            </p>
          </div>
        ))}
      </div>
      <div
        role="img"
        aria-label={`Task distribution: ${todo} to do, ${inProgress} in progress, ${done} done. ${percentage}% complete.`}
      >
        <svg viewBox="0 0 560 72" className="block w-full" aria-hidden="true">
          <defs>
            <pattern
              id={gridId}
              width="28"
              height="18"
              patternUnits="userSpaceOnUse"
            >
              <path
                d="M28 0H0V18"
                fill="none"
                stroke="var(--line)"
                strokeWidth=".7"
              />
            </pattern>
          </defs>
          <rect width="560" height="72" fill={`url(#${gridId})`} />
          <rect
            y="23"
            width="560"
            height="26"
            rx="5"
            fill="var(--surface-muted)"
          />
          {rows
            .filter((row) => row.value > 0)
            .map((row) => (
              <motion.rect
                key={row.label}
                y="23"
                height="26"
                rx="4"
                fill={row.tone}
                initial={false}
                animate={{
                  x: width(row.offset),
                  width: Math.max(0, width(row.value) - 2),
                }}
                transition={{
                  duration: reduced ? 0 : 0.45,
                  ease: [0.2, 0.8, 0.2, 1],
                }}
              />
            ))}
        </svg>
      </div>
      <div className="mt-4 flex flex-wrap justify-between gap-2 text-xs text-muted">
        <span>{total} tasks across your projects</span>
        <span>
          {total
            ? `${done} complete · ${todo + inProgress} still open`
            : "Add a task to start the flow"}
        </span>
      </div>
    </section>
  );
}
