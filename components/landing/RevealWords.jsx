"use client";

import { useEffect, useRef } from "react";

// Splits "plain words <accent>accent words</accent> more" into word tokens.
function tokens(text) {
  return text.split(/(<accent>.*?<\/accent>)/).flatMap((part) => {
    const accent = part.startsWith("<accent>");
    const clean = accent ? part.slice(8, -9) : part;
    return clean
      .split(/(\s+)/)
      .filter(Boolean)
      .map((word) => ({ word, accent }));
  });
}

/**
 * Heading whose words fade in from a blur, one after another.
 *
 * ponytail: the words are visible by default. `onLoad` headings (the hero)
 * animate in pure CSS on page load. The rest are hidden by this effect only
 * once JS runs, and shown when they scroll into view, so a slow or failed
 * script never leaves a blank heading. Reduced motion skips it in CSS.
 */
export default function RevealWords({
  text,
  as: Tag = "h2",
  className = "",
  accentClassName = "italic text-[var(--landing-accent)]",
  style,
  onLoad = false,
}) {
  const ref = useRef(null);

  useEffect(() => {
    const el = ref.current;
    if (onLoad || !el) return;
    el.dataset.reveal = "armed";
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          el.dataset.reveal = "shown";
          observer.disconnect();
        }
      },
      { threshold: 0.1 },
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, [onLoad]);

  let index = 0;
  return (
    <Tag ref={ref} className={`${onLoad ? "reveal-load" : ""} ${className}`} style={style}>
      {tokens(text).map(({ word, accent }, i) =>
        /^\s+$/.test(word) ? (
          word
        ) : (
          <span
            key={i}
            className={`reveal-word ${accent ? accentClassName : ""}`}
            style={{ "--i": index++ }}
          >
            {word}
          </span>
        ),
      )}
    </Tag>
  );
}
