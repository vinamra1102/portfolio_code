"use client";

import { ShaderBackground } from "@/components/ShaderBackground";

export function HeroBackground() {
  return (
    <div className="absolute inset-0 z-0 overflow-hidden">
      <ShaderBackground
        variant="neuro-noise"
        colorBack="#090909"
        colorMid="#0a1628"
        colorFront="#0099ff"
        brightness={1.1}
        speed={0.6}
        className="h-full w-full"
      />
      <div className="absolute inset-0 bg-gradient-to-t from-[#090909] via-transparent to-transparent z-10" />
      <div className="absolute inset-0 bg-gradient-to-r from-[#090909] via-[#090909]/60 to-transparent z-10" />
    </div>
  );
}
