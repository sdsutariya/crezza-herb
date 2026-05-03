import { motion } from "framer-motion";
import { ArrowRight, Truck, ShieldCheck } from "lucide-react";

const ease: [number, number, number, number] = [0.16, 1, 0.3, 1];

const CTABanner = () => {
  return (
    <section className="relative py-16 md:py-24 px-6 bg-primary text-primary-foreground overflow-hidden">
      {/* Radial glow accents */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[400px] bg-white/[0.07] rounded-full blur-[80px] pointer-events-none" />
      <div className="absolute bottom-0 right-0 w-[300px] h-[300px] bg-black/[0.12] rounded-full blur-[60px] pointer-events-none" />
      {/* Faint dot-grid pattern */}
      <div
        className="absolute inset-0 pointer-events-none opacity-[0.04]"
        style={{ backgroundImage: "radial-gradient(circle, currentColor 1px, transparent 1px)", backgroundSize: "28px 28px" }}
      />
      <motion.div
        initial={{ y: 20, opacity: 0, filter: "blur(4px)" }}
        whileInView={{ y: 0, opacity: 1, filter: "blur(0px)" }}
        viewport={{ once: true, amount: 0.3 }}
        transition={{ duration: 0.8, ease }}
        className="relative max-w-4xl mx-auto text-center space-y-8"
      >
        <h2 className="text-3xl md:text-5xl lg:text-6xl font-serif leading-tight">
          Your Hair Deserves
          <br />
          Better Than Chemicals.
        </h2>
        <p className="text-primary-foreground/70 max-w-lg mx-auto text-sm md:text-base leading-relaxed">
          Join thousands who have switched to CrezzaHerb and discovered what natural, slow-crafted hair care truly feels like.
        </p>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <a
            href="#order"
            className="inline-flex items-center gap-3 bg-primary-foreground text-primary px-10 py-4 rounded-full font-sans font-medium text-sm transition-all hover:brightness-95 active:scale-[0.97]"
          >
            Start Your Transformation
            <ArrowRight className="w-4 h-4" />
          </a>
        </div>

        <div className="flex items-center justify-center gap-8 pt-4">
          <span className="flex items-center gap-2 text-xs font-mono uppercase tracking-wider text-primary-foreground/60">
            <Truck className="w-4 h-4" /> Free Shipping
          </span>
          <span className="flex items-center gap-2 text-xs font-mono uppercase tracking-wider text-primary-foreground/60">
            <ShieldCheck className="w-4 h-4" /> 7-Day Returns
          </span>
        </div>
      </motion.div>
    </section>
  );
};

export default CTABanner;
