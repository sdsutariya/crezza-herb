import { useState, useEffect, useCallback } from "react";
import { motion } from "framer-motion";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import {
  Lock, CheckCircle2, XCircle, RefreshCw, LogOut, Eye,
  Package, Truck, MapPin, Clock, LayoutDashboard, IndianRupee,
  ShoppingBag, AlertCircle, ChevronLeft, ChevronRight,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import type { Tables } from "@/integrations/supabase/types";

type OrderRow = Tables<"orders">;
type PaymentOrder = Pick<OrderRow,
  | "id" | "created_at" | "customer_email" | "shipping_name" | "shipping_phone"
  | "shipping_address" | "shipping_city" | "shipping_state" | "shipping_pincode"
  | "quantity" | "total_amount" | "payment_status" | "status"
>;

type FulfillmentOrder = Pick<OrderRow,
  | "id" | "created_at" | "customer_email" | "shipping_name" | "shipping_phone"
  | "shipping_address" | "shipping_city" | "shipping_state" | "shipping_pincode"
  | "quantity" | "total_amount" | "tracking_status" | "tracking_id" | "estimated_delivery" | "status"
>;

const PAYMENT_SELECT =
  "id, created_at, customer_email, shipping_name, shipping_phone, shipping_address, shipping_city, shipping_state, shipping_pincode, quantity, total_amount, payment_status, status";

const FULFILLMENT_SELECT =
  "id, created_at, customer_email, shipping_name, shipping_phone, shipping_address, shipping_city, shipping_state, shipping_pincode, quantity, total_amount, tracking_status, tracking_id, estimated_delivery, status";

const TRACKING_STEPS = [
  { key: "order_placed", label: "Order Placed", icon: Package },
  { key: "processing", label: "Processing", icon: Clock },
  { key: "shipped", label: "Shipped", icon: Truck },
  { key: "out_for_delivery", label: "Out for Delivery", icon: MapPin },
  { key: "delivered", label: "Delivered", icon: CheckCircle2 },
];

const PAGE_SIZE = 10;
const LIST_CAP = 2000;

const ADMIN_PASSWORD = import.meta.env.VITE_ADMIN_PASSWORD;
const RESEND_API_KEY = import.meta.env.VITE_RESEND_API_KEY;
const RESEND_FROM = import.meta.env.VITE_RESEND_FROM;

function isLikelyIdTokenSearch(term: string): boolean {
  const t = term.trim();
  if (t.length < 4) return false;
  if (t.includes("@")) return false;
  return /^[0-9a-f\s-]+$/i.test(t);
}

type DashboardStats = {
  totalOrders: number;
  confirmedOrders: number;
  pendingPaymentOrders: number;
  pendingFulfillment: number;
  paymentRejected: number;
  revenueVerifiedConfirmed: number | null;
  ordersByStatus: { status: string; count: number }[];
};

function parseSumRow(data: unknown): number | null {
  if (data == null) return null;
  if (typeof data === "object") {
    const o = data as Record<string, unknown>;
    if (typeof o.sum === "number") return o.sum;
    for (const v of Object.values(o)) {
      if (typeof v === "object" && v !== null && "sum" in v && typeof (v as { sum: unknown }).sum === "number") {
        return (v as { sum: number }).sum;
      }
    }
  }
  return null;
}

const Admin = () => {
  const [authed, setAuthed] = useState(() => sessionStorage.getItem("admin_authed") === "1");
  const [passwordInput, setPasswordInput] = useState("");
  const [showPass, setShowPass] = useState(false);
  const [activeTab, setActiveTab] = useState<"payment" | "fulfillment">("payment");

  const [paymentOrders, setPaymentOrders] = useState<PaymentOrder[]>([]);
  const [paymentLoading, setPaymentLoading] = useState(false);
  const [paymentPage, setPaymentPage] = useState(1);
  const [paymentSearch, setPaymentSearch] = useState("");
  const [paymentTotalCount, setPaymentTotalCount] = useState(0);

  const [fulfillmentOrders, setFulfillmentOrders] = useState<FulfillmentOrder[]>([]);
  const [fulfillmentLoading, setFulfillmentLoading] = useState(false);
  const [fulfillmentPage, setFulfillmentPage] = useState(1);
  const [fulfillmentSearch, setFulfillmentSearch] = useState("");
  const [fulfillmentTotalCount, setFulfillmentTotalCount] = useState(0);

  const [trackingEdits, setTrackingEdits] = useState<Record<string, {
    tracking_status: string;
    tracking_id: string;
    estimated_delivery: string;
  }>>({});

  const [actionLoading, setActionLoading] = useState<string | null>(null);
  const [updateLoading, setUpdateLoading] = useState<string | null>(null);
  const [dashboardLoading, setDashboardLoading] = useState(false);
  const [dashboard, setDashboard] = useState<DashboardStats | null>(null);

  const { toast } = useToast();

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (passwordInput === ADMIN_PASSWORD) {
      sessionStorage.setItem("admin_authed", "1");
      setAuthed(true);
    } else {
      toast({ title: "Wrong password", variant: "destructive" });
    }
  };

  const handleLogout = () => {
    sessionStorage.removeItem("admin_authed");
    setAuthed(false);
    setPasswordInput("");
  };

  /*
   * Revenue = sum of total_amount for rows where payment was verified and the order
   * lifecycle status is confirmed (counted sales), excluding pending / rejected checkouts.
   */
  const fetchDashboardStats = useCallback(async () => {
    setDashboardLoading(true);
    try {
      const orderStatuses = ["pending_payment", "confirmed"] as const;
      const [
        totalRes,
        confirmedRes,
        pendingPayRes,
        pendingFulfillRes,
        rejectedPayRes,
        revenueRes,
        ...statusBuckets
      ] = await Promise.all([
        supabase.from("orders").select("*", { count: "exact", head: true }),
        supabase.from("orders").select("*", { count: "exact", head: true }).eq("status", "confirmed"),
        supabase.from("orders").select("*", { count: "exact", head: true }).eq("payment_status", "pending_payment"),
        supabase.from("orders")
          .select("*", { count: "exact", head: true })
          .eq("status", "confirmed")
          .neq("tracking_status", "delivered"),
        supabase.from("orders").select("*", { count: "exact", head: true }).eq("payment_status", "rejected"),
        supabase
          .from("orders")
          .select("total_amount.sum()")
          .eq("payment_status", "verified")
          .eq("status", "confirmed")
          .maybeSingle(),
        ...orderStatuses.map((st) =>
          supabase.from("orders").select("*", { count: "exact", head: true }).eq("status", st)
        ),
      ]);

      const revenueParsed = revenueRes.error ? null : parseSumRow(revenueRes.data);

      setDashboard({
        totalOrders: totalRes.count ?? 0,
        confirmedOrders: confirmedRes.count ?? 0,
        pendingPaymentOrders: pendingPayRes.count ?? 0,
        pendingFulfillment: pendingFulfillRes.count ?? 0,
        paymentRejected: rejectedPayRes.count ?? 0,
        revenueVerifiedConfirmed: revenueParsed,
        ordersByStatus: orderStatuses.map((st, i) => ({
          status: st,
          count: statusBuckets[i]?.count ?? 0,
        })),
      });
    } finally {
      setDashboardLoading(false);
    }
  }, []);

  const mergeTrackingEdits = useCallback((orders: FulfillmentOrder[]) => {
    setTrackingEdits((prev) => {
      const next = { ...prev };
      orders.forEach((o) => {
        next[o.id] = {
          tracking_status: o.tracking_status ?? "order_placed",
          tracking_id: o.tracking_id ?? "",
          estimated_delivery: o.estimated_delivery
            ? o.estimated_delivery.split("T")[0]
            : "",
        };
      });
      return next;
    });
  }, []);

  const fetchPaymentOrders = useCallback(async () => {
    setPaymentLoading(true);
    const term = paymentSearch.trim();
    const idToken = isLikelyIdTokenSearch(term);

    try {
      let qb = supabase
        .from("orders")
        .select(PAYMENT_SELECT, { count: "exact" })
        .eq("payment_status", "pending_payment")
        .order("created_at", { ascending: false });

      if (term && !idToken) {
        const wild = `%${term}%`;
        qb = qb.or(`customer_email.ilike.${wild},shipping_name.ilike.${wild},shipping_phone.ilike.${wild}`);
      }

      if (idToken) {
        const { data, error } = await qb.limit(LIST_CAP);
        if (error) throw error;
        const rows = (data ?? []) as PaymentOrder[];
        const norm = term.replace(/-/g, "").toLowerCase();
        const filtered = rows.filter((o) => o.id.replace(/-/g, "").toLowerCase().includes(norm));
        setPaymentTotalCount(filtered.length);
        const slice = filtered.slice((paymentPage - 1) * PAGE_SIZE, paymentPage * PAGE_SIZE);
        setPaymentOrders(slice);
      } else {
        const from = (paymentPage - 1) * PAGE_SIZE;
        const to = from + PAGE_SIZE - 1;
        const { data, error, count } = await qb.range(from, to);
        if (error) throw error;
        setPaymentOrders((data ?? []) as PaymentOrder[]);
        setPaymentTotalCount(count ?? 0);
      }
    } catch (e: unknown) {
      console.error(e);
      toast({ title: "Failed to load payments", variant: "destructive" });
    } finally {
      setPaymentLoading(false);
    }
  }, [paymentPage, paymentSearch, toast]);

  const fetchFulfillmentOrders = useCallback(async () => {
    setFulfillmentLoading(true);
    const term = fulfillmentSearch.trim();
    const idToken = isLikelyIdTokenSearch(term);

    try {
      let qb = supabase
        .from("orders")
        .select(FULFILLMENT_SELECT, { count: "exact" })
        .eq("status", "confirmed")
        .neq("tracking_status", "delivered")
        .order("created_at", { ascending: false });

      if (term && !idToken) {
        const wild = `%${term}%`;
        qb = qb.or(`customer_email.ilike.${wild},shipping_name.ilike.${wild},shipping_phone.ilike.${wild}`);
      }

      if (idToken) {
        const { data, error } = await qb.limit(LIST_CAP);
        if (error) throw error;
        const rows = (data ?? []) as FulfillmentOrder[];
        const norm = term.replace(/-/g, "").toLowerCase();
        const filtered = rows.filter((o) => o.id.replace(/-/g, "").toLowerCase().includes(norm));
        setFulfillmentTotalCount(filtered.length);
        const slice = filtered.slice((fulfillmentPage - 1) * PAGE_SIZE, fulfillmentPage * PAGE_SIZE);
        setFulfillmentOrders(slice);
        mergeTrackingEdits(slice);
      } else {
        const from = (fulfillmentPage - 1) * PAGE_SIZE;
        const to = from + PAGE_SIZE - 1;
        const { data, error, count } = await qb.range(from, to);
        if (error) throw error;
        const rows = (data ?? []) as FulfillmentOrder[];
        setFulfillmentOrders(rows);
        setFulfillmentTotalCount(count ?? 0);
        mergeTrackingEdits(rows);
      }
    } catch (e: unknown) {
      console.error(e);
      toast({ title: "Failed to load fulfillment", variant: "destructive" });
    } finally {
      setFulfillmentLoading(false);
    }
  }, [fulfillmentPage, fulfillmentSearch, mergeTrackingEdits, toast]);

  useEffect(() => {
    if (!authed) return;
    void fetchDashboardStats();
  }, [authed, fetchDashboardStats]);

  useEffect(() => {
    if (!authed) return;
    void fetchPaymentOrders();
  }, [authed, fetchPaymentOrders]);

  useEffect(() => {
    if (!authed) return;
    void fetchFulfillmentOrders();
  }, [authed, fetchFulfillmentOrders]);

  useEffect(() => {
    setPaymentPage(1);
  }, [paymentSearch]);

  useEffect(() => {
    setFulfillmentPage(1);
  }, [fulfillmentSearch]);

  const refreshLists = () => {
    void fetchDashboardStats();
    void fetchPaymentOrders();
    void fetchFulfillmentOrders();
  };

  const paymentTotalPages = Math.max(1, Math.ceil(paymentTotalCount / PAGE_SIZE));
  const fulfillmentTotalPages = Math.max(1, Math.ceil(fulfillmentTotalCount / PAGE_SIZE));

  useEffect(() => {
    if (paymentPage > paymentTotalPages) setPaymentPage(paymentTotalPages);
  }, [paymentPage, paymentTotalPages]);

  useEffect(() => {
    if (fulfillmentPage > fulfillmentTotalPages) setFulfillmentPage(fulfillmentTotalPages);
  }, [fulfillmentPage, fulfillmentTotalPages]);

  const sendConfirmationEmail = async (order: PaymentOrder) => {
    if (!RESEND_API_KEY || RESEND_API_KEY === "re_your_resend_api_key_here") return;
    try {
      await fetch("https://api.resend.com/emails", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${RESEND_API_KEY}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          from: RESEND_FROM,
          to: [order.customer_email ?? ""],
          subject: "Your CrezzaHerb Order is Confirmed!",
          html: `
            <div style="font-family:sans-serif;max-width:560px;margin:auto;padding:32px;background:#fafaf8;border-radius:16px;">
              <h1 style="font-family:serif;color:#1a1a12;margin-bottom:8px;">Order Confirmed!</h1>
              <p style="color:#555;font-size:14px;">Hi ${order.shipping_name}, your payment has been verified and your order is confirmed.</p>
              <div style="background:#fff;border:1px solid #e5e7eb;border-radius:12px;padding:20px;margin:24px 0;">
                <p style="font-size:12px;color:#888;text-transform:uppercase;letter-spacing:0.1em;margin:0 0 8px;">Order Details</p>
                <p style="font-size:18px;font-weight:600;color:#1a1a12;margin:0 0 4px;">Order #${order.id.slice(0, 8).toUpperCase()}</p>
                <p style="color:#555;font-size:14px;margin:0 0 4px;">CrezzaHerb Herbal Hair Oil × ${order.quantity}</p>
                <p style="font-size:20px;color:#3a6b2a;font-weight:700;margin:8px 0 0;">₹${order.total_amount}</p>
              </div>
              <div style="background:#fff;border:1px solid #e5e7eb;border-radius:12px;padding:20px;margin:0 0 24px;">
                <p style="font-size:12px;color:#888;text-transform:uppercase;letter-spacing:0.1em;margin:0 0 8px;">Shipping To</p>
                <p style="color:#1a1a12;font-size:14px;margin:0;">${order.shipping_address}, ${order.shipping_city}, ${order.shipping_state} — ${order.shipping_pincode}</p>
              </div>
              <p style="color:#555;font-size:13px;">Your order will be shipped within 24–48 hours. Track your order status on our website.</p>
              <p style="color:#888;font-size:12px;margin-top:24px;">CrezzaHerb Naturals · Jaipur, Rajasthan, India</p>
            </div>
          `,
        }),
      });
    } catch (err) {
      console.error("Email send failed:", err);
    }
  };

  const handleVerify = async (order: PaymentOrder) => {
    setActionLoading(order.id);
    try {
      const { error } = await supabase
        .from("orders")
        .update({ payment_status: "verified", status: "confirmed" })
        .eq("id", order.id);
      if (error) throw error;
      await sendConfirmationEmail(order);
      toast({ title: "Order verified!", description: `Order #${order.id.slice(0, 8).toUpperCase()} confirmed and email sent.` });
      setPaymentOrders((prev) => prev.filter((o) => o.id !== order.id));
      refreshLists();
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Unknown error";
      toast({ title: "Error", description: msg, variant: "destructive" });
    } finally {
      setActionLoading(null);
    }
  };

  const handleReject = async (order: PaymentOrder) => {
    setActionLoading(`reject-${order.id}`);
    try {
      const { error } = await supabase
        .from("orders")
        .update({ payment_status: "rejected" })
        .eq("id", order.id);
      if (error) throw error;
      toast({ title: "Order rejected", description: `Order #${order.id.slice(0, 8).toUpperCase()} marked as rejected.`, variant: "destructive" });
      setPaymentOrders((prev) => prev.filter((o) => o.id !== order.id));
      refreshLists();
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Unknown error";
      toast({ title: "Error", description: msg, variant: "destructive" });
    } finally {
      setActionLoading(null);
    }
  };

  const handleUpdateTracking = async (order: FulfillmentOrder) => {
    const edit = trackingEdits[order.id];
    if (!edit) return;
    setUpdateLoading(order.id);
    try {
      const { error } = await supabase
        .from("orders")
        .update({
          tracking_status: edit.tracking_status,
          tracking_id: edit.tracking_id || null,
          estimated_delivery: edit.estimated_delivery || null,
        })
        .eq("id", order.id);
      if (error) throw error;
      toast({ title: "Tracking updated!", description: `Order #${order.id.slice(0, 8).toUpperCase()} updated to "${edit.tracking_status.replace(/_/g, " ")}".` });
      if (edit.tracking_status === "delivered") {
        setFulfillmentOrders((prev) => prev.filter((o) => o.id !== order.id));
        refreshLists();
      } else {
        setFulfillmentOrders((prev) =>
          prev.map((o) => o.id === order.id
            ? {
              ...o,
              tracking_status: edit.tracking_status,
              tracking_id: edit.tracking_id || null,
              estimated_delivery: edit.estimated_delivery || null,
            }
            : o
          )
        );
        void fetchDashboardStats();
      }
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Unknown error";
      toast({ title: "Error", description: msg, variant: "destructive" });
    } finally {
      setUpdateLoading(null);
    }
  };

  if (!authed) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center px-6">
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.5 }}
          className="w-full max-w-sm"
        >
          <div className="bg-card rounded-[24px] shadow-sm border border-border/10 p-8 space-y-6">
            <div className="text-center space-y-2">
              <div className="w-12 h-12 rounded-2xl bg-primary/10 flex items-center justify-center mx-auto">
                <Lock className="w-5 h-5 text-primary" />
              </div>
              <h1 className="text-2xl font-serif text-foreground">Admin Panel</h1>
              <p className="text-sm text-muted-foreground">CrezzaHerb order management</p>
            </div>
            <form onSubmit={handleLogin} className="space-y-4">
              <div className="relative">
                <Input
                  type={showPass ? "text" : "password"}
                  placeholder="Admin password"
                  value={passwordInput}
                  onChange={(e) => setPasswordInput(e.target.value)}
                  className="h-12 rounded-[12px] pr-10"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPass((v) => !v)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                  tabIndex={-1}
                >
                  <Eye className="w-4 h-4" />
                </button>
              </div>
              <Button type="submit" className="w-full h-12 rounded-[12px]">Sign In</Button>
            </form>
          </div>
        </motion.div>
      </div>
    );
  }

  const isLoading = activeTab === "payment" ? paymentLoading : fulfillmentLoading;

  const StatCard = ({
    label,
    value,
    icon: Icon,
    sub,
    tone = "default",
  }: {
    label: string;
    value: string | number;
    icon: typeof LayoutDashboard;
    sub?: string;
    tone?: "default" | "success" | "warn" | "muted";
  }) => {
    const ring =
      tone === "success" ? "border-emerald-500/15 bg-emerald-500/5" :
        tone === "warn" ? "border-amber-500/15 bg-amber-500/5" :
          tone === "muted" ? "border-border/50 bg-muted/20" :
            "border-border/15 bg-card";
    return (
      <div className={`rounded-[16px] border p-4 shadow-sm ${ring}`}>
        <div className="flex items-start justify-between gap-3">
          <div>
            <p className="text-[10px] font-mono uppercase tracking-wider text-muted-foreground">{label}</p>
            <p className="mt-2 text-2xl font-serif text-foreground tabular-nums">{value}</p>
            {sub && <p className="mt-1 text-xs text-muted-foreground">{sub}</p>}
          </div>
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-background/80 border border-border/20">
            <Icon className="h-5 w-5 text-primary" />
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="sticky top-0 z-40 border-b border-border/10 bg-background/95 backdrop-blur-xl">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
          <div>
            <p className="text-[10px] font-mono uppercase tracking-wider text-muted-foreground">CrezzaHerb</p>
            <h1 className="font-serif text-xl text-foreground">Admin Panel</h1>
          </div>
          <div className="flex items-center gap-4">
            <button
              type="button"
              onClick={refreshLists}
              disabled={isLoading || dashboardLoading}
              className="flex items-center gap-2 text-xs font-mono uppercase tracking-wider text-muted-foreground hover:text-foreground transition-colors"
            >
              <RefreshCw className={`h-3.5 w-3.5 ${isLoading || dashboardLoading ? "animate-spin" : ""}`} />
              Refresh
            </button>
            <button
              type="button"
              onClick={handleLogout}
              className="flex items-center gap-2 text-xs font-mono uppercase tracking-wider text-muted-foreground hover:text-foreground transition-colors"
            >
              <LogOut className="h-3.5 w-3.5" /> Logout
            </button>
          </div>
        </div>

        <div className="mx-auto flex max-w-6xl gap-1 px-6 pb-0">
          {(["payment", "fulfillment"] as const).map((tab) => (
            <button
              key={tab}
              type="button"
              onClick={() => setActiveTab(tab)}
              className={`rounded-t-lg px-5 py-2.5 text-xs font-mono uppercase tracking-wider transition-colors ${
                activeTab === tab
                  ? "border border-b-card border-border/20 bg-card text-foreground"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              {tab === "payment" ? (
                <span className="flex items-center gap-1.5">
                  Payment Verify
                  {paymentTotalCount > 0 && (
                    <span className="rounded-full bg-amber-500 px-1.5 py-0.5 text-[10px] leading-none text-white">
                      {paymentTotalCount}
                    </span>
                  )}
                </span>
              ) : (
                <span className="flex items-center gap-1.5">
                  Fulfillment
                  {fulfillmentTotalCount > 0 && (
                    <span className="rounded-full bg-primary px-1.5 py-0.5 text-[10px] leading-none text-primary-foreground">
                      {fulfillmentTotalCount}
                    </span>
                  )}
                </span>
              )}
            </button>
          ))}
        </div>
      </div>

      <div className="mx-auto max-w-6xl space-y-10 px-6 py-10">
        <section className="space-y-4">
          <div className="flex items-center gap-2">
            <LayoutDashboard className="h-4 w-4 text-muted-foreground" />
            <h2 className="font-serif text-lg text-foreground">Overview</h2>
            {dashboardLoading && <span className="text-xs text-muted-foreground font-mono">Updating…</span>}
          </div>
          {dashboard && (
            <>
              <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                <StatCard label="Total orders" value={dashboard.totalOrders} icon={ShoppingBag} />
                <StatCard label="Confirmed orders" value={dashboard.confirmedOrders} icon={CheckCircle2} tone="success" />
                <StatCard label="Pending payment" value={dashboard.pendingPaymentOrders} icon={Clock} tone="warn" />
                <StatCard label="Pending fulfillment" value={dashboard.pendingFulfillment} icon={Truck} />
                <StatCard
                  label="Revenue (verified + confirmed)"
                  value={dashboard.revenueVerifiedConfirmed == null ? "—" : `₹${dashboard.revenueVerifiedConfirmed.toLocaleString("en-IN")}`}
                  icon={IndianRupee}
                  tone="success"
                  sub={dashboard.revenueVerifiedConfirmed == null ? "Sum aggregate unavailable or error" : undefined}
                />
                <StatCard label="Payment rejected" value={dashboard.paymentRejected} icon={AlertCircle} tone="muted" />
              </div>
              <div className="rounded-[16px] border border-border/15 bg-card/50 p-4 shadow-sm">
                <p className="text-[10px] font-mono uppercase tracking-wider text-muted-foreground mb-3">Orders by status</p>
                <div className="flex flex-wrap gap-3">
                  {dashboard.ordersByStatus.map((row) => (
                    <div key={row.status} className="rounded-[12px] border border-border/20 bg-background px-3 py-2">
                      <p className="text-[10px] font-mono uppercase text-muted-foreground">{row.status.replace(/_/g, " ")}</p>
                      <p className="text-lg font-serif tabular-nums">{row.count}</p>
                    </div>
                  ))}
                </div>
              </div>
            </>
          )}
        </section>

        <section className="space-y-4">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <h2 className="font-serif text-lg text-foreground">
                {activeTab === "payment" ? "Payment verification" : "Fulfillment"}
              </h2>
              <p className="text-sm text-muted-foreground">
                Search by order id fragment, email, name, or phone. Hex-only terms match id.
              </p>
            </div>
          </div>

          {activeTab === "payment" && (
            <>
              <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
                <Input
                  placeholder="Search…"
                  value={paymentSearch}
                  onChange={(e) => setPaymentSearch(e.target.value)}
                  className="h-10 max-w-md rounded-[10px]"
                />
                {paymentTotalCount > 0 && !paymentLoading && (
                  <div className="flex flex-wrap items-center gap-2 text-xs font-mono text-muted-foreground">
                    <span>
                      {paymentTotalCount} pending · Page {paymentPage} / {paymentTotalPages}
                    </span>
                    <div className="flex gap-2">
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        className="h-9 rounded-[10px]"
                        disabled={paymentPage <= 1}
                        onClick={() => setPaymentPage((p) => Math.max(1, p - 1))}
                      >
                        <ChevronLeft className="h-4 w-4" />
                      </Button>
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        className="h-9 rounded-[10px]"
                        disabled={paymentPage >= paymentTotalPages}
                        onClick={() => setPaymentPage((p) => Math.min(paymentTotalPages, p + 1))}
                      >
                        <ChevronRight className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                )}
              </div>

              {paymentLoading ? (
                <div className="space-y-4">
                  {[1, 2].map((i) => <div key={i} className="h-44 animate-pulse rounded-[20px] bg-card p-6" />)}
                </div>
              ) : paymentOrders.length === 0 ? (
                <motion.div
                  initial={{ y: 12, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  className="rounded-[20px] bg-card p-12 text-center shadow-sm"
                >
                  <CheckCircle2 className="mx-auto mb-4 h-12 w-12 text-primary/30" />
                  <h3 className="mb-2 font-serif text-xl text-foreground">
                    {paymentSearch.trim() ? "No matches" : "All caught up!"}
                  </h3>
                  <p className="text-sm text-muted-foreground">
                    {paymentSearch.trim() ? "Try a different search term." : "No pending payment verifications."}
                  </p>
                </motion.div>
              ) : (
                <div className="space-y-6">
                  <p className="font-mono text-sm text-muted-foreground">
                    Showing {paymentOrders.length} of {paymentTotalCount} awaiting verification
                  </p>
                  {paymentOrders.map((order, idx) => (
                    <motion.div
                      key={order.id}
                      initial={{ y: 16, opacity: 0 }}
                      animate={{ y: 0, opacity: 1 }}
                      transition={{ delay: idx * 0.06 }}
                      className="space-y-5 rounded-[20px] bg-card p-6 shadow-sm"
                    >
                      <div className="flex flex-wrap items-start justify-between gap-4">
                        <div>
                          <p className="font-mono text-xs uppercase tracking-wider text-muted-foreground">
                            Order #{order.id.slice(0, 8).toUpperCase()}
                          </p>
                          <p className="mt-0.5 text-xs text-muted-foreground">
                            {new Date(order.created_at).toLocaleString("en-IN")}
                          </p>
                        </div>
                        <div className="text-right">
                          <p className="font-serif text-xl text-foreground">₹{order.total_amount}</p>
                          <p className="text-xs text-muted-foreground">{order.quantity}x Hair Oil</p>
                        </div>
                      </div>
                      <p className="text-xs text-muted-foreground border-b border-border/30 pb-3">
                        UPI/QR payment—confirm the received amount matches ₹{order.total_amount} before verifying.
                      </p>
                      <div className="grid gap-4 text-sm sm:grid-cols-2">
                        <div className="space-y-1">
                          <p className="font-mono text-[10px] uppercase tracking-wider text-muted-foreground">Customer</p>
                          <p className="font-medium text-foreground">{order.shipping_name}</p>
                          <p className="text-muted-foreground">{order.customer_email ?? "—"}</p>
                          <p className="text-muted-foreground">{order.shipping_phone}</p>
                        </div>
                        <div className="space-y-1">
                          <p className="font-mono text-[10px] uppercase tracking-wider text-muted-foreground">Shipping To</p>
                          <p className="text-muted-foreground">{order.shipping_address}</p>
                          <p className="text-muted-foreground">{order.shipping_city}, {order.shipping_state} — {order.shipping_pincode}</p>
                        </div>
                      </div>
                      <div className="flex flex-col gap-3 border-t border-border/30 pt-2 sm:flex-row">
                        <Button
                          className="h-11 flex-1 gap-2 rounded-[12px] bg-green-600 text-white hover:bg-green-700"
                          onClick={() => handleVerify(order)}
                          disabled={actionLoading === order.id}
                        >
                          <CheckCircle2 className="h-4 w-4" />
                          {actionLoading === order.id ? "Verifying..." : "Verify & Confirm Order"}
                        </Button>
                        <Button
                          variant="outline"
                          className="h-11 flex-1 gap-2 rounded-[12px] border-red-200 text-red-600 hover:bg-red-50 dark:border-red-900 dark:text-red-400 dark:hover:bg-red-950/20"
                          onClick={() => handleReject(order)}
                          disabled={actionLoading === `reject-${order.id}`}
                        >
                          <XCircle className="h-4 w-4" />
                          {actionLoading === `reject-${order.id}` ? "Rejecting..." : "Reject"}
                        </Button>
                      </div>
                    </motion.div>
                  ))}
                </div>
              )}
            </>
          )}

          {activeTab === "fulfillment" && (
            <>
              <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
                <Input
                  placeholder="Search…"
                  value={fulfillmentSearch}
                  onChange={(e) => setFulfillmentSearch(e.target.value)}
                  className="h-10 max-w-md rounded-[10px]"
                />
                {fulfillmentTotalCount > 0 && !fulfillmentLoading && (
                  <div className="flex flex-wrap items-center gap-2 text-xs font-mono text-muted-foreground">
                    <span>
                      {fulfillmentTotalCount} active · Page {fulfillmentPage} / {fulfillmentTotalPages}
                    </span>
                    <div className="flex gap-2">
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        className="h-9 rounded-[10px]"
                        disabled={fulfillmentPage <= 1}
                        onClick={() => setFulfillmentPage((p) => Math.max(1, p - 1))}
                      >
                        <ChevronLeft className="h-4 w-4" />
                      </Button>
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        className="h-9 rounded-[10px]"
                        disabled={fulfillmentPage >= fulfillmentTotalPages}
                        onClick={() => setFulfillmentPage((p) => Math.min(fulfillmentTotalPages, p + 1))}
                      >
                        <ChevronRight className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                )}
              </div>

              {fulfillmentLoading ? (
                <div className="space-y-4">
                  {[1, 2].map((i) => <div key={i} className="h-56 animate-pulse rounded-[20px] bg-card p-6" />)}
                </div>
              ) : fulfillmentOrders.length === 0 ? (
                <motion.div
                  initial={{ y: 12, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  className="rounded-[20px] bg-card p-12 text-center shadow-sm"
                >
                  <Truck className="mx-auto mb-4 h-12 w-12 text-primary/30" />
                  <h3 className="mb-2 font-serif text-xl text-foreground">
                    {fulfillmentSearch.trim() ? "No matches" : "No active shipments"}
                  </h3>
                  <p className="text-sm text-muted-foreground">
                    {fulfillmentSearch.trim() ? "Try a different search term." : "All confirmed orders have been delivered."}
                  </p>
                </motion.div>
              ) : (
                <div className="space-y-6">
                  <p className="font-mono text-sm text-muted-foreground">
                    Showing {fulfillmentOrders.length} of {fulfillmentTotalCount} to fulfill
                  </p>
                  {fulfillmentOrders.map((order, idx) => {
                    const edit = trackingEdits[order.id] ?? {
                      tracking_status: order.tracking_status ?? "order_placed",
                      tracking_id: order.tracking_id ?? "",
                      estimated_delivery: order.estimated_delivery?.split("T")[0] ?? "",
                    };
                    const currentStepIdx = TRACKING_STEPS.findIndex((s) => s.key === (order.tracking_status ?? "order_placed"));

                    return (
                      <motion.div
                        key={order.id}
                        initial={{ y: 16, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        transition={{ delay: idx * 0.06 }}
                        className="space-y-5 rounded-[20px] bg-card p-6 shadow-sm"
                      >
                        <div className="flex flex-wrap items-start justify-between gap-4">
                          <div>
                            <p className="font-mono text-xs uppercase tracking-wider text-muted-foreground">
                              Order #{order.id.slice(0, 8).toUpperCase()}
                            </p>
                            <p className="mt-0.5 text-xs text-muted-foreground">
                              {new Date(order.created_at).toLocaleString("en-IN")}
                            </p>
                          </div>
                          <div className="text-right">
                            <p className="font-serif text-xl text-foreground">₹{order.total_amount}</p>
                            <p className="text-xs text-muted-foreground">{order.quantity}x Hair Oil</p>
                          </div>
                        </div>

                        <div className="grid gap-4 text-sm sm:grid-cols-2">
                          <div className="space-y-1">
                            <p className="font-mono text-[10px] uppercase tracking-wider text-muted-foreground">Customer</p>
                            <p className="font-medium text-foreground">{order.shipping_name}</p>
                            <p className="text-muted-foreground">{order.customer_email ?? "—"}</p>
                            <p className="text-muted-foreground">{order.shipping_phone}</p>
                          </div>
                          <div className="space-y-1">
                            <p className="font-mono text-[10px] uppercase tracking-wider text-muted-foreground">Shipping To</p>
                            <p className="text-muted-foreground">{order.shipping_address}</p>
                            <p className="text-muted-foreground">{order.shipping_city}, {order.shipping_state} — {order.shipping_pincode}</p>
                          </div>
                        </div>

                        <div className="flex items-center gap-1 py-1">
                          {TRACKING_STEPS.map((s, i) => {
                            const Icon = s.icon;
                            const isActive = i <= currentStepIdx;
                            const isCurrent = i === currentStepIdx;
                            return (
                              <div key={s.key} className="relative flex flex-1 flex-col items-center gap-1">
                                <div className={`flex h-7 w-7 items-center justify-center rounded-full transition-colors ${
                                  isCurrent ? "bg-primary text-primary-foreground" : isActive ? "bg-primary/20 text-primary" : "bg-muted text-muted-foreground/40"
                                }`}>
                                  <Icon className="h-3 w-3" />
                                </div>
                                <span className={`hidden text-center text-[9px] font-mono uppercase tracking-wider leading-tight sm:block ${
                                  isActive ? "text-foreground" : "text-muted-foreground/40"
                                }`}>
                                  {s.label}
                                </span>
                                {i < TRACKING_STEPS.length - 1 && (
                                  <div className={`absolute top-3.5 left-[calc(50%+14px)] right-[calc(-50%+14px)] h-px ${
                                    i < currentStepIdx ? "bg-primary" : "bg-border"
                                  }`} />
                                )}
                              </div>
                            );
                          })}
                        </div>

                        <div className="space-y-4 border-t border-border/30 pt-4">
                          <p className="font-mono text-[10px] uppercase tracking-wider text-muted-foreground">Update Tracking</p>
                          <div className="grid gap-3 sm:grid-cols-3">
                            <div>
                              <label className="mb-1.5 block text-xs text-muted-foreground">Status</label>
                              <select
                                value={edit.tracking_status}
                                onChange={(e) => setTrackingEdits((prev) => ({
                                  ...prev,
                                  [order.id]: { ...edit, tracking_status: e.target.value },
                                }))}
                                className="h-10 w-full rounded-[10px] border border-input bg-background px-3 text-sm"
                              >
                                {TRACKING_STEPS.map((s) => (
                                  <option key={s.key} value={s.key}>
                                    {s.label}
                                  </option>
                                ))}
                              </select>
                            </div>
                            <div>
                              <label className="mb-1.5 block text-xs text-muted-foreground">Tracking ID (optional)</label>
                              <Input
                                value={edit.tracking_id}
                                onChange={(e) => setTrackingEdits((prev) => ({
                                  ...prev,
                                  [order.id]: { ...edit, tracking_id: e.target.value },
                                }))}
                                placeholder="e.g. BD123456789IN"
                                className="h-10 rounded-[10px]"
                              />
                            </div>
                            <div>
                              <label className="mb-1.5 block text-xs text-muted-foreground">Est. Delivery (optional)</label>
                              <Input
                                type="date"
                                value={edit.estimated_delivery}
                                onChange={(e) => setTrackingEdits((prev) => ({
                                  ...prev,
                                  [order.id]: { ...edit, estimated_delivery: e.target.value },
                                }))}
                                className="h-10 rounded-[10px]"
                              />
                            </div>
                          </div>
                          <Button
                            className="h-10 rounded-[10px] px-6 font-medium"
                            onClick={() => handleUpdateTracking(order)}
                            disabled={updateLoading === order.id}
                          >
                            {updateLoading === order.id ? "Updating..." : "Update Tracking"}
                          </Button>
                        </div>
                      </motion.div>
                    );
                  })}
                </div>
              )}
            </>
          )}
        </section>
      </div>
    </div>
  );
};

export default Admin;
