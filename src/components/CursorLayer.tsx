"use client";

import { Cursor, CursorFollow } from "@/components/ui/cursor";

/**
 * The dot and follow ring, kept in their own client component so the root
 * layout can stay a Server Component (it exports `metadata`, which "use
 * client" forbids). Must be rendered inside a CursorProvider.
 */
export function CursorLayer() {
  return (
    <>
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

      <CursorFollow
        align="center"
        sideOffset={0}
        transition={{ stiffness: 180, damping: 22, bounce: 0 }}
      >
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
    </>
  );
}
