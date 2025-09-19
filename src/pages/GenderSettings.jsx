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

const GenderSettingsContainer = styled.div`
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

const GenderGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 1rem;
  margin-top: 1rem;

  @media (max-width: 768px) {
    grid-template-columns: 1fr;
  }
`;

const GenderCard = styled.button`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 1rem;
  padding: 2rem;
  border: 2px solid #e1e8ed;
  border-radius: 12px;
  background: #ffffff;
  cursor: pointer;
  transition: all 0.3s ease;
  text-align: center;
  animation: ${slideInUp} 0.3s ease-out;
  min-height: 120px;

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

const GenderIcon = styled.div`
  font-size: 3rem;
  margin-bottom: 0.5rem;
`;

const GenderName = styled.h3`
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

const GenderSettings = () => {
  const navigate = useNavigate();
  const { t } = useLanguage();
  const [selectedGender, setSelectedGender] = useState("");

  const genders = [
    { code: "male", name: t("genderSettings.male"), icon: "👨" },
    { code: "female", name: t("genderSettings.female"), icon: "👩" },
  ];

  const handleGenderSelect = (gender) => {
    setSelectedGender(gender);
    // 선택된 성별을 localStorage에 저장하고 이전 페이지로 돌아가기
    localStorage.setItem("selectedGender", gender);
    // 부모 컴포넌트에 선택된 값을 전달하기 위해 state 업데이트 이벤트 발생
    window.dispatchEvent(new CustomEvent("genderSelected", { detail: gender }));
    setTimeout(() => {
      navigate(-1);
    }, 300);
  };

  return (
    <GenderSettingsContainer>
      <Main>
        <GenderGrid>
          {genders.map((gender) => (
            <GenderCard
              key={gender.code}
              className={selectedGender === gender.code ? "selected" : ""}
              onClick={() => handleGenderSelect(gender.code)}
            >
              <div>
                <GenderIcon>{gender.icon}</GenderIcon>
                <GenderName>{gender.name}</GenderName>
              </div>
              {selectedGender === gender.code && (
                <SelectedIndicator>✓</SelectedIndicator>
              )}
            </GenderCard>
          ))}
        </GenderGrid>
      </Main>
      <Sidebar />
      <UnderBar />
    </GenderSettingsContainer>
  );
};

export default GenderSettings;
