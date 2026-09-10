"use client";
import { useEffect, useRef, useState } from "react";
import { useReducedMotion } from "framer-motion";

export function AnimatedNumber({ value }: { value: number }) {
  const reduced = useReducedMotion();
  const previous = useRef(value);
  const [shown, setShown] = useState(value);
  useEffect(() => {
    const from = previous.current;
    if (reduced || document.hidden || from === value) {
      previous.current = value;
      setShown(value);
      return;
    }
    let frame = 0;
    const start = performance.now();
    const tick = (now: number) => {
      const progress = Math.min(1, (now - start) / 420);
      previous.current = Math.round(
        from + (value - from) * (1 - Math.pow(1 - progress, 3)),
      );
      setShown(previous.current);
      if (progress < 1) frame = requestAnimationFrame(tick);
    };
    frame = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frame);
  }, [value, reduced]);
  return <span className="metric-number">{shown}</span>;
}
