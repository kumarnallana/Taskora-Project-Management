"use client";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState, type FormEvent } from "react";
import { useSWRConfig } from "swr";
import { ArrowRight, Eye, EyeOff } from "lucide-react";
import { motion, useReducedMotion } from "framer-motion";
import { authApi } from "@/services/api/auth";
import { ErrorMessage } from "@/components/shared/Feedback";

export function AuthForm({ register = false }: { register?: boolean }) {
  const router = useRouter();
  const { mutate } = useSWRConfig();
  const [busy, setBusy] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [error, setError] = useState<unknown>();
  const reduced = useReducedMotion();
  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = new FormData(event.currentTarget);
    const password = String(form.get("password"));
    if (register && password !== form.get("confirm")) {
      setError(new Error("Your passwords do not match."));
      return;
    }
    if (new TextEncoder().encode(password).length > 72) {
      setError(new Error("Your password must be at most 72 bytes."));
      return;
    }
    setBusy(true);
    setError(undefined);
    try {
      const input = { email: String(form.get("email")), password };
      const user = register
        ? await authApi.register({ ...input, name: String(form.get("name")) })
        : await authApi.login(input);
      await mutate(() => true, undefined, { revalidate: false });
      await mutate(authApi.me, user, false);
      router.replace("/dashboard");
    } catch (failure) {
      setError(failure);
      setBusy(false);
    }
  }
  return (
    <motion.div
      initial={reduced ? false : { opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35 }}
      className="w-full max-w-md rounded-2xl border border-line bg-white p-8 shadow-sm sm:p-10"
    >
      <p className="eyebrow mb-3 text-accent">Your workspace</p>
      <h1 className="text-3xl font-semibold tracking-tight">
        {register ? "A fresh start for your team." : "Welcome back."}
      </h1>
      <p className="mt-3 mb-8 text-[15px] leading-relaxed text-muted">
        {register
          ? "Create your account and give your next project a home."
          : "Sign in to pick up where your team left off."}
      </p>
      <form onSubmit={submit} className="space-y-5">
        <ErrorMessage error={error} />
        <fieldset disabled={busy} className="space-y-5">
          {register && (
            <label className="field">
              Full Name
              <input
                className="input"
                name="name"
                autoComplete="name"
                required
                minLength={2}
                maxLength={80}
                placeholder="Your full name"
              />
            </label>
          )}
          <label className="field">
            Email
            <input
              className="input"
              name="email"
              type="email"
              autoComplete="email"
              required
              maxLength={254}
              placeholder="you@company.com"
            />
          </label>
          <label className="field">
            Password
            <div className="relative">
              <input
                className="input pr-12"
                name="password"
                type={showPassword ? "text" : "password"}
                autoComplete={register ? "new-password" : "current-password"}
                required
                minLength={8}
                maxLength={72}
                placeholder={
                  register ? "At least 8 characters" : "Enter your password"
                }
              />
              <button
                type="button"
                className="absolute right-0 top-0 flex h-full w-12 items-center justify-center text-muted hover:text-ink transition-colors"
                aria-label={showPassword ? "Hide password" : "Show password"}
                onClick={() => setShowPassword((v) => !v)}
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
          </label>
          {register && (
            <label className="field">
              Confirm Password
              <div className="relative">
                <input
                  className="input pr-12"
                  name="confirm"
                  type={showConfirm ? "text" : "password"}
                  autoComplete="new-password"
                  required
                  minLength={8}
                  maxLength={72}
                  placeholder="Enter your password again"
                />
                <button
                  type="button"
                  className="absolute right-0 top-0 flex h-full w-12 items-center justify-center text-muted hover:text-ink transition-colors"
                  aria-label={showConfirm ? "Hide confirmation password" : "Show confirmation password"}
                  onClick={() => setShowConfirm((v) => !v)}
                >
                  {showConfirm ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </label>
          )}

          <button className="btn btn-primary mt-2 w-full" type="submit">
            {busy ? "Please wait…" : register ? "Create account" : "Sign In"}
            {!busy && <ArrowRight size={16} />}
          </button>
        </fieldset>
      </form>
      <p className="mt-7 text-center text-sm text-muted">
        {register ? "Already have an account?" : "New to Taskora?"}{" "}
        <Link
          href={register ? "/login" : "/register"}
          className="font-semibold text-accent"
        >
          {register ? "Sign In" : "Create an account"}
        </Link>
      </p>
    </motion.div>
  );
}
