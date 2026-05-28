import Navbar from "@/components/Navbar";
import FAQSection from "@/components/FAQSection";
import Footer from "@/components/Footer";
import SEO from "@/components/SEO";

const faqStructuredData = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: [
    {
      "@type": "Question",
      name: "How long before I see results?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Most users notice reduced hair fall within 2-4 weeks. Visible new growth typically appears by week 6-8 with consistent use.",
      },
    },
    {
      "@type": "Question",
      name: "Is CrezzaHerb suitable for all hair types?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Yes. CrezzaHerb Herbal Hair Oil works on straight, wavy, curly, or coily hair and is suitable for men and women.",
      },
    },
    {
      "@type": "Question",
      name: "How should I apply the oil?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Massage a small amount into the scalp for 5-10 minutes, leave it for at least 2 hours or overnight, then wash with a mild shampoo.",
      },
    },
    {
      "@type": "Question",
      name: "Are there any side effects?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "The formula uses natural ingredients with no chemicals, parabens, or sulphates. If you have specific allergies, do a patch test before first use.",
      },
    },
  ],
};

const FAQ = () => {
  return (
    <div className="min-h-screen bg-background">
      <SEO
        title="CrezzaHerb FAQ - Hair Fall, Hair Growth & Herbal Hair Oil Questions"
        description="Find answers about CrezzaHerb Herbal Hair Oil, including hair fall results, hair growth support, ingredients, application, safety, COD, delivery, and returns."
        path="/faq"
        keywords={[
          "CrezzaHerb FAQ",
          "hair fall questions",
          "herbal hair oil FAQ",
          "Ayurvedic hair oil questions",
          "how to apply hair oil",
        ]}
        structuredData={faqStructuredData}
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
