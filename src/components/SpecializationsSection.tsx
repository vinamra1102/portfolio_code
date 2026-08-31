"use client";

import { Fragment, useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";

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

const specializationMeta: Record<
  SpecKey,
  { label: string; sublabel: string }
> = {
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
    projects: ["OpenBot Giraffe", "5-DOF Manipulation Stack"],
    x: 0,
    y: -220,
    rotate: 180,
    delay: 0,
  },
  {
    key: "ros2" as SpecKey,
    label: "ROS2",
    sublabel: "Robot Operating System",
    projects: ["MuJoCo-Gazebo RL Transfer", "RRT Maze Solver"],
    x: -200,
    y: 180,
    rotate: 48.01,
    delay: 0.2,
  },
  {
    key: "moveit2" as SpecKey,
    label: "MoveIt2",
    sublabel: "Motion Planning and Manipulation",
    projects: ["5-DOF Manipulation Stack", "OpenBot Giraffe"],
    x: 200,
    y: 180,
    rotate: -48.01,
    delay: 0.4,
  },
] as const;

const CHIP_STYLE = {
  background: "rgba(0, 153, 255, 0.06)",
  border: "0.5px solid rgba(0, 153, 255, 0.2)",
  borderRadius: 100,
  padding: "3px 10px",
  fontSize: 10,
  color: "rgba(0, 153, 255, 0.8)",
  letterSpacing: "0.08em",
} as const;

function ProjectChips({
  projects: names,
  delay,
}: {
  projects: readonly string[];
  delay: number;
}) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      whileInView={{ opacity: 1 }}
      viewport={{ once: false }}
      transition={{ delay: delay + 0.4, duration: 0.4, ease: EASE }}
      className="mt-2 flex flex-wrap justify-center gap-1"
    >
      {names.map((name) => (
        <span key={name} className="inline-flex" style={CHIP_STYLE}>
          {name}
        </span>
      ))}
    </motion.div>
  );
}

function ArmLabel({
  spec,
  size,
}: {
  spec: (typeof SPECIALIZATIONS)[number];
  size: "sm" | "lg";
}) {
  return (
    <>
      <span
        className={`mt-3 block whitespace-nowrap font-medium tracking-[-0.8px] text-ink ${
          size === "lg" ? "text-[20px]" : "text-[18px]"
        }`}
      >
        {spec.label}
      </span>
      <span className="mt-1 block whitespace-nowrap text-[11px] uppercase tracking-[0.12em] text-[#555555]">
        {spec.sublabel}
      </span>
    </>
  );
}

/**
 * The panel that sticks to the viewport while its wrapper in page.tsx scrolls
 * past. Content is always fully opaque: no scroll driven fade or scale.
 */
export default function SpecializationsSection() {
  const [activeSpec, setActiveSpec] = useState<SpecKey | null>(null);

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
                  className="pointer-events-none absolute left-1/2 top-1/2 hidden w-[260px] text-center md:block"
                  style={{
                    transform: `translate(-50%, -50%) translate(${spec.x}px, ${spec.y}px)`,
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
                    <ArmLabel spec={spec} size="lg" />
                  </motion.div>
                  <ProjectChips projects={spec.projects} delay={spec.delay} />
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
              >
                <ArmLabel spec={spec} size="sm" />
                <ProjectChips projects={spec.projects} delay={spec.delay} />
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
    </section>
  );
}
