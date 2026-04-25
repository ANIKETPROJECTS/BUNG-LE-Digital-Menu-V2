import { motion, AnimatePresence } from "framer-motion";
import { X, Clock } from "lucide-react";
import type { MenuItem } from "@shared/schema";
const fallbackImg = "https://res.cloudinary.com/dui1jsojt/image/upload/v1777092683/tarang-assets/coming_soon_imagev2_1766811809828.jpg";
import { useState } from "react";
import { useTheme } from "@/contexts/ThemeContext";
import { getOverrideImage } from "@/components/product-card";

interface DishDetailModalProps {
  item: MenuItem | null;
  onClose: () => void;
}

const DEFAULT_NUTRITION_KEYS = ["Calories", "Protein", "Carbs", "Fat", "Fibre", "Sodium"];
const ALLERGEN_PLACEHOLDER = "Information not available for this item.";
const INGREDIENTS_PLACEHOLDER = "Detailed ingredient list not available.";
const PREP_TIME_PLACEHOLDER = "—";

export default function DishDetailModal({ item, onClose }: DishDetailModalProps) {
  const { isDark } = useTheme();
  const [imgError, setImgError] = useState(false);

  if (!item) return null;

  const textPrimary = isDark ? "#FFFFFF" : "#000000";
  const textSecondary = isDark ? "rgba(220,212,200,0.5)" : "rgba(0,0,0,0.45)";
  const cardBg = isDark ? "rgba(228,155,29,0.06)" : "#FFFFFF";
  const cardBorder = isDark ? "1px solid rgba(228,155,29,0.15)" : "1px solid rgba(0,0,0,0.08)";

  const override = getOverrideImage(item.name);
  const isBroken = imgError || !item.image || item.image.includes("placeholder.com") || item.image.includes("example.com");
  const imageUrl = isBroken ? (override ?? fallbackImg) : item.image;

  const priceDisplay =
    typeof item.price === "string" && item.price.includes("|")
      ? item.price.split("|").map((p: string) => `₹${p.trim()}`).join("  |  ")
      : `₹${item.price}`;

  // Build nutrition entries from item data or show default placeholders
  const hasNutrition = item.nutritionalContents && Object.keys(item.nutritionalContents).length > 0;
  const nutritionEntries: { label: string; value: string }[] = hasNutrition
    ? Object.entries(item.nutritionalContents!).map(([k, v]) => ({
        label: k.charAt(0).toUpperCase() + k.slice(1),
        value: String(v),
      }))
    : DEFAULT_NUTRITION_KEYS.map((k) => ({ label: k, value: "—" }));

  const hasAllergens = item.allergens && item.allergens.length > 0;
  const hasIngredients = item.ingredients && item.ingredients.length > 0;

  return (
    <AnimatePresence>
      {item && (
        <motion.div
          className="fixed inset-0 z-[60] overflow-y-auto"
          style={{ backgroundColor: isDark ? "var(--bb-card)" : "#FFFFFF" }}
          initial={{ y: "100%" }}
          animate={{ y: 0 }}
          exit={{ y: "100%" }}
          transition={{ type: "spring", damping: 32, stiffness: 300 }}
        >
          {/* Hero Image — full width, top of screen */}
          <div className="relative w-full overflow-hidden" style={{ aspectRatio: "4/3" }}>
            <img
              src={imageUrl}
              alt={item.name}
              className="w-full h-full object-cover"
              onError={() => setImgError(true)}
            />

            {/* Veg / Non-Veg badge — top left */}
            <div
              className="absolute top-4 left-4 px-3 py-1.5 rounded-full text-xs font-bold tracking-wider uppercase"
              style={{
                backgroundColor: item.isVeg ? "rgba(22,163,74,0.92)" : "rgba(220,38,38,0.92)",
                color: "#fff",
                backdropFilter: "blur(4px)",
                border: item.isVeg ? "1px solid rgba(74,222,128,0.5)" : "1px solid rgba(252,165,165,0.4)",
                fontFamily: "'DM Sans', sans-serif",
              }}
            >
              {item.isVeg ? "Veg" : "Non-Veg"}
            </div>

            {/* Gold X close button — top right */}
            <button
              onClick={onClose}
              className="absolute top-4 right-4 z-10 flex items-center justify-center w-9 h-9 rounded-full transition-all active:scale-90"
              style={{
                background: "linear-gradient(135deg, #E49B1D, #E6C55A)",
                border: "none",
                boxShadow: "0 2px 12px rgba(228,155,29,0.4)",
              }}
              data-testid="button-close-dish-modal"
            >
              <X className="w-4 h-4" style={{ color: "#1A1408" }} strokeWidth={2.5} />
            </button>
          </div>

          {/* Gold accent line */}
          <div
            className="w-full h-[2px]"
            style={{ background: "linear-gradient(90deg, transparent, #E49B1D, #E6C55A, transparent)" }}
          />

          {/* Name + Price stacked */}
          <div className="px-5 pt-5 pb-3 flex flex-col gap-2">
            <h2
              className="font-bold leading-tight uppercase"
              style={{
                color: textPrimary,
                fontFamily: "'DM Sans', sans-serif",
                fontSize: "clamp(17px, 5vw, 24px)",
                letterSpacing: "0.08em",
                wordBreak: "break-word",
              }}
              data-testid="text-dish-name"
            >
              {item.name}
            </h2>
            {priceDisplay && priceDisplay !== "₹" && (
              <p
                className="text-lg font-black tracking-wider"
                style={{
                  background: "linear-gradient(90deg, #E49B1D, #E6C55A)",
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                  fontFamily: "'DM Sans', sans-serif",
                }}
                data-testid="text-dish-price"
              >
                {priceDisplay}
              </p>
            )}
          </div>

          {/* Content */}
          <div className="px-5 pb-10 space-y-5">

            {/* Description */}
            {item.description && (
              <div
                className="rounded-2xl px-4 py-3"
                style={{
                  background: isDark ? "rgba(228,155,29,0.07)" : "#F5F5F5",
                  borderLeft: "3px solid #E49B1D",
                }}
              >
                <p
                  className="text-sm leading-relaxed"
                  style={{ color: textPrimary, fontFamily: "'DM Sans', sans-serif", lineHeight: 1.75 }}
                  data-testid="text-dish-description"
                >
                  {item.description}
                </p>
              </div>
            )}

            {/* Prep time */}
            <div className="flex items-center gap-3">
              <Clock className="w-4 h-4 flex-shrink-0" style={{ color: "var(--bb-gold)" }} />
              <div>
                <p
                  className="text-[10px] uppercase tracking-widest font-semibold"
                  style={{ color: "rgba(228,155,29,0.6)", fontFamily: "'DM Sans', sans-serif" }}
                >
                  Preparation Time
                </p>
                <p
                  className="text-sm font-semibold"
                  style={{
                    color: item.preparationTime ? textPrimary : textSecondary,
                    fontFamily: "'DM Sans', sans-serif",
                  }}
                  data-testid="text-prep-time"
                >
                  {item.preparationTime || PREP_TIME_PLACEHOLDER}
                </p>
              </div>
            </div>

            {/* Divider */}
            <div className="h-px" style={{ background: isDark ? "rgba(228,155,29,0.15)" : "rgba(0,0,0,0.08)" }} />

            {/* Nutritional Contents */}
            <div>
              <h3
                className="text-xs font-bold uppercase tracking-widest mb-3"
                style={{ color: "var(--bb-gold)", fontFamily: "'DM Sans', sans-serif" }}
              >
                Nutritional Contents
              </h3>
              <div className="grid grid-cols-3 gap-2">
                {nutritionEntries.map((n) => (
                  <div
                    key={n.label}
                    className="rounded-xl p-3 text-center"
                    style={{ background: cardBg, border: cardBorder }}
                    data-testid={`nutrition-${n.label.toLowerCase()}`}
                  >
                    <p
                      className="text-[10px] uppercase tracking-wider mb-1"
                      style={{ color: textSecondary, fontFamily: "'DM Sans', sans-serif" }}
                    >
                      {n.label}
                    </p>
                    <p
                      className="text-base font-bold"
                      style={{ color: textPrimary, fontFamily: "'DM Sans', sans-serif" }}
                    >
                      {n.value}
                    </p>
                  </div>
                ))}
              </div>
              {!hasNutrition && (
                <p
                  className="text-[10px] mt-2 text-center uppercase tracking-wider"
                  style={{ color: "rgba(228,155,29,0.35)", fontFamily: "'DM Sans', sans-serif" }}
                >
                  Nutritional info will be available soon
                </p>
              )}
            </div>

            {/* Divider */}
            <div className="h-px" style={{ background: "rgba(228,155,29,0.15)" }} />

            {/* Allergens */}
            <div>
              <h3
                className="text-xs font-bold uppercase tracking-widest mb-3"
                style={{ color: "var(--bb-gold)", fontFamily: "'DM Sans', sans-serif" }}
              >
                Allergens
              </h3>
              {hasAllergens ? (
                <div className="flex flex-wrap gap-2" data-testid="allergens-list">
                  {item.allergens!.map((allergen) => (
                    <span
                      key={allergen}
                      className="px-3 py-1.5 rounded-full text-xs font-semibold tracking-wide uppercase"
                      style={{
                        background: isDark ? "rgba(239,68,68,0.12)" : "rgba(239,68,68,0.08)",
                        border: "1px solid rgba(239,68,68,0.35)",
                        color: isDark ? "#FCA5A5" : "#DC2626",
                        fontFamily: "'DM Sans', sans-serif",
                      }}
                    >
                      {allergen}
                    </span>
                  ))}
                </div>
              ) : (
                <div
                  className="rounded-xl px-4 py-3"
                  style={{ background: cardBg, border: cardBorder }}
                >
                  <p
                    className="text-sm"
                    style={{ color: textPrimary, fontFamily: "'DM Sans', sans-serif", opacity: 0.75 }}
                  >
                    {ALLERGEN_PLACEHOLDER}
                  </p>
                </div>
              )}
            </div>

            {/* Divider */}
            <div className="h-px" style={{ background: isDark ? "rgba(228,155,29,0.15)" : "rgba(0,0,0,0.08)" }} />

            {/* Ingredients */}
            <div>
              <h3
                className="text-xs font-bold uppercase tracking-widest mb-3"
                style={{ color: "var(--bb-gold)", fontFamily: "'DM Sans', sans-serif" }}
              >
                Ingredients
              </h3>
              {hasIngredients ? (
                <div className="flex flex-wrap gap-2" data-testid="ingredients-list">
                  {item.ingredients!.map((ingredient) => (
                    <span
                      key={ingredient}
                      className="px-3 py-1.5 rounded-full text-xs font-semibold tracking-wide"
                      style={{
                        background: cardBg,
                        border: cardBorder,
                        color: textPrimary,
                        fontFamily: "'DM Sans', sans-serif",
                      }}
                    >
                      {ingredient}
                    </span>
                  ))}
                </div>
              ) : (
                <div
                  className="rounded-xl px-4 py-3"
                  style={{ background: cardBg, border: cardBorder }}
                >
                  <p
                    className="text-sm"
                    style={{ color: textPrimary, fontFamily: "'DM Sans', sans-serif", opacity: 0.75 }}
                  >
                    {INGREDIENTS_PLACEHOLDER}
                  </p>
                </div>
              )}
            </div>

          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
