import Navbar from "@/components/Navbar";
import HeroSection from "@/components/HeroSection";
import BenefitsSection from "@/components/BenefitsSection";
import ResultsSection from "@/components/ResultsSection";
import HerbariumSection from "@/components/HerbariumSection";
import ProcessSection from "@/components/ProcessSection";
import TestimonialsSection from "@/components/TestimonialsSection";
import CTABanner from "@/components/CTABanner";
import OrderSection from "@/components/OrderSection";
import FAQSection from "@/components/FAQSection";
import Footer from "@/components/Footer";
import SEO from "@/components/SEO";
import { buildHomeFAQPreviewSchema, buildHomeStructuredData } from "@/lib/seo";
import { faqs } from "@/data/faqs";

const Index = () => {
  return (
    <div className="min-h-screen bg-background">
      <SEO
        title="CrezzaHerb Ayurvedic Herbal Hair Oil for Hair Fall & Growth"
        description="Shop CrezzaHerb Herbal Hair Oil, a 14-day slow-infused Ayurvedic oil with bhringraj, amla, brahmi, and hibiscus for hair fall control, scalp nourishment, and stronger roots. ₹399, free shipping India."
        keywords={[
          "CrezzaHerb",
          "best ayurvedic hair oil India",
          "Ayurvedic hair oil",
          "herbal hair oil",
          "hair fall control oil",
          "bhringraj hair oil",
          "paraben free hair oil",
          "chemical free hair oil",
        ]}
        structuredData={[...buildHomeStructuredData(), buildHomeFAQPreviewSchema(faqs)]}
      />
      <Navbar />
      <HeroSection />
      <BenefitsSection />
      <ResultsSection />
      <HerbariumSection />
      <ProcessSection />
      <TestimonialsSection />
      <OrderSection />
      <CTABanner />
      <FAQSection limit={5} showViewAll />
      <Footer />
    </div>
  );
};

export default Index;
