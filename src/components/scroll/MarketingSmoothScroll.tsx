"use client";
import { ReactLenis } from "lenis/react";
import { useReducedMotion } from "framer-motion";
export function MarketingSmoothScroll({
  children,
}: {
  children: React.ReactNode;
}) {
  const reduced = useReducedMotion();
  return reduced ? (
    children
  ) : (
    <ReactLenis root options={{ lerp: 0.09, anchors: true }}>
      {children}
    </ReactLenis>
  );
}
