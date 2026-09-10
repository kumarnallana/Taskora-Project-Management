"use client";
import { Brand } from "@/components/shared/Brand";
import { FolderKanban, Users, CheckCheck, ArrowRight } from "lucide-react";
import { motion, useReducedMotion } from "framer-motion";

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const reduced = useReducedMotion();
  return (
    <div className="auth-layout">
      <aside className="auth-aside">
        <Brand />
        <motion.div
          initial={reduced ? false : { opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="auth-story"
        >
          <p className="eyebrow mb-5">A shared direction</p>
          <h2>
            Good work starts
            <br />
            with a clear plan.
          </h2>
          <p className="mt-5 max-w-sm text-base leading-relaxed text-muted">
            Bring the project, the people, and the next step into focus.
          </p>
          <div
            className="auth-diagram"
            aria-label="Plan a project, assign your team, and deliver together"
          >
            <div className="flex items-center justify-between border-b border-line pb-5">
              <span className="flex items-center gap-3 font-semibold">
                <FolderKanban size={20} className="text-accent" />
                Your next project
              </span>
              <span className="badge badge-IN_PROGRESS">In motion</span>
            </div>
            <div className="auth-connections" aria-hidden="true">
              <span className="avatar">YOU</span>
              <span className="connection-line" />
              <span className="auth-project-node">
                <FolderKanban size={24} />
              </span>
              <span className="connection-line" />
              <span className="auth-done-node">
                <CheckCheck size={22} />
              </span>
            </div>
            <div className="grid grid-cols-3 gap-4 text-xs">
              <div>
                <FolderKanban size={17} className="mb-3 text-accent" />
                <strong>Plan</strong>
                <p className="mt-1.5 text-muted">One clear goal</p>
              </div>
              <div>
                <Users size={17} className="mb-3 text-accent" />
                <strong>Assign</strong>
                <p className="mt-1.5 text-muted">Shared ownership</p>
              </div>
              <div>
                <CheckCheck size={17} className="mb-3 text-success" />
                <strong>Deliver</strong>
                <p className="mt-1.5 text-muted">Visible progress</p>
              </div>
            </div>
          </div>
        </motion.div>
        <p className="flex items-center gap-3 text-xs text-muted">
          Less searching. More moving forward.
          <ArrowRight size={14} />
        </p>
      </aside>
      <div className="flex min-h-dvh min-w-0 flex-col">
        <div className="px-6 pt-6 lg:hidden">
          <Brand />
        </div>
        <main
          id="main"
          className="flex flex-1 items-center justify-center px-5 py-10 sm:px-8"
        >
          {children}
        </main>
      </div>
    </div>
  );
}
