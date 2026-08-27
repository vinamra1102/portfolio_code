"use client";
import {
  NeuroNoise,
  type NeuroNoiseProps,
  DotGrid,
  type DotGridProps,
  GodRays,
  type GodRaysProps,
  PerlinNoise,
  type PerlinNoiseProps,
  Warp,
  type WarpProps,
} from "@paper-design/shaders-react";
import { useReducedMotion } from "framer-motion";
import type { ComponentType } from "react";
import { cn } from "@/lib/utils";

type ShaderVariantProps = {
  "neuro-noise": NeuroNoiseProps;
  "dot-grid": DotGridProps;
  "god-rays": GodRaysProps;
  "perlin-noise": PerlinNoiseProps;
  warp: WarpProps;
};

export type ShaderBackgroundVariant = keyof ShaderVariantProps;
export type ShaderBackgroundProps = {
  [K in ShaderBackgroundVariant]: { variant: K } & ShaderVariantProps[K];
}[ShaderBackgroundVariant];

const VARIANT_COMPONENTS: {
  [K in ShaderBackgroundVariant]: ComponentType<ShaderVariantProps[K]>;
} = {
  "neuro-noise": NeuroNoise,
  "dot-grid": DotGrid,
  "god-rays": GodRays,
  "perlin-noise": PerlinNoise,
  warp: Warp,
};

export function ShaderBackground({
  variant,
  className,
  ...rest
}: ShaderBackgroundProps) {
  const reducedMotion = useReducedMotion();
  const Shader = VARIANT_COMPONENTS[variant] as ComponentType<
    Record<string, unknown>
  >;
  const props = rest as Record<string, unknown>;
  const speedProps = reducedMotion && "speed" in props ? { speed: 0 } : {};
  return (
    <Shader
      {...props}
      {...speedProps}
      className={cn("h-full w-full", className)}
    />
  );
}
