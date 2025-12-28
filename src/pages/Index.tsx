import Navbar from "@/components/Navbar";
import HeroSection from "@/components/HeroSection";
import CategoriesSection from "@/components/CategoriesSection";
import HowItWorksSection from "@/components/HowItWorksSection";
import SeveritySection from "@/components/SeveritySection";
import BulletinBoard from "@/components/BulletinBoard";
import FeaturesGrid from "@/components/FeaturesGrid";
import ResolutionTracking from "@/components/ResolutionTracking";
import CTASection from "@/components/CTASection";
import Footer from "@/components/Footer";

const Index = () => {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main>
        <HeroSection />
        <CategoriesSection />
        <section id="how-it-works">
          <HowItWorksSection />
        </section>
        <SeveritySection />
        <section id="bulletin">
          <BulletinBoard />
        </section>
        <section id="features">
          <FeaturesGrid />
        </section>
        <section id="authorities">
          <ResolutionTracking />
        </section>
        <CTASection />
      </main>
      <Footer />
    </div>
  );
};

export default Index;
