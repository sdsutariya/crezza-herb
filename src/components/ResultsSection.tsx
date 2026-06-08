import { motion } from "framer-motion";
import week0 from "@/assets/week0-hairfall.jpg";
import week2 from "@/assets/week2-oiling.jpg";
import week4 from "@/assets/week4-less-fall.jpg";
import week6 from "@/assets/week6-newgrowth.jpg";
import week8 from "@/assets/week8-growth.jpg";
import week12 from "@/assets/week12-volume.jpg";
import week16 from "@/assets/week16-nogrey.jpg";
import { logoGreenTextClass, sectionEyebrowClass } from "@/lib/brand";

const ease: [number, number, number, number] = [0.16, 1, 0.3, 1];

const phases = [
  {
    label: "Phase 1",
    title: "Stop the Fall",
    color: "text-red-400",
    steps: [
      { image: week0, week: "Week 0", tagline: "Where It Begins", description: "Excessive hair fall, thinning strands, and a receding hairline — the silent struggle millions face daily.", punchline: "Every strand lost is a story of neglect." },
      { image: week2, week: "Week 2", tagline: "The First Ritual", description: "Warm oil massaged into the scalp awakens dormant follicles. Bhringraj and Amla begin strengthening roots from the very first application.", punchline: "Healing starts the moment you care." },
      { image: week4, week: "Week 4", tagline: "Fall Starts Slowing", description: "Noticeably fewer strands on your comb and pillow. The scalp feels nourished, and breakage reduces dramatically.", punchline: "Your comb finally tells a different story." },
    ],
  },
  {
    label: "Phase 2",
    title: "Grow It Back",
    color: logoGreenTextClass,
    steps: [
      { image: week6, week: "Week 6", tagline: "New Growth Emerges", description: "Tiny baby hairs sprout along the hairline and temples — visible proof that the follicles are alive and responding.", punchline: "New roots. New confidence." },
      { image: week8, week: "Week 8", tagline: "Thickness Returns", description: "Hair feels denser, stronger, and more resilient. The Ayurvedic herbs have deeply penetrated the scalp, restoring its natural vitality.", punchline: "From thin to thick — nature's promise kept." },
    ],
  },
  {
    label: "Phase 3",
    title: "Keep It Black",
    color: "text-amber-400",
    steps: [
      { image: week12, week: "Week 12", tagline: "Volume & Shine", description: "Lustrous, voluminous hair that turns heads. The slow-infused oils have restored the hair's natural melanin production and deep shine.", punchline: "Hair so alive, it speaks for itself." },
      { image: week16, week: "Week 16", tagline: "Grey Prevention", description: "Consistent use prevents premature greying. Black sesame and Brahmi protect melanin, keeping your hair youthfully dark and vibrant.", punchline: "Defy time. Stay naturally dark." },
    ],
  },
];

const ResultsSection = () => {
  return (
    <section id="results" className="py-16 md:py-24 px-6 max-w-6xl mx-auto">
      {/* Header */}
      <motion.div
        initial={{ y: 16, opacity: 0, filter: "blur(4px)" }}
        whileInView={{ y: 0, opacity: 1, filter: "blur(0px)" }}
        viewport={{ once: true, amount: 0.2 }}
        transition={{ duration: 0.7, ease }}
        className="space-y-4 mb-24 text-center"
      >
        <span className={sectionEyebrowClass}>
          Your Hair Transformation Journey
        </span>
        <h2 className="text-3xl md:text-5xl font-serif text-foreground">
          Trusted by Those Who Care
        </h2>
        <p className="text-muted-foreground max-w-lg mx-auto leading-relaxed text-sm">
          Real results, week by week. Watch the transformation unfold — from controlling hair fall, to regrowing thickness, to preventing grey hair naturally.
        </p>
      </motion.div>

      {/* Phases */}
      <div className="space-y-20 md:space-y-36">
        {phases.map((phase) => (
          <div key={phase.title} className="space-y-14 md:space-y-20">
            {/* Phase Header */}
            <motion.div
              initial={{ y: 12, opacity: 0 }}
              whileInView={{ y: 0, opacity: 1 }}
              viewport={{ once: true, amount: 0.3 }}
              transition={{ duration: 0.6, ease }}
              className="flex items-center gap-4"
            >
              <span className={`font-mono text-[10px] uppercase tracking-[0.2em] ${phase.color}`}>
                {phase.label}
              </span>
              <div className="h-px flex-1 bg-border/30" />
              <h3 className="text-xl md:text-3xl font-serif text-foreground">{phase.title}</h3>
              <div className="h-px flex-1 bg-border/30 hidden md:block" />
            </motion.div>

            {/* Steps */}
            <div className="space-y-14 md:space-y-24">
              {phase.steps.map((step, i) => (
                <motion.div
                  key={step.week}
                  initial={{ y: 24, opacity: 0, filter: "blur(4px)" }}
                  whileInView={{ y: 0, opacity: 1, filter: "blur(0px)" }}
                  viewport={{ once: true, amount: 0.15 }}
                  transition={{ duration: 0.8, ease }}
                  className={`flex flex-col ${i % 2 === 0 ? "md:flex-row" : "md:flex-row-reverse"} gap-10 md:gap-16 items-center`}
                >
                  {/* Image */}
                  <div className="w-full md:w-1/2">
                    <div className="rounded-[24px] overflow-hidden aspect-[4/5] md:aspect-square relative group">
                      <img
                        src={step.image}
                        alt={step.tagline}
                        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                        loading="lazy"
                      />
                      <div className="absolute top-5 left-5 bg-background/80 backdrop-blur-sm rounded-full px-4 py-2">
                        <span className="font-mono text-[11px] uppercase tracking-[0.15em] text-foreground">
                          {step.week}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Content */}
                  <div className="w-full md:w-1/2 space-y-5">
                    <span className={`font-mono text-xs uppercase tracking-[0.15em] ${logoGreenTextClass}`}>
                      {step.tagline}
                    </span>
                    <p className="text-muted-foreground leading-relaxed text-sm md:text-base max-w-sm">
                      {step.description}
                    </p>
                    <blockquote className="border-l-2 border-primary/40 pl-5">
                      <p className="text-foreground font-serif text-lg md:text-xl italic">
                        "{step.punchline}"
                      </p>
                    </blockquote>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        ))}
      </div>

      {/* Trust Strip */}
      <motion.div
        initial={{ y: 12, opacity: 0 }}
        whileInView={{ y: 0, opacity: 1 }}
        viewport={{ once: true }}
        transition={{ delay: 0.1, duration: 0.7, ease }}
        className="mt-28 py-10 border-y border-border/30"
      >
        <div className="flex flex-wrap items-center justify-center gap-x-12 gap-y-4 font-mono text-xs text-muted-foreground uppercase tracking-[0.15em]">
          <span>100% Natural</span>
          <span className="w-1.5 h-1.5 rounded-full bg-primary/40" />
          <span>No Chemicals</span>
          <span className="w-1.5 h-1.5 rounded-full bg-primary/40" />
          <span>Cruelty Free</span>
          <span className="w-1.5 h-1.5 rounded-full bg-primary/40" />
          <span>Handcrafted</span>
          <span className="w-1.5 h-1.5 rounded-full bg-primary/40" />
          <span>Lab Tested</span>
        </div>
      </motion.div>
    </section>
  );
};

export default ResultsSection;
