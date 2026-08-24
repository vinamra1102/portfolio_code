"use client";

import { useEffect, useState } from "react";

const NAV_HEIGHT = 56;

const sections = [
  { id: "about", label: "About" },
  { id: "projects", label: "Projects" },
  { id: "contact", label: "Contact" },
];

const allIds = ["hero", ...sections.map((s) => s.id)];

export default function Nav() {
  const [activeId, setActiveId] = useState("hero");

  useEffect(() => {
    let frame = 0;

    // The active section is the last one whose top has scrolled under the bar.
    const compute = () => {
      frame = 0;
      let current = allIds[0];
      for (const id of allIds) {
        const el = document.getElementById(id);
        if (el && el.getBoundingClientRect().top <= NAV_HEIGHT + 8) {
          current = id;
        }
      }
      // Anchor to the final section once the page bottom is reached, in case a
      // short viewport never scrolls it under the bar.
      if (
        window.innerHeight + window.scrollY >=
        document.documentElement.scrollHeight - 2
      ) {
        current = allIds[allIds.length - 1];
      }
      setActiveId(current);
    };

    const schedule = () => {
      if (frame) return;
      frame = requestAnimationFrame(compute);
    };

    // The observer both seeds the initial value (its first callback fires on
    // observe) and catches section crossings; the scroll listener keeps the
    // highlight smooth in between.
    const observer = new IntersectionObserver(compute, {
      rootMargin: `-${NAV_HEIGHT}px 0px 0px 0px`,
      threshold: [0, 0.25, 0.5, 0.75, 1],
    });
    for (const id of allIds) {
      const el = document.getElementById(id);
      if (el) observer.observe(el);
    }

    window.addEventListener("scroll", schedule, { passive: true });
    window.addEventListener("resize", schedule, { passive: true });

    return () => {
      if (frame) cancelAnimationFrame(frame);
      observer.disconnect();
      window.removeEventListener("scroll", schedule);
      window.removeEventListener("resize", schedule);
    };
  }, []);

  return (
    <nav
      aria-label="Primary"
      className="fixed inset-x-0 top-0 z-50 border-b-[0.5px] border-[#1a1a1a]"
      style={{
        height: `${NAV_HEIGHT}px`,
        backgroundColor: "rgba(9, 9, 9, 0.8)",
        backdropFilter: "blur(12px)",
        WebkitBackdropFilter: "blur(12px)",
      }}
    >
      <div className="mx-auto flex h-full max-w-[1400px] items-center justify-between px-6 md:px-[60px]">
        <a
          href="#hero"
          aria-label="Back to top"
          className="text-[14px] font-medium tracking-[-0.2px] text-[#ffffff] transition-opacity duration-200 hover:opacity-70"
        >
          AP
        </a>

        <div className="flex items-center gap-6 md:gap-8">
          {sections.map((section) => (
            <a
              key={section.id}
              href={`#${section.id}`}
              aria-current={activeId === section.id ? "true" : undefined}
              className="text-[13px] transition-colors duration-200 hover:text-[#ffffff]"
              style={{
                color: activeId === section.id ? "#ffffff" : "#999999",
              }}
            >
              {section.label}
            </a>
          ))}
        </div>
      </div>
    </nav>
  );
}
