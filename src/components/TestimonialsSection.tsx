import { motion } from "framer-motion";
import { Star, Quote, ChevronLeft, ChevronRight } from "lucide-react";
import { useRef } from "react";
import {
  logoGreenFillClass,
  logoGreenTextClass,
  sectionEyebrowClass,
} from "@/lib/brand";

const ease: [number, number, number, number] = [0.16, 1, 0.3, 1];

const testimonials = [
  {
    name: "Priya Sharma",
    location: "Mumbai",
    rating: 5,
    text: "My hair fall reduced by 80% in just 6 weeks. I was skeptical at first, but CrezzaHerb truly delivers. My comb is finally clean!",
    highlight: "80% less hair fall",
  },
  {
    name: "Arun Kumar",
    location: "Bangalore",
    rating: 5,
    text: "I started seeing baby hairs at my temples within a month. Nothing else worked — not supplements, not expensive serums. This oil is magic.",
    highlight: "New growth in 4 weeks",
  },
  {
    name: "Sneha Mishra",
    location: "Delhi",
    rating: 5,
    text: "My grey hairs have noticeably reduced. The oil smells amazing and my hair feels thicker and healthier than it has in years.",
    highlight: "Grey hair prevention",
  },
  {
    name: "Rahul Desai",
    location: "Pune",
    rating: 5,
    text: "As a guy in my 30s, thinning hair was affecting my confidence. After 8 weeks with CrezzaHerb, my barber noticed the difference.",
    highlight: "Visible thickness",
  },
  {
    name: "Meera Joshi",
    location: "Chennai",
    rating: 5,
    text: "I've tried every Ayurvedic oil on the market. CrezzaHerb is the only one that actually shows results. The 14-day infusion makes a real difference.",
    highlight: "Superior quality",
  },
  {
    name: "Vikram Patel",
    location: "Hyderabad",
    rating: 5,
    text: "Great product with genuine ingredients. My wife and I both use it — she for hair fall, me for grey prevention. Works wonderfully for both.",
    highlight: "Family solution",
  },
];

const TestimonialsSection = () => {
  const scrollRef = useRef<HTMLDivElement>(null);

  return (
    <section id="testimonials" className="py-16 md:py-24 px-6 bg-accent/20">
      <div className="max-w-6xl mx-auto">
        <div className="flex flex-col sm:flex-row items-start sm:items-end justify-between gap-4 mb-12">
        <motion.div
          initial={{ y: 16, opacity: 0, filter: "blur(4px)" }}
          whileInView={{ y: 0, opacity: 1, filter: "blur(0px)" }}
          viewport={{ once: true, amount: 0.2 }}
          transition={{ duration: 0.7, ease }}
          className="space-y-4 text-center sm:text-left flex-1"
        >
          <span className={sectionEyebrowClass}>
            Real Stories
          </span>
          <h2 className="text-3xl md:text-5xl font-serif text-foreground">
            Loved by Thousands
          </h2>
          <p className="text-muted-foreground max-w-lg mx-auto sm:mx-0 leading-relaxed text-sm">
            Don't just take our word for it — hear from people who transformed their hair with CrezzaHerb.
          </p>
        </motion.div>

        {/* Desktop scroll arrows */}
        <div className="hidden md:flex items-center gap-2 flex-shrink-0">
          <button
            onClick={() => scrollRef.current?.scrollBy({ left: -380, behavior: "smooth" })}
            className="w-10 h-10 rounded-full border border-border/40 flex items-center justify-center text-muted-foreground hover:text-foreground hover:border-border hover:bg-accent transition-all"
            aria-label="Scroll left"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>
          <button
            onClick={() => scrollRef.current?.scrollBy({ left: 380, behavior: "smooth" })}
            className="w-10 h-10 rounded-full border border-border/40 flex items-center justify-center text-muted-foreground hover:text-foreground hover:border-border hover:bg-accent transition-all"
            aria-label="Scroll right"
          >
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
        </div>

        {/* Horizontal scroll container */}
        <div
          ref={scrollRef}
          className="flex gap-5 overflow-x-auto pb-4 snap-x snap-mandatory scrollbar-hide"
          style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
        >
          {testimonials.map((t, i) => (
            <motion.div
              key={t.name}
              initial={{ y: 20, opacity: 0, filter: "blur(4px)" }}
              whileInView={{ y: 0, opacity: 1, filter: "blur(0px)" }}
              viewport={{ once: true, amount: 0.2 }}
              transition={{ delay: i * 0.06, duration: 0.7, ease }}
              className="snap-start flex-shrink-0 w-[320px] md:w-[360px] bg-card rounded-[20px] p-7 shadow-card relative"
            >
              <Quote className="absolute top-6 right-6 w-8 h-8 text-primary/10" />
              <div className="flex items-center gap-1 mb-3">
                {Array.from({ length: t.rating }).map((_, j) => (
                  <Star key={j} className={`w-4 h-4 ${logoGreenFillClass} ${logoGreenTextClass}`} />
                ))}
              </div>
              <span className={`inline-block font-mono text-[10px] uppercase tracking-[0.15em] ${logoGreenTextClass} bg-primary/10 px-3 py-1 rounded-full mb-4`}>
                {t.highlight}
              </span>
              <p className="text-sm text-muted-foreground leading-relaxed mb-5">
                "{t.text}"
              </p>
              <div className="pt-4 border-t border-border/30 flex items-center gap-3">
                <div className="w-9 h-9 rounded-full bg-primary/10 flex items-center justify-center">
                  <span className={`text-xs font-medium ${logoGreenTextClass}`}>
                    {t.name.split(" ").map(n => n[0]).join("")}
                  </span>
                </div>
                <div>
                  <p className="text-sm font-medium text-foreground">{t.name}</p>
                  <p className="text-xs text-muted-foreground">{t.location}</p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default TestimonialsSection;
