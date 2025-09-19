import React, { useState } from "react";
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

const UniversitySettingsContainer = styled.div`
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

const UniversityGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 1rem;
  margin-top: 1rem;

  @media (max-width: 768px) {
    grid-template-columns: 1fr;
  }
`;

const UniversityCard = styled.button`
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
  min-height: 80px;

  &:hover {
    border-color: #3498db;
    background: rgba(52, 152, 219, 0.05);
    transform: translateY(-2px);
    box-shadow: 0 4px 15px rgba(52, 152, 219, 0.2);
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

    &:hover {
      border-color: #5dade2;
      background: rgba(93, 173, 226, 0.1);
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

const UniversityName = styled.h3`
  font-size: 1.1rem;
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

const UniversitySettings = () => {
  const navigate = useNavigate();
  const { t } = useLanguage();
  const [selectedUniversity, setSelectedUniversity] = useState("");

  const universities = [
    { code: "seoul_area", name: t("universitySettings.seoulArea") },
    { code: "gyeonggi_area", name: t("universitySettings.gyeonggiArea") },
    { code: "incheon_area", name: t("universitySettings.incheonArea") },
    { code: "busan_area", name: t("universitySettings.busanArea") },
    { code: "daegu_area", name: t("universitySettings.daeguArea") },
    { code: "gwangju_area", name: t("universitySettings.gwangjuArea") },
    { code: "daejeon_area", name: t("universitySettings.daejeonArea") },
    { code: "ulsan_area", name: t("universitySettings.ulsanArea") },
    { code: "gangwon_area", name: t("universitySettings.gangwonArea") },
    { code: "chungcheong_area", name: t("universitySettings.chungcheongArea") },
    { code: "jeolla_area", name: t("universitySettings.jeollaArea") },
    { code: "gyeongsang_area", name: t("universitySettings.gyeongsangArea") },
    { code: "jeju_area", name: t("universitySettings.jejuArea") },
  ];

  const handleUniversitySelect = (university) => {
    console.log("대학교 선택됨:", university);
    setSelectedUniversity(university);

    // 선택된 대학교를 localStorage에 저장
    localStorage.setItem("selectedUniversity", university);

    // 부모 컴포넌트에 선택된 값을 전달하기 위해 state 업데이트 이벤트 발생
    const event = new CustomEvent("universitySelected", {
      detail: university,
      bubbles: true,
      cancelable: true,
    });
    console.log("이벤트 발생:", event);
    window.dispatchEvent(event);

    // 이전 페이지로 돌아가기
    setTimeout(() => {
      navigate(-1);
    }, 300);
  };

  return (
    <UniversitySettingsContainer>
      <Main>
        <UniversityGrid>
          {universities.map((university) => (
            <UniversityCard
              key={university.code}
              className={
                selectedUniversity === university.code ? "selected" : ""
              }
              onClick={() => handleUniversitySelect(university.code)}
            >
              <UniversityName>{university.name}</UniversityName>
              {selectedUniversity === university.code && (
                <SelectedIndicator>✓</SelectedIndicator>
              )}
            </UniversityCard>
          ))}
        </UniversityGrid>
      </Main>
      <Sidebar />
    </UniversitySettingsContainer>
  );
};

export default UniversitySettings;
