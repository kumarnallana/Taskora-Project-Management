"use client";
import Link from "next/link";
import { useState } from "react";
import { ArrowUpRight } from "lucide-react";
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
  return (
    <div className="space-y-3">
      <ErrorMessage error={error} />
      <div className="card divide-y divide-line overflow-hidden">
        {tasks.map((task) => (
          <div
            key={task.id}
            className="flex flex-col justify-between gap-4 p-5 sm:flex-row sm:items-center"
          >
            <Link
              href={`/projects/${task.projectId}?tab=tasks&task=${task.id}`}
              className="group min-w-0"
            >
              <h3 className="flex items-start gap-2 text-sm">
                <span className="break-words">{task.title}</span>
                <ArrowUpRight
                  size={14}
                  className="shrink-0 text-muted group-hover:text-accent"
                />
              </h3>
              <p className="mt-1.5 text-xs text-muted">{task.project.name}</p>
            </Link>
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
          </div>
        ))}
      </div>
    </div>
  );
}
