"use client";

import { motion } from "framer-motion";
import { ReactNode } from "react";

type AnimateInProps = {
  children: ReactNode;
  delay?: number;
  duration?: number;
  direction?: "up" | "down" | "left" | "right" | "none";
  className?: string;
  once?: boolean;
  as?: React.ElementType;
};

export function AnimateIn({
  children,
  delay = 0,
  duration = 0.5,
  direction = "up",
  className = "",
  once = true,
  as = "div",
}: AnimateInProps) {
  const directions = {
    up: { y: 40, x: 0 },
    down: { y: -40, x: 0 },
    left: { x: 40, y: 0 },
    right: { x: -40, y: 0 },
    none: { x: 0, y: 0 },
  };

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const Component = motion.create(as as any) as any;

  return (
    <Component
      initial={{
        opacity: 0,
        ...directions[direction],
      }}
      whileInView={{
        opacity: 1,
        x: 0,
        y: 0,
      }}
      viewport={{ once, margin: "-50px" }}
      transition={{
        duration,
        delay,
        ease: [0.21, 0.47, 0.32, 0.98], // Custom easing for smooth feel
      }}
      className={className}
    >
      {children}
    </Component>
  );
}

export const staggerContainer = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
    },
  },
};

export const staggerItem = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0, transition: { duration: 0.5, ease: [0.21, 0.47, 0.32, 0.98] } },
};