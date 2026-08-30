"use client";

import { useRef } from "react";
import { useScroll } from "framer-motion";
import HeroSection from "@/components/HeroSection";
import SpecializationsSection from "@/components/SpecializationsSection";
import AboutSection from "@/components/AboutSection";
import ProjectsSection from "@/components/ProjectsSection";
import ContactSection from "@/components/ContactSection";
import Footer from "@/components/Footer";
import ScrollDotNav from "@/components/ScrollDotNav";

export default function Home() {
  // The tall wrapper owns the scroll range for the sticky specializations
  // panel: progress runs 0 to 1 as the wrapper travels past the viewport top.
  const specializationsRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: specializationsRef,
    offset: ["start start", "end end"],
  });

  return (
    <>
      <ScrollDotNav />
      <main>
        <HeroSection />
        <div
          ref={specializationsRef}
          className="relative h-[200vh] md:h-[300vh]"
        >
          <SpecializationsSection scrollYProgress={scrollYProgress} />
        </div>
        <ProjectsSection />
        <AboutSection />
        <ContactSection />
        <Footer />
      </main>
    </>
  );
}
