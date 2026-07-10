import { useState, useMemo } from "react";
import { useLocation } from "wouter";
import { useQuery } from "@tanstack/react-query";
import { ArrowLeft, Search, SlidersHorizontal, X, ChevronDown, ChevronUp, Calendar } from "lucide-react";
import { useCustomer } from "@/contexts/CustomerContext";
import { useTheme } from "@/contexts/ThemeContext";
import type { Order } from "@shared/schema";

const STATUS_OPTIONS = ["all", "completed", "cancelled", "pending", "confirmed", "preparing", "ready", "served"];
const SORT_OPTIONS = [
  { value: "date-desc", label: "Newest First" },
  { value: "date-asc", label: "Oldest First" },
  { value: "total-desc", label: "Highest Total" },
  { value: "total-asc", label: "Lowest Total" },
];

const STATUS_COLOR: Record<string, { bg: string; text: string }> = {
  completed:  { bg: "#2FA84F22", text: "#2FA84F" },
  cancelled:  { bg: "#E6394622", text: "#E63946" },
  pending:    { bg: "#E49B1D22", text: "#E49B1D" },
  confirmed:  { bg: "#2E86DE22", text: "#2E86DE" },
  preparing:  { bg: "#E49B1D22", text: "#E49B1D" },
  ready:      { bg: "#2E86DE22", text: "#2E86DE" },
  served:     { bg: "#6C5CE722", text: "#6C5CE7" },
};

export default function OrderHistoryPage() {
  const [, setLocation] = useLocation();
  const { customer } = useCustomer();
  const { isDark } = useTheme();

  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [sort, setSort] = useState("date-desc");
  const [dateFrom, setDateFrom] = useState("");
  const [dateTo, setDateTo] = useState("");
  const [filtersOpen, setFiltersOpen] = useState(false);

  const { data: orders = [], isLoading } = useQuery<Order[]>({
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

  const filtered = useMemo(() => {
    let result = [...orders];

    if (search.trim()) {
      const q = search.trim().toLowerCase();
      result = result.filter(o =>
        o.items.some(i => i.name.toLowerCase().includes(q))
      );
    }

    if (statusFilter !== "all") {
      result = result.filter(o => o.status === statusFilter);
    }

    if (dateFrom) {
      const from = new Date(dateFrom);
      from.setHours(0, 0, 0, 0);
      result = result.filter(o => new Date(o.createdAt) >= from);
    }

    if (dateTo) {
      const to = new Date(dateTo);
      to.setHours(23, 59, 59, 999);
      result = result.filter(o => new Date(o.createdAt) <= to);
    }

    result.sort((a, b) => {
      if (sort === "date-desc") return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
      if (sort === "date-asc")  return new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
      if (sort === "total-desc") return (b.total || 0) - (a.total || 0);
      if (sort === "total-asc")  return (a.total || 0) - (b.total || 0);
      return 0;
    });

    return result;
  }, [orders, search, statusFilter, sort, dateFrom, dateTo]);

  const pageBg = isDark ? "#0f0f0f" : "#FDFAF4";
  const cardBg = isDark ? "#141414" : "#fff";
  const inputBg = isDark ? "#1a1a1a" : "#fff";

  function clearFilters() {
    setSearch("");
    setStatusFilter("all");
    setSort("date-desc");
    setDateFrom("");
    setDateTo("");
  }

  const hasActiveFilters = search || statusFilter !== "all" || sort !== "date-desc" || dateFrom || dateTo;

  return (
    <div className="min-h-screen" style={{ background: pageBg }} data-testid="page-order-history">
      {/* Header */}
      <div
        className="sticky top-0 z-10 flex items-center gap-3 px-4 py-4"
        style={{ background: pageBg, borderBottom: "1px solid var(--bb-border)" }}
      >
        <button
          onClick={() => setLocation("/profile")}
          className="flex items-center justify-center p-1.5 -ml-1.5"
          style={{ color: "var(--bb-gold)" }}
          data-testid="button-back-order-history"
        >
          <ArrowLeft className="h-6 w-6" />
        </button>
        <div className="flex-1">
          <h1 className="text-lg font-bold" style={{ color: "var(--bb-gold)", fontFamily: "'DM Sans', sans-serif" }}>
            Order History
          </h1>
          <p className="text-xs" style={{ color: "var(--bb-text-dim)" }}>
            {filtered.length} of {orders.length} order{orders.length !== 1 ? "s" : ""}
          </p>
        </div>
        <button
          onClick={() => setFiltersOpen(o => !o)}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold"
          style={{
            background: filtersOpen || hasActiveFilters ? "var(--bb-gold)" : isDark ? "#1a1a1a" : "#f0ebe0",
            color: filtersOpen || hasActiveFilters ? "#fff" : "var(--bb-text)",
            border: "1px solid var(--bb-border)",
          }}
          data-testid="button-toggle-filters"
        >
          <SlidersHorizontal size={13} />
          Filters
          {hasActiveFilters && (
            <span className="w-4 h-4 rounded-full bg-white text-[9px] font-bold flex items-center justify-center" style={{ color: "var(--bb-gold)" }}>
              ✓
            </span>
          )}
        </button>
      </div>

      {/* Search bar */}
      <div className="px-4 pt-3">
        <div
          className="flex items-center gap-2 rounded-xl px-3 py-2.5"
          style={{ background: inputBg, border: "1px solid var(--bb-border)" }}
        >
          <Search size={15} style={{ color: "var(--bb-text-dim)", flexShrink: 0 }} />
          <input
            type="text"
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Search by item name…"
            className="flex-1 bg-transparent text-sm outline-none"
            style={{ color: "var(--bb-text)" }}
            data-testid="input-search-orders"
          />
          {search && (
            <button onClick={() => setSearch("")} style={{ color: "var(--bb-text-dim)" }}>
              <X size={14} />
            </button>
          )}
        </div>
      </div>

      {/* Expandable filter panel */}
      {filtersOpen && (
        <div
          className="mx-4 mt-2 rounded-xl p-4 space-y-4"
          style={{ background: cardBg, border: "1px solid var(--bb-border)" }}
        >
          {/* Status filter */}
          <div className="space-y-1.5">
            <p className="text-xs font-semibold uppercase tracking-wider" style={{ color: "var(--bb-text-dim)" }}>
              Status
            </p>
            <div className="flex flex-wrap gap-1.5">
              {STATUS_OPTIONS.map(s => (
                <button
                  key={s}
                  onClick={() => setStatusFilter(s)}
                  className="px-2.5 py-1 rounded-full text-xs font-semibold capitalize transition-all"
                  style={{
                    background: statusFilter === s ? "var(--bb-gold)" : isDark ? "#222" : "#f0ebe0",
                    color: statusFilter === s ? "#fff" : "var(--bb-text)",
                    border: "1px solid var(--bb-border)",
                  }}
                  data-testid={`filter-status-${s}`}
                >
                  {s === "all" ? "All" : s}
                </button>
              ))}
            </div>
          </div>

          {/* Sort */}
          <div className="space-y-1.5">
            <p className="text-xs font-semibold uppercase tracking-wider" style={{ color: "var(--bb-text-dim)" }}>
              Sort By
            </p>
            <div className="flex flex-wrap gap-1.5">
              {SORT_OPTIONS.map(o => (
                <button
                  key={o.value}
                  onClick={() => setSort(o.value)}
                  className="px-2.5 py-1 rounded-full text-xs font-semibold transition-all"
                  style={{
                    background: sort === o.value ? "var(--bb-gold)" : isDark ? "#222" : "#f0ebe0",
                    color: sort === o.value ? "#fff" : "var(--bb-text)",
                    border: "1px solid var(--bb-border)",
                  }}
                  data-testid={`sort-${o.value}`}
                >
                  {o.label}
                </button>
              ))}
            </div>
          </div>

          {/* Date range */}
          <div className="space-y-1.5">
            <p className="text-xs font-semibold uppercase tracking-wider" style={{ color: "var(--bb-text-dim)" }}>
              Date Range
            </p>
            <div className="grid grid-cols-2 gap-2">
              <div className="space-y-1">
                <label className="text-[10px]" style={{ color: "var(--bb-text-dim)" }}>From</label>
                <input
                  type="date"
                  value={dateFrom}
                  onChange={e => setDateFrom(e.target.value)}
                  className="w-full rounded-lg px-2.5 py-1.5 text-xs outline-none"
                  style={{ background: inputBg, border: "1px solid var(--bb-border)", color: "var(--bb-text)" }}
                  data-testid="input-date-from"
                />
              </div>
              <div className="space-y-1">
                <label className="text-[10px]" style={{ color: "var(--bb-text-dim)" }}>To</label>
                <input
                  type="date"
                  value={dateTo}
                  onChange={e => setDateTo(e.target.value)}
                  className="w-full rounded-lg px-2.5 py-1.5 text-xs outline-none"
                  style={{ background: inputBg, border: "1px solid var(--bb-border)", color: "var(--bb-text)" }}
                  data-testid="input-date-to"
                />
              </div>
            </div>
          </div>

          {hasActiveFilters && (
            <button
              onClick={clearFilters}
              className="w-full py-1.5 rounded-lg text-xs font-semibold"
              style={{ background: "#E6394622", color: "#E63946", border: "1px solid #E6394644" }}
              data-testid="button-clear-filters"
            >
              Clear All Filters
            </button>
          )}
        </div>
      )}

      {/* Orders list */}
      <div className="px-4 py-3 space-y-3 pb-8">
        {isLoading ? (
          <div className="flex flex-col gap-2 pt-4">
            {[1, 2, 3].map(i => (
              <div key={i} className="rounded-xl h-24 animate-pulse" style={{ background: cardBg }} />
            ))}
          </div>
        ) : filtered.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16 gap-3 opacity-50">
            <Calendar size={40} style={{ color: "var(--bb-gold)" }} />
            <p className="text-sm" style={{ color: "var(--bb-text)", fontFamily: "'DM Sans', sans-serif" }}>
              {orders.length === 0 ? "No orders yet" : "No orders match your filters"}
            </p>
          </div>
        ) : (
          filtered.map(order => {
            const sc = STATUS_COLOR[order.status] ?? { bg: "#88888822", text: "#888" };
            return (
              <div
                key={order._id?.toString()}
                className="rounded-xl p-4 space-y-3"
                style={{ background: cardBg, border: "1px solid var(--bb-border)" }}
                data-testid={`order-card-${order._id}`}
              >
                {/* Top row: date + status + total */}
                <div className="flex items-center justify-between gap-2 flex-wrap">
                  <span className="text-xs" style={{ color: "var(--bb-text-dim)" }}>
                    {new Date(order.createdAt).toLocaleDateString("en-IN", {
                      day: "numeric", month: "short", year: "numeric",
                      hour: "2-digit", minute: "2-digit",
                    })}
                  </span>
                  <div className="flex items-center gap-2">
                    <span
                      className="text-[10px] font-bold uppercase px-2 py-0.5 rounded-full"
                      style={{ background: sc.bg, color: sc.text }}
                    >
                      {order.status}
                    </span>
                    <span className="text-sm font-bold" style={{ color: "var(--bb-gold)" }}>
                      ₹{order.total}
                    </span>
                  </div>
                </div>

                {/* Items table */}
                <div className="pt-1" style={{ borderTop: "1px solid var(--bb-border)" }}>
                  {/* Header */}
                  <div
                    className="grid text-[10px] font-semibold uppercase tracking-wide mb-1 pb-1"
                    style={{ gridTemplateColumns: "1fr auto auto", gap: "0 8px", borderBottom: "1px dashed var(--bb-border)", color: "var(--bb-text-dim)" }}
                  >
                    <span>Item</span>
                    <span className="text-center">Qty</span>
                    <span className="text-right">Price</span>
                  </div>
                  {/* Rows */}
                  {order.items.map((item, idx) => {
                    const unit = typeof item.price === "number" ? item.price : parseFloat(String(item.price).replace(/[^\d.]/g, "")) || 0;
                    return (
                      <div key={idx} className="grid text-xs py-0.5" style={{ gridTemplateColumns: "1fr auto auto", gap: "0 8px" }}>
                        <span style={{ color: "var(--bb-text)", wordBreak: "break-word", lineHeight: 1.3 }}>{item.name}</span>
                        <span className="text-center font-medium flex-shrink-0" style={{ color: "var(--bb-text-dim)" }}>×{item.quantity}</span>
                        <span className="text-right font-semibold flex-shrink-0" style={{ color: "var(--bb-gold)" }}>₹{(unit * item.quantity).toFixed(0)}</span>
                      </div>
                    );
                  })}
                </div>

                {/* Footer: table + note */}
                <div className="flex items-center justify-between gap-2 text-xs flex-wrap" style={{ color: "var(--bb-text-dim)" }}>
                  {order.tableId && (
                    <span>Table: <span className="font-semibold" style={{ color: "var(--bb-gold)" }}>{order.tableId}</span></span>
                  )}
                  {order.note && (
                    <span className="italic">"{order.note}"</span>
                  )}
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}
