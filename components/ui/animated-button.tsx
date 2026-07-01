"use client";

import Link from "next/link";
import { motion } from "motion/react";
import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

const MotionLink = motion.create(Link);

type AnimatedButtonProps = {
  href: string;
  children: ReactNode;
  variant?: "solid" | "outline" | "invert" | "whatsapp";
  className?: string;
};

const VARIANT_STYLES: Record<
  NonNullable<AnimatedButtonProps["variant"]>,
  { base: string; sweep: string; hoverText: string; glow: string }
> = {
  solid: {
    base: "bg-black text-white",
    sweep: "bg-white",
    hoverText: "group-hover:text-black",
    glow: "hover:shadow-[0_12px_30px_-8px_rgba(37,99,235,0.45)]"
  },
  outline: {
    base: "border border-black/15 bg-white text-black",
    sweep: "bg-black",
    hoverText: "group-hover:text-white",
    glow: "hover:shadow-[0_12px_30px_-8px_rgba(37,99,235,0.45)]"
  },
  invert: {
    base: "bg-white text-black ring-1 ring-white/10",
    sweep: "bg-black",
    hoverText: "group-hover:text-white",
    glow: "hover:shadow-[0_12px_30px_-8px_rgba(37,99,235,0.45)]"
  },
  whatsapp: {
    base: "bg-[#25D366] text-white",
    sweep: "bg-white",
    hoverText: "group-hover:text-[#128C4A]",
    glow: "hover:shadow-[0_12px_30px_-8px_rgba(37,211,102,0.5)]"
  }
};

export function AnimatedButton({
  href,
  children,
  variant = "solid",
  className
}: AnimatedButtonProps) {
  const styles = VARIANT_STYLES[variant];

  return (
    <MotionLink
      href={href}
      whileHover={{ y: -2 }}
      whileTap={{ scale: 0.96 }}
      transition={{ type: "spring", stiffness: 420, damping: 26 }}
      className={cn(
        "group relative inline-flex h-12 items-center justify-center gap-2 overflow-hidden rounded-full px-7 text-sm font-semibold tracking-wide transition-shadow duration-300",
        styles.base,
        styles.glow,
        className
      )}
    >
      <span
        aria-hidden
        className={cn(
          "absolute inset-0 origin-left scale-x-0 transition-transform duration-300 ease-out group-hover:scale-x-100",
          styles.sweep
        )}
      />
      <span className={cn("relative z-10 flex items-center gap-2 transition-colors duration-300", styles.hoverText)}>
        {children}
      </span>
    </MotionLink>
  );
}
