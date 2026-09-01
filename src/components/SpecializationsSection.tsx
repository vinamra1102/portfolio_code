"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { DottedGlowBackground } from "@/components/ui/dotted-glow-background";

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

/** Each edge lights when either of the vertices it joins is hovered. */
const EDGES: { from: VertexPosition; to: VertexPosition; lit: string[] }[] = [
  { from: "top", to: "bottom-left", lit: ["lerobot", "ros2"] },
  { from: "top", to: "bottom-right", lit: ["lerobot", "moveit2"] },
  { from: "bottom-left", to: "bottom-right", lit: ["ros2", "moveit2"] },
];

export default function SpecializationsSection() {
  const [hoveredVertex, setHoveredVertex] = useState<string | null>(null);

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
            <filter
              id="glow-edge"
              x="-20%"
              y="-20%"
              width="140%"
              height="140%"
            >
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
            const lit = hoveredVertex !== null && edge.lit.includes(hoveredVertex);
            return (
              <line
                key={`${edge.from}-${edge.to}`}
                x1={a.x}
                y1={a.y}
                x2={b.x}
                y2={b.y}
                fill="none"
                stroke={
                  lit ? "rgba(0,153,255,0.9)" : "rgba(0,153,255,0.25)"
                }
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
              </motion.div>
            </div>
          );
        })}
      </div>
    </section>
  );
}
