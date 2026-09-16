"use client";

import { useEffect, useRef, useState } from "react";
import { cn } from "@/lib/utils";

// Renders children at a fixed document width and scales them to fit the
// container, so a CV laid out for A4 keeps its line breaks in a narrow column.
// 794px is A4 at 96dpi, the width the /print route uses.
export function ScaledDocument({ children, docWidth = 794, className }) {
  const outerRef = useRef(null);
  const innerRef = useRef(null);
  const [scale, setScale] = useState(1);
  const [height, setHeight] = useState(null);

  useEffect(() => {
    const outer = outerRef.current;
    const inner = innerRef.current;
    if (!outer || !inner) return;

    const update = () => {
      const next = outer.clientWidth / docWidth;
      setScale(next);
      setHeight(inner.offsetHeight * next);
    };

    update();
    const observer = new ResizeObserver(update);
    observer.observe(outer);
    observer.observe(inner);
    return () => observer.disconnect();
  }, [docWidth]);

  return (
    <div
      ref={outerRef}
      className={cn("relative w-full overflow-hidden", className)}
      style={height ? { height } : undefined}
    >
      <div
        ref={innerRef}
        style={{
          width: docWidth,
          transform: `scale(${scale})`,
          transformOrigin: "top left",
        }}
      >
        {children}
      </div>
    </div>
  );
}
