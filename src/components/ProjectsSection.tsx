"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import HoverImageReveal from "@/components/HoverImageReveal";
import { DottedGlowBackground } from "@/components/ui/dotted-glow-background";

const projects = [
  {
    title: "OpenBot Giraffe",
    status: "Open Source",
    tagline: "Affordable 5-DOF robotic arm for hobbyists and researchers",
    description:
      "Designed an affordable 5-DOF robotic manipulator with a 3D-printed frame and ST3215 servos. Integrated with LeRobot, ROS2 and MoveIt for trajectory planning, teleoperation and imitation learning in both simulated and real-world applications.",
    tech: ["ROS2", "LeRobot", "MoveIt2", "Python", "Fusion 360", "Isaac Sim"],
    github: "https://github.com/anantppandey/openbot-giraffe",
    initials: "OG",
    videoSrc: "/videos/openbot-giraffe.mp4",
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
    videoSrc: "/videos/manipulation-stack.mp4",
  },
  {
    title: "MuJoCo-Gazebo RL Transfer",
    status: "Research",
    tagline: "PPO reach policy trained in MuJoCo and transferred to Gazebo",
    description:
      "Trained a PPO reach policy from scratch in MuJoCo using Stable-Baselines3, raising success rate from 37% to 78% through seed-controlled ablation. Built a ROS2 and Gazebo pipeline transferring the policy across simulators with retry-based trajectory generation and closed-loop control.",
    tech: ["MuJoCo", "Stable-Baselines3", "ROS2", "Gazebo", "Python", "PPO"],
    github: "https://github.com/anantppandey/mujoco-gazebo-transfer",
    initials: "MG",
    videoSrc: "/videos/mujoco-gazebo.mp4",
  },
  {
    title: "ML-based NMPC",
    status: "Research",
    tagline: "Neural network replacing PID control in a quadrotor MPC",
    description:
      "Modeled quadrotor nonlinear flight dynamics as a state-dependent linear system inside a Nonlinear MPC controller in MATLAB. Trained a TensorFlow neural network on NMPC trajectory data to predict quadrotor state evolution, improving prediction MAE by 47% over the analytical model.",
    tech: ["TensorFlow", "MATLAB", "Python", "NumPy", "Keras"],
    github: "https://github.com/anantppandey/ml-nmpc",
    initials: "NM",
    videoSrc: "/videos/nmpc.mp4",
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
    videoSrc: "/videos/rrt-maze.mp4",
  },
];

export default function ProjectsSection() {
  const [selectedProject, setSelectedProject] = useState<
    (typeof projects)[0] | null
  >(null);

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
      if (e.key === "Escape") {
        setSelectedProject(null)
      }
    };
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, []);

  const items = {
    itemCount: projects.length,
    ...Object.fromEntries(
      projects.map((p, i) => [
        `item${i + 1}`,
        {
          text: p.title,
          image: { src: p.videoSrc, alt: p.tagline },
        },
      ]),
    ),
  };

  return (
    <section
      id="projects"
      style={{
        background: "#090909",
        minHeight: "100vh",
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        padding: "80px 0 96px 0",
        position: "relative",
        overflow: "hidden",
      }}
    >
      <DottedGlowBackground
        className="pointer-events-none absolute inset-0 z-0 mask-radial-to-70-bottom-left"
        opacity={0.5}
        gap={18}
        radius={1.2}
        colorLightVar="--color-neutral-500"
        glowColorLightVar="--color-neutral-600"
        colorDarkVar="--color-neutral-700"
        glowColorDarkVar="--color-sky-600"
        backgroundOpacity={0}
        speedMin={0.15}
        speedMax={0.6}
        speedScale={0.5}
      />
      <div
        style={{
          padding: "0 80px",
          marginBottom: "32px",
          position: "relative",
          zIndex: 1,
        }}
      >
        <p
          style={{
            fontSize: "11px",
            color: "#444444",
            letterSpacing: "0.18em",
            textTransform: "uppercase",
            fontWeight: 400,
            margin: 0,
            marginBottom: "10px",
          }}
        >
          03 — Projects
        </p>
        <h2
          style={{
            fontSize: "clamp(52px, 7vw, 88px)",
            fontWeight: 500,
            color: "#ffffff",
            letterSpacing: "-4px",
            lineHeight: 1.0,
            margin: 0,
          }}
        >
          More of my projects
          <span
            style={{
              color: "#0099ff",
              fontSize: "inherit",
              fontWeight: 500,
            }}
          >
            .
          </span>
        </h2>
      </div>

      <div
        style={{
          flex: 1,
          minHeight: "400px",
          padding: "0 80px",
          position: "relative",
          zIndex: 1,
        }}
      >
        <HoverImageReveal
          items={items}
          backgroundColor="#090909"
          textColor="#ffffff"
          dimColor="#252525"
          align="left"
          rowGap={0}
          font={{
            fontSize: "clamp(22px, 3vw, 40px)",
            fontWeight: 400,
            letterSpacing: "-0.03em",
            lineHeight: "1.0",
            fontFamily: "Inter",
          }}
          transition={{
            stiffness: 350,
            damping: 38,
            mass: 0.8,
          }}
          style={{
            padding: "0",
            height: "auto",
            justifyContent: "flex-start",
            gap: "0px",
            overflow: "visible",
          }}
          onItemClick={(index) => {
            setSelectedProject(projects[index])
          }}
        />
      </div>

      <AnimatePresence>
        {selectedProject && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            onClick={() => {
              setSelectedProject(null)
            }}
            role="dialog"
            aria-modal="true"
            aria-label={selectedProject.title}
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
              transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
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
                    {selectedProject.initials}
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
                  onClick={() => {
              setSelectedProject(null)
            }}
                  aria-label="Close project details"
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
