import { useState, useEffect, useCallback } from "react";
import { motion } from "framer-motion";
import { Link, useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { ArrowLeft, Package, Truck, CheckCircle2, Clock, MapPin, ChevronLeft, ChevronRight } from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import type { Session } from "@supabase/supabase-js";
import type { Tables } from "@/integrations/supabase/types";

const PAGE_SIZE = 10;
const ID_SEARCH_FETCH_LIMIT = 2000;

const statusSteps = [
  { key: "order_placed", label: "Order Placed", icon: Package },
  { key: "processing", label: "Processing", icon: Clock },
  { key: "shipped", label: "Shipped", icon: Truck },
  { key: "out_for_delivery", label: "Out for Delivery", icon: MapPin },
  { key: "delivered", label: "Delivered", icon: CheckCircle2 },
] as const;

const statusIndex = (status: string) => statusSteps.findIndex((s) => s.key === status);

type Order = Tables<"orders">;

const paymentFilterOptions = [
  { value: "", label: "All payments" },
  { value: "pending_payment", label: "Payment pending verification" },
  { value: "verified", label: "Verified" },
  { value: "rejected", label: "Rejected" },
] as const;

const Orders = () => {
  const [session, setSession] = useState<Session | null>(null);
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [totalCount, setTotalCount] = useState(0);
  const [page, setPage] = useState(1);
  const [idSearch, setIdSearch] = useState("");
  const [paymentFilter, setPaymentFilter] = useState<string>("");
  const [trackingFilter, setTrackingFilter] = useState<string>("");
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
    setPage(1);
  }, [idSearch, paymentFilter, trackingFilter]);

  const fetchOrders = useCallback(async () => {
    if (!session) return;
    setLoading(true);
    const uid = session.user.id;
    const normId = idSearch.replace(/-/g, "").toLowerCase().trim();
    const hasIdSearch = normId.length > 0;

    try {
      if (!hasIdSearch) {
        let q = supabase
          .from("orders")
          .select("*", { count: "exact" })
          .eq("user_id", uid)
          .order("created_at", { ascending: false });
        if (paymentFilter) q = q.eq("payment_status", paymentFilter);
        if (trackingFilter) q = q.eq("tracking_status", trackingFilter);
        const from = (page - 1) * PAGE_SIZE;
        const to = from + PAGE_SIZE - 1;
        const { data, error, count } = await q.range(from, to);
        if (error) throw error;
        setOrders((data ?? []) as Order[]);
        setTotalCount(count ?? 0);
      } else {
        let q = supabase
          .from("orders")
          .select("id, created_at, payment_status, tracking_status")
          .eq("user_id", uid)
          .order("created_at", { ascending: false })
          .limit(ID_SEARCH_FETCH_LIMIT);
        if (paymentFilter) q = q.eq("payment_status", paymentFilter);
        if (trackingFilter) q = q.eq("tracking_status", trackingFilter);
        const { data: skinny, error } = await q;
        if (error) throw error;
        const filtered = (skinny ?? []).filter((row) =>
          row.id.replace(/-/g, "").toLowerCase().includes(normId)
        );
        setTotalCount(filtered.length);
        const slice = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);
        const ids = slice.map((r) => r.id);
        if (ids.length === 0) {
          setOrders([]);
        } else {
          const { data: full, error: fullErr } = await supabase
            .from("orders")
            .select("*")
            .in("id", ids);
          if (fullErr) throw fullErr;
          const map = new Map((full ?? []).map((o) => [o.id, o]));
          setOrders(ids.map((id) => map.get(id)).filter(Boolean) as Order[]);
        }
      }
    } finally {
      setLoading(false);
    }
  }, [session, page, idSearch, paymentFilter, trackingFilter]);

  useEffect(() => {
    if (!session) return;
    void fetchOrders();
  }, [session, fetchOrders]);

  const totalPages = Math.max(1, Math.ceil(totalCount / PAGE_SIZE));

  useEffect(() => {
    if (page > totalPages) setPage(totalPages);
  }, [page, totalPages]);

  const hasActiveFilters = Boolean(paymentFilter || trackingFilter || idSearch.trim());

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
            className="text-2xl md:text-3xl font-serif text-foreground mb-6"
          >
            My Orders
          </motion.h1>

          <div className="flex flex-col gap-3 sm:flex-row sm:flex-wrap sm:items-end mb-6">
            <div className="flex-1 min-w-[200px]">
              <label className="text-[10px] font-mono uppercase tracking-wider text-muted-foreground mb-1.5 block">Order ID</label>
              <Input
                placeholder="First 8 characters…"
                value={idSearch}
                onChange={(e) => setIdSearch(e.target.value)}
                className="h-10 rounded-[10px]"
              />
            </div>
            <div className="w-full sm:w-40">
              <label className="text-[10px] font-mono uppercase tracking-wider text-muted-foreground mb-1.5 block">Payment</label>
              <select
                value={paymentFilter}
                onChange={(e) => setPaymentFilter(e.target.value)}
                className="h-10 w-full rounded-[10px] border border-input bg-background px-3 text-sm"
              >
                {paymentFilterOptions.map((o) => (
                  <option key={o.value || "all"} value={o.value}>{o.label}</option>
                ))}
              </select>
            </div>
            <div className="w-full sm:w-48">
              <label className="text-[10px] font-mono uppercase tracking-wider text-muted-foreground mb-1.5 block">Tracking</label>
              <select
                value={trackingFilter}
                onChange={(e) => setTrackingFilter(e.target.value)}
                className="h-10 w-full rounded-[10px] border border-input bg-background px-3 text-sm"
              >
                <option value="">All stages</option>
                {statusSteps.map((s) => (
                  <option key={s.key} value={s.key}>{s.label}</option>
                ))}
              </select>
            </div>
          </div>

          {totalCount > 0 && !loading && (
            <div className="flex flex-wrap items-center justify-between gap-3 mb-6 text-xs font-mono text-muted-foreground">
              <span>{totalCount} order{totalCount === 1 ? "" : "s"} · Page {page} / {totalPages}</span>
              <div className="flex items-center gap-2">
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  className="h-9 rounded-[10px] gap-1"
                  disabled={page <= 1}
                  onClick={() => setPage((p) => Math.max(1, p - 1))}
                >
                  <ChevronLeft className="w-4 h-4" /> Prev
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  className="h-9 rounded-[10px] gap-1"
                  disabled={page >= totalPages}
                  onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                >
                  Next <ChevronRight className="w-4 h-4" />
                </Button>
              </div>
            </div>
          )}

          {loading ? (
            <div className="space-y-4">
              {[1, 2].map((i) => (
                <div key={i} className="bg-card rounded-[20px] p-6 animate-pulse h-48" />
              ))}
            </div>
          ) : totalCount === 0 ? (
            <motion.div
              initial={{ y: 12, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              className="bg-card rounded-[20px] p-12 text-center shadow-sm"
            >
              <Package className="w-12 h-12 text-muted-foreground/40 mx-auto mb-4" />
              <h2 className="font-serif text-xl text-foreground mb-2">
                {hasActiveFilters ? "No matching orders" : "No orders yet"}
              </h2>
              <p className="text-sm text-muted-foreground mb-6">
                {hasActiveFilters ? "Try different filters or clear the order ID search." : "Start your hair transformation journey today."}
              </p>
              {!hasActiveFilters && (
                <Link to="/#order" className="inline-flex items-center bg-primary text-primary-foreground px-6 py-3 rounded-[12px] text-sm font-medium hover:brightness-110 transition-all active:scale-[0.98]">
                  Shop Now
                </Link>
              )}
            </motion.div>
          ) : (
            <div className="space-y-6">
              {orders.map((order, idx) => {
                const tracking = order.tracking_status ?? "order_placed";
                const payment = order.payment_status ?? "";
                const currentStep = statusIndex(tracking);
                return (
                  <motion.div
                    key={order.id}
                    initial={{ y: 16, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ duration: 0.5, delay: idx * 0.08 }}
                    className="bg-card rounded-[20px] p-6 shadow-sm space-y-5"
                  >
                    <div className="flex flex-wrap items-start justify-between gap-4">
                      <div>
                        <p className="font-mono text-xs uppercase tracking-wider text-muted-foreground">
                          Order #{order.id.slice(0, 8).toUpperCase()}
                        </p>
                        <p className="text-xs text-muted-foreground mt-0.5">
                          Placed on {new Date(order.created_at).toLocaleDateString("en-IN", { day: "numeric", month: "long", year: "numeric" })}
                        </p>
                        {payment === "pending_payment" && (
                          <div className="mt-2 space-y-1">
                            <span className="inline-block text-[10px] font-mono uppercase tracking-wider px-2.5 py-1 rounded-full bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400">
                              Payment pending verification
                            </span>
                            <p className="text-xs text-muted-foreground max-w-md leading-relaxed">
                              Next step: we match your UPI payment to this order—usually within 24 hours. No action needed unless we contact you.
                            </p>
                          </div>
                        )}
                        {payment === "verified" && (
                          <span className="inline-block mt-2 text-[10px] font-mono uppercase tracking-wider px-2.5 py-1 rounded-full bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400">
                            Payment Verified
                          </span>
                        )}
                        {payment === "rejected" && (
                          <span className="inline-block mt-2 text-[10px] font-mono uppercase tracking-wider px-2.5 py-1 rounded-full bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400">
                            Payment Rejected — contact support
                          </span>
                        )}
                      </div>
                      <div className="text-right">
                        <p className="text-lg font-serif text-foreground">₹{order.total_amount}</p>
                        <p className="text-xs text-muted-foreground">{order.quantity}x Hair Oil · UPI</p>
                      </div>
                    </div>

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

                    <div className="pt-3 border-t border-border/30">
                      <Link
                        to={`/track/${order.id}`}
                        className="inline-flex items-center gap-2 text-xs font-mono uppercase tracking-wider text-primary hover:text-primary/80 transition-colors"
                      >
                        <Truck className="w-3.5 h-3.5" /> Track Order
                      </Link>
                    </div>

                    <div className="grid sm:grid-cols-2 gap-4 text-xs text-muted-foreground">
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
