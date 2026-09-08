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
import { TaskFlow } from "@/components/visualization/TaskFlow";
import { AnimatedNumber } from "@/components/shared/AnimatedNumber";

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
  const inProgress = projects.reduce(
    (sum, project) => sum + project.inProgressTaskCount,
    0,
  );
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
          <p className="eyebrow !mt-0 !mb-3">Your workspace</p>
          <h1>Welcome back, {user.name.split(" ")[0]}.</h1>
          <p className="mt-3 text-[15px] text-muted">
            <strong className="font-semibold text-ink">{total - completed} open tasks</strong> across {active} active projects.
          </p>
        </div>
        <div className="flex gap-3">
          <Link href="/my-tasks" className="btn btn-secondary hidden sm:inline-flex">
            View my tasks
          </Link>
          <button className="btn btn-primary" onClick={() => setCreating(true)}>
            <Plus size={17} />
            New project
          </button>
        </div>
      </div>
      <div className="mb-12 grid gap-5 lg:grid-cols-[1.8fr_1fr] xl:grid-cols-[65fr_35fr]">
        <TaskFlow 
          todo={total - inProgress - completed} 
          inProgress={inProgress} 
          done={completed} 
        />
        <div className="card flex flex-col justify-center bg-dark-product p-6 text-dark-text border-transparent shadow-md sm:p-8">
          <h2 className="eyebrow mb-6 !text-white/50">Workspace Metrics</h2>
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <span className="flex items-center gap-3 text-sm font-medium text-white/80">
                <CircleDot size={16} className="text-white/40" /> Open work
              </span>
              <span className="text-2xl font-bold tracking-tight">
                <AnimatedNumber value={total - completed} />
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="flex items-center gap-3 text-sm font-medium text-white/80">
                <FolderKanban size={16} className="text-amber" /> Active projects
              </span>
              <span className="text-2xl font-bold tracking-tight">
                <AnimatedNumber value={active} />
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="flex items-center gap-3 text-sm font-medium text-white/80">
                <Users size={16} className="text-white/40" /> Team
              </span>
              <span className="text-2xl font-bold tracking-tight">
                <AnimatedNumber value={team.size} />
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="flex items-center gap-3 text-sm font-medium text-white/80">
                <CheckCheck size={16} className="text-success" /> Completed
              </span>
              <span className="text-2xl font-bold tracking-tight">
                <AnimatedNumber value={completed} />
              </span>
            </div>
          </div>
        </div>
      </div>
      <div className="grid gap-10 lg:grid-cols-2 lg:gap-8">
        <section>
          <div className="mb-6 flex items-end justify-between border-b border-line pb-4">
            <div>
              <h2 className="text-lg tracking-tight">Active Projects</h2>
              <p className="mt-1 text-[13px] text-muted">What's moving right now</p>
            </div>
            <Link
              href="/projects"
              className="flex items-center gap-1.5 text-[13px] font-medium text-muted hover:text-ink transition-colors pb-1"
            >
              View all
              <ArrowRight size={15} />
            </Link>
          </div>
          {projects.length ? (
            <div className="grid gap-4">
              {projects.slice(0, 3).map((project) => (
                <ProjectCard key={project.id} project={project} />
              ))}
            </div>
          ) : (
            <EmptyState
              title="Start with a project."
              description="Plan your first project and give your work a home."
            >
              <button
                className="btn btn-primary mt-2"
                onClick={() => setCreating(true)}
              >
                Create a project
              </button>
            </EmptyState>
          )}
        </section>

        <section>
          <div className="mb-6 flex items-end justify-between border-b border-line pb-4">
            <div>
              <h2 className="text-lg tracking-tight">Next Actions</h2>
              <p className="mt-1 text-[13px] text-muted">Open tasks assigned to you</p>
            </div>
            <Link
              href="/my-tasks"
              className="flex items-center gap-1.5 text-[13px] font-medium text-muted hover:text-ink transition-colors pb-1"
            >
              My Tasks
              <ArrowRight size={15} />
            </Link>
          </div>
          {assigned.length ? (
            <div className="card bg-white p-2">
              <TaskList
                tasks={assigned}
                onUpdated={() => {
                  void refreshTasks();
                  void refreshProjects();
                }}
              />
            </div>
          ) : (
            <EmptyState
              title="A clear view ahead."
              description="You have no open assigned tasks. Enjoy the progress."
            />
          )}
        </section>
      </div>
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
