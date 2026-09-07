import { Brand } from "@/components/shared/Brand";
import { Check } from "lucide-react";
export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="grid min-h-dvh lg:grid-cols-2">
      <aside className="hidden flex-col justify-between bg-[#eeeae3] p-12 lg:flex">
        <Brand />
        <div className="max-w-lg">
          <p className="eyebrow mb-7">Plan. Assign. Deliver.</p>
          <h2 className="font-serif text-6xl leading-[1.06] tracking-tight">
            Good work starts
            <br />
            with a <span className="text-accent italic">clear plan.</span>
          </h2>
          <p className="mt-6 max-w-sm text-base leading-relaxed text-muted">
            A shared space for the projects that matter and the people who make
            them happen.
          </p>
          <div className="mt-10 space-y-4 text-sm">
            <p className="flex items-center gap-3">
              <Check size={17} className="text-accent" />
              Bring every project into focus
            </p>
            <p className="flex items-center gap-3">
              <Check size={17} className="text-accent" />
              Give every task a clear owner
            </p>
            <p className="flex items-center gap-3">
              <Check size={17} className="text-accent" />
              See progress as it happens
            </p>
          </div>
        </div>
        <p className="text-xs text-muted">
          A little more clarity. A lot more forward.
        </p>
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
