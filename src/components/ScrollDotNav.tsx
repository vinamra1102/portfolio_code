"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";

const sections = [
  { id: "hero", label: "Hero" },
  { id: "specializations", label: "Focus" },
  { id: "projects", label: "Projects" },
  { id: "about", label: "About" },
  { id: "contact", label: "Contact" },
];

export default function ScrollDotNav() {
  const [activeId, setActiveId] = useState("hero");
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        let bestEntry: IntersectionObserverEntry | null = null;
        for (const entry of entries) {
          if (entry.isIntersecting) {
            if (!bestEntry || entry.intersectionRatio > bestEntry.intersectionRatio) {
              bestEntry = entry;
            }
          }
        }
        if (bestEntry) {
          setActiveId(bestEntry.target.id);
        }
      },
      { threshold: 0.5 }
    );

    for (const section of sections) {
      const el = document.getElementById(section.id);
      if (el) observer.observe(el);
    }

    return () => observer.disconnect();
  }, []);

  const handleClick = (id: string) => {
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
  };

  const getDotColor = (sectionId: string, index: number) => {
    if (hoveredIndex === index) return "#999999";
    if (activeId === sectionId) return "#ffffff";
    return "#444444";
  };

  return (
    <nav
      aria-label="Section navigation"
      className="pointer-events-none fixed right-8 top-1/2 z-50 hidden -translate-y-1/2 flex-col items-center gap-4 md:flex"
    >
      {sections.map((section, index) => (
        <motion.button
          key={section.id}
          initial={{ opacity: 0, x: 10 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{
            delay: index * 0.1,
            duration: 0.4,
            ease: [0.16, 1, 0.3, 1],
          }}
          onClick={() => handleClick(section.id)}
          onMouseEnter={() => setHoveredIndex(index)}
          onMouseLeave={() => setHoveredIndex(null)}
          className="pointer-events-auto relative flex h-8 w-8 items-center justify-center"
          aria-label={`Go to ${section.label}`}
        >
          <span
            className="pointer-events-none absolute right-full whitespace-nowrap text-[11px] uppercase tracking-[0.12em] text-[#999999] transition-opacity duration-200"
            style={{
              marginRight: 10,
              opacity: hoveredIndex === index ? 1 : 0,
            }}
          >
            {section.label}
          </span>
          <span
            className="block h-[6px] w-[6px] rounded-full"
            style={{
              backgroundColor: getDotColor(section.id, index),
              transition: "all 0.3s cubic-bezier(0.16, 1, 0.3, 1)",
            }}
          />
        </motion.button>
      ))}
    </nav>
  );
}
