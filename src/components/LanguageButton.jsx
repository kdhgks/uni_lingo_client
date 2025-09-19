import React from "react";
import { useNavigate } from "react-router-dom";
import styled from "styled-components";
import { useLanguage } from "../contexts/LanguageContext";

const LanguageButtonContainer = styled.button`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  background: none;
  border: none;
  color: #6c757d;
  cursor: pointer;
  padding: 0.5rem;
  border-radius: 8px;
  transition: all 0.3s ease;
  font-size: 0.9rem;

  &:hover {
    background: rgba(52, 152, 219, 0.1);
    color: #3498db;
  }

  .dark-mode & {
    color: #b0b0b0;

    &:hover {
      background: rgba(93, 173, 226, 0.1);
      color: #5dade2;
    }
  }
`;

const LanguageFlag = styled.span`
  font-size: 1.2rem;
`;

const LanguageText = styled.span`
  font-weight: 500;
`;

const LanguageButton = () => {
  const navigate = useNavigate();
  const { language } = useLanguage();

  const getLanguageFlag = (lang) => {
    const flags = {
      ko: "🇰🇷",
      en: "🇺🇸",
      ja: "🇯🇵",
      zh: "🇨🇳",
      vi: "🇻🇳",
      mn: "🇲🇳",
      uz: "🇺🇿",
      ne: "🇳🇵",
      my: "🇲🇲",
      th: "🇹🇭",
      es: "🇪🇸",
      fr: "🇫🇷",
      de: "🇩🇪",
      it: "🇮🇹",
      ru: "🇷🇺",
      ar: "🇸🇦",
      pt: "🇵🇹",
      nl: "🇳🇱",
    };
    return flags[lang] || "🌐";
  };

  const getLanguageName = (lang) => {
    const names = {
      ko: "한국어",
      en: "English",
      ja: "日本語",
      zh: "中文",
      vi: "Tiếng Việt",
      mn: "Монгол",
      uz: "O'zbek",
      ne: "नेपाली",
      my: "မြန်မာ",
      th: "ไทย",
      es: "Español",
      fr: "Français",
      de: "Deutsch",
      it: "Italiano",
      ru: "Русский",
      ar: "العربية",
      pt: "Português",
      nl: "Nederlands",
    };
    return names[lang] || "Language";
  };

  return (
    <LanguageButtonContainer onClick={() => navigate("/language-settings")}>
      <LanguageFlag>{getLanguageFlag(language)}</LanguageFlag>
      <LanguageText>{getLanguageName(language)}</LanguageText>
    </LanguageButtonContainer>
  );
};

export default LanguageButton;
