"use client";
import { useState } from "react";
import useSWR, { useSWRConfig } from "swr";
import { Search } from "lucide-react";
import { api } from "@/services/api/client";
import { tasksApi } from "@/services/api/tasks";
import type { MyTask } from "@/types/domain";
import { statuses } from "@data/tasks";
import { TaskList } from "@/components/tasks/TaskList";
import { Loading, LoadError, EmptyState } from "@/components/shared/Feedback";
export default function MyTasksPage() {
  const { data, error, mutate: refresh } = useSWR<MyTask[]>(tasksApi.mine, api);
  const { mutate } = useSWRConfig();
  const [filter, setFilter] = useState("ALL");
  const [search, setSearch] = useState("");
  if (error) return <LoadError error={error} retry={() => void refresh()} />;
  if (!data) return <Loading />;
  const tasks = data.filter(
    (task) =>
      (filter === "ALL" || task.status === filter) &&
      `${task.title} ${task.project.name}`
        .toLowerCase()
        .includes(search.toLowerCase()),
  );
  return (
    <>
      <div className="page-heading">
        <div>
          <p className="eyebrow !mt-0 !mb-3">A little room to focus</p>
          <h1>My Tasks</h1>
          <p>Your assigned work, across every project.</p>
        </div>
        <span className="badge badge-IN_PROGRESS">
          {data.filter((task) => task.status !== "DONE").length} open tasks
        </span>
      </div>
      <div className="mb-6 flex flex-col justify-between gap-4 md:flex-row">
        <div
          className="flex flex-wrap gap-2"
          role="group"
          aria-label="Filter tasks by status"
        >
          {[{ value: "ALL", label: "All tasks" }, ...statuses].map((status) => (
            <button
              key={status.value}
              className={`btn ${filter === status.value ? "btn-primary" : "btn-secondary"}`}
              aria-pressed={filter === status.value}
              onClick={() => setFilter(status.value)}
            >
              {status.label}
            </button>
          ))}
        </div>
        <label className="relative">
          <span className="sr-only">Search assigned tasks</span>
          <Search size={16} className="absolute top-3.5 left-3 text-muted" />
          <input
            type="search"
            className="input !pl-10"
            placeholder="Search tasks…"
            value={search}
            onChange={(event) => setSearch(event.target.value)}
          />
        </label>
      </div>
      {tasks.length ? (
        <TaskList
          tasks={tasks}
          onUpdated={() => {
            void mutate(
              (key) =>
                typeof key === "string" &&
                (key.startsWith("/api/projects") || key === tasksApi.mine),
            );
          }}
        />
      ) : (
        <EmptyState
          title={
            data.length ? "No tasks in this view." : "Your focus starts here."
          }
          description={
            data.length
              ? "Try a different status or search term."
              : "Tasks assigned to you will appear here. Open a project to find your next piece of work."
          }
        />
      )}
    </>
  );
}
