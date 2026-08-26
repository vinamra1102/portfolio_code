import HeroSection from "@/components/HeroSection";
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
        <ProjectsSection />
        <AboutSection />
        <ContactSection />
        <Footer />
      </main>
    </>
  );
}
