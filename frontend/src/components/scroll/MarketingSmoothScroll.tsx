"use client";
import { useEffect } from "react";
import Lenis from "lenis";

export function MarketingSmoothScroll({
  children,
}: {
  children: React.ReactNode;
}) {
  useEffect(() => {
    const media = window.matchMedia(
      "(min-width: 768px) and (prefers-reduced-motion: no-preference) and (pointer: fine)",
    );
    let scroll: Lenis | undefined;
    const update = () => {
      scroll?.destroy();
      scroll =
        media.matches && !document.hidden
          ? new Lenis({ autoRaf: true, lerp: 0.09, anchors: true })
          : undefined;
    };
    update();
    media.addEventListener("change", update);
    document.addEventListener("visibilitychange", update);
    return () => {
      scroll?.destroy();
      media.removeEventListener("change", update);
      document.removeEventListener("visibilitychange", update);
    };
  }, []);
  return children;
}
