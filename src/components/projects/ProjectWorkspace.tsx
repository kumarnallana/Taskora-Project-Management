"use client";
import Link from "next/link";
import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import useSWR, { useSWRConfig } from "swr";
import {
  ArrowLeft,
  Pencil,
  Trash2,
  ArrowRight,
  Users,
  CheckCheck,
} from "lucide-react";
import { api } from "@/services/api/client";
import { projectsApi } from "@/services/api/projects";
import { authApi } from "@/services/api/auth";
import { tasksApi } from "@/services/api/tasks";
import type { ProjectDetail, User } from "@/types/domain";
import { Loading, LoadError } from "@/components/shared/Feedback";
import { Avatar } from "@/components/shared/Avatar";
import { ConfirmDialog } from "@/components/shared/Dialog";
import { ProjectForm } from "./ProjectForm";
import { TaskBoard } from "@/components/tasks/TaskBoard";
import { MembersPanel } from "@/components/members/MembersPanel";
import { statuses } from "@data/tasks";

export function ProjectWorkspace({ id }: { id: string }) {
  const {
    data: project,
    error,
    mutate: refresh,
  } = useSWR<ProjectDetail>(projectsApi.detail(id), api);
  const { data: user } = useSWR<User>(authApi.me, api);
  const { mutate } = useSWRConfig();
  const searchParams = useSearchParams();
  const router = useRouter();
  const selected = searchParams.get("tab");
  const tab =
    selected === "tasks" || selected === "members" ? selected : "overview";
  const [editing, setEditing] = useState(false);
  const [deleting, setDeleting] = useState(false);
  function refreshWorkspace() {
    void mutate(
      (key) =>
        typeof key === "string" &&
        (key.startsWith("/api/projects") || key === tasksApi.mine),
    );
  }
  if (error)
    return (
      <>
        <Link className="btn btn-secondary mb-5" href="/projects">
          <ArrowLeft size={16} />
          Back to projects
        </Link>
        <LoadError error={error} retry={() => void refresh()} />
      </>
    );
  if (!project || !user) return <Loading />;
  const isOwner = project.ownerId === user.id;
  const done = project.tasks.filter((task) => task.status === "DONE").length;
  return (
    <>
      <Link
        href="/projects"
        className="mb-6 inline-flex min-h-11 items-center gap-2 text-xs text-muted"
      >
        <ArrowLeft size={15} />
        All projects
      </Link>
      <div className="page-heading">
        <div className="min-w-0">
          <p className="eyebrow !mt-0 !mb-3">Project workspace</p>
          <h1 className="break-words">{project.name}</h1>
          <p className="flex items-center gap-2 !text-xs">
            <Users size={14} />
            {project.members.length} members<span className="px-1">·</span>
            <CheckCheck size={14} />
            {done}/{project.tasks.length} tasks complete
          </p>
        </div>
        {isOwner && (
          <div className="flex shrink-0 gap-2">
            <button
              className="btn btn-secondary"
              onClick={() => setEditing(true)}
            >
              <Pencil size={15} />
              Edit project
            </button>
            <button
              className="icon-button text-muted"
              aria-label="Delete project"
              onClick={() => setDeleting(true)}
            >
              <Trash2 size={17} />
            </button>
          </div>
        )}
      </div>
      <nav
        aria-label="Project sections"
        className="mb-7 flex gap-7 border-b border-line"
      >
        {["overview", "tasks", "members"].map((name) => (
          <Link
            key={name}
            href={`/projects/${id}?tab=${name}`}
            className={`tab capitalize ${tab === name ? "active" : ""}`}
            aria-current={tab === name ? "page" : undefined}
          >
            {name[0].toUpperCase() + name.slice(1)}
            {name === "tasks" && (
              <span className="ml-2 text-xs text-muted">
                {project.tasks.length}
              </span>
            )}
          </Link>
        ))}
      </nav>
      {tab === "overview" && (
        <div className="grid items-start gap-6 xl:grid-cols-[1.6fr_1fr]">
          <div className="space-y-6">
            <section className="card p-6">
              <p className="eyebrow mb-5">The plan</p>
              <h2 className="mb-3 text-lg">About this project</h2>
              <p className="whitespace-pre-wrap text-sm leading-7 break-words text-muted">
                {project.description ||
                  "Add a description to give your team a shared direction."}
              </p>
              <div className="mt-8 flex items-center gap-3 border-t border-line pt-5">
                <Avatar name={project.owner.name} />
                <div>
                  <p className="text-xs font-semibold">{project.owner.name}</p>
                  <p className="mt-1 text-[11px] text-muted">Project owner</p>
                </div>
              </div>
            </section>
            <section className="card p-6">
              <div className="mb-6 flex items-center justify-between">
                <h2 className="text-lg">Work in focus</h2>
                <Link
                  href={`/projects/${id}?tab=tasks`}
                  className="flex min-h-11 items-center gap-2 text-xs text-accent"
                >
                  Open board
                  <ArrowRight size={15} />
                </Link>
              </div>
              <div className="grid grid-cols-3 gap-3">
                {statuses.map((status) => (
                  <div key={status.value} className="rounded-lg bg-canvas p-4">
                    <p className="text-xs text-muted">{status.label}</p>
                    <p className="mt-3 text-2xl font-semibold">
                      {
                        project.tasks.filter(
                          (task) => task.status === status.value,
                        ).length
                      }
                    </p>
                  </div>
                ))}
              </div>
            </section>
          </div>
          <section className="card p-6">
            <p className="eyebrow mb-6">Every step counts</p>
            <div className="mb-5 flex items-end justify-between">
              <h2 className="text-lg">Project progress</h2>
              <span className="text-3xl font-semibold tracking-tight text-accent">
                {project.progress}%
              </span>
            </div>
            <div
              className="progress-track !h-2"
              role="progressbar"
              aria-label="Project completion"
              aria-valuenow={project.progress}
              aria-valuemin={0}
              aria-valuemax={100}
            >
              <div
                className="progress-fill"
                style={{ width: `${project.progress}%` }}
              />
            </div>
            <p className="mt-4 text-xs leading-relaxed text-muted">
              {project.tasks.length
                ? `${done} of ${project.tasks.length} tasks complete. Progress updates as your team finishes work.`
                : "No tasks yet. Add your first task to start tracking progress."}
            </p>
            <div className="mt-8 border-t border-line pt-5">
              <p className="mb-3 text-xs font-semibold">Project team</p>
              <div className="flex flex-wrap gap-2">
                {project.members.slice(0, 8).map((member) => (
                  <span key={member.user.id} title={member.user.name}>
                    <Avatar name={member.user.name} />
                  </span>
                ))}
              </div>
              <Link
                href={`/projects/${id}?tab=members`}
                className="mt-4 inline-flex min-h-11 items-center gap-2 text-xs text-accent"
              >
                View all members
                <ArrowRight size={14} />
              </Link>
            </div>
          </section>
        </div>
      )}
      {tab === "tasks" && (
        <TaskBoard
          projectId={id}
          tasks={project.tasks}
          members={project.members}
          onUpdated={refreshWorkspace}
          selectedTaskId={searchParams.get("task")}
        />
      )}
      {tab === "members" && (
        <MembersPanel
          projectId={id}
          ownerId={project.ownerId}
          members={project.members}
          isOwner={isOwner}
          onUpdated={refreshWorkspace}
        />
      )}
      {editing && (
        <ProjectForm
          project={project}
          onClose={() => setEditing(false)}
          onSaved={refreshWorkspace}
        />
      )}
      {deleting && (
        <ConfirmDialog
          title="Delete this project?"
          description={`“${project.name}” and all its tasks and memberships will be permanently deleted.`}
          onClose={() => setDeleting(false)}
          action={async () => {
            await projectsApi.remove(id);
            await mutate(projectsApi.detail(id), undefined, {
              revalidate: false,
            });
            void mutate(projectsApi.list);
            void mutate(tasksApi.mine);
            router.replace("/projects");
          }}
        />
      )}
    </>
  );
}
