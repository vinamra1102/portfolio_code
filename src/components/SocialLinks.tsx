"use client";

import { motion } from "framer-motion";

const links = [
  { label: "LINKEDIN", href: "https://linkedin.com" },
  { label: "GITHUB", href: "https://github.com" },
];

export default function SocialLinks() {
  return (
    <div className="hidden lg:flex flex-col items-center gap-8">
      {links.map((link, i) => (
        <motion.a
          key={link.label}
          href={link.href}
          target="_blank"
          rel="noopener noreferrer"
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{
            delay: 0.8 + i * 0.1,
            duration: 0.6,
            ease: [0.16, 1, 0.3, 1],
          }}
          className="text-[11px] tracking-[0.15em] text-ink-muted hover:text-ink transition-colors duration-300"
          style={{ writingMode: "vertical-rl", transform: "rotate(180deg)" }}
        >
          {link.label}
        </motion.a>
      ))}
    </div>
  );
}
