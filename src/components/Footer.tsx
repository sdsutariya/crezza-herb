import { Link } from "react-router-dom";
import { motion } from "framer-motion";

const ease: [number, number, number, number] = [0.16, 1, 0.3, 1];

const Footer = () => {
  return (
    <footer className="py-20 px-6 border-t border-border/[0.08] bg-card">
      <motion.div
        initial={{ y: 16, opacity: 0 }}
        whileInView={{ y: 0, opacity: 1 }}
        viewport={{ once: true, amount: 0.2 }}
        transition={{ duration: 0.7, ease }}
        className="max-w-6xl mx-auto"
      >
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-16">
          <div className="md:col-span-2 space-y-4">
            <span className="font-serif text-3xl text-foreground">CrezzaHerb</span>
            <p className="text-sm text-muted-foreground max-w-sm leading-relaxed">
              Rooted in Ayurvedic tradition, refined for modern results. Our flagship herbal hair oil is handcrafted with a 14-day slow infusion process using 100% natural ingredients.
            </p>
            <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-muted-foreground/50 pt-2">
              Handmade with care in India 🇮🇳
            </p>
          </div>
          <div className="space-y-4">
            <h4 className="font-mono text-xs uppercase tracking-[0.15em] text-foreground">Quick Links</h4>
            <div className="flex flex-col gap-3">
              <a href="/#results" className="text-sm text-muted-foreground hover:text-foreground transition-colors">Results</a>
              <a href="/#herbarium" className="text-sm text-muted-foreground hover:text-foreground transition-colors">Ingredients</a>
              <a href="/#process" className="text-sm text-muted-foreground hover:text-foreground transition-colors">Our Process</a>
              <a href="/#order" className="text-sm text-muted-foreground hover:text-foreground transition-colors">Shop</a>
              <Link to="/faq" className="text-sm text-muted-foreground hover:text-foreground transition-colors">FAQ</Link>
            </div>
          </div>
          <div className="space-y-4">
            <h4 className="font-mono text-xs uppercase tracking-[0.15em] text-foreground">Support</h4>
            <div className="flex flex-col gap-3">
              <Link to="/contact" className="text-sm text-muted-foreground hover:text-foreground transition-colors">Contact Us</Link>
              <Link to="/privacy-policy" className="text-sm text-muted-foreground hover:text-foreground transition-colors">Privacy Policy</Link>
              <Link to="/terms-conditions" className="text-sm text-muted-foreground hover:text-foreground transition-colors">Terms & Conditions</Link>
            </div>
          </div>
        </div>
        <div className="pt-8 border-t border-border/[0.08] flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="font-mono text-[10px] text-muted-foreground/60 uppercase tracking-wider">
            © {new Date().getFullYear()} CrezzaHerb. All rights reserved.
          </p>
          <p className="font-mono text-[10px] text-muted-foreground/60 uppercase tracking-wider">
            Traditional Ayurvedic Hair Care
          </p>
        </div>
      </motion.div>
    </footer>
  );
};

export default Footer;
