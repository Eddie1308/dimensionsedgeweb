"use client";

import { motion, useReducedMotion, type HTMLMotionProps } from "motion/react";

type StaggerProps = HTMLMotionProps<"div"> & {
  /** Seconds between each child's start. */
  stagger?: number;
  /** Delay before the first child starts. */
  delay?: number;
  /** When true, only animate when entering the viewport. */
  whenInView?: boolean;
};

const containerVariants = (stagger: number, delay: number) => ({
  hidden: {},
  show: {
    transition: { staggerChildren: stagger, delayChildren: delay },
  },
});

export function Stagger({
  children,
  stagger = 0.08,
  delay = 0,
  whenInView = false,
  ...rest
}: StaggerProps) {
  const reduce = useReducedMotion();
  const variants = containerVariants(reduce ? 0 : stagger, delay);

  return (
    <motion.div
      initial="hidden"
      {...(whenInView
        ? { whileInView: "show", viewport: { once: true, amount: 0 } }
        : { animate: "show" })}
      variants={variants}
      {...rest}
    >
      {children}
    </motion.div>
  );
}

type ItemProps = HTMLMotionProps<"div"> & {
  distance?: number;
  duration?: number;
};

const itemVariants = (distance: number, duration: number) => ({
  hidden: { opacity: 0, y: distance },
  show: {
    opacity: 1,
    y: 0,
    transition: { duration, ease: [0.16, 1, 0.3, 1] as [number, number, number, number] },
  },
});

export function StaggerItem({
  children,
  distance = 20,
  duration = 0.6,
  ...rest
}: ItemProps) {
  return (
    <motion.div variants={itemVariants(distance, duration)} {...rest}>
      {children}
    </motion.div>
  );
}
