const googleReviewImg = "https://res.cloudinary.com/dui1jsojt/image/upload/v1777092671/tarang-assets/Google_Review__1__1773512308220.png";
const spoonForkImg = "https://res.cloudinary.com/dui1jsojt/image/upload/v1777092667/tarang-assets/19_1773512274982.png";
const lightBgPattern = "/welcome-light-bg.png";
import { useLocation } from "wouter";
import { useWelcomeAudio } from "../hooks/useWelcomeAudio";
import { MediaPreloader } from "../components/media-preloader";
import { useState, useCallback } from "react";
import { useLanguage } from "@/contexts/LanguageContext";
import { useTheme } from "@/contexts/ThemeContext";
import LanguageDropdown from "@/components/language-dropdown";
import { motion } from "framer-motion";
import { useCustomer } from "@/contexts/CustomerContext";
const atDigitalMenuLogo = "/bungle-logo.svg";
const instaImg = "https://res.cloudinary.com/dui1jsojt/image/upload/v1777093081/tarang-assets/instagram__2__1773345405292.png";
const fbImg = "https://res.cloudinary.com/dui1jsojt/image/upload/v1777092684/tarang-assets/facebook__2__1773345408410.png";
const ytImg = "https://res.cloudinary.com/dui1jsojt/image/upload/v1777093085/tarang-assets/youtube_1773345412112.png";
const mapsImg = "https://res.cloudinary.com/dui1jsojt/image/upload/v1777093082/tarang-assets/logo__1__1773390711534.png";
const callImg = "https://res.cloudinary.com/dui1jsojt/image/upload/v1777092681/tarang-assets/call_1773390891033.png";
const mailImg = "https://res.cloudinary.com/dui1jsojt/image/upload/v1777092684/tarang-assets/communication_1773390476300.png";
const whatsappImg = "https://res.cloudinary.com/dui1jsojt/image/upload/v1777092680/tarang-assets/apple_1773515172898.png";
const reservationImg = "https://res.cloudinary.com/dui1jsojt/image/upload/v1777092681/tarang-assets/booking__1__1776693914078.png";
import { useQuery } from "@tanstack/react-query";
import { AnimatePresence } from "framer-motion";
import { ReservationModal } from "@/components/hamburger-menu";

interface SocialLinks {
  instagram: string;
  facebook: string;
  youtube: string;
  googleReview: string;
  locate: string;
  call: string;
  whatsapp: string;
  email: string;
  website: string;
}

interface WelcomeScreenUI {
  logoUrl: string;
  buttonText: string;
}

const DEFAULT_LINKS: SocialLinks = {
  instagram: "https://www.instagram.com/",
  facebook: "https://www.facebook.com/",
  youtube: "https://youtube.com",
  googleReview: "https://g.page/r/",
  locate: "https://maps.google.com",
  call: "tel:+91",
  whatsapp: "https://wa.me/91",
  email: "mailto:info@bungle.com",
  website: "https://www.bungle.com",
};

const DEFAULT_WELCOME_UI: WelcomeScreenUI = {
  logoUrl: "",
  buttonText: "EXPLORE OUR MENU",
};

function ThemeToggle() {
  const { isDark, toggleTheme } = useTheme();

  return (
    <button
      onClick={toggleTheme}
      aria-label={isDark ? "Switch to light mode" : "Switch to dark mode"}
      className="flex items-center rounded-full transition-all duration-300 active:scale-95 select-none"
      style={{
        width: "88px",
        height: "36px",
        padding: "3px",
        background: "#030101",
        border: "1.5px solid #E49B1D",
        boxShadow: "inset 0 1px 3px rgba(0,0,0,0.4)",
      }}
      data-testid="button-theme-toggle"
    >
      {isDark ? (
        <>
          <div
            className="flex items-center justify-center rounded-full flex-shrink-0"
            style={{
              width: 28,
              height: 28,
              background: "#FFFFFF",
              boxShadow: "0 1px 4px rgba(0,0,0,0.25)",
            }}
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
              <path
                d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"
                fill="#2C2200"
                stroke="#2C2200"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <circle cx="18" cy="5" r="1" fill="#2C2200" />
              <circle cx="20" cy="9" r="0.7" fill="#2C2200" />
            </svg>
          </div>
          <span
            className="flex-1 text-center font-bold"
            style={{
              color: "#E49B1D",
              fontSize: "9px",
              letterSpacing: "0.06em",
              fontFamily: "'DM Sans', sans-serif",
            }}
          >
            DARK
          </span>
        </>
      ) : (
        <>
          <span
            className="flex-1 text-center font-bold"
            style={{
              color: "#E49B1D",
              fontSize: "9px",
              letterSpacing: "0.06em",
              fontFamily: "'DM Sans', sans-serif",
            }}
          >
            LIGHT
          </span>
          <div
            className="flex items-center justify-center rounded-full flex-shrink-0"
            style={{
              width: 28,
              height: 28,
              background: "#FFFFFF",
              boxShadow: "0 2px 6px rgba(0,0,0,0.18)",
            }}
          >
            <svg
              width="15"
              height="15"
              viewBox="0 0 24 24"
              fill="none"
              stroke="#888"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <circle cx="12" cy="12" r="5" />
              <line x1="12" y1="1" x2="12" y2="3" />
              <line x1="12" y1="21" x2="12" y2="23" />
              <line x1="4.22" y1="4.22" x2="5.64" y2="5.64" />
              <line x1="18.36" y1="18.36" x2="19.78" y2="19.78" />
              <line x1="1" y1="12" x2="3" y2="12" />
              <line x1="21" y1="12" x2="23" y2="12" />
              <line x1="4.22" y1="19.78" x2="5.64" y2="18.36" />
              <line x1="18.36" y1="5.64" x2="19.78" y2="4.22" />
            </svg>
          </div>
        </>
      )}
    </button>
  );
}

function CustomerFormModal({
  onClose,
  onSubmit,
}: {
  onClose: () => void;
  onSubmit: (name: string, phone: string) => Promise<void>;
}) {
  const { isDark } = useTheme();
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [errors, setErrors] = useState<{ name?: string; phone?: string }>({});
  const [submitting, setSubmitting] = useState(false);

  function validate() {
    const e: { name?: string; phone?: string } = {};
    if (!name.trim()) e.name = "Name is required";
    if (!/^[0-9]{10}$/.test(phone)) e.phone = "Enter a valid 10-digit phone number";
    return e;
  }

  async function handleSubmit(ev: React.FormEvent) {
    ev.preventDefault();
    const e = validate();
    if (Object.keys(e).length > 0) { setErrors(e); return; }
    setSubmitting(true);
    try {
      await onSubmit(name.trim(), phone.trim());
    } finally {
      setSubmitting(false);
    }
  }

  const inputStyle = {
    background: isDark ? "#1a1a1a" : "#fff",
    border: "1.5px solid var(--bb-border)",
    color: "var(--bb-text)",
    fontFamily: "'DM Sans', sans-serif",
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-center justify-center"
      style={{ background: "rgba(0,0,0,0.55)" }}
    >
      <motion.div
        initial={{ scale: 0.92, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.92, opacity: 0 }}
        transition={{ type: "spring", stiffness: 320, damping: 28 }}
        className="relative w-full max-w-xs mx-4 rounded-2xl p-6 shadow-2xl"
        style={{ background: isDark ? "#111" : "#FDFAF4", border: "1.5px solid var(--bb-border)" }}
      >
        {/* Title */}
        <h2
          className="text-lg font-bold uppercase tracking-wider mb-1 text-center"
          style={{ color: "var(--bb-gold)", fontFamily: "'DM Sans', sans-serif" }}
        >
          Welcome!
        </h2>
        <p
          className="text-xs text-center mb-5"
          style={{ color: "var(--bb-text-dim)" }}
        >
          Please share your details before exploring the menu
        </p>

        <form onSubmit={handleSubmit} className="space-y-4" noValidate>
          {/* Name */}
          <div className="space-y-1">
            <label className="text-xs font-semibold uppercase tracking-wider" style={{ color: "var(--bb-text-dim)" }}>
              Name <span style={{ color: "var(--bb-gold)" }}>*</span>
            </label>
            <input
              type="text"
              value={name}
              onChange={e => { setName(e.target.value); setErrors(prev => ({ ...prev, name: undefined })); }}
              placeholder="Your name"
              className="w-full rounded-lg px-3 py-2 text-sm outline-none"
              style={inputStyle}
              autoFocus
            />
            {errors.name && (
              <p className="text-xs" style={{ color: "#ef4444" }}>{errors.name}</p>
            )}
          </div>

          {/* Phone */}
          <div className="space-y-1">
            <label className="text-xs font-semibold uppercase tracking-wider" style={{ color: "var(--bb-text-dim)" }}>
              Phone Number <span style={{ color: "var(--bb-gold)" }}>*</span>
            </label>
            <input
              type="tel"
              value={phone}
              onChange={e => { setPhone(e.target.value.replace(/\D/g, "").slice(0, 10)); setErrors(prev => ({ ...prev, phone: undefined })); }}
              placeholder="10-digit mobile number"
              className="w-full rounded-lg px-3 py-2 text-sm outline-none"
              style={inputStyle}
            />
            {errors.phone && (
              <p className="text-xs" style={{ color: "#ef4444" }}>{errors.phone}</p>
            )}
          </div>

          <button
            type="submit"
            disabled={submitting}
            className="w-full py-3 rounded-xl font-bold uppercase tracking-wider text-sm transition-opacity disabled:opacity-60 mt-2"
            style={{ background: "var(--bb-gold)", color: "#fff", fontFamily: "'DM Sans', sans-serif" }}
          >
            {submitting ? "Please wait…" : "Let's Go →"}
          </button>
        </form>
      </motion.div>
    </motion.div>
  );
}

export default function Welcome() {
  const [, setLocation] = useLocation();
  const { playWelcomeAudio } = useWelcomeAudio();
  const [mediaReady, setMediaReady] = useState(false);
  const [showReservation, setShowReservation] = useState(false);
  const [showCustomerForm, setShowCustomerForm] = useState(false);
  const { t, language } = useLanguage();
  const { isDark } = useTheme();

  const { data: linksData } = useQuery<SocialLinks>({
    queryKey: ["/api/social-links"],
  });

  const { data: welcomeUIData } = useQuery<WelcomeScreenUI>({
    queryKey: ["/api/welcome-screen-ui"],
  });

  const links: SocialLinks = linksData ?? DEFAULT_LINKS;
  const welcomeUI: WelcomeScreenUI = welcomeUIData ?? DEFAULT_WELCOME_UI;
  const logoSrc = welcomeUI.logoUrl && welcomeUI.logoUrl.trim() !== "" ? welcomeUI.logoUrl : atDigitalMenuLogo;

  const { customer, setCustomer } = useCustomer();

  const handleExploreMenu = () => {
    if (customer) {
      // Already have their details — go straight in
      playWelcomeAudio();
      setLocation("/menu");
    } else {
      setShowCustomerForm(true);
    }
  };

  const handleCustomerSubmit = async (name: string, phone: string) => {
    // Save to context (persisted in localStorage)
    setCustomer({ name, phone });
    try {
      await fetch("/api/customers", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, contactNumber: phone }),
      });
    } catch {
      // non-blocking — if save fails, still proceed
    }
    setShowCustomerForm(false);
    playWelcomeAudio();
    setLocation("/menu");
  };

  const handleSocialClick = useCallback((url: string) => {
    const newWindow = window.open(url, "_blank", "noopener,noreferrer");
    if (newWindow) {
      (document.activeElement as HTMLElement)?.blur();
    }
  }, []);

  const labelColor = isDark ? "#FFFFFF" : "var(--bb-text)";

  return (
    <div
      className="bb-bg h-screen w-full overflow-hidden relative flex flex-col"
      style={
        isDark
          ? { backgroundColor: '#000000', backgroundImage: 'none' }
          : {
              backgroundColor: '#FDFAF4',
              backgroundImage: `url(${lightBgPattern})`,
              backgroundRepeat: 'repeat',
              backgroundSize: 'auto',
            }
      }
    >
      <MediaPreloader onComplete={() => setMediaReady(true)} />

      {/* Theme toggle — fixed top left */}
      <div className="fixed top-3 left-3 z-50">
        <ThemeToggle />
      </div>

      {/* Language dropdown — fixed top right */}
      <div className="fixed top-3 right-3 z-50">
        <LanguageDropdown />
      </div>

      {/* Main content */}
      <div className="relative z-10 flex flex-col items-center w-full flex-1 px-0 pt-0 pb-0 gap-3 justify-start">

        {/* Logo */}
        <div
          className="w-full flex justify-center flex-shrink-0"
          style={{ paddingTop: "40px", maxHeight: "310px", overflow: "hidden" }}
        >
          <img
            src={logoSrc}
            alt="Bung-le"
            style={{
              width: "270px",
              maxWidth: "100%",
              maxHeight: "270px",
              objectFit: "contain",
              filter: "none",
            }}
          />
        </div>

        {/* Explore button */}
        <button
          onClick={handleExploreMenu}
          className="btn-explore w-full max-w-xs py-4 font-semibold rounded-full transition-opacity hover:opacity-90 flex items-center justify-center gap-2"
          style={{ marginTop: "-10px" }}
          data-testid="button-explore-menu"
        >
          <span>{language === "en" ? (welcomeUI.buttonText || t.exploreMenu) : t.exploreMenu}</span>
          <span
            className="btn-icon w-8 h-8 flex-shrink-0 inline-block"
            style={{
              backgroundColor: '#E49B1D',
              WebkitMask: `url(${spoonForkImg}) no-repeat center / contain`,
              mask: `url(${spoonForkImg}) no-repeat center / contain`,
            }}
          />
        </button>

        {/* Follow Our Socials — card */}
        <div
          className="social-card w-full max-w-xs flex flex-col items-center gap-4"
          style={{ marginTop: "20px" }}
        >
          <p className="social-card-label text-xs font-medium tracking-widest">
            {t.followOurSocials}
          </p>
          <div className="flex items-center gap-6">
            <button
              onClick={() => handleSocialClick(links.instagram)}
              className="transition-opacity hover:opacity-80"
              data-testid="button-social-instagram"
            >
              <img src={instaImg} alt="Instagram" className="w-10 h-10 rounded-xl object-contain" />
            </button>
            <button
              onClick={() => handleSocialClick(links.facebook)}
              className="transition-opacity hover:opacity-80"
              data-testid="button-social-facebook"
            >
              <img src={fbImg} alt="Facebook" className="w-10 h-10 rounded-xl object-contain" />
            </button>
            <button
              onClick={() => handleSocialClick(links.youtube)}
              className="transition-opacity hover:opacity-80"
              data-testid="button-social-youtube"
            >
              <img src={ytImg} alt="YouTube" className="w-10 h-10 rounded-xl object-contain" />
            </button>
          </div>

          {/* Divider */}
          <div className="social-card-divider" style={{ width: "80%", height: "1px", background: "rgba(3,1,1,0.2)" }} />

          {/* Click to Rate Us */}
          <p className="social-card-label text-xs font-medium tracking-widest">
            {t.clickToRateUs}
          </p>
          <div style={{ overflow: "hidden", height: "62px" }}>
            <button
              onClick={() => handleSocialClick(links.googleReview)}
              className="hover:opacity-80 transition-opacity"
              data-testid="button-google-review"
            >
              <img
                src={googleReviewImg}
                alt="Rate us on Google"
                style={{ width: "188px", display: "block", marginTop: "-66px" }}
              />
            </button>
          </div>

          {/* Divider */}
          <div className="social-card-divider" style={{ width: "80%", height: "1px", background: "rgba(3,1,1,0.2)" }} />

          {/* Connect With Us */}
          <p className="social-card-label text-xs font-medium tracking-widest">
            {t.connectWithUs}
          </p>
          <div className="grid grid-cols-5 items-start justify-items-center gap-1 w-full">
            <button
              className="flex min-w-0 flex-col items-center gap-0.5 transition-opacity hover:opacity-80"
              onClick={() => handleSocialClick(links.locate)}
              data-testid="button-connect-locate"
            >
              <img src={mapsImg} alt="Google Maps" className="w-10 h-10 rounded-lg object-cover" />
              <span className="social-card-label text-xs font-semibold">{t.locate}</span>
            </button>
            <button
              className="flex min-w-0 flex-col items-center gap-0.5 transition-opacity hover:opacity-80"
              onClick={() => handleSocialClick(links.call)}
              data-testid="button-connect-call"
            >
              <img src={callImg} alt="Call" className="w-10 h-10 rounded-full object-cover" />
              <span className="social-card-label text-xs font-semibold">{t.call}</span>
            </button>
            <button
              className="flex min-w-0 flex-col items-center gap-0.5 transition-opacity hover:opacity-80"
              onClick={() => handleSocialClick(links.whatsapp)}
              data-testid="button-connect-chat"
            >
              <img src={whatsappImg} alt="WhatsApp" className="w-10 h-10 rounded-xl object-cover" />
              <span className="social-card-label text-xs font-semibold">{t.chat}</span>
            </button>
            <button
              className="flex min-w-0 flex-col items-center gap-0.5 transition-opacity hover:opacity-80"
              onClick={() => handleSocialClick(links.email)}
              data-testid="button-connect-email"
            >
              <img src={mailImg} alt="Email" className="w-10 h-10 rounded-lg object-cover" />
              <span className="social-card-label text-xs font-semibold">{t.email}</span>
            </button>
            <button
              className="flex min-w-0 flex-col items-center gap-0.5 transition-opacity hover:opacity-80"
              onClick={() => setShowReservation(true)}
              data-testid="button-connect-reservation"
            >
              <img src={reservationImg} alt="Reservation" className="w-10 h-10 rounded-xl object-contain" />
              <span className="social-card-label text-xs font-semibold">{t.book}</span>
            </button>
          </div>

          {/* Footer */}
          <p
            className="social-card-label cursor-pointer text-xs font-medium tracking-widest"
            style={{ textTransform: "lowercase" }}
            onClick={() => handleSocialClick(links.website)}
            data-testid="text-website-footer"
          >
            {links.website.replace(/^https?:\/\//, "")}
          </p>
        </div>

      </div>
      <AnimatePresence>
        {showReservation && (
          <ReservationModal onClose={() => setShowReservation(false)} />
        )}
      </AnimatePresence>
      <AnimatePresence>
        {showCustomerForm && (
          <CustomerFormModal
            onClose={() => setShowCustomerForm(false)}
            onSubmit={handleCustomerSubmit}
          />
        )}
      </AnimatePresence>
    </div>
  );
}
