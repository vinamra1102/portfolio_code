import { DottedGlowBackground } from "@/components/ui/dotted-glow-background";

export default function Footer() {
  return (
    <footer className="relative w-full overflow-hidden border-t-[0.5px] border-[#1a1a1a] bg-canvas px-6 py-8 md:px-[60px]">
      <DottedGlowBackground
        className="pointer-events-none absolute inset-0 z-0 mask-radial-to-60-bottom-right"
        opacity={0.35}
        gap={18}
        radius={1.0}
        colorLightVar="--color-neutral-500"
        glowColorLightVar="--color-neutral-600"
        colorDarkVar="--color-neutral-700"
        glowColorDarkVar="--color-sky-600"
        backgroundOpacity={0}
        speedMin={0.1}
        speedMax={0.4}
        speedScale={0.4}
      />
      <div className="relative z-[1] flex flex-col items-center gap-2 md:flex-row md:justify-between">
        <p className="text-[13px] text-[#555555]">Anant Pandey</p>
        <p className="text-[12px] text-[#333333]">
          Built with Next.js and Framer Motion
        </p>
        <p className="text-[13px] text-[#555555]">2026</p>
      </div>
    </footer>
  );
}
