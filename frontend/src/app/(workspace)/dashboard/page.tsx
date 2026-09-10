"use client";
import Link from "next/link";
import dynamic from "next/dynamic";
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
import { Loading, LoadError } from "@/components/shared/Feedback";
import { ProjectForm } from "@/components/projects/ProjectForm";
import { TaskList } from "@/components/tasks/TaskList";
import { AnimatedNumber } from "@/components/shared/AnimatedNumber";

const TaskFlow = dynamic(
  () =>
    import("@/components/visualization/TaskFlow").then(
      (module) => module.TaskFlow,
    ),
  {
    loading: () => (
      <div className="delivery-flow min-h-80" role="status">
        Loading delivery overview…
      </div>
    ),
  },
);

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
  );
  const assigned = tasks
    .filter((task) => task.status !== "DONE")
    .sort(
      (a, b) =>
        Number(b.status === "IN_PROGRESS") - Number(a.status === "IN_PROGRESS"),
    )
    .slice(0, 4);
  const stats = [
    {
      label: "Open work",
      value: total - completed,
      icon: CircleDot,
      detail: "Tasks to move forward",
    },
    {
      label: "Active projects",
      value: active.length,
      icon: FolderKanban,
      detail: "Shared plans in motion",
    },
    {
      label: "Team",
      value: team.size,
      icon: Users,
      detail: "People across your projects",
    },
    {
      label: "Completed",
      value: completed,
      icon: CheckCheck,
      detail: "Tasks delivered together",
    },
  ];
  return (
    <>
      <div className="page-heading">
        <div className="min-w-0">
          <p className="eyebrow !mt-0 !mb-3">Your workspace</p>
          <h1 className="break-words">
            Welcome back, {user.name.split(" ")[0]}.
          </h1>
          <p>
            {projects.length
              ? `${total - completed} open tasks across ${active.length} active projects.`
              : "A clear place for your next great piece of work."}
          </p>
        </div>
        <div className="flex shrink-0 gap-3">
          <Link
            href="/my-tasks"
            className="btn btn-secondary hidden xl:inline-flex"
          >
            View my tasks
          </Link>
          <button className="btn btn-primary" onClick={() => setCreating(true)}>
            <Plus size={17} />
            New project
          </button>
        </div>
      </div>
      {!projects.length ? (
        <section className="onboarding">
          <div>
            <span className="auth-symbol">
              <FolderKanban size={22} />
            </span>
            <h2 className="text-2xl tracking-tight">
              Make room for the work that matters.
            </h2>
            <p className="mt-4 max-w-md text-sm leading-relaxed text-muted">
              Start with one project. Add your team, give every task an owner,
              and see your progress take shape.
            </p>
            <button
              className="btn btn-primary mt-6"
              onClick={() => setCreating(true)}
            >
              Create first project
              <ArrowRight size={16} />
            </button>
          </div>
          <ol className="onboarding-steps">
            <li>
              <span>01</span>
              <div>
                <strong>Plan</strong>
                <p>Give your goal a shared home.</p>
              </div>
            </li>
            <li>
              <span>02</span>
              <div>
                <strong>Assign</strong>
                <p>Connect your team to the next step.</p>
              </div>
            </li>
            <li>
              <span>03</span>
              <div>
                <strong>Deliver</strong>
                <p>Turn completed work into progress.</p>
              </div>
            </li>
          </ol>
        </section>
      ) : (
        <>
          <div className="dashboard-overview">
            <div className="dashboard-chart">
              <TaskFlow
                todo={total - completed - inProgress}
                inProgress={inProgress}
                done={completed}
              />
            </div>
            <section className="metric-rail" aria-label="Workspace metrics">
              {stats.map((stat) => (
                <div key={stat.label} className="metric-row">
                  <stat.icon size={18} strokeWidth={1.7} />
                  <div>
                    <p className="text-sm font-medium">{stat.label}</p>
                    <p className="metric-detail">{stat.detail}</p>
                  </div>
                  <strong className="text-2xl font-semibold">
                    <AnimatedNumber value={stat.value} />
                  </strong>
                </div>
              ))}
            </section>
          </div>
          <div className="dashboard-focus">
            <section className="min-w-0">
              <div className="module-heading">
                <div>
                  <h2>Your next moves</h2>
                  <p>Open work assigned to you, in focus.</p>
                </div>
                <Link href="/my-tasks">
                  My Tasks
                  <ArrowRight size={15} />
                </Link>
              </div>
              {assigned.length ? (
                <TaskList
                  tasks={assigned}
                  onUpdated={() =>
                    Promise.all([refreshTasks(), refreshProjects()])
                  }
                />
              ) : (
                <div className="compact-empty">
                  <CheckCheck size={24} className="text-success" />
                  <h3>You're all caught up.</h3>
                  <p>
                    No open tasks are assigned to you. Your projects are ready
                    when you are.
                  </p>
                  <Link href="/projects" className="text-accent">
                    Open projects
                    <ArrowRight size={15} />
                  </Link>
                </div>
              )}
            </section>
            <section className="min-w-0">
              <div className="module-heading">
                <div>
                  <h2>Active projects</h2>
                  <p>The plans your team is moving forward.</p>
                </div>
                <Link href="/projects">
                  View all
                  <ArrowRight size={15} />
                </Link>
              </div>
              {active.length ? (
                <div className="project-rows">
                  {active.slice(0, 4).map((project) => (
                    <Link
                      key={project.id}
                      href={`/projects/${project.id}`}
                      className="project-row"
                    >
                      <div className="flex items-start justify-between gap-3">
                        <div className="min-w-0">
                          <h3 className="break-words text-sm">
                            {project.name}
                          </h3>
                          <p className="mt-2 text-xs text-muted">
                            {project.taskCount === 0
                              ? "Ready for the first task"
                              : `${project.inProgressTaskCount} in progress · ${project.completedTaskCount}/${project.taskCount} complete`}
                          </p>
                        </div>
                        <ArrowRight size={16} className="shrink-0 text-muted" />
                      </div>
                      <div className="mt-4 flex items-center gap-4">
                        <div className="progress-track flex-1">
                          <div
                            className="progress-fill"
                            style={{ width: `${project.progress}%` }}
                          />
                        </div>
                        <span className="text-xs font-semibold">
                          {project.progress}%
                        </span>
                      </div>
                      <p className="mt-3 flex items-center gap-2 text-xs text-muted">
                        <Users size={13} />
                        {project.memberCount}{" "}
                        {project.memberCount === 1 ? "member" : "members"}
                      </p>
                    </Link>
                  ))}
                </div>
              ) : (
                <div className="compact-empty">
                  <CheckCheck size={24} className="text-success" />
                  <h3>Every project delivered.</h3>
                  <p>
                    All your current projects are complete. Start a new one when
                    you're ready.
                  </p>
                  <button
                    className="btn btn-secondary"
                    onClick={() => setCreating(true)}
                  >
                    New project
                    <Plus size={15} />
                  </button>
                </div>
              )}
            </section>
          </div>
        </>
      )}
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
