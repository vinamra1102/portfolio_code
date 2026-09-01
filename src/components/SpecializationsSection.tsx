"use client";

import { Fragment, useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { DottedGlowBackground } from "@/components/ui/dotted-glow-background";
import { playSFX } from "@/lib/sfx";

const EASE = [0.16, 1, 0.3, 1] as const;

const specializationProjects = {
  lerobot: [
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
        "Engineered a custom 5-DOF IK solver and octomap-based obstacle avoidance in Gazebo, planning collision-aware grasps with MoveIt Task Constructor. Built a ROS2 action-server pipeline with multi-object perception and automatic grasp-failure retry for autonomous pick-and-place.",
      tech: ["ROS2", "MoveIt2", "Gazebo", "Python", "MoveIt Task Constructor"],
      github: "https://github.com/anantppandey/manipulation-stack",
      initials: "5D",
    },
  ],
  ros2: [
    {
      title: "MuJoCo-Gazebo RL Transfer",
      status: "Research",
      tagline: "PPO reach policy trained in MuJoCo and transferred to Gazebo",
      description:
        "Trained a PPO reach policy from scratch in MuJoCo using Stable-Baselines3, raising success rate from 37% to 78% through seed-controlled ablation. Built a ROS2 and Gazebo pipeline transferring the policy across simulators with retry-based trajectory generation and closed-loop control.",
      tech: ["MuJoCo", "Stable-Baselines3", "ROS2", "Gazebo", "Python", "PPO"],
      github: "https://github.com/anantppandey/mujoco-gazebo-transfer",
      initials: "MG",
    },
    {
      title: "RRT Maze Solver",
      status: "Algorithm",
      tagline: "Rapidly-exploring Random Tree path planning in dynamic mazes",
      description:
        "Python-based maze solver using the RRT algorithm to navigate complex dynamic environments. Built an interactive maze editor for creating custom obstacle layouts and start and goal points with high computational efficiency.",
      tech: ["Python", "RRT Algorithm", "NumPy", "Matplotlib"],
      github: "https://github.com/anantppandey/rrt-maze-solver",
      initials: "RM",
    },
  ],
  moveit2: [
    {
      title: "5-DOF Manipulation Stack",
      status: "Robotics",
      tagline: "Custom IK solver with collision-aware grasp planning",
      description:
        "Engineered a custom 5-DOF IK solver and octomap-based obstacle avoidance in Gazebo, planning collision-aware grasps with MoveIt Task Constructor. Built a ROS2 action-server pipeline with multi-object perception and automatic grasp-failure retry for autonomous pick-and-place.",
      tech: ["ROS2", "MoveIt2", "Gazebo", "Python", "MoveIt Task Constructor"],
      github: "https://github.com/anantppandey/manipulation-stack",
      initials: "5D",
    },
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
  ],
};

type SpecKey = keyof typeof specializationProjects;

const specializationMeta: Record<SpecKey, { label: string; sublabel: string }> =
  {
    lerobot: { label: "LeRobot", sublabel: "Imitation Learning Pipeline" },
    ros2: { label: "ROS2", sublabel: "Robot Operating System" },
    moveit2: { label: "MoveIt2", sublabel: "Motion Planning and Manipulation" },
  };

/**
 * `rotate` turns the arm line, which points straight down by default, toward
 * its label. CSS rotates clockwise, so a down vector becomes
 * (-sin, cos) and the angle is atan2(-x, y) of the label offset.
 */
const SPECIALIZATIONS = [
  {
    key: "lerobot" as SpecKey,
    label: "LeRobot",
    sublabel: "Imitation Learning Pipeline",
    x: 0,
    y: -325,
    rotate: 180,
    armLength: 235,
    delay: 0,
  },
  {
    key: "ros2" as SpecKey,
    label: "ROS2",
    sublabel: "Robot Operating System",
    x: -350,
    y: 310,
    rotate: 52.35,
    armLength: 387,
    delay: 0.2,
  },
  {
    key: "moveit2" as SpecKey,
    label: "MoveIt2",
    sublabel: "Motion Planning and Manipulation",
    x: 350,
    y: 310,
    rotate: -52.35,
    armLength: 387,
    delay: 0.4,
  },
] as const;

const JARVIS_KEYFRAMES = `
  @keyframes spin-slow {
    from { transform: translate(-50%, -50%) rotate(0deg); }
    to { transform: translate(-50%, -50%) rotate(360deg); }
  }
  @keyframes spin-reverse {
    from { transform: translate(-50%, -50%) rotate(0deg); }
    to { transform: translate(-50%, -50%) rotate(-360deg); }
  }
  @keyframes core-pulse {
    0%, 100% { box-shadow: 0 0 30px rgba(0,153,255,0.4), 0 0 60px rgba(0,153,255,0.15), inset 0 0 20px rgba(0,153,255,0.15); }
    50% { box-shadow: 0 0 40px rgba(0,153,255,0.7), 0 0 80px rgba(0,153,255,0.25), inset 0 0 30px rgba(0,153,255,0.25); }
  }
  @keyframes ambient-pulse {
    0%, 100% { opacity: 0.6; transform: scale(1); }
    50% { opacity: 1; transform: scale(1.15); }
  }
`;

/**
 * Layered glowing core: ambient bloom, two counter-rotating rings, a lit inner
 * ring, a hot centre dot and the monogram. All motion is CSS keyframes, so
 * Framer Motion is left to the arm entrances and the overlay only.
 */
/**
 * Triangle corners, measured from the compass centre. Each sits where its arm
 * line terminates, just inside the matching label.
 *
 * These are deliberately well clear of the core: at the previous size the
 * bottom edge ran at y=128 while the core's box reaches y=130, so that edge
 * was buried in the glow and read as missing. It now clears it by 140px.
 */
const TIPS: Record<SpecKey, { x: number; y: number }> = {
  lerobot: { x: 0, y: -290 },
  ros2: { x: -350, y: 270 },
  moveit2: { x: 350, y: 270 },
};

/** The three title-to-title edges, each lit by the two vertices it joins. */
const TITLE_EDGES: {
  key: string;
  from: SpecKey;
  to: SpecKey;
  delay: number;
}[] = [
  { key: "a", from: "lerobot", to: "ros2", delay: 0.9 },
  { key: "b", from: "lerobot", to: "moveit2", delay: 1.0 },
  { key: "c", from: "ros2", to: "moveit2", delay: 1.1 },
];

const VERTEX_PULSE_DELAY: Record<SpecKey, string> = {
  lerobot: "0s",
  ros2: "0.6s",
  moveit2: "1.2s",
};

const TITLE_EDGE_KEYFRAMES = `
  @keyframes vertex-pulse {
    0%, 100% { opacity: 0.3; }
    50% { opacity: 0.8; }
  }
`;

/** Closes the triangle between the three arm tips. */
function TitleEdges({ hoveredSpec }: { hoveredSpec: SpecKey | null }) {
  return (
    <svg
      aria-hidden="true"
      viewBox="-500 -350 1000 700"
      className="pointer-events-none absolute left-1/2 top-1/2"
      style={{
        width: 1000,
        height: 700,
        marginLeft: -500,
        marginTop: -350,
        overflow: "visible",
      }}
    >
      <style>{TITLE_EDGE_KEYFRAMES}</style>
      <defs>
        <filter id="glow-soft" x="-20%" y="-20%" width="140%" height="140%">
          <feGaussianBlur stdDeviation="3" result="blur" />
          <feMerge>
            <feMergeNode in="blur" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
        <filter id="glow-bright" x="-30%" y="-30%" width="160%" height="160%">
          <feGaussianBlur stdDeviation="6" result="blur" />
          <feMerge>
            <feMergeNode in="blur" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
      </defs>

      {TITLE_EDGES.map((edge) => {
        const a = TIPS[edge.from];
        const b = TIPS[edge.to];
        const adjacent = hoveredSpec === edge.from || hoveredSpec === edge.to;
        const lit = hoveredSpec !== null && adjacent;
        const dimmed = hoveredSpec !== null && !adjacent;
        return (
          <motion.line
            key={edge.key}
            x1={a.x}
            y1={a.y}
            x2={b.x}
            y2={b.y}
            fill="none"
            initial={{ pathLength: 0, opacity: 0 }}
            whileInView={{ pathLength: 1, opacity: 1 }}
            viewport={{ once: false }}
            transition={{
              pathLength: {
                duration: 1.2,
                delay: edge.delay,
                ease: "easeOut",
              },
              opacity: { duration: 0.3, delay: edge.delay },
            }}
            stroke={
              lit
                ? "rgba(0,153,255,0.75)"
                : dimmed
                  ? "rgba(0,153,255,0.08)"
                  : "rgba(0,153,255,0.18)"
            }
            strokeWidth={lit ? 1.2 : dimmed ? 0.4 : 0.6}
            filter={`url(#${lit ? "glow-bright" : "glow-soft"})`}
            style={{ transition: "stroke 0.3s ease, stroke-width 0.3s ease" }}
          />
        );
      })}

      {(Object.keys(TIPS) as SpecKey[]).map((key) => {
        const tip = TIPS[key];
        const active = hoveredSpec === key;
        return (
          <circle
            key={key}
            cx={tip.x}
            cy={tip.y}
            r={active ? 4 : 3}
            fill={active ? "#0099ff" : "rgba(0,153,255,0.4)"}
            filter={`url(#${active ? "glow-bright" : "glow-soft"})`}
            style={{
              animation: active
                ? undefined
                : `vertex-pulse 2s ease-in-out ${VERTEX_PULSE_DELAY[key]} infinite`,
              transition: "r 0.3s, fill 0.3s",
            }}
          />
        );
      })}
    </svg>
  );
}

function JarvisCore() {
  return (
    <div
      aria-hidden="true"
      className="pointer-events-none relative h-[260px] w-[260px]"
    >
      <style>{JARVIS_KEYFRAMES}</style>

      {/* Layer 1: ambient bloom */}
      <div
        style={{
          position: "absolute",
          width: "260px",
          height: "260px",
          borderRadius: "50%",
          background:
            "radial-gradient(circle, rgba(0,153,255,0.12) 0%, rgba(0,153,255,0.04) 40%, transparent 70%)",
          filter: "blur(8px)",
          animation: "ambient-pulse 3s ease-in-out infinite",
        }}
      />

      {/* Layer 2: outer ring */}
      <div
        style={{
          position: "absolute",
          width: "210px",
          height: "210px",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          borderRadius: "50%",
          border: "0.5px solid rgba(0,153,255,0.15)",
          background: "transparent",
          boxShadow:
            "0 0 20px rgba(0,153,255,0.08), inset 0 0 20px rgba(0,153,255,0.04)",
          animation: "spin-slow 20s linear infinite",
        }}
      />

      {/* Layer 3: dashed mid ring, counter-rotating */}
      <div
        style={{
          position: "absolute",
          width: "158px",
          height: "158px",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          borderRadius: "50%",
          border: "1px dashed rgba(0,153,255,0.2)",
          boxShadow: "0 0 16px rgba(0,153,255,0.1)",
          animation: "spin-reverse 12s linear infinite",
        }}
      />

      {/* Layer 4: lit inner ring. The arms meet this edge, radius 55px. */}
      <div
        style={{
          position: "absolute",
          width: "110px",
          height: "110px",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          borderRadius: "50%",
          border: "1px solid rgba(0,153,255,0.5)",
          background:
            "radial-gradient(circle, rgba(0,20,60,0.9) 0%, rgba(0,10,30,0.95) 60%, rgba(0,5,20,1) 100%)",
          boxShadow:
            "0 0 40px rgba(0,153,255,0.5), 0 0 80px rgba(0,153,255,0.2), 0 0 120px rgba(0,153,255,0.08), inset 0 0 30px rgba(0,153,255,0.2)",
          animation: "core-pulse 2.5s ease-in-out infinite",
        }}
      />

      {/* Layer 5: core dot */}
      <div
        style={{
          position: "absolute",
          width: "10px",
          height: "10px",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          borderRadius: "50%",
          background: "#0099ff",
          boxShadow:
            "0 0 10px rgba(0,153,255,1), 0 0 20px rgba(0,153,255,0.8), 0 0 40px rgba(0,153,255,0.4)",
          animation: "core-pulse 2.5s ease-in-out infinite",
        }}
      />

      {/* Layer 6: monogram */}
      <span
        style={{
          position: "absolute",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          fontSize: "15px",
          fontWeight: 500,
          color: "rgba(255,255,255,0.9)",
          letterSpacing: "-0.3px",
          zIndex: 2,
          textShadow: "0 0 10px rgba(0,153,255,0.8)",
        }}
      >
        AP
      </span>
    </div>
  );
}

function ArmLabel({
  spec,
  size,
  hovered,
}: {
  spec: (typeof SPECIALIZATIONS)[number];
  size: "sm" | "lg";
  hovered: boolean;
}) {
  return (
    <>
      <motion.div whileHover={{ scale: 1.03 }} transition={{ duration: 0.2 }}>
        <span
          className={`mt-3 block whitespace-nowrap font-medium tracking-[-0.8px] text-ink ${
            size === "lg" ? "text-[20px]" : "text-[18px]"
          }`}
        >
          {spec.label}
        </span>
      </motion.div>
      <span className="mt-1 block whitespace-nowrap text-[11px] uppercase tracking-[0.12em] text-[#555555]">
        {spec.sublabel}
      </span>
      <span
        aria-hidden="true"
        style={{
          display: "block",
          fontSize: "10px",
          color: "#333333",
          letterSpacing: "0.14em",
          textTransform: "uppercase",
          marginTop: "10px",
          opacity: hovered ? 1 : 0,
          transition: "opacity 0.2s ease",
        }}
      >
        Explore
      </span>
    </>
  );
}

/** Wraps an arm so the line, label and hint are one generous click target. */
function ArmTrigger({
  spec,
  onOpen,
  children,
}: {
  spec: (typeof SPECIALIZATIONS)[number];
  onOpen: () => void;
  children: React.ReactNode;
}) {
  return (
    <div
      role="button"
      tabIndex={0}
      aria-label={`Explore ${spec.label} projects`}
      onClick={onOpen}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          onOpen();
        }
      }}
      style={{ padding: "16px", cursor: "none", userSelect: "none" }}
    >
      {children}
    </div>
  );
}

function GitHubMark() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
      <path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 9 18.13V22" />
    </svg>
  );
}

function SpecializationProjectCard({
  project,
  index,
}: {
  project: (typeof specializationProjects)[SpecKey][number];
  index: number;
}) {
  const [hovered, setHovered] = useState(false);
  const [linkHovered, setLinkHovered] = useState(false);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.08, duration: 0.5, ease: EASE }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        background: "#141414",
        border: `0.5px solid ${hovered ? "#262626" : "#1e1e1e"}`,
        borderRadius: "14px",
        padding: "32px",
        display: "flex",
        flexDirection: "column",
        gap: "16px",
        transition: "border-color 0.2s",
      }}
    >
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "flex-start",
        }}
      >
        <span
          style={{
            background: "rgba(255,255,255,0.05)",
            border: "0.5px solid rgba(255,255,255,0.1)",
            borderRadius: "100px",
            padding: "4px 12px",
            fontSize: "11px",
            color: "#cccccc",
          }}
        >
          {project.status}
        </span>
        <span
          style={{
            width: "44px",
            height: "44px",
            flexShrink: 0,
            borderRadius: "10px",
            background: "#1c1c1c",
            border: "0.5px solid #262626",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontSize: "14px",
            fontWeight: 500,
            color: "#444444",
            letterSpacing: "-0.5px",
          }}
        >
          {project.initials}
        </span>
      </div>

      <h3
        style={{
          fontSize: "clamp(20px, 2.5vw, 28px)",
          fontWeight: 500,
          color: "#ffffff",
          letterSpacing: "-1px",
          lineHeight: 1.0,
          margin: 0,
        }}
      >
        {project.title}
      </h3>

      <p
        style={{
          fontSize: "13px",
          color: "#555555",
          lineHeight: 1.5,
          margin: 0,
        }}
      >
        {project.tagline}
      </p>

      <div
        style={{
          display: "flex",
          flexWrap: "wrap",
          gap: "6px",
          marginTop: "auto",
          paddingTop: "8px",
        }}
      >
        {project.tech.map((t) => (
          <span
            key={t}
            style={{
              background: "#1c1c1c",
              border: "0.5px solid #262626",
              borderRadius: "100px",
              padding: "4px 12px",
              fontSize: "11px",
              color: "#666666",
            }}
          >
            {t}
          </span>
        ))}
      </div>

      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          paddingTop: "16px",
          borderTop: "0.5px solid #1a1a1a",
          marginTop: "8px",
        }}
      >
        <a
          href={project.github}
          target="_blank"
          rel="noopener noreferrer"
          onMouseEnter={() => setLinkHovered(true)}
          onMouseLeave={() => setLinkHovered(false)}
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: "6px",
            fontSize: "12px",
            color: linkHovered ? "#ffffff" : "#555555",
            textDecoration: "none",
            cursor: "none",
            transition: "color 0.2s",
          }}
        >
          <GitHubMark />
          View on GitHub
        </a>
        <span aria-hidden="true" style={{ fontSize: "14px", color: "#333333" }}>
          &rarr;
        </span>
      </div>
    </motion.div>
  );
}

/**
 * Full screen list of everything filed under one specialization. Inline styles
 * cannot carry media queries, so the breakpoint is read once into state and the
 * few values that differ are switched off it.
 */
function SpecializationOverlay({
  specKey,
  onClose,
}: {
  specKey: SpecKey;
  onClose: () => void;
}) {
  const [isMobile, setIsMobile] = useState(false);
  const [closeHovered, setCloseHovered] = useState(false);

  useEffect(() => {
    const query = window.matchMedia("(max-width: 767px)");
    const sync = () => setIsMobile(query.matches);
    sync();
    query.addEventListener("change", sync);
    return () => query.removeEventListener("change", sync);
  }, []);

  const meta = specializationMeta[specKey];
  const projects = specializationProjects[specKey];
  const gutter = isMobile ? 24 : 80;

  return (
    <motion.div
      initial={{ opacity: 0, y: 40 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 20 }}
      transition={{ duration: 0.4, ease: EASE }}
      role="dialog"
      aria-modal="true"
      aria-label={meta.label}
      style={{
        position: "fixed",
        inset: 0,
        zIndex: 300,
        background: "#090909",
        display: "flex",
        flexDirection: "column",
        overflowY: "auto",
      }}
    >
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          padding: isMobile ? "32px 24px 0 24px" : "40px 80px 0 80px",
          marginBottom: "48px",
        }}
      >
        <div>
          <p
            style={{
              fontSize: "11px",
              color: "#444444",
              letterSpacing: "0.18em",
              textTransform: "uppercase",
              margin: 0,
              marginBottom: "8px",
            }}
          >
            02 &mdash; Specializations
          </p>
          <h2
            style={{
              fontSize: isMobile
                ? "clamp(36px, 8vw, 52px)"
                : "clamp(48px, 7vw, 88px)",
              fontWeight: 500,
              color: "#ffffff",
              letterSpacing: "-4px",
              lineHeight: 1.0,
              margin: 0,
            }}
          >
            {meta.label}
          </h2>
          <p
            style={{
              fontSize: "13px",
              color: "#555555",
              letterSpacing: "0.08em",
              textTransform: "uppercase",
              margin: 0,
              marginTop: "10px",
            }}
          >
            {meta.sublabel}
          </p>
        </div>

        <button
          type="button"
          onClick={onClose}
          onMouseEnter={() => setCloseHovered(true)}
          onMouseLeave={() => setCloseHovered(false)}
          aria-label="Close specialization"
          style={{
            width: "44px",
            height: "44px",
            flexShrink: 0,
            borderRadius: "50%",
            background: "#141414",
            border: `0.5px solid ${closeHovered ? "#0099ff" : "#262626"}`,
            color: closeHovered ? "#ffffff" : "#999999",
            fontSize: "20px",
            cursor: "none",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            transition: "border-color 0.2s, color 0.2s",
          }}
        >
          x
        </button>
      </div>

      <div
        aria-hidden="true"
        style={{
          width: `calc(100% - ${gutter * 2}px)`,
          margin: `0 ${gutter}px`,
          height: "0.5px",
          background: "#1a1a1a",
          marginBottom: "56px",
        }}
      />

      <div
        style={{
          display: "grid",
          gridTemplateColumns: isMobile
            ? "1fr"
            : "repeat(auto-fit, minmax(340px, 1fr))",
          gap: "16px",
          padding: isMobile ? "0 24px 48px 24px" : "0 80px 80px 80px",
        }}
      >
        {projects.map((project, i) => (
          <SpecializationProjectCard
            key={project.title}
            project={project}
            index={i}
          />
        ))}
      </div>
    </motion.div>
  );
}

/**
 * The panel that sticks to the viewport while its wrapper in page.tsx scrolls
 * past. Content is always fully opaque: no scroll driven fade or scale.
 */
export default function SpecializationsSection() {
  const [activeSpec, setActiveSpec] = useState<SpecKey | null>(null);
  const [hoveredSpec, setHoveredSpec] = useState<SpecKey | null>(null);
  // The compass is laid out in fixed pixels, so it is scaled to fit rather
  // than reflowed. Starts at 1 so server and first client render agree.
  const [compassScale, setCompassScale] = useState(1);

  useEffect(() => {
    const pick = () => {
      const w = window.innerWidth;
      setCompassScale(w >= 1200 ? 1 : w >= 900 ? 0.85 : 0.7);
    };
    pick();
    window.addEventListener("resize", pick);
    return () => window.removeEventListener("resize", pick);
  }, []);

  useEffect(() => {
    if (activeSpec) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [activeSpec]);

  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        playSFX("close");
        setActiveSpec(null);
      }
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

      {/* Vignette */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 z-[1] h-full w-full"
        style={{
          background:
            "radial-gradient(ellipse at center, transparent 25%, rgba(9,9,9,0.5) 55%, rgba(9,9,9,0.97) 100%)",
        }}
      />

      {/* Section label */}
      <p className="absolute left-6 top-12 z-[5] text-[11px] uppercase tracking-[0.18em] text-[#444444] md:left-[60px]">
        02 — Specializations
      </p>

      {/* Centred against the full sticky panel. The translate lives on a
          static parent because Framer Motion owns the transform of the element
          it scales and would overwrite it. */}
      <div
        className="absolute left-1/2 top-1/2 z-[2] -translate-x-1/2 -translate-y-1/2"
        style={{ scale: compassScale, transformOrigin: "center center" }}
      >
        <div className="flex flex-col items-center gap-10 md:gap-0">
          <div className="relative flex items-center justify-center">
            {/* Decorative crosshair */}
            <div
              aria-hidden="true"
              className="pointer-events-none absolute left-1/2 top-1/2 z-0 hidden h-[0.5px] w-[400px] -translate-x-1/2 -translate-y-1/2 md:block"
              style={{ background: "rgba(255,255,255,0.025)" }}
            />
            <div
              aria-hidden="true"
              className="pointer-events-none absolute left-1/2 top-1/2 z-0 hidden h-[400px] w-[0.5px] -translate-x-1/2 -translate-y-1/2 md:block"
              style={{ background: "rgba(255,255,255,0.025)" }}
            />

            <JarvisCore />

            <TitleEdges hoveredSpec={hoveredSpec} />

            {/* Radial arms and labels (desktop) */}
            {SPECIALIZATIONS.map((spec) => (
              <Fragment key={spec.label}>
                <div
                  aria-hidden="true"
                  className="pointer-events-none absolute left-1/2 top-1/2 hidden md:block"
                  style={{
                    transform: `rotate(${spec.rotate}deg)`,
                    transformOrigin: "top center",
                  }}
                >
                  <motion.div
                    initial={{ scaleY: 0, opacity: 0 }}
                    whileInView={{ scaleY: 1, opacity: 1 }}
                    viewport={{ once: false }}
                    transition={{
                      delay: spec.delay,
                      duration: 0.8,
                      ease: EASE,
                    }}
                    style={{
                      width: 1,
                      height: spec.armLength,
                      marginTop: 55,
                      transformOrigin: "top center",
                      background:
                        "linear-gradient(to bottom, rgba(0,153,255,0.5), transparent)",
                    }}
                  />
                </div>

                <div
                  className="absolute left-1/2 top-1/2 hidden w-[260px] text-center md:block"
                  style={{
                    transform: `translate(-50%, -50%) translate(${spec.x}px, ${spec.y}px)`,
                    opacity: hoveredSpec === spec.key ? 0.7 : 1,
                    transition: "opacity 0.2s",
                  }}
                  onMouseEnter={() => setHoveredSpec(spec.key)}
                  onMouseLeave={() => setHoveredSpec(null)}
                >
                  <ArmTrigger
                    spec={spec}
                    onOpen={() => {
                      playSFX("select");
                      playSFX("expand");
                      setActiveSpec(spec.key);
                    }}
                  >
                    <motion.div
                      initial={{ opacity: 0 }}
                      whileInView={{ opacity: 1 }}
                      viewport={{ once: false }}
                      transition={{
                        delay: spec.delay,
                        duration: 0.8,
                        ease: EASE,
                      }}
                    >
                      <ArmLabel
                        spec={spec}
                        size="lg"
                        hovered={hoveredSpec === spec.key}
                      />
                    </motion.div>
                  </ArmTrigger>
                </div>
              </Fragment>
            ))}
          </div>

          {/* Stacked labels (mobile) — arm lines are omitted here per spec */}
          <div className="flex flex-col items-center gap-8 md:hidden">
            {SPECIALIZATIONS.map((spec) => (
              <motion.div
                key={spec.label}
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                viewport={{ once: false }}
                transition={{ delay: spec.delay, duration: 0.8, ease: EASE }}
                className="max-w-[280px] text-center"
                onMouseEnter={() => setHoveredSpec(spec.key)}
                onMouseLeave={() => setHoveredSpec(null)}
                style={{
                  opacity: hoveredSpec === spec.key ? 0.7 : 1,
                  transition: "opacity 0.2s",
                }}
              >
                <ArmTrigger
                  spec={spec}
                  onOpen={() => {
                    playSFX("select");
                    playSFX("expand");
                    setActiveSpec(spec.key);
                  }}
                >
                  <ArmLabel
                    spec={spec}
                    size="sm"
                    hovered={hoveredSpec === spec.key}
                  />
                </ArmTrigger>
              </motion.div>
            ))}
          </div>
        </div>
      </div>

      <AnimatePresence>
        {activeSpec && (
          <SpecializationOverlay
            key={activeSpec}
            specKey={activeSpec}
            onClose={() => {
              playSFX("close");
              setActiveSpec(null);
            }}
          />
        )}
      </AnimatePresence>
    </section>
  );
}
