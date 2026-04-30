import { useLocation } from "wouter";
import { motion } from "framer-motion";
import { ArrowLeft, Menu as MenuIcon, X } from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import HamburgerMenu from "@/components/hamburger-menu";

const premiumMocktailsImg = "https://res.cloudinary.com/dui1jsojt/image/upload/v1777093037/tarang-assets/image_1776833112037.jpg";
const cocktailsImg = "https://res.cloudinary.com/dui1jsojt/image/upload/v1777092668/tarang-assets/COCKTAILS_1766751289781.jpg";

const categories = [
  {
    id: "mocktails",
    label: "MOCKTAILS",
    description: "Refreshing non-alcoholic beverages",
    image: premiumMocktailsImg,
    route: "/menu/mocktails",
  },
  {
    id: "cocktails",
    label: "COCKTAILS",
    description: "Expertly mixed drinks",
    image: cocktailsImg,
    route: "/menu/cocktails",
  },
];

export default function MocktailsCocktails() {
  const [, setLocation] = useLocation();
  const [showHamburgerMenu, setShowHamburgerMenu] = useState(false);
  const [failedImages, setFailedImages] = useState<Set<string>>(new Set());

  const fallbackImg = "https://res.cloudinary.com/dui1jsojt/image/upload/v1777092683/tarang-assets/coming_soon_imagev2_1766811809828.jpg";

  const handleCategoryClick = (route: string) => {
    setLocation(route);
  };

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
            if (id === "mocktails") setLocation("/menu/mocktails");
            else if (id === "cocktails") setLocation("/menu/cocktails");
            else if (id === "desserts") setLocation("/menu/desserts/desserts");
            else setLocation(`/menu/${id}`);
          }}
        />
      </header>

      <div className="container mx-auto px-3 sm:px-4 pt-6 pb-24">
        <div className="mb-6 text-center">
          <p
            className="text-[11px] uppercase tracking-[0.3em] font-light mb-1"
            style={{ color: "var(--bb-gold)", fontFamily: "'DM Sans', sans-serif" }}
          >
            Choose a Section
          </p>
          <h1
            className="text-2xl font-black uppercase tracking-widest"
            style={{ color: "var(--bb-gold)", fontFamily: "'Cormorant Garamond', serif" }}
          >
            Mocktails &amp; Cocktails
          </h1>
        </div>

        <div className="grid grid-cols-2 gap-3">
          {categories.map((category, index) => {
            const imgSrc = failedImages.has(category.id) ? fallbackImg : category.image;
            return (
              <motion.div
                key={category.id}
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
                  onClick={() => handleCategoryClick(category.route)}
                  className="group overflow-hidden"
                  style={{
                    borderRadius: "8px",
                    display: "block",
                    width: "100%",
                    aspectRatio: "1 / 1.05",
                    position: "relative",
                  }}
                  data-testid={`tile-${category.id}`}
                >
                  <img
                    src={imgSrc}
                    alt={category.label}
                    style={{ position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "cover" }}
                    className="transition-transform duration-500 group-hover:scale-110"
                    onError={() => setFailedImages((prev) => new Set(prev).add(category.id))}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
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
                      {category.label}
                    </h3>
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
