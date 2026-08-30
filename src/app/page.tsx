import HeroSection from "@/components/HeroSection";
import SpecializationsSection from "@/components/SpecializationsSection";
import AboutSection from "@/components/AboutSection";
import ProjectsSection from "@/components/ProjectsSection";
import ContactSection from "@/components/ContactSection";
import Footer from "@/components/Footer";
import ScrollDotNav from "@/components/ScrollDotNav";

export default function Home() {
  return (
    <>
      <ScrollDotNav />
      <main>
        <HeroSection />
        <SpecializationsSection />
        <ProjectsSection />
        <AboutSection />
        <ContactSection />
        <Footer />
      </main>
    </>
  );
}
