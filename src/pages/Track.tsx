import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Link, useParams } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { ArrowLeft, Package, Truck, MapPin, Clock, CheckCircle2, AlertCircle, ShieldCheck } from "lucide-react";
import Navbar from "@/components/Navbar";
import SEO from "@/components/SEO";

interface Order {
  id: string;
  created_at: string;
  shipping_name: string;
  shipping_address: string;
  shipping_city: string;
  shipping_state: string;
  shipping_pincode: string;
  quantity: number;
  total_amount: number;
  tracking_status: string;
  tracking_id: string | null;
  estimated_delivery: string | null;
  payment_status: string;
  status: string;
}

const STEPS = [
  {
    key: "order_placed",
    label: "Order Placed",
    description: "Your order has been received and is being reviewed.",
    icon: Package,
  },
  {
    key: "processing",
    label: "Processing",
    description: "We are preparing your order for dispatch.",
    icon: Clock,
  },
  {
    key: "shipped",
    label: "Shipped",
    description: "Your order has been handed over to the courier.",
    icon: Truck,
  },
  {
    key: "out_for_delivery",
    label: "Out for Delivery",
    description: "Your package is on its way to you today.",
    icon: MapPin,
  },
  {
    key: "delivered",
    label: "Delivered",
    description: "Your order has been delivered successfully.",
    icon: CheckCircle2,
  },
];

const Track = () => {
  const { orderId } = useParams<{ orderId: string }>();
  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);

  useEffect(() => {
    if (!orderId) { setNotFound(true); setLoading(false); return; }
    const fetchOrder = async () => {
      const { data, error } = await supabase
        .from("orders")
        .select("id, created_at, shipping_name, shipping_address, shipping_city, shipping_state, shipping_pincode, quantity, total_amount, tracking_status, tracking_id, estimated_delivery, payment_status, status")
        .eq("id", orderId)
        .single();
      if (error || !data) { setNotFound(true); } else { setOrder(data as unknown as Order); }
      setLoading(false);
    };
    fetchOrder();
  }, [orderId]);

  const currentStepIdx = order ? STEPS.findIndex((s) => s.key === order.tracking_status) : -1;

  return (
    <div className="min-h-screen bg-background">
      <SEO
        title="Track CrezzaHerb Order"
        description="Track your CrezzaHerb Herbal Hair Oil order status, payment verification, dispatch progress, and estimated delivery."
        path={orderId ? `/track/${orderId}` : "/track"}
        noindex
      />
      <Navbar />
      <div className="pt-24 pb-16 px-6">
        <div className="max-w-2xl mx-auto">
          <Link
            to="/orders"
            className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors mb-6"
          >
            <ArrowLeft className="w-4 h-4" /> My Orders
          </Link>

          <motion.h1
            initial={{ y: 12, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
            className="text-2xl md:text-3xl font-serif text-foreground mb-8"
          >
            Track Order
          </motion.h1>

          {loading ? (
            <div className="space-y-4">
              <div className="bg-card rounded-[20px] p-6 animate-pulse h-32" />
              <div className="bg-card rounded-[20px] p-6 animate-pulse h-64" />
            </div>
          ) : notFound ? (
            <motion.div
              initial={{ y: 12, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              className="bg-card rounded-[20px] p-12 text-center shadow-sm"
            >
              <AlertCircle className="w-12 h-12 text-muted-foreground/40 mx-auto mb-4" />
              <h2 className="font-serif text-xl text-foreground mb-2">Order not found</h2>
              <p className="text-sm text-muted-foreground mb-6">This order ID does not exist or is unavailable.</p>
              <Link
                to="/orders"
                className="inline-flex items-center bg-primary text-primary-foreground px-6 py-3 rounded-[12px] text-sm font-medium hover:brightness-110 transition-all"
              >
                View My Orders
              </Link>
            </motion.div>
          ) : order ? (
            <div className="space-y-5">
              {/* Order summary card */}
              <motion.div
                initial={{ y: 12, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ duration: 0.45 }}
                className="bg-card rounded-[20px] p-6 shadow-sm"
              >
                <div className="flex flex-wrap items-start justify-between gap-4 mb-4">
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
                    <p className="text-xs text-muted-foreground">{order.quantity}x Hair Oil</p>
                  </div>
                </div>

                <div className="grid sm:grid-cols-2 gap-4 text-xs text-muted-foreground pt-4 border-t border-border/30">
                  <div>
                    <p className="font-mono uppercase tracking-wider mb-1">Delivering to</p>
                    <p className="text-foreground text-sm font-medium">{order.shipping_name}</p>
                    <p>{order.shipping_address}</p>
                    <p>{order.shipping_city}, {order.shipping_state} — {order.shipping_pincode}</p>
                  </div>
                  <div>
                    {order.tracking_id && (
                      <div className="mb-3">
                        <p className="font-mono uppercase tracking-wider mb-1">Courier Tracking ID</p>
                        <p className="text-foreground text-sm font-medium font-mono">{order.tracking_id}</p>
                      </div>
                    )}
                    {order.estimated_delivery && (
                      <div>
                        <p className="font-mono uppercase tracking-wider mb-1">Estimated Delivery</p>
                        <p className="text-foreground text-sm font-medium">
                          {new Date(order.estimated_delivery).toLocaleDateString("en-IN", { weekday: "long", day: "numeric", month: "long" })}
                        </p>
                      </div>
                    )}
                  </div>
                </div>
              </motion.div>

              {order.payment_status === "pending_payment" && (
                <motion.div
                  initial={{ y: 12, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ duration: 0.4, delay: 0.05 }}
                  className="flex items-start gap-3 rounded-[20px] border border-amber-500/20 bg-amber-500/5 p-4 md:p-5"
                >
                  <ShieldCheck className="w-4 h-4 text-amber-600 dark:text-amber-400 mt-0.5 shrink-0" />
                  <div className="space-y-1">
                    <p className="text-sm font-medium text-foreground">Payment pending verification</p>
                    <p className="text-xs text-muted-foreground leading-relaxed">
                      Your order is in line for a quick manual UPI check—confirmation is not instant. Delivery steps below will move forward once payment is verified (typically within 24 hours).
                    </p>
                  </div>
                </motion.div>
              )}

              {/* Vertical timeline */}
              <motion.div
                initial={{ y: 12, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ duration: 0.45, delay: 0.1 }}
                className="bg-card rounded-[20px] p-6 md:p-8 shadow-sm"
              >
                <h2 className="font-serif text-lg text-foreground mb-6">Delivery Timeline</h2>
                <div className="space-y-0">
                  {STEPS.map((step, i) => {
                    const Icon = step.icon;
                    const isCompleted = i < currentStepIdx;
                    const isCurrent = i === currentStepIdx;
                    const isPending = i > currentStepIdx;
                    const isLast = i === STEPS.length - 1;

                    return (
                      <div key={step.key} className="flex gap-4">
                        {/* Icon + connector */}
                        <div className="flex flex-col items-center">
                          <motion.div
                            initial={isCurrent ? { scale: 0.8 } : {}}
                            animate={isCurrent ? { scale: [1, 1.08, 1] } : {}}
                            transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
                            className={`w-10 h-10 rounded-full flex items-center justify-center shrink-0 transition-colors ${
                              isCurrent
                                ? "bg-primary text-primary-foreground shadow-md"
                                : isCompleted
                                ? "bg-primary/20 text-primary"
                                : "bg-muted text-muted-foreground/30"
                            }`}
                          >
                            <Icon className="w-4 h-4" />
                          </motion.div>
                          {!isLast && (
                            <div className={`w-0.5 flex-1 min-h-[36px] mt-1 mb-1 rounded-full transition-colors ${
                              isCompleted ? "bg-primary/40" : "bg-border/50"
                            }`} />
                          )}
                        </div>

                        {/* Content */}
                        <div className={`pb-6 flex-1 pt-1.5 ${isLast ? "pb-0" : ""}`}>
                          <p className={`text-sm font-medium transition-colors ${
                            isCurrent ? "text-foreground" : isCompleted ? "text-foreground" : "text-muted-foreground/50"
                          }`}>
                            {step.label}
                            {isCurrent && (
                              <span className="ml-2 text-[10px] font-mono uppercase tracking-wider text-primary bg-primary/10 px-2 py-0.5 rounded-full">
                                Current
                              </span>
                            )}
                          </p>
                          <p className={`text-xs mt-0.5 leading-relaxed ${
                            isPending ? "text-muted-foreground/40" : "text-muted-foreground"
                          }`}>
                            {step.description}
                          </p>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </motion.div>
            </div>
          ) : null}
        </div>
      </div>
    </div>
  );
};

export default Track;
