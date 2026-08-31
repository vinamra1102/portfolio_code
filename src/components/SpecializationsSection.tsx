"use client";

import { Fragment, useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { HalftoneTexture } from "@/components/HalftoneTexture";

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

const HEX_CLIP =
  "polygon(50% 0%, 100% 25%, 100% 75%, 50% 100%, 0% 75%, 0% 25%)";

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
    y: -220,
    rotate: 180,
    delay: 0,
  },
  {
    key: "ros2" as SpecKey,
    label: "ROS2",
    sublabel: "Robot Operating System",
    x: -200,
    y: 180,
    rotate: 48.01,
    delay: 0.2,
  },
  {
    key: "moveit2" as SpecKey,
    label: "MoveIt2",
    sublabel: "Motion Planning and Manipulation",
    x: 200,
    y: 180,
    rotate: -48.01,
    delay: 0.4,
  },
] as const;

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
      if (e.key === "Escape") setActiveSpec(null);
    };
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, []);

  return (
    <section
      id="specializations"
      className="sticky left-0 top-0 flex h-screen w-full items-center justify-center overflow-hidden bg-canvas"
    >
      <HalftoneTexture maskPosition="75% 20%" blue={true} />

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
      <div className="absolute left-1/2 top-1/2 z-[2] -translate-x-1/2 -translate-y-1/2">
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

            {/* Outer pulse ring */}
            <motion.div
              aria-hidden="true"
              animate={{ opacity: [0.05, 0.15, 0.05] }}
              transition={{
                duration: 3,
                repeat: Infinity,
                ease: "easeInOut",
                delay: 0.5,
              }}
              className="pointer-events-none absolute h-[160px] w-[160px] rounded-full"
              style={{ border: "0.5px solid rgba(0, 153, 255, 0.07)" }}
            />

            {/* Inner pulse ring */}
            <motion.div
              aria-hidden="true"
              animate={{ opacity: [0.2, 0.5, 0.2] }}
              transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
              className="pointer-events-none absolute h-[110px] w-[110px] rounded-full"
              style={{ border: "0.5px solid rgba(0, 153, 255, 0.2)" }}
            />

            {/* Rotating hexagon */}
            <motion.div
              aria-hidden="true"
              animate={{ rotate: 360 }}
              transition={{ duration: 14, repeat: Infinity, ease: "linear" }}
              className="h-[90px] w-[90px]"
              style={{
                clipPath: HEX_CLIP,
                background:
                  "linear-gradient(135deg, #0a1628 0%, #001833 50%, #0099ff11 100%)",
              }}
            />

            {/* Monogram sits alongside the hexagon so it stays upright while the
              hexagon spins behind it. */}
            <span className="pointer-events-none absolute z-[2] text-[15px] font-medium tracking-[-0.5px] text-ink">
              AP
            </span>

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
                      height: 140,
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
                    onOpen={() => setActiveSpec(spec.key)}
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
                <ArmTrigger spec={spec} onOpen={() => setActiveSpec(spec.key)}>
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

      {/* Bottom hint */}
      <motion.p
        animate={{ y: [0, 6, 0] }}
        transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
        className="absolute bottom-10 left-1/2 z-[5] hidden -translate-x-1/2 whitespace-nowrap text-[11px] uppercase tracking-[0.14em] text-[#333333] md:block"
      >
        Scroll to explore projects
      </motion.p>

      <AnimatePresence>
        {activeSpec && (
          <SpecializationOverlay
            key={activeSpec}
            specKey={activeSpec}
            onClose={() => setActiveSpec(null)}
          />
        )}
      </AnimatePresence>
    </section>
  );
}
