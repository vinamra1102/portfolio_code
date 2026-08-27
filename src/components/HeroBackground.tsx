"use client";

import { ShaderBackground } from "@/components/ShaderBackground";
import { useEffect, useRef, useState } from "react";

/** Cursor position the shader drifts back to when the pointer is away — top right. */
const REST = { x: 0.75, y: 0.25 };

/**
 * How far the rendered position moves toward the cursor each frame.
 *   0.02 = very dreamy, ultra slow follow
 *   0.04 = smooth and organic (recommended)
 *   0.08 = responsive but still smooth
 *   0.15 = snappy, close to direct follow
 */
const LERP = 0.04;

/** Below this distance the follow has visually arrived, so the loop can idle. */
const SETTLED = 0.0005;

const lerp = (a: number, b: number, t: number) => a + (b - a) * t;

export function HeroBackground() {
  const containerRef = useRef<HTMLDivElement>(null);
  const targetRef = useRef({ ...REST });
  const currentRef = useRef({ ...REST });
  const rafRef = useRef<number | null>(null);
  const [shaderPos, setShaderPos] = useState({ ...REST });
  const [brightness, setBrightness] = useState(0.7);

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
      setBrightness(0.9);
      start();
    };

    const handleLeave = () => {
      targetRef.current = { ...REST };
      setBrightness(0.7);
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
        variant="neuro-noise"
        colorBack="#090909"
        colorMid="#0a1628"
        colorFront="#0099ff"
        brightness={brightness}
        speed={0}
        // NeuroNoise has no mouse uniform. `frame` is the animation clock in ms,
        // so driving it from the smoothed position morphs the network as the
        // cursor drifts, and the offsets slide the pattern toward the pointer.
        frame={(shaderPos.x + shaderPos.y) * 2000}
        offsetX={(shaderPos.x - 0.5) * 0.6}
        offsetY={(0.5 - shaderPos.y) * 0.6}
        className="h-full w-full"
      />
      <div className="absolute inset-0 bg-gradient-to-t from-[#090909] via-[#090909]/40 to-transparent z-10" />
      <div className="absolute inset-0 bg-gradient-to-r from-[#090909] via-[#090909]/70 to-transparent z-10" />
    </div>
  );
}
