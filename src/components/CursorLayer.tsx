"use client";

import { useEffect, useState } from "react";
import { useReducedMotion } from "motion/react";
import { Cursor, CursorFollow } from "@/components/ui/cursor";

/** Matches the `md` breakpoint the cursor is gated on. */
const DESKTOP_QUERY = "(min-width: 768px)";

const ARROW_PATH =
  "M6 2C4.5 2 3.5 3.6 4.2 4.9L14.8 27.1C15.5 28.5 17.4 28.5 18.1 27.1L21.8 19.8L29.1 18.1C30.5 17.4 30.5 15.5 29.1 14.8L6.9 2.4C6.6 2.2 6.3 2 6 2Z";

/**
 * Where the arrow's point sits inside the 32x32 viewBox. The SVG is shifted
 * back by this much so the point, not the box corner, lands on the pointer.
 * Measured off the rendered path, not eyeballed.
 */
const TIP = { x: 4.58, y: 2.59 };

/**
 * The arrow and follow ring, kept in their own client component so the root
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
      {/* The component's own translate(-50%,-50%) would centre the box on the
          pointer; an arrow wants its point there instead, so that is cancelled
          and the SVG is nudged back by TIP. */}
      <Cursor style={{ transform: "translate(0, 0)" }}>
        <svg
          width="32"
          height="32"
          viewBox="0 0 32 32"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          aria-hidden="true"
          style={{
            display: "block",
            transform: `translate(${-TIP.x}px, ${-TIP.y}px)`,
            filter:
              "drop-shadow(0 0 6px rgba(0,153,255,0.8)) drop-shadow(0 0 14px rgba(0,153,255,0.3))",
          }}
        >
          <path d={ARROW_PATH} fill="#0099ff" />
        </svg>
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
