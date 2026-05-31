import Navbar from "@/components/Navbar";
import FAQSection from "@/components/FAQSection";
import Footer from "@/components/Footer";
import SEO from "@/components/SEO";
import { buildFAQSchema } from "@/lib/seo";
import { faqs } from "@/data/faqs";

const FAQ = () => {
  return (
    <div className="min-h-screen bg-background">
      <SEO
        title="CrezzaHerb FAQ - Hair Fall, Hair Growth & Herbal Hair Oil Questions"
        description="Find honest answers about Ayurvedic hair oil, hair fall timelines, bhringraj benefits, champi technique, UPI ordering, and CrezzaHerb Herbal Hair Oil usage."
        path="/faq"
        keywords={[
          "CrezzaHerb FAQ",
          "hair fall questions",
          "herbal hair oil FAQ",
          "Ayurvedic hair oil questions",
          "how to apply hair oil",
          "bhringraj oil FAQ",
        ]}
        structuredData={buildFAQSchema(faqs)}
      />
      <Navbar />
      <div className="pt-20">
        <FAQSection />
      </div>
      <Footer />
    </div>
  );
};

export default FAQ;
