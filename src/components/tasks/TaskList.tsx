"use client";
import Link from "next/link";
import { useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { ArrowUpRight, GripVertical } from "lucide-react";
import { statuses } from "@data/tasks";
import type { MyTask, TaskStatus } from "@/types/domain";
import { tasksApi } from "@/services/api/tasks";
import { ErrorMessage } from "@/components/shared/Feedback";

export function TaskList({
  tasks,
  onUpdated,
}: {
  tasks: MyTask[];
  onUpdated: () => void;
}) {
  const [pending, setPending] = useState<string[]>([]);
  const [error, setError] = useState<unknown>();
  const reduced = useReducedMotion();
  return (
    <div className="space-y-3">
      <ErrorMessage error={error} />
      <div className="card divide-y divide-line overflow-hidden">
        <AnimatePresence initial={false} mode="popLayout">
          {tasks.map((task) => (
            <motion.div
              layout={!reduced}
              initial={reduced ? false : { opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              exit={reduced ? undefined : { opacity: 0, y: -6 }}
              key={task.id}
              className="group flex flex-col justify-between gap-4 p-4 sm:flex-row sm:items-center bg-white hover:bg-canvas/50 transition-colors"
            >
              <div className="flex min-w-0 flex-1 items-center gap-3">
                <GripVertical size={16} className="shrink-0 text-line-strong opacity-0 transition-opacity group-hover:opacity-100 cursor-grab hidden sm:block" />
                <Link
                  href={`/projects/${task.projectId}?tab=tasks&task=${task.id}`}
                  className="min-w-0 flex-1"
                >
                  <h3 className="flex items-start gap-2 text-[14px] font-semibold text-ink">
                    <span className="break-words">{task.title}</span>
                    <ArrowUpRight
                      size={14}
                      className="shrink-0 text-muted transition-colors group-hover:text-accent"
                    />
                  </h3>
                  <p className="mt-1.5 text-xs font-medium text-muted">{task.project.name}</p>
                </Link>
              </div>
              <label>
                <span className="sr-only">Status for {task.title}</span>
                <select
                  className={`input !min-h-11 !w-auto !min-w-36 !text-xs badge-${task.status}`}
                  value={task.status}
                  disabled={pending.includes(task.id)}
                  onChange={async (event) => {
                    const status = event.target.value as TaskStatus;
                    setPending((ids) => [...ids, task.id]);
                    setError(undefined);
                    try {
                      await tasksApi.update(task.id, { status });
                      onUpdated();
                    } catch (failure) {
                      setError(failure);
                    } finally {
                      setPending((ids) => ids.filter((id) => id !== task.id));
                    }
                  }}
                >
                  {statuses.map((status) => (
                    <option key={status.value} value={status.value}>
                      {status.label}
                    </option>
                  ))}
                </select>
              </label>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </div>
  );
}
