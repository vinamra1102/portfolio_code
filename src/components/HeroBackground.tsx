"use client";

import { ShaderBackground } from "@/components/ShaderBackground";
import { useEffect, useRef, useState } from "react";

/** Cursor position the shader parks at when the pointer is away — top right. */
const REST = { x: 0.8, y: 0.2 };

export function HeroBackground() {
  const containerRef = useRef<HTMLDivElement>(null);
  const [mouse, setMouse] = useState(REST);
  const [isHovering, setIsHovering] = useState(false);

  useEffect(() => {
    const el =
      containerRef.current?.closest("section") ??
      containerRef.current?.parentElement;
    if (!el) return;

    const handleMove = (e: MouseEvent) => {
      const rect = el.getBoundingClientRect();
      setMouse({
        x: (e.clientX - rect.left) / rect.width,
        y: (e.clientY - rect.top) / rect.height,
      });
      setIsHovering(true);
    };

    const handleLeave = () => {
      setIsHovering(false);
      setMouse(REST);
    };

    el.addEventListener("mousemove", handleMove);
    el.addEventListener("mouseleave", handleLeave);
    return () => {
      el.removeEventListener("mousemove", handleMove);
      el.removeEventListener("mouseleave", handleLeave);
    };
  }, []);

  return (
    <div ref={containerRef} className="absolute inset-0 z-0 overflow-hidden">
      <ShaderBackground
        variant="neuro-noise"
        colorBack="#090909"
        colorMid="#0a1628"
        colorFront="#0099ff"
        brightness={isHovering ? 1.3 : 0.85}
        speed={0}
        // NeuroNoise has no mouse uniform. `frame` is the animation clock in ms,
        // so driving it from the cursor makes the network morph on move instead
        // of on a timer, and the offsets drift the pattern toward the pointer.
        frame={(mouse.x + mouse.y) * 2000}
        offsetX={(mouse.x - 0.5) * 0.6}
        offsetY={(0.5 - mouse.y) * 0.6}
        className="h-full w-full"
      />
      <div className="absolute inset-0 bg-gradient-to-t from-[#090909] via-transparent to-transparent z-10" />
      <div className="absolute inset-0 bg-gradient-to-r from-[#090909] via-[#090909]/60 to-transparent z-10" />
    </div>
  );
}
