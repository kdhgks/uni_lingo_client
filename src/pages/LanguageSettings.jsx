import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import styled, { keyframes } from "styled-components";
import UnderBar from "../components/UnderBar";
import Sidebar from "../components/Sidebar";
import { useLanguage } from "../contexts/LanguageContext";

const slideInUp = keyframes`
  from {
    opacity: 0;
    transform: translateY(30px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
`;

const LanguageSettingsContainer = styled.div`
  min-height: 100vh;
  background: #ffffff;
  padding-left: 0;
  transition: background-color 0.3s ease;

  @media (min-width: 769px) {
    padding-left: 250px;
  }

  @media (min-width: 1200px) {
    padding-left: 280px;
  }

  .dark-mode & {
    background: #1a1a1a;
  }
`;

const Main = styled.main`
  max-width: 1000px;
  margin: 0 auto;
  padding: 1rem 2rem;

  @media (max-width: 768px) {
    padding: 0.5rem 1rem;
  }
`;

const LanguageGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 1rem;
  margin-top: 1rem;

  @media (max-width: 768px) {
    grid-template-columns: 1fr;
  }
`;

const LanguageCard = styled.button`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 1.5rem;
  border: 2px solid #e1e8ed;
  border-radius: 12px;
  background: #ffffff;
  cursor: pointer;
  transition: all 0.3s ease;
  text-align: left;
  animation: ${slideInUp} 0.3s ease-out;

  @media (min-width: 769px) {
    &:hover {
      border-color: #3498db;
      background: rgba(52, 152, 219, 0.05);
      transform: translateY(-2px);
      box-shadow: 0 4px 15px rgba(52, 152, 219, 0.2);
    }
  }

  &.selected {
    border-color: #3498db;
    background: linear-gradient(
      135deg,
      rgba(52, 152, 219, 0.1) 0%,
      rgba(46, 204, 113, 0.1) 100%
    );
    box-shadow: 0 4px 15px rgba(52, 152, 219, 0.3);
  }

  .dark-mode & {
    background: #2d2d2d;
    border-color: #555;
    color: #ffffff;

    @media (min-width: 769px) {
      &:hover {
        border-color: #5dade2;
        background: rgba(93, 173, 226, 0.1);
      }
    }

    &.selected {
      border-color: #5dade2;
      background: linear-gradient(
        135deg,
        rgba(93, 173, 226, 0.2) 0%,
        rgba(46, 204, 113, 0.2) 100%
      );
    }
  }
`;

const LanguageName = styled.h3`
  font-size: 1.2rem;
  font-weight: 600;
  color: #2c3e50;
  margin: 0;
  transition: color 0.3s ease;

  .dark-mode & {
    color: #ffffff;
  }
`;

const SelectedIndicator = styled.div`
  width: 24px;
  height: 24px;
  border-radius: 50%;
  border: 2px solid #3498db;
  display: flex;
  align-items: center;
  justify-content: center;
  background: #3498db;
  color: white;
  font-size: 0.8rem;
  font-weight: bold;

  .dark-mode & {
    border-color: #5dade2;
    background: #5dade2;
  }
`;

const languages = [
  { code: "ko", name: "한국어" },
  { code: "en", name: "English" },
  { code: "ja", name: "日本語" },
  { code: "zh", name: "中文" },
  { code: "vi", name: "Tiếng Việt" },
  { code: "mn", name: "Монгол" },
  { code: "uz", name: "O'zbek" },
  { code: "ne", name: "नेपाली" },
  { code: "my", name: "မြန်မာ" },
  { code: "th", name: "ไทย" },
  { code: "es", name: "Español" },
  { code: "fr", name: "Français" },
  { code: "de", name: "Deutsch" },
  { code: "it", name: "Italiano" },
  { code: "ru", name: "Русский" },
  { code: "ar", name: "العربية" },
  { code: "pt", name: "Português" },
  { code: "nl", name: "Nederlands" },
];

const LanguageSettings = () => {
  const navigate = useNavigate();
  const { language, changeLanguage, t } = useLanguage();
  const [isChanging, setIsChanging] = useState(false);

  const handleLanguageChange = async (newLanguage) => {
    if (newLanguage === language || isChanging) return;

    setIsChanging(true);
    try {
      await changeLanguage(newLanguage);
      // 언어 변경 후 이전 화면으로 돌아가기
      setTimeout(() => {
        setIsChanging(false);
        navigate(-1);
      }, 500);
    } catch (error) {
      console.error("언어 변경 실패:", error);
      setIsChanging(false);
    }
  };

  return (
    <LanguageSettingsContainer>
      <Main>
        <LanguageGrid>
          {languages.map((lang) => (
            <LanguageCard
              key={lang.code}
              className={language === lang.code ? "selected" : ""}
              onClick={() => handleLanguageChange(lang.code)}
              disabled={isChanging}
            >
              <LanguageName>{lang.name}</LanguageName>
              {language === lang.code && (
                <SelectedIndicator>✓</SelectedIndicator>
              )}
            </LanguageCard>
          ))}
        </LanguageGrid>
      </Main>
      <Sidebar />
    </LanguageSettingsContainer>
  );
};

export default LanguageSettings;
