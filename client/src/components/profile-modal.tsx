import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { X, User, ShoppingBag, DollarSign, TrendingUp, Calendar, Heart, Clock, Trash2 } from "lucide-react";
import { useCustomer } from "@/contexts/CustomerContext";
import { useTheme } from "@/contexts/ThemeContext";
import type { Order } from "@shared/schema";

function parsePrice(price: string | number): number {
  if (typeof price === "number") return price;
  const first = String(price).split("|")[0].replace(/[^\d.]/g, "");
  return parseFloat(first) || 0;
}

interface ProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function ProfileModal({ isOpen, onClose }: ProfileModalProps) {
  const { customer } = useCustomer();
  const { isDark } = useTheme();
  const queryClient = useQueryClient();
  const [deleting, setDeleting] = useState(false);

  const { data: orders = [] } = useQuery<Order[]>({
    queryKey: ["/api/orders/by-phone", customer?.phone],
    queryFn: async () => {
      if (!customer?.phone) return [];
      const res = await fetch(`/api/orders/by-phone/${customer.phone}`);
      if (!res.ok) return [];
      return res.json();
    },
    enabled: !!customer?.phone && isOpen,
    staleTime: 0,
    refetchOnMount: "always",
  });

  const favoritesQueryKey = ["/api/customers/by-phone", customer?.phone];
  const { data: customerDoc } = useQuery<any>({
    queryKey: favoritesQueryKey,
    queryFn: async () => {
      if (!customer?.phone) return null;
      const res = await fetch(`/api/customers/by-phone/${customer.phone}`);
      if (!res.ok) return null;
      return res.json();
    },
    enabled: !!customer?.phone && isOpen,
    staleTime: 0,
  });

  const favorites = customerDoc?.favorites ?? [];

  const totalOrders = orders.length;
  const totalSpent = orders.reduce((sum, o) => sum + (o.total || 0), 0);
  const averageOrder = totalOrders > 0 ? totalSpent / totalOrders : 0;
  const lastOrder = orders[0];

  async function handleDeleteAll() {
    if (!customer?.phone) return;
    setDeleting(true);
    try {
      await fetch(`/api/orders/by-phone/${customer.phone}`, { method: "DELETE" });
      queryClient.invalidateQueries({ queryKey: ["/api/orders/by-phone", customer.phone] });
    } catch (err) {
      console.error(err);
    } finally {
      setDeleting(false);
    }
  }

  if (!customer) return null;

  const cardBg = isDark ? "#141414" : "#fff";
  const pageBg = isDark ? "#0f0f0f" : "#FDFAF4";

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            key="profile-backdrop"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[60]"
            style={{ background: "rgba(0,0,0,0.55)" }}
            onClick={onClose}
          />
          <motion.div
            key="profile-modal"
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            transition={{ duration: 0.2 }}
            className="fixed left-1/2 top-1/2 z-[61] w-[92vw] max-w-md rounded-2xl shadow-2xl overflow-hidden flex flex-col"
            style={{
              transform: "translate(-50%, -50%)",
              background: pageBg,
              maxHeight: "85vh",
              border: "1px solid var(--bb-border)",
            }}
          >
            {/* Header */}
            <div className="flex items-start justify-between px-5 pt-5 pb-3" style={{ borderBottom: "1px solid var(--bb-border)" }}>
              <div>
                <h2 className="text-lg font-bold" style={{ color: "var(--bb-gold)", fontFamily: "'DM Sans', sans-serif" }}>
                  My Profile
                </h2>
                <p className="text-xs" style={{ color: "var(--bb-text-dim)" }}>
                  View your profile, statistics, and order history
                </p>
              </div>
              <button onClick={onClose} style={{ color: "var(--bb-text-dim)" }} data-testid="button-close-profile">
                <X size={20} />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto px-5 py-4 space-y-4">
              {/* Personal Info */}
              <div
                className="rounded-xl p-4 space-y-2"
                style={{ background: cardBg, border: "1px solid var(--bb-border)" }}
              >
                <div className="flex items-center gap-2">
                  <User size={15} style={{ color: "var(--bb-gold)" }} />
                  <span className="text-sm font-semibold" style={{ color: "var(--bb-text)" }}>Personal Information</span>
                </div>
                <p className="text-sm" style={{ color: "var(--bb-text-dim)" }}>
                  Name: <span className="font-semibold" style={{ color: "var(--bb-text)" }}>{customer.name}</span>
                </p>
                <p className="text-sm" style={{ color: "var(--bb-text-dim)" }}>
                  Phone: <span className="font-semibold" style={{ color: "var(--bb-text)" }}>{customer.phone}</span>
                </p>
              </div>

              {/* Stats grid */}
              <div className="grid grid-cols-2 gap-3">
                <div className="rounded-xl p-3" style={{ background: cardBg, border: "1px solid var(--bb-border)" }}>
                  <div className="flex items-center gap-1.5 mb-1">
                    <ShoppingBag size={13} style={{ color: "#2FA84F" }} />
                    <span className="text-xs" style={{ color: "var(--bb-text-dim)" }}>Total Orders</span>
                  </div>
                  <p className="text-xl font-bold" style={{ color: "var(--bb-text)" }}>{totalOrders}</p>
                </div>
                <div className="rounded-xl p-3" style={{ background: cardBg, border: "1px solid var(--bb-border)" }}>
                  <div className="flex items-center gap-1.5 mb-1">
                    <DollarSign size={13} style={{ color: "#C44BD6" }} />
                    <span className="text-xs" style={{ color: "var(--bb-text-dim)" }}>Total Spent</span>
                  </div>
                  <p className="text-xl font-bold" style={{ color: "var(--bb-text)" }}>₹{totalSpent.toFixed(0)}</p>
                </div>
                <div className="rounded-xl p-3" style={{ background: cardBg, border: "1px solid var(--bb-border)" }}>
                  <div className="flex items-center gap-1.5 mb-1">
                    <TrendingUp size={13} style={{ color: "#E49B1D" }} />
                    <span className="text-xs" style={{ color: "var(--bb-text-dim)" }}>Average Order</span>
                  </div>
                  <p className="text-xl font-bold" style={{ color: "var(--bb-text)" }}>₹{averageOrder.toFixed(0)}</p>
                </div>
                <div className="rounded-xl p-3" style={{ background: cardBg, border: "1px solid var(--bb-border)" }}>
                  <div className="flex items-center gap-1.5 mb-1">
                    <Calendar size={13} style={{ color: "#2E86DE" }} />
                    <span className="text-xs" style={{ color: "var(--bb-text-dim)" }}>Last Order</span>
                  </div>
                  <p className="text-sm font-bold" style={{ color: "var(--bb-text)" }}>
                    {lastOrder ? new Date(lastOrder.createdAt).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" }) : "—"}
                  </p>
                </div>
              </div>

              {/* Favorites */}
              <div className="rounded-xl overflow-hidden" style={{ border: "1px solid var(--bb-border)" }}>
                <div className="flex items-center gap-2 px-4 py-2.5" style={{ background: "#E63946" }}>
                  <Heart size={15} color="#fff" />
                  <span className="text-sm font-bold text-white">Your Favorites</span>
                </div>
                <div className="p-3 space-y-2" style={{ background: cardBg }}>
                  {favorites.length === 0 ? (
                    <p className="text-xs" style={{ color: "var(--bb-text-dim)" }}>No favorites yet — tap the heart on any dish to save it here.</p>
                  ) : (
                    favorites.map((f: any) => (
                      <div key={f.menuItemId} className="flex items-center justify-between gap-2">
                        <div className="flex items-center gap-2 min-w-0">
                          <span
                            className="w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-bold flex-shrink-0"
                            style={{ background: "#E6394622", color: "#E63946" }}
                          >
                            1
                          </span>
                          <span className="text-sm truncate" style={{ color: "var(--bb-text)" }}>{f.name}</span>
                        </div>
                        <span className="text-sm font-bold flex-shrink-0" style={{ color: "var(--bb-gold)" }}>
                          ₹{parsePrice(f.price).toFixed(0)}
                        </span>
                      </div>
                    ))
                  )}
                </div>
              </div>

              {/* Order history */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Clock size={15} style={{ color: "var(--bb-gold)" }} />
                    <span className="text-sm font-semibold" style={{ color: "var(--bb-text)" }}>Order History</span>
                  </div>
                  <button
                    onClick={handleDeleteAll}
                    disabled={deleting || orders.filter(o => o.status === "completed" || o.status === "cancelled").length === 0}
                    className="flex items-center gap-1 text-xs font-semibold px-2.5 py-1.5 rounded-lg disabled:opacity-40"
                    style={{ background: "#E63946", color: "#fff" }}
                    data-testid="button-delete-order-history"
                  >
                    <Trash2 size={12} /> Delete All
                  </button>
                </div>
                {orders.length === 0 ? (
                  <p className="text-xs" style={{ color: "var(--bb-text-dim)" }}>No orders yet.</p>
                ) : (
                  orders.map((order) => (
                    <div
                      key={order._id?.toString()}
                      className="rounded-lg p-2.5 space-y-1"
                      style={{ background: cardBg, border: "1px solid var(--bb-border)" }}
                    >
                      <div className="flex items-center justify-between gap-2">
                        <span className="text-xs" style={{ color: "var(--bb-text-dim)" }}>
                          {new Date(order.createdAt).toLocaleDateString("en-IN", { day: "numeric", month: "short", hour: "2-digit", minute: "2-digit" })}
                        </span>
                        <div className="flex items-center gap-1.5">
                          <span
                            className="text-[10px] font-bold uppercase px-1.5 py-0.5 rounded-full"
                            style={{
                              background: order.status === "completed" ? "#2FA84F22" : "#E49B1D22",
                              color: order.status === "completed" ? "#2FA84F" : "#E49B1D",
                            }}
                          >
                            {order.status}
                          </span>
                          <span className="text-xs font-bold" style={{ color: "var(--bb-gold)" }}>₹{order.total}</span>
                        </div>
                      </div>
                      <p className="text-xs" style={{ color: "var(--bb-text)", wordBreak: "break-word" }}>
                        {order.items.map(i => `${i.name} ×${i.quantity}`).join(", ")}
                      </p>
                    </div>
                  ))
                )}
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
