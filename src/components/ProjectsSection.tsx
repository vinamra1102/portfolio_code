"use client";

import { useState, useRef, useEffect } from "react";
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
    tagline: "5-DOF robotic arm built for hobbyists and researchers",
    description:
      "Designed an affordable 5-DOF robotic manipulator with a 3D-printed frame and ST3215 servos. Integrated with LeRobot, ROS2 and MoveIt for trajectory planning, teleoperation and imitation learning in both simulated and real-world applications.",
    tech: ["ROS2", "LeRobot", "MoveIt2", "Python", "Fusion 360", "Isaac Sim"],
    github: "https://github.com/openbot-giraffe",
    initials: "OG",
    videoSrc: "/videos/openbot-giraffe.mp4",
  },
  {
    title: "RRT Maze Solver",
    status: "Algorithm",
    tagline: "Rapidly-exploring Random Tree path planning in dynamic mazes",
    description:
      "Developed a Python-based maze solver using the RRT algorithm to navigate complex dynamic environments. Built a custom maze maker with specialized pathfinding logic capable of handling various maze configurations with high computational efficiency.",
    tech: ["Python", "RRT Algorithm", "NumPy", "Matplotlib"],
    github: "https://github.com/anant-rrt-maze",
    initials: "RM",
    videoSrc: "/videos/rrt-maze.mp4",
  },
  {
    title: "ML-based NMPC",
    status: "Research",
    tagline: "Machine learning inside a nonlinear model predictive controller",
    description:
      "Implemented TensorFlow for predictive analytics inside a Nonlinear Model Predictive Controller. Optimized flight performance through machine learning techniques validated in MATLAB simulations.",
    tech: ["TensorFlow", "MATLAB", "Python", "NumPy"],
    github: "https://github.com/anant-nmpc",
    initials: "NM",
    videoSrc: "/videos/nmpc.mp4",
  },
  {
    title: "SLAM Autonomous Bot",
    status: "Hardware",
    tagline: "Autonomous navigation with SLAM and path planning on ROS",
    description:
      "Designed an autonomous robot with path planning and SLAM capabilities using RpLidar. Implemented Hector SLAM with ROS for effective real-world navigation, showcasing advanced sensor fusion and autonomous decision making.",
    tech: ["ROS", "Hector SLAM", "RpLidar", "Nav2", "Python"],
    github: "https://github.com/anant-slam-bot",
    initials: "SB",
    videoSrc: "/videos/slam-bot.mp4",
  },
];

const easing = [0.16, 1, 0.3, 1] as const;

function ProjectCard({
  project,
  index,
  onExpand,
}: {
  project: Project;
  index: number;
  onExpand: () => void;
}) {
  return (
    <motion.div
      layoutId={`project-card-${index}`}
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay: 0.1 * index, duration: 0.6, ease: easing }}
      onClick={onExpand}
      className="group relative cursor-pointer overflow-hidden rounded-[15px] bg-surface-1 transition-all duration-500 hover:h-[520px] h-[420px]"
      style={{ transitionTimingFunction: "cubic-bezier(0.16, 1, 0.3, 1)" }}
    >
      {/* Video placeholder */}
      {/* <video src={project.videoSrc} autoPlay muted loop playsInline className="absolute inset-0 h-full w-full object-cover" /> */}
      <div className="absolute inset-0 flex items-center justify-center bg-surface-2">
        <span className="text-[32px] font-medium text-[#333333] animate-pulse">
          {project.initials}
        </span>
      </div>

      {/* Gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/85 to-transparent" />

      {/* Content layer */}
      <div className="absolute bottom-0 left-0 right-0 p-5 px-6">
        <span className="inline-block rounded-full border-[0.5px] border-white/15 bg-white/10 px-3 py-1 text-[11px] text-[#cccccc] backdrop-blur-[8px]">
          {project.status}
        </span>
        <h3 className="mt-2 text-[18px] font-medium leading-tight text-ink tracking-[-0.5px]">
          {project.title}
        </h3>
        <p className="mt-1 text-[13px] text-ink-muted">{project.tagline}</p>
      </div>

      {/* Arrow button */}
      <div className="absolute bottom-5 right-6 flex items-center gap-2">
        <span className="text-[12px] text-ink opacity-0 transition-opacity duration-300 group-hover:opacity-100">
          Explore
        </span>
        <div className="flex h-9 w-9 items-center justify-center rounded-full border-[0.5px] border-white/15 bg-white/10 backdrop-blur-[8px] transition-all duration-300 group-hover:rotate-45 group-hover:border-accent-blue">
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

function ExpandedOverlay({
  project,
  index,
  onClose,
}: {
  project: Project;
  index: number;
  onClose: () => void;
}) {
  return (
    <>
      {/* Backdrop */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.3 }}
        className="fixed inset-0 z-40 bg-[#0a0a0a]"
        onClick={onClose}
      />

      {/* Expanded card */}
      <motion.div
        layoutId={`project-card-${index}`}
        className="fixed inset-0 z-50 overflow-hidden"
        transition={{ duration: 0.5, ease: easing }}
      >
        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute right-6 top-6 z-10 flex h-10 w-10 items-center justify-center rounded-full bg-surface-2 transition-colors hover:bg-[#252525]"
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

        <div className="flex h-full flex-col md:flex-row">
          {/* Left: video */}
          <div className="relative h-[50vh] md:h-full md:w-[55%]">
            {/* <video src={project.videoSrc} autoPlay muted loop playsInline className="absolute inset-0 h-full w-full object-cover" /> */}
            <div className="absolute inset-0 flex items-center justify-center bg-surface-2">
              <span className="text-[48px] font-medium text-[#333333] animate-pulse">
                {project.initials}
              </span>
            </div>
            <div className="absolute inset-0 bg-gradient-to-t from-black/85 to-transparent md:bg-gradient-to-r md:from-transparent md:to-black/85" />
          </div>

          {/* Right: details */}
          <div className="flex-1 overflow-y-auto p-6 md:w-[45%] md:p-12">
            {/* Back link */}
            <button
              onClick={onClose}
              className="mb-8 flex items-center gap-2 text-[13px] text-ink-muted transition-colors hover:text-ink"
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
              <svg
                width="14"
                height="14"
                viewBox="0 0 24 24"
                fill="currentColor"
              >
                <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" />
              </svg>
              View on GitHub
            </a>
          </div>
        </div>
      </motion.div>
    </>
  );
}

export default function ProjectsSection() {
  const [expandedIndex, setExpandedIndex] = useState<number | null>(null);
  const scrollRef = useRef<HTMLDivElement>(null);
  const [activeDot, setActiveDot] = useState(0);

  useEffect(() => {
    const container = scrollRef.current;
    if (!container) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const index = Number(entry.target.getAttribute("data-index"));
            setActiveDot(index);
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
    <section className="relative w-full bg-canvas">
      <div className="mx-auto max-w-[1400px] px-6 py-16 md:px-[60px] md:py-[96px]">
        {/* Section label */}
        <motion.p
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, ease: easing }}
          className="mb-4 text-[11px] uppercase tracking-[0.18em] text-ink-muted"
        >
          03 — Projects
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

        {/* Desktop grid */}
        <div className="hidden w-full gap-3 md:grid md:grid-cols-2">
          {projects.map((project, i) => (
            <ProjectCard
              key={project.title}
              project={project}
              index={i}
              onExpand={() => setExpandedIndex(i)}
            />
          ))}
        </div>

        {/* Mobile carousel */}
        <div className="md:hidden">
          <div
            ref={scrollRef}
            className="flex gap-3 overflow-x-auto"
            style={{
              scrollSnapType: "x mandatory",
              scrollbarWidth: "none",
              WebkitOverflowScrolling: "touch",
            }}
          >
            {projects.map((project, i) => (
              <div
                key={project.title}
                data-index={i}
                className="h-[380px] min-w-[85vw]"
                style={{ scrollSnapAlign: "start" }}
              >
                <ProjectCard
                  project={project}
                  index={i}
                  onExpand={() => setExpandedIndex(i)}
                />
              </div>
            ))}
          </div>

          {/* Scroll dots */}
          <div className="mt-4 flex justify-center gap-2">
            {projects.map((_, i) => (
              <div
                key={i}
                className={`h-1.5 w-1.5 rounded-full transition-colors duration-300 ${
                  activeDot === i ? "bg-ink" : "bg-[#333333]"
                }`}
              />
            ))}
          </div>
        </div>
      </div>

      {/* Expanded overlay */}
      <AnimatePresence>
        {expandedIndex !== null && (
          <ExpandedOverlay
            project={projects[expandedIndex]}
            index={expandedIndex}
            onClose={() => setExpandedIndex(null)}
          />
        )}
      </AnimatePresence>
    </section>
  );
}
