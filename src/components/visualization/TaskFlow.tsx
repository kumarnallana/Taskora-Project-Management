"use client";
import { scaleSqrt } from "d3-scale";
import { motion, useReducedMotion } from "framer-motion";
type Props = { todo: number; inProgress: number; done: number };
export function TaskFlow({ todo, inProgress, done }: Props) {
  const reduced = useReducedMotion();
  const values = [todo, inProgress, done];
  const total = values.reduce((sum, value) => sum + value, 0);
  const radius = scaleSqrt()
    .domain([0, Math.max(1, ...values)])
    .range([18, 34]);
  const nodes = [
    { label: "To do", value: todo, x: 52, tone: "var(--muted)" },
    { label: "In progress", value: inProgress, x: 180, tone: "var(--amber)" },
    { label: "Done", value: done, x: 308, tone: "var(--success)" },
  ];
  return (
    <div className="surface-raised p-5 sm:p-6">
      <div className="mb-5 flex items-end justify-between gap-4">
        <div>
          <p className="eyebrow mb-2">Live delivery picture</p>
          <h2 className="text-lg">Task flow</h2>
        </div>
        <p className="text-xs text-muted">
          {total ? Math.round((done / total) * 100) : 0}% complete
        </p>
      </div>
      <div
        role="img"
        aria-label={`Task flow: ${todo} to do, ${inProgress} in progress, ${done} done.`}
        className="overflow-hidden"
      >
        <svg viewBox="0 0 360 128" className="h-auto w-full" aria-hidden="true">
          <path
            d="M78 54 H154 M206 54 H282"
            stroke="var(--line-strong)"
            strokeWidth="2"
            strokeDasharray="5 7"
          />
          {nodes.map((node) => (
            <g key={node.label}>
              <motion.circle
                cx={node.x}
                cy="54"
                fill="var(--surface-muted)"
                stroke={node.tone}
                strokeWidth="2"
                initial={false}
                animate={{ r: radius(node.value) }}
                transition={reduced ? { duration: 0 } : { duration: 0.45 }}
              />
              <text
                x={node.x}
                y="59"
                textAnchor="middle"
                fill="var(--ink)"
                fontSize="16"
                fontWeight="650"
              >
                {node.value}
              </text>
              <text
                x={node.x}
                y="112"
                textAnchor="middle"
                fill="var(--muted)"
                fontSize="11"
              >
                {node.label}
              </text>
            </g>
          ))}
        </svg>
      </div>
    </div>
  );
}
