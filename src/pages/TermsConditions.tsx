import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { ArrowLeft, FileText } from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import SEO from "@/components/SEO";

const ease: [number, number, number, number] = [0.16, 1, 0.3, 1];

const sections = [
  {
    title: "1. General",
    body: "By accessing and using crezzaherb.com, you agree to be bound by these Terms & Conditions. CrezzaHerb reserves the right to modify these terms at any time. Continued use of the website constitutes acceptance of the updated terms.",
  },
  {
    title: "2. Products",
    body: "CrezzaHerb Herbal Hair Oil is a cosmetic product for external use only. Results may vary from person to person. We do not claim that our products cure or treat any medical condition. Discontinue use if irritation occurs and consult a dermatologist.",
  },
  {
    title: "3. Pricing & Payment",
    body: "All prices are listed in Indian Rupees (₹) and include applicable taxes. Payment is accepted via UPI at checkout. After placing your order, pay using the UPI ID or QR code provided. Orders are confirmed once payment is verified (typically within 24 hours on business days).",
  },
  {
    title: "4. Shipping & Delivery",
    body: "We offer free shipping across India. Orders are typically dispatched within 1-2 business days and delivered within 5-7 business days. Delivery times may vary based on location and courier availability.",
  },
  {
    title: "5. Returns & Refunds",
    body: "Due to the nature of our product, we accept returns only for damaged or defective items within 7 days of delivery. Contact support@crezzaherb.com with your order details and photos of the damaged product. Refunds are processed within 7-10 business days.",
  },
  {
    title: "6. Intellectual Property",
    body: "All content on this website — including text, images, logos, and product formulations — is the intellectual property of CrezzaHerb. Unauthorized reproduction, distribution, or modification is strictly prohibited.",
  },
  {
    title: "7. Limitation of Liability",
    body: "CrezzaHerb shall not be liable for any indirect, incidental, or consequential damages arising from the use of our products or website. Our total liability shall not exceed the purchase price of the product.",
  },
  {
    title: "8. Contact",
    body: "For questions about these terms, contact us at support@crezzaherb.com.",
  },
];

const TermsConditions = () => {
  return (
    <div className="min-h-screen bg-background">
      <SEO
        title="Terms & Conditions - CrezzaHerb"
        description="Read CrezzaHerb terms for herbal hair oil orders, pricing, payment, shipping, delivery, returns, refunds, and product use."
        path="/terms-conditions"
      />
      <Navbar />
      <div className="pt-24 pb-16 px-6">
        <div className="max-w-3xl mx-auto">
          <Link
            to="/"
            className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors mb-8"
          >
            <ArrowLeft className="w-4 h-4" /> Back to Home
          </Link>

          <motion.div
            initial={{ y: 16, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.6, ease }}
            className="bg-card rounded-[24px] border border-border/10 shadow-sm p-8 md:p-10 mb-6"
          >
            <div className="flex items-start gap-4 mb-6">
              <div className="w-12 h-12 rounded-[14px] bg-primary/10 flex items-center justify-center shrink-0">
                <FileText className="w-5 h-5 text-primary" />
              </div>
              <div className="space-y-2">
                <span className="font-mono text-[10px] uppercase tracking-[0.2em] text-primary">
                  Legal
                </span>
                <h1 className="text-3xl md:text-4xl font-serif text-foreground">Terms & Conditions</h1>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  The terms that govern your use of CrezzaHerb and your orders with us.
                </p>
              </div>
            </div>
            <p className="text-xs font-mono uppercase tracking-wider text-muted-foreground">
              Last updated: March 19, 2026
            </p>
          </motion.div>

          <motion.div
            initial={{ y: 16, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.08, ease }}
            className="bg-card rounded-[24px] border border-border/10 shadow-sm divide-y divide-border/10"
          >
            {sections.map((section) => (
              <section key={section.title} className="p-6 md:p-8">
                <h2 className="text-lg md:text-xl font-serif text-foreground mb-3">{section.title}</h2>
                <p className="text-sm text-muted-foreground leading-relaxed">{section.body}</p>
              </section>
            ))}
          </motion.div>

          <motion.p
            initial={{ y: 12, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.15, ease }}
            className="mt-8 text-center text-sm text-muted-foreground"
          >
            Also read our{" "}
            <Link to="/privacy-policy" className="text-primary hover:underline font-medium">
              Privacy Policy
            </Link>
          </motion.p>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default TermsConditions;
