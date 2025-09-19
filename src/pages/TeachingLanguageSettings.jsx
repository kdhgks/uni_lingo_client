import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import styled, { keyframes } from "styled-components";
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

const TeachingLanguageSettingsContainer = styled.div`
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
  padding: 2rem;

  @media (max-width: 768px) {
    padding: 1rem;
  }
`;

const Header = styled.header`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 1rem;
  margin-bottom: 2rem;
  padding-bottom: 1rem;
  border-bottom: 2px solid #e1e8ed;
  transition: border-color 0.3s ease;
  position: relative;

  .dark-mode & {
    border-color: #555;
  }
`;

const BackButton = styled.button`
  position: absolute;
  left: 0;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  background: none;
  border: none;
  color: #3498db;
  font-size: 1rem;
  cursor: pointer;
  padding: 0.5rem;
  border-radius: 8px;
  transition: all 0.3s ease;

  @media (min-width: 769px) {
    &:hover {
      background: rgba(52, 152, 219, 0.1);
    }
  }

  .dark-mode & {
    color: #5dade2;
  }
`;

const Title = styled.h1`
  font-size: 1.5rem;
  font-weight: 600;
  color: #2c3e50;
  margin: 0;
  text-align: center;
  transition: color 0.3s ease;

  .dark-mode & {
    color: #ffffff;
  }
`;

const LanguageGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 1rem;
  margin-top: 2rem;

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

const SelectedIndicator = styled.span`
  font-size: 1.5rem;
  color: #3498db;
  font-weight: bold;

  .dark-mode & {
    color: #5dade2;
  }
`;

const languages = [
  { code: "korean", name: "한국어" },
  { code: "english", name: "English" },
  { code: "japanese", name: "日本語" },
  { code: "chinese", name: "中文" },
  { code: "spanish", name: "Español" },
  { code: "french", name: "Français" },
  { code: "german", name: "Deutsch" },
  { code: "vietnamese", name: "Tiếng Việt" },
  { code: "mongolian", name: "Монгол" },
  { code: "uzbek", name: "O'zbek" },
  { code: "nepali", name: "नेपाली" },
  { code: "burmese", name: "မြန်မာ" },
  { code: "thai", name: "ไทย" },
  { code: "italian", name: "Italiano" },
  { code: "russian", name: "Русский" },
  { code: "arabic", name: "العربية" },
  { code: "portuguese", name: "Português" },
  { code: "dutch", name: "Nederlands" },
];

const TeachingLanguageSettings = () => {
  const navigate = useNavigate();
  const { t } = useLanguage();
  const [selectedLanguage, setSelectedLanguage] = useState("");

  useEffect(() => {
    // 로컬 스토리지에서 현재 선택된 언어 가져오기
    const savedLanguage = localStorage.getItem("selectedTeachingLanguage");
    if (savedLanguage) {
      setSelectedLanguage(savedLanguage);
    } else {
      // 프로필에서 현재 선택된 언어 가져오기 (임시)
      const currentTeachingLanguage = localStorage.getItem(
        "currentTeachingLanguage"
      );
      if (currentTeachingLanguage) {
        const languageObj = languages.find(
          (lang) => lang.name === currentTeachingLanguage
        );
        if (languageObj) {
          setSelectedLanguage(languageObj.code);
        }
      }
    }
  }, []);

  const handleLanguageSelect = (languageCode) => {
    const languageName =
      languages.find((lang) => lang.code === languageCode)?.name ||
      languageCode;

    setSelectedLanguage(languageCode);

    // 로컬 스토리지에 저장
    localStorage.setItem("selectedTeachingLanguage", languageCode);
    localStorage.setItem("currentTeachingLanguage", languageName);

    // 커스텀 이벤트 발생
    const event = new CustomEvent("teachingLanguageSelected", {
      detail: languageCode,
    });
    window.dispatchEvent(event);

    // 프로필 페이지로 돌아가기
    navigate(-1);
  };

  return (
    <TeachingLanguageSettingsContainer>
      <Main>
        <Header>
          <BackButton onClick={() => navigate(-1)}>
            ← {t("common.back")}
          </BackButton>
          <Title>{t("profile.teachingLanguage")}</Title>
        </Header>

        <LanguageGrid>
          {languages.map((lang) => (
            <LanguageCard
              key={lang.code}
              className={selectedLanguage === lang.code ? "selected" : ""}
              onClick={() => handleLanguageSelect(lang.code)}
            >
              <LanguageName>{lang.name}</LanguageName>
              {selectedLanguage === lang.code && (
                <SelectedIndicator>✓</SelectedIndicator>
              )}
            </LanguageCard>
          ))}
        </LanguageGrid>
      </Main>
      <Sidebar />
    </TeachingLanguageSettingsContainer>
  );
};

export default TeachingLanguageSettings;
