"use client";
import { motion, useReducedMotion } from "framer-motion";
import { usePathname, useSearchParams } from "next/navigation";
export function PageMotion({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const search = useSearchParams();
  const reduced = useReducedMotion();
  return (
    <motion.div
      key={pathname + search.toString()}
      initial={reduced ? false : { opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.2, ease: [0.2, 0.8, 0.2, 1] }}
    >
      {children}
    </motion.div>
  );
}
