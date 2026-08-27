"use client";

import { motion } from "framer-motion";
import { HeroBackground } from "./HeroBackground";
import CTALinks from "./CTALinks";
import SocialLinks from "./SocialLinks";

function HairlineGrid() {
  return (
    <div
      className="pointer-events-none absolute inset-0 z-0"
      style={{ opacity: 0.03 }}
    >
      <div
        className="h-full w-full"
        style={{
          backgroundImage: `
            linear-gradient(to right, #262626 1px, transparent 1px),
            linear-gradient(to bottom, #262626 1px, transparent 1px)
          `,
          backgroundSize: "calc(100% / 12) 80px",
        }}
      />
    </div>
  );
}

export default function HeroSection() {
  return (
    <section
      id="hero"
      className="relative min-h-screen w-full overflow-hidden bg-canvas"
    >
      <HeroBackground />
      <HairlineGrid />

      <div className="relative z-10 mx-auto grid min-h-screen max-w-[1400px] grid-cols-1 px-6 pb-12 pt-[48px] md:grid-cols-2 md:px-12 lg:grid-cols-12 lg:px-8">
        {/* Left column: greeting + name + bio */}
        <div className="flex flex-col justify-center gap-6 md:col-span-1 lg:col-span-5 lg:col-start-1">
          {/* Greeting */}
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{
              delay: 0.1,
              duration: 0.6,
              ease: [0.16, 1, 0.3, 1],
            }}
            className="text-[14px] tracking-[0.05em] text-ink-muted"
          >
            Hello there,
          </motion.p>

          {/* Display name */}
          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{
              delay: 0.3,
              duration: 0.8,
              ease: [0.16, 1, 0.3, 1],
            }}
            className="font-medium leading-none text-ink text-[clamp(52px,12vw,72px)] lg:text-[clamp(72px,10vw,110px)]"
            style={{ letterSpacing: "-5.5px" }}
          >
            I&apos;m Anant
            <motion.span
              initial={{ opacity: 0, scale: 0.5 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{
                delay: 0.6,
                duration: 0.4,
                ease: [0.16, 1, 0.3, 1],
              }}
              className="text-accent-blue"
            >
              *
            </motion.span>
          </motion.h1>

          {/* Role */}
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{
              delay: 0.5,
              duration: 0.6,
              ease: [0.16, 1, 0.3, 1],
            }}
            className="text-lg text-ink-muted"
          >
            Robotics Engineer &amp; Embodied AI Builder
          </motion.p>

          {/* Bio */}
          <motion.p
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{
              delay: 0.7,
              duration: 0.6,
              ease: [0.16, 1, 0.3, 1],
            }}
            className="max-w-[280px] text-[14px] leading-[1.4] text-ink-muted"
          >
            I build robots that learn. Specializing in manipulation, simulation
            and robot learning across ROS2, MuJoCo and MoveIt2. Open to
            freelance and full-time opportunities.
          </motion.p>
        </div>

        {/* Right column: CTA links */}
        <div className="flex flex-col justify-center md:col-span-1 md:mt-12 lg:col-span-4 lg:col-start-7 lg:mt-0">
          <CTALinks />
        </div>

        {/* Far right: vertical social links */}
        <div className="hidden lg:flex lg:col-span-1 lg:col-start-12 items-end justify-end pb-12">
          <SocialLinks />
        </div>
      </div>

      {/* Mobile social links (horizontal, no rotation) */}
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.8, duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
        className="relative z-10 flex gap-6 px-6 pb-8 lg:hidden md:px-12"
      >
        <a
          href="https://linkedin.com"
          target="_blank"
          rel="noopener noreferrer"
          className="text-[11px] tracking-[0.15em] text-ink-muted hover:text-ink transition-colors duration-300"
        >
          LINKEDIN
        </a>
        <a
          href="https://github.com"
          target="_blank"
          rel="noopener noreferrer"
          className="text-[11px] tracking-[0.15em] text-ink-muted hover:text-ink transition-colors duration-300"
        >
          GITHUB
        </a>
      </motion.div>
    </section>
  );
}
