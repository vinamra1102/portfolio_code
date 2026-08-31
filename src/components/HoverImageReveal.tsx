"use client";

import { useRef, useState, type CSSProperties } from "react";
import {
  AnimatePresence,
  motion,
  useMotionValue,
  useSpring,
} from "framer-motion";

export type HoverImageRevealItem = {
  text?: string;
  image?: { src?: string; alt?: string };
  link?: string;
};

export type HoverImageRevealItems = {
  itemCount: number;
} & Record<string, HoverImageRevealItem | number>;

export interface HoverImageRevealProps {
  items: HoverImageRevealItems;
  backgroundColor?: string;
  textColor?: string;
  dimColor?: string;
  align?: "left" | "center" | "right";
  rowGap?: number;
  imageWidth?: number;
  imageHeight?: number;
  rounded?: number;
  offsetX?: number;
  offsetY?: number;
  /** Extra horizontal drift, in px, as the pointer crosses the list. */
  followStrength?: number;
  font?: CSSProperties;
  transition?: { stiffness?: number; damping?: number; mass?: number };
  style?: CSSProperties;
  onItemClick?: (index: number) => void;
}

export default function HoverImageReveal({
  items,
  backgroundColor = "transparent",
  textColor = "#ffffff",
  dimColor = "#2a2a2a",
  align = "left",
  rowGap = 0,
  imageWidth = 320,
  imageHeight = 420,
  rounded = 12,
  offsetX = 180,
  offsetY = -210,
  followStrength = 20,
  font,
  transition,
  style,
  onItemClick,
}: HoverImageRevealProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [hovered, setHovered] = useState<number | null>(null);

  const spring = {
    stiffness: transition?.stiffness ?? 350,
    damping: transition?.damping ?? 38,
    mass: transition?.mass ?? 0.8,
  };

  const pointerX = useMotionValue(0);
  const pointerY = useMotionValue(0);
  const x = useSpring(pointerX, spring);
  const y = useSpring(pointerY, spring);

  const count = Number(items.itemCount ?? 0);
  const list: HoverImageRevealItem[] = Array.from({ length: count }, (_, i) => {
    const entry = items[`item${i + 1}`];
    return typeof entry === "object" && entry !== null
      ? (entry as HoverImageRevealItem)
      : {};
  });

  const handlePointer = (e: React.MouseEvent<HTMLDivElement>) => {
    // Touch devices have no hover state to speak of, and letting the preview
    // latch on leaves it stranded on screen after the tap.
    if (window.matchMedia("(hover: none)").matches) return;
    const rect = containerRef.current?.getBoundingClientRect();
    if (!rect) return;
    const px = e.clientX - rect.left;
    const py = e.clientY - rect.top;
    const drift = (px / Math.max(rect.width, 1) - 0.5) * followStrength;
    pointerX.set(px + offsetX + drift);
    pointerY.set(py + offsetY);
  };

  const justify =
    align === "center"
      ? "center"
      : align === "right"
        ? "flex-end"
        : "flex-start";

  return (
    <div
      ref={containerRef}
      onMouseMove={handlePointer}
      onMouseLeave={() => setHovered(null)}
      style={{
        position: "relative",
        backgroundColor,
        display: "flex",
        flexDirection: "column",
        gap: `${rowGap}px`,
        ...style,
      }}
    >
      {list.map((item, i) => {
        const isHovered = hovered === i;
        const dimmed = hovered !== null && !isHovered;

        return (
          <div
            key={i}
            onMouseEnter={() => setHovered(i)}
            onClick={() => onItemClick?.(i)}
            style={{
              position: "relative",
              display: "flex",
              alignItems: "center",
              width: "100%",
              cursor: "none",
              paddingTop: "18px",
              paddingBottom: "18px",
              borderBottom: "0.5px solid #1a1a1a",
              borderTop: i === 0 ? "0.5px solid #1a1a1a" : undefined,
              justifyContent: justify,
            }}
          >
            <div style={{ overflow: "hidden", flex: 1 }}>
              <motion.div
                animate={{ color: dimmed ? dimColor : textColor }}
                transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
                style={{
                  display: "block",
                  color: textColor,
                  textAlign: align,
                  ...font,
                }}
              >
                {item.text}
              </motion.div>
            </div>

            <span
              style={{
                fontSize: "11px",
                color: isHovered ? "#444444" : "#1a1a1a",
                fontWeight: 400,
                letterSpacing: "0.14em",
                fontFamily: "Inter",
                transition: "color 0.2s ease",
                flexShrink: 0,
                marginLeft: "auto",
                paddingLeft: "32px",
                alignSelf: "center",
              }}
            >
              {String(i + 1).padStart(2, "0")}
            </span>

            <div
              style={{
                position: "absolute",
                bottom: 0,
                left: 0,
                height: "0.5px",
                width: isHovered ? "100%" : "0%",
                background: "#0099ff",
                transition: "width 0.45s cubic-bezier(0.16, 1, 0.3, 1)",
                pointerEvents: "none",
              }}
            />
          </div>
        );
      })}

      {/* Floating preview that trails the pointer */}
      <AnimatePresence>
        {hovered !== null && (
          <motion.div
            key="hover-preview"
            initial={{ opacity: 0, scale: 0.94 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.94 }}
            transition={{ duration: 0.28, ease: [0.16, 1, 0.3, 1] }}
            style={{
              position: "absolute",
              top: 0,
              left: 0,
              x,
              y,
              width: imageWidth,
              height: imageHeight,
              borderRadius: rounded,
              overflow: "hidden",
              pointerEvents: "none",
              zIndex: 20,
            }}
          >
            {(() => {
              const item = list[hovered];
              const src = item.image?.src;
              return src && (src.endsWith(".mp4") || src.endsWith(".webm")) ? (
                <video
                  src={src}
                  autoPlay
                  muted
                  loop
                  playsInline
                  style={{
                    width: "100%",
                    height: "100%",
                    objectFit: "cover",
                    display: "block",
                  }}
                />
              ) : src && !src.startsWith("/videos") ? (
                <img
                  src={src}
                  alt={item.image?.alt || item.text || ""}
                  style={{
                    width: "100%",
                    height: "100%",
                    objectFit: "cover",
                    display: "block",
                  }}
                />
              ) : (
                <div
                  style={{
                    width: "100%",
                    height: "100%",
                    background: "#111111",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    flexDirection: "column",
                    gap: "8px",
                  }}
                >
                  <div
                    style={{
                      fontSize: "32px",
                      fontWeight: 500,
                      color: "#1e1e1e",
                      fontFamily: "Inter",
                      letterSpacing: "-1px",
                    }}
                  >
                    {(item.text ?? "")
                      .split(" ")
                      .map((w: string) => w[0])
                      .join("")
                      .slice(0, 2)
                      .toUpperCase()}
                  </div>
                  <div
                    style={{
                      fontSize: "10px",
                      color: "#222",
                      letterSpacing: "0.15em",
                      textTransform: "uppercase",
                      fontFamily: "Inter",
                      fontWeight: 400,
                    }}
                  >
                    Preview soon
                  </div>
                </div>
              );
            })()}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
