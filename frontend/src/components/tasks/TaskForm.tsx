"use client";
import { useState, type FormEvent } from "react";
import { Dialog } from "@/components/shared/Dialog";
import { ErrorMessage } from "@/components/shared/Feedback";
import { tasksApi } from "@/services/api/tasks";
import { statuses } from "@data/tasks";
import type { Member, Task, TaskStatus } from "@/types/domain";

export function TaskForm({
  projectId,
  members,
  task,
  initialStatus = "TODO",
  onClose,
  onSaved,
}: {
  projectId: string;
  members: Member[];
  task?: Task;
  initialStatus?: TaskStatus;
  onClose: () => void;
  onSaved: () => void;
}) {
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<unknown>();
  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = new FormData(event.currentTarget);
    const input = {
      title: String(form.get("title")).trim(),
      description: String(form.get("description")).trim(),
      status: String(form.get("status")) as TaskStatus,
      assigneeId: String(form.get("assigneeId")) || null,
    };
    setBusy(true);
    setError(undefined);
    try {
      if (task) await tasksApi.update(task.id, input);
      else await tasksApi.create(projectId, input);
      onSaved();
      onClose();
    } catch (failure) {
      setError(failure);
      setBusy(false);
    }
  }
  return (
    <Dialog
      title={task ? "Edit task" : "Create a task"}
      onClose={onClose}
      busy={busy}
    >
      <form onSubmit={submit} className="space-y-5">
        <ErrorMessage error={error} />
        <fieldset disabled={busy} className="space-y-5">
          <label className="field">
            Task title
            <input
              className="input"
              name="title"
              required
              maxLength={160}
              defaultValue={task?.title}
              placeholder="What needs to happen?"
              autoFocus
            />
          </label>
          <label className="field">
            Description
            <textarea
              className="input"
              name="description"
              maxLength={4000}
              defaultValue={task?.description}
              placeholder="Add the details your team needs…"
            />
          </label>
          <div className="grid gap-5 sm:grid-cols-2">
            <label className="field">
              Status
              <select
                className="input"
                name="status"
                defaultValue={task?.status || initialStatus}
              >
                {statuses.map((status) => (
                  <option key={status.value} value={status.value}>
                    {status.label}
                  </option>
                ))}
              </select>
            </label>
            <label className="field">
              Assignee
              <select
                className="input"
                name="assigneeId"
                defaultValue={task?.assigneeId || ""}
              >
                <option value="">Unassigned</option>
                {members.map((member) => (
                  <option key={member.user.id} value={member.user.id}>
                    {member.user.name}
                  </option>
                ))}
              </select>
            </label>
          </div>
          <div className="flex justify-end gap-3 pt-3">
            <button
              className="btn btn-secondary"
              type="button"
              onClick={onClose}
            >
              Cancel
            </button>
            <button className="btn btn-primary" type="submit">
              {busy ? "Saving…" : task ? "Save changes" : "Create task"}
            </button>
          </div>
        </fieldset>
      </form>
    </Dialog>
  );
}
