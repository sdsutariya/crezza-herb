import { motion } from "framer-motion";
import bhringrajImg from "@/assets/bhringraj.jpg";
import amlaImg from "@/assets/amla.jpg";
import brahmiImg from "@/assets/brahmi.jpg";
import hibiscusImg from "@/assets/hibiscus.jpg";
import coconutImg from "@/assets/coconut.jpg";

const ingredients = [
  { name: "Coconut Oil", image: coconutImg, benefit: "Deep-penetrating carrier oil rich in lauric acid. Strengthens hair shaft and prevents protein loss." },
  { name: "Bhringraj", image: bhringrajImg, benefit: "The 'King of Herbs' for hair. Supports natural follicle strength and reduces hair fall." },
  { name: "Amla", image: amlaImg, benefit: "Rich in Vitamin C, strengthens hair roots and promotes natural shine and thickness." },
  { name: "Brahmi", image: brahmiImg, benefit: "Nourishes the scalp, supports blood circulation, and strengthens hair from the root." },
  { name: "Hibiscus", image: hibiscusImg, benefit: "Conditions hair naturally, reduces premature greying, and supports healthy growth." },
];

const ease: [number, number, number, number] = [0.16, 1, 0.3, 1];

const HerbariumSection = () => {
  return (
    <section id="herbarium" className="py-16 md:py-24 px-6 max-w-6xl mx-auto">
      <motion.div
        initial={{ y: 16, opacity: 0, filter: "blur(4px)" }}
        whileInView={{ y: 0, opacity: 1, filter: "blur(0px)" }}
        viewport={{ once: true, amount: 0.2 }}
        transition={{ duration: 0.7, ease }}
        className="space-y-4 mb-16"
      >
        <span className="font-mono text-xs uppercase tracking-[0.2em] text-primary">
          The Herbarium
        </span>
        <h2 className="text-3xl md:text-5xl font-serif text-foreground">
          Key Ingredients
        </h2>
        <p className="text-muted-foreground max-w-lg leading-relaxed text-sm">
          A curated selection of Ayurvedic powerhouses — slow-infused over 14 days alongside other potent botanicals for maximum efficacy.
        </p>
      </motion.div>

      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-5">
        {ingredients.map((item, i) => (
          <motion.div
            key={item.name}
            initial={{ y: 20, opacity: 0, filter: "blur(4px)" }}
            whileInView={{ y: 0, opacity: 1, filter: "blur(0px)" }}
            viewport={{ once: true, amount: 0.2 }}
            transition={{ delay: 0.1 + i * 0.08, duration: 0.7, ease }}
            whileHover={{ y: -6 }}
            className="group p-4 bg-accent/30 rounded-[20px] transition-all duration-500 hover:bg-accent hover:shadow-card hover:-translate-y-1 cursor-default overflow-hidden"
          >
            <div className="aspect-square rounded-2xl overflow-hidden mb-4 relative">
              <img
                src={item.image}
                alt={item.name}
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                loading="lazy"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/0 to-black/0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-2xl flex items-end p-3">
                <span className="font-mono text-[10px] uppercase tracking-[0.12em] text-white/90 font-medium">
                  {item.name}
                </span>
              </div>
            </div>
            <span className="font-mono text-xs uppercase tracking-[0.1em] text-primary block mb-2">
              {item.name}
            </span>
            <p className="text-xs text-muted-foreground leading-relaxed">
              {item.benefit}
            </p>
          </motion.div>
        ))}
      </div>

      <motion.p
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        transition={{ delay: 0.4, duration: 0.7 }}
        className="mt-10 text-center font-mono text-[10px] text-muted-foreground/50 uppercase tracking-[0.2em]"
      >
        + other carefully selected herbs & oils in our proprietary blend
      </motion.p>
    </section>
  );
};

export default HerbariumSection;
