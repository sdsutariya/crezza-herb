import { motion } from "framer-motion";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

const ease: [number, number, number, number] = [0.16, 1, 0.3, 1];

const faqs = [
  {
    q: "How long before I see results?",
    a: "Most users notice reduced hair fall within 2-4 weeks. Visible new growth typically appears by week 6-8 with consistent use (3-4 times per week).",
  },
  {
    q: "Is it suitable for all hair types?",
    a: "Yes. Our formulation works on all hair types — straight, wavy, curly, or coily. It's equally effective for both men and women of all ages.",
  },
  {
    q: "How should I apply the oil?",
    a: "Warm a small amount between your palms, massage into the scalp using circular motions for 5-10 minutes. Leave for at least 2 hours or overnight for best results. Wash with a mild shampoo.",
  },
  {
    q: "What makes the 14-day infusion special?",
    a: "Unlike commercial oils made in hours, our 14-day slow infusion allows the base oil to fully absorb the bioactive compounds from each herb, resulting in 3x higher nutrient density.",
  },
  {
    q: "Are there any side effects?",
    a: "No. All ingredients are 100% natural with no chemicals, parabens, or sulphates. However, if you have specific allergies, we recommend a patch test before first use.",
  },
  {
    q: "Do you offer COD (Cash on Delivery)?",
    a: "Yes, we offer Cash on Delivery across India. You can also pay via UPI, credit/debit cards, and net banking.",
  },
  {
    q: "What is your return policy?",
    a: "If you're not satisfied, you can return the product within 7 days of delivery for a full refund. The product must be at least 80% unused.",
  },
  {
    q: "How is the oil packaged?",
    a: "Each bottle is sealed in a UV-protected amber glass container to preserve the potency of active ingredients, wrapped securely for safe delivery.",
  },
];

const FAQSection = () => {
  return (
    <section id="faq" className="py-28 md:py-40 px-6">
      <div className="max-w-3xl mx-auto">
        <motion.div
          initial={{ y: 16, opacity: 0, filter: "blur(4px)" }}
          whileInView={{ y: 0, opacity: 1, filter: "blur(0px)" }}
          viewport={{ once: true, amount: 0.2 }}
          transition={{ duration: 0.7, ease }}
          className="text-center space-y-4 mb-16"
        >
          <span className="font-mono text-xs uppercase tracking-[0.2em] text-primary">
            Common Questions
          </span>
          <h2 className="text-3xl md:text-5xl font-serif text-foreground">
            Got Questions?
          </h2>
          <p className="text-muted-foreground max-w-md mx-auto leading-relaxed text-sm">
            Everything you need to know about CrezzaHerb Herbal Hair Oil.
          </p>
        </motion.div>

        <motion.div
          initial={{ y: 16, opacity: 0 }}
          whileInView={{ y: 0, opacity: 1 }}
          viewport={{ once: true, amount: 0.1 }}
          transition={{ duration: 0.7, ease }}
        >
          <Accordion type="single" collapsible className="space-y-3">
            {faqs.map((faq, i) => (
              <AccordionItem
                key={i}
                value={`faq-${i}`}
                className="bg-card rounded-2xl px-6 shadow-card border-none"
              >
                <AccordionTrigger className="text-left font-serif text-base md:text-lg text-foreground hover:no-underline py-5">
                  {faq.q}
                </AccordionTrigger>
                <AccordionContent className="text-sm text-muted-foreground leading-relaxed pb-5">
                  {faq.a}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </motion.div>
      </div>
    </section>
  );
};

export default FAQSection;
