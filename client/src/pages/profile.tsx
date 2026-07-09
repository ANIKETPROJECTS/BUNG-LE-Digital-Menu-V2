import { useEffect, useState } from "react";
import { useLocation } from "wouter";
import { useQuery } from "@tanstack/react-query";
import { ArrowLeft, User, ShoppingBag, DollarSign, TrendingUp, Calendar, Heart, ChevronDown, History } from "lucide-react";
import { useCustomer } from "@/contexts/CustomerContext";
import { useTheme } from "@/contexts/ThemeContext";
import type { Order } from "@shared/schema";

function parsePrice(price: string | number): number {
  if (typeof price === "number") return price;
  const first = String(price).split("|")[0].replace(/[^\d.]/g, "");
  return parseFloat(first) || 0;
}

export default function ProfilePage() {
  const [, setLocation] = useLocation();
  const { customer } = useCustomer();
  const { isDark } = useTheme();
  const [favoritesOpen, setFavoritesOpen] = useState(false);

  const { data: orders = [] } = useQuery<Order[]>({
    queryKey: ["/api/orders/by-phone", customer?.phone],
    queryFn: async () => {
      if (!customer?.phone) return [];
      const res = await fetch(`/api/orders/by-phone/${customer.phone}`);
      if (!res.ok) return [];
      return res.json();
    },
    enabled: !!customer?.phone,
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
    enabled: !!customer?.phone,
    staleTime: 0,
  });

  const favorites = customerDoc?.favorites ?? [];

  const totalOrders = orders.length;
  const totalSpent = orders.reduce((sum, o) => sum + (o.total || 0), 0);
  const averageOrder = totalOrders > 0 ? totalSpent / totalOrders : 0;
  const lastOrder = orders[0];

  const cardBg = isDark ? "#141414" : "#fff";
  const pageBg = isDark ? "#0f0f0f" : "#FDFAF4";

  useEffect(() => {
    if (!customer) {
      setLocation("/menu");
    }
  }, [customer, setLocation]);

  if (!customer) {
    return null;
  }

  return (
    <div className="min-h-screen" style={{ background: pageBg }} data-testid="page-profile">
      {/* Header */}
      <div
        className="sticky top-0 z-10 flex items-center gap-3 px-4 py-4"
        style={{ background: pageBg, borderBottom: "1px solid var(--bb-border)" }}
      >
        <button
          onClick={() => setLocation("/menu")}
          className="flex items-center justify-center p-1.5 -ml-1.5"
          style={{ color: "var(--bb-gold)" }}
          aria-label="Back"
          data-testid="button-back-profile"
        >
          <ArrowLeft className="h-6 w-6" />
        </button>
        <div>
          <h1 className="text-lg font-bold" style={{ color: "var(--bb-gold)", fontFamily: "'DM Sans', sans-serif" }}>
            My Profile
          </h1>
          <p className="text-xs" style={{ color: "var(--bb-text-dim)" }}>
            View your profile, statistics, and order history
          </p>
        </div>
      </div>

      <div className="px-4 py-4 space-y-4 max-w-md mx-auto">
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
          <button
            onClick={() => setFavoritesOpen(o => !o)}
            className="w-full flex items-center justify-between gap-2 px-4 py-2.5"
            style={{ background: "#E63946" }}
            aria-expanded={favoritesOpen}
            data-testid="button-toggle-favorites"
          >
            <div className="flex items-center gap-2">
              <Heart size={15} color="#fff" />
              <span className="text-sm font-bold text-white">Your Favorites</span>
              {favorites.length > 0 && (
                <span
                  className="min-w-[18px] h-[18px] rounded-full text-[10px] font-bold flex items-center justify-center px-1"
                  style={{ background: "#fff", color: "#E63946" }}
                >
                  {favorites.length}
                </span>
              )}
            </div>
            <ChevronDown
              size={16}
              color="#fff"
              style={{ transform: favoritesOpen ? "rotate(180deg)" : "rotate(0deg)", transition: "transform 0.2s" }}
            />
          </button>
          {favoritesOpen && (
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
          )}
        </div>

        {/* Previous Orders button */}
        <div className="pb-6">
          <button
            onClick={() => setLocation("/order-history")}
            className="w-full flex items-center justify-between gap-3 px-4 py-3.5 rounded-xl transition-all"
            style={{ background: cardBg, border: "1px solid var(--bb-border)" }}
            data-testid="button-view-order-history"
          >
            <div className="flex items-center gap-3">
              <div
                className="w-9 h-9 rounded-full flex items-center justify-center flex-shrink-0"
                style={{ background: "var(--bb-gold)" }}
              >
                <History size={17} color="#fff" />
              </div>
              <div className="text-left">
                <p className="text-sm font-bold" style={{ color: "var(--bb-text)", fontFamily: "'DM Sans', sans-serif" }}>
                  Previous Orders
                </p>
                <p className="text-xs" style={{ color: "var(--bb-text-dim)" }}>
                  {orders.length > 0 ? `${orders.length} order${orders.length !== 1 ? "s" : ""} · search, filter & sort` : "View your full order history"}
                </p>
              </div>
            </div>
            <ChevronDown size={16} style={{ color: "var(--bb-text-dim)", transform: "rotate(-90deg)" }} />
          </button>
        </div>
      </div>
    </div>
  );
}
