"use client";
import { scaleSqrt } from "d3-scale";
import { motion, useReducedMotion } from "framer-motion";

type Props = { todo: number; inProgress: number; done: number };

export function TaskFlow({ todo, inProgress, done }: Props) {
  const reduced = useReducedMotion();
  const values = [todo, inProgress, done];
  const total = values.reduce((sum, value) => sum + value, 0);
  const completion = total ? Math.round((done / total) * 100) : 0;

  const radius = scaleSqrt()
    .domain([0, Math.max(1, ...values)])
    .range([24, 52]);

  const nodes = [
    { id: "todo", label: "To do", value: todo, x: 100, tone: "var(--muted)", fill: "var(--surface)", text: "var(--muted)" },
    { id: "inProgress", label: "In progress", value: inProgress, x: 300, tone: "var(--amber)", fill: "var(--amber-soft)", text: "var(--amber)" },
    { id: "done", label: "Done", value: done, x: 500, tone: "var(--success)", fill: "var(--success-soft)", text: "var(--success)" },
  ];

  return (
    <div className="card flex h-full min-h-[320px] flex-col p-6 sm:p-8 shadow-sm">
      <div className="mb-8 flex flex-wrap items-end justify-between gap-4 border-b border-line pb-5">
        <div>
          <p className="eyebrow mb-2">Delivery Flow</p>
          <h2 className="text-xl tracking-tight font-semibold">Task progression</h2>
        </div>
        <div className="text-right">
          <p className="text-3xl font-bold tracking-tight">{completion}%</p>
          <p className="mt-1 text-[11px] font-semibold tracking-wider text-muted uppercase">Completed</p>
        </div>
      </div>

      <div
        role="img"
        aria-label={`Delivery flow: ${todo} to do, ${inProgress} in progress, ${done} done. Total completion ${completion}%.`}
        className="relative flex-1"
      >
        <svg
          viewBox="0 0 600 240"
          className="absolute inset-0 h-full w-full overflow-visible"
          preserveAspectRatio="xMidYMid meet"
          aria-hidden="true"
        >
          <defs>
            <pattern id="micro-grid" width="24" height="24" patternUnits="userSpaceOnUse">
              <circle cx="2" cy="2" r="1.5" fill="var(--line-strong)" opacity="0.35" />
            </pattern>
            <linearGradient id="flow-gradient-1" x1="0" y1="0" x2="1" y2="0">
              <stop offset="0%" stopColor="var(--line-strong)" stopOpacity="0.5" />
              <stop offset="100%" stopColor="var(--amber)" stopOpacity="0.8" />
            </linearGradient>
            <linearGradient id="flow-gradient-2" x1="0" y1="0" x2="1" y2="0">
              <stop offset="0%" stopColor="var(--amber)" stopOpacity="0.5" />
              <stop offset="100%" stopColor="var(--success)" stopOpacity="0.8" />
            </linearGradient>
          </defs>

          {/* Background Micro Grid */}
          <rect width="100%" height="100%" fill="url(#micro-grid)" rx="16" opacity="0.5" />

          {/* Connection paths */}
          <path
            d="M100 120 L300 120"
            stroke="url(#flow-gradient-1)"
            strokeWidth="3"
            strokeDasharray="6 8"
            strokeLinecap="round"
            fill="none"
          />
          <path
            d="M300 120 L500 120"
            stroke="url(#flow-gradient-2)"
            strokeWidth="3"
            strokeDasharray="6 8"
            strokeLinecap="round"
            fill="none"
          />

          {/* Animated flow indicator 1 */}
          <motion.circle
            key={`flow-1-${inProgress}`}
            cx="0"
            cy="120"
            r="5"
            fill="var(--amber)"
            initial={reduced ? false : { x: 100, opacity: 0 }}
            animate={reduced ? false : {
              x: [100, 300],
              opacity: [0, 1, 1, 0]
            }}
            transition={{
              duration: 1.5,
              ease: "linear",
              times: [0, 0.2, 0.8, 1]
            }}
          />

          {/* Animated flow indicator 2 */}
          <motion.circle
            key={`flow-2-${done}`}
            cx="0"
            cy="120"
            r="5"
            fill="var(--success)"
            initial={reduced ? false : { x: 300, opacity: 0 }}
            animate={reduced ? false : {
              x: [300, 500],
              opacity: [0, 1, 1, 0]
            }}
            transition={{
              duration: 1.5,
              ease: "linear",
              delay: 0.2,
              times: [0, 0.2, 0.8, 1]
            }}
          />

          {/* Nodes */}
          {nodes.map((node) => (
            <g key={node.label}>
              <motion.circle
                cx={node.x}
                cy="120"
                fill={node.fill}
                stroke={node.tone}
                strokeWidth="3"
                initial={false}
                animate={{ r: radius(node.value) }}
                transition={reduced ? { duration: 0 } : { duration: 0.6, type: "spring", bounce: 0.3 }}
              />
              <text
                x={node.x}
                y="126"
                textAnchor="middle"
                fill="var(--ink)"
                fontSize="18"
                fontWeight="700"
                className="select-none"
              >
                {node.value}
              </text>
              <motion.text
                x={node.x}
                textAnchor="middle"
                fill={node.text}
                fontSize="12"
                fontWeight="650"
                className="select-none tracking-wide uppercase"
                initial={false}
                animate={{ y: 120 + radius(node.value) + 26 }}
                transition={reduced ? { duration: 0 } : { duration: 0.6, type: "spring", bounce: 0.3 }}
              >
                {node.label}
              </motion.text>
            </g>
          ))}
        </svg>
      </div>
    </div>
  );
}
