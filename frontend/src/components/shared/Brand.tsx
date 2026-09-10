import Link from "next/link";
import { Layers2 } from "lucide-react";
import { brand } from "@data/brand";

export function Brand({ href = "/" }: { href?: string }) {
  return (
    <Link
      href={href}
      className="inline-flex items-center gap-2.5 text-xl font-semibold tracking-tight"
      aria-label="Taskora home"
    >
      <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-accent text-white">
        <Layers2 size={20} strokeWidth={1.7} />
      </span>
      {brand.name}
      <span className="mb-2 h-1 w-1 rounded-full bg-accent" />
    </Link>
  );
}
