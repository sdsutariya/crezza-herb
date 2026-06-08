import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { faqs } from "@/data/faqs";
import { sectionEyebrowClass } from "@/lib/brand";

const ease: [number, number, number, number] = [0.16, 1, 0.3, 1];

type FAQSectionProps = {
  limit?: number;
  showViewAll?: boolean;
};

const FAQSection = ({ limit, showViewAll = false }: FAQSectionProps) => {
  const displayedFaqs = limit ? faqs.slice(0, limit) : faqs;

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
          <span className={sectionEyebrowClass}>
            Common Questions
          </span>
          <h2 className="text-3xl md:text-5xl font-serif text-foreground">
            Got Questions?
          </h2>
          <p className="text-muted-foreground max-w-md mx-auto leading-relaxed text-sm">
            Honest answers about Ayurvedic hair care, hair fall, and CrezzaHerb Herbal Hair Oil.
          </p>
        </motion.div>

        <motion.div
          initial={{ y: 16, opacity: 0 }}
          whileInView={{ y: 0, opacity: 1 }}
          viewport={{ once: true, amount: 0.1 }}
          transition={{ duration: 0.7, ease }}
        >
          <Accordion type="single" collapsible className="space-y-3">
            {displayedFaqs.map((faq, i) => (
              <AccordionItem
                key={faq.q}
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

          {showViewAll && limit && limit < faqs.length && (
            <p className="text-center mt-8 text-sm text-muted-foreground">
              <Link to="/faq" className="text-primary hover:underline font-medium">
                View all {faqs.length} questions →
              </Link>
            </p>
          )}
        </motion.div>
      </div>
    </section>
  );
};

export default FAQSection;
