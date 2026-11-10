"use client";

import { useSyncExternalStore } from "react";
import { createPortal } from "react-dom";
import { motion, useReducedMotion } from "motion/react";
import { cn } from "@/lib/utils";

// The shell's top bar holds the page title (from the breadcrumb) and, on
// sm and up, the page actions, the way Teal's app bar does. The page itself
// only keeps the short description, so the title is not said twice.
export const TOPBAR_ACTIONS_ID = "dashboard-topbar-actions";

/**
 * One header for every page in the shell. Actions should be
 * `.dashboard-primary-btn` or `.dashboard-secondary-btn` so a pair is always
 * the same height.
 *
 * `inline` keeps the old in-page title, for Home's greeting, which is not the
 * page name. `eyebrow` is accepted for backwards compatibility and ignored.
 */
export function DashboardPageHeader({
  title,
  description,
  action,
  actions,
  meta,
  inline = false,
  className,
  delay = 0,
}) {
  const reduceMotion = useReducedMotion();
  const trailing = actions ?? action;
  // The slot is part of the shell, so it exists before any page mounts. The
  // server has no DOM, so actions portal in after hydration.
  const slot = useSyncExternalStore(noopSubscribe, getSlot, getNoSlot);

  if (inline) {
    return (
      <motion.div
        initial={reduceMotion ? false : { opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, delay }}
        className={cn("flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between", className)}
      >
        <div className="min-w-0 flex-1">
          {meta && <div className="mb-2 flex flex-wrap items-center gap-2 text-xs text-muted-foreground">{meta}</div>}
          <h1 className="font-outfit text-2xl font-semibold tracking-tight text-foreground">{title}</h1>
          {description && (
            <div className="mt-1 max-w-2xl text-sm leading-6 text-pretty text-muted-foreground">{description}</div>
          )}
        </div>
        {trailing && <Actions>{trailing}</Actions>}
      </motion.div>
    );
  }

  const hasBody = meta || description;
  return (
    <>
      <h1 className="sr-only">{title}</h1>
      {(hasBody || trailing) && (
        <div className={cn("flex flex-col gap-3", !hasBody && "sm:hidden", className)}>
          {hasBody && (
            <div className="min-w-0">
              {meta && <div className="flex flex-wrap items-center gap-2 text-xs text-muted-foreground">{meta}</div>}
              {description && (
                <div className={cn("max-w-3xl text-sm leading-6 text-pretty text-muted-foreground", meta && "mt-1")}>
                  {description}
                </div>
              )}
            </div>
          )}
          {/* Phones have no room in the top bar, so actions stay in the page. */}
          {trailing && <Actions className="sm:hidden">{trailing}</Actions>}
        </div>
      )}
      {trailing && slot && createPortal(<Actions>{trailing}</Actions>, slot)}
    </>
  );
}

const noopSubscribe = () => () => {};
const getSlot = () => document.getElementById(TOPBAR_ACTIONS_ID);
const getNoSlot = () => null;

function Actions({ children, className }) {
  return (
    <div
      className={cn(
        "flex shrink-0 flex-wrap items-center gap-2 [&>a]:w-full [&>button]:w-full sm:[&>a]:w-auto sm:[&>button]:w-auto",
        className,
      )}
    >
      {children}
    </div>
  );
}
