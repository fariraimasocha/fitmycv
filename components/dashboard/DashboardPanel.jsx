"use client";

import Link from "next/link";
import { motion, useReducedMotion } from "motion/react";
import { ArrowRightIcon } from "@phosphor-icons/react";
import { cn } from "@/lib/utils";

/**
 * The standard content block: hairline card, one padding recipe, fades in.
 * `pad={false}` for panels that manage their own inner edges (lists with
 * dividers, tables, documents).
 */
export function DashboardPanel({
  children,
  className,
  bodyClassName,
  pad = true,
  delay = 0,
  as: Tag = "section",
  ...props
}) {
  const reduceMotion = useReducedMotion();
  return (
    <motion.div
      initial={reduceMotion ? false : { opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay }}
      className={cn("min-w-0", className)}
    >
      <Tag
        className={cn(
          "dashboard-card flex h-full flex-col overflow-hidden rounded-lg",
          pad && "dashboard-card-pad",
          bodyClassName,
        )}
        {...props}
      >
        {children}
      </Tag>
    </motion.div>
  );
}

/**
 * Title row inside a panel. `href` + `linkLabel` renders a quiet link on the
 * right; `action` renders anything else (a button, a tab bar).
 */
export function DashboardPanelHeader({
  title,
  description,
  href,
  linkLabel = "View all",
  action,
  className,
}) {
  return (
    <div className={cn("flex items-start justify-between gap-3", className)}>
      <div className="min-w-0">
        <h2 className="font-outfit text-sm font-semibold text-foreground">{title}</h2>
        {description && (
          <p className="mt-0.5 text-xs text-muted-foreground">{description}</p>
        )}
      </div>
      {action}
      {!action && href && (
        <Link
          href={href}
          className="inline-flex shrink-0 items-center gap-1 text-xs font-medium text-muted-foreground transition-colors hover:text-foreground"
        >
          {linkLabel}
          <ArrowRightIcon size={12} weight="bold" aria-hidden="true" />
        </Link>
      )}
    </div>
  );
}

/**
 * A section label between blocks on a long page. Smaller than the page title,
 * larger than a panel title.
 */
export function DashboardSectionTitle({ title, description, action, className }) {
  return (
    <div className={cn("flex items-end justify-between gap-3", className)}>
      <div className="min-w-0">
        <h2 className="font-outfit text-base font-semibold tracking-[-0.01em] text-foreground">
          {title}
        </h2>
        {description && (
          <p className="mt-0.5 text-sm text-muted-foreground">{description}</p>
        )}
      </div>
      {action}
    </div>
  );
}
