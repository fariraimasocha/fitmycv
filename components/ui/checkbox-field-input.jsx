"use client";

/*
 * Adapted from Opensource UI "Checkbox Field Input".
 * https://opensourceui.in/components/checkbox-field-input
 *
 * MIT License. Copyright (c) 2026 Bidyut Kundu
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy
 * of this software and associated documentation files (the "Software"), to deal
 * in the Software without restriction, including without limitation the rights
 * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 * copies of the Software, and to permit persons to whom the Software is
 * furnished to do so, subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in
 * all copies or substantial portions of the Software.
 *
 * Changes from the original: ported from TypeScript to JavaScript, and the
 * lucide Check swapped for Phosphor's CheckIcon to match this project.
 */

import { forwardRef, useCallback, useId, useState } from "react";
import { CheckIcon } from "@phosphor-icons/react";

import { cn } from "@/lib/utils";

export const CheckboxFieldInput = forwardRef(function CheckboxFieldInput(
  {
    className,
    containerClassName,
    id,
    label,
    hint,
    error = false,
    errorMessage = "You must accept before continuing.",
    disabled,
    required,
    checked,
    defaultChecked = false,
    onCheckedChange,
    ...props
  },
  ref,
) {
  const generatedId = useId();
  const inputId = id ?? generatedId;
  const hintId = `${inputId}-hint`;
  const errorId = `${inputId}-error`;

  const isControlled = checked !== undefined;
  const [internal, setInternal] = useState(defaultChecked);
  const isChecked = isControlled ? checked : internal;

  const handleChange = useCallback(
    (event) => {
      const next = event.target.checked;
      if (!isControlled) setInternal(next);
      onCheckedChange?.(next, event);
    },
    [isControlled, onCheckedChange],
  );

  return (
    <div
      data-slot="checkbox-field-input"
      data-error={error || undefined}
      className={cn("w-full font-sans", containerClassName)}
    >
      <label
        htmlFor={inputId}
        className={cn(
          "flex cursor-pointer items-start gap-3",
          disabled && "cursor-not-allowed opacity-60",
        )}
      >
        <span className="relative mt-0.5 shrink-0">
          <input
            ref={ref}
            id={inputId}
            type="checkbox"
            disabled={disabled}
            required={required}
            checked={isControlled ? isChecked : undefined}
            defaultChecked={isControlled ? undefined : defaultChecked}
            aria-invalid={error || undefined}
            aria-describedby={error ? errorId : hint ? hintId : undefined}
            onChange={handleChange}
            className={cn(
              "peer absolute size-4 cursor-pointer opacity-0 disabled:cursor-not-allowed",
              className,
            )}
            {...props}
          />
          <span
            aria-hidden
            className={cn(
              "flex size-4 items-center justify-center rounded border transition-[border-color,background-color] duration-200",
              error
                ? "border-rose-300 bg-white peer-focus:border-rose-400"
                : "border-neutral-300 bg-white peer-focus:border-neutral-900",
              "peer-checked:border-neutral-900 peer-checked:bg-neutral-900",
              "peer-disabled:border-neutral-200 peer-disabled:bg-neutral-100",
            )}
          >
            <CheckIcon
              size={12}
              weight="bold"
              className={cn(
                "text-white transition-opacity duration-150",
                isChecked ? "opacity-100" : "opacity-0",
              )}
            />
          </span>
        </span>

        <span className="min-w-0">
          <span className="block text-sm text-neutral-900">
            {label}
            {required ? (
              <span className="ml-0.5 text-rose-500" aria-hidden>
                *
              </span>
            ) : null}
          </span>
          {hint ? (
            <span id={hintId} className="mt-0.5 block text-xs text-neutral-500">
              {hint}
            </span>
          ) : null}
        </span>
      </label>

      {error ? (
        <p id={errorId} role="alert" className="mt-1.5 text-xs text-rose-600">
          {errorMessage}
        </p>
      ) : null}
    </div>
  );
});

CheckboxFieldInput.displayName = "CheckboxFieldInput";
