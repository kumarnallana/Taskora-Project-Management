"use client";
import { useEffect, useRef, useState, type FormEvent } from "react";
import { useSWRConfig } from "swr";
import { Camera } from "lucide-react";
import { Dialog } from "@/components/shared/Dialog";
import { Avatar } from "@/components/shared/Avatar";
import { ErrorMessage } from "@/components/shared/Feedback";
import { authApi } from "@/services/api/auth";
import { chatApi } from "@/services/api/chat";
import type { User } from "@/types/domain";

export function ProfileModal({
  user,
  onClose,
}: {
  user: User;
  onClose: () => void;
}) {
  const { mutate } = useSWRConfig();
  const [name, setName] = useState(user.name);
  const [email, setEmail] = useState(user.email);
  const [avatarUrl, setAvatarUrl] = useState(user.avatarUrl || "");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<unknown>();
  const pending = useRef<string[]>([]);
  useEffect(
    () => () => {
      for (const id of pending.current)
        void chatApi.removeFile(id).catch(() => {});
    },
    [],
  );
  async function upload(file?: File) {
    if (!file) return;
    if (file.size > 5 * 1024 * 1024) {
      setError(new Error("Choose a photo up to 5 MB."));
      return;
    }
    setBusy(true);
    setError(undefined);
    try {
      const uploaded = await chatApi.upload(file, { purpose: "avatar" });
      pending.current.push(uploaded.id);
      setAvatarUrl("/api/files/" + uploaded.id);
    } catch (failure) {
      setError(failure);
    } finally {
      setBusy(false);
    }
  }
  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setBusy(true);
    setError(undefined);
    const password = String(
      new FormData(event.currentTarget).get("password") || "",
    );
    try {
      const updated = await authApi.updateProfile({
        name: name.trim(),
        email: email.trim(),
        avatarUrl: avatarUrl.trim(),
        ...(password ? { password } : {}),
      });
      pending.current = pending.current.filter(
        (id) => "/api/files/" + id !== updated.avatarUrl,
      );
      if (
        user.avatarUrl?.startsWith("/api/files/") &&
        user.avatarUrl !== updated.avatarUrl
      )
        void chatApi.removeFile(user.avatarUrl.slice(11)).catch(() => {});
      await mutate(authApi.me, updated, { revalidate: false });
      void mutate(
        (key: unknown) =>
          typeof key === "string" &&
          (key.startsWith("/api/projects") || key.startsWith("/api/chat")),
      );
      onClose();
    } catch (failure) {
      setError(failure);
      setBusy(false);
    }
  }
  return (
    <Dialog title="Edit profile" onClose={onClose} busy={busy}>
      <form onSubmit={submit} className="space-y-5">
        <ErrorMessage error={error} />
        <fieldset disabled={busy} className="space-y-4">
          <div className="flex flex-wrap items-center gap-4 rounded-xl border border-line bg-canvas p-4">
            <Avatar name={name || user.name} image={avatarUrl} />
            <div className="min-w-0 flex-1">
              <p className="text-sm font-semibold">Your profile photo</p>
              <p className="mt-1 text-xs text-muted">
                JPG, PNG, WebP, or GIF · up to 5 MB
              </p>
              <label className="btn btn-secondary mt-3 cursor-pointer">
                <Camera size={15} />
                {busy ? "Please wait…" : "Upload photo"}
                <input
                  type="file"
                  accept="image/jpeg,image/png,image/webp,image/gif"
                  className="sr-only"
                  aria-label="Upload profile photo"
                  onChange={(event) => {
                    void upload(event.target.files?.[0]);
                    event.target.value = "";
                  }}
                />
              </label>
              {avatarUrl && (
                <button
                  type="button"
                  className="ml-3 text-xs text-muted underline"
                  onClick={() => setAvatarUrl("")}
                >
                  Remove photo
                </button>
              )}
            </div>
          </div>
          <label className="field">
            Image URL (optional)
            <input
              className="input"
              value={avatarUrl}
              onChange={(event) => setAvatarUrl(event.target.value)}
              maxLength={2000}
              placeholder="https://example.com/your-photo.jpg"
            />
          </label>
          <label className="field">
            Full name
            <input
              className="input"
              name="name"
              required
              minLength={2}
              maxLength={80}
              value={name}
              onChange={(event) => setName(event.target.value)}
            />
          </label>
          <label className="field">
            Email address
            <input
              className="input"
              name="email"
              type="email"
              required
              maxLength={254}
              value={email}
              onChange={(event) => setEmail(event.target.value)}
            />
          </label>
          <label className="field">
            New password (optional)
            <input
              className="input"
              name="password"
              type="password"
              minLength={8}
              autoComplete="new-password"
              placeholder="Leave blank to keep your current password"
            />
          </label>
          <div className="flex justify-end gap-3 border-t border-line pt-4">
            <button
              type="button"
              className="btn btn-secondary"
              onClick={onClose}
            >
              Cancel
            </button>
            <button className="btn btn-primary" type="submit">
              {busy ? "Saving…" : "Save changes"}
            </button>
          </div>
        </fieldset>
      </form>
    </Dialog>
  );
}
