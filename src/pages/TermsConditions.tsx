import { Link } from "react-router-dom";
import { ArrowLeft } from "lucide-react";

const TermsConditions = () => {
  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-3xl mx-auto px-6 py-20">
        <Link to="/" className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors mb-12">
          <ArrowLeft className="w-4 h-4" /> Back to Home
        </Link>

        <h1 className="text-4xl font-serif text-foreground mb-8">Terms & Conditions</h1>
        <p className="text-sm text-muted-foreground mb-12">Last updated: March 19, 2026</p>

        <div className="prose prose-sm max-w-none space-y-8 text-muted-foreground">
          <section>
            <h2 className="text-xl font-serif text-foreground mb-3">1. General</h2>
            <p className="leading-relaxed">By accessing and using crezzaherb.com, you agree to be bound by these Terms & Conditions. CrezzaHerb reserves the right to modify these terms at any time. Continued use of the website constitutes acceptance of the updated terms.</p>
          </section>

          <section>
            <h2 className="text-xl font-serif text-foreground mb-3">2. Products</h2>
            <p className="leading-relaxed">CrezzaHerb Herbal Hair Oil is a cosmetic product for external use only. Results may vary from person to person. We do not claim that our products cure or treat any medical condition. Discontinue use if irritation occurs and consult a dermatologist.</p>
          </section>

          <section>
            <h2 className="text-xl font-serif text-foreground mb-3">3. Pricing & Payment</h2>
            <p className="leading-relaxed">All prices are listed in Indian Rupees (₹) and include applicable taxes. Payment is processed securely via Razorpay. We accept UPI, credit/debit cards, net banking, and wallets. Cash on Delivery (COD) is available for select pin codes.</p>
          </section>

          <section>
            <h2 className="text-xl font-serif text-foreground mb-3">4. Shipping & Delivery</h2>
            <p className="leading-relaxed">We offer free shipping across India. Orders are typically dispatched within 1-2 business days and delivered within 5-7 business days. Delivery times may vary based on location and courier availability.</p>
          </section>

          <section>
            <h2 className="text-xl font-serif text-foreground mb-3">5. Returns & Refunds</h2>
            <p className="leading-relaxed">Due to the nature of our product, we accept returns only for damaged or defective items within 7 days of delivery. Contact support@crezzaherb.com with your order details and photos of the damaged product. Refunds are processed within 7-10 business days.</p>
          </section>

          <section>
            <h2 className="text-xl font-serif text-foreground mb-3">6. Intellectual Property</h2>
            <p className="leading-relaxed">All content on this website — including text, images, logos, and product formulations — is the intellectual property of CrezzaHerb. Unauthorized reproduction, distribution, or modification is strictly prohibited.</p>
          </section>

          <section>
            <h2 className="text-xl font-serif text-foreground mb-3">7. Limitation of Liability</h2>
            <p className="leading-relaxed">CrezzaHerb shall not be liable for any indirect, incidental, or consequential damages arising from the use of our products or website. Our total liability shall not exceed the purchase price of the product.</p>
          </section>

          <section>
            <h2 className="text-xl font-serif text-foreground mb-3">8. Contact</h2>
            <p className="leading-relaxed">For questions about these terms, contact us at support@crezzaherb.com.</p>
          </section>
        </div>
      </div>
    </div>
  );
};

export default TermsConditions;
