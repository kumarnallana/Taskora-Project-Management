"use client";
import { Dialog } from "@/components/shared/Dialog";
import { ErrorMessage } from "@/components/shared/Feedback";
import { projectsApi } from "@/services/api/projects";
import type { Project } from "@/types/domain";
import { useState, type FormEvent } from "react";
export function ProjectForm({
  project,
  onClose,
  onSaved,
}: {
  project?: Pick<Project, "id" | "name" | "description">;
  onClose: () => void;
  onSaved: (id: string) => void;
}) {
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<unknown>();
  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setBusy(true);
    setError(undefined);
    const form = new FormData(event.currentTarget);
    const input = {
      name: String(form.get("name")).trim(),
      description: String(form.get("description")).trim(),
    };
    try {
      const saved = project
        ? await projectsApi.update(project.id, input)
        : await projectsApi.create(input);
      onSaved(saved.id);
      onClose();
    } catch (failure) {
      setError(failure);
      setBusy(false);
    }
  }
  return (
    <Dialog
      title={project ? "Edit project" : "Create a project"}
      onClose={onClose}
      busy={busy}
    >
      <form onSubmit={submit} className="space-y-5">
        <ErrorMessage error={error} />
        <fieldset disabled={busy} className="space-y-5">
          <label className="field">
            Project name
            <input
              name="name"
              className="input"
              required
              maxLength={120}
              defaultValue={project?.name}
              placeholder="e.g. Website launch"
              autoFocus
            />
          </label>
          <label className="field">
            Description{" "}
            <span className="font-normal text-muted">
              Give your team a little direction.
            </span>
            <textarea
              name="description"
              className="input"
              maxLength={4000}
              defaultValue={project?.description}
              placeholder="What are we working towards?"
            />
          </label>
          <div className="flex justify-end gap-3 pt-3">
            <button
              className="btn btn-secondary"
              type="button"
              onClick={onClose}
            >
              Cancel
            </button>
            <button className="btn btn-primary" type="submit">
              {busy ? "Saving…" : project ? "Save changes" : "Create project"}
            </button>
          </div>
        </fieldset>
      </form>
    </Dialog>
  );
}
