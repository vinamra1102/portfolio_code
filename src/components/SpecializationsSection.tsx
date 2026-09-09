"use client";

import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";

const EASE = [0.16, 1, 0.3, 1] as const;

/** Stand-in for every thumbnail and clip until the real assets land. */
const PLACEHOLDER_GIF = "https://media.giphy.com/media/ICOgUNjpvO0PC/giphy.gif";

/**
 * True when a source is something a <video> can actually decode. The current
 * placeholders are gifs, which a video element cannot play, so those render
 * as an image in the motion layer instead of a silently blank <video>.
 */
const isPlayableVideo = (src: string) =>
  /\.(webm|webm|ogg|mov|m4v)(\?.*)?$/i.test(src);

// ============================================================
// MEDIA CONFIGURATION - Edit this section to adjust images and
// gifs. No other part of the file needs to be touched.
// ============================================================

// HOW TO USE THIS CONFIG:
//
// thumbnail     - path to the still image shown when not hovering
//                 use "/media/img/filename.jpg" for local files
//                 or a full URL for external images
//
// video         - path to the gif or video shown on hover
//                 use "/media/gif/filename.gif" for local gifs
//                 use "/media/videos/filename.webm" for videos
//
// thumbnailScale - zoom level of the image at rest
//                  1.0 = no zoom, 1.1 = slight zoom, 1.5 = very zoomed in
//                  increase if image feels too small inside the pie slice
//                  decrease if image overflows or looks too cropped
//
// videoScale    - zoom level of the gif/video on hover
//                  keep this higher than thumbnailScale for a subtle zoom effect
//                  1.2 to 1.5 is a good range
//
// thumbnailPosition - which point of the image stays centered in the frame at rest
//                      { x, y } as percentages of the image, 0-100 each
//                      x: 0 = left edge, 50 = horizontal center, 100 = right edge
//                      y: 0 = top edge,  50 = vertical center,   100 = bottom edge
//                      e.g. { x: 20, y: 0 } keeps the point 20% in from the left,
//                      right at the top, centered in the frame - use this to pin
//                      a face/logo/detail that sits in a specific spot in the source
//                      image. Values below 0 or above 100 are valid too, and push
//                      the focal point past the image's own edge.
//
// thumbnailFit - how the thumbnail scales inside the media frame
//                "cover" fills the frame but may crop
//                "contain" preserves the entire image without cropping
//
// videoPosition - which point of the gif/video stays centered on hover
//                 same { x, y } system as thumbnailPosition

const MEDIA_CONFIG = {
  simulation: {
    thumbnail: "/media/img/sim.jpeg",
    video: "/media/gif/manip_demo.webm",
    thumbnailScale: 0.875,
    videoScale: 0.725,
    thumbnailPosition: { x: 32, y: 55 },
    thumbnailFit: "cover" as const,
    videoPosition: { x: 21, y: 59 },
  },
  training: {
    thumbnail: "/media/img/isaac.jpeg",
    video: "/media/gif/isaac.webm",
    thumbnailScale: 1.0,
    videoScale: 1.5,
    thumbnailPosition: { x: 50, y: 25 },
    thumbnailFit: "contain" as const,
    videoPosition: { x: 30, y: -4 },
    videoFit: "contain" as const,
  },
  deployment: {
    thumbnail: "/media/img/train.jpeg",
    video: "/media/gif/train.webm",
    thumbnailScale: 0.93,
    videoScale: 1,
    thumbnailPosition: { x: 50, y: 49 },
    thumbnailFit: "cover" as const,
    videoPosition: { x: 70, y: 70 },
  },
  hardware: {
    thumbnail: "/media/img/hardware.jpeg",
    video: "/media/gif/hardware.webm",
    thumbnailScale: 0.42,
    videoScale: 0.755,
    thumbnailPosition: { x: 51, y: 50 },
    thumbnailFit: "contain" as const,
    videoPosition: { x: 60, y: 50 },
    videoFit: "contain" as const,
  },
}

// ============================================================
// END OF MEDIA CONFIGURATION
// ============================================================

type MediaConfig = typeof MEDIA_CONFIG.simulation & { videoFit?: "cover" | "contain" }

type SegmentProject = {
  title: string;
  status: string;
  tagline: string;
  description: string;
  tech: string[];
  github: string;
  initials: string;
};

/** Shared by the Training slice and the Hardware centre, which open the same project. */
const OPENBOT_GIRAFFE: SegmentProject = {
  title: "OpenBot Giraffe",
  status: "Open Source",
  tagline: "Affordable 5-DOF robotic arm for hobbyists and researchers",
  description:
    "Designed an affordable 5-DOF robotic manipulator with a 3D-printed frame and ST3215 servos. Integrated with LeRobot, ROS2 and MoveIt for trajectory planning, teleoperation and imitation learning in both simulated and real-world applications.",
  tech: ["ROS2", "LeRobot", "MoveIt2", "Python", "Fusion 360", "Isaac Sim"],
  github: "https://github.com/anantppandey/openbot-giraffe",
  initials: "OG",
};

const segments = [
  {
    id: "simulation",
    title: "SIMULATION & PLANNING",
    tools: "ROS2 · Gazebo · MoveIt2",
    description: "MOTION PLANNING & GRASPING",
    startAngle: -90,
    endAngle: 30,
    // Swap for "/thumbnails/simulation.jpg" and "/videos/simulation-demo.webm"
    thumbnail: "/media/img/sim.jpeg",
    videoSrc: "/media/gif/manip_demo.webm",
    primaryProject: {
      title: "MuJoCo-Gazebo RL Transfer",
      status: "Research",
      tagline: "PPO reach policy trained in MuJoCo and transferred to Gazebo",
      description:
        "Trained a PPO reach policy from scratch in MuJoCo using Stable-Baselines3, raising success rate from 37% to 78% through seed-controlled ablation. Built a ROS2 and Gazebo pipeline transferring the policy across simulators with retry-based trajectory generation and closed-loop control.",
      tech: ["MuJoCo", "Stable-Baselines3", "ROS2", "Gazebo", "Python", "PPO"],
      github: "https://github.com/anantppandey/mujoco-gazebo-transfer",
      initials: "MG",
    } satisfies SegmentProject,
  },
  {
    id: "training",
    title: "DATA COLLECTION & TELEOPERATION",
    tools: "Isaac Sim",
    description: "TELEOPERATION & DATA CAPTURE",
    startAngle: 30,
    endAngle: 150,
    // Swap for "/thumbnails/training.jpg" and "/videos/training-demo.webm"
    thumbnail: "/media/img/isaac.jpeg",
    videoSrc: "/media/gif/isaac.webm",
    primaryProject: OPENBOT_GIRAFFE,
  },
  {
    id: "deployment",
    title: "RL & TRAINING",
    tools: "MuJoCo · SB3 · LeRobot",
    description: "POLICY TRAINING & OPTIMIZATION",
    startAngle: 150,
    endAngle: 270,
    // Swap for "/thumbnails/deployment.jpg" and "/videos/deployment-demo.webm"
    thumbnail: "/media/img/train.jpeg",
    videoSrc: "/media/gif/train.webm",
    primaryProject: {
      title: "5-DOF Manipulation Stack",
      status: "Robotics",
      tagline: "Custom IK solver with collision-aware grasp planning",
      description:
        "Engineered a custom 5-DOF IK solver and octomap-based obstacle avoidance in Gazebo, planning collision-aware grasps with MoveIt Task Constructor. Built a ROS2 action-server pipeline with multi-object perception and automatic grasp-failure retry for autonomous pick-and-place.",
      tech: ["ROS2", "MoveIt2", "Gazebo", "Python", "MoveIt Task Constructor"],
      github: "https://github.com/anantppandey/manipulation-stack",
      initials: "5D",
    } satisfies SegmentProject,
  },
];

const centerData = {
  id: "hardware",
  title: "Hardware",
  subtitle: "Real Robot",
  // Swap for the real robot thumbnail and demo clip when available
  thumbnail: "/media/img/hardware.jpeg",
  videoSrc: "/media/gif/hardware.webm",
  primaryProject: OPENBOT_GIRAFFE,
};

// ---- geometry ---------------------------------------------------------------

const CX = 350;
const CY = 350;
const OUTER_R = 240;
/** A hovered slice grows outward to this radius. */
const HOVER_OUTER_R = 340;
/** How far a hovered slice slides along its own mid-angle. */
const HOVER_SHIFT = 55;
const INNER_R = 110;
const HARDWARE_R = 108;
const HARDWARE_HOVER_R = 150;
const LABEL_R = 175;

const toRad = (deg: number) => (deg * Math.PI) / 180;

/** Point on a circle of radius r at `deg`, where 0 is 3 o'clock and angles run clockwise. */
function polar(r: number, deg: number) {
  return { x: CX + r * Math.cos(toRad(deg)), y: CY + r * Math.sin(toRad(deg)) };
}

/**
 * Closed donut-slice path between two radii. The slice is shrunk by `gapDeg`
 * on each side so neighbouring slices show a visible seam.
 */
function describeArc(
  outerR: number,
  innerR: number,
  startDeg: number,
  endDeg: number,
  gapDeg = 1.5,
) {
  const start = startDeg + gapDeg;
  const end = endDeg - gapDeg;
  const large = end - start > 180 ? 1 : 0;
  const oStart = polar(outerR, start);
  const oEnd = polar(outerR, end);
  const iStart = polar(innerR, start);
  const iEnd = polar(innerR, end);
  return [
    `M ${oStart.x} ${oStart.y}`,
    `A ${outerR} ${outerR} 0 ${large} 1 ${oEnd.x} ${oEnd.y}`,
    `L ${iEnd.x} ${iEnd.y}`,
    `A ${innerR} ${innerR} 0 ${large} 0 ${iStart.x} ${iStart.y}`,
    "Z",
  ].join(" ");
}

const midAngle = (s: { startAngle: number; endAngle: number }) =>
  (s.startAngle + s.endAngle) / 2;

/** The pie's drawing surface, which every media layer fills before clipping. */
const PIE_SIZE = 700;

/** Midline of the donut band, where a slice's own area is centred. */
const MEDIA_MID_R = (INNER_R + HOVER_OUTER_R) / 2;

/**
 * Anchor point for a slice's zoom, as a percentage of the pie box. Scaling
 * about the pie's centre would push the enlarged frame out of the slice's
 * clip, so each slice anchors on the middle of its own band instead.
 */
function mediaOriginFor(deg: number) {
  const p = polar(MEDIA_MID_R, deg);
  const pct = (v: number) => ((v / PIE_SIZE) * 100).toFixed(1);
  return `${pct(p.x)}% ${pct(p.y)}%`;
}

/**
 * Media revealed inside a slice or the centre disc. It fills the whole pie
 * and relies on the caller's clipPath to cut it to shape, so the video's
 * framing stays fixed while the slice grows around it. Everything here uses
 * inline styles: foreignObject content gets no reliable class support.
 */
function SegmentMedia({
  active,
  thumbnail,
  videoSrc,
  origin,
  registerVideo,
  label,
  config,
}: {
  active: boolean;
  thumbnail: string;
  videoSrc: string;
  /** transform-origin for the zoom, as a percentage pair. */
  origin: string;
  /** Hands the video element to the section so it can play and pause it. */
  registerVideo: (el: HTMLVideoElement | null) => void;
  label: string;
  config: MediaConfig;
}) {
  const playable = isPlayableVideo(videoSrc);

  /*
   * Focal positioning is implemented with a real transform instead of
   * object-position. object-position is inconsistent with "contain" because
   * it has little/no effect when there is no overflow to move.
   *
   * Coordinate system:
   *   50, 50 = centred
   *   x < 50 = move image right
   *   x > 50 = move image left
   *   y < 50 = move image down
   *   y > 50 = move image up
   *
   * Values outside 0-100 are allowed intentionally.
   */
  const focal = active ? config.videoPosition : config.thumbnailPosition;
  const scale = active ? config.videoScale : config.thumbnailScale;
  const translateX = 50 - focal.x;
  const translateY = 50 - focal.y;

  const layer: React.CSSProperties = {
    position: "absolute",
    inset: 0,
    width: "100%",
    height: "100%",
    objectFit: active ? (config.videoFit ?? "cover") : config.thumbnailFit,
    objectPosition: "50% 50%",
    transformOrigin: origin,
    transform: `translate(${translateX}%, ${translateY}%) scale(${scale})`,
  }

  return (
    <div
      style={{
        position: "relative",
        width: `${PIE_SIZE}px`,
        height: `${PIE_SIZE}px`,
        overflow: "hidden",
        // Shows through if an asset fails, so a slice is never empty.
        background: "rgba(0,10,25,0.85)",
      }}
    >
      {/* Layer 1: thumbnail, dimmed at rest and faded out under the motion */}
      {/* eslint-disable-next-line @next/next/no-img-element -- remote asset; next/image would need a config change */}
      <img
        src={thumbnail}
        alt={`${label} thumbnail`}
        style={{
          ...layer,
          zIndex: 1,
          opacity: active ? 0 : 1.0,
          transitionProperty: "opacity, transform",
          transition:
            "opacity 0.4s ease, transform 0.6s cubic-bezier(0.16, 1, 0.3, 1)",
        }}
      />

      {/* Layer 2: the motion, revealed on hover */}
      {playable ? (
        <video
          ref={registerVideo}
          src={videoSrc}
          muted
          loop
          playsInline
          style={{
            ...layer,
            zIndex: 2,
            opacity: active ? 1 : 0,
            transition:
              "opacity 0.4s ease, transform 0.6s cubic-bezier(0.16, 1, 0.3, 1)",
          }}
        />
      ) : (
        // eslint-disable-next-line @next/next/no-img-element -- gif placeholder stands in for the clip
        <img
          src={videoSrc}
          alt={`${label} preview`}
          style={{
            ...layer,
            zIndex: 2,
            opacity: active ? 1 : 0,
            transition:
              "opacity 0.4s ease, transform 0.6s cubic-bezier(0.16, 1, 0.3, 1)",
          }}
        />
      )}

      {/* Layer 3: rim gradient, lifted while hovered so more reads through */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          zIndex: 3,
          pointerEvents: "none",
          opacity: active ? 0.5 : 1,
          transition: "opacity 0.4s ease",
          background:
            "radial-gradient(circle at center, rgba(0,5,15,0.1) 0%, rgba(0,0,0,0.6) 70%, rgba(0,0,0,0.9) 100%)",
        }}
      />
    </div>
  );
}

const PIE_KEYFRAMES = `
  @keyframes pulse-ring {
    0%, 100% { opacity: 0.4; transform: scale(1); }
    50% { opacity: 1; transform: scale(1.04); }
  }
`;

// ---- section ------------------------------------------------------------------

export default function SpecializationsSection() {
  const [hoveredSegment, setHoveredSegment] = useState<string | null>(null);
  const [selectedProject, setSelectedProject] = useState<SegmentProject | null>(
    null,
  );
  // The pie is laid out in fixed pixels, so it scales to fit rather than
  // reflowing. Starts at 1 so server and first client render agree.
  const [pieScale, setPieScale] = useState(1);
  /** One entry per slice plus the Hardware disc, keyed by segment id. */
  const videoRefs = useRef<Record<string, HTMLVideoElement | null>>({});
  const isHovered = (id: string) => hoveredSegment === id;
  const isDimmed = (id: string) =>
    hoveredSegment !== null && hoveredSegment !== id;

  useEffect(() => {
    const pick = () => {
      const w = window.innerWidth;
      // Only the scale differs on mobile, purely so the 700px pie fits the
      // viewport. The layout itself stays identical to desktop.
      setPieScale(w < 768 ? 0.42 : w < 900 ? 0.72 : w < 1200 ? 0.85 : 1);
    };
    pick();
    window.addEventListener("resize", pick);
    return () => window.removeEventListener("resize", pick);
  }, []);

  // Only the hovered shape's clip plays; the rest rewind so each hover starts
  // from the top. play() rejects if the source cannot load, hence the catch.
  useEffect(() => {
    for (const [id, el] of Object.entries(videoRefs.current)) {
      if (!el) continue;
      if (id === hoveredSegment) {
        void el.play().catch(() => {});
      } else {
        el.pause();
        el.currentTime = 0;
      }
    }
  }, [hoveredSegment]);

  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setSelectedProject(null);
    };
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, []);

  useEffect(() => {
    if (selectedProject) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [selectedProject]);

  return (
    <section
      id="specializations"
      className="sticky left-0 top-0 flex h-screen w-full items-center justify-center overflow-hidden bg-canvas"
    >
      <p className="absolute left-6 top-12 z-[5] text-[11px] uppercase tracking-[0.18em] text-[#444444] md:left-[60px]">
        02 — Specializations
      </p>

      <div
        className="relative z-[2] shrink-0"
        style={{
          width: 700,
          height: 700,
          marginTop: -40,
          scale: pieScale,
          transformOrigin: "center center",
        }}
      >
        <svg
          viewBox="0 0 700 700"
          className="absolute inset-0 h-full w-full"
          style={{ overflow: "visible" }}
        >
          <style>{PIE_KEYFRAMES}</style>
          <defs>
            <filter
              id="segment-glow"
              x="-20%"
              y="-20%"
              width="140%"
              height="140%"
            >
              <feGaussianBlur stdDeviation="8" result="coloredBlur" />
              <feMerge>
                <feMergeNode in="coloredBlur" />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>
            <filter
              id="center-glow"
              x="-30%"
              y="-30%"
              width="160%"
              height="160%"
            >
              <feGaussianBlur stdDeviation="12" result="coloredBlur" />
              <feMerge>
                <feMergeNode in="coloredBlur" />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>

            {/* Media clips use the expanded radius and the same seam gap as
                the slice paths, so footage never bleeds into the dividers. */}
            {segments.map((segment) => (
              <clipPath key={segment.id} id={`clip-${segment.id}`}>
                <path
                  d={describeArc(
                    HOVER_OUTER_R,
                    INNER_R,
                    segment.startAngle,
                    segment.endAngle,
                  )}
                />
              </clipPath>
            ))}
            <clipPath id="clip-hardware">
              <motion.circle
                cx={CX}
                cy={CY}
                r={HARDWARE_R}
                animate={{
                  r:
                    hoveredSegment === centerData.id
                      ? HARDWARE_HOVER_R
                      : HARDWARE_R,
                }}
                transition={{ type: "spring", stiffness: 300, damping: 28 }}
              />
            </clipPath>
          </defs>

          {/* Outer ring decoration */}
          <motion.circle
            cx={CX}
            cy={CY}
            r={248}
            fill="none"
            stroke="#0099ff"
            strokeWidth={0.5}
            strokeDasharray="3 6"
            animate={{ strokeOpacity: hoveredSegment ? 0.2 : 0.06 }}
            transition={{ duration: 0.4, ease: "easeInOut" }}
          />
          <motion.circle
            cx={CX}
            cy={CY}
            r={260}
            fill="none"
            stroke="rgba(0,153,255,0.04)"
            strokeWidth={12}
            filter="url(#segment-glow)"
            animate={{ opacity: hoveredSegment ? 0.6 : 0 }}
            transition={{ duration: 0.4, ease: "easeInOut" }}
          />

          {/* Segments */}
          {segments.map((segment, i) => (
            <motion.g
              key={segment.id}
              initial={{ opacity: 0, scale: 0.85, x: 0, y: 0 }}
              animate={{
                opacity: 1,
                scale: 1,
                // Slide the whole slice along its own mid-angle on hover. The
                // media and its clip ride along, staying registered together.
                x: isHovered(segment.id)
                  ? Math.cos(toRad(midAngle(segment))) * HOVER_SHIFT
                  : 0,
                y: isHovered(segment.id)
                  ? Math.sin(toRad(midAngle(segment))) * HOVER_SHIFT
                  : 0,
              }}
              transition={{
                opacity: { duration: 0.7, delay: i * 0.15, ease: EASE },
                scale: { duration: 0.7, delay: i * 0.15, ease: EASE },
                default: { type: "spring", stiffness: 260, damping: 30 },
              }}
              style={{
                transformBox: "view-box",
                transformOrigin: "350px 350px",
              }}
            >
              <motion.path
                d={describeArc(
                  OUTER_R,
                  INNER_R,
                  segment.startAngle,
                  segment.endAngle,
                )}
                fill="#0d1a2a"
                stroke="rgba(0,153,255,0.15)"
                strokeWidth={1}
                initial={{
                  d: describeArc(
                    OUTER_R,
                    INNER_R,
                    segment.startAngle,
                    segment.endAngle,
                  ),
                  fill: "#0d1a2a",
                  stroke: "rgba(0,153,255,0.15)",
                  strokeWidth: 1,
                  opacity: 1,
                }}
                animate={{
                  d: describeArc(
                    isHovered(segment.id) ? HOVER_OUTER_R : OUTER_R,
                    INNER_R,
                    segment.startAngle,
                    segment.endAngle,
                  ),
                  fill: isHovered(segment.id)
                    ? "#0a2040"
                    : isDimmed(segment.id)
                      ? "#080e18"
                      : "#0d1a2a",
                  stroke: isHovered(segment.id)
                    ? "rgba(0,153,255,0.8)"
                    : isDimmed(segment.id)
                      ? "rgba(0,153,255,0.08)"
                      : "rgba(0,153,255,0.15)",
                  strokeWidth: isHovered(segment.id) ? 1.5 : 1,
                  opacity: isDimmed(segment.id) ? 0.7 : 1,
                }}
                transition={{
                  d: { type: "spring", stiffness: 300, damping: 28 },
                  default: { duration: 0.35, ease: "easeInOut" },
                }}
                filter={
                  isHovered(segment.id) ? "url(#segment-glow)" : undefined
                }
                onMouseEnter={() => setHoveredSegment(segment.id)}
                onMouseLeave={() => setHoveredSegment(null)}
                onClick={() => setSelectedProject(segment.primaryProject)}
                style={{ cursor: "none", pointerEvents: "all" }}
              />

              {/* Media inside the slice. Hits pass through to the path. */}
              <foreignObject
                x={0}
                y={0}
                width={PIE_SIZE}
                height={PIE_SIZE}
                clipPath={`url(#clip-${segment.id})`}
                style={{ pointerEvents: "none" }}
              >
                <SegmentMedia
                  active={isHovered(segment.id)}
                  thumbnail={segment.thumbnail}
                  videoSrc={segment.videoSrc}
                  origin={mediaOriginFor(midAngle(segment))}
                  label={segment.title}
                  registerVideo={(el) => {
                    videoRefs.current[segment.id] = el;
                  }}
                  config={MEDIA_CONFIG[segment.id as keyof typeof MEDIA_CONFIG]}
                />
              </foreignObject>
            </motion.g>
          ))}

          {/* Dividers between segments */}
          {[30, 150, 270].map((deg) => {
            const a = polar(INNER_R, deg);
            const b = polar(OUTER_R, deg);
            return (
              <line
                key={deg}
                x1={a.x}
                y1={a.y}
                x2={b.x}
                y2={b.y}
                stroke="#090909"
                strokeWidth={2}
              />
            );
          })}

          {/* Centre: Hardware */}
          <motion.g
            initial={{ opacity: 0, scale: 0.5 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.7, delay: 0.5, ease: EASE }}
            style={{ transformBox: "view-box", transformOrigin: "350px 350px" }}
          >
            <motion.circle
              cx={CX}
              cy={CY}
              r={HARDWARE_R}
              animate={{
                r:
                  hoveredSegment === centerData.id
                    ? HARDWARE_HOVER_R
                    : HARDWARE_R,
              }}
              transition={{ type: "spring", stiffness: 300, damping: 28 }}
              fill="#090909"
              stroke={
                hoveredSegment === centerData.id
                  ? "rgba(0,153,255,0.6)"
                  : "rgba(0,153,255,0.3)"
              }
              strokeWidth={1}
              filter={
                hoveredSegment === centerData.id
                  ? "url(#center-glow)"
                  : undefined
              }
              style={{ transition: "stroke 0.35s ease" }}
            />

            {/* Media inside the disc, beneath the rings and the title text. */}
            <foreignObject
              x={0}
              y={0}
              width={PIE_SIZE}
              height={PIE_SIZE}
              clipPath="url(#clip-hardware)"
              style={{ pointerEvents: "none" }}
            >
              <SegmentMedia
                active={hoveredSegment === centerData.id}
                thumbnail={centerData.thumbnail}
                videoSrc={centerData.videoSrc}
                origin="50% 50%"
                label={centerData.title}
                registerVideo={(el) => {
                  videoRefs.current[centerData.id] = el;
                }}
                config={MEDIA_CONFIG.hardware}
              />
            </foreignObject>

            <circle
              cx={CX}
              cy={CY}
              r={100}
              fill="none"
              stroke="rgba(0,153,255,0.08)"
              strokeWidth={0.5}
              style={{
                transformBox: "view-box",
                transformOrigin: "350px 350px",
                animation: "pulse-ring 3s ease-in-out infinite",
              }}
            />
            <circle
              cx={CX}
              cy={CY}
              r={90}
              fill="none"
              stroke="rgba(0,153,255,0.12)"
              strokeWidth={0.5}
            />
            <motion.g
              animate={{
                scale: hoveredSegment === centerData.id
                  ? HARDWARE_HOVER_R / HARDWARE_R
                  : 1,
              }}
              transition={{ type: "spring", stiffness: 300, damping: 28 }}
              style={{
                transformBox: "view-box",
                transformOrigin: "350px 350px",
              }}
            >
              <text
                x={CX}
                y={277}
                textAnchor="middle"
                fill="#ffffff"
                fontSize={18}
                fontWeight={600}
                fontFamily="Inter"
                letterSpacing={-0.5}
              >
                Hardware
              </text>
            </motion.g>
            <motion.circle
              cx={CX}
              cy={CY}
              r={HARDWARE_R}
              animate={{
                r:
                  hoveredSegment === centerData.id
                    ? HARDWARE_HOVER_R
                    : HARDWARE_R,
              }}
              transition={{ type: "spring", stiffness: 300, damping: 28 }}
              fill="transparent"
              onMouseEnter={() => setHoveredSegment(centerData.id)}
              onMouseLeave={() => setHoveredSegment(null)}
              onClick={() => setSelectedProject(centerData.primaryProject)}
              style={{ cursor: "none", pointerEvents: "all" }}
            />
          </motion.g>

          {/* Segment labels: true curved text following the outer circumference. */}
          <defs>
            {segments.map((segment) => {
              const angle = midAngle(segment);
              const radius = isHovered(segment.id) ? 390 : 365;
              const start = angle - 42;
              const end = angle + 42;
              const startPoint = polar(radius, start);
              const endPoint = polar(radius, end);

              return (
                <path
                  key={`label-path-${segment.id}`}
                  id={`label-arc-${segment.id}`}
                  d={`M ${startPoint.x} ${startPoint.y} A ${radius} ${radius} 0 0 1 ${endPoint.x} ${endPoint.y}`}
                  fill="none"
                  stroke="none"
                />
              );
            })}
          </defs>

          {segments.map((segment) => {
            const angle = midAngle(segment);
            // The title is already at the expanded position at rest.
            // On hover, move the title farther outward and put each metadata
            // line on its own larger-radius arc so the three lines never collide.
            const titleRadius = isHovered(segment.id) ? 420 : 365;
            const toolsRadius = isHovered(segment.id) ? 452 : 365;
            const descriptionRadius = isHovered(segment.id) ? 470 : 365;

            const makeArc = (radius: number) => {
              const start = angle - 52;
              const end = angle + 52;
              const startPoint = polar(radius, start);
              const endPoint = polar(radius, end);
              return `M ${startPoint.x} ${startPoint.y} A ${radius} ${radius} 0 0 1 ${endPoint.x} ${endPoint.y}`;
            };

            return (
              <motion.g
                key={`label-${segment.id}`}
                animate={{ x: 0, y: 0 }}
                transition={{ type: "spring", stiffness: 260, damping: 30 }}
                style={{ pointerEvents: "none" }}
              >
                <path
                  id={`label-title-arc-${segment.id}`}
                  d={makeArc(titleRadius)}
                  fill="none"
                  stroke="none"
                />
                <path
                  id={`label-tools-arc-${segment.id}`}
                  d={makeArc(toolsRadius)}
                  fill="none"
                  stroke="none"
                />
                <path
                  id={`label-description-arc-${segment.id}`}
                  d={makeArc(descriptionRadius)}
                  fill="none"
                  stroke="none"
                />

                <motion.text
                  initial={{ opacity: 0 }}
                  animate={{
                    opacity: isDimmed(segment.id) ? 0.25 : 1,
                  }}
                  transition={{ opacity: { duration: 0.3 } }}
                  fill={isHovered(segment.id) ? "#ffffff" : "#cccccc"}
                  fontSize={29}
                  fontWeight={700}
                  fontFamily="Inter"
                  letterSpacing="-0.35px"
                  textAnchor="middle"
                  dominantBaseline="middle"
                  style={{
                    textShadow: isHovered(segment.id)
                      ? "0 0 18px rgba(0,153,255,0.45)"
                      : "none",
                  }}
                >
                  <textPath
                    href={`#label-title-arc-${segment.id}`}
                    startOffset="50%"
                  >
                    {segment.title}
                  </textPath>
                </motion.text>

                <motion.text
                  initial={{ opacity: 0 }}
                  animate={{
                    opacity: isHovered(segment.id) ? 1 : 0,
                  }}
                  transition={{ duration: 0.25, ease: EASE }}
                  fill="#0099ff"
                  fontSize={15}
                  fontWeight={500}
                  fontFamily="Inter"
                  letterSpacing="1px"
                  textAnchor="middle"
                  dominantBaseline="middle"
                >
                  <textPath
                    href={`#label-tools-arc-${segment.id}`}
                    startOffset="50%"
                  >
                    {segment.tools}
                  </textPath>
                </motion.text>

                <motion.text
                  initial={{ opacity: 0 }}
                  animate={{
                    opacity: isHovered(segment.id) ? 1 : 0,
                  }}
                  transition={{ duration: 0.3, delay: 0.03, ease: EASE }}
                  fill="#777777"
                  fontSize={11}
                  fontWeight={500}
                  fontFamily="Inter"
                  letterSpacing="0.9px"
                  textAnchor="middle"
                  dominantBaseline="middle"
                >
                  <textPath
                    href={`#label-description-arc-${segment.id}`}
                    startOffset="50%"
                  >
                    {segment.description}
                  </textPath>
                </motion.text>
              </motion.g>
            );
          })}
        </svg>
      </div>

      {/* Full screen project overlay. Kept outside the scaled pie wrapper: a
          transformed ancestor would become the containing block for the fixed
          positioning and trap the overlay inside the pie. */}
      <AnimatePresence>
        {selectedProject && (
          <motion.div
            className="project-overlay-container"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            onClick={() => setSelectedProject(null)}
            role="dialog"
            aria-modal="true"
            aria-label={selectedProject.title}
            style={{
              position: "fixed",
              inset: 0,
              zIndex: 300,
              background: "rgba(9,9,9,0.96)",
              backdropFilter: "blur(20px)",
            }}
          >
            <motion.div
              className="project-overlay-inner"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 20 }}
              transition={{ duration: 0.4, ease: EASE }}
              onClick={(e) => e.stopPropagation()}
            >
              {/* Left: preview */}
              <div
                className="project-overlay-left"
                style={{
                  position: "relative",
                  background: "#0a0a0a",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  flexDirection: "column",
                  gap: "12px",
                }}
              >
                <div
                  className="project-overlay-initials"
                  style={{
                    fontSize: "72px",
                    fontWeight: 500,
                    color: "#1a1a1a",
                    letterSpacing: "-4px",
                  }}
                >
                  {selectedProject.initials}
                </div>
                <div
                  style={{
                    fontSize: "11px",
                    color: "#1e1e1e",
                    letterSpacing: "0.2em",
                    textTransform: "uppercase",
                  }}
                >
                  Preview soon
                </div>
                <div
                  style={{
                    position: "absolute",
                    inset: 0,
                    background:
                      "linear-gradient(to right, transparent 60%, rgba(9,9,9,0.8) 100%)",
                    pointerEvents: "none",
                  }}
                />
              </div>

              {/* Right: details */}
              <div
                className="project-overlay-right"
              >
                <button
                  className="project-overlay-close"
                  onClick={() => setSelectedProject(null)}
                  aria-label="Close project details"
                  onMouseEnter={(e) => {
                    e.currentTarget.style.borderColor = "#0099ff";
                    e.currentTarget.style.color = "#ffffff";
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.borderColor = "#262626";
                    e.currentTarget.style.color = "#999999";
                  }}
                  style={{
                    position: "absolute",
                    top: "32px",
                    right: "32px",
                    width: "40px",
                    height: "40px",
                    borderRadius: "50%",
                    background: "#141414",
                    border: "0.5px solid #262626",
                    color: "#999999",
                    fontSize: "18px",
                    cursor: "none",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  x
                </button>

                <div
                  style={{
                    display: "inline-flex",
                    background: "rgba(255,255,255,0.06)",
                    border: "0.5px solid rgba(255,255,255,0.12)",
                    borderRadius: "100px",
                    padding: "4px 12px",
                    fontSize: "11px",
                    color: "#cccccc",
                    marginBottom: "20px",
                    width: "fit-content",
                  }}
                >
                  {selectedProject.status}
                </div>

                <h2
                  className="project-overlay-title"
                  style={{
                    fontSize: "clamp(28px, 3.5vw, 44px)",
                    fontWeight: 500,
                    color: "#ffffff",
                    letterSpacing: "-2px",
                    lineHeight: 1.0,
                    margin: "0 0 16px 0",
                  }}
                >
                  {selectedProject.title}
                </h2>

                <p
                  className="project-overlay-desc"
                  style={{
                    fontSize: "14px",
                    color: "#666666",
                    lineHeight: 1.6,
                    margin: "0 0 32px 0",
                    maxWidth: "380px",
                  }}
                >
                  {selectedProject.description}
                </p>

                <p
                  style={{
                    fontSize: "11px",
                    color: "#555555",
                    letterSpacing: "0.14em",
                    textTransform: "uppercase",
                    margin: "0 0 12px 0",
                  }}
                >
                  Tools and Technologies
                </p>

                <div
                  className="project-overlay-chips"
                  style={{
                    display: "flex",
                    flexWrap: "wrap",
                    gap: "6px",
                    marginBottom: "32px",
                  }}
                >
                  {selectedProject.tech.map((t) => (
                    <span
                      className="project-overlay-chip"
                      key={t}
                      style={{
                        background: "#1c1c1c",
                        border: "0.5px solid #262626",
                        borderRadius: "100px",
                        padding: "5px 13px",
                        fontSize: "12px",
                        color: "#cccccc",
                      }}
                    >
                      {t}
                    </span>
                  ))}
                </div>

                <p
                  style={{
                    fontSize: "11px",
                    color: "#555555",
                    letterSpacing: "0.14em",
                    textTransform: "uppercase",
                    margin: "0 0 12px 0",
                  }}
                >
                  Links
                </p>

                <a
                  className="project-overlay-github"
                  href={selectedProject.github}
                  target="_blank"
                  rel="noopener noreferrer"
                  onMouseEnter={(e) => {
                    e.currentTarget.style.borderColor = "#0099ff";
                    e.currentTarget.style.color = "#ffffff";
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.borderColor = "#262626";
                    e.currentTarget.style.color = "#cccccc";
                  }}
                  style={{
                    display: "inline-flex",
                    alignItems: "center",
                    gap: "8px",
                    background: "#141414",
                    border: "0.5px solid #262626",
                    borderRadius: "100px",
                    padding: "10px 20px",
                    fontSize: "12px",
                    color: "#cccccc",
                    textDecoration: "none",
                    width: "fit-content",
                    cursor: "none",
                  }}
                >
                  <svg
                    width="14"
                    height="14"
                    viewBox="0 0 24 24"
                    fill="currentColor"
                  >
                    <path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 9 18.13V22" />
                  </svg>
                  View on GitHub
                </a>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}