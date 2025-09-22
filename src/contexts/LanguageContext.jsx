import React, { createContext, useContext, useState, useEffect } from "react";

const LanguageContext = createContext();

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error("useLanguage must be used within a LanguageProvider");
  }
  return context;
};

// 지원하는 언어 목록
const supportedLanguages = {
  ko: "ko",
  "ko-KR": "ko",
  en: "en",
  "en-US": "en",
  "en-GB": "en",
  ja: "ja",
  "ja-JP": "ja",
  zh: "zh",
  "zh-CN": "zh",
  "zh-TW": "zh",
  "zh-HK": "zh",
  es: "es",
  "es-ES": "es",
  "es-MX": "es",
  fr: "fr",
  "fr-FR": "fr",
  "fr-CA": "fr",
  de: "de",
  "de-DE": "de",
  it: "it",
  "it-IT": "it",
  ru: "ru",
  "ru-RU": "ru",
  pt: "pt",
  "pt-PT": "pt",
  "pt-BR": "pt",
  nl: "nl",
  "nl-NL": "nl",
  vi: "vi",
  "vi-VN": "vi",
  th: "th",
  "th-TH": "th",
  mn: "mn",
  "mn-MN": "mn",
  ne: "ne",
  "ne-NP": "ne",
  my: "my",
  "my-MM": "my",
  uz: "uz",
  "uz-UZ": "uz",
  ar: "ar",
  "ar-SA": "ar",
  "ar-EG": "ar",
};

// 기기 언어 감지 함수
const detectDeviceLanguage = () => {
  // 1. localStorage에 저장된 언어가 있으면 우선 사용
  const savedLanguage = localStorage.getItem("language");
  if (savedLanguage && supportedLanguages[savedLanguage]) {
    return savedLanguage;
  }

  // 2. 브라우저 언어 설정 감지
  const browserLanguage = navigator.language || navigator.languages?.[0];
  if (browserLanguage && supportedLanguages[browserLanguage]) {
    return supportedLanguages[browserLanguage];
  }

  // 3. 언어 코드의 첫 두 글자만 확인 (예: ko-KR -> ko)
  if (browserLanguage) {
    const primaryLanguage = browserLanguage.split("-")[0];
    if (supportedLanguages[primaryLanguage]) {
      return supportedLanguages[primaryLanguage];
    }
  }

  // 4. 기본값: 한국어
  return "ko";
};

export const LanguageProvider = ({ children }) => {
  const [language, setLanguage] = useState("ko");
  const [translations, setTranslations] = useState({});

  useEffect(() => {
    // 기기 언어 자동 감지
    const detectedLanguage = detectDeviceLanguage();
    setLanguage(detectedLanguage);
    loadTranslations(detectedLanguage);

    // 감지된 언어를 localStorage에 저장 (처음 방문한 경우)
    if (!localStorage.getItem("language")) {
      localStorage.setItem("language", detectedLanguage);
    }
  }, []);

  const loadTranslations = async (lang) => {
    try {
      const translationModule = await import(`../locales/${lang}.json`);
      setTranslations(translationModule.default);
    } catch (error) {
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
    // 번역이 아직 로드되지 않았으면 로딩 표시
    if (!translations || Object.keys(translations).length === 0) {
      return "로딩 중...";
    }

    const keys = key.split(".");
    let value = translations;

    for (const k of keys) {
      if (value && typeof value === "object" && k in value) {
        value = value[k];
      } else {
        // 키를 찾을 수 없을 때는 fallback이나 기본값 반환
        return fallback || getDefaultTranslation(key);
      }
    }

    return typeof value === "string"
      ? value
      : fallback || getDefaultTranslation(key);
  };

  // 기본 번역 제공 함수
  const getDefaultTranslation = (key) => {
    const defaultTranslations = {
      "profile.selectLanguage": "언어를 선택하세요",
      "profile.learningLanguage": "배우고 싶은 언어",
      "profile.teachingLanguage": "사용 가능한 언어",
      "profile.title": "프로필 설정",
      "profile.basicInfo": "01. 기본 인적사항",
      "profile.studentInfo": "02. 학생 정보",
      "profile.languageSettings": "03. 언어 설정",
      "profile.saveProfile": "프로필 저장",
      "profile.saving": "저장 중...",
      "common.loading": "로딩 중...",
    };

    return defaultTranslations[key] || key;
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
