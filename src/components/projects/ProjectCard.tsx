import type { ProjectSummary } from "@/types/domain";
import { ArrowUpRight, CheckCheck, FolderKanban, Users } from "lucide-react";
import Link from "next/link";
export function ProjectCard({ project }: { project: ProjectSummary }) {
  return (
    <Link
      href={`/projects/${project.id}`}
      className="project-card card flex min-w-0 flex-col p-6"
    >
      <div className="mb-5 flex items-center justify-between">
        <span className="flex h-10 w-10 items-center justify-center rounded-lg bg-canvas text-muted">
          <FolderKanban size={21} strokeWidth={1.5} />
        </span>
        <ArrowUpRight size={18} className="text-muted" />
      </div>
      <h2 className="truncate text-base">{project.name}</h2>
      <p className="mt-2 mb-6 line-clamp-2 min-h-10 text-xs leading-relaxed text-muted">
        {project.description || "A fresh project, ready to take shape."}
      </p>
      <div className="mt-auto">
        <div className="mb-2 flex justify-between text-xs">
          <span className="text-muted">Progress</span>
          <span className="font-semibold">{project.progress}%</span>
        </div>
        <div
          className="progress-track"
          role="progressbar"
          aria-label={`${project.name} progress`}
          aria-valuenow={project.progress}
          aria-valuemin={0}
          aria-valuemax={100}
        >
          <div
            className="progress-fill"
            style={{ width: `${project.progress}%` }}
          />
        </div>
        <div className="mt-5 flex items-center justify-between border-t border-line pt-4 text-[11px] text-muted">
          <span className="flex items-center gap-1.5">
            <CheckCheck size={14} />
            {project.completedTaskCount}/{project.taskCount} tasks
          </span>
          <span className="flex items-center gap-1.5">
            <Users size={14} />
            {project.memberCount}{" "}
            {project.memberCount === 1 ? "member" : "members"}
          </span>
        </div>
      </div>
    </Link>
  );
}
