import { motion } from "framer-motion";
import { Shield, Leaf, Zap, Heart, Eye, Droplet } from "lucide-react";

const ease: [number, number, number, number] = [0.16, 1, 0.3, 1];

const benefits = [
  {
    icon: Shield,
    title: "Stops Hair Fall",
    description: "Bhringraj and Amla strengthen roots, reducing hair fall by up to 87% within 8 weeks of regular use.",
  },
  {
    icon: Zap,
    title: "Promotes Regrowth",
    description: "Stimulates dormant follicles and increases blood circulation to the scalp for visible new growth.",
  },
  {
    icon: Droplet,
    title: "Prevents Greying",
    description: "Black sesame and Brahmi protect natural melanin production, keeping hair youthfully dark.",
  },
  {
    icon: Heart,
    title: "Deep Nourishment",
    description: "14-day slow infusion ensures maximum nutrient absorption into every strand from root to tip.",
  },
  {
    icon: Eye,
    title: "Visible Shine",
    description: "Cold-pressed coconut oil base restores natural lustre and softness without synthetic silicones.",
  },
  {
    icon: Leaf,
    title: "Zero Chemicals",
    description: "No parabens, no sulphates, no synthetic fragrance. Just pure Ayurvedic botanicals, nothing else.",
  },
];

const BenefitsSection = () => {
  return (
    <section className="py-16 md:py-24 px-6 bg-accent/20">
      <div className="max-w-6xl mx-auto">
        <motion.div
          initial={{ y: 16, opacity: 0, filter: "blur(4px)" }}
          whileInView={{ y: 0, opacity: 1, filter: "blur(0px)" }}
          viewport={{ once: true, amount: 0.2 }}
          transition={{ duration: 0.7, ease }}
          className="text-center space-y-4 mb-20"
        >
          <span className="font-mono text-xs uppercase tracking-[0.2em] text-primary">
            Why CrezzaHerb
          </span>
          <h2 className="text-3xl md:text-5xl font-serif text-foreground">
            Six Reasons to Switch
          </h2>
          <p className="text-muted-foreground max-w-lg mx-auto leading-relaxed text-sm">
            Every drop is packed with centuries of Ayurvedic wisdom, refined with modern precision.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {benefits.map((b, i) => (
            <motion.div
              key={b.title}
              initial={{ y: 20, opacity: 0, filter: "blur(4px)" }}
              whileInView={{ y: 0, opacity: 1, filter: "blur(0px)" }}
              viewport={{ once: true, amount: 0.2 }}
              transition={{ delay: i * 0.08, duration: 0.7, ease }}
              className="group bg-card rounded-[20px] p-8 shadow-card hover:shadow-elevated transition-shadow duration-500"
            >
              <div className="w-12 h-12 rounded-2xl bg-primary/10 flex items-center justify-center mb-6 group-hover:bg-primary/15 transition-colors">
                <b.icon className="w-5 h-5 text-primary" />
              </div>
              <h3 className="font-serif text-lg text-foreground mb-2">{b.title}</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">{b.description}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default BenefitsSection;
