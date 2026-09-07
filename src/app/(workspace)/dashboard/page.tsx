"use client";
import Link from "next/link";
import { useState } from "react";
import { useRouter } from "next/navigation";
import useSWR from "swr";
import {
  FolderKanban,
  CircleDot,
  CheckCheck,
  Users,
  Plus,
  ArrowRight,
} from "lucide-react";
import { api } from "@/services/api/client";
import { authApi } from "@/services/api/auth";
import { projectsApi } from "@/services/api/projects";
import { tasksApi } from "@/services/api/tasks";
import type { User, ProjectSummary, MyTask } from "@/types/domain";
import { Loading, LoadError, EmptyState } from "@/components/shared/Feedback";
import { ProjectCard } from "@/components/projects/ProjectCard";
import { ProjectForm } from "@/components/projects/ProjectForm";
import { TaskList } from "@/components/tasks/TaskList";

export default function DashboardPage() {
  const { data: user } = useSWR<User>(authApi.me, api);
  const {
    data: projects,
    error: projectError,
    mutate: refreshProjects,
  } = useSWR<ProjectSummary[]>(projectsApi.list, api);
  const {
    data: tasks,
    error: taskError,
    mutate: refreshTasks,
  } = useSWR<MyTask[]>(tasksApi.mine, api);
  const [creating, setCreating] = useState(false);
  const router = useRouter();
  if (projectError || taskError)
    return (
      <LoadError
        error={projectError || taskError}
        retry={() => {
          void refreshProjects();
          void refreshTasks();
        }}
      />
    );
  if (!projects || !tasks || !user) return <Loading />;
  const completed = projects.reduce(
    (sum, project) => sum + project.completedTaskCount,
    0,
  );
  const total = projects.reduce((sum, project) => sum + project.taskCount, 0);
  const team = new Set(projects.flatMap((project) => project.memberIds));
  const active = projects.filter(
    (project) => project.taskCount === 0 || project.progress < 100,
  ).length;
  const stats = [
    {
      label: "Active Projects",
      value: active,
      icon: FolderKanban,
      detail: "Plans in motion",
    },
    {
      label: "Open Tasks",
      value: total - completed,
      icon: CircleDot,
      detail: "Across your projects",
    },
    {
      label: "Completed Tasks",
      value: completed,
      icon: CheckCheck,
      detail: "Progress made together",
    },
    {
      label: "Team Members",
      value: team.size,
      icon: Users,
      detail: "People in your projects",
    },
  ];
  const assigned = tasks.filter((task) => task.status !== "DONE").slice(0, 5);
  return (
    <>
      <div className="page-heading">
        <div>
          <p className="eyebrow !mt-0 !mb-3">Your workspace, at a glance</p>
          <h1>Welcome back, {user.name.split(" ")[0]}.</h1>
          <p>Here’s where things stand. Let’s keep them moving.</p>
        </div>
        <button className="btn btn-primary" onClick={() => setCreating(true)}>
          <Plus size={17} />
          New project
        </button>
      </div>
      <div className="mb-10 grid grid-cols-2 gap-3 xl:grid-cols-4 xl:gap-5">
        {stats.map((stat) => (
          <div key={stat.label} className="card p-4 sm:p-5">
            <div className="flex items-center justify-between gap-2">
              <span className="text-xs text-muted">{stat.label}</span>
              <stat.icon size={17} strokeWidth={1.6} className="text-muted" />
            </div>
            <p className="mt-5 text-3xl font-semibold tracking-tight">
              {stat.value}
            </p>
            <p className="mt-2 text-[11px] text-muted">{stat.detail}</p>
          </div>
        ))}
      </div>
      <section>
        <div className="mb-5 flex items-center justify-between">
          <h2 className="text-lg tracking-tight">Recent projects</h2>
          <Link
            href="/projects"
            className="flex min-h-11 items-center gap-2 text-xs font-medium text-muted"
          >
            All projects
            <ArrowRight size={15} />
          </Link>
        </div>
        {projects.length ? (
          <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
            {projects.slice(0, 3).map((project) => (
              <ProjectCard key={project.id} project={project} />
            ))}
          </div>
        ) : (
          <EmptyState
            title="Start with a project."
            description="Your dashboard will take shape as you create projects and work with your team."
          >
            <button
              className="btn btn-primary"
              onClick={() => setCreating(true)}
            >
              Create a project
              <Plus size={16} />
            </button>
          </EmptyState>
        )}
      </section>
      <section className="mt-10">
        <div className="mb-5 flex items-center justify-between">
          <div>
            <h2 className="text-lg tracking-tight">Your next moves</h2>
            <p className="mt-1.5 text-xs text-muted">
              Open tasks assigned to you.
            </p>
          </div>
          <Link
            href="/my-tasks"
            className="flex min-h-11 items-center gap-2 text-xs font-medium text-muted"
          >
            My Tasks
            <ArrowRight size={15} />
          </Link>
        </div>
        {assigned.length ? (
          <TaskList
            tasks={assigned}
            onUpdated={() => {
              void refreshTasks();
              void refreshProjects();
            }}
          />
        ) : (
          <EmptyState
            title="A clear view ahead."
            description="You have no open assigned tasks. Pick up work from a project, or take a moment to enjoy the progress."
          />
        )}
      </section>
      {creating && (
        <ProjectForm
          onClose={() => setCreating(false)}
          onSaved={(id) => {
            void refreshProjects();
            router.push(`/projects/${id}`);
          }}
        />
      )}
    </>
  );
}
