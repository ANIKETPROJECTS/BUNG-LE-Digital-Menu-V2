import { useOrder } from "@/contexts/OrderContext";
import { motion, AnimatePresence } from "framer-motion";
import { X, Minus, Plus, ShoppingBag, Trash2, CheckCircle } from "lucide-react";
import { useState } from "react";
import { useTheme } from "@/contexts/ThemeContext";

function parsePrice(price: string | number): number {
  if (typeof price === "number") return price;
  // For multi-price strings like "200|400|600" take the first value
  const first = String(price).split("|")[0].replace(/[^\d.]/g, "");
  return parseFloat(first) || 0;
}

export default function OrderSidebar() {
  const { orderItems, removeFromOrder, updateQuantity, clearOrder, isOpen, closeSidebar } = useOrder();
  const { isDark } = useTheme();
  const [placing, setPlacing] = useState(false);
  const [placed, setPlaced] = useState(false);

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
      };
      const res = await fetch("/api/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });
      if (!res.ok) throw new Error("Failed to place order");
      setPlaced(true);
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
            <div
              className="flex items-center justify-between px-5 py-4"
              style={{ borderBottom: "1px solid var(--bb-border)" }}
            >
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
