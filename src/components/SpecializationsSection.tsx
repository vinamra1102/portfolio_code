"use client";

import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { DottedGlowBackground } from "@/components/ui/dotted-glow-background";

const EASE = [0.16, 1, 0.3, 1] as const;

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
    title: "Simulation",
    tools: "Gazebo · Isaac Sim",
    description: "Simulate, test and validate",
    startAngle: -90,
    endAngle: 30,
    videoSrc: "",
    // Replace videoSrc: "/videos/simulation-demo.mp4" when available
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
    title: "Training",
    tools: "MuJoCo · LeRobot",
    description: "RL training and optimisation",
    startAngle: 30,
    endAngle: 150,
    videoSrc: "",
    // Replace videoSrc: "/videos/training-demo.mp4" when available
    primaryProject: OPENBOT_GIRAFFE,
  },
  {
    id: "deployment",
    title: "Deployment",
    tools: "ROS2 · MoveIt2",
    description: "Deploy policy and control robot",
    startAngle: 150,
    endAngle: 270,
    videoSrc: "",
    // Replace videoSrc: "/videos/deployment-demo.mp4" when available
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
  videoSrc: "",
  // Replace videoSrc with the real robot demo when available
  primaryProject: OPENBOT_GIRAFFE,
};

// ---- geometry ---------------------------------------------------------------

const CX = 300;
const CY = 300;
const OUTER_R = 240;
/** A hovered slice grows outward to this radius. */
const HOVER_OUTER_R = 280;
const INNER_R = 110;
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

/** Distance from centre to the video card, just past the expanded slice. */
const POPUP_R = 310;

/** Floating video card. Falls back to a placeholder until a source exists. */
function VideoPopup({ title, videoSrc }: { title: string; videoSrc: string }) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.88, y: 8 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.88, y: 8 }}
      transition={{ duration: 0.22, ease: EASE }}
      aria-hidden="true"
      style={{
        width: 220,
        height: 150,
        borderRadius: 12,
        background: "#0a0a0a",
        border: "0.5px solid rgba(0,153,255,0.25)",
        overflow: "hidden",
        boxShadow: "0 0 30px rgba(0,153,255,0.15), 0 8px 32px rgba(0,0,0,0.6)",
      }}
    >
      {videoSrc ? (
        <video
          src={videoSrc}
          autoPlay
          muted
          loop
          playsInline
          style={{ width: "100%", height: "100%", objectFit: "cover" }}
        />
      ) : (
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
            <polygon points="20,16 32,24 20,32" fill="rgba(0,153,255,0.8)" />
          </svg>
          <div
            style={{
              fontSize: "11px",
              color: "#333333",
              letterSpacing: "0.12em",
              textTransform: "uppercase",
            }}
          >
            {title}
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
      )}
    </motion.div>
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
  const isHovered = (id: string) => hoveredSegment === id;
  const isDimmed = (id: string) =>
    hoveredSegment !== null && hoveredSegment !== id;

  useEffect(() => {
    const pick = () => {
      const w = window.innerWidth;
      setPieScale(w < 768 ? 0.55 : w < 1024 ? 0.8 : 1);
    };
    pick();
    window.addEventListener("resize", pick);
    return () => window.removeEventListener("resize", pick);
  }, []);

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
      <DottedGlowBackground
        className="pointer-events-none absolute inset-0 z-0 mask-radial-to-80-top-right"
        opacity={0.65}
        gap={18}
        radius={1.2}
        colorLightVar="--color-neutral-500"
        glowColorLightVar="--color-neutral-600"
        colorDarkVar="--color-neutral-700"
        glowColorDarkVar="--color-sky-600"
        backgroundOpacity={0}
        speedMin={0.2}
        speedMax={0.7}
        speedScale={0.5}
      />

      <p className="absolute left-6 top-12 z-[5] text-[11px] uppercase tracking-[0.18em] text-[#444444] md:left-[60px]">
        02 — Specializations
      </p>

      <div
        className="relative z-[2] shrink-0"
        style={{
          width: 600,
          height: 600,
          scale: pieScale,
          transformOrigin: "center center",
        }}
      >
        <svg
          viewBox="0 0 600 600"
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
              initial={{ opacity: 0, scale: 0.85 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.7, delay: i * 0.15, ease: EASE }}
              style={{
                transformBox: "view-box",
                transformOrigin: "300px 300px",
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
            style={{ transformBox: "view-box", transformOrigin: "300px 300px" }}
          >
            <circle
              cx={CX}
              cy={CY}
              r={108}
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
            <circle
              cx={CX}
              cy={CY}
              r={100}
              fill="none"
              stroke="rgba(0,153,255,0.08)"
              strokeWidth={0.5}
              style={{
                transformBox: "view-box",
                transformOrigin: "300px 300px",
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
            <text
              x={CX}
              y={295}
              textAnchor="middle"
              fill="#ffffff"
              fontSize={16}
              fontWeight={500}
              fontFamily="Inter"
              letterSpacing={-0.5}
            >
              {centerData.title}
            </text>
            <text
              x={CX}
              y={313}
              textAnchor="middle"
              fill="#555555"
              fontSize={10}
              fontFamily="Inter"
              letterSpacing={1}
            >
              {centerData.subtitle}
            </text>
            <circle
              cx={CX}
              cy={CY}
              r={108}
              fill="transparent"
              onMouseEnter={() => setHoveredSegment(centerData.id)}
              onMouseLeave={() => setHoveredSegment(null)}
              onClick={() => setSelectedProject(centerData.primaryProject)}
              style={{ cursor: "none", pointerEvents: "all" }}
            />
          </motion.g>

          {/* Segment labels. Hits pass through to the segment beneath. */}
          {segments.map((segment, i) => {
            const p = polar(LABEL_R, midAngle(segment));
            return (
              <motion.foreignObject
                key={segment.id}
                x={p.x - 55}
                y={p.y - 40}
                width={110}
                height={80}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{
                  duration: 0.5,
                  delay: 0.7 + i * 0.15,
                  ease: EASE,
                }}
                style={{ pointerEvents: "none" }}
              >
                <div
                  style={{
                    width: "100%",
                    height: "100%",
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    justifyContent: "center",
                    textAlign: "center",
                    fontFamily: "Inter",
                    opacity: isDimmed(segment.id) ? 0.4 : 1,
                    transition: "opacity 0.3s ease",
                  }}
                >
                  <div
                    style={{
                      fontSize: "13px",
                      fontWeight: 500,
                      color: isHovered(segment.id) ? "#ffffff" : "#cccccc",
                      textShadow: isHovered(segment.id)
                        ? "0 0 16px rgba(0,153,255,0.5)"
                        : "none",
                      letterSpacing: "-0.3px",
                      transition: "color 0.3s ease, text-shadow 0.3s ease",
                    }}
                  >
                    {segment.title}
                  </div>
                  <div
                    style={{
                      fontSize: "10px",
                      color: isHovered(segment.id)
                        ? "#0099ff"
                        : "rgba(0,153,255,0.6)",
                      letterSpacing: "0.05em",
                      marginTop: "3px",
                      transition: "color 0.3s ease",
                    }}
                  >
                    {segment.tools}
                  </div>
                  <div
                    style={{
                      fontSize: "9px",
                      color: isHovered(segment.id) ? "#888888" : "#444444",
                      letterSpacing: "0.08em",
                      transition: "color 0.3s ease",
                      textTransform: "uppercase",
                      marginTop: "2px",
                      maxWidth: "90px",
                    }}
                  >
                    {segment.description}
                  </div>
                </div>
              </motion.foreignObject>
            );
          })}
        </svg>

        {/* Video cards, one per hovered slice, in the same 600x600 space */}
        <div className="pointer-events-none absolute inset-0 z-20">
          {segments.map((segment) => {
            const at = polar(POPUP_R, midAngle(segment));
            return (
              <AnimatePresence key={segment.id}>
                {hoveredSegment === segment.id && (
                  <div
                    className="absolute"
                    style={{
                      left: at.x,
                      top: at.y,
                      transform: "translate(-50%, -50%)",
                    }}
                  >
                    <VideoPopup
                      title={segment.title}
                      videoSrc={segment.videoSrc}
                    />
                  </div>
                )}
              </AnimatePresence>
            );
          })}
          <AnimatePresence>
            {hoveredSegment === centerData.id && (
              <div
                className="absolute"
                style={{
                  left: "50%",
                  top: "calc(50% - 140px)",
                  transform: "translateX(-50%)",
                }}
              >
                <VideoPopup
                  title={centerData.title}
                  videoSrc={centerData.videoSrc}
                />
              </div>
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* Full screen project overlay. Kept outside the scaled pie wrapper: a
          transformed ancestor would become the containing block for the fixed
          positioning and trap the overlay inside the pie. */}
      <AnimatePresence>
        {selectedProject && (
          <motion.div
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
              display: "grid",
              gridTemplateColumns: "55% 45%",
            }}
          >
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 20 }}
              transition={{ duration: 0.4, ease: EASE }}
              onClick={(e) => e.stopPropagation()}
              style={{ display: "contents" }}
            >
              {/* Left: preview */}
              <div
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
                style={{
                  padding: "56px 52px",
                  display: "flex",
                  flexDirection: "column",
                  justifyContent: "center",
                  overflowY: "auto",
                  position: "relative",
                }}
              >
                <button
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
                  style={{
                    display: "flex",
                    flexWrap: "wrap",
                    gap: "6px",
                    marginBottom: "32px",
                  }}
                >
                  {selectedProject.tech.map((t) => (
                    <span
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
