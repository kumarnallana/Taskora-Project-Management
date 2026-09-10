"use client";
import { useState, type FormEvent } from "react";
import { UserPlus, Trash2, Crown } from "lucide-react";
import { Avatar } from "@/components/shared/Avatar";
import { Dialog, ConfirmDialog } from "@/components/shared/Dialog";
import { ErrorMessage } from "@/components/shared/Feedback";
import { projectsApi } from "@/services/api/projects";
import type { Member } from "@/types/domain";

export function MembersPanel({
  projectId,
  ownerId,
  members,
  isOwner,
  onUpdated,
}: {
  projectId: string;
  ownerId: string;
  members: Member[];
  isOwner: boolean;
  onUpdated: () => void;
}) {
  const [adding, setAdding] = useState(false);
  const [removing, setRemoving] = useState<Member | null>(null);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<unknown>();
  async function add(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setBusy(true);
    setError(undefined);
    const form = new FormData(event.currentTarget);
    try {
      await projectsApi.addMember(projectId, String(form.get("email")));
      onUpdated();
      setAdding(false);
    } catch (failure) {
      setError(failure);
    } finally {
      setBusy(false);
    }
  }
  return (
    <>
      <div className="mb-6 flex flex-wrap items-center justify-between gap-4">
        <div>
          <h2 className="text-lg">The people behind the project</h2>
          <p className="mt-2 text-xs text-muted">
            {members.length} {members.length === 1 ? "member" : "members"} ·
            Everyone can create and update tasks.
          </p>
        </div>
        {isOwner && (
          <button
            className="btn btn-primary"
            onClick={() => {
              setError(undefined);
              setAdding(true);
            }}
          >
            <UserPlus size={16} />
            Add member
          </button>
        )}
      </div>
      <div className="card divide-y divide-line">
        {members.map((member) => (
          <div
            key={member.user.id}
            className="flex min-w-0 items-center justify-between gap-3 p-5"
          >
            <div className="flex min-w-0 items-center gap-3">
              <Avatar name={member.user.name} />
              <div className="min-w-0">
                <p className="truncate text-sm font-semibold">
                  {member.user.name}
                </p>
                <p className="mt-1 truncate text-xs text-muted">
                  {member.user.email}
                </p>
              </div>
            </div>
            {member.user.id === ownerId ? (
              <span className="badge bg-canvas text-muted">
                <Crown size={13} />
                Owner
              </span>
            ) : isOwner ? (
              <button
                className="icon-button text-muted"
                aria-label={`Remove ${member.user.name}`}
                onClick={() => setRemoving(member)}
              >
                <Trash2 size={16} />
              </button>
            ) : (
              <span className="badge bg-canvas text-muted">Member</span>
            )}
          </div>
        ))}
      </div>
      {adding && (
        <Dialog
          title="Add a project member"
          onClose={() => setAdding(false)}
          busy={busy}
        >
          <p className="mb-5 text-sm leading-relaxed text-muted">
            Add someone who already has a Taskora account. They’ll be able to
            view this project and work on its tasks.
          </p>
          <form onSubmit={add} className="space-y-5">
            <ErrorMessage error={error} />
            <label className="field">
              Email
              <input
                className="input"
                name="email"
                type="email"
                required
                maxLength={254}
                placeholder="teammate@company.com"
                disabled={busy}
                autoFocus
              />
            </label>
            <div className="flex justify-end gap-3">
              <button
                className="btn btn-secondary"
                type="button"
                onClick={() => setAdding(false)}
                disabled={busy}
              >
                Cancel
              </button>
              <button className="btn btn-primary" type="submit" disabled={busy}>
                {busy ? "Adding…" : "Add member"}
              </button>
            </div>
          </form>
        </Dialog>
      )}
      {removing && (
        <ConfirmDialog
          title="Remove member?"
          description={`${removing.user.name} will lose access to this project. Their tasks will become unassigned.`}
          label="Remove member"
          onClose={() => setRemoving(null)}
          action={async () => {
            await projectsApi.removeMember(projectId, removing.user.id);
            onUpdated();
          }}
        />
      )}
    </>
  );
}
