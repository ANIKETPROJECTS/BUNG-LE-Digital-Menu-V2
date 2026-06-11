import { createContext, useContext, useState, useEffect, useCallback, type ReactNode } from "react";
import { englishStrings, type TranslationStrings } from "@/lib/translations";
import { translateStrings } from "@/lib/translationService";

interface LanguageContextType {
  language: string;
  setLanguage: (lang: string) => void;
  t: TranslationStrings;
  isTranslating: boolean;
}

const LanguageContext = createContext<LanguageContextType>({
  language: "en",
  setLanguage: () => {},
  t: englishStrings,
  isTranslating: false,
});

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [language, setLanguageState] = useState<string>(() => {
    try {
      return localStorage.getItem("bungle_language") || "en";
    } catch {
      return "en";
    }
  });

  const [t, setT] = useState<TranslationStrings>(englishStrings);
  const [isTranslating, setIsTranslating] = useState(false);

  const applyLanguage = useCallback(async (lang: string) => {
    if (lang === "en") {
      setT(englishStrings);
      return;
    }
    setIsTranslating(true);
    try {
      const translated = await translateStrings(englishStrings as unknown as Record<string, string>, lang);
      setT(translated as unknown as TranslationStrings);
    } catch {
      setT(englishStrings);
    } finally {
      setIsTranslating(false);
    }
  }, []);

  // Apply saved language on mount
  useEffect(() => {
    applyLanguage(language);
  }, []); // eslint-disable-line

  const setLanguage = useCallback((lang: string) => {
    setLanguageState(lang);
    try {
      localStorage.setItem("bungle_language", lang);
    } catch {}
    applyLanguage(lang);
  }, [applyLanguage]);

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t, isTranslating }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  return useContext(LanguageContext);
}
