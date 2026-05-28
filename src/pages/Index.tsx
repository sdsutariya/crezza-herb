import Navbar from "@/components/Navbar";
import HeroSection from "@/components/HeroSection";
import BenefitsSection from "@/components/BenefitsSection";
import ResultsSection from "@/components/ResultsSection";
import HerbariumSection from "@/components/HerbariumSection";
import ProcessSection from "@/components/ProcessSection";
import TestimonialsSection from "@/components/TestimonialsSection";
import CTABanner from "@/components/CTABanner";
import OrderSection from "@/components/OrderSection";
import Footer from "@/components/Footer";
import SEO from "@/components/SEO";
import { SITE_URL } from "@/lib/seo";

const homeStructuredData = [
  {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: "CrezzaHerb",
    url: SITE_URL,
    logo: `${SITE_URL}/og-image.png`,
    contactPoint: {
      "@type": "ContactPoint",
      contactType: "customer support",
      email: "support@crezzaherb.com",
      areaServed: "IN",
    },
  },
  {
    "@context": "https://schema.org",
    "@type": "Product",
    name: "CrezzaHerb Herbal Hair Oil",
    image: `${SITE_URL}/og-image.png`,
    description:
      "Ayurvedic herbal hair oil made with slow-infused botanicals and cold-pressed oils to support stronger, healthier-looking hair.",
    brand: {
      "@type": "Brand",
      name: "CrezzaHerb",
    },
    offers: {
      "@type": "Offer",
      price: "399",
      priceCurrency: "INR",
      availability: "https://schema.org/InStock",
      url: `${SITE_URL}/#order`,
    },
    aggregateRating: {
      "@type": "AggregateRating",
      ratingValue: "4.9",
      reviewCount: "2847",
    },
  },
];

const Index = () => {
  return (
    <div className="min-h-screen bg-background">
      <SEO
        title="CrezzaHerb Ayurvedic Herbal Hair Oil for Hair Fall & Growth"
        description="Shop CrezzaHerb Herbal Hair Oil, a 14-day slow-infused Ayurvedic oil with natural botanicals for hair fall control, scalp nourishment, stronger roots, and healthier-looking hair."
        keywords={[
          "CrezzaHerb",
          "CrezzaHerb hair oil",
          "Ayurvedic hair oil",
          "herbal hair oil",
          "hair fall control oil",
          "natural hair growth oil",
          "chemical free hair oil",
        ]}
        structuredData={homeStructuredData}
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
      <Footer />
    </div>
  );
};

export default Index;
