"use client";

import { Fragment, useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";

const EASE = [0.16, 1, 0.3, 1] as const;

const HEX_CLIP =
  "polygon(50% 0%, 100% 25%, 100% 75%, 50% 100%, 0% 75%, 0% 25%)";

/**
 * `rotate` turns the arm line, which points straight down by default, toward
 * its label. CSS rotates clockwise, so a down vector becomes
 * (-sin, cos) and the angle is atan2(-x, y) of the label offset.
 */
const SPECIALIZATIONS = [
  {
    label: "LeRobot",
    sublabel: "Imitation Learning Pipeline",
    projects: ["OpenBot Giraffe", "5-DOF Manipulation Stack"],
    x: 0,
    y: -200,
    rotate: 180,
    delay: 0,
  },
  {
    label: "ROS2",
    sublabel: "Robot Operating System",
    projects: ["MuJoCo-Gazebo RL Transfer", "RRT Maze Solver"],
    x: -180,
    y: 160,
    rotate: 48.37,
    delay: 0.2,
  },
  {
    label: "MoveIt2",
    sublabel: "Motion Planning and Manipulation",
    projects: ["5-DOF Manipulation Stack", "OpenBot Giraffe"],
    x: 180,
    y: 160,
    rotate: -48.37,
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

export default function SpecializationsSection() {
  const sectionRef = useRef<HTMLElement>(null);
  // 0 when the section's top hits the bottom of the viewport, 1 when its
  // bottom leaves the top: fade in on entry, hold, fade out on exit.
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start end", "end start"],
  });
  const opacity = useTransform(
    scrollYProgress,
    [0, 0.2, 0.75, 1],
    [0, 1, 1, 0],
  );
  const scale = useTransform(
    scrollYProgress,
    [0, 0.2, 0.75, 1],
    [0.96, 1, 1, 0.96],
  );

  return (
    <section
      ref={sectionRef}
      id="specializations"
      className="relative flex min-h-screen w-full items-center justify-center overflow-hidden bg-canvas"
    >
      {/* Vignette */}
      <div
        aria-hidden="true"
        className="absolute inset-0 z-0"
        style={{
          background:
            "radial-gradient(ellipse at center, transparent 20%, rgba(9,9,9,0.6) 60%, rgba(9,9,9,0.95) 100%)",
        }}
      />

      {/* Section label */}
      <motion.p
        style={{ opacity }}
        className="absolute left-6 top-12 z-[2] text-[11px] uppercase tracking-[0.18em] text-[#444444] md:left-[60px]"
      >
        02 — Specializations
      </motion.p>

      <motion.div
        style={{ opacity, scale }}
        className="relative z-[2] flex flex-col items-center gap-10 md:gap-0"
      >
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
                  transition={{ delay: spec.delay, duration: 0.8, ease: EASE }}
                  style={{
                    width: 1,
                    height: 120,
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
      </motion.div>

      {/* Bottom hint */}
      <motion.p
        style={{ opacity }}
        animate={{ y: [0, 6, 0] }}
        transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
        className="absolute bottom-8 left-1/2 z-[2] hidden -translate-x-1/2 whitespace-nowrap text-[11px] uppercase tracking-[0.14em] text-[#333333] md:block"
      >
        Scroll to explore projects
      </motion.p>
    </section>
  );
}
