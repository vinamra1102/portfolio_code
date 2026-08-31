"use client";

/**
 * Halftone dot grid drawn as inline SVG. The dot pattern is masked by a radial
 * fade so the texture reads brightest at `maskPosition` and dissolves toward
 * the edges. Ids are derived from the props so two instances on one page do
 * not collide in the document-wide SVG id namespace.
 */
export function HalftoneTexture({
  maskPosition = "60% 40%",
  blue = false,
}: {
  maskPosition?: string;
  blue?: boolean;
}) {
  const color = blue ? "rgba(0,153,255,0.055)" : "rgba(255,255,255,0.065)";
  const slug = `${blue ? "b" : "w"}${maskPosition.replace(/\s|%/g, "")}`;
  const [cx, cy] = maskPosition.split(" ");

  return (
    <div
      aria-hidden
      style={{
        position: "absolute",
        inset: 0,
        zIndex: 0,
        pointerEvents: "none",
        overflow: "hidden",
      }}
    >
      <svg
        width="100%"
        height="100%"
        xmlns="http://www.w3.org/2000/svg"
        style={{ position: "absolute", inset: 0 }}
      >
        <defs>
          <pattern
            id={`dots-${slug}`}
            x="0"
            y="0"
            width="18"
            height="18"
            patternUnits="userSpaceOnUse"
          >
            <circle cx="1" cy="1" r="1" fill={color} />
          </pattern>
          <radialGradient
            id={`fade-${slug}`}
            cx={cx}
            cy={cy}
            r="65%"
            gradientUnits="objectBoundingBox"
          >
            <stop offset="0%" stopColor="white" stopOpacity="1" />
            <stop offset="50%" stopColor="white" stopOpacity="0.3" />
            <stop offset="100%" stopColor="white" stopOpacity="0" />
          </radialGradient>
          <mask id={`mask-${slug}`}>
            <rect width="100%" height="100%" fill={`url(#fade-${slug})`} />
          </mask>
        </defs>
        <rect
          width="100%"
          height="100%"
          fill={`url(#dots-${slug})`}
          mask={`url(#mask-${slug})`}
        />
      </svg>
    </div>
  );
}

export default HalftoneTexture;
