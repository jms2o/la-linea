"use client";

import { motion } from "motion/react";
import type { ReactNode } from "react";

export function HoverScale({
  children,
  className,
  scale = 1.03
}: {
  children: ReactNode;
  className?: string;
  scale?: number;
}) {
  return (
    <motion.div
      whileHover={{ scale }}
      transition={{ type: "spring", stiffness: 260, damping: 20 }}
      className={className}
    >
      {children}
    </motion.div>
  );
}
