"use client";

import { useRef, useState, type CSSProperties } from "react";
import {
  AnimatePresence,
  motion,
  useMotionValue,
  useSpring,
} from "framer-motion";

/** Stand-in footage for every project until the real clips exist. */
const PLACEHOLDER_GIF = "https://media.giphy.com/media/ICOgUNjpvO0PC/giphy.gif";

const EASE = "cubic-bezier(0.16, 1, 0.3, 1)";

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
  /** Indices whose video or image failed to load, keyed so each is retried once. */
  const [failedMedia, setFailedMedia] = useState<Record<number, boolean>>({});

  const markBroken = (index: number) =>
    setFailedMedia((prev) =>
      prev[index] ? prev : { ...prev, [index]: true },
    );
  /** One flag for all rows: they share the same stand-in gif URL. */
  const [gifFailed, setGifFailed] = useState(false);

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

        const src = item.image?.src;
        const isVideo =
          !!src && (src.endsWith(".mp4") || src.endsWith(".webm"));
        const isImage = !!src && !isVideo && !src.startsWith("/videos");
        const broken = failedMedia[i];
        const mediaStyle: CSSProperties = {
          width: "100%",
          height: "100%",
          objectFit: "cover",
          objectPosition: "center top",
          display: "block",
          borderRadius: "10px",
        };

        return (
          <div
            key={i}
            onMouseEnter={() => setHovered(i)}
            onClick={() => onItemClick?.(i)}
            style={{
              position: "relative",
              display: "flex",
              flexDirection: "column",
              width: "100%",
              cursor: "none",
              paddingTop: "20px",
              borderTop: i === 0 ? "0.5px solid #1a1a1a" : undefined,
              transition: `all 0.4s ${EASE}`,
            }}
          >
            {/* Text row: title, index, and the blue sweep beneath them */}
            <div
              style={{
                position: "relative",
                display: "flex",
                alignItems: "center",
                justifyContent: justify,
                width: "100%",
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
                  transition: `width 0.45s ${EASE}`,
                  pointerEvents: "none",
                }}
              />
            </div>

            {/* Media block: collapsed at rest, opens beneath the text on hover */}
            <div
              aria-hidden={!isHovered}
              style={{
                position: "relative",
                width: "100%",
                height: isHovered ? "280px" : "0px",
                marginTop: isHovered ? "16px" : "0px",
                overflow: "hidden",
                borderRadius: "10px",
                background: "#111111",
                transition: `height 0.45s ${EASE}, margin-top 0.45s ${EASE}`,
              }}
            >
              {isVideo && !broken ? (
                <video
                  src={src}
                  autoPlay
                  muted
                  loop
                  playsInline
                  onError={() => markBroken(i)}
                  style={mediaStyle}
                />
              ) : isImage && !broken ? (
                // eslint-disable-next-line @next/next/no-img-element -- arbitrary project asset URLs
                <img
                  src={src}
                  alt={item.image?.alt || item.text || ""}
                  onError={() => markBroken(i)}
                  style={mediaStyle}
                />
              ) : !gifFailed ? (
                // eslint-disable-next-line @next/next/no-img-element -- remote gif; next/image would need a config change
                <img
                  src={PLACEHOLDER_GIF}
                  alt={`${item.text ?? "Project"} preview`}
                  loading="eager"
                  onError={(e) => {
                    e.currentTarget.style.display = "none";
                    setGifFailed(true);
                  }}
                  style={mediaStyle}
                />
              ) : (
                // Dark card shown only when the stand-in gif itself fails
                <div
                  style={{
                    position: "absolute",
                    inset: 0,
                    background: "#111111",
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    justifyContent: "center",
                    gap: "8px",
                    fontFamily: "Inter",
                  }}
                >
                  <svg width="48" height="48" viewBox="0 0 48 48">
                    <circle
                      cx="24"
                      cy="24"
                      r="20"
                      fill="rgba(0,153,255,0.15)"
                      stroke="rgba(0,153,255,0.4)"
                      strokeWidth="1"
                    />
                    <polygon
                      points="20,16 32,24 20,32"
                      fill="rgba(0,153,255,0.8)"
                    />
                  </svg>
                  <div
                    style={{
                      fontSize: "9px",
                      color: "#222222",
                      letterSpacing: "0.15em",
                      textTransform: "uppercase",
                    }}
                  >
                    Preview soon
                  </div>
                </div>
              )}

              <div
                style={{
                  position: "absolute",
                  inset: 0,
                  background:
                    "linear-gradient(to bottom, transparent 60%, rgba(9,9,9,0.8) 100%)",
                  borderRadius: "10px",
                  pointerEvents: "none",
                }}
              />

              <div
                style={{
                  position: "absolute",
                  bottom: "16px",
                  left: "20px",
                  fontSize: "11px",
                  color: "rgba(255,255,255,0.4)",
                  letterSpacing: "0.1em",
                  textTransform: "uppercase",
                  fontFamily: "Inter",
                  pointerEvents: "none",
                }}
              >
                {item.text}
              </div>
            </div>

            {/* Hairline that the media pushes down while the row is open */}
            <div
              style={{
                height: "0.5px",
                background: "#1a1a1a",
                marginTop: isHovered ? "16px" : "20px",
                transition: `margin-top 0.45s ${EASE}`,
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
              background: "#0a0a0a",
              border: "0.5px solid rgba(0,153,255,0.25)",
              boxShadow:
                "0 0 30px rgba(0,153,255,0.15), 0 8px 32px rgba(0,0,0,0.6)",
            }}
          >
            {(() => {
              const item = list[hovered];
              const src = item.image?.src;
              const isVideo =
                !!src && (src.endsWith(".mp4") || src.endsWith(".webm"));
              const isImage = !!src && !isVideo && !src.startsWith("/videos");
              // A missing asset must not leave an empty box behind, so a failed
              // load falls through to the placeholder card.
              const broken = failedMedia[hovered];

              if (isVideo && !broken) {
                return (
                  <video
                    src={src}
                    autoPlay
                    muted
                    loop
                    playsInline
                    onError={() => markBroken(hovered)}
                    style={{
                      width: "100%",
                      height: "100%",
                      objectFit: "cover",
                      display: "block",
                    }}
                  />
                );
              }

              if (isImage && !broken) {
                return (
                  <img
                    src={src}
                    alt={item.image?.alt || item.text || ""}
                    onError={() => markBroken(hovered)}
                    style={{
                      width: "100%",
                      height: "100%",
                      objectFit: "cover",
                      display: "block",
                    }}
                  />
                );
              }

              return (
                <div
                  style={{
                    width: "100%",
                    height: "100%",
                    background: "#111111",
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    justifyContent: "center",
                    gap: "8px",
                    fontFamily: "Inter",
                  }}
                >
                  <svg width="48" height="48" viewBox="0 0 48 48">
                    <circle
                      cx="24"
                      cy="24"
                      r="20"
                      fill="rgba(0,153,255,0.15)"
                      stroke="rgba(0,153,255,0.4)"
                      strokeWidth="1"
                    />
                    <polygon
                      points="20,16 32,24 20,32"
                      fill="rgba(0,153,255,0.8)"
                    />
                  </svg>
                  <div
                    style={{
                      fontSize: "11px",
                      color: "#333333",
                      letterSpacing: "0.12em",
                      textTransform: "uppercase",
                      textAlign: "center",
                      padding: "0 16px",
                    }}
                  >
                    {item.text}
                  </div>
                  <div
                    style={{
                      fontSize: "9px",
                      color: "#222222",
                      letterSpacing: "0.15em",
                      textTransform: "uppercase",
                      marginTop: "2px",
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
