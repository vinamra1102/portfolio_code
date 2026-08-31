"use client";

import { ShaderBackground } from "@/components/ui/ShaderBackground";

export function HeroBackground() {
  return (
    <div className="absolute inset-0 z-0 overflow-hidden">
      <ShaderBackground className="h-full w-full" />
      <div
        className="absolute inset-0 z-10"
        style={{
          background:
            "linear-gradient(to right, #090909 0%, rgba(9,9,9,0.85) 35%, rgba(9,9,9,0.4) 65%, transparent 100%)",
        }}
      />
      <div
        className="absolute inset-0 z-10"
        style={{
          background:
            "linear-gradient(to top, #090909 0%, rgba(9,9,9,0.6) 30%, transparent 60%)",
        }}
      />
    </div>
  );
}
