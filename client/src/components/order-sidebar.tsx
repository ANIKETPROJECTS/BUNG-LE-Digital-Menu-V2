import { useOrder } from "@/contexts/OrderContext";
import { useCustomer } from "@/contexts/CustomerContext";
import { motion, AnimatePresence } from "framer-motion";
import { X, Minus, Plus, ShoppingBag, Trash2, CheckCircle, User, ChevronDown, ChevronUp, Clock, UtensilsCrossed } from "lucide-react";
import { useState } from "react";
import { useTheme } from "@/contexts/ThemeContext";
import { useQuery } from "@tanstack/react-query";
import type { Order } from "@shared/schema";

function parsePrice(price: string | number): number {
  if (typeof price === "number") return price;
  // For multi-price strings like "200|400|600" take the first value
  const first = String(price).split("|")[0].replace(/[^\d.]/g, "");
  return parseFloat(first) || 0;
}

export default function OrderSidebar() {
  const { orderItems, removeFromOrder, updateQuantity, clearOrder, isOpen, closeSidebar } = useOrder();
  const { customer } = useCustomer();
  const { isDark } = useTheme();
  const [placing, setPlacing] = useState(false);
  const [placed, setPlaced] = useState(false);
  const [note, setNote] = useState("");
  const [profileOpen, setProfileOpen] = useState(false);

  // Fetch past orders for this customer
  const { data: pastOrders = [] } = useQuery<Order[]>({
    queryKey: ["/api/orders/by-phone", customer?.phone],
    queryFn: async () => {
      if (!customer?.phone) return [];
      const res = await fetch(`/api/orders/by-phone/${customer.phone}`);
      if (!res.ok) return [];
      return res.json();
    },
    enabled: !!customer?.phone && profileOpen,
    staleTime: 0,
    refetchOnMount: "always",
    refetchOnWindowFocus: true,
    gcTime: 0,
  });

  const total = orderItems.reduce((sum, l) => sum + parsePrice(l.item.price) * l.quantity, 0);

  async function handlePlaceOrder() {
    if (orderItems.length === 0) return;
    setPlacing(true);
    try {
      const body = {
        tableId: "Table1",
        items: orderItems.map(l => ({
          name: l.item.name,
          price: l.item.price,
          quantity: l.quantity,
          category: l.item.category || "",
        })),
        total,
        status: "pending",
        ...(note.trim() ? { note: note.trim() } : {}),
        ...(customer ? { customerName: customer.name, customerPhone: customer.phone } : {}),
      };
      const res = await fetch("/api/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });
      if (!res.ok) throw new Error("Failed to place order");
      setPlaced(true);
      setNote("");
      clearOrder();
      setTimeout(() => {
        setPlaced(false);
        closeSidebar();
      }, 2200);
    } catch (err) {
      console.error(err);
    } finally {
      setPlacing(false);
    }
  }

  return (
    <>
      {/* Backdrop */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            key="backdrop"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-40"
            style={{ background: "rgba(0,0,0,0.45)" }}
            onClick={closeSidebar}
          />
        )}
      </AnimatePresence>

      {/* Sidebar */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            key="sidebar"
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
            className="fixed top-0 right-0 h-full z-50 flex flex-col shadow-2xl"
            style={{
              width: "min(380px, 100vw)",
              background: isDark ? "#0f0f0f" : "#FDFAF4",
              borderLeft: `1px solid var(--bb-border)`,
            }}
          >
            {/* Header */}
            <div style={{ borderBottom: "1px solid var(--bb-border)" }}>
              {/* Title row */}
              <div className="flex items-center justify-between px-5 py-3">
                <div className="flex items-center gap-2">
                  <ShoppingBag size={20} style={{ color: "var(--bb-gold)" }} />
                  <span
                    className="text-lg font-bold uppercase tracking-wider"
                    style={{ color: "var(--bb-gold)", fontFamily: "'DM Sans', sans-serif" }}
                  >
                    Your Order
                  </span>
                </div>
                <button onClick={closeSidebar} style={{ color: "var(--bb-text-dim)" }}>
                  <X size={22} />
                </button>
              </div>

              {/* Table + order summary strip */}
              <div
                className="mx-4 mb-3 rounded-xl px-4 py-2.5 flex items-center justify-between gap-3"
                style={{
                  background: isDark ? "#1a1a1a" : "#fff8ee",
                  border: "1px solid var(--bb-gold)",
                }}
              >
                {/* Table badge */}
                <div className="flex items-center gap-2 flex-shrink-0">
                  <UtensilsCrossed size={15} style={{ color: "var(--bb-gold)" }} />
                  <span
                    className="text-sm font-bold uppercase tracking-widest"
                    style={{ color: "var(--bb-gold)", fontFamily: "'DM Sans', sans-serif" }}
                  >
                    Table 1
                  </span>
                </div>

                {/* Divider */}
                <div style={{ width: 1, height: 28, background: "var(--bb-border)", flexShrink: 0 }} />

                {/* Current order summary */}
                {orderItems.length === 0 ? (
                  <span className="text-xs flex-1 text-right" style={{ color: "var(--bb-text-dim)" }}>
                    No items yet
                  </span>
                ) : (
                  <div className="flex-1 min-w-0 text-right">
                    <p
                      className="text-xs truncate"
                      style={{ color: "var(--bb-text)", fontFamily: "'DM Sans', sans-serif" }}
                      title={orderItems.map(l => `${l.item.name} ×${l.quantity}`).join(", ")}
                    >
                      {orderItems.map(l => `${l.item.name} ×${l.quantity}`).join(", ")}
                    </p>
                    <p
                      className="text-sm font-bold mt-0.5"
                      style={{ color: "var(--bb-gold)", fontFamily: "'DM Sans', sans-serif" }}
                    >
                      ₹{total.toFixed(0)} · {orderItems.reduce((s, l) => s + l.quantity, 0)} item{orderItems.reduce((s, l) => s + l.quantity, 0) !== 1 ? "s" : ""}
                    </p>
                  </div>
                )}
              </div>
            </div>

            {/* Customer Profile */}
            {customer && (
              <div
                style={{
                  borderBottom: "1px solid var(--bb-border)",
                  background: isDark ? "#141414" : "#f9f4ea",
                }}
              >
                <button
                  onClick={() => setProfileOpen(o => !o)}
                  className="w-full flex items-center gap-3 px-5 py-3"
                >
                  <div
                    className="w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0"
                    style={{ background: "var(--bb-gold)" }}
                  >
                    <User size={15} color="#fff" />
                  </div>
                  <div className="flex-1 text-left min-w-0">
                    <p
                      className="text-sm font-bold truncate"
                      style={{ color: "var(--bb-gold)", fontFamily: "'DM Sans', sans-serif" }}
                    >
                      {customer.name}
                    </p>
                    <p className="text-xs" style={{ color: "var(--bb-text-dim)" }}>
                      {customer.phone}
                    </p>
                  </div>
                  {profileOpen ? (
                    <ChevronUp size={16} style={{ color: "var(--bb-text-dim)" }} />
                  ) : (
                    <ChevronDown size={16} style={{ color: "var(--bb-text-dim)" }} />
                  )}
                </button>

                {/* Past orders panel */}
                <AnimatePresence>
                  {profileOpen && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.2 }}
                      style={{ overflow: "hidden" }}
                    >
                      <div className="px-5 pb-3 space-y-2">
                        <p
                          className="text-xs font-semibold uppercase tracking-wider mb-2"
                          style={{ color: "var(--bb-text-dim)" }}
                        >
                          Previous Orders
                        </p>
                        {pastOrders.filter(o => o.status === "completed").length === 0 ? (
                          <p className="text-xs" style={{ color: "var(--bb-text-dim)" }}>
                            No completed orders yet.
                          </p>
                        ) : (
                          pastOrders.filter(o => o.status === "completed").slice(0, 5).map(order => (
                            <div
                              key={order._id?.toString()}
                              className="rounded-lg p-2.5 space-y-1"
                              style={{
                                background: isDark ? "#1a1a1a" : "#fff",
                                border: "1px solid var(--bb-border)",
                              }}
                            >
                              <div className="flex items-center justify-between gap-2">
                                <div className="flex items-center gap-1.5">
                                  <Clock size={11} style={{ color: "var(--bb-text-dim)" }} />
                                  <span className="text-xs" style={{ color: "var(--bb-text-dim)" }}>
                                    {new Date(order.createdAt).toLocaleDateString("en-IN", {
                                      day: "numeric", month: "short", hour: "2-digit", minute: "2-digit",
                                    })}
                                  </span>
                                </div>
                                <span
                                  className="text-xs font-bold"
                                  style={{ color: "var(--bb-gold)" }}
                                >
                                  ₹{order.total}
                                </span>
                              </div>
                              <p className="text-xs truncate" style={{ color: "var(--bb-text)" }}>
                                {order.items.map(i => i.name).join(", ")}
                              </p>
                              {order.note && (
                                <p className="text-xs italic" style={{ color: "var(--bb-text-dim)" }}>
                                  Note: {order.note}
                                </p>
                              )}
                            </div>
                          ))
                        )}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            )}

            {/* Order items */}
            <div className="flex-1 overflow-y-auto px-4 py-3 space-y-3">
              {placed ? (
                <motion.div
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="flex flex-col items-center justify-center h-full gap-4"
                >
                  <CheckCircle size={60} style={{ color: "var(--bb-gold)" }} />
                  <p
                    className="text-xl font-bold text-center"
                    style={{ color: "var(--bb-gold)", fontFamily: "'DM Sans', sans-serif" }}
                  >
                    Order Placed!
                  </p>
                  <p style={{ color: "var(--bb-text-dim)", textAlign: "center", fontSize: "0.9rem" }}>
                    Your order has been sent to the kitchen.
                  </p>
                </motion.div>
              ) : orderItems.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-full gap-3 opacity-50">
                  <ShoppingBag size={48} style={{ color: "var(--bb-gold)" }} />
                  <p style={{ color: "var(--bb-text)", fontFamily: "'DM Sans', sans-serif" }}>
                    No items added yet
                  </p>
                </div>
              ) : (
                orderItems.map(({ item, quantity }) => {
                  const id = item._id?.toString() ?? "";
                  const unitPrice = parsePrice(item.price);
                  return (
                    <motion.div
                      key={id}
                      layout
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: 20 }}
                      className="flex items-center gap-3 rounded-xl p-3"
                      style={{
                        background: isDark ? "#1a1a1a" : "#fff",
                        border: "1px solid var(--bb-border)",
                      }}
                    >
                      {/* Veg dot */}
                      <div
                        className={`w-3 h-3 rounded-full flex-shrink-0 ${
                          item.isVeg ? "bg-green-500" : "bg-red-500"
                        }`}
                      />
                      {/* Name & price */}
                      <div className="flex-1 min-w-0">
                        <p
                          className="text-sm font-semibold truncate uppercase"
                          style={{ color: "var(--bb-gold)", fontFamily: "'DM Sans', sans-serif" }}
                        >
                          {item.name}
                        </p>
                        <p
                          className="text-xs"
                          style={{ color: "var(--bb-text-dim)" }}
                        >
                          ₹{unitPrice} × {quantity} = ₹{(unitPrice * quantity).toFixed(0)}
                        </p>
                      </div>
                      {/* Qty controls */}
                      <div className="flex items-center gap-1">
                        <button
                          onClick={() => updateQuantity(id, quantity - 1)}
                          className="w-7 h-7 rounded-full flex items-center justify-center"
                          style={{ border: "1px solid var(--bb-border)", color: "var(--bb-gold)" }}
                        >
                          <Minus size={12} />
                        </button>
                        <span
                          className="w-6 text-center text-sm font-bold"
                          style={{ color: "var(--bb-text)" }}
                        >
                          {quantity}
                        </span>
                        <button
                          onClick={() => updateQuantity(id, quantity + 1)}
                          className="w-7 h-7 rounded-full flex items-center justify-center"
                          style={{ border: "1px solid var(--bb-border)", color: "var(--bb-gold)" }}
                        >
                          <Plus size={12} />
                        </button>
                      </div>
                      {/* Remove */}
                      <button
                        onClick={() => removeFromOrder(id)}
                        style={{ color: "var(--bb-text-dim)" }}
                      >
                        <Trash2 size={15} />
                      </button>
                    </motion.div>
                  );
                })
              )}
            </div>

            {/* Footer */}
            {!placed && orderItems.length > 0 && (
              <div
                className="px-5 py-4 space-y-3"
                style={{ borderTop: "1px solid var(--bb-border)" }}
              >
                {/* Note / Special Instructions */}
                <div className="space-y-1">
                  <label
                    className="text-xs font-semibold uppercase tracking-wider"
                    style={{ color: "var(--bb-text-dim)" }}
                  >
                    Add a Note
                  </label>
                  <textarea
                    value={note}
                    onChange={e => setNote(e.target.value)}
                    placeholder="Special instructions, allergies, preferences…"
                    rows={2}
                    maxLength={300}
                    className="w-full rounded-lg px-3 py-2 text-sm resize-none outline-none transition-colors"
                    style={{
                      background: isDark ? "#1a1a1a" : "#fff",
                      border: "1px solid var(--bb-border)",
                      color: "var(--bb-text)",
                      fontFamily: "'DM Sans', sans-serif",
                    }}
                  />
                </div>

                <div className="flex justify-between items-center">
                  <span
                    className="text-sm font-medium"
                    style={{ color: "var(--bb-text-dim)" }}
                  >
                    Total
                  </span>
                  <span
                    className="text-xl font-bold"
                    style={{ color: "var(--bb-gold)", fontFamily: "'DM Sans', sans-serif" }}
                  >
                    ₹{total.toFixed(0)}
                  </span>
                </div>
                <button
                  onClick={handlePlaceOrder}
                  disabled={placing}
                  className="w-full py-3 rounded-xl font-bold uppercase tracking-wider text-sm transition-opacity disabled:opacity-60"
                  style={{
                    background: "var(--bb-gold)",
                    color: "#fff",
                    fontFamily: "'DM Sans', sans-serif",
                  }}
                >
                  {placing ? "Placing…" : "Place Order"}
                </button>
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
