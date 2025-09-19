import React, { createContext, useContext, useState, useEffect } from "react";

const LanguageContext = createContext();

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error("useLanguage must be used within a LanguageProvider");
  }
  return context;
};

export const LanguageProvider = ({ children }) => {
  const [language, setLanguage] = useState("ko");
  const [translations, setTranslations] = useState({});

  useEffect(() => {
    // 로컬 스토리지에서 언어 설정 불러오기
    const savedLanguage = localStorage.getItem("language") || "ko";
    setLanguage(savedLanguage);
    loadTranslations(savedLanguage);
  }, []);

  const loadTranslations = async (lang) => {
    try {
      const translationModule = await import(`../locales/${lang}.json`);
      setTranslations(translationModule.default);
    } catch (error) {
      console.error(`Failed to load translations for ${lang}:`, error);
      // 기본값으로 한국어 로드
      if (lang !== "ko") {
        const koModule = await import("../locales/ko.json");
        setTranslations(koModule.default);
      }
    }
  };

  const changeLanguage = async (newLanguage) => {
    setLanguage(newLanguage);
    localStorage.setItem("language", newLanguage);
    await loadTranslations(newLanguage);
  };

  const t = (key, fallback = "") => {
    // 번역이 아직 로드되지 않았으면 키를 그대로 반환하지 말고 로딩 표시
    if (!translations || Object.keys(translations).length === 0) {
      return "로딩 중...";
    }

    const keys = key.split(".");
    let value = translations;

    for (const k of keys) {
      if (value && typeof value === "object" && k in value) {
        value = value[k];
      } else {
        console.warn(`Translation key not found: ${key}`);
        return fallback || key;
      }
    }

    return typeof value === "string" ? value : fallback || key;
  };

  const value = {
    language,
    changeLanguage,
    t,
    translations,
  };

  return (
    <LanguageContext.Provider value={value}>
      {children}
    </LanguageContext.Provider>
  );
};
