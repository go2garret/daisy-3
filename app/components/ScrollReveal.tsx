"use client";

import { useRef, useEffect, ReactNode, CSSProperties } from "react";

const TRIGGER_RATIO = 0.88;
const TRAVEL_PX = 380;
const LERP = 0.055;

const OFFSET_X = 90;
const OFFSET_Y = 70;
const SCALE_START = 1; //0.84;

function easeOutQuart(t: number) {
  return 1 - Math.pow(1 - t, 4);
}

export type Direction = "left" | "right" | "bottom";

interface ScrollRevealProps {
  children: ReactNode;
  direction?: Direction;
  className?: string;
  style?: CSSProperties;
}

export default function ScrollReveal({
  children,
  direction = "bottom",
  className = "",
  style = {},
}: ScrollRevealProps) {

  const elRef = useRef<HTMLDivElement | null>(null);

  const stateRef = useRef({
    current: 0,
    target: 0,
    raf: 0,
  });

  useEffect(() => {
    const el = elRef.current;
    if (!el) return;

    const s = stateRef.current;

    const applyStyle = (raw: number) => {
      const p = easeOutQuart(Math.max(0, Math.min(1, raw)));
      const inv = 1 - p;

      const tx =
        direction === "left"
          ? -OFFSET_X * inv
          : direction === "right"
          ? OFFSET_X * inv
          : 0;

      const ty = direction === "bottom" ? OFFSET_Y * inv : 0;

      el.style.opacity = String(p);
      el.style.transform = `translate(${tx}px, ${ty}px) scale(${
        SCALE_START + (1 - SCALE_START) * p
      })`;
    };

    const computeTarget = () => {
      const rect = el.getBoundingClientRect();

      return Math.max(
        0,
        Math.min(1, (window.innerHeight * TRIGGER_RATIO - rect.top) / TRAVEL_PX)
      );
    };

    const tick = () => {
      s.target = computeTarget();

      s.current += (s.target - s.current) * LERP;

      if (Math.abs(s.target - s.current) < 0.0004) {
        s.current = s.target;
      }

      applyStyle(s.current);

      s.raf = requestAnimationFrame(tick);
    };

    s.current = computeTarget();
    s.target = s.current;
    applyStyle(s.current);

    s.raf = requestAnimationFrame(tick);

    return () => cancelAnimationFrame(s.raf);
  }, [direction]);

  return (
    <div
      ref={elRef}
      className={className}
      style={{
        opacity: 0,
        willChange: "transform, opacity",
        ...style,
      }}
    >
      {children}
    </div>
  );
}