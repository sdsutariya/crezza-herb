import { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowDown, ShieldCheck, Leaf, FlaskConical, Award, BadgeCheck, Star, ChevronLeft, ChevronRight } from "lucide-react";
import bottleImg from "@/assets/bottle.png";
import slide1 from "@/assets/hero-slide1-problem.jpg";
import slide2 from "@/assets/hero-slide2-ingredients.jpg";
import slide3 from "@/assets/hero-slide3-results.jpg";

const ease: [number, number, number, number] = [0.16, 1, 0.3, 1];

const slides = [
  {
    image: slide1,
    tag: "The Problem",
    headline: "Hair Fall Affects\n87% of Indians",
    description: "Stress, pollution, and chemical products are silently destroying your hair. It's time for a natural solution rooted in 5,000 years of Ayurvedic wisdom.",
    cta: "Discover the Solution",
  },
  {
    image: slide2,
    tag: "Our Ingredients",
    headline: "12+ Ayurvedic\nHerbs & Botanicals",
    description: "Amla, Rosemary, Jatamansi, Neem, Hibiscus — each herb hand-selected and slow-infused for 14 days in cold-pressed coconut & sesame oil.",
    cta: "See What's Inside",
  },
  {
    image: slide3,
    tag: "Real Results",
    headline: "Before & After\nCrezzaHerb",
    description: "Visible transformation in just 8 weeks. Thicker, stronger, darker hair — no chemicals, no side effects. Just pure Ayurvedic science.",
    cta: "Start Your Journey",
  },
];

const trustBadges = [
  { icon: ShieldCheck, label: "AYUSH Certified" },
  { icon: Leaf, label: "100% Organic" },
  { icon: FlaskConical, label: "Lab Tested" },
  { icon: Award, label: "GMP Certified" },
  { icon: BadgeCheck, label: "Zero Chemicals" },
];

const HeroSection = () => {
  const [current, setCurrent] = useState(0);
  const [direction, setDirection] = useState(1);

  const goTo = useCallback((index: number) => {
    setDirection(index > current ? 1 : -1);
    setCurrent(index);
  }, [current]);

  const next = useCallback(() => {
    setDirection(1);
    setCurrent((p) => (p + 1) % slides.length);
  }, []);

  const prev = useCallback(() => {
    setDirection(-1);
    setCurrent((p) => (p - 1 + slides.length) % slides.length);
  }, []);

  // Auto-play
  useEffect(() => {
    const timer = setInterval(next, 5000);
    return () => clearInterval(timer);
  }, [next]);

  const slide = slides[current];

  const imageVariants = {
    enter: (d: number) => ({ x: d > 0 ? "100%" : "-100%", opacity: 0 }),
    center: { x: 0, opacity: 1 },
    exit: (d: number) => ({ x: d > 0 ? "-30%" : "30%", opacity: 0 }),
  };

  const textVariants = {
    enter: { y: 40, opacity: 0, filter: "blur(8px)" },
    center: { y: 0, opacity: 1, filter: "blur(0px)" },
    exit: { y: -30, opacity: 0, filter: "blur(8px)" },
  };

  return (
    <section className="relative min-h-svh flex flex-col overflow-hidden bg-[#0f0f0a]">
      {/* Background slides */}
      <AnimatePresence initial={false} custom={direction} mode="popLayout">
        <motion.div
          key={current}
          custom={direction}
          variants={imageVariants}
          initial="enter"
          animate="center"
          exit="exit"
          transition={{ duration: 0.8, ease: [0.32, 0.72, 0, 1] }}
          className="absolute inset-0"
        >
          <img
            src={slide.image}
            alt={slide.tag}
            className="w-full h-full object-cover"
          />
          {/* Overlays for text readability */}
          <div className="absolute inset-0 bg-gradient-to-r from-[#0f0f0a]/95 via-[#0f0f0a]/70 to-[#0f0f0a]/30" />
          <div className="absolute inset-0 bg-gradient-to-t from-[#0f0f0a] via-[#0f0f0a]/20 to-[#0f0f0a]/50" />
        </motion.div>
      </AnimatePresence>

      {/* Warm accent glow */}
      <div className="absolute top-1/3 left-1/4 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-[#c8a860]/6 rounded-full blur-[140px] pointer-events-none" />

      {/* Content */}
      <div className="relative flex-1 flex flex-col justify-center px-6 md:px-16 lg:px-24 pt-24 pb-20">
        <div className="max-w-7xl w-full mx-auto flex flex-col lg:flex-row items-center gap-10 lg:gap-16">

          {/* Left: Text */}
          <div className="flex-1 max-w-2xl w-full">
            {/* Mobile: trust badges + bottle row */}
            <div className="flex items-start justify-between gap-4 mb-6 lg:mb-0">
              {/* Trust badges */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2, duration: 0.7, ease }}
                className="flex flex-wrap gap-2 mb-0 lg:mb-8 flex-1"
              >
                {trustBadges.map((badge) => (
                  <div
                    key={badge.label}
                    className="flex items-center gap-1.5 bg-white/[0.06] backdrop-blur-md rounded-full px-3 py-1.5 border border-white/[0.08]"
                  >
                    <badge.icon className="w-3 h-3 text-[#c8a860]" />
                    <span className="font-mono text-[8px] md:text-[9px] uppercase tracking-[0.15em] text-white/60">
                      {badge.label}
                    </span>
                  </div>
                ))}
              </motion.div>

              {/* Bottle — visible on mobile/tablet, hidden on lg (shown separately) */}
              <motion.div
                initial={{ scale: 0.85, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ delay: 0.5, duration: 1.0, ease }}
                className="relative flex-shrink-0 lg:hidden ml-4"
              >
                <div className="absolute inset-0 bg-[#c8a860]/15 rounded-full blur-[40px]" />
                <img
                  src={bottleImg}
                  alt="CrezzaHerb Herbal Hair Oil bottle"
                  className="relative w-24 sm:w-32 object-contain drop-shadow-[0_12px_30px_rgba(200,168,96,0.3)]"
                />
              </motion.div>
            </div>

            {/* Slide tag */}
            <AnimatePresence mode="wait">
              <motion.div
                key={`tag-${current}`}
                variants={textVariants}
                initial="enter"
                animate="center"
                exit="exit"
                transition={{ duration: 0.5, ease }}
                className="mt-4 lg:mt-0"
              >
                <span className="inline-block font-mono text-[10px] md:text-xs uppercase tracking-[0.3em] text-[#c8a860] mb-5 border border-[#c8a860]/25 px-5 py-2 rounded-full bg-[#c8a860]/[0.06]">
                  {slide.tag}
                </span>
              </motion.div>
            </AnimatePresence>

            {/* Headline */}
            <AnimatePresence mode="wait">
              <motion.h1
                key={`h-${current}`}
                variants={textVariants}
                initial="enter"
                animate="center"
                exit="exit"
                transition={{ duration: 0.6, delay: 0.08, ease }}
                className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-serif text-white mb-6 tracking-tight sm:whitespace-pre-line"
                style={{ lineHeight: 1 }}
              >
                {slide.headline}
              </motion.h1>
            </AnimatePresence>

            {/* Description */}
            <AnimatePresence mode="wait">
              <motion.p
                key={`d-${current}`}
                variants={textVariants}
                initial="enter"
                animate="center"
                exit="exit"
                transition={{ duration: 0.5, delay: 0.16, ease }}
                className="text-sm md:text-base text-white/70 max-w-lg mb-8 leading-relaxed"
              >
                {slide.description}
              </motion.p>
            </AnimatePresence>

            {/* CTA + Rating */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5, duration: 0.7, ease }}
              className="flex flex-col sm:flex-row items-start sm:items-center gap-5"
            >
              <a
                href="#order"
                className="group flex items-center gap-3 bg-gradient-to-r from-[#c8a860] to-[#a88940] text-[#1a1a12] px-9 py-3.5 rounded-full font-sans font-semibold text-sm tracking-wide transition-all hover:shadow-[0_0_30px_rgba(200,168,96,0.3)] hover:scale-[1.02] active:scale-[0.98]"
              >
                Shop Now — ₹399
                <ArrowDown className="w-4 h-4 animate-bounce" />
              </a>
              <div className="flex flex-col gap-1">
                <div className="flex items-center gap-1">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-3.5 h-3.5 fill-[#c8a860] text-[#c8a860]" />
                  ))}
                  <span className="text-white/80 text-xs ml-1.5 font-mono">4.9/5</span>
                </div>
                <span className="font-mono text-[9px] text-white/50 tracking-[0.12em] uppercase">
                  Free shipping · UPI payment
                </span>
              </div>
            </motion.div>
          </div>

          {/* Right: Bottle — desktop only */}
          <motion.div
            initial={{ scale: 0.85, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 0.6, duration: 1.2, ease }}
            className="relative flex-shrink-0 hidden lg:block"
          >
            <div className="absolute inset-0 bg-[#c8a860]/10 rounded-full blur-[80px] scale-110" />
            <img
              src={bottleImg}
              alt="CrezzaHerb Herbal Hair Oil bottle"
              className="relative w-52 xl:w-64 object-contain drop-shadow-[0_20px_60px_rgba(200,168,96,0.25)]"
            />
          </motion.div>
        </div>

        {/* Slider controls */}
        <div className="max-w-7xl w-full mx-auto mt-10 flex items-center gap-4 sm:gap-6">
          {/* Arrows */}
          <div className="flex items-center gap-2">
            <button
              onClick={prev}
              className="w-9 h-9 sm:w-10 sm:h-10 rounded-full border border-white/10 flex items-center justify-center text-white/50 hover:text-white hover:border-white/30 transition-all hover:bg-white/[0.05]"
              aria-label="Previous slide"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <button
              onClick={next}
              className="w-9 h-9 sm:w-10 sm:h-10 rounded-full border border-white/10 flex items-center justify-center text-white/50 hover:text-white hover:border-white/30 transition-all hover:bg-white/[0.05]"
              aria-label="Next slide"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>

          {/* Dots with labels */}
          <div className="flex items-center gap-4 sm:gap-6">
            {slides.map((s, i) => (
              <button
                key={i}
                onClick={() => goTo(i)}
                className="flex items-center gap-2 sm:gap-3 group"
              >
                <div
                  className={`h-[2px] transition-all duration-500 ${
                    i === current
                      ? "w-8 sm:w-10 bg-[#c8a860]"
                      : "w-4 sm:w-5 bg-white/20 group-hover:bg-white/40"
                  }`}
                />
                <span
                  className={`font-mono text-[9px] uppercase tracking-[0.15em] transition-colors duration-300 hidden sm:inline ${
                    i === current ? "text-[#c8a860]" : "text-white/30 group-hover:text-white/50"
                  }`}
                >
                  {s.tag}
                </span>
              </button>
            ))}
          </div>

          {/* Slide counter — hidden on very small screens */}
          <span className="ml-auto font-mono text-xs text-white/30 hidden sm:inline">
            <span className="text-[#c8a860]">{String(current + 1).padStart(2, "0")}</span>
            {" / "}
            {String(slides.length).padStart(2, "0")}
          </span>
        </div>
      </div>

      {/* Stats bar */}
      <div className="relative z-10 border-t border-white/[0.06]">
        <div className="max-w-5xl mx-auto grid grid-cols-3 divide-x divide-white/[0.06]">
          {[
            { value: "87%", label: "Hair Fall Reduction" },
            { value: "14", label: "Day Slow Infusion" },
            { value: "12+", label: "Natural Herbs" },
          ].map((stat) => (
            <div key={stat.label} className="text-center py-5 md:py-8">
              <p className="text-2xl md:text-4xl font-serif text-white tracking-tight">{stat.value}</p>
              <p className="font-mono text-[10px] md:text-[11px] uppercase tracking-[0.2em] text-white/55 mt-1">
                {stat.label}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* Bottom fade */}
      <div className="absolute bottom-0 left-0 right-0 h-24 bg-gradient-to-t from-background to-transparent pointer-events-none" />
    </section>
  );
};

export default HeroSection;
