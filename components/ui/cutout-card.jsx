"use client";

// Cutout card — ported from cult-ui (cult-ui.com/docs/components/cutout-card)
// to plain JSX and this app's landing tokens. The "cutout" is an optical trick:
// an inset label sits flush in a corner of the media, and small concave corner
// SVGs bridge the label back into the card surface so the label reads as a
// notch punched out of the image rather than a box laid on top of it.
//
// ponytail: hover state is uncontrolled-only. The upstream controllable-state
// prop was dropped — nothing here drives hover from a parent.

import { createContext, useContext, useMemo, useState } from "react";
import Image from "next/image";
import { motion, useReducedMotion } from "motion/react";

import { cn } from "@/lib/utils";

const CORNER_PATH = "M0 200C155.996 199.961 200.029 156.308 200 0V200H0Z";

const CutoutCardContext = createContext({ hovered: false });

function useCutoutCard() {
  return useContext(CutoutCardContext);
}

export function CutoutCard({ className, children, ...props }) {
  const reduceMotion = useReducedMotion();
  const [hovered, setHovered] = useState(false);
  const ctx = useMemo(() => ({ hovered }), [hovered]);

  return (
    <CutoutCardContext.Provider value={ctx}>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{
          duration: reduceMotion ? 0.22 : 0.36,
          ease: [0.23, 1, 0.32, 1],
        }}
        data-state={hovered ? "hovered" : "idle"}
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
        className={cn(
          "group/cutout relative overflow-hidden rounded-[28px]",
          "border border-[var(--landing-line)] bg-[var(--landing-paper-soft)]",
          "shadow-[var(--landing-shadow-sm)] transition-[box-shadow,border-color,transform] duration-500 ease-[cubic-bezier(0.23,1,0.32,1)]",
          "hover:-translate-y-1 hover:border-[oklch(0.47_0.125_177_/_0.35)] hover:shadow-[var(--landing-shadow)]",
          className
        )}
        {...props}
      >
        {children}
      </motion.div>
    </CutoutCardContext.Provider>
  );
}

export function CutoutCardMedia({ className, ...props }) {
  return <div className={cn("relative overflow-hidden", className)} {...props} />;
}

export function CutoutCardImage({ className, alt = "", ...props }) {
  return (
    <Image
      alt={alt}
      fill
      sizes="(max-width: 768px) 100vw, (max-width: 1180px) 50vw, 28rem"
      className={cn(
        "h-full w-full object-cover transition-transform duration-700 ease-[cubic-bezier(0.23,1,0.32,1)] group-hover/cutout:scale-105",
        className
      )}
      {...props}
    />
  );
}

export function CutoutCardContent({ className, ...props }) {
  return <div className={cn("p-6", className)} {...props} />;
}

export function CutoutCardFooter({ className, ...props }) {
  return (
    <div className={cn("flex items-center justify-between", className)} {...props} />
  );
}

/** Decorative concave corner that bridges an inset label into the card surface. */
export function CutoutCorner({ className, size = 26, ...props }) {
  return (
    <svg
      aria-hidden="true"
      width={size}
      height={size}
      viewBox="0 0 200 200"
      xmlns="http://www.w3.org/2000/svg"
      className={cn(className)}
      {...props}
    >
      <path d={CORNER_PATH} fill="currentColor" />
    </svg>
  );
}

/** Absolutely positioned strip punched into the media edge. */
export function CutoutCardInsetLabel({ className, ...props }) {
  return <div className={cn("absolute", className)} {...props} />;
}

/** Corner badge shell (e.g. a category pin in the top-right of the media). */
export function CutoutCardPin({ className, ...props }) {
  return <div className={cn("absolute", className)} {...props} />;
}

/** Region that fades in on card hover — used for the "Read article" affordance. */
export function CutoutCardAction({ className, revealOnHover = true, ...props }) {
  const { hovered } = useCutoutCard();
  const reduceMotion = useReducedMotion();
  const visible = !revealOnHover || hovered;

  return (
    <motion.div
      animate={
        visible
          ? { opacity: 1, transform: "translateY(0px)" }
          : { opacity: 0, transform: "translateY(8px)" }
      }
      transition={{
        duration: reduceMotion ? 0.15 : 0.24,
        ease: [0.23, 1, 0.32, 1],
      }}
      className={cn("absolute", !visible && "pointer-events-none", className)}
      {...props}
    />
  );
}
