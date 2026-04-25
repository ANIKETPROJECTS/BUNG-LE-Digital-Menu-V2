import { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { X, Star, ChefHat, Flame, Heart, Award, Sparkles, Zap, Coffee, Leaf, Trophy, ThumbsUp } from "lucide-react";
import { useTheme } from "@/contexts/ThemeContext";
import type { MenuItem, CallWaiter, SmartPicksCategory } from "@shared/schema";
const chefsHatImg = "https://res.cloudinary.com/dui1jsojt/image/upload/v1777092682/tarang-assets/chefs-hat_1773556627617.png";
const waiterImg = "https://res.cloudinary.com/dui1jsojt/image/upload/v1777093085/tarang-assets/waiter_1773555177013.png";
import ProductCard from "@/components/product-card";
import DishDetailModal from "@/components/dish-detail-modal";

interface FloatingButtonsProps {
  isMenuOpen?: boolean;
}

const ICON_MAP: Record<string, React.ReactNode> = {
  "star":       <Star className="w-3.5 h-3.5" />,
  "chef-hat":   <ChefHat className="w-3.5 h-3.5" />,
  "flame":      <Flame className="w-3.5 h-3.5" />,
  "heart":      <Heart className="w-3.5 h-3.5" />,
  "award":      <Award className="w-3.5 h-3.5" />,
  "sparkles":   <Sparkles className="w-3.5 h-3.5" />,
  "zap":        <Zap className="w-3.5 h-3.5" />,
  "coffee":     <Coffee className="w-3.5 h-3.5" />,
  "leaf":       <Leaf className="w-3.5 h-3.5" />,
  "trophy":     <Trophy className="w-3.5 h-3.5" />,
  "thumbs-up":  <ThumbsUp className="w-3.5 h-3.5" />,
};

export default function FloatingButtons({ isMenuOpen = false }: FloatingButtonsProps) {
  const { isDark } = useTheme();
  const queryClient = useQueryClient();
  const [showSmartMenu, setShowSmartMenu] = useState(false);
  const [activeSmartSection, setActiveSmartSection] = useState<string>("");
  const [smartVegFilter, setSmartVegFilter] = useState<"all" | "veg" | "non-veg">("all");
  const [selectedItem, setSelectedItem] = useState<MenuItem | null>(null);

  const { data: allItems = [] } = useQuery<MenuItem[]>({ queryKey: ["/api/menu-items"] });

  const { data: smartPicksTabs = [] } = useQuery<SmartPicksCategory[]>({
    queryKey: ["/api/smart-picks-categories"],
  });

  const activeTab = smartPicksTabs.find(t => t.key === activeSmartSection) ?? smartPicksTabs[0];

  const { data: callWaiterData } = useQuery<CallWaiter>({ queryKey: ["/api/call-waiter"] });
  const waiterCalled = callWaiterData?.called ?? false;

  const callWaiterMutation = useMutation({
    mutationFn: (called: boolean) => apiRequest("PATCH", "/api/call-waiter", { called }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/call-waiter"] });
    },
  });

  const smartFilteredItems = useMemo(() => {
    if (!activeTab) return [];
    const available = allItems.filter(i => i.isAvailable && (i as any)[activeTab.key] === true);
    if (smartVegFilter === "veg") return available.filter(i => i.isVeg);
    if (smartVegFilter === "non-veg") return available.filter(i => !i.isVeg);
    return available;
  }, [allItems, activeTab, smartVegFilter]);

  const currentTabKey = activeSmartSection || smartPicksTabs[0]?.key || "";

  return (
    <>
      {/* ── Smart Picks full-screen panel ── */}
      <AnimatePresence>
        {showSmartMenu && (
          <motion.div
            className="fixed inset-0 z-50 flex flex-col"
            style={{ backgroundColor: "var(--bb-card)" }}
            initial={{ y: "100%" }}
            animate={{ y: 0 }}
            exit={{ y: "100%" }}
            transition={{ type: "spring", damping: 30, stiffness: 300 }}
          >
            {/* Header */}
            <div
              className="flex items-center justify-between px-5 pt-5 pb-4 flex-shrink-0"
              style={{ borderBottom: "1px solid rgba(228,155,29,0.15)" }}
            >
              <div className="flex items-center gap-3">
                <div
                  className="w-11 h-11 rounded-full overflow-hidden flex-shrink-0"
                  style={{ border: "2px solid rgba(228,155,29,0.6)" }}
                >
                  <img src={chefsHatImg} alt="Smart Picks" className="w-full h-full object-cover" />
                </div>
                <div>
                  <h2
                    className="text-lg font-bold tracking-widest uppercase"
                    style={{ color: "var(--bb-gold)", fontFamily: "'DM Sans', sans-serif" }}
                  >
                    Smart Picks
                  </h2>
                  <p
                    className="text-xs"
                    style={{ color: "rgba(228,155,29,0.6)", fontFamily: "'DM Sans', sans-serif" }}
                  >
                    Not sure what to order? We've got you!
                  </p>
                </div>
              </div>

              <button
                onClick={() => setShowSmartMenu(false)}
                className="flex items-center justify-center w-9 h-9 rounded-full transition-all active:scale-90 flex-shrink-0"
                style={{
                  background: "linear-gradient(135deg, #E49B1D, #E6C55A)",
                  border: "none",
                  boxShadow: "0 2px 12px rgba(228,155,29,0.4)",
                }}
                data-testid="button-close-smart-menu"
              >
                <X className="w-4 h-4" style={{ color: "#1A1408" }} strokeWidth={2.5} />
              </button>
            </div>

            {/* Section Tabs — fully dynamic from DB */}
            {smartPicksTabs.length > 0 && (
              <div className="flex gap-2 px-5 pt-4 pb-3 flex-shrink-0 overflow-x-auto">
                {smartPicksTabs.map((tab) => {
                  const isActive = currentTabKey === tab.key;
                  return (
                    <button
                      key={tab.key}
                      onClick={() => setActiveSmartSection(tab.key)}
                      className="flex items-center gap-1.5 px-4 py-2 rounded-full text-[11px] font-semibold tracking-wider uppercase whitespace-nowrap transition-all duration-200 flex-shrink-0"
                      style={
                        isActive
                          ? {
                              background: "linear-gradient(90deg, #E49B1D, #E6C55A)",
                              color: "#1A1408",
                              fontFamily: "'DM Sans', sans-serif",
                            }
                          : {
                              backgroundColor: "rgba(228,155,29,0.08)",
                              border: "1px solid rgba(228,155,29,0.25)",
                              color: "var(--bb-gold)",
                              fontFamily: "'DM Sans', sans-serif",
                            }
                      }
                      data-testid={`smart-tab-${tab.key}`}
                    >
                      {ICON_MAP[tab.icon] ?? <Star className="w-3.5 h-3.5" />}
                      {tab.label}
                    </button>
                  );
                })}
              </div>
            )}

            {/* Tagline + Veg filter row */}
            <div className="px-5 pb-3 flex items-center justify-between flex-shrink-0">
              <p
                className="text-[11px] tracking-wide"
                style={{ color: "rgba(228,155,29,0.6)", fontFamily: "'DM Sans', sans-serif" }}
              >
                {activeTab?.tagline ?? ""}
              </p>
              <div
                className="inline-flex rounded-full p-0.5 items-center gap-0 flex-shrink-0"
                style={{ backgroundColor: "rgba(255,255,255,0.06)", border: "1px solid rgba(228,155,29,0.2)" }}
              >
                {[
                  { key: "all", label: "All" },
                  { key: "veg", label: "Veg" },
                  { key: "non-veg", label: "Non-Veg" },
                ].map((f) => (
                  <button
                    key={f.key}
                    onClick={() => setSmartVegFilter(f.key as typeof smartVegFilter)}
                    className="px-2 py-0.5 text-[10px] font-semibold rounded-full transition-all duration-200"
                    style={
                      smartVegFilter === f.key
                        ? f.key === "veg"
                          ? { backgroundColor: "#22C55E", color: "white" }
                          : f.key === "non-veg"
                          ? { backgroundColor: "#EF4444", color: "white" }
                          : { backgroundColor: "white", color: "#1A1408" }
                        : { color: "#C9A55C" }
                    }
                    data-testid={`smart-filter-${f.key}`}
                  >
                    {f.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Scrollable grid */}
            <div className="overflow-y-auto flex-1 pb-8 px-5">
              <AnimatePresence mode="wait">
                <motion.div
                  key={currentTabKey + smartVegFilter}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.18 }}
                  className="grid grid-cols-2 gap-3"
                >
                  {smartFilteredItems.length === 0 ? (
                    <div className="col-span-2 flex flex-col items-center justify-center py-16 text-center">
                      <p
                        className="text-sm tracking-widest uppercase"
                        style={{ color: "rgba(228,155,29,0.5)", fontFamily: "'DM Sans', sans-serif" }}
                      >
                        No items found
                      </p>
                    </div>
                  ) : (
                    smartFilteredItems.map((item, idx) => (
                      <motion.div
                        key={item._id?.toString() || idx}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: idx * 0.04 }}
                        data-testid={`smart-item-${item._id?.toString()}`}
                      >
                        <ProductCard item={item} onClick={(i) => setSelectedItem(i)} />
                      </motion.div>
                    ))
                  )}
                </motion.div>
              </AnimatePresence>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Dish Detail — opens on top of Smart Picks (z-[60] > z-50) */}
      <DishDetailModal item={selectedItem} onClose={() => setSelectedItem(null)} />

      {/* Smart Picks floating button — bottom left */}
      {!isMenuOpen && (
        <motion.button
          className="fixed bottom-6 left-4 z-40 flex items-center gap-2 pl-1 pr-4 py-1 rounded-full shadow-lg"
          style={{
            background: "#FFFFFF",
            border: showSmartMenu ? "1.5px solid rgba(228,155,29,0.9)" : "1.5px solid rgba(228,155,29,0.5)",
            backdropFilter: "blur(10px)",
            boxShadow: "0 4px 16px rgba(0,0,0,0.12)",
          }}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => setShowSmartMenu(!showSmartMenu)}
          data-testid="button-smart-menu"
        >
          <div
            className="w-10 h-10 rounded-full overflow-hidden flex-shrink-0"
            style={{ border: "2px solid rgba(228,155,29,0.7)" }}
          >
            <img src={chefsHatImg} alt="Smart Picks" className="w-full h-full object-cover" />
          </div>
          <div className="flex flex-col items-start">
            <span
              className="text-[10px] font-semibold tracking-widest uppercase leading-tight"
              style={{ color: "var(--bb-gold)", fontFamily: "'DM Sans', sans-serif" }}
            >
              Smart Picks
            </span>
            <span
              className="text-[9px] tracking-wide"
              style={{ color: "rgba(228,155,29,0.6)", fontFamily: "'DM Sans', sans-serif" }}
            >
              What to order?
            </span>
          </div>
        </motion.button>
      )}

      {/* ── Call Waiter ── */}
      {!isMenuOpen && (
      <div className="fixed bottom-6 right-4 z-40">
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => callWaiterMutation.mutate(!waiterCalled)}
          className="flex items-center gap-2 pl-1 pr-4 py-1 rounded-full shadow-lg"
          style={{
            background: "#FFFFFF",
            border: waiterCalled ? "1.5px solid rgba(74,222,128,0.6)" : "1.5px solid rgba(228,155,29,0.5)",
            backdropFilter: "blur(10px)",
            boxShadow: "0 4px 16px rgba(0,0,0,0.12)",
          }}
          data-testid="button-call-waiter"
        >
          <div
            className="w-10 h-10 rounded-full overflow-hidden flex-shrink-0"
            style={{
              border: waiterCalled ? "2px solid rgba(74,222,128,0.7)" : "2px solid rgba(228,155,29,0.7)",
            }}
          >
            <img src={waiterImg} alt="Call Waiter" className="w-full h-full object-cover" />
          </div>
          <AnimatePresence mode="wait">
            {waiterCalled ? (
              <motion.div
                key="called"
                initial={{ opacity: 0, x: 6 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -6 }}
                transition={{ duration: 0.18 }}
                className="flex flex-col items-start"
              >
                <span
                  className="text-[10px] font-semibold tracking-widest uppercase leading-tight"
                  style={{ color: "#4ade80", fontFamily: "'DM Sans', sans-serif" }}
                >
                  Waiter Called
                </span>
                <span
                  className="text-[9px] tracking-wide"
                  style={{ color: "rgba(74,222,128,0.6)", fontFamily: "'DM Sans', sans-serif" }}
                >
                  Tap to dismiss
                </span>
              </motion.div>
            ) : (
              <motion.div
                key="idle"
                initial={{ opacity: 0, x: 6 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -6 }}
                transition={{ duration: 0.18 }}
                className="flex flex-col items-start"
              >
                <span
                  className="text-[10px] font-semibold tracking-widest uppercase leading-tight"
                  style={{ color: "var(--bb-gold)", fontFamily: "'DM Sans', sans-serif" }}
                >
                  Call Waiter
                </span>
                <span
                  className="text-[9px] tracking-wide"
                  style={{ color: "rgba(228,155,29,0.6)", fontFamily: "'DM Sans', sans-serif" }}
                >
                  Tap to request
                </span>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.button>
      </div>
      )}
    </>
  );
}
