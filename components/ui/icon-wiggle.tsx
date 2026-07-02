"use client";

import { motion } from "motion/react";
import type { ReactNode } from "react";

export function IconWiggle({ children, className }: { children: ReactNode; className?: string }) {
  return (
    <motion.span
      whileHover={{ rotate: [0, -14, 12, -8, 0] }}
      transition={{ duration: 0.5 }}
      className={className}
    >
      {children}
    </motion.span>
  );
}
