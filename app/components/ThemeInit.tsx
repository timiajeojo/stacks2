"use client";

import { useEffect } from "react";
import { applyTheme, getStoredTheme } from "../lib/theme";

// Renders nothing — just applies the saved theme preference on mount so it
// survives full page reloads. For full site-wide coverage (not just pages
// that happen to import this), render <ThemeInit /> once near the top of
// your root app/layout.tsx.
export default function ThemeInit() {
  useEffect(() => {
    const stored = getStoredTheme();
    applyTheme(stored);

    if (stored === "system") {
      const mq = window.matchMedia("(prefers-color-scheme: dark)");
      const listener = () => applyTheme("system");
      mq.addEventListener("change", listener);
      return () => mq.removeEventListener("change", listener);
    }
  }, []);

  return null;
}
