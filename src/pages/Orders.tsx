import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Link, useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { ArrowLeft, Package, Truck, CheckCircle2, Clock, MapPin } from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import type { Session } from "@supabase/supabase-js";

const statusSteps = [
  { key: "order_placed", label: "Order Placed", icon: Package },
  { key: "processing", label: "Processing", icon: Clock },
  { key: "shipped", label: "Shipped", icon: Truck },
  { key: "out_for_delivery", label: "Out for Delivery", icon: MapPin },
  { key: "delivered", label: "Delivered", icon: CheckCircle2 },
];

const statusIndex = (status: string) => statusSteps.findIndex((s) => s.key === status);

interface Order {
  id: string;
  quantity: number;
  total_amount: number;
  status: string;
  tracking_status: string;
  tracking_id: string | null;
  shipping_name: string;
  shipping_city: string;
  shipping_state: string;
  shipping_pincode: string;
  shipping_address: string;
  shipping_phone: string;
  payment_status: string;
  created_at: string;
  estimated_delivery: string | null;
}

const Orders = () => {
  const [session, setSession] = useState<Session | null>(null);
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

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

  useEffect(() => {
    if (!session) return;
    const fetchOrders = async () => {
      const { data, error } = await supabase
        .from("orders")
        .select("*")
        .order("created_at", { ascending: false });
      if (!error && data) setOrders(data as Order[]);
      setLoading(false);
    };
    fetchOrders();
  }, [session]);

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <div className="pt-24 pb-16 px-6">
        <div className="max-w-3xl mx-auto">
          <Link to="/" className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors mb-6">
            <ArrowLeft className="w-4 h-4" /> Back to Home
          </Link>

          <motion.h1
            initial={{ y: 12, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
            className="text-2xl md:text-3xl font-serif text-foreground mb-8"
          >
            My Orders
          </motion.h1>

          {loading ? (
            <div className="space-y-4">
              {[1, 2].map((i) => (
                <div key={i} className="bg-card rounded-[20px] p-6 animate-pulse h-48" />
              ))}
            </div>
          ) : orders.length === 0 ? (
            <motion.div
              initial={{ y: 12, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              className="bg-card rounded-[20px] p-12 text-center shadow-sm"
            >
              <Package className="w-12 h-12 text-muted-foreground/40 mx-auto mb-4" />
              <h2 className="font-serif text-xl text-foreground mb-2">No orders yet</h2>
              <p className="text-sm text-muted-foreground mb-6">Start your hair transformation journey today.</p>
              <Link to="/#order" className="inline-flex items-center bg-primary text-primary-foreground px-6 py-3 rounded-[12px] text-sm font-medium hover:brightness-110 transition-all active:scale-[0.98]">
                Shop Now
              </Link>
            </motion.div>
          ) : (
            <div className="space-y-6">
              {orders.map((order, idx) => {
                const currentStep = statusIndex(order.tracking_status);
                return (
                  <motion.div
                    key={order.id}
                    initial={{ y: 16, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ duration: 0.5, delay: idx * 0.08 }}
                    className="bg-card rounded-[20px] p-6 shadow-sm space-y-5"
                  >
                    {/* Header */}
                    <div className="flex flex-wrap items-start justify-between gap-4">
                      <div>
                        <p className="font-mono text-xs uppercase tracking-wider text-muted-foreground">
                          Order #{order.id.slice(0, 8).toUpperCase()}
                        </p>
                        <p className="text-xs text-muted-foreground mt-0.5">
                          Placed on {new Date(order.created_at).toLocaleDateString("en-IN", { day: "numeric", month: "long", year: "numeric" })}
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="text-lg font-serif text-foreground">₹{order.total_amount}</p>
                        <p className="text-xs text-muted-foreground">{order.quantity}x Hair Oil · {order.payment_status === "cod" ? "COD" : "Paid"}</p>
                      </div>
                    </div>

                    {/* Tracking Steps */}
                    <div className="flex items-center justify-between gap-1">
                      {statusSteps.map((s, i) => {
                        const Icon = s.icon;
                        const isActive = i <= currentStep;
                        const isCurrent = i === currentStep;
                        return (
                          <div key={s.key} className="flex-1 flex flex-col items-center gap-1.5 relative">
                            <div className={`w-8 h-8 rounded-full flex items-center justify-center transition-colors ${
                              isCurrent ? "bg-primary text-primary-foreground" : isActive ? "bg-primary/20 text-primary" : "bg-muted text-muted-foreground"
                            }`}>
                              <Icon className="w-3.5 h-3.5" />
                            </div>
                            <span className={`text-[10px] font-mono uppercase tracking-wider text-center leading-tight ${
                              isActive ? "text-foreground" : "text-muted-foreground/60"
                            }`}>
                              {s.label}
                            </span>
                            {i < statusSteps.length - 1 && (
                              <div className={`absolute top-4 left-[calc(50%+16px)] right-[calc(-50%+16px)] h-px ${
                                i < currentStep ? "bg-primary" : "bg-border"
                              }`} />
                            )}
                          </div>
                        );
                      })}
                    </div>

                    {/* Shipping details */}
                    <div className="pt-3 border-t border-border/30 grid sm:grid-cols-2 gap-4 text-xs text-muted-foreground">
                      <div>
                        <p className="font-mono uppercase tracking-wider mb-1">Shipping to</p>
                        <p className="text-foreground text-sm">{order.shipping_name}</p>
                        <p>{order.shipping_address}</p>
                        <p>{order.shipping_city}, {order.shipping_state} — {order.shipping_pincode}</p>
                      </div>
                      <div>
                        <p className="font-mono uppercase tracking-wider mb-1">Contact</p>
                        <p>{order.shipping_phone}</p>
                        {order.tracking_id && (
                          <>
                            <p className="font-mono uppercase tracking-wider mb-1 mt-3">Tracking ID</p>
                            <p className="text-foreground text-sm font-medium">{order.tracking_id}</p>
                          </>
                        )}
                        {order.estimated_delivery && (
                          <>
                            <p className="font-mono uppercase tracking-wider mb-1 mt-3">Est. Delivery</p>
                            <p className="text-foreground text-sm">{new Date(order.estimated_delivery).toLocaleDateString("en-IN", { day: "numeric", month: "long" })}</p>
                          </>
                        )}
                      </div>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          )}
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default Orders;
