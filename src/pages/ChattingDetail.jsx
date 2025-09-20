import React, { useState, useEffect, useRef } from "react";
import { useNavigate, useParams } from "react-router-dom";
import styled, { keyframes } from "styled-components";
import { useLanguage } from "../contexts/LanguageContext";
import {
  extractLanguageData,
  normalizeInterests,
} from "../utils/languageUtils";
import { API_ENDPOINTS } from "../config/api";
import { useWebSocketSimple as useWebSocket } from "../hooks/useWebSocketSimple";
import ReportModal from "../components/ReportModal";

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

const heartAnimation = keyframes`
  0% { opacity: 0; transform: scale(0.3); }
  50% { opacity: 1; transform: scale(1.1); }
  100% { opacity: 1; transform: scale(1); }
`;

const heartDisappearAnimation = keyframes`
  0% { opacity: 1; transform: scale(1); }
  50% { opacity: 0.5; transform: scale(1.2); }
  100% { opacity: 0; transform: scale(0.3); }
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
  animation: ${slideIn} 0.3s ease-out;

  &.me {
    justify-content: flex-end;
  }

  &.partner {
    justify-content: flex-start;
  }
`;

const MessageContent = styled.div`
  display: flex;
  align-items: flex-end;
  gap: 4px;
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
  white-space: nowrap;
  flex-shrink: 0;
  margin-bottom: 2px;

  /* 내 메시지일 때 왼쪽 정렬 */
  ${(props) =>
    props.$isMe &&
    `
    order: -1;
    margin-right: 4px;
  `}

  .dark-mode & {
    opacity: 0.8;
  }
`;

const MoreMenuContainer = styled.div`
  position: relative;
  display: flex;
  align-items: center;
`;

const MoreButton = styled.button`
  background: none;
  border: none;
  font-size: 1.5rem;
  color: #2c3e50;
  cursor: pointer;
  padding: 0.5rem;
  border-radius: 50%;
  transition: background-color 0.2s;

  &:hover {
    background-color: rgba(52, 152, 219, 0.1);
  }

  .dark-mode & {
    color: #ecf0f1;
  }
`;

const DropdownMenu = styled.div`
  position: absolute;
  top: 100%;
  right: 0;
  background: white;
  border: 1px solid #e0e0e0;
  border-radius: 8px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
  z-index: 1000;
  min-width: 150px;
  overflow: hidden;
  animation: ${slideIn} 0.2s ease-out;

  .dark-mode & {
    background: #2d2d2d;
    border-color: #444;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3);
  }
`;

const DropdownItem = styled.button`
  width: 100%;
  padding: 0.75rem 1rem;
  border: none;
  background: none;
  text-align: left;
  cursor: pointer;
  font-size: 0.9rem;
  color: #2c3e50;
  transition: background-color 0.2s;

  &:hover {
    background-color: #f8f9fa;
  }

  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
  }

  &.danger {
    color: #e74c3c;
  }

  .dark-mode & {
    color: #ecf0f1;

    &:hover {
      background-color: #3d3d3d;
    }

    &.danger {
      color: #ff6b6b;
    }
  }
`;

const SystemMessage = styled.div`
  display: flex;
  justify-content: center;
  margin: 0.5rem 0;
`;

const SystemMessageContent = styled.div`
  background: rgba(108, 117, 125, 0.1);
  color: #6c757d;
  padding: 0.5rem 1rem;
  border-radius: 12px;
  font-size: 0.85rem;
  font-style: italic;
  text-align: center;
  max-width: 80%;

  .dark-mode & {
    background: rgba(108, 117, 125, 0.2);
    color: #adb5bd;
  }
`;

const HeartReaction = styled.div`
  position: absolute;
  bottom: -6px;
  right: -6px;
  font-size: 1.2rem;
  color: #ff6b6b;
  pointer-events: none;
  z-index: 1000;
  opacity: 1;
  animation: ${(props) =>
      props.$isDisappearing ? heartDisappearAnimation : heartAnimation}
    0.3s ease-out forwards;
  animation-fill-mode: forwards;
  text-shadow: 0 0 8px rgba(255, 107, 107, 0.6);
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
  padding: 0.25rem 0.5rem;
  background: rgba(255, 255, 255, 0.95);
  backdrop-filter: blur(20px);
  border-top: 1px solid rgba(52, 152, 219, 0.2);
  box-shadow: 0 -2px 10px rgba(0, 0, 0, 0.1);
  display: flex;
  align-items: center;
  gap: 0.5rem;

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
  padding: 0.25rem 0.25rem;
  gap: 0.5rem;
  backdrop-filter: blur(20px);
  transition: all 0.3s ease;
  flex: 1;

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
  padding: 0.25rem 0.5rem;
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
  line-height: 1.4;
  vertical-align: middle;

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
  padding: 0.25rem;
  border-radius: 50%;
  cursor: pointer;
  transition: all 0.3s ease;
  font-weight: 600;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 32px;
  height: 32px;
  min-width: 32px;
  font-size: 1.2rem;
  vertical-align: middle;

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
  padding: 0.5rem;
  border-radius: 50%;
  cursor: pointer;
  transition: all 0.3s ease;
  font-weight: 900;
  box-shadow: 0 4px 15px rgba(52, 152, 219, 0.4);
  display: flex;
  align-items: center;
  justify-content: center;
  width: 36px;
  height: 36px;
  min-width: 36px;
  font-size: 1.2rem;
  vertical-align: middle;

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
  max-width: 700px;
  width: 95%;
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

  @media (max-width: 768px) {
    max-width: 95%;
    width: 95%;
    padding: 1.5rem;
  }

  @media (max-width: 480px) {
    max-width: 98%;
    width: 98%;
    padding: 1rem;
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

  const messagesEndRef = useRef(null);
  const fileInputRef = useRef(null);
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState([]);
  const [isTyping, setIsTyping] = useState(false);
  const [partner, setPartner] = useState(null);
  const [isInitialLoad, setIsInitialLoad] = useState(true);
  const [isLoadingMessages, setIsLoadingMessages] = useState(false);
  const [hasNewNotification, setHasNewNotification] = useState(
    window.globalHasNewNotification || false
  );
  const [selectedFiles, setSelectedFiles] = useState([]);
  const [showFilePreview, setShowFilePreview] = useState(false);
  const [showPartnerModal, setShowPartnerModal] = useState(false);
  const [heartReactions, setHeartReactions] = useState([
    // 테스트용 하트 반응 (실제 테스트 시 제거)
    // { id: 1, messageId: "test", timestamp: Date.now(), isDisappearing: false }
  ]);

  // 신고 모달 상태
  const [isReportModalOpen, setIsReportModalOpen] = useState(false);
  const [isLeaveModalOpen, setIsLeaveModalOpen] = useState(false);
  const [isMoreMenuOpen, setIsMoreMenuOpen] = useState(false);
  const [isLeaving, setIsLeaving] = useState(false);
  const [tapCount, setTapCount] = useState(0);
  const [tapTimeout, setTapTimeout] = useState(null);

  // 메시지 ID 관리 시스템
  const genId = () =>
    crypto?.randomUUID?.() ||
    `cid_${Date.now()}_${Math.random().toString(36).slice(2)}`;
  const processed = useRef(new Set()); // 'm:<serverId>' 또는 'c:<clientId>'
  const pending = useRef(new Map()); // clientId -> temporary UI id
  const lastServerId = useRef(null);

  // processed 크기 제한 (메모리 관리)
  const capProcessed = () => {
    const MAX = 5000;
    if (processed.current.size > MAX) {
      // 간단히 전부 초기화(또는 큐로 일부만 유지하는 방식으로 변경)
      processed.current = new Set([...processed.current].slice(-MAX));
    }
  };

  // 룸 변경 시 상태 리셋
  useEffect(() => {
    // 방이 바뀌면 중복 추적/대기 맵 초기화
    processed.current.clear();
    pending.current.clear();
    lastServerId.current = null;
    setIsInitialLoad(true); // 새로운 방 진입 시 초기 로드 상태 리셋
    setMessages([]); // 메시지 초기화
  }, [id]);

  // 웹소켓 연결
  const token = localStorage.getItem("token");
  const wsBaseUrl =
    process.env.NODE_ENV === "production"
      ? "wss://uni-lingo-client.vercel.app/ws"
      : "ws://localhost:8000/ws";
  // 테스트용 Echo Consumer URL (토큰 없이)
  const wsTestUrl = id ? `${wsBaseUrl}/test/${id}/` : null;

  const wsUrl =
    token && id
      ? `${wsBaseUrl}/chat/${id}/?token=${encodeURIComponent(token)}`
      : wsTestUrl; // 토큰이 없으면 테스트 URL 사용

  const { isConnected, lastMessage, sendMessage, error } = useWebSocket(wsUrl, {
    onOpen: () => {
      // 웹소켓 연결됨
    },
    onMessage: (message) => {
      // 하트 반응 메시지 특별 처리
      if (message.type === "heart_reaction") {
        // 하트 반응 메시지 처리
      }
    },
    onClose: () => {
      // 웹소켓 연결 종료
    },
    onError: (error) => {
      // 웹소켓 오류 처리
    },
    maxReconnectAttempts: 5,
    reconnectInterval: 3000,
  });

  // 웹소켓 메시지 처리 - 완전한 ACK/중복 방지 시스템
  useEffect(() => {
    if (!lastMessage) return;

    // 현재 사용자
    const userData = localStorage.getItem("user");
    const me =
      userData && userData !== "undefined" && userData !== "null"
        ? JSON.parse(userData)
        : null;

    switch (lastMessage.type) {
      case "message_ack": {
        const { client_id, message_id, server_ts } = lastMessage;
        if (!client_id || !message_id) return;

        // 이미 처리했으면 무시
        if (processed.current.has(`c:${client_id}`)) return;
        processed.current.add(`c:${client_id}`);
        processed.current.add(`m:${message_id}`);
        capProcessed();

        // 임시 메시지를 서버 id로 치환 (중복 방지)
        const tempUiId = pending.current.get(client_id);
        setMessages((prev) => {
          const updated = prev.map((m) => {
            if (m.clientId === client_id || m.id === tempUiId) {
              return {
                ...m,
                id: message_id, // ✅ 서버 ID로 교체
                status: "delivered",
                timestamp: server_ts
                  ? new Date(server_ts * 1000).toISOString()
                  : m.timestamp,
              };
            }
            return m;
          });

          // 중복 제거: 같은 message_id가 있으면 제거
          const seen = new Set();
          const filtered = updated.filter((m) => {
            if (seen.has(m.id)) {
              return false;
            }
            seen.add(m.id);
            return true;
          });

          // 새로운 메시지가 추가되었으므로 스크롤 트리거
          setTimeout(() => {
            messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
          }, 50);

          return filtered;
        });
        pending.current.delete(client_id);
        break;
      }

      case "chat_message": {
        const {
          id: serverId,
          message: text,
          timestamp,
          user_id: senderId,
          client_id: clientIdFromPeer,
        } = lastMessage;

        // 내가 보낸 메시지 echo면 무시
        if (senderId && me?.id && senderId === me.id) {
          if (clientIdFromPeer) processed.current.add(`c:${clientIdFromPeer}`);
          if (serverId) processed.current.add(`m:${serverId}`);
          return;
        }

        // 중복 방지: serverId/ clientId 기준
        if (
          (serverId && processed.current.has(`m:${serverId}`)) ||
          (clientIdFromPeer && processed.current.has(`c:${clientIdFromPeer}`))
        ) {
          return;
        }

        // 중복 방지 마킹
        if (serverId) processed.current.add(`m:${serverId}`);
        if (clientIdFromPeer) processed.current.add(`c:${clientIdFromPeer}`);
        capProcessed();

        const newMessage = {
          id: serverId || `ws_${Date.now()}`,
          text,
          sender: "partner",
          timestamp: timestamp || new Date().toISOString(),
          files: null,
          status: "delivered",
          message_type: lastMessage.message_type || "text",
        };

        setMessages((prev) => {
          // 중복 체크: 같은 ID가 이미 있으면 무시
          if (prev.some((m) => m.id === newMessage.id)) {
            return prev;
          }

          // 새로운 메시지 추가 후 스크롤
          setTimeout(() => {
            messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
          }, 50);

          return [...prev, newMessage];
        });
        break;
      }

      case "typing":
        setIsTyping(!!lastMessage.is_typing);
        break;

      case "heart_reaction": {
        const { action, messageId, timestamp } = lastMessage;

        if (action === "add") {
          // 하트 추가
          const newHeart = {
            id: Date.now(),
            messageId,
            timestamp: Date.now(),
            isDisappearing: false,
          };
          setHeartReactions((prev) => [...prev, newHeart]);
        } else if (action === "remove") {
          // 하트 제거
          setHeartReactions((prev) =>
            prev.map((heart) =>
              heart.messageId === messageId
                ? { ...heart, isDisappearing: true }
                : heart
            )
          );

          setTimeout(() => {
            setHeartReactions((prev) =>
              prev.filter((heart) => heart.messageId !== messageId)
            );
          }, 300);
        }
        break;
      }

      case "room_event": {
        const { event_type, user_id, username } = lastMessage;

        if (event_type === "left") {
          const systemMessage = {
            id: `system_${Date.now()}`,
            text: `${username}님이 채팅방을 나갔습니다.`,
            sender: "system",
            timestamp: new Date().toISOString(),
            files: null,
            message_type: "system_leave",
          };

          setMessages((prev) => {
            // 중복 체크
            if (prev.some((m) => m.id === systemMessage.id)) {
              return prev;
            }
            return [...prev, systemMessage];
          });

          // 스크롤을 맨 아래로
          setTimeout(() => {
            if (messagesEndRef.current) {
              messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
            }
          }, 50);
        }
        break;
      }

      case "system_message": {
        const { content, message_type, timestamp } = lastMessage;

        const systemMessage = {
          id: `system_${Date.now()}`,
          text: content,
          sender: "system",
          timestamp: timestamp || new Date().toISOString(),
          files: null,
          message_type: message_type || "system_leave",
        };

        setMessages((prev) => {
          // 중복 체크
          if (prev.some((m) => m.id === systemMessage.id)) {
            return prev;
          }
          return [...prev, systemMessage];
        });

        // 스크롤을 맨 아래로
        setTimeout(() => {
          if (messagesEndRef.current) {
            messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
          }
        }, 50);

        break;
      }

      default:
    }
  }, [lastMessage]);

  // 신고 함수
  const handleReport = async (reason) => {
    try {
      const response = await fetch(API_ENDPOINTS.CHAT_ROOM_REPORT(id), {
        method: "POST",
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ reason }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || t("chatActions.reportError"));
      }

      alert(data.message || t("chatActions.reportSuccess"));
      return data;
    } catch (error) {
      throw error;
    }
  };

  // 채팅방 나가기 함수
  const handleLeaveRoom = async () => {
    if (!window.confirm(t("chatActions.leaveConfirm"))) {
      return;
    }

    setIsLeaving(true);
    try {
      const url = API_ENDPOINTS.CHAT_ROOM_LEAVE(id);
      const token = localStorage.getItem("token");

      const response = await fetch(url, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || t("chatActions.leaveError"));
      }

      // 로컬에서 시스템 메시지 추가
      const systemMessage = {
        id: `system_${Date.now()}`,
        text: "채팅방을 나갔습니다.",
        sender: "system",
        timestamp: new Date().toISOString(),
        files: null,
        message_type: "system_leave",
      };

      setMessages((prev) => [...prev, systemMessage]);

      alert(t("chatActions.leaveSuccess"));
      // 채팅방 목록으로 이동
      navigate("/chatting");
    } catch (error) {
      alert(`${t("chatActions.leaveError")}: ${error.message}`);
    } finally {
      setIsLeaving(false);
      setIsLeaveModalOpen(false);
    }
  };

  // 하트 반응 로드 함수
  const loadHeartReactions = async () => {
    try {
      const response = await fetch(
        API_ENDPOINTS.CHAT_ROOM_HEART_REACTIONS(id),
        {
          method: "GET",
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
            "Content-Type": "application/json",
          },
        }
      );

      if (!response.ok) {
        throw new Error("하트 반응 로드 실패");
      }

      const data = await response.json();
      if (data.success && data.heart_reactions) {
        // 하트 반응 데이터를 프론트엔드 상태 형식으로 변환
        const heartReactionsArray = [];
        Object.entries(data.heart_reactions).forEach(
          ([messageId, reactions]) => {
            reactions.forEach((reaction) => {
              heartReactionsArray.push({
                id: reaction.id,
                messageId: parseInt(messageId),
                timestamp: reaction.timestamp,
                isDisappearing: false,
              });
            });
          }
        );
        setHeartReactions(heartReactionsArray);
      }
    } catch (error) {}
  };

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
        setIsLoadingMessages(true); // 로딩 시작

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

          if (partnerData.success && partnerData.partner) {
            setPartner(partnerData.partner);
          } else {
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
              message_type: msg.message_type || "text",
            }));

            setMessages(transformedMessages);
          } else {
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
          } catch (error) {}
        } else {
          setPartner(null);
          setMessages([]);
        }
      } catch (error) {
        setPartner(null);
        setMessages([]);
      } finally {
        setIsLoadingMessages(false);
      }
    };

    loadChatData();
    loadHeartReactions(); // 하트 반응도 함께 로드
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

    const clientId = genId(); // ✅ 임시ID 생성
    const tempUiId = `tmp_${clientId}`; // UI key (리액트 key용)
    pending.current.set(clientId, tempUiId);

    const nowIso = new Date().toISOString(); // ✅ ISO 문자열로 통일
    const optimistic = {
      id: tempUiId, // UI에서 쓸 키
      clientId, // ✅ 임시ID 저장
      text: message,
      sender: "me",
      timestamp: nowIso, // ✅ ISO 문자열
      files:
        selectedFiles.length > 0
          ? selectedFiles.map((file) => ({
              name: file.name,
              type: file.type,
              size: file.size,
              url: URL.createObjectURL(file),
            }))
          : null,
      status: "sending",
    };

    // 로컬 상태에 즉시 추가 (낙관적 업데이트)
    setMessages((prev) => [...prev, optimistic]);

    // 메시지 전송 후 스크롤
    setTimeout(() => {
      messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }, 50);

    setMessage("");
    setSelectedFiles([]);
    setShowFilePreview(false);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }

    // 웹소켓으로 메시지 전송
    if (isConnected) {
      sendMessage({
        type: "chat_message",
        message: message,
        timestamp: optimistic.timestamp, // ✅ 이미 ISO 문자열
        client_id: clientId, // ✅ 꼭 보냄
      });
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
        // ✅ WebSocket이 연결되어 있으면 REST API 전송 건너뛰기
        if (isConnected) {
          return;
        }

        // ✅ WebSocket이 끊어진 경우에만 REST API로 메시지 전송
        const formData = new FormData();
        formData.append("content", message || "");
        formData.append("client_id", clientId); // ✅ client_id 추가

        // 파일이 있는 경우 추가
        if (selectedFiles.length > 0) {
          selectedFiles.forEach((file, index) => {
            formData.append(`files`, file);
          });
        }

        const response = await fetch(
          API_ENDPOINTS.CHAT_ROOM_MESSAGES_SEND(id),
          {
            method: "POST",
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
              // Content-Type은 FormData 사용 시 자동으로 설정되므로 제거
            },
            body: formData,
          }
        );

        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.message || "메시지 전송에 실패했습니다.");
        }

        const sentMessage = await response.json();
        if (sentMessage.success && sentMessage.message) {
          // ✅ REST 응답으로 임시 메시지 치환
          setMessages((prev) =>
            prev.map((m) =>
              m.clientId === clientId || m.id === tempUiId
                ? {
                    ...m,
                    id: sentMessage.message.id,
                    status: "delivered",
                    timestamp: sentMessage.message.timestamp, // ISO 문자열
                  }
                : m
            )
          );
          processed.current.add(`m:${sentMessage.message.id}`);
          pending.current.delete(clientId);
        }
      }
    } catch (error) {
      // 에러 시 메시지를 다시 제거 (낙관적 업데이트 롤백)
      setMessages((prev) => prev.slice(0, -1));
      alert("메시지 전송에 실패했습니다. 다시 시도해주세요.");
    }
  };

  // 스크롤을 맨 아래로
  useEffect(() => {
    // 메시지가 있을 때만 스크롤
    if (messages.length > 0) {
      // 초기 로드이거나 새로운 메시지가 추가된 경우 스크롤
      const shouldScroll = isInitialLoad || !isLoadingMessages;

      if (shouldScroll) {
        // DOM 렌더링 완료 후 스크롤
        setTimeout(
          () => {
            messagesEndRef.current?.scrollIntoView({
              behavior: isInitialLoad ? "auto" : "smooth", // 초기 로드는 즉시, 그 외는 부드럽게
            });
            setIsInitialLoad(false); // 초기 로드 완료 표시
          },
          isInitialLoad ? 200 : 100
        ); // 초기 로드는 조금 더 기다림
      }
    }
  }, [messages, isTyping, isInitialLoad, isLoadingMessages]);

  // 마지막 서버 message_id 추적 업데이트
  useEffect(() => {
    const maxId = messages
      .map((m) => (Number.isFinite(+m.id) ? +m.id : -1))
      .reduce((a, b) => Math.max(a, b), lastServerId.current ?? -1);
    if (maxId >= 0) lastServerId.current = maxId;
  }, [messages]);

  // 실시간 메시지 수신 - WebSocket 연결 상태에 따라 폴링 제어
  useEffect(() => {
    if (!id || !partner) return;

    const checkNewMessages = async () => {
      try {
        const after = lastServerId.current ?? 0;
        const url = API_ENDPOINTS.CHAT_ROOM_MESSAGES(id) + `?after=${after}`;
        const response = await fetch(url, {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        });

        if (!response.ok) return;
        const data = await response.json();
        if (!data.success || !data.messages) return;

        const incoming = data.messages
          .map((msg) => ({
            id: msg.id,
            text: msg.content,
            sender: msg.is_from_me ? "me" : "partner",
            timestamp: msg.timestamp,
            files: msg.files || null,
            status: "delivered",
          }))
          .filter(
            (m) => !processed.current.has(`m:${m.id}`) && m.sender !== "me"
          );

        if (incoming.length) {
          incoming.forEach((m) => processed.current.add(`m:${m.id}`));
          capProcessed();
          setMessages((prev) => {
            // 기존 메시지와 중복되지 않는 새 메시지만 추가
            const existingIds = new Set(prev.map((m) => m.id));
            const newUniqueMessages = incoming.filter(
              (m) => !existingIds.has(m.id)
            );

            if (newUniqueMessages.length > 0) {
              return [...prev, ...newUniqueMessages];
            }
            return prev;
          });

          // 알림 추가
          incoming.forEach((newMsg) => {
            if (window.addMessageNotification) {
              window.addMessageNotification(
                newMsg.text,
                partner?.name || partner?.nickname,
                id
              );
            }
          });
        }
      } catch (error) {}
    };

    let interval;

    if (!isConnected) {
      // ✅ WS 끊겼을 때만 폴링
      interval = setInterval(checkNewMessages, 3000);
    }
    // ✅ WS 연결이면 폴링 중지 (즉시 동기화도 제거)

    return () => {
      if (interval) clearInterval(interval);
    };
  }, [id, partner, isConnected]);

  // 더보기 메뉴 외부 클릭 시 닫기
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (isMoreMenuOpen && !event.target.closest(".more-menu-container")) {
        setIsMoreMenuOpen(false);
      }
    };

    if (isMoreMenuOpen) {
      document.addEventListener("click", handleClickOutside);
    }

    return () => {
      document.removeEventListener("click", handleClickOutside);
    };
  }, [isMoreMenuOpen]);

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

  // 하트 반응 함수
  const handleHeartReaction = (messageId) => {
    const existingHeart = heartReactions.find(
      (heart) => heart.messageId === messageId
    );

    if (existingHeart) {
      // 하트 제거 애니메이션
      setHeartReactions((prev) =>
        prev.map((heart) =>
          heart.messageId === messageId
            ? { ...heart, isDisappearing: true }
            : heart
        )
      );

      setTimeout(() => {
        setHeartReactions((prev) =>
          prev.filter((heart) => heart.messageId !== messageId)
        );
      }, 300);

      // WebSocket으로 하트 제거 알림
      if (isConnected) {
        const heartRemoveMessage = {
          type: "heart_reaction",
          action: "remove",
          messageId: messageId,
          timestamp: new Date().toISOString(),
        };
        sendMessage(heartRemoveMessage);
      }
      return;
    }

    // 하트 추가
    const newHeart = {
      id: Date.now(),
      messageId,
      timestamp: Date.now(),
      isDisappearing: false,
    };

    setHeartReactions((prev) => [...prev, newHeart]);

    // WebSocket으로 하트 추가 알림
    if (isConnected) {
      const heartAddMessage = {
        type: "heart_reaction",
        action: "add",
        messageId: messageId,
        timestamp: new Date().toISOString(),
      };
      sendMessage(heartAddMessage);
    }
  };

  // 모바일 더블탭 핸들러
  const handleTap = (messageId, sender) => {
    // 모든 메시지에 하트 반응 허용 (자신의 메시지도 포함)

    const newTapCount = tapCount + 1;
    setTapCount(newTapCount);

    if (tapTimeout) {
      clearTimeout(tapTimeout);
    }

    if (newTapCount === 2) {
      handleHeartReaction(messageId);
      setTapCount(0);
    } else {
      const timeout = setTimeout(() => setTapCount(0), 300);
      setTapTimeout(timeout);
    }
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
        <MoreMenuContainer className="more-menu-container">
          <MoreButton
            onClick={() => setIsMoreMenuOpen(!isMoreMenuOpen)}
            title={t("chatActions.moreMenu")}
            aria-label={t("chatActions.moreMenu")}
          >
            ⋯
          </MoreButton>
          {isMoreMenuOpen && (
            <DropdownMenu>
              <DropdownItem
                onClick={() => {
                  setIsReportModalOpen(true);
                  setIsMoreMenuOpen(false);
                }}
                title={t("chatActions.report")}
              >
                {t("chatActions.report")}
              </DropdownItem>
              <DropdownItem
                className="danger"
                onClick={() => {
                  handleLeaveRoom();
                  setIsMoreMenuOpen(false);
                }}
                disabled={isLeaving}
                title={t("chatActions.leaveRoom")}
              >
                {isLeaving ? "..." : t("chatActions.leaveRoom")}
              </DropdownItem>
            </DropdownMenu>
          )}
        </MoreMenuContainer>
      </ChattingHeader>

      <ChattingMain>
        <MessagesContainer>
          {messages.map((msg, index) => {
            // 시스템 메시지인 경우 다른 렌더링
            if (msg.message_type && msg.message_type !== "text") {
              return (
                <SystemMessage key={String(msg.id)}>
                  <SystemMessageContent>{msg.text}</SystemMessageContent>
                </SystemMessage>
              );
            }

            // 일반 메시지 렌더링
            return (
              <Message key={String(msg.id)} className={msg.sender}>
                <MessageContent>
                  <MessageBubble
                    className={msg.sender}
                    onDoubleClick={() => {
                      // 모든 메시지에 하트 반응 허용 (자신의 메시지도 포함)
                      handleHeartReaction(msg.id);
                    }}
                    onClick={() => {
                      handleTap(msg.id, msg.sender);
                    }}
                    style={{ position: "relative" }}
                  >
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
                                  cursor: "pointer",
                                  transition: "background 0.3s ease",
                                }}
                                onClick={() => {
                                  // 파일 다운로드
                                  const link = document.createElement("a");
                                  link.href = file.url;
                                  link.download = file.name;
                                  link.target = "_blank";
                                  document.body.appendChild(link);
                                  link.click();
                                  document.body.removeChild(link);
                                }}
                                onMouseEnter={(e) => {
                                  e.target.style.background =
                                    "rgba(255,255,255,0.2)";
                                }}
                                onMouseLeave={(e) => {
                                  e.target.style.background =
                                    "rgba(255,255,255,0.1)";
                                }}
                              >
                                <div>
                                  {file.type === "application/pdf"
                                    ? "📄"
                                    : file.type.startsWith("text/")
                                    ? "📝"
                                    : "📎"}{" "}
                                  {file.name}
                                </div>
                                <FileNameText>
                                  {(file.size / 1024 / 1024).toFixed(2)} MB
                                </FileNameText>
                              </div>
                            )}
                          </MessageFileItem>
                        ))}
                      </MessageFile>
                    )}

                    {/* 하트 반응 - 모든 메시지에 표시 */}
                    {heartReactions
                      .filter((heart) => heart.messageId === msg.id)
                      .map((heart) => (
                        <HeartReaction
                          key={heart.id}
                          $isDisappearing={heart.isDisappearing}
                        >
                          ❤️
                        </HeartReaction>
                      ))}
                  </MessageBubble>
                  <MessageTime $isMe={msg.sender === "me"}>
                    {formatTime(new Date(msg.timestamp))}
                  </MessageTime>
                </MessageContent>
              </Message>
            );
          })}

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
          <MessageInputForm onSubmit={handleSendMessage}>
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
                  ) : file.type.startsWith("video/") ? (
                    <FileIcon>🎥</FileIcon>
                  ) : file.type === "application/pdf" ? (
                    <FileIcon>📄</FileIcon>
                  ) : file.type.startsWith("text/") ? (
                    <FileIcon>📝</FileIcon>
                  ) : (
                    <FileIcon>📎</FileIcon>
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

      {/* 신고 모달 */}
      <ReportModal
        isOpen={isReportModalOpen}
        onClose={() => setIsReportModalOpen(false)}
        onReport={handleReport}
        reportedUser={partner}
      />
    </ChattingDetailContainer>
  );
};

export default ChattingDetail;
