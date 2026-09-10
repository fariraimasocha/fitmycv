"use client";

import { Toaster as Sonner } from "sonner";

// ponytail: no next-themes lookup, the app is light only. Pass theme="dark"
// here if a theme switcher ever lands.
function Toaster(props) {
  return (
    <Sonner
      className="toaster group"
      style={{
        "--normal-bg": "var(--popover)",
        "--normal-text": "var(--popover-foreground)",
        "--normal-border": "var(--border)",
      }}
      {...props}
    />
  );
}

export { Toaster };
