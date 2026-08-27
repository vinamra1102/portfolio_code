"use client";

import { useEffect, useState } from "react";
import { useReducedMotion } from "motion/react";
import { Cursor, CursorFollow } from "@/components/ui/cursor";

/** Matches the `md` breakpoint the cursor is gated on. */
const DESKTOP_QUERY = "(min-width: 768px)";

/**
 * The dot and follow ring, kept in their own client component so the root
 * layout can stay a Server Component (it exports `metadata`, which "use
 * client" forbids). Must be rendered inside a CursorProvider.
 */
export function CursorLayer() {
  const reducedMotion = useReducedMotion();
  // Starts false so the server and the first client render agree; the effect
  // then enables it only on real desktop viewports. Gating on state rather
  // than CSS alone means nothing mounts or listens on touch devices.
  const [isDesktop, setIsDesktop] = useState(false);

  useEffect(() => {
    const query = window.matchMedia(DESKTOP_QUERY);
    const sync = () => setIsDesktop(query.matches);
    sync();
    query.addEventListener("change", sync);
    return () => query.removeEventListener("change", sync);
  }, []);

  const springConfig = reducedMotion
    ? { stiffness: 1000, damping: 100, bounce: 0 }
    : { stiffness: 180, damping: 22, bounce: 0 };

  if (!isDesktop) return null;

  return (
    <div className="hidden md:block">
      <Cursor>
        <div
          style={{
            width: 12,
            height: 12,
            borderRadius: "50%",
            background: "#0099ff",
            boxShadow:
              "0 0 12px rgba(0, 153, 255, 0.8), 0 0 24px rgba(0, 153, 255, 0.3)",
          }}
        />
      </Cursor>

      <CursorFollow align="center" sideOffset={0} transition={springConfig}>
        <div
          style={{
            width: 36,
            height: 36,
            borderRadius: "50%",
            border: "0.5px solid rgba(0, 153, 255, 0.35)",
            background: "rgba(0, 153, 255, 0.04)",
            backdropFilter: "blur(2px)",
          }}
        />
      </CursorFollow>
    </div>
  );
}
