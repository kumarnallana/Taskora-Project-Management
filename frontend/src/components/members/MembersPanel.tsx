"use client";
import { useState, useEffect, type FormEvent } from "react";
import { UserPlus, Trash2, Crown, UserCheck, Loader2 } from "lucide-react";
import { Avatar } from "@/components/shared/Avatar";
import { Dialog, ConfirmDialog } from "@/components/shared/Dialog";
import { ErrorMessage } from "@/components/shared/Feedback";
import { projectsApi } from "@/services/api/projects";
import type { Member, User } from "@/types/domain";

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
  const [availableUsers, setAvailableUsers] = useState<User[]>([]);
  const [loadingAvailable, setLoadingAvailable] = useState(false);
  const [removing, setRemoving] = useState<Member | null>(null);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<unknown>();

  useEffect(() => {
    if (adding) {
      setLoadingAvailable(true);
      projectsApi
        .availableMembers(projectId)
        .then((users) => setAvailableUsers(users))
        .catch(() => setAvailableUsers([]))
        .finally(() => setLoadingAvailable(false));
    }
  }, [adding, projectId]);

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

  async function quickAdd(email: string) {
    setBusy(true);
    setError(undefined);
    try {
      await projectsApi.addMember(projectId, email);
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
            Owners and team leads manage tasks. Everyone can chat.
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

      {!adding && <ErrorMessage error={error} />}
      <div className="card divide-y divide-line">
        {members.map((member) => (
          <div
            key={member.user.id}
            className="flex min-w-0 flex-wrap items-center justify-between gap-3 p-5"
          >
            <div className="flex min-w-0 items-center gap-3">
              <Avatar name={member.user.name} image={member.user.avatarUrl} />
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
              <div className="flex items-center gap-2">
                <select
                  className="input !w-auto !text-xs"
                  aria-label={`Role for ${member.user.name}`}
                  value={member.role}
                  disabled={busy}
                  onChange={async (event) => {
                    setBusy(true);
                    setError(undefined);
                    try {
                      await projectsApi.setMemberRole(
                        projectId,
                        member.user.id,
                        event.target.value as Member["role"],
                      );
                      onUpdated();
                    } catch (failure) {
                      setError(failure);
                    } finally {
                      setBusy(false);
                    }
                  }}
                >
                  <option value="MEMBER">Team member</option>
                  <option value="LEAD">Team lead</option>
                </select>
                <button
                  className="icon-button text-muted"
                  aria-label={`Remove ${member.user.name}`}
                  onClick={() => setRemoving(member)}
                >
                  <Trash2 size={16} />
                </button>
              </div>
            ) : (
              <span className="badge bg-canvas text-muted">
                {member.role === "LEAD" ? "Team lead" : "Member"}
              </span>
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
          <ErrorMessage error={error} />

          <div className="mb-5">
            <p className="text-xs font-semibold text-ink mb-2">
              Registered teammates not in this project:
            </p>
            {loadingAvailable ? (
              <div className="flex items-center justify-center gap-2 py-4 text-xs text-muted">
                <Loader2 size={15} className="animate-spin" />
                Finding teammates…
              </div>
            ) : availableUsers.length > 0 ? (
              <div className="max-h-48 overflow-y-auto space-y-2 pr-1 rounded-xl border border-line bg-canvas p-2">
                {availableUsers.map((u) => (
                  <div
                    key={u.id}
                    className="flex items-center justify-between gap-3 p-2.5 rounded-lg bg-white border border-line/60 shadow-xs"
                  >
                    <div className="flex items-center gap-2.5 min-w-0">
                      <Avatar name={u.name} image={u.avatarUrl} />
                      <div className="min-w-0">
                        <p className="text-xs font-semibold text-ink truncate">
                          {u.name}
                        </p>
                        <p className="text-[11px] text-muted truncate">
                          {u.email}
                        </p>
                      </div>
                    </div>
                    <button
                      type="button"
                      disabled={busy}
                      onClick={() => quickAdd(u.email)}
                      className="btn btn-primary !h-8 !px-3 !text-xs shrink-0 cursor-pointer"
                    >
                      <UserCheck size={13} />
                      Add
                    </button>
                  </div>
                ))}
              </div>
            ) : (
              <div className="rounded-lg border border-dashed border-line bg-canvas/60 p-3 text-center text-xs text-muted">
                All registered users are already in this project.
              </div>
            )}
          </div>

          <div className="relative my-4 text-center">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-line" />
            </div>
            <span className="relative bg-white px-2 text-[11px] font-medium text-muted uppercase tracking-wider">
              Or invite by email
            </span>
          </div>

          <form onSubmit={add} className="space-y-4">
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
              />
            </label>
            <div className="flex justify-end gap-3 pt-2">
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
