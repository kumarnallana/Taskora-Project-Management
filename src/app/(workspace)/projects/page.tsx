"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import useSWR from "swr";
import { Plus, Search } from "lucide-react";
import { api } from "@/services/api/client";
import { projectsApi } from "@/services/api/projects";
import type { ProjectSummary } from "@/types/domain";
import { ProjectCard } from "@/components/projects/ProjectCard";
import { ProjectForm } from "@/components/projects/ProjectForm";
import { Loading, LoadError, EmptyState } from "@/components/shared/Feedback";

export default function ProjectsPage() {
  const { data, error, mutate } = useSWR<ProjectSummary[]>(
    projectsApi.list,
    api,
  );
  const [creating, setCreating] = useState(false);
  const [search, setSearch] = useState("");
  const router = useRouter();
  if (error) return <LoadError error={error} retry={() => void mutate()} />;
  if (!data) return <Loading />;
  const projects = data.filter((project) =>
    project.name.toLowerCase().includes(search.toLowerCase()),
  );
  return (
    <>
      <div className="page-heading">
        <div>
          <p className="eyebrow !mt-0 !mb-3">A place for every plan</p>
          <h1>Projects</h1>
          <p>Your team’s work, all in one place.</p>
        </div>
        <button className="btn btn-primary" onClick={() => setCreating(true)}>
          <Plus size={17} />
          New project
        </button>
      </div>
      <div className="mb-6 flex flex-wrap items-center justify-between gap-4">
        <span className="text-sm font-medium">
          All projects{" "}
          <span className="ml-2 rounded-md bg-white px-2 py-1 text-xs text-muted">
            {data.length}
          </span>
        </span>
        <label className="relative w-full sm:w-64">
          <span className="sr-only">Search projects</span>
          <Search size={16} className="absolute top-3.5 left-3 text-muted" />
          <input
            className="input !pl-10"
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            placeholder="Search projects…"
            type="search"
          />
        </label>
      </div>
      {projects.length ? (
        <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
          {projects.map((project) => (
            <ProjectCard key={project.id} project={project} />
          ))}
        </div>
      ) : (
        <EmptyState
          title={
            search ? "No matching projects" : "Your next project starts here."
          }
          description={
            search
              ? "Try another project name."
              : "Create a project, bring in your team, and give your work a clear direction."
          }
        >
          {!search && (
            <button
              className="btn btn-primary"
              onClick={() => setCreating(true)}
            >
              <Plus size={16} />
              Create your first project
            </button>
          )}
        </EmptyState>
      )}
      {creating && (
        <ProjectForm
          onClose={() => setCreating(false)}
          onSaved={(id) => {
            void mutate();
            router.push(`/projects/${id}`);
          }}
        />
      )}
    </>
  );
}
