import { useState } from "react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { ArrowLeft, Mail, Phone, MapPin, Send } from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import SEO from "@/components/SEO";
import { SITE_URL } from "@/lib/seo";

const contactStructuredData = {
  "@context": "https://schema.org",
  "@type": "ContactPage",
  name: "Contact CrezzaHerb",
  url: `${SITE_URL}/contact`,
  mainEntity: {
    "@type": "Organization",
    name: "CrezzaHerb",
    email: "support@crezzaherb.com",
    telephone: "+919876543210",
    address: {
      "@type": "PostalAddress",
      addressLocality: "Jaipur",
      addressRegion: "Rajasthan",
      addressCountry: "IN",
    },
  },
};

const Contact = () => {
  const [form, setForm] = useState({ name: "", email: "", phone: "", subject: "", message: "" });
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name.trim() || !form.email.trim() || !form.subject.trim() || !form.message.trim()) {
      toast({ title: "Missing fields", description: "Please fill all required fields.", variant: "destructive" });
      return;
    }
    setLoading(true);
    try {
      const { error } = await supabase.from("contact_inquiries").insert({
        name: form.name.trim(),
        email: form.email.trim(),
        phone: form.phone.trim() || null,
        subject: form.subject.trim(),
        message: form.message.trim(),
      });
      if (error) throw error;
      toast({ title: "Message sent!", description: "We'll get back to you within 24 hours." });
      setForm({ name: "", email: "", phone: "", subject: "", message: "" });
    } catch (err: any) {
      toast({ title: "Error", description: err.message, variant: "destructive" });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <SEO
        title="Contact CrezzaHerb - Herbal Hair Oil Support"
        description="Contact CrezzaHerb for herbal hair oil questions, order support, delivery help, product guidance, and customer care in India."
        path="/contact"
        keywords={[
          "contact CrezzaHerb",
          "CrezzaHerb support",
          "hair oil customer care",
          "CrezzaHerb order help",
        ]}
        structuredData={contactStructuredData}
      />
      <Navbar />
      <div className="pt-24 pb-16 px-6">
        <div className="max-w-5xl mx-auto">
          <Link to="/" className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors mb-8">
            <ArrowLeft className="w-4 h-4" /> Back to Home
          </Link>

          <motion.div
            initial={{ y: 16, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
            className="text-center mb-12 space-y-3"
          >
            <h1 className="text-3xl md:text-4xl font-serif text-foreground">Get in Touch</h1>
            <p className="text-muted-foreground text-sm max-w-md mx-auto">Have a question about our hair oil or your order? We're here to help.</p>
          </motion.div>

          <div className="grid md:grid-cols-5 gap-8">
            {/* Contact Info */}
            <motion.div
              initial={{ x: -16, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ duration: 0.6, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
              className="md:col-span-2 space-y-6"
            >
              <div className="bg-card rounded-[20px] p-6 space-y-6 shadow-sm">
                {[
                  { icon: Mail, label: "Email", value: "support@crezzaherb.com", href: "mailto:support@crezzaherb.com" },
                  { icon: Phone, label: "Phone", value: "+91 98765 43210", href: "tel:+919876543210" },
                  { icon: MapPin, label: "Address", value: "CrezzaHerb Naturals, Jaipur, Rajasthan, India" },
                ].map(({ icon: Icon, label, value, href }) => (
                  <div key={label} className="flex gap-3">
                    <div className="w-10 h-10 rounded-[12px] bg-primary/10 flex items-center justify-center shrink-0">
                      <Icon className="w-4 h-4 text-primary" />
                    </div>
                    <div>
                      <p className="font-mono text-xs uppercase tracking-wider text-muted-foreground">{label}</p>
                      {href ? (
                        <a href={href} className="text-sm text-foreground hover:text-primary transition-colors">{value}</a>
                      ) : (
                        <p className="text-sm text-foreground">{value}</p>
                      )}
                    </div>
                  </div>
                ))}
              </div>

              <div className="bg-card rounded-[20px] p-6 shadow-sm">
                <h3 className="font-serif text-lg text-foreground mb-2">Business Hours</h3>
                <div className="space-y-1 text-sm text-muted-foreground">
                  <p>Monday – Saturday: 10 AM – 7 PM IST</p>
                  <p>Sunday: Closed</p>
                </div>
              </div>
            </motion.div>

            {/* Contact Form */}
            <motion.div
              initial={{ x: 16, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ duration: 0.6, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
              className="md:col-span-3"
            >
              <form onSubmit={handleSubmit} className="bg-card rounded-[20px] p-6 md:p-8 shadow-sm space-y-5">
                <div className="grid sm:grid-cols-2 gap-4">
                  <div>
                    <label className="text-xs font-mono uppercase tracking-wider text-muted-foreground mb-1.5 block">Name *</label>
                    <Input
                      value={form.name}
                      onChange={(e) => setForm({ ...form, name: e.target.value })}
                      placeholder="Your name"
                      className="h-11 rounded-[10px]"
                      required
                      maxLength={100}
                    />
                  </div>
                  <div>
                    <label className="text-xs font-mono uppercase tracking-wider text-muted-foreground mb-1.5 block">Email *</label>
                    <Input
                      type="email"
                      value={form.email}
                      onChange={(e) => setForm({ ...form, email: e.target.value })}
                      placeholder="you@example.com"
                      className="h-11 rounded-[10px]"
                      required
                      maxLength={255}
                    />
                  </div>
                </div>
                <div className="grid sm:grid-cols-2 gap-4">
                  <div>
                    <label className="text-xs font-mono uppercase tracking-wider text-muted-foreground mb-1.5 block">Phone</label>
                    <Input
                      type="tel"
                      value={form.phone}
                      onChange={(e) => setForm({ ...form, phone: e.target.value })}
                      placeholder="+91 XXXXX XXXXX"
                      className="h-11 rounded-[10px]"
                      maxLength={15}
                    />
                  </div>
                  <div>
                    <label className="text-xs font-mono uppercase tracking-wider text-muted-foreground mb-1.5 block">Subject *</label>
                    <Input
                      value={form.subject}
                      onChange={(e) => setForm({ ...form, subject: e.target.value })}
                      placeholder="Order inquiry, Product question..."
                      className="h-11 rounded-[10px]"
                      required
                      maxLength={200}
                    />
                  </div>
                </div>
                <div>
                  <label className="text-xs font-mono uppercase tracking-wider text-muted-foreground mb-1.5 block">Message *</label>
                  <Textarea
                    value={form.message}
                    onChange={(e) => setForm({ ...form, message: e.target.value })}
                    placeholder="Tell us how we can help..."
                    className="rounded-[10px] min-h-[120px]"
                    required
                    maxLength={1000}
                  />
                </div>
                <Button type="submit" className="w-full h-12 rounded-[12px] font-medium gap-2" disabled={loading}>
                  <Send className="w-4 h-4" />
                  {loading ? "Sending..." : "Send Message"}
                </Button>
              </form>
            </motion.div>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default Contact;
