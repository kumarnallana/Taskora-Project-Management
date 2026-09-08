"use client";
import { Brand } from "@/components/shared/Brand";
import { FolderKanban, Users, CheckCheck } from "lucide-react";
import { motion } from "framer-motion";

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="grid min-h-dvh bg-canvas lg:grid-cols-2">
      <aside className="hidden flex-col justify-between border-r border-line p-12 lg:flex">
        <Brand />
        <motion.div 
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
          className="max-w-md"
        >
          <p className="eyebrow mb-4">Taskora Product System</p>
          <h2 className="text-4xl font-semibold leading-[1.12] tracking-tight text-ink">
            Where your team's work lives.
          </h2>
          <p className="mt-4 max-w-sm text-[15px] leading-relaxed text-muted">
            A focused workspace designed for clarity. From the first brief to the final delivery.
          </p>
          
          <div className="mt-10 rounded-2xl bg-white p-6 shadow-sm border border-line">
            <div className="flex flex-col gap-3">
              <div className="flex items-center gap-4">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-accent-soft text-accent">
                  <FolderKanban size={18} />
                </div>
                <div>
                  <h3 className="text-sm font-semibold">Plan</h3>
                  <p className="text-xs text-muted mt-0.5">Define the goal and outline the path.</p>
                </div>
              </div>
              <div className="ml-5 h-5 w-px bg-line" />
              <div className="flex items-center gap-4">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-amber-soft text-amber">
                  <Users size={18} />
                </div>
                <div>
                  <h3 className="text-sm font-semibold">Assign</h3>
                  <p className="text-xs text-muted mt-0.5">Bring in the right people for the job.</p>
                </div>
              </div>
              <div className="ml-5 h-5 w-px bg-line" />
              <div className="flex items-center gap-4">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-success-soft text-success">
                  <CheckCheck size={18} />
                </div>
                <div>
                  <h3 className="text-sm font-semibold">Deliver</h3>
                  <p className="text-xs text-muted mt-0.5">Track progress until it's done.</p>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
        <p className="text-xs font-medium text-muted tracking-wide">Plan. Assign. Deliver.</p>
      </aside>
      <div className="flex min-h-dvh flex-col bg-white">
        <div className="px-6 pt-7 lg:hidden">
          <Brand />
        </div>
        <main
          id="main"
          className="flex flex-1 items-center justify-center px-6 py-12"
        >
          {children}
        </main>
      </div>
    </div>
  );
}
