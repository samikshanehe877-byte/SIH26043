"use client";

import { createContext, useContext, useEffect, useState } from "react";

export type Language = "English" | "Hindi";

interface LanguageContextType {
  language: Language;
  setLanguage: (language: Language) => void;
  t: (key: string) => string;
}

const translations: Record<Language, Record<string, string>> = {
  English: {
    app_name: "SamasyaLink",
    sign_in: "Sign In",
    sign_up: "Sign Up",
    logout: "Logout",
    forgot_password: "Forgot Password?",
    language: "Language",
    english: "English",
    hindi: "??????",
  },

  Hindi: {
    app_name: "SamasyaLink",
    sign_in: "???? ??",
    sign_up: "???? ??",
    logout: "??? ???",
    forgot_password: "??????? ??? ???",
    language: "????",
    english: "English",
    hindi: "??????",
  },
};

const LanguageContext = createContext<LanguageContextType | undefined>(
  undefined
);

export function LanguageProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [language, setLanguageState] = useState<Language>("English");

  useEffect(() => {
    const savedLanguage = localStorage.getItem("language");

    if (savedLanguage === "Hindi" || savedLanguage === "English") {
      setLanguageState(savedLanguage);
    }
  }, []);

  const setLanguage = (newLanguage: Language) => {
    setLanguageState(newLanguage);
    localStorage.setItem("language", newLanguage);
  };

  const t = (key: string) => {
    return translations[language][key] ?? translations.English[key] ?? key;
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const context = useContext(LanguageContext);

  if (!context) {
    throw new Error("useLanguage must be used inside LanguageProvider");
  }

  return context;
}
