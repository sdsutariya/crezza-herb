import { motion } from "framer-motion";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { ShieldCheck, Truck, Leaf, Package, Clock, Star } from "lucide-react";
import bottleImg from "@/assets/bottle.png";
import type { Session } from "@supabase/supabase-js";

const ease: [number, number, number, number] = [0.16, 1, 0.3, 1];

const OrderSection = () => {
  const [session, setSession] = useState<Session | null>(null);
  const [quantity, setQuantity] = useState(1);
  const { toast } = useToast();
  const navigate = useNavigate();

  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, s) => setSession(s));
    supabase.auth.getSession().then(({ data: { session: s } }) => setSession(s));
    return () => subscription.unsubscribe();
  }, []);

  const price = 399;
  const mrp = 599;
  const total = price * quantity;

  const handleOrder = () => {
    if (!session) {
      toast({ title: "Please sign in", description: "Create an account or sign in to place your order." });
      navigate("/auth");
      return;
    }
    navigate(`/checkout?qty=${quantity}`);
  };

  return (
    <section id="order" className="py-16 md:py-24 px-6">
      <div className="max-w-5xl mx-auto">
        <motion.div
          initial={{ y: 16, opacity: 0, filter: "blur(4px)" }}
          whileInView={{ y: 0, opacity: 1, filter: "blur(0px)" }}
          viewport={{ once: true, amount: 0.2 }}
          transition={{ duration: 0.7, ease }}
          className="text-center space-y-4 mb-20"
        >
          <span className="font-mono text-xs uppercase tracking-[0.2em] text-primary">
            Shop Now
          </span>
          <h2 className="text-3xl md:text-5xl font-serif text-foreground">
            Get Your CrezzaHerb Hair Oil
          </h2>
          <p className="text-muted-foreground text-sm max-w-md mx-auto leading-relaxed">
            One product. Honest ingredients. Real results. Start your hair transformation today.
          </p>
        </motion.div>

        <motion.div
          initial={{ y: 20, opacity: 0, filter: "blur(4px)" }}
          whileInView={{ y: 0, opacity: 1, filter: "blur(0px)" }}
          viewport={{ once: true, amount: 0.2 }}
          transition={{ duration: 0.8, ease }}
          className="bg-card rounded-[28px] shadow-elevated p-8 md:p-12 flex flex-col md:flex-row gap-10 items-center"
        >
          {/* Product Image */}
          <div className="w-full md:w-2/5 flex justify-center">
            <div className="relative">
              <img
                src={bottleImg}
                alt="CrezzaHerb Herbal Hair Oil 100ml"
                className="w-56 md:w-64 object-contain drop-shadow-2xl"
              />
              <div className="absolute -top-3 -right-3 bg-primary text-primary-foreground text-[10px] font-mono uppercase tracking-wider px-3 py-1.5 rounded-full">
                Bestseller
              </div>
            </div>
          </div>

          {/* Product Details */}
          <div className="w-full md:w-3/5 space-y-7">
            <div>
              <h3 className="text-2xl md:text-3xl font-serif text-foreground">CrezzaHerb Herbal Hair Oil</h3>
              <p className="text-sm text-muted-foreground mt-2">100ml · 14-Day Slow Infused · Cold-Pressed · Glass Bottle</p>
            </div>

            {/* Rating */}
            <div className="flex items-center gap-2">
              <div className="flex gap-0.5">
                {Array.from({ length: 5 }).map((_, i) => (
                  <Star key={i} className="w-4 h-4 fill-primary text-primary" />
                ))}
              </div>
              <span className="text-xs text-muted-foreground font-mono">4.9 · 2,847 reviews</span>
            </div>

            <div className="flex items-baseline gap-3">
              <span className="text-4xl font-serif text-foreground">₹{price}</span>
              <span className="text-base text-muted-foreground line-through">₹{mrp}</span>
              <span className="text-xs font-mono uppercase tracking-wider text-primary bg-primary/10 px-3 py-1 rounded-full">33% off</span>
            </div>

            {/* Quantity */}
            <div className="flex items-center gap-5">
              <span className="text-sm text-muted-foreground">Qty:</span>
              <div className="flex items-center border border-border/20 rounded-full overflow-hidden">
                <button
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  className="px-5 py-2.5 text-sm hover:bg-accent transition-colors active:scale-95"
                >−</button>
                <span className="px-5 py-2.5 text-sm font-medium text-foreground border-x border-border/20 tabular-nums">{quantity}</span>
                <button
                  onClick={() => setQuantity(Math.min(5, quantity + 1))}
                  className="px-5 py-2.5 text-sm hover:bg-accent transition-colors active:scale-95"
                >+</button>
              </div>
              {quantity > 1 && (
                <span className="text-sm text-muted-foreground tabular-nums">Total: ₹{total}</span>
              )}
            </div>

            {/* CTA */}
            <button
              onClick={handleOrder}
              className="w-full bg-primary text-primary-foreground px-8 py-5 rounded-2xl font-sans font-medium text-base transition-all hover:brightness-110 active:scale-[0.98]"
            >
              {session ? `Buy Now — ₹${total}` : `Sign In to Order — ₹${total}`}
            </button>

            {/* Trust badges */}
            <div className="grid grid-cols-2 gap-4 pt-2">
              {[
                { icon: Truck, label: "Free Shipping" },
                { icon: Package, label: "COD Available" },
                { icon: Leaf, label: "100% Natural" },
                { icon: ShieldCheck, label: "Secure Payment" },
                { icon: Clock, label: "Ships in 24hrs" },
                { icon: Star, label: "4.9★ Rated" },
              ].map(({ icon: Icon, label }) => (
                <div key={label} className="flex items-center gap-2.5 text-xs text-muted-foreground">
                  <Icon className="w-4 h-4 text-primary/60" />
                  <span className="font-mono uppercase tracking-wider">{label}</span>
                </div>
              ))}
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default OrderSection;
