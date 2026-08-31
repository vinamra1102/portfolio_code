"use client";

import { useState, useRef, useEffect } from "react";
import { createPortal } from "react-dom";
import {
  motion,
  AnimatePresence,
  useScroll,
  useTransform,
} from "framer-motion";

interface Project {
  title: string;
  status: string;
  tagline: string;
  description: string;
  tech: string[];
  github: string;
  initials: string;
  videoSrc: string;
}

const projects: Project[] = [
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
const easing = [0.16, 1, 0.3, 1] as const;

/**
 * One full screen project panel. Each card owns a 100vh wrapper and pins to
 * the top of it, so the next card slides up and covers this one.
 *
 * Two scroll trackers drive it. The entrance runs while the wrapper travels
 * from the bottom of the viewport to the top. The exit runs while the wrapper
 * leaves, which is exactly the window in which the following card covers this
 * one, so no cross-card refs are needed.
 */
function ProjectStackCard({
  project,
  index,
  total,
  onExpand,
  id,
}: {
  project: Project;
  index: number;
  total: number;
  onExpand: () => void;
  id?: string;
}) {
  const wrapperRef = useRef<HTMLDivElement>(null);

  const { scrollYProgress: enterProgress } = useScroll({
    target: wrapperRef,
    offset: ["start end", "start start"],
  });
  const { scrollYProgress: exitProgress } = useScroll({
    target: wrapperRef,
    offset: ["start start", "end start"],
  });

  const y = useTransform(enterProgress, [0, 1], ["8vh", "0vh"]);
  const enterOpacity = useTransform(enterProgress, [0, 1], [0.6, 1]);
  const scale = useTransform(exitProgress, [0, 0.5], [1, 0.95]);
  const exitOpacity = useTransform(exitProgress, [0, 0.5], [1, 0.7]);

  const counter = `${String(index + 1).padStart(2, "0")} / ${String(
    total,
  ).padStart(2, "0")}`;

  return (
    <div
      id={id}
      ref={wrapperRef}
      className="relative h-screen"
      style={{ zIndex: 10 + index }}
    >
      <motion.article
        style={{
          y,
          scale,
          opacity: index === 0 ? exitOpacity : enterOpacity,
          willChange: "transform",
        }}
        className="sticky top-0 flex h-screen w-full flex-col overflow-hidden bg-canvas md:flex-row"
      >
        {/* Left: media */}
        <div className="relative h-full w-full md:w-[55%]">
          {/* <video src={project.videoSrc} autoPlay muted loop playsInline className="absolute inset-0 h-full w-full object-cover" /> */}
          <motion.div
            animate={{ opacity: [0.3, 0.6, 0.3] }}
            transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
            className="absolute inset-0 flex items-center justify-center bg-surface-1"
          >
            <span className="text-[48px] font-medium text-[#222222]">
              {project.initials}
            </span>
          </motion.div>
          {/* Readability wash: strong from the bottom on mobile where the copy
              sits over the media, from the left on desktop where it does not. */}
          <div
            aria-hidden="true"
            className="absolute inset-0"
            style={{
              background:
                "linear-gradient(to top, rgba(9,9,9,0.95) 0%, rgba(9,9,9,0.4) 45%, transparent 70%)",
            }}
          />
          <div
            aria-hidden="true"
            className="absolute inset-0 hidden md:block"
            style={{
              background:
                "linear-gradient(to right, rgba(9,9,9,0.8) 0%, transparent 60%)",
            }}
          />
        </div>

        {/* Right: copy */}
        <div className="absolute bottom-0 left-0 right-0 flex flex-col justify-center px-6 pb-10 md:static md:w-[45%] md:px-[60px] md:py-20">
          <p className="mb-6 text-[11px] uppercase tracking-[0.2em] text-[#444444] md:mb-12">
            {index === 0 ? "03 — Projects" : counter}
          </p>

          <span
            className="mb-5 inline-flex w-fit rounded-full px-3 py-1 text-[11px] text-[#cccccc]"
            style={{
              background: "rgba(255,255,255,0.06)",
              border: "0.5px solid rgba(255,255,255,0.12)",
            }}
          >
            {project.status}
          </span>

          <h3 className="mb-4 font-medium leading-[1.0] tracking-[-2px] text-ink text-[clamp(24px,6vw,36px)] md:text-[clamp(32px,4vw,52px)]">
            {project.title}
          </h3>

          <p className="mb-8 max-w-[320px] text-[14px] leading-[1.5] text-ink-faint">
            {project.tagline}
          </p>

          <div className="mb-8 flex flex-wrap gap-[6px]">
            {project.tech.map((t) => (
              <span
                key={t}
                className="inline-block rounded-full border-[0.5px] border-hairline bg-surface-2 px-[13px] py-[5px] text-[12px] text-[#cccccc]"
              >
                {t}
              </span>
            ))}
          </div>

          <div className="flex flex-wrap gap-3">
            <a
              href={project.github}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 rounded-full border-[0.5px] border-hairline bg-surface-1 px-5 py-[10px] text-[12px] text-[#cccccc] no-underline transition-colors duration-200 hover:border-accent-blue hover:text-ink"
            >
              <svg
                width="14"
                height="14"
                viewBox="0 0 24 24"
                fill="currentColor"
              >
                <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" />
              </svg>
              GitHub
            </a>

            <button
              type="button"
              onClick={onExpand}
              className="inline-flex cursor-pointer items-center gap-2 rounded-full border-[0.5px] border-hairline bg-surface-1 px-5 py-[10px] text-[12px] text-[#cccccc] transition-colors duration-200 hover:border-accent-blue hover:text-ink"
            >
              View details
            </button>
          </div>
        </div>
      </motion.article>
    </div>
  );
}

function ExpandedOverlay({
  project,
  onClose,
}: {
  project: Project;
  onClose: () => void;
}) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.35, ease: easing }}
      className="fixed inset-0 z-[100] overflow-hidden bg-[#0a0a0a]"
      role="dialog"
      aria-modal="true"
      aria-label={project.title}
    >
      {/* Close button */}
      <button
        onClick={onClose}
        aria-label="Close project details"
        className="absolute right-6 top-6 z-10 flex h-10 w-10 items-center justify-center rounded-full bg-surface-2 transition-colors duration-200 hover:bg-[#252525]"
      >
        <svg
          width="16"
          height="16"
          viewBox="0 0 24 24"
          fill="none"
          stroke="white"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <line x1="18" y1="6" x2="6" y2="18" />
          <line x1="6" y1="6" x2="18" y2="18" />
        </svg>
      </button>

      <motion.div
        initial={{ y: 24, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        exit={{ y: 12, opacity: 0 }}
        transition={{ duration: 0.45, ease: easing }}
        className="flex h-full flex-col overflow-y-auto md:flex-row md:overflow-hidden"
      >
        {/* Left: video */}
        <div className="relative h-[45vh] shrink-0 md:h-full md:w-[55%]">
          {/* <video src={project.videoSrc} autoPlay muted loop playsInline className="absolute inset-0 h-full w-full object-cover" /> */}
          <div className="absolute inset-0 flex items-center justify-center bg-surface-2">
            <span className="text-[48px] font-medium text-[#333333]">
              {project.initials}
            </span>
          </div>
          <div className="absolute inset-0 bg-gradient-to-t from-black/85 to-transparent md:bg-gradient-to-r md:from-transparent md:to-black/85" />
        </div>

        {/* Right: details */}
        <div className="flex-1 p-6 md:w-[45%] md:overflow-y-auto md:p-12">
          {/* Back link */}
          <button
            onClick={onClose}
            className="mb-8 flex items-center gap-2 text-[13px] text-ink-muted transition-colors duration-200 hover:text-ink"
          >
            <svg
              width="14"
              height="14"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <line x1="19" y1="12" x2="5" y2="12" />
              <polyline points="12 19 5 12 12 5" />
            </svg>
            Back to projects
          </button>

          {/* Title */}
          <h2
            className="font-medium leading-tight text-ink"
            style={{
              fontSize: "clamp(32px, 4vw, 48px)",
              letterSpacing: "-2px",
            }}
          >
            {project.title}
          </h2>

          {/* Status pill */}
          <span className="mt-4 inline-block rounded-full border-[0.5px] border-white/15 bg-white/10 px-3 py-1 text-[11px] text-[#cccccc] backdrop-blur-[8px]">
            {project.status}
          </span>

          {/* Description */}
          <p className="mt-5 max-w-[480px] text-[14px] leading-[1.6] text-ink-muted">
            {project.description}
          </p>

          {/* Tech section */}
          <p className="mb-3 mt-8 text-[11px] uppercase tracking-[0.14em] text-[#555555]">
            Tools and Technologies
          </p>
          <div className="flex flex-wrap gap-2">
            {project.tech.map((t) => (
              <span
                key={t}
                className="inline-block rounded-full border-[0.5px] border-hairline bg-surface-2 px-[13px] py-[5px] text-[12px] text-[#cccccc]"
              >
                {t}
              </span>
            ))}
          </div>

          {/* Links */}
          <p className="mb-3 mt-6 text-[11px] uppercase tracking-[0.14em] text-[#555555]">
            Links
          </p>
          <a
            href={project.github}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 rounded-full border-[0.5px] border-hairline bg-surface-1 px-4 py-2 text-[13px] text-[#cccccc] transition-colors duration-200 hover:border-accent-blue hover:text-ink"
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
              <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" />
            </svg>
            View on GitHub
          </a>
        </div>
      </motion.div>
    </motion.div>
  );
}

export default function ProjectsSection() {
  const [expandedIndex, setExpandedIndex] = useState<number | null>(null);
  const introRef = useRef<HTMLDivElement>(null);

  // The intro heading clears out as the first card rises over it.
  const { scrollYProgress: introProgress } = useScroll({
    target: introRef,
    offset: ["start start", "end start"],
  });
  const introOpacity = useTransform(introProgress, [0, 0.1, 0.5], [1, 1, 0]);

  // Close the overlay on Escape and lock background scroll while it is open.
  useEffect(() => {
    if (expandedIndex === null) return;

    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") setExpandedIndex(null);
    };
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", onKeyDown);

    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener("keydown", onKeyDown);
    };
  }, [expandedIndex]);

  return (
    /* The id lives on the first card's 100vh wrapper, not on this 600vh
       container: ScrollDotNav observes at threshold 0.5, which a 600vh element
       can never reach, so the dot would never light up. Anchor scrolling is
       unaffected because that wrapper starts at this container's top. */
    <section
      className="relative z-[3] w-full bg-canvas"
      style={{ height: `${(projects.length + 1) * 100}vh` }}
    >
      {/* Intro heading, pinned for the first stretch then overtaken */}
      <div ref={introRef} className="absolute inset-x-0 top-0 h-screen">
        <motion.div
          style={{ opacity: introOpacity }}
          className="sticky top-0 z-[9] flex h-screen items-center px-6 md:px-[60px]"
        >
          <h2
            className="font-medium leading-tight text-ink"
            style={{
              fontSize: "clamp(36px, 5vw, 62px)",
              letterSpacing: "-3px",
            }}
          >
            Things I have built.
          </h2>
        </motion.div>
      </div>

      {projects.map((project, i) => (
        <ProjectStackCard
          key={project.title}
          project={project}
          index={i}
          total={projects.length}
          id={i === 0 ? "projects" : undefined}
          onExpand={() => setExpandedIndex(i)}
        />
      ))}

      {/* Expanded overlay - rendered at the document root, outside this
          section's stacking context. */}
      {typeof document !== "undefined" &&
        createPortal(
          <AnimatePresence>
            {expandedIndex !== null && (
              <ExpandedOverlay
                key="project-overlay"
                project={projects[expandedIndex]}
                onClose={() => setExpandedIndex(null)}
              />
            )}
          </AnimatePresence>,
          document.body,
        )}
    </section>
  );
}
