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
const atDigitalMenuLogo = "https://res.cloudinary.com/dui1jsojt/image/upload/v1777092678/tarang-assets/Tarang_Logo_insta_1776533106517.png";
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
  instagram: "https://www.instagram.com/tarangkitchenandbar/",
  facebook: "https://www.facebook.com/Tarangkitchenandbar/",
  youtube: "https://youtube.com",
  googleReview: "https://g.page/r/CbKAeLOlg005EBM/review",
  locate: "https://maps.app.goo.gl/CQLKFLDWPQK5f6U7A",
  call: "tel:+917738310238",
  whatsapp: "https://wa.me/917738310238",
  email: "mailto:TARANG.HOSPITALITY@GMAIL.COM",
  website: "https://www.tarangkitchenandbar.com",
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

export default function Welcome() {
  const [, setLocation] = useLocation();
  const { playWelcomeAudio } = useWelcomeAudio();
  const [mediaReady, setMediaReady] = useState(false);
  const [showReservation, setShowReservation] = useState(false);
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

  const handleExploreMenu = () => {
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
          ? { backgroundColor: '#030101', backgroundImage: 'none' }
          : {
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
            alt="AT Digital Menu"
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
    </div>
  );
}
