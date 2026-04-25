import { useState, useMemo, useEffect } from "react";
import { motion } from "framer-motion";
import { useQuery } from "@tanstack/react-query";
import { ArrowLeft, Search, Mic, MicOff, ChevronDown, Filter } from "lucide-react";
import Lottie from "lottie-react";
// @ts-ignore
import panAnimation from "@assets/Animaed_pan_1773736045253.json";
import { useLocation, useParams } from "wouter";
import { useTheme } from "@/contexts/ThemeContext";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import ProductCard from "@/components/product-card";
import DishDetailModal from "@/components/dish-detail-modal";
import FloatingButtons from "@/components/floating-buttons";
import { useLanguage } from "@/contexts/LanguageContext";
import type { MenuItem, MenuCategory, MenuSubCategory } from "@shared/schema";

function findSubcategoryNode(categories: MenuCategory[], categoryId: string, subcategoryId: string): MenuSubCategory | null {
  for (const cat of categories) {
    const found = searchSubs(cat.subcategories, subcategoryId);
    if (found) return found;
  }
  return null;
}

function searchSubs(subs: MenuSubCategory[], id: string): MenuSubCategory | null {
  for (const sub of subs) {
    if (sub.id === id) return sub;
    if (sub.subcategories?.length) {
      const found = searchSubs(sub.subcategories, id);
      if (found) return found;
    }
  }
  return null;
}

const ADDON_REGEX = /ADD\s+[A-Z][^\n]*?\d+[^\n]*/i;

function extractAddon(text: string | number | undefined | null): string | null {
  if (text === undefined || text === null) return null;
  const s = String(text).trim();
  if (!s) return null;
  const match = s.match(ADDON_REGEX);
  if (!match) return null;
  return match[0].replace(/\s+/g, " ").trim();
}

function normalizeAddon(s: string): string {
  return s.toLowerCase().replace(/[^a-z0-9]+/g, "");
}

function stripAddonFromText(text: string | undefined | null, addon: string): string {
  if (!text) return "";
  const target = normalizeAddon(addon);
  let cleaned = String(text)
    .split(/[\n;]+|(?:\s[&/-]\s)/)
    .filter((part) => normalizeAddon(part) !== target)
    .join(" ")
    .trim();
  if (normalizeAddon(cleaned) === target) cleaned = "";
  cleaned = cleaned.replace(new RegExp(addon.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"), "i"), "").trim();
  cleaned = cleaned.replace(/^[\s,&/.-]+|[\s,&/.-]+$/g, "");
  return cleaned;
}

interface ISpeechRecognitionEvent {
  results: SpeechRecognitionResultList;
}

interface ISpeechRecognitionErrorEvent {
  error: string;
}

interface ISpeechRecognition extends EventTarget {
  continuous: boolean;
  interimResults: boolean;
  lang: string;
  start(): void;
  stop(): void;
  onstart: ((event: Event) => void) | null;
  onresult: ((event: ISpeechRecognitionEvent) => void) | null;
  onerror: ((event: ISpeechRecognitionErrorEvent) => void) | null;
  onend: ((event: Event) => void) | null;
}

declare global {
  interface Window {
    SpeechRecognition: new () => ISpeechRecognition;
    webkitSpeechRecognition: new () => ISpeechRecognition;
  }
}

export default function SubcategoryProducts() {
  const [, setLocation] = useLocation();
  const params = useParams<{ category: string; subcategory: string }>();
  const categoryId = params.category || "mocktails";
  const subcategoryId = params.subcategory || "";
  const { t } = useLanguage();
  const { isDark } = useTheme();

  const { data: menuCategories = [], isLoading: isLoadingCategories } = useQuery<MenuCategory[]>({
    queryKey: ["/api/menu-categories"],
  });

  // Get filter from URL params, fallback to localStorage
  const searchParams = new URLSearchParams(typeof window !== 'undefined' ? window.location.search : '');
  const getInitialFilter = () => {
    const urlFilter = searchParams.get('filter');
    if (urlFilter) {
      return urlFilter as "all" | "veg" | "non-veg";
    }
    try {
      const saved = localStorage.getItem("foodVegFilter");
      return (saved as "all" | "veg" | "non-veg") || "all";
    } catch {
      return "all";
    }
  };

  const currentSubcategory = menuCategories.length > 0
    ? findSubcategoryNode(menuCategories, categoryId, subcategoryId)
    : null;

  const [searchQuery, setSearchQuery] = useState("");
  const [isListening, setIsListening] = useState(false);
  const [speechRecognition, setSpeechRecognition] = useState<ISpeechRecognition | null>(null);
  const [voiceSearchSupported, setVoiceSearchSupported] = useState(false);
  const [vegFilter, setVegFilter] = useState<"all" | "veg" | "non-veg">(getInitialFilter);
  const [selectedDish, setSelectedDish] = useState<MenuItem | null>(null);

  const itemsQuery = useQuery<MenuItem[]>({
    queryKey: ["/api/menu-items", subcategoryId],
    queryFn: async () => {
      const response = await fetch(`/api/menu-items?category=${encodeURIComponent(subcategoryId)}`);
      if (!response.ok) throw new Error('Failed to fetch');
      return response.json();
    },
    staleTime: 5 * 60 * 1000, // 5 minutes
    retry: 3,
    retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 10000),
  });
  
  const { data: menuItems = [], isLoading, error, isError } = itemsQuery;

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [categoryId, subcategoryId]);

  useEffect(() => {
    console.log("Menu Items Query State:", {
      isLoading,
      isError,
      error: error?.message,
      dataCount: menuItems.length,
      data: menuItems
    });
  }, [menuItems, isLoading, isError, error]);

  useEffect(() => {
    if ("webkitSpeechRecognition" in window || "SpeechRecognition" in window) {
      const SpeechRecognitionAPI = window.SpeechRecognition || window.webkitSpeechRecognition;
      const recognition = new SpeechRecognitionAPI();
      recognition.continuous = false;
      recognition.interimResults = false;
      recognition.lang = "en-US";

      recognition.onstart = () => setIsListening(true);
      recognition.onresult = (event: ISpeechRecognitionEvent) => {
        const transcript = event.results[0][0].transcript;
        setSearchQuery(transcript);
        setIsListening(false);
      };
      recognition.onerror = () => setIsListening(false);
      recognition.onend = () => setIsListening(false);

      setSpeechRecognition(recognition);
      setVoiceSearchSupported(true);
    }
  }, []);

  useEffect(() => {
    console.log("DETAILED CATEGORY DEBUG:", {
      categoryId,
      subcategoryId,
      currentSubcategory: currentSubcategory?.id,
      title: currentSubcategory?.title,
      menuItemsCount: menuItems.length,
      firstItemCategory: menuItems[0]?.category,
      allItemCategories: Array.from(new Set(menuItems.map(item => item.category))),
    });
  }, [menuItems, currentSubcategory, categoryId, subcategoryId]);

  const categoryAddon = useMemo(() => {
    const counts = new Map<string, { display: string; count: number }>();
    for (const item of menuItems) {
      const candidates = [extractAddon(item.description), extractAddon(item.price as any)];
      const seenForItem = new Set<string>();
      for (const c of candidates) {
        if (!c) continue;
        const key = normalizeAddon(c);
        if (seenForItem.has(key)) continue;
        seenForItem.add(key);
        const existing = counts.get(key);
        if (existing) existing.count += 1;
        else counts.set(key, { display: c, count: 1 });
      }
    }
    let best: { display: string; count: number } | null = null;
    counts.forEach((v) => {
      const current = best;
      if (!current || v.count > current.count) best = v;
    });
    const winner = best as { display: string; count: number } | null;
    return winner && winner.count >= 1 ? winner.display : null;
  }, [menuItems]);

  const filteredItems = useMemo(() => {
    let filtered = menuItems;
    
    // Apply availability filter
    filtered = filtered.filter(item => item.isAvailable);
    
    // Apply veg filter
    if (vegFilter === "veg") {
      filtered = filtered.filter(item => item.isVeg);
    } else if (vegFilter === "non-veg") {
      filtered = filtered.filter(item => !item.isVeg);
    }
    
    if (searchQuery.trim()) {
      filtered = filtered.filter(item =>
        item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.description.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    if (categoryAddon) {
      const addonKey = normalizeAddon(categoryAddon);
      filtered = filtered.map((item) => {
        const newDescription = stripAddonFromText(item.description, categoryAddon);
        let newPrice = item.price;
        if (typeof item.price === "string" && normalizeAddon(item.price) === addonKey) {
          newPrice = "";
        }
        if (newDescription === item.description && newPrice === item.price) return item;
        return { ...item, description: newDescription, price: newPrice } as MenuItem;
      });
    }

    return filtered;
  }, [menuItems, searchQuery, vegFilter, categoryAddon]);

  const startVoiceSearch = () => {
    if (speechRecognition && voiceSearchSupported) {
      try {
        speechRecognition.start();
      } catch (error) {
        console.error("Error starting voice recognition:", error);
      }
    }
  };

  if (!isLoadingCategories && !currentSubcategory) {
    return (
      <div className="bb-bg min-h-screen flex items-center justify-center">
        <p style={{ color: "var(--bb-text)" }}>Category not found</p>
      </div>
    );
  }

  return (
    <div className="bb-bg min-h-screen">
      <header className="bb-header sticky top-0 z-30">
        <div className="container mx-auto px-2 sm:px-4 py-3 sm:py-4">
          <div className="flex items-center justify-between gap-2">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setLocation(
                categoryId === "mocktails" || (categoryId === "food" && subcategoryId === "desserts")
                  ? "/menu"
                  : `/menu/${categoryId}`
              )}
              className="hover:bg-transparent flex-shrink-0"
              style={{ color: "#C9A55C" }}
              data-testid="button-back"
            >
              <ArrowLeft className="h-5 w-5 sm:h-6 sm:w-6" />
            </Button>

            <div className="flex-1 flex items-center justify-center relative">
              <h1
                className="font-semibold text-center tracking-widest uppercase"
                style={{
                  fontSize: "clamp(13px, 3.5vw, 19px)",
                  color: "var(--bb-gold)",
                  fontFamily: "'DM Sans', sans-serif",
                }}
              >
                {(currentSubcategory?.title || subcategoryId).toUpperCase()}
              </h1>
            </div>

            <div className="w-9" />
          </div>
        </div>
      </header>

      <div className="container mx-auto px-3 sm:px-4 py-2 sm:py-4 pb-24">
        <div className="relative mb-3 sm:mb-6">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4" style={{ color: "var(--bb-gold)" }} />
          <Input
            type="text"
            placeholder={t.searchItems}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10 pr-32 sm:pr-40 h-11 rounded-full border-2 text-[var(--bb-input-text)] placeholder:text-[var(--bb-text-dim)] focus-visible:ring-2 focus-visible:ring-[#C9A55C]/50"
            style={{ 
              borderColor: '#C9A55C', 
              backgroundColor: 'transparent'
            }}
            data-testid="input-search"
          />
            <div className="absolute right-1 top-1/2 transform -translate-y-1/2 flex items-center gap-0">
            {categoryId === "food" && (
              <div className="flex items-center">
                <div 
                  className="inline-flex rounded-full p-0.5 items-center gap-0"
                  style={isDark ? {
                    backgroundColor: vegFilter === "all" ? "rgba(255,255,255,0.1)" : vegFilter === "veg" ? "rgba(34,197,94,0.1)" : "rgba(239,68,68,0.1)"
                  } : {
                    backgroundColor: vegFilter === "all" ? "rgba(0,0,0,0.07)" : vegFilter === "veg" ? "rgba(34,197,94,0.12)" : "rgba(239,68,68,0.12)",
                    border: "1px solid rgba(0,0,0,0.12)"
                  }}
                >
                  <button
                    onClick={() => setVegFilter("all")}
                    className="px-2 py-0.5 text-[10px] sm:text-xs font-medium rounded-full transition-all duration-200 flex-shrink-0"
                    data-testid="filter-all"
                    style={
                      vegFilter === "all"
                        ? { backgroundColor: isDark ? "white" : "#1C1500", color: isDark ? "black" : "white", lineHeight: "1.2" }
                        : { color: isDark ? "#C9A55C" : "#5A3E00", lineHeight: "1.2" }
                    }
                  >
                    {t.all}
                  </button>
                  <button
                    onClick={() => setVegFilter("veg")}
                    className="px-2 py-0.5 text-[10px] sm:text-xs font-medium rounded-full transition-all duration-200 flex-shrink-0"
                    data-testid="filter-veg"
                    style={
                      vegFilter === "veg"
                        ? { backgroundColor: "#22C55E", color: "white", lineHeight: "1.2" }
                        : { color: isDark ? "#C9A55C" : "#5A3E00", lineHeight: "1.2" }
                    }
                  >
                    {t.veg}
                  </button>
                  <button
                    onClick={() => setVegFilter("non-veg")}
                    className="px-2 py-0.5 text-[10px] sm:text-xs font-medium rounded-full transition-all duration-200 flex-shrink-0"
                    data-testid="filter-non-veg"
                    style={
                      vegFilter === "non-veg"
                        ? { backgroundColor: "#EF4444", color: "white", lineHeight: "1.2" }
                        : { color: isDark ? "#C9A55C" : "#5A3E00", lineHeight: "1.2" }
                    }
                  >
                    {t.nonVeg}
                  </button>
                </div>
              </div>
            )}
            {voiceSearchSupported && (
              <Button
                variant="ghost"
                size="icon"
                onClick={isListening ? undefined : startVoiceSearch}
                className="h-9 w-9 hover:bg-transparent"
                data-testid="button-voice-search"
              >
                {isListening ? (
                  <MicOff className="h-4 w-4 text-red-500 animate-pulse" />
                ) : (
                  <Mic className="h-4 w-4 text-white" />
                )}
              </Button>
            )}
          </div>
        </div>

        {categoryAddon && (
          <div className="mb-4 sm:mb-6 flex justify-center" data-testid="banner-category-addon">
            <span
              className="inline-block px-4 py-1 rounded-full text-[11px] sm:text-xs font-semibold tracking-wide whitespace-nowrap text-center"
              style={{
                color: "var(--bb-gold)",
                background: "rgba(228,155,29,0.08)",
                border: "1px solid rgba(228,155,29,0.35)",
                fontFamily: "'DM Sans', sans-serif",
                lineHeight: 1.4,
              }}
            >
              <span style={{ opacity: 0.7, marginRight: 6 }}>Note:</span>
              {categoryAddon}
            </span>
          </div>
        )}

        {isLoading ? (
          <div className="flex flex-col items-center justify-center min-h-[300px]">
            <Lottie animationData={panAnimation} loop autoplay style={{ width: 160, height: 160 }} />
          </div>
        ) : filteredItems.length === 0 ? (
          <div className="flex flex-col items-center justify-center min-h-[300px] text-center px-4">
            <Search className="h-12 w-12 mb-4" style={{ color: "rgba(228,155,29,0.4)" }} />
            <h3 className="text-lg font-semibold mb-2 tracking-widest uppercase" style={{ fontFamily: "'DM Sans', sans-serif", color: "var(--bb-gold)" }}>
              {t.noItemsFound}
            </h3>
            <p className="text-sm" style={{ fontFamily: "'DM Sans', sans-serif", color: "var(--bb-text)", opacity: 0.6 }}>
              {searchQuery ? `${t.noResultsFor} "${searchQuery}"` : t.noItemsFound}
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-2 gap-x-3 gap-y-6 sm:gap-x-6 sm:gap-y-8">
            {filteredItems.map((item, index) => (
              <motion.div
                key={item._id?.toString() || index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05, duration: 0.3 }}
              >
                <ProductCard item={item} onClick={(dish) => setSelectedDish(dish)} />
              </motion.div>
            ))}
          </div>
        )}
      </div>

      <DishDetailModal item={selectedDish} onClose={() => setSelectedDish(null)} />
      <FloatingButtons />
    </div>
  );
}