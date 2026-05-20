"use client";

import { type CSSProperties } from "react";

export function TextShimmer({
  children,
  className = "",
  duration = 2,
  spread = 2,
}: {
  children: string;
  className?: string;
  duration?: number;
  spread?: number;
}) {
  return (
    <p
      className={`text-shimmer-effect ${className}`}
      style={
        {
          "--duration": `${duration}s`,
          "--spread": spread,
          "--base-color": "#8B8179",
          "--base-gradient-color": "#6B5B52",
        } as CSSProperties
      }
    >
      {children}
    </p>
  );
}
