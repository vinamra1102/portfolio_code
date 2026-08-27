"use client";

import { ShaderBackground } from "@/components/ShaderBackground";
import { useEffect, useRef, useState } from "react";

/** Where the fluid rests when the cursor is absent — centre right of the hero. */
const REST = { x: 0.6, y: 0.4 };

/** Crawl toward the target. 0.025 ≈ 80% of the gap closed over ~60 frames. */
const LERP = 0.025;

/** Velocity bleeds off like drag through liquid rather than stopping dead. */
const VELOCITY_DAMPING = 0.92;

/** How far the fluid overshoots in the direction of travel. */
const MOMENTUM = 0.3;

/**
 * Warp has no brightness uniform. `proportion` slides the pattern along the
 * colour ramp, so lifting it pushes more light through — the same read the
 * brightness 0.65 → 0.85 range asked for. Eased rather than stepped, so it
 * shifts like light through water instead of toggling.
 */
const PROPORTION_REST = 0.38;
const PROPORTION_HOVER = 0.48;
/** ~1200ms to close the lift at 60fps, matching the requested duration. */
const PROPORTION_LERP = 0.04;

/** Small enough that the cursor barely disturbs the fluid. */
const OFFSET_GAIN = 0.4;

const lerp = (a: number, b: number, t: number) => a + (b - a) * t;

export function HeroBackground() {
  const containerRef = useRef<HTMLDivElement>(null);
  const targetRef = useRef({ ...REST });
  const currentRef = useRef({ ...REST });
  const velocityRef = useRef({ x: 0, y: 0 });
  const proportionTargetRef = useRef(PROPORTION_REST);
  const proportionRef = useRef(PROPORTION_REST);
  const rafRef = useRef<number | null>(null);
  const [shaderPos, setShaderPos] = useState({ ...REST });
  const [proportion, setProportion] = useState(PROPORTION_REST);
  const [speed, setSpeed] = useState(0.08);

  useEffect(() => {
    const el =
      containerRef.current?.closest("section") ??
      containerRef.current?.parentElement;
    if (!el) return;

    let lastX = REST.x;
    let lastY = REST.y;

    const animate = () => {
      const velocity = velocityRef.current;
      velocity.x *= VELOCITY_DAMPING;
      velocity.y *= VELOCITY_DAMPING;

      const target = targetRef.current;
      const current = currentRef.current;
      current.x = lerp(current.x, target.x + velocity.x * MOMENTUM, LERP);
      current.y = lerp(current.y, target.y + velocity.y * MOMENTUM, LERP);
      setShaderPos({ x: current.x, y: current.y });

      proportionRef.current = lerp(
        proportionRef.current,
        proportionTargetRef.current,
        PROPORTION_LERP,
      );
      setProportion(proportionRef.current);

      // The shader animates itself via `speed`; this loop only pushes cursor
      // state, so it can idle once the drift, momentum and lift have all
      // arrived rather than re-rendering React 60x a second forever.
      const settled =
        Math.abs(target.x - current.x) < 0.0005 &&
        Math.abs(target.y - current.y) < 0.0005 &&
        Math.abs(velocity.x) < 0.0002 &&
        Math.abs(velocity.y) < 0.0002 &&
        Math.abs(proportionTargetRef.current - proportionRef.current) < 0.0005;
      rafRef.current = settled ? null : requestAnimationFrame(animate);
    };

    const start = () => {
      rafRef.current ??= requestAnimationFrame(animate);
    };

    const handleMove = (e: MouseEvent) => {
      const rect = el.getBoundingClientRect();
      const nx = (e.clientX - rect.left) / rect.width;
      const ny = (e.clientY - rect.top) / rect.height;

      velocityRef.current = { x: nx - lastX, y: ny - lastY };
      lastX = nx;
      lastY = ny;

      targetRef.current = { x: nx, y: ny };
      proportionTargetRef.current = PROPORTION_HOVER;
      setSpeed(0.12);
      start();
    };

    const handleLeave = () => {
      targetRef.current = { ...REST };
      proportionTargetRef.current = PROPORTION_REST;
      setSpeed(0.06);
      start();
    };

    el.addEventListener("mousemove", handleMove);
    el.addEventListener("mouseleave", handleLeave);

    return () => {
      el.removeEventListener("mousemove", handleMove);
      el.removeEventListener("mouseleave", handleLeave);
      if (rafRef.current !== null) cancelAnimationFrame(rafRef.current);
      rafRef.current = null;
    };
  }, []);

  return (
    <div ref={containerRef} className="absolute inset-0 z-0 overflow-hidden">
      <ShaderBackground
        variant="warp"
        // Warp takes a colour ramp, not back/front/highlight. Alternating the
        // canvas black with the deep navy and the deeper water blue keeps the
        // black dominant and lets the blues surface as slow bands.
        colors={["#090909", "#060d1a", "#090909", "#0055cc"]}
        proportion={proportion}
        // Fluid, not circuitry: max softness blurs every edge, large low-detail
        // cells read as oil blobs rather than a pattern, and the heavier
        // distortion against a gentler swirl bends them viscously instead of
        // whipping them around.
        softness={1}
        shape="checks"
        shapeScale={0.06}
        distortion={0.4}
        swirl={0.45}
        swirlIterations={12}
        // The cursor only displaces the field — with speed > 0 the shader owns
        // its own clock, so driving `frame` here would fight it every move.
        offsetX={(shaderPos.x - 0.5) * OFFSET_GAIN}
        offsetY={(0.5 - shaderPos.y) * OFFSET_GAIN}
        speed={speed}
        scale={1.4}
        className="h-full w-full"
      />
      <div
        className="absolute inset-0 z-10"
        style={{
          background:
            "radial-gradient(ellipse at 30% 50%, transparent 20%, #090909 75%)",
        }}
      />
      <div className="absolute inset-0 bg-gradient-to-t from-[#090909] via-[#090909]/30 to-transparent z-10" />
    </div>
  );
}
