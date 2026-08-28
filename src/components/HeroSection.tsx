"use client";

import { motion } from "framer-motion";
import { HeroBackground } from "./HeroBackground";

const EASE = [0.16, 1, 0.3, 1] as const;

const SOCIALS = [
  { label: "LinkedIn", href: "https://linkedin.com" },
  { label: "GitHub", href: "https://github.com" },
];

function ResumeIcon() {
  return (
    <svg
      width="16"
      height="16"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      aria-hidden="true"
    >
      <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
      <polyline points="14 2 14 8 20 8" />
      <line x1="16" y1="13" x2="8" y2="13" />
      <line x1="16" y1="17" x2="8" y2="17" />
    </svg>
  );
}

function ChatIcon() {
  return (
    <svg
      width="16"
      height="16"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      aria-hidden="true"
    >
      <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
    </svg>
  );
}

/** Graph-paper hairlines, behind every piece of content. */
function GridOverlay() {
  return (
    <div
      aria-hidden="true"
      className="pointer-events-none absolute inset-0 z-[1]"
      style={{
        backgroundImage: `
          linear-gradient(rgba(255,255,255,0.025) 1px, transparent 1px),
          linear-gradient(90deg, rgba(255,255,255,0.025) 1px, transparent 1px)
        `,
        backgroundSize: "120px 120px",
      }}
    />
  );
}

export default function HeroSection() {
  return (
    <section
      id="hero"
      className="relative min-h-screen w-full overflow-hidden bg-canvas"
    >
      <HeroBackground />
      <GridOverlay />

      <div className="relative z-[2] mx-auto grid min-h-screen max-w-[1400px] grid-cols-1 gap-y-14 px-6 py-24 md:grid-cols-12 md:gap-x-6 md:gap-y-0 md:px-12 md:py-0 md:[grid-template-rows:repeat(10,minmax(0,1fr))]">
        {/* Left: greeting, name, role, bio */}
        <div className="md:col-span-6 md:col-start-1 md:row-start-4 md:row-end-10">
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.1, duration: 0.6, ease: EASE }}
            className="mb-2 text-[16px] font-normal tracking-[0.01em] text-ink-muted"
          >
            Hello there,
          </motion.p>

          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.25, duration: 0.8, ease: EASE }}
            className="mb-6 text-[clamp(96px,13vw,160px)] font-bold leading-[0.9] tracking-[-7px] text-ink"
          >
            I&apos;m Anant
            <motion.span
              initial={{ opacity: 0, scale: 0.5 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.5, duration: 0.4, ease: EASE }}
              className="inline-block font-bold text-accent-blue"
            >
              *
            </motion.span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.6, duration: 0.6, ease: EASE }}
            className="mb-12 text-[15px] font-normal tracking-[-0.2px] text-ink-faint"
          >
            Robotics Engineer and Embodied AI Builder
          </motion.p>

          <motion.p
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.7, duration: 0.6, ease: EASE }}
            className="max-w-[280px] text-[13px] leading-[1.6] text-[#555555]"
          >
            I build robots that learn. Specializing in manipulation, simulation
            and robot learning across ROS2, MuJoCo and MoveIt2. Open to
            freelance and full-time opportunities.
          </motion.p>
        </div>

        {/* Right: CTA links and footnotes */}
        <div className="md:col-span-4 md:col-start-7 md:row-start-1 md:row-end-11 md:self-center">
          <motion.a
            href="#contact"
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.8, duration: 0.6, ease: EASE }}
            className="mb-5 flex items-center gap-3 text-[14px] text-ink-muted transition-colors duration-200 hover:text-ink"
          >
            <ResumeIcon />
            <span>
              If you want my resume
              <sup className="ml-[2px] text-[10px] text-accent-blue">**</sup>
            </span>
          </motion.a>

          <motion.a
            href="#contact"
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.9, duration: 0.6, ease: EASE }}
            className="mb-5 flex items-center gap-3 text-[14px] text-ink-muted transition-colors duration-200 hover:text-ink"
          >
            <ChatIcon />
            <span>Or have a chat</span>
          </motion.a>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.0, duration: 0.6, ease: EASE }}
            className="mt-8 max-w-[260px] text-[11px] leading-[1.6] text-[#444444]"
          >
            <p>
              * Robotics Engineer specializing in LeRobot, ROS2 and MoveIt2.
            </p>
            <p>** Resume available on request. I don&apos;t bite.</p>
          </motion.div>
        </div>
      </div>

      {/* Far right: vertical social links */}
      <div className="absolute right-6 top-1/2 z-[2] hidden -translate-y-1/2 flex-col items-center gap-12 md:flex">
        {SOCIALS.map((social, i) => (
          <motion.a
            key={social.label}
            href={social.href}
            target="_blank"
            rel="noopener noreferrer"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 1.0 + i * 0.1, duration: 0.6, ease: EASE }}
            className="text-[10px] uppercase tracking-[0.2em] text-[#444444] transition-colors duration-200 hover:text-ink"
          >
            {/* The rotation lives on an inner span: Framer Motion owns the
                anchor's transform and would overwrite a static rotate(). */}
            <span
              className="inline-block"
              style={{ writingMode: "vertical-rl", transform: "rotate(180deg)" }}
            >
              {social.label}
            </span>
          </motion.a>
        ))}
      </div>
    </section>
  );
}
