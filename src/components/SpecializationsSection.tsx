"use client";

import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { DottedGlowBackground } from "@/components/ui/dotted-glow-background";
import { playSFX } from "@/lib/sfx";

const EASE = [0.16, 1, 0.3, 1] as const;

/**
 * Outer triangle points up. The inner one is the same triangle rotated 180
 * degrees about the shared centroid and scaled, which is what makes the two
 * concentric and leaves three even gaps.
 *
 * The brief's inner coordinates were neither concentric (their centroid landed
 * at y=268 against the outer's y=367) nor at the stated 0.42 scale, so they are
 * derived here instead.
 */
const OUTER: [number, number][] = [
  [350, 60],
  [80, 520],
  [620, 520],
];

const CENTROID = {
  x: (OUTER[0][0] + OUTER[1][0] + OUTER[2][0]) / 3,
  y: (OUTER[0][1] + OUTER[1][1] + OUTER[2][1]) / 3,
};

const INNER_SCALE = 0.42;

/** Rotate 180 degrees about the centroid, then scale toward it. */
const INNER: [number, number][] = OUTER.map(([x, y]) => [
  CENTROID.x + INNER_SCALE * (2 * CENTROID.x - x - CENTROID.x),
  CENTROID.y + INNER_SCALE * (2 * CENTROID.y - y - CENTROID.y),
]);

const [O_TOP, O_LEFT, O_RIGHT] = OUTER;
const [I_BOTTOM, I_RIGHT, I_LEFT] = INNER;

type ZoneId = "lerobot" | "ros2" | "moveit2";

const ZONES: {
  id: ZoneId;
  label: string;
  sublabel: string;
  polygon: [number, number][];
  projects: string[];
}[] = [
  {
    id: "lerobot",
    label: "LeRobot",
    sublabel: "Imitation Learning",
    polygon: [O_TOP, I_LEFT, I_RIGHT],
    projects: ["OpenBot Giraffe", "5-DOF Manipulation Stack"],
  },
  {
    id: "ros2",
    label: "ROS2",
    sublabel: "Robot Operating System",
    polygon: [O_LEFT, I_BOTTOM, I_LEFT],
    projects: ["MuJoCo-Gazebo RL Transfer", "RRT Maze Solver"],
  },
  {
    id: "moveit2",
    label: "MoveIt2",
    sublabel: "Motion Planning",
    polygon: [O_RIGHT, I_RIGHT, I_BOTTOM],
    projects: ["5-DOF Manipulation Stack", "OpenBot Giraffe"],
  },
];

/** Every drawn edge, with the zones that light it. */
const EDGES: {
  key: string;
  from: [number, number];
  to: [number, number];
  lit: ZoneId[];
  kind: "outer" | "inner" | "connector";
  delay: number;
}[] = [
  {
    key: "o-left",
    from: O_TOP,
    to: O_LEFT,
    lit: ["lerobot", "ros2"],
    kind: "outer",
    delay: 0,
  },
  {
    key: "o-right",
    from: O_TOP,
    to: O_RIGHT,
    lit: ["lerobot", "moveit2"],
    kind: "outer",
    delay: 0.15,
  },
  {
    key: "o-base",
    from: O_LEFT,
    to: O_RIGHT,
    lit: ["ros2", "moveit2"],
    kind: "outer",
    delay: 0.3,
  },
  {
    key: "i-top",
    from: I_LEFT,
    to: I_RIGHT,
    lit: ["lerobot"],
    kind: "inner",
    delay: 0.5,
  },
  {
    key: "i-left",
    from: I_LEFT,
    to: I_BOTTOM,
    lit: ["ros2"],
    kind: "inner",
    delay: 0.65,
  },
  {
    key: "i-right",
    from: I_RIGHT,
    to: I_BOTTOM,
    lit: ["moveit2"],
    kind: "inner",
    delay: 0.8,
  },
  {
    key: "c-top",
    from: O_TOP,
    to: I_BOTTOM,
    lit: [],
    kind: "connector",
    delay: 1.0,
  },
  {
    key: "c-left",
    from: O_LEFT,
    to: I_LEFT,
    lit: ["ros2"],
    kind: "connector",
    delay: 1.1,
  },
  {
    key: "c-right",
    from: O_RIGHT,
    to: I_RIGHT,
    lit: ["moveit2"],
    kind: "connector",
    delay: 1.2,
  },
];

const EDGE_REST = {
  outer: { stroke: "rgba(0,153,255,0.3)", width: 1 },
  inner: { stroke: "rgba(0,153,255,0.2)", width: 0.8 },
  connector: { stroke: "rgba(0,153,255,0.12)", width: 0.5 },
};

const EDGE_LIT = {
  outer: { stroke: "rgba(0,153,255,0.9)", width: 1.5 },
  inner: { stroke: "rgba(0,153,255,0.7)", width: 1.2 },
  connector: { stroke: "rgba(0,153,255,0.5)", width: 0.8 },
};

const SVG_KEYFRAMES = `
  @keyframes svg-rotate {
    from { transform-origin: ${CENTROID.x}px ${CENTROID.y}px; transform: rotate(0deg); }
    to { transform-origin: ${CENTROID.x}px ${CENTROID.y}px; transform: rotate(360deg); }
  }
  @keyframes svg-rotate-reverse {
    from { transform-origin: ${CENTROID.x}px ${CENTROID.y}px; transform: rotate(0deg); }
    to { transform-origin: ${CENTROID.x}px ${CENTROID.y}px; transform: rotate(-360deg); }
  }
  @keyframes core-pulse-svg {
    0%, 100% { opacity: 0.9; }
    50% { opacity: 1; }
  }
  @keyframes ambient-pulse-svg {
    0%, 100% { opacity: 0.5; }
    50% { opacity: 1; }
  }
`;

const allProjects = [
  {
    title: "OpenBot Giraffe",
    status: "Open Source",
    tagline: "Affordable 5-DOF robotic arm for hobbyists and researchers",
    description:
      "Designed an affordable 5-DOF robotic manipulator with a 3D-printed frame and ST3215 servos. Integrated with LeRobot, ROS2 and MoveIt for trajectory planning, teleoperation and imitation learning in both simulated and real-world applications.",
    tech: ["ROS2", "LeRobot", "MoveIt2", "Python", "Fusion 360", "Isaac Sim"],
    github: "https://github.com/anantppandey/openbot-giraffe",
    initials: "OG",
  },
  {
    title: "5-DOF Manipulation Stack",
    status: "Robotics",
    tagline: "Custom IK solver with collision-aware grasp planning",
    description:
      "Engineered a custom 5-DOF IK solver and octomap-based obstacle avoidance in Gazebo, planning collision-aware grasps with MoveIt Task Constructor. Built a ROS2 action-server pipeline with multi-object perception and automatic grasp-failure retry.",
    tech: ["ROS2", "MoveIt2", "Gazebo", "Python", "MoveIt Task Constructor"],
    github: "https://github.com/anantppandey/manipulation-stack",
    initials: "5D",
  },
  {
    title: "MuJoCo-Gazebo RL Transfer",
    status: "Research",
    tagline: "PPO reach policy trained in MuJoCo and transferred to Gazebo",
    description:
      "Trained a PPO reach policy from scratch in MuJoCo using Stable-Baselines3, raising success rate from 37% to 78% through seed-controlled ablation. Built a ROS2 and Gazebo pipeline with retry-based trajectory generation and closed-loop control.",
    tech: ["MuJoCo", "Stable-Baselines3", "ROS2", "Gazebo", "Python", "PPO"],
    github: "https://github.com/anantppandey/mujoco-gazebo-transfer",
    initials: "MG",
  },
  {
    title: "RRT Maze Solver",
    status: "Algorithm",
    tagline: "Rapidly-exploring Random Tree path planning in dynamic mazes",
    description:
      "Python-based maze solver using the RRT algorithm to navigate complex dynamic environments. Built an interactive maze editor for creating custom obstacle layouts and start and goal points.",
    tech: ["Python", "RRT Algorithm", "NumPy", "Matplotlib"],
    github: "https://github.com/anantppandey/rrt-maze-solver",
    initials: "RM",
  },
];

type Project = (typeof allProjects)[number];

function ProjectPill({
  title,
  index,
  onOpen,
}: {
  title: string;
  index: number;
  onOpen: () => void;
}) {
  const [hovered, setHovered] = useState(false);

  return (
    <motion.button
      type="button"
      initial={{ opacity: 0, y: 6, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: 6, scale: 0.95 }}
      transition={{ duration: 0.25, ease: EASE, delay: index * 0.05 }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      onClick={onOpen}
      style={{
        display: "inline-flex",
        alignItems: "center",
        gap: "6px",
        background: hovered ? "rgba(0,153,255,0.18)" : "rgba(0,153,255,0.08)",
        border: `0.5px solid ${hovered ? "rgba(0,153,255,0.7)" : "rgba(0,153,255,0.35)"}`,
        borderRadius: "100px",
        padding: "6px 14px",
        fontSize: "12px",
        color: "#ffffff",
        cursor: "none",
        whiteSpace: "nowrap",
        boxShadow: hovered ? "0 0 10px rgba(0,153,255,0.2)" : "none",
        transform: hovered ? "translateY(-1px)" : "translateY(0)",
        transition:
          "background 0.2s, border-color 0.2s, box-shadow 0.2s, transform 0.2s",
      }}
    >
      {title}
    </motion.button>
  );
}

function ProjectDetailOverlay({
  project,
  onClose,
}: {
  project: Project;
  onClose: () => void;
}) {
  const [closeHovered, setCloseHovered] = useState(false);
  const [linkHovered, setLinkHovered] = useState(false);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.3 }}
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-label={project.title}
      style={{
        position: "fixed",
        inset: 0,
        zIndex: 200,
        background: "rgba(9,9,9,0.95)",
        backdropFilter: "blur(20px)",
        display: "flex",
        alignItems: "stretch",
      }}
    >
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: 20 }}
        transition={{ duration: 0.4, ease: EASE }}
        onClick={(e) => e.stopPropagation()}
        style={{
          display: "grid",
          gridTemplateColumns: "55% 45%",
          width: "100%",
          height: "100%",
        }}
      >
        <div style={{ position: "relative", background: "#0a0a0a" }}>
          <div
            style={{
              width: "100%",
              height: "100%",
              background: "#141414",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              flexDirection: "column",
              gap: "12px",
            }}
          >
            <div
              style={{
                fontSize: "64px",
                fontWeight: 500,
                color: "#1e1e1e",
                letterSpacing: "-3px",
              }}
            >
              {project.initials}
            </div>
            <div
              style={{
                fontSize: "11px",
                color: "#222",
                letterSpacing: "0.2em",
                textTransform: "uppercase",
              }}
            >
              Preview soon
            </div>
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

        <div
          style={{
            padding: "56px 52px",
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            overflowY: "auto",
          }}
        >
          <button
            type="button"
            onClick={onClose}
            onMouseEnter={() => setCloseHovered(true)}
            onMouseLeave={() => setCloseHovered(false)}
            aria-label="Close project details"
            style={{
              position: "absolute",
              top: "32px",
              right: "32px",
              width: "40px",
              height: "40px",
              borderRadius: "50%",
              background: "#141414",
              border: `0.5px solid ${closeHovered ? "#0099ff" : "#262626"}`,
              color: closeHovered ? "#ffffff" : "#999999",
              fontSize: "18px",
              cursor: "none",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              transition: "border-color 0.2s, color 0.2s",
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
            {project.status}
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
            {project.title}
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
            {project.description}
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
            {project.tech.map((t) => (
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
            href={project.github}
            target="_blank"
            rel="noopener noreferrer"
            onMouseEnter={() => setLinkHovered(true)}
            onMouseLeave={() => setLinkHovered(false)}
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: "8px",
              background: "#141414",
              border: `0.5px solid ${linkHovered ? "#0099ff" : "#262626"}`,
              borderRadius: "100px",
              padding: "10px 20px",
              fontSize: "12px",
              color: linkHovered ? "#ffffff" : "#cccccc",
              textDecoration: "none",
              width: "fit-content",
              cursor: "none",
              transition: "border-color 0.2s, color 0.2s",
            }}
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
              <path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 9 18.13V22" />
            </svg>
            View on GitHub
          </a>
        </div>
      </motion.div>
    </motion.div>
  );
}

export default function SpecializationsSection() {
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const [hoveredZone, setHoveredZone] = useState<ZoneId | null>(null);

  const openProject = (title: string) => {
    const project = allProjects.find((p) => p.title === title);
    if (!project) return;
    playSFX("select");
    playSFX("expand");
    setSelectedProject(project);
  };

  const closeProject = () => {
    playSFX("close");
    setSelectedProject(null);
  };

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

  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setSelectedProject(null);
    };
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, []);

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

      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 z-[1] h-full w-full"
        style={{
          background:
            "radial-gradient(ellipse at center, transparent 25%, rgba(9,9,9,0.5) 55%, rgba(9,9,9,0.97) 100%)",
        }}
      />

      <p className="absolute left-6 top-12 z-[5] text-[11px] uppercase tracking-[0.18em] text-[#444444] md:left-[60px]">
        02 &mdash; Specializations
      </p>

      <div
        className="relative z-[2] hidden h-[620px] w-[700px] shrink-0 md:block"
        style={{ transform: "scale(0.8)", transformOrigin: "center center" }}
      >
        <svg
          viewBox="0 0 700 620"
          className="absolute inset-0 h-full w-full"
          style={{ zIndex: 1 }}
        >
          <style>{SVG_KEYFRAMES}</style>
          <defs>
            <filter id="glow-soft" x="-20%" y="-20%" width="140%" height="140%">
              <feGaussianBlur stdDeviation="3" result="blur" />
              <feMerge>
                <feMergeNode in="blur" />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>
            <filter
              id="glow-bright"
              x="-30%"
              y="-30%"
              width="160%"
              height="160%"
            >
              <feGaussianBlur stdDeviation="6" result="blur" />
              <feMerge>
                <feMergeNode in="blur" />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>
            <filter
              id="glow-intense"
              x="-40%"
              y="-40%"
              width="180%"
              height="180%"
            >
              <feGaussianBlur stdDeviation="10" result="blur" />
              <feMerge>
                <feMergeNode in="blur" />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>
            <radialGradient id="ambient-fill">
              <stop offset="0%" stopColor="rgba(0,153,255,0.1)" />
              <stop offset="100%" stopColor="rgba(0,153,255,0)" />
            </radialGradient>
            <radialGradient id="core-fill">
              <stop offset="0%" stopColor="#001833" />
              <stop offset="100%" stopColor="#000510" />
            </radialGradient>
          </defs>

          {/* Jarvis core at the shared centroid */}
          <g aria-hidden="true" style={{ pointerEvents: "none" }}>
            <circle
              cx={CENTROID.x}
              cy={CENTROID.y}
              r={100}
              fill="url(#ambient-fill)"
              filter="url(#glow-intense)"
              style={{ animation: "ambient-pulse-svg 3s ease-in-out infinite" }}
            />
            <circle
              cx={CENTROID.x}
              cy={CENTROID.y}
              r={80}
              fill="none"
              stroke="rgba(0,153,255,0.15)"
              strokeWidth={0.5}
              style={{ animation: "svg-rotate 20s linear infinite" }}
            />
            <circle
              cx={CENTROID.x}
              cy={CENTROID.y}
              r={58}
              fill="none"
              stroke="rgba(0,153,255,0.2)"
              strokeWidth={1}
              strokeDasharray="4 8"
              style={{ animation: "svg-rotate-reverse 12s linear infinite" }}
            />
            <circle
              cx={CENTROID.x}
              cy={CENTROID.y}
              r={40}
              fill="url(#core-fill)"
              stroke="rgba(0,153,255,0.5)"
              strokeWidth={1}
              filter="url(#glow-bright)"
              style={{ animation: "core-pulse-svg 2.5s ease-in-out infinite" }}
            />
            <circle
              cx={CENTROID.x}
              cy={CENTROID.y}
              r={4}
              fill="#0099ff"
              filter="url(#glow-intense)"
            />
            <text
              x={CENTROID.x}
              y={CENTROID.y + 5}
              textAnchor="middle"
              dominantBaseline="middle"
              fill="rgba(255,255,255,0.9)"
              fontSize={12}
              fontWeight={500}
              fontFamily="Inter"
            >
              AP
            </text>
          </g>

          {/* Edges */}
          {EDGES.map((edge) => {
            const lit = hoveredZone !== null && edge.lit.includes(hoveredZone);
            const rest = EDGE_REST[edge.kind];
            const bright = EDGE_LIT[edge.kind];
            return (
              <motion.line
                key={edge.key}
                x1={edge.from[0]}
                y1={edge.from[1]}
                x2={edge.to[0]}
                y2={edge.to[1]}
                fill="none"
                initial={{ pathLength: 0 }}
                whileInView={{ pathLength: 1 }}
                viewport={{ once: false }}
                animate={{
                  stroke: lit ? bright.stroke : rest.stroke,
                  strokeWidth: lit ? bright.width : rest.width,
                }}
                transition={{
                  pathLength: {
                    duration: 1.4,
                    delay: edge.delay,
                    ease: "easeOut",
                  },
                  stroke: { duration: 0.3, ease: "easeOut" },
                  strokeWidth: { duration: 0.3, ease: "easeOut" },
                }}
                filter={`url(#${lit ? "glow-bright" : "glow-soft"})`}
                style={{ pointerEvents: "none" }}
              />
            );
          })}

          {/* Invisible hit areas, one per gap */}
          {ZONES.map((zone) => (
            <polygon
              key={zone.id}
              points={zone.polygon.map((pt) => pt.join(",")).join(" ")}
              fill="transparent"
              stroke="none"
              style={{ cursor: "none", pointerEvents: "all" }}
              onMouseEnter={() => setHoveredZone(zone.id)}
              onMouseLeave={() => setHoveredZone(null)}
            />
          ))}
        </svg>

        {/* Labels sit over the SVG, one per gap */}
        {ZONES.map((zone) => {
          const active = hoveredZone === zone.id;
          const isTop = zone.id === "lerobot";
          const placement =
            zone.id === "lerobot"
              ? { top: 80, left: "50%", transform: "translateX(-50%)" }
              : zone.id === "ros2"
                ? { bottom: 130, left: 60 }
                : { bottom: 130, right: 60 };

          return (
            <div
              key={zone.id}
              className="pointer-events-none absolute z-[3] text-center"
              style={placement}
            >
              {!isTop && (
                <AnimatePresence>
                  {active && (
                    <div className="mb-[10px] flex flex-col items-start gap-[5px]">
                      {zone.projects.map((title, i) => (
                        <ProjectPill
                          key={title}
                          title={title}
                          index={i}
                          onOpen={() => openProject(title)}
                        />
                      ))}
                    </div>
                  )}
                </AnimatePresence>
              )}

              <span
                className="block whitespace-nowrap text-[18px] font-medium"
                style={{
                  color: active ? "#ffffff" : "#555555",
                  letterSpacing: "-0.5px",
                  textShadow: active ? "0 0 20px rgba(0,153,255,0.6)" : "none",
                  transition: "color 0.3s, text-shadow 0.3s",
                }}
              >
                {zone.label}
              </span>
              <span
                className="mt-[3px] block whitespace-nowrap text-[10px] uppercase"
                style={{
                  color: active ? "#666666" : "#333333",
                  letterSpacing: "0.12em",
                  transition: "color 0.3s",
                }}
              >
                {zone.sublabel}
              </span>

              {isTop && (
                <AnimatePresence>
                  {active && (
                    <div className="mt-[10px] flex flex-col items-center gap-[5px]">
                      {zone.projects.map((title, i) => (
                        <ProjectPill
                          key={title}
                          title={title}
                          index={i}
                          onOpen={() => openProject(title)}
                        />
                      ))}
                    </div>
                  )}
                </AnimatePresence>
              )}
            </div>
          );
        })}
      </div>

      {/* Below md the triangle is replaced by stacked cards. */}
      <div className="relative z-[2] flex w-full flex-col gap-3 px-6 md:hidden">
        {ZONES.map((zone) => (
          <div
            key={zone.id}
            style={{
              background: "#141414",
              border: "0.5px solid #1e1e1e",
              borderRadius: "14px",
              padding: "24px",
            }}
          >
            <span className="block text-[18px] font-medium tracking-[-0.5px] text-ink">
              {zone.label}
            </span>
            <span className="mt-[2px] block text-[10px] uppercase tracking-[0.12em] text-[#444444]">
              {zone.sublabel}
            </span>
            <div className="mt-4 flex flex-wrap gap-[6px]">
              {zone.projects.map((title, i) => (
                <ProjectPill
                  key={title}
                  title={title}
                  index={i}
                  onOpen={() => openProject(title)}
                />
              ))}
            </div>
          </div>
        ))}
      </div>

      <AnimatePresence>
        {selectedProject && (
          <ProjectDetailOverlay
            key={selectedProject.title}
            project={selectedProject}
            onClose={closeProject}
          />
        )}
      </AnimatePresence>
    </section>
  );
}
