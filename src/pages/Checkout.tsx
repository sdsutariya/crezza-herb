import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { ArrowLeft, Package, ShieldCheck, Minus, Plus, CheckCircle2, Scan } from "lucide-react";
import bottleImg from "@/assets/bottle.png";
import qrImg from "@/assets/qr-placeholder.svg";
import Navbar from "@/components/Navbar";
import type { Session } from "@supabase/supabase-js";

const PRICE = 399;
const MRP = 599;

const indianStates = [
  "Andhra Pradesh", "Arunachal Pradesh", "Assam", "Bihar", "Chhattisgarh",
  "Goa", "Gujarat", "Haryana", "Himachal Pradesh", "Jharkhand", "Karnataka",
  "Kerala", "Madhya Pradesh", "Maharashtra", "Manipur", "Meghalaya", "Mizoram",
  "Nagaland", "Odisha", "Punjab", "Rajasthan", "Sikkim", "Tamil Nadu",
  "Telangana", "Tripura", "Uttar Pradesh", "Uttarakhand", "West Bengal",
  "Delhi", "Jammu & Kashmir", "Ladakh", "Chandigarh",
];

const Checkout = () => {
  const [session, setSession] = useState<Session | null>(null);
  const [searchParams] = useSearchParams();
  const [quantity, setQuantity] = useState(Number(searchParams.get("qty")) || 1);
  const [loading, setLoading] = useState(false);
  const [step, setStep] = useState<"shipping" | "review" | "pay">("shipping");
  const [orderId, setOrderId] = useState<string | null>(null);
  const { toast } = useToast();
  const navigate = useNavigate();

  const [shipping, setShipping] = useState({
    name: "", phone: "", address: "", city: "", state: "", pincode: "",
  });

  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_e, s) => {
      setSession(s);
      if (!s) navigate("/auth");
    });
    supabase.auth.getSession().then(({ data: { session: s } }) => {
      setSession(s);
      if (!s) navigate("/auth");
    });
    return () => subscription.unsubscribe();
  }, [navigate]);

  const total = PRICE * quantity;

  const validateShipping = () => {
    const { name, phone, address, city, state, pincode } = shipping;
    if (!name.trim() || !phone.trim() || !address.trim() || !city.trim() || !state.trim() || !pincode.trim()) {
      toast({ title: "Missing fields", description: "Please fill all shipping details.", variant: "destructive" });
      return false;
    }
    if (!/^\d{10}$/.test(phone.replace(/\s/g, ""))) {
      toast({ title: "Invalid phone", description: "Enter a valid 10-digit phone number.", variant: "destructive" });
      return false;
    }
    if (!/^\d{6}$/.test(pincode)) {
      toast({ title: "Invalid pincode", description: "Enter a valid 6-digit pincode.", variant: "destructive" });
      return false;
    }
    return true;
  };

  const handlePlaceOrder = async () => {
    if (!session) return;
    setLoading(true);
    try {
      const { data, error } = await (supabase.from("orders") as any).insert({
        user_id: session.user.id,
        customer_email: session.user.email,
        quantity,
        unit_price: PRICE,
        total_amount: total,
        shipping_name: shipping.name.trim(),
        shipping_phone: shipping.phone.trim(),
        shipping_address: shipping.address.trim(),
        shipping_city: shipping.city.trim(),
        shipping_state: shipping.state.trim(),
        shipping_pincode: shipping.pincode.trim(),
        status: "pending_payment",
        payment_status: "pending_payment",
        tracking_status: "order_placed",
      }).select().single();

      if (error) throw error;
      setOrderId(data.id);
      setStep("pay");
    } catch (err: any) {
      toast({ title: "Order failed", description: err.message, variant: "destructive" });
    } finally {
      setLoading(false);
    }
  };

  const steps = ["Shipping", "Review", "Pay"];
  const stepIndex = step === "shipping" ? 0 : step === "review" ? 1 : 2;

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <div className="pt-24 pb-16 px-6">
        <div className="max-w-3xl mx-auto">
          <Link to="/" className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors mb-6">
            <ArrowLeft className="w-4 h-4" /> Back to Shop
          </Link>

          <motion.h1
            initial={{ y: 12, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
            className="text-2xl md:text-3xl font-serif text-foreground mb-8"
          >
            Checkout
          </motion.h1>

          {/* Progress */}
          <div className="flex items-center gap-2 mb-8">
            {steps.map((label, i) => (
              <div key={label} className="flex items-center gap-2">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-medium transition-colors ${
                  i === stepIndex
                    ? "bg-primary text-primary-foreground"
                    : i < stepIndex
                    ? "bg-primary/20 text-primary"
                    : "bg-muted text-muted-foreground"
                }`}>
                  {i < stepIndex ? <CheckCircle2 className="w-4 h-4" /> : i + 1}
                </div>
                <span className="text-xs font-mono uppercase tracking-wider text-muted-foreground hidden sm:inline">{label}</span>
                {i < steps.length - 1 && <div className="w-8 h-px bg-border" />}
              </div>
            ))}
          </div>

          <div className="grid md:grid-cols-5 gap-6">
            {/* Main content */}
            <div className="md:col-span-3">

              {/* Step 1: Shipping */}
              {step === "shipping" && (
                <motion.div
                  initial={{ x: -12, opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                  transition={{ duration: 0.4 }}
                  className="bg-card rounded-[20px] p-6 md:p-8 shadow-sm space-y-5"
                >
                  <h2 className="font-serif text-lg text-foreground">Shipping Details</h2>
                  <div className="grid sm:grid-cols-2 gap-4">
                    <div>
                      <label className="text-xs font-mono uppercase tracking-wider text-muted-foreground mb-1.5 block">Full Name *</label>
                      <Input value={shipping.name} onChange={(e) => setShipping({ ...shipping, name: e.target.value })} placeholder="Rahul Sharma" className="h-11 rounded-[10px]" maxLength={100} />
                    </div>
                    <div>
                      <label className="text-xs font-mono uppercase tracking-wider text-muted-foreground mb-1.5 block">Phone *</label>
                      <Input type="tel" value={shipping.phone} onChange={(e) => setShipping({ ...shipping, phone: e.target.value })} placeholder="9876543210" className="h-11 rounded-[10px]" maxLength={10} />
                    </div>
                  </div>
                  <div>
                    <label className="text-xs font-mono uppercase tracking-wider text-muted-foreground mb-1.5 block">Address *</label>
                    <Input value={shipping.address} onChange={(e) => setShipping({ ...shipping, address: e.target.value })} placeholder="House No, Street, Landmark" className="h-11 rounded-[10px]" maxLength={300} />
                  </div>
                  <div className="grid sm:grid-cols-3 gap-4">
                    <div>
                      <label className="text-xs font-mono uppercase tracking-wider text-muted-foreground mb-1.5 block">City *</label>
                      <Input value={shipping.city} onChange={(e) => setShipping({ ...shipping, city: e.target.value })} placeholder="Jaipur" className="h-11 rounded-[10px]" maxLength={50} />
                    </div>
                    <div>
                      <label className="text-xs font-mono uppercase tracking-wider text-muted-foreground mb-1.5 block">State *</label>
                      <select
                        value={shipping.state}
                        onChange={(e) => setShipping({ ...shipping, state: e.target.value })}
                        className="h-11 w-full rounded-[10px] border border-input bg-background px-3 text-sm"
                      >
                        <option value="">Select</option>
                        {indianStates.map((s) => <option key={s} value={s}>{s}</option>)}
                      </select>
                    </div>
                    <div>
                      <label className="text-xs font-mono uppercase tracking-wider text-muted-foreground mb-1.5 block">Pincode *</label>
                      <Input value={shipping.pincode} onChange={(e) => setShipping({ ...shipping, pincode: e.target.value.replace(/\D/g, "") })} placeholder="302001" className="h-11 rounded-[10px]" maxLength={6} />
                    </div>
                  </div>
                  <Button
                    className="w-full h-12 rounded-[12px] font-medium"
                    onClick={() => { if (validateShipping()) setStep("review"); }}
                  >
                    Continue to Review
                  </Button>
                </motion.div>
              )}

              {/* Step 2: Review */}
              {step === "review" && (
                <motion.div
                  initial={{ x: 12, opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                  transition={{ duration: 0.4 }}
                  className="space-y-4"
                >
                  <div className="bg-card rounded-[20px] p-6 shadow-sm space-y-3">
                    <div className="flex items-center justify-between">
                      <h2 className="font-serif text-lg text-foreground">Shipping To</h2>
                      <button onClick={() => setStep("shipping")} className="text-xs text-primary hover:underline font-mono uppercase tracking-wider">Edit</button>
                    </div>
                    <div className="text-sm text-muted-foreground space-y-0.5">
                      <p className="text-foreground font-medium">{shipping.name}</p>
                      <p>{shipping.address}</p>
                      <p>{shipping.city}, {shipping.state} — {shipping.pincode}</p>
                      <p>Phone: {shipping.phone}</p>
                    </div>
                  </div>

                  <div className="bg-card rounded-[20px] p-6 shadow-sm space-y-3">
                    <h2 className="font-serif text-lg text-foreground">Payment Method</h2>
                    <div className="flex items-center gap-3 p-3 rounded-[12px] border-2 border-primary bg-primary/5">
                      <div className="w-4 h-4 rounded-full border-2 border-primary flex items-center justify-center">
                        <div className="w-2 h-2 rounded-full bg-primary" />
                      </div>
                      <div>
                        <p className="text-sm font-medium text-foreground">UPI / QR Code Payment</p>
                        <p className="text-xs text-muted-foreground">Scan QR and upload your payment screenshot</p>
                      </div>
                      <Scan className="w-5 h-5 text-primary ml-auto" />
                    </div>
                  </div>

                  <Button
                    className="w-full h-12 rounded-[12px] font-medium"
                    onClick={handlePlaceOrder}
                    disabled={loading}
                  >
                    {loading ? "Creating Order..." : `Proceed to Pay — ₹${total}`}
                  </Button>
                </motion.div>
              )}

              {/* Step 3: Pay */}
              {step === "pay" && (
                <motion.div
                  initial={{ x: 12, opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                  transition={{ duration: 0.4 }}
                  className="space-y-4"
                >
                  <div className="bg-card rounded-[20px] p-6 md:p-8 shadow-sm space-y-6">
                    <div className="text-center space-y-2">
                      <h2 className="font-serif text-xl text-foreground">Scan & Pay</h2>
                      <p className="text-xs font-mono text-muted-foreground uppercase tracking-wider">
                        Order #{orderId?.slice(0, 8).toUpperCase()}
                      </p>
                    </div>

                    {/* QR Code */}
                    <div className="flex flex-col items-center gap-4">
                      <div className="p-4 bg-white rounded-[16px] shadow-sm border border-border/30">
                        <img src={qrImg} alt="UPI Payment QR Code" className="w-48 h-48 object-contain" />
                      </div>
                      <div className="text-center space-y-1">
                        <p className="text-2xl font-serif text-foreground">₹{total}</p>
                        <p className="text-xs text-muted-foreground font-mono">Scan with any UPI app to pay</p>
                        <p className="text-xs text-muted-foreground">PhonePe · GPay · Paytm · BHIM</p>
                      </div>
                    </div>

                    <div className="h-px bg-border/30" />

                    <Button
                      className="w-full h-12 rounded-[12px] font-medium"
                      onClick={() => navigate("/orders")}
                    >
                      I've Completed the Payment
                    </Button>
                  </div>

                  {/* Trust note */}
                  <div className="flex items-start gap-3 p-4 bg-primary/5 rounded-[12px] border border-primary/10">
                    <ShieldCheck className="w-4 h-4 text-primary mt-0.5 shrink-0" />
                  <p className="text-xs text-muted-foreground leading-relaxed">
                    Your payment will be verified manually within a few hours. You'll receive a confirmation email once verified. Check your order status anytime on the My Orders page.
                  </p>
                  </div>
                </motion.div>
              )}
            </div>

            {/* Order Summary sidebar */}
            <motion.div
              initial={{ y: 12, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.5, delay: 0.15 }}
              className="md:col-span-2"
            >
              <div className="bg-card rounded-[20px] p-6 shadow-sm space-y-5 sticky top-24">
                <h3 className="font-serif text-lg text-foreground">Order Summary</h3>
                <div className="flex gap-4">
                  <img src={bottleImg} alt="CrezzaHerb Hair Oil" className="w-16 h-20 object-contain" />
                  <div className="flex-1">
                    <p className="text-sm font-medium text-foreground">CrezzaHerb Herbal Hair Oil</p>
                    <p className="text-xs text-muted-foreground">100ml · Cold-Pressed</p>
                    {step !== "pay" && (
                      <div className="flex items-center gap-3 mt-2">
                        <button onClick={() => setQuantity(Math.max(1, quantity - 1))} className="w-7 h-7 rounded-full border border-border flex items-center justify-center hover:bg-accent transition-colors">
                          <Minus className="w-3 h-3" />
                        </button>
                        <span className="text-sm font-medium w-6 text-center">{quantity}</span>
                        <button onClick={() => setQuantity(Math.min(5, quantity + 1))} className="w-7 h-7 rounded-full border border-border flex items-center justify-center hover:bg-accent transition-colors">
                          <Plus className="w-3 h-3" />
                        </button>
                      </div>
                    )}
                    {step === "pay" && (
                      <p className="text-xs text-muted-foreground mt-1">Qty: {quantity}</p>
                    )}
                  </div>
                </div>

                <div className="space-y-2 pt-4 border-t border-border/50">
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Subtotal ({quantity}x)</span>
                    <span className="text-foreground">₹{total}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Shipping</span>
                    <span className="text-primary font-medium">Free</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">You save</span>
                    <span className="text-primary font-medium">₹{(MRP - PRICE) * quantity}</span>
                  </div>
                  <div className="flex justify-between font-medium pt-2 border-t border-border/50">
                    <span className="text-foreground">Total</span>
                    <span className="text-foreground text-lg">₹{total}</span>
                  </div>
                </div>

                <div className="space-y-2 pt-2">
                  {[
                    { icon: Package, label: "Free delivery across India" },
                    { icon: ShieldCheck, label: "100% authentic & natural" },
                  ].map(({ icon: Icon, label }) => (
                    <div key={label} className="flex items-center gap-2 text-xs text-muted-foreground">
                      <Icon className="w-3.5 h-3.5 text-primary" />
                      <span>{label}</span>
                    </div>
                  ))}
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Checkout;
