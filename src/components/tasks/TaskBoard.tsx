"use client";
import { useState } from "react";
import { motion, useReducedMotion } from "framer-motion";
import { Plus, Pencil, Trash2, Search } from "lucide-react";
import { statuses } from "@data/tasks";
import type { Task, Member, TaskStatus } from "@/types/domain";
import { tasksApi } from "@/services/api/tasks";
import { Avatar } from "@/components/shared/Avatar";
import { ConfirmDialog } from "@/components/shared/Dialog";
import { ErrorMessage } from "@/components/shared/Feedback";
import { TaskForm } from "./TaskForm";

export function TaskBoard({
  projectId,
  tasks,
  members,
  onUpdated,
  selectedTaskId,
}: {
  projectId: string;
  tasks: Task[];
  members: Member[];
  onUpdated: () => void;
  selectedTaskId: string | null;
}) {
  const [creating, setCreating] = useState<TaskStatus | null>(null);
  const [editingId, setEditingId] = useState<string | null>(selectedTaskId);
  const [deleting, setDeleting] = useState<Task | null>(null);
  const [search, setSearch] = useState("");
  const [mobileStatus, setMobileStatus] = useState<TaskStatus>("TODO");
  const [pending, setPending] = useState<string[]>([]);
  const [error, setError] = useState<unknown>();
  const reduced = useReducedMotion();
  const editing = tasks.find((task) => task.id === editingId);
  const visible = tasks.filter((task) =>
    task.title.toLowerCase().includes(search.toLowerCase()),
  );
  return (
    <>
      <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
        <label className="relative w-full sm:w-64">
          <span className="sr-only">Search project tasks</span>
          <Search size={16} className="absolute top-3.5 left-3 text-muted" />
          <input
            className="input !pl-10"
            type="search"
            placeholder="Search tasks…"
            value={search}
            onChange={(event) => setSearch(event.target.value)}
          />
        </label>
        <button className="btn btn-primary" onClick={() => setCreating("TODO")}>
          <Plus size={16} />
          New task
        </button>
      </div>
      <ErrorMessage error={error} />
      <div
        className="mb-5 flex gap-2 lg:hidden"
        role="group"
        aria-label="Show task status"
      >
        {statuses.map((status) => (
          <button
            key={status.value}
            className={`btn flex-1 !px-2 ${mobileStatus === status.value ? "btn-primary" : "btn-secondary"}`}
            onClick={() => setMobileStatus(status.value)}
            aria-pressed={mobileStatus === status.value}
          >
            {status.label}
          </button>
        ))}
      </div>
      <div className="grid gap-5 lg:grid-cols-3">
        {statuses.map((status) => {
          const column = visible.filter((task) => task.status === status.value);
          return (
            <section
              key={status.value}
              aria-label={status.label}
              className={`min-w-0 rounded-xl border border-line bg-[#f0efeb] p-3 ${mobileStatus === status.value ? "" : "hidden lg:block"}`}
            >
              <div className="mb-4 flex items-center justify-between pl-1">
                <h2 className="flex items-center gap-2 text-xs">
                  <span className={`badge badge-${status.value}`}>
                    {status.label}
                  </span>
                  <span className="text-muted">{column.length}</span>
                </h2>
                <button
                  className="icon-button !h-9 !w-9 !border-transparent !bg-transparent"
                  aria-label={`Add ${status.label} task`}
                  onClick={() => setCreating(status.value)}
                >
                  <Plus size={16} />
                </button>
              </div>
              <div className="space-y-3">
                {column.map((task) => (
                  <motion.article
                    key={task.id}
                    layout={!reduced}
                    initial={reduced ? false : { opacity: 0, y: 5 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.16 }}
                    className="task-card"
                  >
                    <div className="mb-3 flex items-start justify-between gap-2">
                      <button
                        className="min-h-11 min-w-0 text-left text-sm leading-relaxed font-semibold break-words hover:text-accent"
                        onClick={() => setEditingId(task.id)}
                      >
                        {task.title}
                      </button>
                      <div className="flex shrink-0">
                        <button
                          className="icon-button !h-11 !w-9 !border-0"
                          aria-label={`Edit ${task.title}`}
                          onClick={() => setEditingId(task.id)}
                        >
                          <Pencil size={14} />
                        </button>
                        <button
                          className="icon-button !h-11 !w-9 !border-0 text-muted"
                          aria-label={`Delete ${task.title}`}
                          onClick={() => setDeleting(task)}
                        >
                          <Trash2 size={14} />
                        </button>
                      </div>
                    </div>
                    {task.description && (
                      <p className="mb-5 line-clamp-3 text-xs leading-relaxed break-words text-muted">
                        {task.description}
                      </p>
                    )}
                    <div className="flex min-w-0 items-center gap-2 border-t border-line pt-3">
                      {task.assignee ? (
                        <>
                          <Avatar name={task.assignee.name} />
                          <span className="truncate text-[11px] text-muted">
                            {task.assignee.name}
                          </span>
                        </>
                      ) : (
                        <span className="py-2 text-[11px] text-muted">
                          Unassigned
                        </span>
                      )}
                    </div>
                    <label className="mt-3 block">
                      <span className="sr-only">Status for {task.title}</span>
                      <select
                        className="input !min-h-11 !text-xs"
                        value={task.status}
                        disabled={pending.includes(task.id)}
                        onChange={async (event) => {
                          const next = event.target.value as TaskStatus;
                          setPending((ids) => [...ids, task.id]);
                          setError(undefined);
                          try {
                            await tasksApi.update(task.id, { status: next });
                            onUpdated();
                          } catch (failure) {
                            setError(failure);
                          } finally {
                            setPending((ids) =>
                              ids.filter((id) => id !== task.id),
                            );
                          }
                        }}
                      >
                        {statuses.map((option) => (
                          <option key={option.value} value={option.value}>
                            {option.label}
                          </option>
                        ))}
                      </select>
                    </label>
                  </motion.article>
                ))}
                {!column.length && (
                  <p className="rounded-lg border border-dashed border-[#d8d5cf] px-3 py-10 text-center text-xs text-muted">
                    {search
                      ? "No matching tasks."
                      : "A little room for the next step."}
                  </p>
                )}
              </div>
            </section>
          );
        })}
      </div>
      {creating && (
        <TaskForm
          projectId={projectId}
          members={members}
          initialStatus={creating}
          onClose={() => setCreating(null)}
          onSaved={onUpdated}
        />
      )}
      {editing && (
        <TaskForm
          projectId={projectId}
          members={members}
          task={editing}
          onClose={() => setEditingId(null)}
          onSaved={onUpdated}
        />
      )}
      {deleting && (
        <ConfirmDialog
          title="Delete task?"
          description={`“${deleting.title}” will be permanently removed from this project.`}
          onClose={() => setDeleting(null)}
          action={async () => {
            await tasksApi.remove(deleting.id);
            onUpdated();
          }}
        />
      )}
    </>
  );
}
