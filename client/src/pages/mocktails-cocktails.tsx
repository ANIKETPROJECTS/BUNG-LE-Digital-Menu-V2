import { useLocation } from "wouter";
import { motion } from "framer-motion";
import { ArrowLeft, Menu as MenuIcon, X } from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import HamburgerMenu from "@/components/hamburger-menu";

const cocktailsImg = "https://res.cloudinary.com/dui1jsojt/image/upload/v1777092668/tarang-assets/COCKTAILS_1766751289781.jpg";
const mocktailsImg = "https://res.cloudinary.com/dui1jsojt/image/upload/v1777093037/tarang-assets/image_1776833112037.jpg";

const offerTiles = [
  {
    id: "offer-cocktails",
    label: "COCKTAILS",
    tag: "1 + 1 = ₹499",
    image: cocktailsImg,
    route: "/menu/bar/offer-cocktails",
  },
  {
    id: "offer-mocktails",
    label: "MOCKTAILS",
    tag: "1 + 1 = ₹399",
    image: mocktailsImg,
    route: "/menu/bar/offer-mocktails",
  },
];

export default function MocktailsCocktails() {
  const [, setLocation] = useLocation();
  const [showHamburgerMenu, setShowHamburgerMenu] = useState(false);
  const [failedImages, setFailedImages] = useState<Set<string>>(new Set());

  const fallbackImg = "https://res.cloudinary.com/dui1jsojt/image/upload/v1777092683/tarang-assets/coming_soon_imagev2_1766811809828.jpg";

  return (
    <div className="bb-bg min-h-screen">
      <header className="bb-header sticky top-0 z-30 elegant-shadow">
        <div className="container mx-auto px-2 sm:px-4 pt-1 pb-2.5">
          <div className="flex items-center w-full">
            <div className="flex items-center flex-shrink-0" style={{ width: "44px" }}>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setLocation("/menu")}
                className="hover:bg-transparent flex-shrink-0"
                style={{ color: "#333333" }}
                data-testid="button-back"
              >
                <ArrowLeft className="h-5 w-5 sm:h-6 sm:w-6" />
              </Button>
            </div>

            <div className="flex-1 flex justify-center items-center overflow-visible">
              <img
                src="/tarang-logo-circle.png"
                alt="Tarang Kitchen & Bar"
                style={{ height: "68px", width: "68px", objectFit: "contain", display: "block", transform: "scale(1.45)", transformOrigin: "center", marginTop: "8px" }}
                data-testid="img-logo"
              />
            </div>

            <div className="flex justify-end items-center flex-shrink-0" style={{ width: "44px" }}>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setShowHamburgerMenu(!showHamburgerMenu)}
                className="hover:bg-transparent"
                style={{ color: "#333333" }}
                data-testid="button-menu-toggle"
              >
                {showHamburgerMenu ? (
                  <X className="h-7 w-7 sm:h-8 sm:w-8 md:h-6 md:w-6" />
                ) : (
                  <MenuIcon className="h-7 w-7 sm:h-8 sm:w-8 md:h-6 md:w-6" />
                )}
              </Button>
            </div>
          </div>
        </div>

        <HamburgerMenu
          isOpen={showHamburgerMenu}
          onClose={() => setShowHamburgerMenu(false)}
          onCategoryClick={(id) => {
            if (id === "mocktails") setLocation("/menu/bar/mocktails-drinks");
            else if (id === "cocktails") setLocation("/menu/bar/cocktails");
            else if (id === "desserts") setLocation("/menu/desserts/desserts");
            else setLocation(`/menu/${id}`);
          }}
        />
      </header>

      <div className="container mx-auto px-3 sm:px-4 pt-6 pb-24">
        {/* Page heading */}
        <div className="text-center mb-6">
          <p
            className="text-[10px] uppercase tracking-[0.35em] font-light mb-1"
            style={{ color: "var(--bb-gold)", opacity: 0.75 }}
          >
            Exclusive Offer
          </p>
          <h1
            className="text-2xl font-black uppercase tracking-widest"
            style={{ color: "var(--bb-gold)", fontFamily: "'Cormorant Garamond', serif" }}
          >
            Buy 1 Get 1 Free
          </h1>
        </div>

        {/* Two offer tiles */}
        <div className="grid grid-cols-2 gap-3">
          {offerTiles.map((tile, index) => {
            const imgSrc = failedImages.has(tile.id) ? fallbackImg : tile.image;
            return (
              <motion.div
                key={tile.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                style={{
                  background: "linear-gradient(90deg, #E49B1D, #E6C55A)",
                  padding: "2px",
                  borderRadius: "10px",
                }}
              >
                <button
                  onClick={() => setLocation(tile.route)}
                  className="group overflow-hidden"
                  style={{
                    borderRadius: "8px",
                    display: "block",
                    width: "100%",
                    aspectRatio: "1 / 1.05",
                    position: "relative",
                  }}
                  data-testid={`tile-${tile.id}`}
                >
                  <img
                    src={imgSrc}
                    alt={tile.label}
                    style={{ position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "cover" }}
                    className="transition-transform duration-500 group-hover:scale-110"
                    onError={() => setFailedImages((prev) => new Set(prev).add(tile.id))}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-transparent" />

                  {/* BUY 1 GET 1 FREE badge at top */}
                  <div className="absolute top-2 left-0 right-0 flex justify-center">
                    <span
                      className="px-2 py-0.5 rounded-full text-[9px] font-bold uppercase tracking-widest"
                      style={{
                        background: "rgba(228,155,29,0.92)",
                        color: "#1C1500",
                      }}
                    >
                      Buy 1 Get 1 Free
                    </span>
                  </div>

                  <div className="absolute inset-0 flex flex-col items-center justify-end p-2 pb-3">
                    <h3
                      className="text-xl sm:text-2xl md:text-3xl font-bold tracking-widest uppercase text-center"
                      style={{
                        fontFamily: "'DM Sans', sans-serif",
                        color: "#FFFFFF",
                        textShadow: "0 2px 8px rgba(0,0,0,0.8)",
                        letterSpacing: "0.15em",
                      }}
                    >
                      {tile.label}
                    </h3>
                    <p
                      className="text-xs font-semibold mt-0.5"
                      style={{ color: "var(--bb-gold)", textShadow: "0 1px 4px rgba(0,0,0,0.9)" }}
                    >
                      {tile.tag}
                    </p>
                  </div>
                </button>
              </motion.div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
