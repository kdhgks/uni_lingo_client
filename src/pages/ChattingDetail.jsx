import React, { useState, useEffect, useRef } from "react";
import { useNavigate, useParams } from "react-router-dom";
import styled, { keyframes } from "styled-components";
import { useLanguage } from "../contexts/LanguageContext";
import {
  extractLanguageData,
  normalizeInterests,
} from "../utils/languageUtils";
import { API_ENDPOINTS } from "../config/api";

// Keyframes
const slideIn = keyframes`
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
`;

const slideInLeft = keyframes`
  from {
    opacity: 0;
    transform: translateX(-30px);
  }
  to {
    opacity: 1;
    transform: translateX(0);
  }
`;

const slideInRight = keyframes`
  from {
    opacity: 0;
    transform: translateX(30px);
  }
  to {
    opacity: 1;
    transform: translateX(0);
  }
`;

const float = keyframes`
  0%, 100% {
    transform: translateY(0px);
  }
  50% {
    transform: translateY(-10px);
  }
`;

const neonGlow = keyframes`
  0%, 100% {
    text-shadow: 
      0 0 5px rgba(0, 255, 255, 0.5),
      0 0 10px rgba(0, 255, 255, 0.3),
      0 0 15px rgba(0, 255, 255, 0.1);
  }
  50% {
    text-shadow: 
      0 0 10px rgba(0, 255, 255, 0.8),
      0 0 20px rgba(0, 255, 255, 0.5),
      0 0 30px rgba(0, 255, 255, 0.2);
  }
`;

const gradientShift = keyframes`
  0% {
    background-position: 0% 50%;
  }
  50% {
    background-position: 100% 50%;
  }
  100% {
    background-position: 0% 50%;
  }
`;

const pulse = keyframes`
  0%, 100% {
    transform: scale(1);
    opacity: 1;
  }
  50% {
    transform: scale(1.05);
    opacity: 0.8;
  }
`;

// Styled Components
const ChattingDetailContainer = styled.div`
  min-height: 100vh;
  background: #ffffff;
  color: #2c3e50;
  font-family: "Inter", "Segoe UI", -apple-system, BlinkMacSystemFont,
    sans-serif;
  display: flex;
  flex-direction: column;
  position: relative;
  overflow: hidden;
  padding-left: 0;
  transition: background-color 0.3s ease, color 0.3s ease;

  .dark-mode & {
    background: #1a1a1a;
    color: #ffffff;
  }

  &::before {
    content: "";
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: radial-gradient(
        circle at 20% 80%,
        rgba(52, 152, 219, 0.05) 0%,
        transparent 50%
      ),
      radial-gradient(
        circle at 80% 20%,
        rgba(46, 204, 113, 0.05) 0%,
        transparent 50%
      ),
      radial-gradient(
        circle at 40% 40%,
        rgba(41, 128, 185, 0.03) 0%,
        transparent 50%
      );
    pointer-events: none;
  }

  &::after {
    content: "";
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: linear-gradient(
      90deg,
      transparent 0%,
      rgba(52, 152, 219, 0.02) 25%,
      transparent 50%,
      rgba(46, 204, 113, 0.02) 75%,
      transparent 100%
    );
    animation: ${gradientShift} 8s ease-in-out infinite;
    pointer-events: none;
  }
`;

const ChattingMain = styled.main`
  flex: 1;
  display: flex;
  flex-direction: column;
  max-width: 1200px;
  margin: 0 auto;
  width: 100%;
  padding: 0 1rem;
  position: relative;
  z-index: 1;
  padding-top: 80px;
`;

const MessagesContainer = styled.div`
  flex: 1;
  padding: 1rem 0 100px 0;
  overflow-y: auto;
  display: flex;
  flex-direction: column;
  gap: 1rem;
  min-height: 0;
`;

const Message = styled.div`
  display: flex;
  align-items: flex-end;
  gap: 0.5rem;
  animation: ${slideIn} 0.3s ease-out;

  &.me {
    flex-direction: row-reverse;
    justify-content: flex-start;
  }

  &.partner {
    flex-direction: row;
    justify-content: flex-start;
  }
`;

const MessageBubble = styled.div`
  max-width: 70%;
  padding: 0.75rem 1rem;
  border-radius: 20px;
  position: relative;
  word-wrap: break-word;

  &.me {
    background: linear-gradient(135deg, #3498db 0%, #2ecc71 100%);
    color: white;
    border-bottom-right-radius: 5px;
    margin-left: auto;
    box-shadow: 0 4px 15px rgba(52, 152, 219, 0.3);
  }

  &.partner {
    background: rgba(52, 152, 219, 0.1);
    color: #2c3e50;
    border: 1px solid rgba(52, 152, 219, 0.3);
    border-bottom-left-radius: 5px;
    margin-right: auto;
  }

  .dark-mode &.partner {
    background: rgba(93, 173, 226, 0.15);
    color: #ffffff;
    border-color: rgba(93, 173, 226, 0.4);
  }
`;

const MessageText = styled.p`
  margin: 0;
  line-height: 1.4;
`;

const MessageTime = styled.span`
  font-size: 0.7rem;
  opacity: 0.7;
  margin-top: 0.25rem;
  display: block;

  .dark-mode & {
    opacity: 0.8;
  }
`;

const LoadingContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 60vh;
  gap: 1rem;
`;

const LoadingText = styled.p`
  color: #666;
  font-size: 1rem;
  margin: 0;
`;

const TypingIndicator = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.75rem 1rem;
  background: rgba(255, 255, 255, 0.1);
  border-radius: 20px;
  border-bottom-left-radius: 5px;
  max-width: 70px;

  .dots {
    display: flex;
    gap: 0.25rem;

    span {
      width: 6px;
      height: 6px;
      background: rgba(255, 255, 255, 0.7);
      border-radius: 50%;
      animation: ${pulse} 1.4s ease-in-out infinite both;

      &:nth-child(1) {
        animation-delay: -0.32s;
      }

      &:nth-child(2) {
        animation-delay: -0.16s;
      }
    }
  }
`;

// Mobile Menu Components 제거됨 - PC에서만 사이드바 사용

// Header Components
const ChattingHeader = styled.header`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  z-index: 100;
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1rem 2rem;
  background: rgba(255, 255, 255, 0.95);
  backdrop-filter: blur(20px);
  border-bottom: 1px solid rgba(52, 152, 219, 0.2);
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
  transition: all 0.3s ease;

  @media (max-width: 1024px) {
    padding: 1rem 1.5rem;
  }

  @media (max-width: 768px) {
    padding: 1rem;
    gap: 0.5rem;
  }

  .dark-mode & {
    background: rgba(45, 45, 45, 0.95);
    border-bottom: 1px solid rgba(52, 152, 219, 0.4);
    box-shadow: 0 2px 10px rgba(0, 0, 0, 0.3);
  }
`;

const BackButton = styled.button`
  background: none;
  border: none;
  color: #6c757d;
  padding: 0.75rem 1.5rem;
  cursor: pointer;
  font-weight: 500;
  font-size: 1.5rem;

  @media (max-width: 768px) {
    padding: 0.6rem 1.2rem;
    font-size: 1.3rem;
  }

  @media (max-width: 480px) {
    padding: 0.5rem 1rem;
    font-size: 1.2rem;
  }

  @media (min-width: 769px) {
    &:hover {
      background: rgba(52, 152, 219, 0.1);
      transform: translateX(-2px);
    }
  }

  .dark-mode & {
    color: #5dade2;
  }
`;

const PartnerName = styled.h1`
  font-size: 1.2rem;
  font-weight: 600;
  color: #2c3e50;
  margin: 0;
  text-align: center;
  flex: 1;
  background: linear-gradient(135deg, #3498db 0%, #2ecc71 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  cursor: pointer;
  transition: all 0.3s ease;
  padding: 0.5rem;
  border-radius: 8px;

  @media (min-width: 769px) {
    &:hover {
      background: rgba(52, 152, 219, 0.1);
      transform: scale(1.05);
    }
  }

  .dark-mode & {
    color: #ffffff;
    background: linear-gradient(135deg, #5dade2 0%, #2ecc71 100%);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    background-clip: text;

    &:hover {
      background: rgba(93, 173, 226, 0.1);
    }
  }

  @media (max-width: 768px) {
    font-size: 1.1rem;
  }
`;

const ReportButton = styled.button`
  background: none;
  border: none;
  color: #e74c3c;
  font-size: 1.8rem;
  cursor: pointer;
  padding: 0.75rem 1.5rem;
  font-weight: 500;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  justify-content: center;

  @media (max-width: 768px) {
    padding: 0.6rem 1.2rem;
    font-size: 1.6rem;
  }

  @media (max-width: 480px) {
    padding: 0.5rem 1rem;
    font-size: 1.4rem;
  }

  @media (min-width: 769px) {
    &:hover {
      background: rgba(231, 76, 60, 0.1);
      transform: scale(1.1);
    }
  }

  .dark-mode & {
    color: #ff6b6b;
  }
`;

const MessageInputContainer = styled.div`
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  z-index: 100;
  padding: 0.75rem 0.5rem;
  background: rgba(255, 255, 255, 0.95);
  backdrop-filter: blur(20px);
  border-top: 1px solid rgba(52, 152, 219, 0.2);
  box-shadow: 0 -2px 10px rgba(0, 0, 0, 0.1);

  .dark-mode & {
    background: rgba(25, 25, 25, 0.95);
    border-top-color: rgba(93, 173, 226, 0.3);
    box-shadow: 0 -2px 10px rgba(0, 0, 0, 0.3);
  }
`;

const MessageInputForm = styled.form`
  display: flex;
  align-items: center;
  background: rgba(255, 255, 255, 0.9);
  border: 1px solid rgba(52, 152, 219, 0.3);
  border-radius: 25px;
  padding: 0.75rem;
  gap: 0.5rem;
  backdrop-filter: blur(20px);
  transition: all 0.3s ease;
  max-width: 1200px;
  margin: 0 auto;

  &:focus-within {
    border-color: #3498db;
    box-shadow: 0 0 0 3px rgba(52, 152, 219, 0.1);
  }

  .dark-mode & {
    background: rgba(35, 35, 35, 0.95);
    border-color: #666;

    &:focus-within {
      border-color: #5dade2;
      box-shadow: 0 0 0 3px rgba(93, 173, 226, 0.3);
    }
  }
`;

const MessageInput = styled.textarea`
  flex: 1;
  padding: 0.5rem 0.75rem;
  border: none;
  background: transparent;
  color: #2c3e50;
  font-size: 1.1rem;
  font-family: inherit;
  resize: none;
  outline: none;
  min-height: 20px;
  max-height: 100px;
  transition: all 0.3s ease;

  .dark-mode & {
    color: #ffffff;
  }

  &::placeholder {
    color: rgba(44, 62, 80, 0.7);
    font-size: 1.1rem;

    .dark-mode & {
      color: rgba(255, 255, 255, 0.8);
    }
  }
`;

const AttachButton = styled.button`
  background: rgba(52, 152, 219, 0.1);
  border: 1px solid rgba(52, 152, 219, 0.3);
  color: #3498db;
  padding: 0.5rem;
  border-radius: 50%;
  cursor: pointer;
  transition: all 0.3s ease;
  font-weight: 600;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 40px;
  height: 40px;
  min-width: 40px;
  font-size: 1.2rem;

  @media (min-width: 769px) {
    &:hover {
      background: rgba(52, 152, 219, 0.2);
      border-color: #3498db;
      transform: scale(1.05);
    }
  }

  .dark-mode & {
    background: rgba(93, 173, 226, 0.15);
    border-color: rgba(93, 173, 226, 0.4);
    color: #5dade2;

    &:hover {
      background: rgba(93, 173, 226, 0.25);
      border-color: #5dade2;
    }
  }
`;

const SendButton = styled.button`
  background: linear-gradient(135deg, #3498db 0%, #2ecc71 100%);
  border: none;
  color: white;
  padding: 0.75rem;
  border-radius: 50%;
  cursor: pointer;
  transition: all 0.3s ease;
  font-weight: 600;
  box-shadow: 0 4px 15px rgba(52, 152, 219, 0.4);
  display: flex;
  align-items: center;
  justify-content: center;
  width: 48px;
  height: 48px;
  min-width: 48px;

  @media (min-width: 769px) {
    &:hover:not(:disabled) {
      transform: translateY(-2px);
      box-shadow: 0 8px 30px rgba(52, 152, 219, 0.6);
      animation: ${pulse} 0.6s ease-in-out;
    }
  }

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
    transform: none;
  }
`;

const FilePreview = styled.div`
  position: absolute;
  bottom: 100%;
  left: 0;
  right: 0;
  background: rgba(255, 255, 255, 0.95);
  backdrop-filter: blur(20px);
  border: 1px solid rgba(52, 152, 219, 0.3);
  border-radius: 12px;
  padding: 1rem;
  margin-bottom: 0.5rem;
  max-height: 200px;
  overflow-y: auto;

  .dark-mode & {
    background: rgba(35, 35, 35, 0.95);
    border-color: #666;
  }
`;

const FileItem = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.5rem;
  background: rgba(52, 152, 219, 0.1);
  border-radius: 8px;
  margin-bottom: 0.5rem;

  .dark-mode & {
    background: rgba(93, 173, 226, 0.15);
  }
`;

const FileIcon = styled.div`
  width: 32px;
  height: 32px;
  border-radius: 6px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.2rem;
  background: rgba(52, 152, 219, 0.2);
  color: #3498db;

  .dark-mode & {
    background: rgba(93, 173, 226, 0.2);
    color: #5dade2;
  }
`;

const FileInfo = styled.div`
  flex: 1;
  min-width: 0;
`;

const FileName = styled.div`
  font-size: 0.9rem;
  font-weight: 500;
  color: #2c3e50;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;

  .dark-mode & {
    color: #ffffff;
  }
`;

const FileSize = styled.div`
  font-size: 0.8rem;
  color: #7f8c8d;
  margin-top: 0.25rem;

  .dark-mode & {
    color: #bdc3c7;
  }
`;

const RemoveFileButton = styled.button`
  background: none;
  border: none;
  color: #e74c3c;
  cursor: pointer;
  padding: 0.25rem;
  border-radius: 4px;
  font-size: 1.2rem;
  transition: all 0.3s ease;

  @media (min-width: 769px) {
    &:hover {
      background: rgba(231, 76, 60, 0.1);
    }
  }

  .dark-mode & {
    color: #ff6b6b;
  }
`;

const FileImage = styled.img`
  width: 32px;
  height: 32px;
  object-fit: cover;
  border-radius: 6px;
`;

const MessageFile = styled.div`
  margin-top: 0.5rem;
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
`;

const MessageFileItem = styled.div`
  position: relative;
  max-width: 200px;
`;

const MessageFileImage = styled.img`
  width: 100%;
  max-height: 200px;
  object-fit: cover;
  border-radius: 8px;
  cursor: pointer;
  transition: transform 0.3s ease;

  @media (min-width: 769px) {
    &:hover {
      transform: scale(1.02);
    }
  }
`;

const MessageFileVideo = styled.video`
  width: 100%;
  max-height: 200px;
  object-fit: cover;
  border-radius: 8px;
  cursor: pointer;
`;

const FileNameText = styled.div`
  font-size: 0.8rem;
  color: rgba(255, 255, 255, 0.8);
  margin-top: 0.25rem;
  word-break: break-all;
`;

// 파트너 프로필 모달 컴포넌트들
const PartnerModalOverlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.6);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 2000;
  backdrop-filter: blur(5px);
`;

const PartnerModalContent = styled.div`
  background: white;
  border-radius: 16px;
  padding: 2rem;
  max-width: 500px;
  width: 90%;
  max-height: 80vh;
  overflow-y: auto;
  box-shadow: 0 20px 40px rgba(0, 0, 0, 0.3);
  animation: modalSlideIn 0.3s ease-out;
  position: relative;

  @keyframes modalSlideIn {
    from {
      opacity: 0;
      transform: translateY(-30px) scale(0.9);
    }
    to {
      opacity: 1;
      transform: translateY(0) scale(1);
    }
  }

  .dark-mode & {
    background: #2c2c2c;
    color: white;
  }
`;

const PartnerModalHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 1.5rem;
  padding-bottom: 1rem;
  border-bottom: 2px solid #f0f0f0;

  .dark-mode & {
    border-bottom-color: #555;
  }
`;

const PartnerModalTitle = styled.h2`
  margin: 0;
  font-size: 1.5rem;
  font-weight: 700;
  background: linear-gradient(135deg, #3498db 0%, #2ecc71 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
`;

const CloseButton = styled.button`
  background: none;
  border: none;
  font-size: 1.5rem;
  cursor: pointer;
  color: #666;
  padding: 0.5rem;
  border-radius: 50%;
  transition: all 0.3s ease;

  &:hover {
    background: rgba(0, 0, 0, 0.1);
    transform: scale(1.1);
  }

  .dark-mode & {
    color: #ccc;

    &:hover {
      background: rgba(255, 255, 255, 0.1);
    }
  }
`;

const PartnerProfileCard = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
`;

const PartnerHeader = styled.div`
  display: flex;
  align-items: center;
  gap: 1rem;
  padding: 1rem;
  background: linear-gradient(
    135deg,
    rgba(52, 152, 219, 0.1) 0%,
    rgba(46, 204, 113, 0.1) 100%
  );
  border-radius: 12px;
  border: 2px solid rgba(52, 152, 219, 0.2);

  .dark-mode & {
    background: linear-gradient(
      135deg,
      rgba(52, 152, 219, 0.2) 0%,
      rgba(46, 204, 113, 0.2) 100%
    );
    border-color: rgba(52, 152, 219, 0.4);
  }
`;

const PartnerImage = styled.div`
  width: 80px;
  height: 80px;
  border-radius: 50%;
  border: 3px solid #3498db;
  display: flex;
  align-items: center;
  justify-content: center;
  overflow: hidden;
  background: #f8f9fa;

  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }

  .placeholder {
    font-size: 2rem;
    color: #6c757d;
  }

  .dark-mode & {
    background: #444;
    border-color: #5dade2;

    .placeholder {
      color: #ccc;
    }
  }
`;

const PartnerInfo = styled.div`
  flex: 1;
`;

const ModalPartnerName = styled.h3`
  margin: 0 0 0.5rem 0;
  font-size: 1.5rem;
  color: #2c3e50;

  .dark-mode & {
    color: white;
  }
`;

const PartnerDetails = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
`;

const PartnerDetailItem = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-size: 0.9rem;
  color: #6c757d;

  .dark-mode & {
    color: #ccc;
  }
`;

const PartnerInterests = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
`;

const PartnerInterestTag = styled.span`
  padding: 0.5rem 1rem;
  background: linear-gradient(135deg, #3498db 0%, #2ecc71 100%);
  color: white;
  border-radius: 20px;
  font-size: 0.9rem;
  font-weight: 500;
`;

const PartnerModalActions = styled.div`
  display: flex;
  gap: 1rem;
  margin-top: 1.5rem;
`;

const ActionButton = styled.button`
  flex: 1;
  padding: 0.75rem 1.5rem;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  font-size: 1rem;
  font-weight: 600;
  transition: all 0.3s ease;

  &.primary {
    background: linear-gradient(135deg, #3498db 0%, #2ecc71 100%);
    color: white;
  }

  &.secondary {
    background: #f8f9fa;
    color: #6c757d;
    border: 2px solid #e9ecef;
  }

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 5px 15px rgba(0, 0, 0, 0.2);
  }

  .dark-mode & {
    &.secondary {
      background: #444;
      color: #ccc;
      border-color: #666;
    }
  }
`;

const ChattingDetail = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const { t, translations, language } = useLanguage();

  // 임시로 직접 번역 함수 생성
  const getTranslation = (key) => {
    const keys = key.split(".");
    let value = translations;
    for (const k of keys) {
      if (value && typeof value === "object" && k in value) {
        value = value[k];
      } else {
        return key; // 키를 찾을 수 없으면 키를 그대로 반환
      }
    }
    return typeof value === "string" ? value : key;
  };

  // 디버깅을 위한 로그
  console.log("ChattingDetail - Current language:", language);
  console.log(
    "ChattingDetail - Translations loaded:",
    Object.keys(translations).length > 0
  );
  console.log(
    "ChattingDetail - Profile keys:",
    translations.profile ? Object.keys(translations.profile) : "No profile key"
  );
  console.log(
    "ChattingDetail - PartnerModal keys:",
    translations.profile?.partnerModal
      ? Object.keys(translations.profile.partnerModal)
      : "No partnerModal key"
  );

  // t 함수 테스트
  console.log(
    "t('profile.partnerModal.title'):",
    t("profile.partnerModal.title")
  );
  console.log(
    "t('profile.partnerModal.gender'):",
    t("profile.partnerModal.gender")
  );
  console.log(
    "t('profile.partnerModal.male'):",
    t("profile.partnerModal.male")
  );

  // 직접 번역 접근 테스트
  console.log(
    "Direct access - profile.partnerModal.title:",
    translations.profile?.partnerModal?.title
  );
  console.log(
    "Direct access - profile.partnerModal.gender:",
    translations.profile?.partnerModal?.gender
  );
  console.log(
    "Direct access - profile.partnerModal.male:",
    translations.profile?.partnerModal?.male
  );
  const messagesEndRef = useRef(null);
  const fileInputRef = useRef(null);
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState([]);
  const [isTyping, setIsTyping] = useState(false);
  const [partner, setPartner] = useState(null);
  const [isLoadingMessages, setIsLoadingMessages] = useState(false);
  const [hasNewNotification, setHasNewNotification] = useState(
    window.globalHasNewNotification || false
  );
  const [selectedFiles, setSelectedFiles] = useState([]);
  const [showFilePreview, setShowFilePreview] = useState(false);
  const [showPartnerModal, setShowPartnerModal] = useState(false);

  // 파트너 정보 및 메시지 로드
  useEffect(() => {
    const loadChatData = async () => {
      setIsLoadingMessages(true);
      try {
        const userData = localStorage.getItem("user");
        const currentUser =
          userData && userData !== "undefined" && userData !== "null"
            ? JSON.parse(userData)
            : {};

        // 백엔드에서 채팅 데이터 불러오기
        const [partnerResponse, messagesResponse] = await Promise.all([
          fetch(API_ENDPOINTS.CHAT_ROOM_PARTNER(id), {
            method: "GET",
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
              "Content-Type": "application/json",
            },
          }),
          fetch(API_ENDPOINTS.CHAT_ROOM_MESSAGES(id), {
            method: "GET",
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
              "Content-Type": "application/json",
            },
          }),
        ]);

        if (partnerResponse.ok && messagesResponse.ok) {
          const partnerData = await partnerResponse.json();
          const messagesData = await messagesResponse.json();

          console.log("📱 파트너 데이터:", partnerData);
          console.log(
            "📱 파트너 언어 정보:",
            partnerData.partner?.teaching_languages,
            partnerData.partner?.learning_languages
          );
          console.log(
            "📱 가르치는 언어 타입:",
            typeof partnerData.partner?.teaching_languages
          );
          console.log(
            "📱 가르치는 언어 값:",
            partnerData.partner?.teaching_languages
          );
          console.log("📱 메시지 데이터:", messagesData);

          if (partnerData.success && partnerData.partner) {
            setPartner(partnerData.partner);
          } else {
            console.error(
              "파트너 데이터 형식이 올바르지 않습니다:",
              partnerData
            );
            setPartner(null);
          }

          if (messagesData.success && messagesData.messages) {
            // 백엔드 데이터를 프론트엔드 형식으로 변환
            const transformedMessages = messagesData.messages.map((msg) => ({
              id: msg.id,
              text: msg.content,
              sender: msg.is_from_me ? "me" : "partner",
              timestamp: msg.timestamp,
              files: msg.files || null,
            }));
            setMessages(transformedMessages);
          } else {
            console.error(
              "메시지 데이터 형식이 올바르지 않습니다:",
              messagesData
            );
            setMessages([]);
          }

          // 메시지를 읽음 처리
          try {
            await fetch(API_ENDPOINTS.CHAT_ROOM_MESSAGES_READ(id), {
              method: "POST",
              headers: {
                Authorization: `Bearer ${localStorage.getItem("token")}`,
                "Content-Type": "application/json",
              },
            });
          } catch (error) {
            console.error("메시지 읽음 처리 중 오류:", error);
          }
        } else {
          console.error("채팅 데이터를 불러오는데 실패했습니다.");
          setPartner(null);
          setMessages([]);
        }
      } catch (error) {
        console.error("채팅 데이터 로딩 중 오류가 발생했습니다:", error);
        setPartner(null);
        setMessages([]);
      } finally {
        setIsLoadingMessages(false);
      }
    };

    loadChatData();
  }, [id]);

  // 파일 선택 처리
  const handleFileSelect = (e) => {
    const files = Array.from(e.target.files);
    const validFiles = files.filter((file) => {
      const maxSize = 10 * 1024 * 1024; // 10MB
      const validTypes = [
        "image/jpeg",
        "image/png",
        "image/gif",
        "video/mp4",
        "video/avi",
        "video/mov",
      ];
      return file.size <= maxSize && validTypes.includes(file.type);
    });

    if (validFiles.length !== files.length) {
      alert(
        "일부 파일이 지원되지 않거나 크기가 너무 큽니다. (최대 10MB, 이미지/동영상만 지원)"
      );
    }

    if (validFiles.length > 0) {
      setSelectedFiles((prev) => [...prev, ...validFiles]);
      setShowFilePreview(true);
    }
  };

  // 파일 제거
  const handleRemoveFile = (index) => {
    setSelectedFiles((prev) => prev.filter((_, i) => i !== index));
    if (selectedFiles.length === 1) {
      setShowFilePreview(false);
    }
  };

  // 메시지 전송
  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!message.trim() && selectedFiles.length === 0) return;

    const newMessage = {
      id: `msg_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      text: message,
      sender: "me",
      timestamp: new Date(),
      files:
        selectedFiles.length > 0
          ? selectedFiles.map((file) => ({
              name: file.name,
              type: file.type,
              size: file.size,
              url: URL.createObjectURL(file),
            }))
          : null,
    };

    // 로컬 상태에 즉시 추가 (낙관적 업데이트)
    setMessages((prev) => [...prev, newMessage]);
    setMessage("");
    setSelectedFiles([]);
    setShowFilePreview(false);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }

    try {
      const userData = localStorage.getItem("user");
      const currentUser =
        userData && userData !== "undefined" && userData !== "null"
          ? JSON.parse(userData)
          : {};

      if (currentUser.nickname === "sarah_k") {
        // Sarah Kim 더미 계정인 경우 로컬 시뮬레이션
        setIsTyping(true);
        setTimeout(() => {
          const responses = [
            "That's interesting! Tell me more about it.",
            "정말 흥미롭네요! 더 자세히 말씀해주세요.",
            "I see! In Korean, we would say...",
            "아! 한국어로는 이렇게 말해요...",
            "Great! I learned something new today.",
            "좋아요! 오늘 새로운 것을 배웠네요.",
          ];

          const randomResponse =
            responses[Math.floor(Math.random() * responses.length)];
          const responseLanguage =
            randomResponse.includes("한국어") ||
            randomResponse.includes("정말") ||
            randomResponse.includes("좋아요")
              ? "korean"
              : "english";

          const responseMessage = {
            id: `msg_${Date.now() + 1}_${Math.random()
              .toString(36)
              .substr(2, 9)}`,
            text: randomResponse,
            sender: "partner",
            timestamp: new Date(),
            language: responseLanguage,
          };

          setMessages((prev) => [...prev, responseMessage]);
          setIsTyping(false);

          // 새로운 메시지 알림 추가

          if (window.addMessageNotification) {
            window.addMessageNotification(
              randomResponse,
              partner?.name || partner?.nickname
            );
          }
        }, 2000);
      } else {
        // 새로운 유저의 경우 백엔드 API로 메시지 전송
        const response = await fetch(
          API_ENDPOINTS.CHAT_ROOM_MESSAGES_SEND(id),
          {
            method: "POST",
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              content: message,
            }),
          }
        );

        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.message || "메시지 전송에 실패했습니다.");
        }

        const sentMessage = await response.json();
        if (sentMessage.success && sentMessage.message) {
          // 백엔드 응답을 프론트엔드 형식으로 변환
          const transformedMessage = {
            id: sentMessage.message.id,
            text: sentMessage.message.content,
            sender: "me",
            timestamp: sentMessage.message.timestamp,
            files: null,
          };
          // 기존 낙관적 업데이트를 실제 서버 응답으로 교체
          setMessages((prev) => {
            const withoutLast = prev.slice(0, -1);
            return [...withoutLast, transformedMessage];
          });
        }
      }
    } catch (error) {
      console.error("메시지 전송 중 오류가 발생했습니다:", error);
      // 에러 시 메시지를 다시 제거 (낙관적 업데이트 롤백)
      setMessages((prev) => prev.slice(0, -1));
      alert("메시지 전송에 실패했습니다. 다시 시도해주세요.");
    }
  };

  // 스크롤을 맨 아래로
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isTyping]);

  // 실시간 메시지 수신 (실제 사용자와의 채팅)
  useEffect(() => {
    if (!id || !partner) return;

    const checkNewMessages = async () => {
      try {
        const response = await fetch(API_ENDPOINTS.CHAT_ROOM_MESSAGES(id), {
          method: "GET",
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
            "Content-Type": "application/json",
          },
        });

        if (response.ok) {
          const data = await response.json();
          if (data.success && data.messages) {
            // 백엔드 데이터를 프론트엔드 형식으로 변환
            const transformedMessages = data.messages.map((msg) => ({
              id: msg.id,
              text: msg.content,
              sender: msg.is_from_me ? "me" : "partner",
              timestamp: msg.timestamp,
              files: msg.files || null,
            }));

            const currentMessageIds = messages.map((msg) => msg.id);

            // 새로운 메시지가 있는지 확인
            const actualNewMessages = transformedMessages.filter(
              (newMsg) =>
                !currentMessageIds.includes(newMsg.id) && newMsg.sender !== "me"
            );

            if (actualNewMessages.length > 0) {
              // 새로운 메시지를 상태에 추가
              setMessages((prev) => [...prev, ...actualNewMessages]);

              // 전역 상태에 직접 알림 추가
              actualNewMessages.forEach((newMsg) => {
                if (window.addMessageNotification) {
                  window.addMessageNotification(
                    newMsg.text,
                    partner?.name || partner?.nickname,
                    id
                  );
                }
              });
            }
          }
        }
      } catch (error) {
        console.error("메시지 확인 중 오류:", error);
      }
    };

    // 3초마다 새로운 메시지 확인
    const interval = setInterval(checkNewMessages, 3000);

    return () => clearInterval(interval);
  }, [id, partner, messages]);

  const formatTime = (timestamp) => {
    return timestamp.toLocaleTimeString("ko-KR", {
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const handleNavigation = (path) => {
    navigate(path);
  };

  const handleLogout = () => {
    localStorage.removeItem("isLoggedIn");
    localStorage.removeItem("user");
    localStorage.removeItem("token");
    navigate("/");
  };

  // 파트너 모달 열기/닫기 함수
  const openPartnerModal = () => {
    setShowPartnerModal(true);
  };

  const closePartnerModal = () => {
    setShowPartnerModal(false);
  };

  // 번역이 로드되지 않았을 때 처리
  if (!translations || Object.keys(translations).length === 0) {
    return (
      <ChattingDetailContainer>
        <LoadingContainer>
          <div
            style={{
              fontSize: "3rem",
              animation: "float 2s ease-in-out infinite",
            }}
          >
            🌐
          </div>
          <div>번역을 불러오는 중...</div>
        </LoadingContainer>
      </ChattingDetailContainer>
    );
  }

  // 파트너 정보가 로딩 중이거나 없을 때 처리
  if (isLoadingMessages || !partner) {
    return (
      <ChattingDetailContainer>
        <LoadingContainer>
          <div
            style={{
              fontSize: "3rem",
              animation: "float 2s ease-in-out infinite",
            }}
          >
            💬
          </div>
          <LoadingText>{t("chatting.loadingChat")}</LoadingText>
        </LoadingContainer>
      </ChattingDetailContainer>
    );
  }

  return (
    <ChattingDetailContainer>
      <ChattingHeader>
        <BackButton onClick={() => navigate("/chatting")}>←</BackButton>
        <PartnerName
          onClick={openPartnerModal}
          role="button"
          tabIndex={0}
          onKeyDown={(e) => {
            if (e.key === "Enter" || e.key === " ") {
              e.preventDefault();
              openPartnerModal();
            }
          }}
          aria-label={`${partner?.nickname} ${t(
            "profile.partnerModal.viewProfile"
          )}`}
        >
          {partner?.nickname}
        </PartnerName>
        <ReportButton onClick={() => alert("신고 기능은 준비 중입니다.")}>
          🚨
        </ReportButton>
      </ChattingHeader>

      <ChattingMain>
        <MessagesContainer>
          {messages.map((msg) => (
            <Message key={msg.id} className={msg.sender}>
              <MessageBubble className={msg.sender}>
                <MessageText>{msg.text}</MessageText>
                {msg.files && (
                  <MessageFile>
                    {msg.files.map((file, index) => (
                      <MessageFileItem key={index}>
                        {file.type.startsWith("image/") ? (
                          <MessageFileImage
                            src={file.url}
                            alt={file.name}
                            onClick={() => window.open(file.url, "_blank")}
                          />
                        ) : file.type.startsWith("video/") ? (
                          <MessageFileVideo
                            src={file.url}
                            controls
                            onClick={() => window.open(file.url, "_blank")}
                          />
                        ) : (
                          <div
                            style={{
                              padding: "1rem",
                              background: "rgba(255,255,255,0.1)",
                              borderRadius: "8px",
                            }}
                          >
                            <div>📄 {file.name}</div>
                            <FileNameText>
                              {(file.size / 1024 / 1024).toFixed(2)} MB
                            </FileNameText>
                          </div>
                        )}
                      </MessageFileItem>
                    ))}
                  </MessageFile>
                )}
                <MessageTime>{formatTime(new Date(msg.timestamp))}</MessageTime>
              </MessageBubble>
            </Message>
          ))}

          {isTyping && partner && (
            <Message className="partner">
              <TypingIndicator>
                <div className="dots">
                  <span></span>
                  <span></span>
                  <span></span>
                </div>
              </TypingIndicator>
            </Message>
          )}
          <div ref={messagesEndRef} />
        </MessagesContainer>

        <MessageInputContainer>
          <MessageInputForm onSubmit={handleSendMessage}>
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleFileSelect}
              multiple
              accept="image/*,video/*"
              style={{ display: "none" }}
            />
            <AttachButton
              type="button"
              onClick={() => fileInputRef.current?.click()}
            >
              +
            </AttachButton>
            <MessageInput
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="메시지를 입력하세요..."
              rows={1}
              aria-label="메시지 입력"
              onKeyPress={(e) => {
                if (e.key === "Enter" && !e.shiftKey) {
                  e.preventDefault();
                  handleSendMessage(e);
                }
              }}
            />
            <SendButton
              type="submit"
              disabled={!message.trim() && selectedFiles.length === 0}
            >
              ↑
            </SendButton>
          </MessageInputForm>

          {showFilePreview && (
            <FilePreview>
              {selectedFiles.map((file, index) => (
                <FileItem key={index}>
                  {file.type.startsWith("image/") ? (
                    <FileImage
                      src={URL.createObjectURL(file)}
                      alt={file.name}
                    />
                  ) : (
                    <FileIcon>🎥</FileIcon>
                  )}
                  <FileInfo>
                    <FileName>{file.name}</FileName>
                    <FileSize>
                      {(file.size / 1024 / 1024).toFixed(2)} MB
                    </FileSize>
                  </FileInfo>
                  <RemoveFileButton onClick={() => handleRemoveFile(index)}>
                    ×
                  </RemoveFileButton>
                </FileItem>
              ))}
            </FilePreview>
          )}
        </MessageInputContainer>
      </ChattingMain>

      {/* 파트너 프로필 모달 */}
      {showPartnerModal && partner && (
        <PartnerModalOverlay onClick={closePartnerModal}>
          <PartnerModalContent onClick={(e) => e.stopPropagation()}>
            <PartnerModalHeader>
              <PartnerModalTitle>
                {t("profile.partnerModal.title")}
              </PartnerModalTitle>
              <CloseButton onClick={closePartnerModal}>×</CloseButton>
            </PartnerModalHeader>

            <PartnerProfileCard>
              <PartnerHeader>
                <PartnerImage>
                  {partner.profile_image && partner.profile_image !== "👤" ? (
                    <img
                      src={partner.profile_image}
                      alt={`${partner.nickname} ${t(
                        "profile.partnerModal.profileImage"
                      )}`}
                    />
                  ) : (
                    <div
                      className="placeholder"
                      role="img"
                      aria-label={t("profile.partnerModal.defaultProfileImage")}
                    >
                      👤
                    </div>
                  )}
                </PartnerImage>
                <PartnerInfo>
                  <ModalPartnerName>{partner.nickname}</ModalPartnerName>
                  <PartnerDetails>
                    <PartnerDetailItem>
                      <span>{t("profile.partnerModal.gender")}:</span>
                      <span>
                        {partner.gender === "male"
                          ? t("profile.partnerModal.male")
                          : partner.gender === "female"
                          ? t("profile.partnerModal.female")
                          : t("profile.partnerModal.notSet")}
                      </span>
                    </PartnerDetailItem>
                    <PartnerDetailItem>
                      <span>{t("profile.teachingLanguage")}:</span>
                      <span>
                        {(() => {
                          if (!partner.teaching_languages)
                            return t("profile.partnerModal.notSet");
                          if (Array.isArray(partner.teaching_languages)) {
                            try {
                              // ['["한국어"]'] 형태의 데이터 처리
                              const parsedLanguages = partner.teaching_languages
                                .map((lang) => {
                                  if (
                                    typeof lang === "string" &&
                                    lang.startsWith("[")
                                  ) {
                                    return JSON.parse(lang);
                                  }
                                  return lang;
                                })
                                .flat();
                              return parsedLanguages.length > 0
                                ? parsedLanguages.join(", ")
                                : t("profile.partnerModal.notSet");
                            } catch (e) {
                              return partner.teaching_languages.join(", ");
                            }
                          }
                          return t("profile.partnerModal.notSet");
                        })()}
                      </span>
                    </PartnerDetailItem>
                    <PartnerDetailItem>
                      <span>{t("profile.learningLanguage")}:</span>
                      <span>
                        {(() => {
                          if (!partner.learning_languages)
                            return t("profile.partnerModal.notSet");
                          if (Array.isArray(partner.learning_languages)) {
                            try {
                              // ['["영어"]'] 형태의 데이터 처리
                              const parsedLanguages = partner.learning_languages
                                .map((lang) => {
                                  if (
                                    typeof lang === "string" &&
                                    lang.startsWith("[")
                                  ) {
                                    return JSON.parse(lang);
                                  }
                                  return lang;
                                })
                                .flat();
                              return parsedLanguages.length > 0
                                ? parsedLanguages.join(", ")
                                : t("profile.partnerModal.notSet");
                            } catch (e) {
                              return partner.learning_languages.join(", ");
                            }
                          }
                          return t("profile.partnerModal.notSet");
                        })()}
                      </span>
                    </PartnerDetailItem>
                    <PartnerDetailItem>
                      <span>{t("profile.partnerModal.school")}:</span>
                      <span>
                        {partner.school || t("profile.partnerModal.notSet")}
                      </span>
                    </PartnerDetailItem>
                  </PartnerDetails>
                </PartnerInfo>
              </PartnerHeader>

              {(() => {
                const interests = partner.interests;
                if (
                  !interests ||
                  !Array.isArray(interests) ||
                  interests.length === 0
                ) {
                  return null;
                }

                try {
                  // ['["관심사1"]', '["관심사2"]'] 형태의 데이터 처리
                  const parsedInterests = interests
                    .map((interest) => {
                      if (
                        typeof interest === "string" &&
                        interest.startsWith("[")
                      ) {
                        return JSON.parse(interest);
                      }
                      return interest;
                    })
                    .flat();

                  if (parsedInterests.length === 0) return null;

                  return (
                    <div>
                      <h4 style={{ margin: "0 0 1rem 0", color: "#2c3e50" }}>
                        {t("profile.partnerModal.interests")}
                      </h4>
                      <PartnerInterests>
                        {parsedInterests.map((interest, index) => (
                          <PartnerInterestTag key={index}>
                            {t(`profile.interestsList.${interest}`)}
                          </PartnerInterestTag>
                        ))}
                      </PartnerInterests>
                    </div>
                  );
                } catch (e) {
                  return (
                    <div>
                      <h4 style={{ margin: "0 0 1rem 0", color: "#2c3e50" }}>
                        {t("profile.partnerModal.interests")}
                      </h4>
                      <PartnerInterests>
                        {interests.map((interest, index) => (
                          <PartnerInterestTag key={index}>
                            {t(`profile.interestsList.${interest}`)}
                          </PartnerInterestTag>
                        ))}
                      </PartnerInterests>
                    </div>
                  );
                }
              })()}

              <PartnerModalActions>
                <ActionButton className="secondary" onClick={closePartnerModal}>
                  {t("profile.partnerModal.close")}
                </ActionButton>
                <ActionButton
                  className="primary"
                  onClick={() => {
                    closePartnerModal();
                    // 채팅으로 돌아가기 (이미 채팅 중이므로 특별한 동작 없음)
                  }}
                >
                  {t("profile.partnerModal.continueChat")}
                </ActionButton>
              </PartnerModalActions>
            </PartnerProfileCard>
          </PartnerModalContent>
        </PartnerModalOverlay>
      )}
    </ChattingDetailContainer>
  );
};

export default ChattingDetail;
