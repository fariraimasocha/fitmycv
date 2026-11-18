"use client";

import { useEffect, useState } from "react";

// A colourful wave that carries one view into the next (distortion-waves,
// vendored in vendor/distortion-waves until it is on npm). Kept for peak
// moments only, and never over the CV document (CLAUDE.md).
//
// ponytail: the WebGL code loads after mount, so it never runs on the server
// and only ships with the screens that use it. Until it arrives, the plain
// view for `revealed` shows, so nothing waits on it. Reduced motion and
// browsers without WebGL 2 get the library's crossfade.
export default function Wave({ revealed, children, revealedContent, className, style, ...props }) {
  const [DistortionWave, setDistortionWave] = useState(null);

  useEffect(() => {
    let alive = true;
    import("distortion-waves").then((mod) => {
      if (alive) setDistortionWave(() => mod.DistortionWave);
    });
    return () => {
      alive = false;
    };
  }, []);

  if (!DistortionWave) {
    return (
      <div className={className} style={style}>
        {revealed ? revealedContent : children}
      </div>
    );
  }

  return (
    <DistortionWave
      revealed={revealed}
      revealedContent={revealedContent}
      reducedMotion="system"
      className={className}
      style={style}
      {...props}
    >
      {children}
    </DistortionWave>
  );
}
