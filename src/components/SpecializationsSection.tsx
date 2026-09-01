"use client";

import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { DottedGlowBackground } from "@/components/ui/dotted-glow-background";
import { playSFX } from "@/lib/sfx";

const EASE = [0.16, 1, 0.3, 1] as const;

/** Vertex coordinates inside the 600 x 520 viewBox. */
const POINTS = {
  top: { x: 300, y: 60 },
  "bottom-left": { x: 80, y: 460 },
  "bottom-right": { x: 520, y: 460 },
} as const;

type VertexPosition = keyof typeof POINTS;

const vertices: {
  id: string;
  label: string;
  sublabel: string;
  position: VertexPosition;
  projects: { title: string; initials: string }[];
}[] = [
  {
    id: "lerobot",
    label: "LeRobot",
    sublabel: "Imitation Learning",
    position: "top",
    projects: [
      { title: "OpenBot Giraffe", initials: "OG" },
      { title: "5-DOF Manipulation Stack", initials: "5D" },
    ],
  },
  {
    id: "ros2",
    label: "ROS2",
    sublabel: "Robot Operating System",
    position: "bottom-left",
    projects: [
      { title: "MuJoCo-Gazebo RL Transfer", initials: "MG" },
      { title: "RRT Maze Solver", initials: "RM" },
    ],
  },
  {
    id: "moveit2",
    label: "MoveIt2",
    sublabel: "Motion Planning",
    position: "bottom-right",
    projects: [
      { title: "5-DOF Manipulation Stack", initials: "5D" },
      { title: "OpenBot Giraffe", initials: "OG" },
    ],
  },
];

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

/** Each edge lights when either of the vertices it joins is hovered. */
const EDGES: { from: VertexPosition; to: VertexPosition; lit: string[] }[] = [
  { from: "top", to: "bottom-left", lit: ["lerobot", "ros2"] },
  { from: "top", to: "bottom-right", lit: ["lerobot", "moveit2"] },
  { from: "bottom-left", to: "bottom-right", lit: ["ros2", "moveit2"] },
];

/** One project pill under a hovered vertex. */
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
  const [hoveredVertex, setHoveredVertex] = useState<string | null>(null);

  const [selectedProject, setSelectedProject] = useState<Project | null>(null);

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

      <div className="relative z-[2] h-[520px] w-[600px]">
        {/* Ambient bloom behind the triangle */}
        <motion.div
          aria-hidden="true"
          animate={{ opacity: hoveredVertex ? 1 : [0.4, 0.8, 0.4] }}
          transition={
            hoveredVertex
              ? { duration: 0.4, ease: EASE }
              : { duration: 4, repeat: Infinity, ease: "easeInOut" }
          }
          className="pointer-events-none absolute left-1/2 top-1/2 z-0"
          style={{
            width: 400,
            height: 400,
            marginLeft: -200,
            marginTop: -200,
            borderRadius: "50%",
            background:
              "radial-gradient(circle, rgba(0,153,255,0.06) 0%, transparent 70%)",
            filter: "blur(40px)",
          }}
        />

        <svg
          viewBox="0 0 600 520"
          className="absolute inset-0 z-[1] h-full w-full"
          aria-hidden="true"
        >
          <defs>
            <filter id="glow-edge" x="-20%" y="-20%" width="140%" height="140%">
              <feGaussianBlur stdDeviation="3" result="blur" />
              <feMerge>
                <feMergeNode in="blur" />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>
            <filter
              id="glow-edge-bright"
              x="-30%"
              y="-30%"
              width="160%"
              height="160%"
            >
              <feGaussianBlur stdDeviation="5" result="blur" />
              <feMerge>
                <feMergeNode in="blur" />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>
          </defs>

          {EDGES.map((edge) => {
            const a = POINTS[edge.from];
            const b = POINTS[edge.to];
            const lit =
              hoveredVertex !== null && edge.lit.includes(hoveredVertex);
            return (
              <line
                key={`${edge.from}-${edge.to}`}
                x1={a.x}
                y1={a.y}
                x2={b.x}
                y2={b.y}
                fill="none"
                stroke={lit ? "rgba(0,153,255,0.9)" : "rgba(0,153,255,0.25)"}
                strokeWidth={lit ? 1.5 : 1}
                filter={`url(#${lit ? "glow-edge-bright" : "glow-edge"})`}
                style={{ transition: "stroke 0.3s, stroke-width 0.3s" }}
              />
            );
          })}
        </svg>

        {/* Vertex nodes, each centred on its triangle corner */}
        {vertices.map((vertex) => {
          const point = POINTS[vertex.position];
          const isHovered = hoveredVertex === vertex.id;
          const dimmed = hoveredVertex !== null && !isHovered;
          const isTop = vertex.position === "top";

          return (
            <div
              key={vertex.id}
              onMouseEnter={() => setHoveredVertex(vertex.id)}
              onMouseLeave={() => setHoveredVertex(null)}
              className="absolute z-[2]"
              style={{
                left: point.x,
                top: point.y,
                width: isTop ? 140 : 160,
                height: 140,
                marginLeft: isTop ? -70 : -80,
                marginTop: -70,
                cursor: "none",
              }}
            >
              {/* Dot sits exactly on the vertex */}
              <motion.div
                animate={{
                  scale: isHovered ? 1.3 : dimmed ? 0.97 : 1,
                  opacity: dimmed ? 0.7 : 1,
                }}
                transition={{ type: "spring", stiffness: 300, damping: 20 }}
                className="absolute left-1/2 top-1/2"
                style={{
                  width: isHovered ? 16 : 12,
                  height: isHovered ? 16 : 12,
                  marginLeft: isHovered ? -8 : -6,
                  marginTop: isHovered ? -8 : -6,
                  borderRadius: "50%",
                  background: isHovered ? "#0099ff" : "rgba(0,153,255,0.4)",
                  border: isHovered
                    ? "1.5px solid rgba(0,153,255,0.9)"
                    : "1px solid rgba(0,153,255,0.4)",
                  boxShadow: isHovered
                    ? "0 0 16px rgba(0,153,255,1), 0 0 32px rgba(0,153,255,0.6), 0 0 60px rgba(0,153,255,0.3)"
                    : "0 0 8px rgba(0,153,255,0.3)",
                  transition:
                    "width 0.3s cubic-bezier(0.16,1,0.3,1), height 0.3s cubic-bezier(0.16,1,0.3,1), background 0.3s, border 0.3s, box-shadow 0.3s",
                }}
              />

              {/* Label block, below the dot */}
              <motion.div
                animate={{
                  scale: isHovered ? 1.08 : dimmed ? 0.97 : 1,
                  opacity: dimmed ? 0.7 : 1,
                }}
                transition={{ type: "spring", stiffness: 280, damping: 22 }}
                className="absolute left-1/2 flex flex-col items-center"
                style={{
                  top: "calc(50% + 18px)",
                  width: isTop ? 140 : 160,
                  marginLeft: isTop ? -70 : -80,
                }}
              >
                <span
                  className="block whitespace-nowrap text-[18px] font-medium text-ink"
                  style={{
                    letterSpacing: "-0.5px",
                    textShadow: isHovered
                      ? "0 0 20px rgba(0,153,255,0.5)"
                      : "none",
                    transition: "text-shadow 0.2s, opacity 0.2s",
                  }}
                >
                  {vertex.label}
                </span>
                <span className="mt-[2px] block whitespace-nowrap text-[10px] uppercase tracking-[0.12em] text-[#444444]">
                  {vertex.sublabel}
                </span>

                {isTop && (
                  <AnimatePresence>
                    {isHovered && (
                      <div className="mt-[10px] flex flex-col items-center gap-[6px]">
                        {vertex.projects.map((project, i) => (
                          <ProjectPill
                            key={project.title}
                            title={project.title}
                            index={i}
                            onOpen={() => openProject(project.title)}
                          />
                        ))}
                      </div>
                    )}
                  </AnimatePresence>
                )}
              </motion.div>

              {/* Bottom vertices sit near the container floor, so their pills
                  rise above the dot rather than running off the edge. */}
              {!isTop && (
                <AnimatePresence>
                  {isHovered && (
                    <div
                      className="absolute left-1/2 flex flex-col items-center gap-[6px]"
                      style={{
                        bottom: "calc(50% + 18px)",
                        width: 220,
                        marginLeft: -110,
                      }}
                    >
                      {vertex.projects.map((project, i) => (
                        <ProjectPill
                          key={project.title}
                          title={project.title}
                          index={i}
                          onOpen={() => openProject(project.title)}
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
