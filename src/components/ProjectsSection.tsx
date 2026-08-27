"use client";

import { Fragment, useState, useRef, useEffect } from "react";
import { createPortal } from "react-dom";
import { motion, AnimatePresence } from "framer-motion";

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
const EASE_CSS = "cubic-bezier(0.16, 1, 0.3, 1)";

/**
 * A card is a plain presentational element — no layoutId. Shared-layout
 * projection between the desktop grid, the mobile carousel and the overlay
 * collapsed the grid cards to a 0x0 box; the overlay is a separate portal
 * instead.
 */
function ProjectCard({
  project,
  index,
  height,
  onExpand,
  onMouseEnter,
  onMouseLeave,
}: {
  project: Project;
  index: number;
  height: number;
  onExpand: () => void;
  onMouseEnter?: () => void;
  onMouseLeave?: () => void;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.15 }}
      transition={{ delay: 0.1 * index, duration: 0.6, ease: easing }}
      onClick={onExpand}
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
      role="button"
      tabIndex={0}
      aria-label={`Open ${project.title}`}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          onExpand();
        }
      }}
      className="group relative block w-full cursor-pointer overflow-hidden rounded-[15px] bg-surface-1 outline-none focus-visible:ring-1 focus-visible:ring-accent-blue"
      style={{
        height: `${height}px`,
        transition: `height 0.5s ${EASE_CSS}`,
      }}
    >
      {/* Video placeholder */}
      {/* <video src={project.videoSrc} autoPlay muted loop playsInline className="absolute inset-0 h-full w-full object-cover" /> */}
      <div className="absolute inset-0 flex items-center justify-center bg-surface-2">
        <span className="text-[32px] font-medium text-[#333333]">
          {project.initials}
        </span>
      </div>

      {/* Gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/85 to-transparent" />

      {/* Content layer */}
      <div className="absolute bottom-0 left-0 right-0 p-5 px-6 pr-24">
        <span className="inline-block rounded-full border-[0.5px] border-white/15 bg-white/10 px-3 py-1 text-[11px] text-[#cccccc] backdrop-blur-[8px]">
          {project.status}
        </span>
        <h3 className="mt-2 text-[18px] font-medium leading-tight tracking-[-0.5px] text-ink">
          {project.title}
        </h3>
        <p className="mt-1 text-[13px] text-ink-muted">{project.tagline}</p>
      </div>

      {/* Arrow button */}
      <div className="absolute bottom-5 right-6 flex items-center gap-2">
        <span className="text-[12px] text-ink opacity-0 transition-opacity duration-300 group-hover:opacity-100">
          Explore
        </span>
        <div
          className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full border-[0.5px] border-white/15 bg-white/10 backdrop-blur-[8px] group-hover:rotate-45 group-hover:border-accent-blue"
          style={{ transition: `all 0.3s ${EASE_CSS}` }}
        >
          <svg
            width="14"
            height="14"
            viewBox="0 0 24 24"
            fill="none"
            stroke="white"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <line x1="5" y1="12" x2="19" y2="12" />
            <polyline points="12 5 19 12 12 19" />
          </svg>
        </div>
      </div>
    </motion.div>
  );
}

const CARD_H = { base: 420, grown: 520, shrunk: 380 } as const;

function ProjectRow({
  rowProjects,
  startIndex,
  onExpand,
}: {
  rowProjects: Project[];
  startIndex: number;
  onExpand: (index: number) => void;
}) {
  const [hoveredCard, setHoveredCard] = useState<number | null>(null);

  const gridTemplateColumns =
    hoveredCard === null
      ? "1fr 1fr"
      : hoveredCard === 0
        ? "1.4fr 0.6fr"
        : "0.6fr 1.4fr";

  const heightFor = (i: number) =>
    hoveredCard === null
      ? CARD_H.base
      : hoveredCard === i
        ? CARD_H.grown
        : CARD_H.shrunk;

  return (
    <div
      className="grid w-full items-start gap-3"
      style={{
        gridTemplateColumns,
        transition: `grid-template-columns 0.5s ${EASE_CSS}`,
      }}
    >
      {rowProjects.map((project, i) => (
        <ProjectCard
          key={project.title}
          project={project}
          index={startIndex + i}
          height={heightFor(i)}
          onExpand={() => onExpand(startIndex + i)}
          onMouseEnter={() => setHoveredCard(i)}
          onMouseLeave={() => setHoveredCard(null)}
        />
      ))}
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

const HEX_CLIP =
  "polygon(50% 0%, 100% 25%, 100% 75%, 50% 100%, 0% 75%, 0% 25%)";

/**
 * `angle` points the arm line at its label: 0deg is due right, positive is
 * clockwise, so it is atan2(y, x) of the label offset in screen coordinates.
 */
const SPECIALIZATIONS = [
  {
    label: "LeRobot",
    sublabel: "Imitation Learning Pipeline",
    x: 0,
    y: -180,
    angle: -90,
    delay: 0,
  },
  {
    label: "ROS2",
    sublabel: "Robot Operating System",
    x: -160,
    y: 140,
    angle: 138.81,
    delay: 0.15,
  },
  {
    label: "MoveIt2",
    sublabel: "Motion Planning and Manipulation",
    x: 160,
    y: 140,
    angle: 41.19,
    delay: 0.3,
  },
] as const;

function CompassOverlay({ onClose }: { onClose: () => void }) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.4, ease: easing }}
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-label="Specializations"
      className="fixed inset-0 z-[100] flex items-center justify-center overflow-hidden"
      style={{
        background: "rgba(9, 9, 9, 0.92)",
        backdropFilter: "blur(20px)",
      }}
    >
      {/* Close */}
      <button
        type="button"
        onClick={onClose}
        aria-label="Close specializations"
        className="absolute right-8 top-8 flex h-10 w-10 cursor-pointer items-center justify-center rounded-full border-[0.5px] border-hairline bg-surface-1 text-[18px] leading-none text-ink-muted transition-colors duration-200 hover:border-accent-blue hover:text-ink"
      >
        ×
      </button>

      {/* Compass — stops the backdrop click from closing */}
      <div
        onClick={(e) => e.stopPropagation()}
        className="relative flex flex-col items-center gap-8 md:gap-0"
      >
        <div className="relative flex items-center justify-center">
          {/* Decorative crosshair, behind everything */}
          <div
            aria-hidden="true"
            className="pointer-events-none absolute left-1/2 top-1/2 hidden h-px w-[280px] -translate-x-1/2 -translate-y-1/2 md:block"
            style={{ background: "rgba(255,255,255,0.03)" }}
          />
          <div
            aria-hidden="true"
            className="pointer-events-none absolute left-1/2 top-1/2 hidden h-[280px] w-px -translate-x-1/2 -translate-y-1/2 md:block"
            style={{ background: "rgba(255,255,255,0.03)" }}
          />

          {/* Outer pulse ring */}
          <motion.div
            aria-hidden="true"
            animate={{ opacity: [0.05, 0.2, 0.05] }}
            transition={{
              duration: 3,
              repeat: Infinity,
              ease: "easeInOut",
              delay: 0.5,
            }}
            className="pointer-events-none absolute h-[140px] w-[140px] rounded-full"
            style={{ border: "0.5px solid rgba(0, 153, 255, 0.08)" }}
          />

          {/* Inner pulse ring */}
          <motion.div
            aria-hidden="true"
            animate={{ opacity: [0.2, 0.6, 0.2] }}
            transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
            className="pointer-events-none absolute h-[100px] w-[100px] rounded-full"
            style={{ border: "0.5px solid rgba(0, 153, 255, 0.2)" }}
          />

          {/* Rotating hexagon */}
          <motion.div
            aria-hidden="true"
            animate={{ rotate: 360 }}
            transition={{ duration: 12, repeat: Infinity, ease: "linear" }}
            className="h-[60px] w-[60px] md:h-20 md:w-20"
            style={{
              clipPath: HEX_CLIP,
              background:
                "linear-gradient(135deg, #0a1628 0%, #001833 50%, #0099ff11 100%)",
            }}
          />

          {/* Monogram — a sibling, so the hexagon spins behind it and the
            lettering stays upright rather than tumbling with it. */}
          <span className="pointer-events-none absolute z-[2] text-[14px] font-medium tracking-[-0.5px] text-ink">
            AP
          </span>

          {/* Radial arms + labels (desktop) */}
          {SPECIALIZATIONS.map((s) => (
            <Fragment key={s.label}>
              <div
                aria-hidden="true"
                className="pointer-events-none absolute left-1/2 top-1/2 hidden md:block"
                style={{
                  transform: `rotate(${s.angle}deg)`,
                  transformOrigin: "0 0",
                }}
              >
                <motion.div
                  initial={{ scaleX: 0 }}
                  animate={{ scaleX: 1 }}
                  transition={{ delay: s.delay, duration: 0.6, ease: easing }}
                  style={{
                    width: 120,
                    height: 1,
                    marginLeft: 50,
                    transformOrigin: "left center",
                    background:
                      "linear-gradient(to right, rgba(0,153,255,0.6), transparent)",
                  }}
                />
              </div>

              <div
                className="pointer-events-none absolute left-1/2 top-1/2 hidden text-center md:block"
                style={{
                  transform: `translate(-50%, -50%) translate(${s.x}px, ${s.y}px)`,
                }}
              >
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{
                    delay: s.delay + 0.3,
                    duration: 0.4,
                    ease: easing,
                  }}
                >
                  <span className="block whitespace-nowrap text-[18px] font-medium tracking-[-0.5px] text-ink">
                    {s.label}
                  </span>
                  <span className="mt-1 block whitespace-nowrap text-[11px] uppercase tracking-[0.1em] text-[#555555]">
                    {s.sublabel}
                  </span>
                </motion.div>
              </div>
            </Fragment>
          ))}
        </div>

        {/* Stacked labels (mobile) — arm lines are omitted here per spec */}
        <div className="flex flex-col items-center gap-8 md:hidden">
          {SPECIALIZATIONS.map((s) => (
            <motion.div
              key={s.label}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{
                delay: s.delay + 0.3,
                duration: 0.4,
                ease: easing,
              }}
              className="text-center"
            >
              <span className="block text-[22px] font-medium tracking-[-0.5px] text-ink">
                {s.label}
              </span>
              <span className="mt-1 block text-[11px] uppercase tracking-[0.1em] text-[#555555]">
                {s.sublabel}
              </span>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Footer caption */}
      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.8, duration: 0.4, ease: easing }}
        className="absolute bottom-10 left-1/2 -translate-x-1/2 whitespace-nowrap text-[11px] uppercase tracking-[0.2em] text-[#333333]"
      >
        Specializations — Anant Pandey
      </motion.p>
    </motion.div>
  );
}

export default function ProjectsSection() {
  const [expandedIndex, setExpandedIndex] = useState<number | null>(null);
  const [compassOpen, setCompassOpen] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);
  const [activeDot, setActiveDot] = useState(0);

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

  // Same treatment for the compass overlay.
  useEffect(() => {
    if (!compassOpen) return;

    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") setCompassOpen(false);
    };
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", onKeyDown);

    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener("keydown", onKeyDown);
    };
  }, [compassOpen]);

  useEffect(() => {
    const container = scrollRef.current;
    if (!container) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActiveDot(Number(entry.target.getAttribute("data-index")));
          }
        });
      },
      { root: container, threshold: 0.6 }
    );

    const cards = container.querySelectorAll("[data-index]");
    cards.forEach((card) => observer.observe(card));

    return () => observer.disconnect();
  }, []);

  return (
    <section id="projects" className="relative w-full bg-canvas">
      <div className="mx-auto max-w-[1400px] px-6 py-16 md:px-[60px] md:py-[96px]">
        {/* Section label */}
        <motion.p
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, ease: easing }}
          className="mb-4 text-[11px] uppercase tracking-[0.18em] text-ink-muted"
        >
          02 — Projects
        </motion.p>

        {/* Section heading */}
        <motion.h2
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.1, duration: 0.7, ease: easing }}
          className="mb-12 font-medium leading-tight text-ink"
          style={{
            fontSize: "clamp(36px, 5vw, 62px)",
            letterSpacing: "-3px",
          }}
        >
          Things I have built.
        </motion.h2>

        {/* Compass trigger */}
        <motion.button
          type="button"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.2, duration: 0.6, ease: easing }}
          onClick={() => setCompassOpen(true)}
          aria-haspopup="dialog"
          aria-expanded={compassOpen}
          className="mb-12 inline-flex cursor-pointer items-center gap-2 rounded-full border-[0.5px] border-hairline bg-transparent px-5 py-[10px] text-[12px] uppercase tracking-[0.12em] text-ink-muted transition-all duration-200 hover:border-accent-blue hover:text-ink"
        >
          <svg
            width="14"
            height="14"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.5"
            aria-hidden="true"
          >
            <circle cx="12" cy="12" r="10" />
            <polygon points="12,2 14.5,9.5 12,12 9.5,9.5" fill="currentColor" />
            <polygon
              points="22,12 14.5,14.5 12,12 14.5,9.5"
              fill="currentColor"
              opacity="0.4"
            />
            <polygon
              points="12,22 9.5,14.5 12,12 14.5,14.5"
              fill="currentColor"
              opacity="0.4"
            />
            <polygon
              points="2,12 9.5,9.5 12,12 9.5,14.5"
              fill="currentColor"
              opacity="0.4"
            />
          </svg>
          Explore Specializations
        </motion.button>

        {/* Desktop grid - 2 rows with independent hover stretch */}
        <div className="hidden w-full flex-col gap-3 md:flex">
          <ProjectRow
            rowProjects={projects.slice(0, 2)}
            startIndex={0}
            onExpand={setExpandedIndex}
          />
          <ProjectRow
            rowProjects={projects.slice(2, 4)}
            startIndex={2}
            onExpand={setExpandedIndex}
          />

          {/* Row 3: the odd card out, centred at half width */}
          <div className="flex w-full justify-center">
            <div className="w-1/2">
              <ProjectCard
                project={projects[4]}
                index={4}
                height={CARD_H.base}
                onExpand={() => setExpandedIndex(4)}
              />
            </div>
          </div>
        </div>

        {/* Mobile carousel */}
        <div className="md:hidden">
          <div
            ref={scrollRef}
            className="no-scrollbar -mx-6 flex snap-x snap-mandatory gap-3 overflow-x-auto px-6"
            style={{ WebkitOverflowScrolling: "touch" }}
          >
            {projects.map((project, i) => (
              <div
                key={project.title}
                data-index={i}
                className="w-[85vw] shrink-0 snap-start"
              >
                <ProjectCard
                  project={project}
                  index={i}
                  height={CARD_H.base}
                  onExpand={() => setExpandedIndex(i)}
                />
              </div>
            ))}
          </div>

          {/* Scroll dots */}
          <div className="mt-4 flex justify-center gap-2">
            {projects.map((project, i) => (
              <div
                key={project.title}
                className={`h-1.5 w-1.5 rounded-full transition-colors duration-300 ${
                  activeDot === i ? "bg-ink" : "bg-[#333333]"
                }`}
              />
            ))}
          </div>
        </div>
      </div>

      {/* Expanded overlay — rendered at the document root, outside this
          section's stacking context. AnimatePresence wraps only the overlay. */}
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
          document.body
        )}

      {/* Specializations compass — portaled alongside the project overlay. */}
      {typeof document !== "undefined" &&
        createPortal(
          <AnimatePresence>
            {compassOpen && (
              <CompassOverlay
                key="compass-overlay"
                onClose={() => setCompassOpen(false)}
              />
            )}
          </AnimatePresence>,
          document.body
        )}
    </section>
  );
}
