import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { User, LogOut, Menu, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import ThemeToggle from "@/components/ThemeToggle";
import Logo from "@/components/Logo";
import type { Session } from "@supabase/supabase-js";

const Navbar = () => {
  const [session, setSession] = useState<Session | null>(null);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
    });
    supabase.auth.getSession().then(({ data: { session } }) => setSession(session));
    return () => subscription.unsubscribe();
  }, []);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    setSession(null);
  };

  return (
    <motion.nav
      initial={{ y: -20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.6, ease: [0.2, 0, 0, 1] }}
      className={`fixed top-0 left-0 right-0 z-50 backdrop-blur-xl border-b transition-all duration-300 ${
        scrolled
          ? "bg-background/95 border-border/20 shadow-sm"
          : "bg-background/80 border-border/[0.08]"
      }`}
    >
      <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
        <Logo linkTo="/" size="nav" className="max-w-[62%] sm:max-w-none" />

        {/* Desktop Nav */}
        <div className="hidden md:flex items-center gap-6">
          <a href="/#results" className="font-mono text-xs uppercase tracking-widest text-muted-foreground hover:text-foreground transition-colors">
            Results
          </a>
          <a href="/#herbarium" className="font-mono text-xs uppercase tracking-widest text-muted-foreground hover:text-foreground transition-colors">
            Ingredients
          </a>
          <a href="/#process" className="font-mono text-xs uppercase tracking-widest text-muted-foreground hover:text-foreground transition-colors">
            Process
          </a>
          <a href="/#testimonials" className="font-mono text-xs uppercase tracking-widest text-muted-foreground hover:text-foreground transition-colors">
            Reviews
          </a>
          <ThemeToggle />
          {session ? (
            <div className="flex items-center gap-3">
              <Link to="/orders" className="font-mono text-xs uppercase tracking-widest text-muted-foreground hover:text-foreground transition-colors">
                My Orders
              </Link>
              <span className="text-xs text-muted-foreground font-mono truncate max-w-[120px]">
                {session.user.user_metadata?.full_name || session.user.user_metadata?.name || session.user.email}
              </span>
              <Button variant="ghost" size="icon" className="h-8 w-8" onClick={handleLogout}>
                <LogOut className="w-4 h-4" />
              </Button>
            </div>
          ) : (
            <Link to="/auth">
              <Button variant="outline" size="sm" className="rounded-full gap-2 h-8 text-xs">
                <User className="w-3.5 h-3.5" /> Sign In
              </Button>
            </Link>
          )}
        </div>

        {/* Mobile toggle */}
        <div className="flex md:hidden items-center gap-2">
          <ThemeToggle />
          <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => setMobileOpen(!mobileOpen)}>
            {mobileOpen ? <X className="w-4 h-4" /> : <Menu className="w-4 h-4" />}
          </Button>
        </div>
      </div>

      {/* Mobile Menu */}
      {mobileOpen && (
        <motion.div
          initial={{ opacity: 0, y: -8 }}
          animate={{ opacity: 1, y: 0 }}
          className="md:hidden bg-background/98 backdrop-blur-xl border-b border-border/[0.08] divide-y divide-border/10"
        >
          {[
            { href: "/#results", label: "Results" },
            { href: "/#herbarium", label: "Ingredients" },
            { href: "/#process", label: "Process" },
            { href: "/#testimonials", label: "Reviews" },
          ].map(({ href, label }) => (
            <a
              key={label}
              href={href}
              onClick={() => setMobileOpen(false)}
              className="block px-6 py-4 font-mono text-xs uppercase tracking-widest text-muted-foreground hover:text-foreground hover:bg-accent/30 transition-colors"
            >
              {label}
            </a>
          ))}
          {session ? (
            <>
              <Link
                to="/orders"
                onClick={() => setMobileOpen(false)}
                className="block px-6 py-4 font-mono text-xs uppercase tracking-widest text-muted-foreground hover:text-foreground hover:bg-accent/30 transition-colors"
              >
                My Orders
              </Link>
              <button
                onClick={() => { handleLogout(); setMobileOpen(false); }}
                className="block w-full text-left px-6 py-4 font-mono text-xs uppercase tracking-widest text-muted-foreground hover:text-foreground hover:bg-accent/30 transition-colors"
              >
                Sign Out
              </button>
            </>
          ) : (
            <Link
              to="/auth"
              onClick={() => setMobileOpen(false)}
              className="block px-6 py-4 font-mono text-xs uppercase tracking-widest text-primary hover:bg-primary/5 transition-colors"
            >
              Sign In
            </Link>
          )}
        </motion.div>
      )}
    </motion.nav>
  );
};

export default Navbar;
