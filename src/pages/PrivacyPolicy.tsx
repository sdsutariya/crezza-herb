import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { ArrowLeft, Shield } from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import SEO from "@/components/SEO";

const ease: [number, number, number, number] = [0.16, 1, 0.3, 1];

const sections = [
  {
    title: "1. Information We Collect",
    body: "We collect information you provide directly: name, email address, shipping address, phone number, and payment details when you place an order. We also collect usage data such as pages visited, browser type, and IP address through cookies and similar technologies.",
  },
  {
    title: "2. How We Use Your Information",
    body: "Your information is used to process orders, provide customer support, send order updates, improve our products and services, and with your consent, send promotional communications about new products and offers.",
  },
  {
    title: "3. Payment Security",
    body: "All payment transactions are processed through Razorpay, a PCI-DSS compliant payment gateway. We do not store your credit card or banking details on our servers. Razorpay's privacy policy governs the handling of your payment information.",
  },
  {
    title: "4. Data Sharing",
    body: "We do not sell your personal information. We may share data with trusted third-party services for order fulfillment (shipping partners), payment processing (Razorpay), and analytics. All partners are bound by confidentiality agreements.",
  },
  {
    title: "5. Cookies",
    body: "We use essential cookies for site functionality and analytics cookies to understand how visitors interact with our website. You can disable cookies through your browser settings, though some features may not work correctly.",
  },
  {
    title: "6. Your Rights",
    body: "You may request access to, correction of, or deletion of your personal data at any time by contacting us at privacy@crezzaherb.com. We will respond to your request within 30 days.",
  },
  {
    title: "7. Contact Us",
    body: "For privacy-related inquiries, contact us at privacy@crezzaherb.com or write to us at CrezzaHerb, India.",
  },
];

const PrivacyPolicy = () => {
  return (
    <div className="min-h-screen bg-background">
      <SEO
        title="Privacy Policy - CrezzaHerb"
        description="Read the CrezzaHerb Privacy Policy to understand how customer, order, shipping, payment, and support information is collected and used."
        path="/privacy-policy"
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
                <Shield className="w-5 h-5 text-primary" />
              </div>
              <div className="space-y-2">
                <span className="font-mono text-[10px] uppercase tracking-[0.2em] text-primary">
                  Legal
                </span>
                <h1 className="text-3xl md:text-4xl font-serif text-foreground">Privacy Policy</h1>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  How CrezzaHerb collects, uses, and protects your personal information.
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
            <Link to="/terms-conditions" className="text-primary hover:underline font-medium">
              Terms & Conditions
            </Link>
          </motion.p>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default PrivacyPolicy;
