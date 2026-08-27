"use client";

import { ShaderBackground } from "@/components/ShaderBackground";
import { useEffect, useRef, useState } from "react";

/** Cursor position the shader drifts back to when the pointer is away — top right. */
const REST = { x: 0.75, y: 0.25 };

/**
 * How far the rendered position moves toward the cursor each frame.
 *   0.02 = very dreamy, ultra slow follow
 *   0.03 = deliberate and cinematic — the warp bends slowly (current)
 *   0.04 = smooth and organic
 *   0.08 = responsive but still smooth
 *   0.15 = snappy, close to direct follow
 */
const LERP = 0.03;

/** Below this distance the follow has visually arrived, so the loop can idle. */
const SETTLED = 0.0005;

/**
 * Warp has no brightness uniform. `proportion` slides the pattern along the
 * colour ramp, so lifting it pushes more accent through — the same "dim at
 * rest, lifts on cursor enter" read the brightness 0.7 → 0.9 range asked for.
 */
const PROPORTION_REST = 0.4;
const PROPORTION_HOVER = 0.5;

/**
 * Warp's clock is `t = 0.0625 * u_time` (vs neuro-noise's `0.5 * u_time`), so
 * the cursor needs a much larger frame gain here to travel the same distance.
 */
const FRAME_GAIN = 8000;

const lerp = (a: number, b: number, t: number) => a + (b - a) * t;

export function HeroBackground() {
  const containerRef = useRef<HTMLDivElement>(null);
  const targetRef = useRef({ ...REST });
  const currentRef = useRef({ ...REST });
  const rafRef = useRef<number | null>(null);
  const [shaderPos, setShaderPos] = useState({ ...REST });
  const [proportion, setProportion] = useState(PROPORTION_REST);

  useEffect(() => {
    const el =
      containerRef.current?.closest("section") ??
      containerRef.current?.parentElement;
    if (!el) return;

    const animate = () => {
      const target = targetRef.current;
      const current = currentRef.current;
      current.x = lerp(current.x, target.x, LERP);
      current.y = lerp(current.y, target.y, LERP);
      setShaderPos({ ...current });

      // Park the loop once the drift has arrived — with speed=0 the shader is
      // otherwise static, so a permanent rAF would redraw every frame forever.
      const arrived =
        Math.abs(target.x - current.x) < SETTLED &&
        Math.abs(target.y - current.y) < SETTLED;
      rafRef.current = arrived ? null : requestAnimationFrame(animate);
    };

    const start = () => {
      rafRef.current ??= requestAnimationFrame(animate);
    };

    const handleMove = (e: MouseEvent) => {
      const rect = el.getBoundingClientRect();
      targetRef.current = {
        x: (e.clientX - rect.left) / rect.width,
        y: (e.clientY - rect.top) / rect.height,
      };
      setProportion(PROPORTION_HOVER);
      start();
    };

    const handleLeave = () => {
      targetRef.current = { ...REST };
      setProportion(PROPORTION_REST);
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
        // Warp takes a colour ramp, not back/front/highlight. Alternating dark
        // and lit stops keeps the canvas black dominant and lets the navy and
        // accent blue surface as bands — the same idiom the shipped presets use.
        colors={["#090909", "#0a1a2e", "#090909", "#0099ff"]}
        proportion={proportion}
        speed={0}
        // Warp has no mouse uniform either. `frame` is the animation clock in
        // ms, so the smoothed cursor drives the warp's evolution, and the
        // offsets slide the pattern toward the pointer.
        frame={(shaderPos.x + shaderPos.y) * FRAME_GAIN}
        offsetX={(shaderPos.x - 0.5) * 0.6}
        offsetY={(0.5 - shaderPos.y) * 0.6}
        scale={1.2}
        className="h-full w-full"
      />
      <div className="absolute inset-0 bg-gradient-to-t from-[#090909] via-[#090909]/50 to-transparent z-10" />
      <div className="absolute inset-0 bg-gradient-to-r from-[#090909] via-[#090909]/75 to-transparent z-10" />
    </div>
  );
}
