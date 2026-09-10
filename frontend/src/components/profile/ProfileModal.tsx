"use client";
import { useState, type FormEvent } from "react";
import { Dialog } from "@/components/shared/Dialog";
import { Avatar } from "@/components/shared/Avatar";
import { ErrorMessage } from "@/components/shared/Feedback";
import { authApi } from "@/services/api/auth";
import type { User } from "@/types/domain";
import { useSWRConfig } from "swr";
import { Camera, Check, Sparkles } from "lucide-react";

const AVATAR_PRESETS = [
  "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80",
  "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80",
  "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&auto=format&fit=crop&q=80",
  "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop&q=80",
  "https://images.unsplash.com/photo-1517841905240-472988babdf9?w=150&auto=format&fit=crop&q=80",
  "https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=150&auto=format&fit=crop&q=80",
];

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
  const [savedNotice, setSavedNotice] = useState(false);

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setBusy(true);
    setError(undefined);
    setSavedNotice(false);

    const form = new FormData(event.currentTarget);
    const newPassword = String(form.get("password") || "").trim();

    const payload: {
      name?: string;
      email?: string;
      avatarUrl?: string;
      password?: string;
    } = {
      name: name.trim(),
      email: email.trim(),
      avatarUrl: avatarUrl.trim(),
    };

    if (newPassword) {
      payload.password = newPassword;
    }

    try {
      const updated = await authApi.updateProfile(payload);
      // Update local SWR cache across entire app
      await mutate(authApi.me, updated, { revalidate: true });
      // Also revalidate projects to update avatar in project member lists
      await mutate((key: unknown) => typeof key === "string" && key.startsWith("/api/projects"));

      setSavedNotice(true);
      setTimeout(() => {
        onClose();
      }, 700);
    } catch (failure) {
      setError(failure);
      setBusy(false);
    }
  }

  return (
    <Dialog title="Edit profile" onClose={onClose} busy={busy}>
      <form onSubmit={submit} className="space-y-5">
        <ErrorMessage error={error} />
        {savedNotice && (
          <div className="flex items-center gap-2 rounded-lg bg-emerald-50 px-3 py-2 text-xs font-medium text-emerald-800 border border-emerald-200">
            <Check size={16} /> Profile updated successfully!
          </div>
        )}

        {/* Avatar preview and selection */}
        <div className="flex flex-col sm:flex-row items-center gap-4 rounded-xl bg-canvas p-4 border border-line">
          <div className="relative">
            <Avatar name={name || user.name} image={avatarUrl || null} />
          </div>
          <div className="flex-1 text-center sm:text-left min-w-0">
            <p className="text-xs font-semibold text-ink">Profile Picture</p>
            <p className="text-[11px] text-muted mt-0.5">
              Choose a preset avatar below or paste a custom image URL.
            </p>
            <div className="mt-2.5 flex flex-wrap items-center justify-center sm:justify-start gap-2">
              {AVATAR_PRESETS.map((preset, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => setAvatarUrl(preset)}
                  className={`h-7 w-7 overflow-hidden rounded-full border-2 transition-all ${
                    avatarUrl === preset
                      ? "border-accent scale-110 shadow-sm"
                      : "border-line/60 hover:border-ink/40 opacity-80 hover:opacity-100"
                  }`}
                >
                  <img src={preset} alt="preset" className="h-full w-full object-cover" />
                </button>
              ))}
              {avatarUrl && (
                <button
                  type="button"
                  onClick={() => setAvatarUrl("")}
                  className="text-[11px] text-muted hover:text-danger underline ml-1"
                >
                  Reset
                </button>
              )}
            </div>
          </div>
        </div>

        <fieldset disabled={busy} className="space-y-4">
          <label className="field">
            Avatar Image URL (Optional)
            <div className="relative">
              <input
                className="input !pl-9 text-xs"
                name="avatarUrl"
                value={avatarUrl}
                onChange={(e) => setAvatarUrl(e.target.value)}
                placeholder="https://example.com/your-avatar.jpg"
              />
              <Camera size={15} className="absolute left-3 top-3.5 text-muted" />
            </div>
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
              onChange={(e) => setName(e.target.value)}
              placeholder="Your full name"
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
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@company.com"
            />
          </label>

          <label className="field">
            New password (Optional)
            <input
              className="input"
              name="password"
              type="password"
              minLength={8}
              placeholder="Leave blank to keep your current password"
            />
            <span className="text-[11px] text-muted mt-1">
              Minimum 8 characters. Leave empty if you do not wish to change it.
            </span>
          </label>

          <div className="flex items-center justify-end gap-3 pt-3 border-t border-line">
            <button
              className="btn btn-secondary"
              type="button"
              onClick={onClose}
              disabled={busy}
            >
              Cancel
            </button>
            <button className="btn btn-primary" type="submit" disabled={busy}>
              {busy ? "Saving…" : "Save changes"}
            </button>
          </div>
        </fieldset>
      </form>
    </Dialog>
  );
}
