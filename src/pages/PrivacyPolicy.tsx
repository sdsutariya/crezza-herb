import { Link } from "react-router-dom";
import { ArrowLeft } from "lucide-react";

const PrivacyPolicy = () => {
  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-3xl mx-auto px-6 py-20">
        <Link to="/" className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors mb-12">
          <ArrowLeft className="w-4 h-4" /> Back to Home
        </Link>

        <h1 className="text-4xl font-serif text-foreground mb-8">Privacy Policy</h1>
        <p className="text-sm text-muted-foreground mb-12">Last updated: March 19, 2026</p>

        <div className="prose prose-sm max-w-none space-y-8 text-muted-foreground">
          <section>
            <h2 className="text-xl font-serif text-foreground mb-3">1. Information We Collect</h2>
            <p className="leading-relaxed">We collect information you provide directly: name, email address, shipping address, phone number, and payment details when you place an order. We also collect usage data such as pages visited, browser type, and IP address through cookies and similar technologies.</p>
          </section>

          <section>
            <h2 className="text-xl font-serif text-foreground mb-3">2. How We Use Your Information</h2>
            <p className="leading-relaxed">Your information is used to process orders, provide customer support, send order updates, improve our products and services, and with your consent, send promotional communications about new products and offers.</p>
          </section>

          <section>
            <h2 className="text-xl font-serif text-foreground mb-3">3. Payment Security</h2>
            <p className="leading-relaxed">All payment transactions are processed through Razorpay, a PCI-DSS compliant payment gateway. We do not store your credit card or banking details on our servers. Razorpay's privacy policy governs the handling of your payment information.</p>
          </section>

          <section>
            <h2 className="text-xl font-serif text-foreground mb-3">4. Data Sharing</h2>
            <p className="leading-relaxed">We do not sell your personal information. We may share data with trusted third-party services for order fulfillment (shipping partners), payment processing (Razorpay), and analytics. All partners are bound by confidentiality agreements.</p>
          </section>

          <section>
            <h2 className="text-xl font-serif text-foreground mb-3">5. Cookies</h2>
            <p className="leading-relaxed">We use essential cookies for site functionality and analytics cookies to understand how visitors interact with our website. You can disable cookies through your browser settings, though some features may not work correctly.</p>
          </section>

          <section>
            <h2 className="text-xl font-serif text-foreground mb-3">6. Your Rights</h2>
            <p className="leading-relaxed">You may request access to, correction of, or deletion of your personal data at any time by contacting us at privacy@crezzaherb.com. We will respond to your request within 30 days.</p>
          </section>

          <section>
            <h2 className="text-xl font-serif text-foreground mb-3">7. Contact Us</h2>
            <p className="leading-relaxed">For privacy-related inquiries, contact us at privacy@crezzaherb.com or write to us at CrezzaHerb, India.</p>
          </section>
        </div>
      </div>
    </div>
  );
};

export default PrivacyPolicy;
