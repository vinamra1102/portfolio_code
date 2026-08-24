"use client";

import { motion } from "framer-motion";

const links = [
  { icon: "📄", label: "If you want my resume **", href: "#" },
  { icon: "💬", label: "Or have a chat", href: "#contact" },
];

export default function CTALinks() {
  return (
    <div className="flex flex-col gap-6">
      {links.map((link, i) => (
        <motion.a
          key={link.label}
          href={link.href}
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{
            delay: 0.7 + i * 0.1,
            duration: 0.6,
            ease: [0.16, 1, 0.3, 1],
          }}
          className="group text-sm text-ink-muted hover:text-ink transition-colors duration-300"
        >
          <span className="mr-2 inline-block text-base">{link.icon}</span>
          {link.label}
        </motion.a>
      ))}

      <div className="mt-4 flex flex-col gap-2">
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{
            delay: 0.9,
            duration: 0.6,
            ease: [0.16, 1, 0.3, 1],
          }}
          className="text-[12px] text-ink-faint"
        >
          * Robotics Engineer specializing in LeRobot, ROS2 and MoveIt2.
        </motion.p>
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{
            delay: 1.0,
            duration: 0.6,
            ease: [0.16, 1, 0.3, 1],
          }}
          className="text-[12px] text-ink-faint"
        >
          ** Resume available on request. I don&apos;t bite.
        </motion.p>
      </div>
    </div>
  );
}
