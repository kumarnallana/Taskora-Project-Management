import type { ProjectSummary } from "@/types/domain";
import { ArrowUpRight, CheckCheck, FolderKanban, Users } from "lucide-react";
import Link from "next/link";
export function ProjectCard({ project }: { project: ProjectSummary }) {
  return (
    <Link
      href={`/projects/${project.id}`}
      className="project-card group card flex min-w-0 flex-col p-6 transition-all duration-300 hover:-translate-y-1 hover:shadow-lg hover:border-line-strong bg-white"
    >
      <div className="mb-6 flex items-center justify-between">
        <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-canvas text-muted transition-colors group-hover:bg-accent-soft group-hover:text-accent">
          <FolderKanban size={20} strokeWidth={1.8} />
        </span>
        <ArrowUpRight size={18} className="text-muted transition-colors group-hover:text-ink" />
      </div>
      <h2 className="truncate text-[17px] font-semibold tracking-tight text-ink">{project.name}</h2>
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
