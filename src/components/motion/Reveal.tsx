"use client";

import { motion, useReducedMotion, type HTMLMotionProps } from "motion/react";

type Props = HTMLMotionProps<"div"> & {
  delay?: number;
  duration?: number;
  distance?: number;
  amount?: number;
};

// Triggers the animation when the element enters the viewport.
// Used for content below the fold so it animates as the user scrolls.
export function Reveal({
  children,
  delay = 0,
  duration = 0.7,
  distance = 28,
  amount = 0.2,
  ...rest
}: Props) {
  const reduce = useReducedMotion();

  return (
    <motion.div
      initial={reduce ? false : { opacity: 0, y: distance }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount }}
      transition={{ duration, delay, ease: [0.16, 1, 0.3, 1] }}
      {...rest}
    >
      {children}
    </motion.div>
  );
}
