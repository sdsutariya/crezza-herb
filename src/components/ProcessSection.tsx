import { motion } from "framer-motion";
import { Sun, Clock, Droplets, FlaskConical, CheckCircle2 } from "lucide-react";

const ease: [number, number, number, number] = [0.16, 1, 0.3, 1];

const steps = [
  {
    step: "01",
    icon: Sun,
    title: "Harvest & Sun-Dry",
    subtitle: "Peak Potency Collection",
    description: "Each herb — Bhringraj, Amla, Brahmi, Hibiscus — is hand-picked at its most potent stage. Then air-dried under natural sunlight to lock in essential alkaloids and active compounds.",
    detail: "No heat processing. No shortcuts.",
  },
  {
    step: "02",
    icon: Clock,
    title: "14-Day Slow Infusion",
    subtitle: "The Heart of Our Process",
    description: "Dried herbs are submerged in cold-pressed coconut and sesame oils, then held at a constant low temperature for 14 full days. This slow extraction absorbs the complete nutrient profile.",
    detail: "336 hours of patience in every bottle.",
  },
  {
    step: "03",
    icon: Droplets,
    title: "Cold-Pressed Base Blend",
    subtitle: "Pure Carrier Oils",
    description: "Our base oils are cold-pressed — never refined or heated. This preserves natural fatty acids, Vitamin E, and absorption qualities that synthetic oils cannot replicate.",
    detail: "Traditional wooden press. No chemicals.",
  },
  {
    step: "04",
    icon: FlaskConical,
    title: "Lab Testing & Quality",
    subtitle: "Modern Standards, Ancient Methods",
    description: "Every batch undergoes rigorous testing for potency, purity, and microbial safety. Centuries-old Ayurvedic methods combined with modern quality control.",
    detail: "Tested. Certified. Trusted.",
  },
];

const ProcessSection = () => {
  return (
    <section id="process" className="py-16 md:py-24 bg-foreground text-background overflow-hidden">
      <div className="max-w-4xl mx-auto px-6">
        {/* Header */}
        <motion.div
          initial={{ y: 16, opacity: 0, filter: "blur(4px)" }}
          whileInView={{ y: 0, opacity: 1, filter: "blur(0px)" }}
          viewport={{ once: true, amount: 0.2 }}
          transition={{ duration: 0.8, ease }}
          className="mb-8 space-y-4 text-center"
        >
          <span className="font-mono text-xs uppercase tracking-[0.2em] text-primary">
            Our Process
          </span>
          <h2 className="text-4xl md:text-6xl font-serif">
            The Science of Slow.
          </h2>
          <p className="text-background/50 max-w-lg mx-auto text-sm leading-relaxed">
            Each bottle of CrezzaHerb is crafted over 14 days using traditional Ayurvedic Taila Paka Vidhi — the ancient science of herbal oil preparation.
          </p>
        </motion.div>

        {/* Promise bar */}
        <motion.div
          initial={{ y: 12, opacity: 0 }}
          whileInView={{ y: 0, opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, ease }}
          className="flex flex-wrap items-center justify-center gap-6 mb-16 py-5 border-y border-background/10"
        >
          {["No Parabens", "No Sulphates", "No Synthetic Fragrance", "No Mineral Oil", "Cruelty Free"].map((item) => (
            <div key={item} className="flex items-center gap-2">
              <CheckCircle2 className="w-3.5 h-3.5 text-primary" />
              <span className="font-mono text-[10px] uppercase tracking-[0.15em] text-background/60">{item}</span>
            </div>
          ))}
        </motion.div>

        {/* Vertical Stepper */}
        <div className="relative">
          {/* Vertical line */}
          <div className="absolute left-6 md:left-8 top-0 bottom-0 w-px bg-background/15" />

          <div className="space-y-0">
            {steps.map((s, i) => (
              <motion.div
                key={s.step}
                initial={{ y: 24, opacity: 0, filter: "blur(4px)" }}
                whileInView={{ y: 0, opacity: 1, filter: "blur(0px)" }}
                viewport={{ once: true, amount: 0.3 }}
                transition={{ delay: i * 0.1, duration: 0.7, ease }}
                className="relative flex gap-6 md:gap-8 pb-12 last:pb-0"
              >
                {/* Step indicator */}
                <div className="relative z-10 flex-shrink-0">
                  <div className="w-12 h-12 md:w-16 md:h-16 rounded-full bg-primary/20 border-2 border-primary flex items-center justify-center">
                    <s.icon className="w-5 h-5 md:w-6 md:h-6 text-primary" />
                  </div>
                </div>

                {/* Content */}
                <div className="flex-1 pt-1 md:pt-3">
                  <div className="flex items-center gap-3 mb-2">
                    <span className="font-mono text-2xl font-light text-background/20">{s.step}</span>
                    <span className="font-mono text-[10px] uppercase tracking-[0.2em] text-primary">{s.subtitle}</span>
                  </div>
                  <h3 className="text-xl md:text-2xl font-serif mb-3">{s.title}</h3>
                  <p className="text-background/50 leading-relaxed text-sm mb-2 max-w-lg">
                    {s.description}
                  </p>
                  <p className="font-mono text-xs text-primary/80 italic">
                    {s.detail}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Bottom quote */}
        <motion.div
          initial={{ y: 12, opacity: 0 }}
          whileInView={{ y: 0, opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.2, duration: 0.7, ease }}
          className="mt-12 text-center"
        >
          <p className="font-serif text-xl md:text-2xl text-background/80 italic max-w-2xl mx-auto">
            "We don't manufacture hair oil. We craft it — the way our grandmothers did, with patience, precision, and respect for every herb."
          </p>
        </motion.div>
      </div>
    </section>
  );
};

export default ProcessSection;
