"use client";

import { useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import HeroSection from "@/components/HeroSection";
import SpecializationsSection from "@/components/SpecializationsSection";
import AboutSection from "@/components/AboutSection";
import ProjectsSection from "@/components/ProjectsSection";
import ContactSection from "@/components/ContactSection";
import Footer from "@/components/Footer";
import ScrollDotNav from "@/components/ScrollDotNav";

export default function Home() {
  const heroRef = useRef<HTMLDivElement>(null);
  const specializationsRef = useRef<HTMLDivElement>(null);

  // Hero shrinks into a rounded card over the back half of its own scroll
  // range, so the specializations panel appears to rise over a receding page.
  const { scrollYProgress: heroProgress } = useScroll({
    target: heroRef,
    offset: ["start start", "end end"],
  });
  const heroScale = useTransform(heroProgress, [0.5, 1], [1, 0.88]);
  const heroOpacity = useTransform(heroProgress, [0.5, 1], [1, 0.6]);
  const heroRadius = useTransform(heroProgress, [0.5, 1], ["0px", "20px"]);

  const { scrollYProgress: specializationsProgress } = useScroll({
    target: specializationsRef,
    offset: ["start start", "end end"],
  });

  return (
    <>
      <ScrollDotNav />
      <main>
        <div ref={heroRef} className="relative z-[1] h-[150vh] md:h-[200vh]">
          <motion.div
            style={{
              scale: heroScale,
              opacity: heroOpacity,
              borderRadius: heroRadius,
              willChange: "transform",
            }}
            className="sticky top-0 h-screen w-full overflow-hidden"
          >
            <HeroSection />
          </motion.div>
        </div>

        <div
          ref={specializationsRef}
          className="relative z-[2] h-[200vh] md:h-[300vh]"
        >
          <SpecializationsSection
            scrollYProgress={specializationsProgress}
            containerRef={specializationsRef}
          />
        </div>

        <ProjectsSection />
        <AboutSection />
        <ContactSection />
        <Footer />
      </main>
    </>
  );
}
