import { useCallback, useContext, useEffect, useMemo, useState } from "react";
import arLocale from "../locales/ar.json";
import enLocale from "../locales/en.json";
import { LanguageContext } from "./language-context.js";

const STORAGE_KEY = "tamn-lang";
const locales = { ar: arLocale, en: enLocale };

function readStoredLanguage() {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    return stored === "en" ? "en" : "ar";
  } catch {
    return "ar";
  }
}

function getNested(obj, path) {
  return path.split(".").reduce((acc, key) => acc?.[key], obj);
}

export function LanguageProvider({ children }) {
  const [language, setLanguageState] = useState(() => readStoredLanguage());

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, language);
    document.documentElement.lang = language;
    document.documentElement.dir = language === "ar" ? "rtl" : "ltr";
  }, [language]);

  const setLanguage = useCallback((lang) => {
    setLanguageState(lang === "en" ? "en" : "ar");
  }, []);

  const t = useCallback(
    (key, vars) => {
      let value = getNested(locales[language], key);
      if (value == null) return key;
      if (vars) {
        Object.entries(vars).forEach(([k, v]) => {
          value = value.replace(`{{${k}}}`, String(v));
        });
      }
      return value;
    },
    [language]
  );

  const dir = language === "ar" ? "rtl" : "ltr";

  const value = useMemo(
    () => ({ language, setLanguage, t, dir }),
    [language, setLanguage, t, dir]
  );

  return (
    <LanguageContext.Provider value={value}>{children}</LanguageContext.Provider>
  );
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error("useLanguage must be used within LanguageProvider");
  }
  return context;
}

export function useTranslation() {
  const { t, language, setLanguage, dir } = useLanguage();
  return { t, language, setLanguage, dir };
}
