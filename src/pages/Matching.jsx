import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import styled, { keyframes } from "styled-components";
import {
  extractLanguageData,
  normalizeInterests,
} from "../utils/languageUtils";
import UnderBar from "../components/UnderBar";
import Sidebar from "../components/Sidebar";
import { useLanguage } from "../contexts/LanguageContext";
import { useAuth } from "../contexts/AuthContext";
import { API_ENDPOINTS } from "../config/api";
import { FiBell } from "react-icons/fi";

// Keyframes
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

const spin = keyframes`
  0% {
    transform: rotate(0deg);
  }
  100% {
    transform: rotate(360deg);
  }
`;

const bounce = keyframes`
  0%, 20%, 50%, 80%, 100% {
    transform: translateY(0);
  }
  40% {
    transform: translateY(-10px);
  }
  60% {
    transform: translateY(-5px);
  }
`;

// Styled Components
const MatchingContainer = styled.div`
  min-height: 100vh;
  background: #ffffff;
  color: #2c3e50;
  font-family: "Inter", "Segoe UI", -apple-system, BlinkMacSystemFont,
    sans-serif;
  position: relative;
  overflow: hidden;
  padding-left: 0;
  transition: background-color 0.3s ease, color 0.3s ease;

  @media (min-width: 769px) {
    padding-left: 250px;
  }

  @media (min-width: 1200px) {
    padding-left: 280px;
  }

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

const MatchingHeader = styled.header`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1rem 2rem;
  background: rgba(255, 255, 255, 0.9);
  backdrop-filter: blur(20px);
  border-bottom: 1px solid rgba(52, 152, 219, 0.2);
  position: relative;
  z-index: 10;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
  flex-shrink: 0;
  transition: all 0.3s ease;

  @media (max-width: 1024px) {
    padding: 1rem 1.5rem;
  }

  @media (min-width: 769px) {
    display: none;
  }

  @media (max-width: 768px) {
    padding: 1rem;
    gap: 0.5rem;
  }

  .dark-mode & {
    background: rgba(45, 45, 45, 0.9);
    border-bottom: 1px solid rgba(52, 152, 219, 0.4);
    box-shadow: 0 2px 10px rgba(0, 0, 0, 0.3);
  }

  @media (max-width: 480px) {
    padding: 0.8rem;
    gap: 0.3rem;
  }
`;

const Logo = styled.div`
  font-size: 1.5rem;
  font-weight: 700;
  background: linear-gradient(135deg, #3498db 0%, #2ecc71 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  position: relative;

  @media (max-width: 768px) {
    font-size: 1.5rem;
  }

  @media (max-width: 480px) {
    font-size: 1.3rem;
  }
`;

const BackBtn = styled.button`
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
`;

const ChatBtn = styled.button`
  background: linear-gradient(135deg, #3498db 0%, #2ecc71 100%);
  border: none;
  color: white;
  padding: 0.75rem 1.5rem;
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.3s ease;
  font-weight: 600;
  font-size: 1rem;
  box-shadow: 0 4px 15px rgba(52, 152, 219, 0.4);

  @media (max-width: 768px) {
    padding: 0.6rem 1.2rem;
    font-size: 0.9rem;
  }

  @media (max-width: 480px) {
    padding: 0.5rem 1rem;
    font-size: 0.85rem;
  }

  @media (min-width: 769px) {
    &:hover {
      transform: translateY(-2px);
      box-shadow: 0 8px 30px rgba(52, 152, 219, 0.6);
      animation: ${pulse} 0.6s ease-in-out;
    }
  }
`;

// Mobile Menu Components 제거됨 - PC에서만 사이드바 사용

// Header Components

const NotificationContainer = styled.div`
  position: relative;
  cursor: pointer;
  padding: 0.5rem;
  border-radius: 50%;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  justify-content: center;

  @media (min-width: 769px) {
    &:hover {
      background: rgba(52, 152, 219, 0.1);
    }
  }
`;

const NotificationIcon = styled.span`
  font-size: 1.8rem;
  display: block;
`;

const NotificationBadge = styled.div`
  position: absolute;
  top: 0.25rem;
  right: 0.25rem;
  background: #e74c3c;
  color: white;
  border-radius: 50%;
  width: 16px;
  height: 16px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 0.6rem;
  font-weight: bold;
`;

const MatchingMain = styled.main`
  max-width: 1200px;
  margin: 0 auto;
  padding: 1rem;
  position: relative;
  z-index: 1;
`;

const ProfileSection = styled.div`
  background: rgba(52, 152, 219, 0.1);
  backdrop-filter: blur(20px);
  border: 2px solid #3498db;
  border-radius: 12px;
  padding: 1.5rem;
  margin-bottom: 1.5rem;
  position: relative;
  overflow: hidden;
  transition: all 0.3s ease;

  &::before {
    content: "";
    position: absolute;
    top: 0;
    left: -100%;
    width: 100%;
    height: 100%;
    background: linear-gradient(
      90deg,
      transparent,
      rgba(52, 152, 219, 0.2),
      transparent
    );
    transition: left 0.5s;
  }

  &:hover::before {
    left: 100%;
  }

  .dark-mode & {
    background: rgba(52, 152, 219, 0.2);
    border: 2px solid #3498db;
  }

  h2 {
    text-align: center;
    margin-bottom: 2rem;
    font-size: 2rem;
    font-weight: 700;
    background: linear-gradient(135deg, #3498db 0%, #2ecc71 100%);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    background-clip: text;
  }
`;

const UserProfileCard = styled.div`
  background: rgba(255, 255, 255, 0.9);
  border-radius: 12px;
  padding: 1rem;
  margin-bottom: 1rem;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.1);
  transition: all 0.3s ease;

  .desktop-only {
    @media (max-width: 768px) {
      display: none !important;
    }
  }

  .mobile-only {
    @media (min-width: 769px) {
      display: none !important;
    }
  }

  .dark-mode & {
    background: rgba(45, 45, 45, 0.9);
    box-shadow: 0 4px 15px rgba(0, 0, 0, 0.3);
  }
`;

const ProfileHeader = styled.div`
  display: flex;
  align-items: center;
  gap: 1rem;
  margin-bottom: 0.5rem;

  @media (max-width: 768px) {
    flex-direction: row;
    align-items: center;
    gap: 1rem;
    margin-bottom: 0.5rem;
  }
`;

const ProfileImage = styled.div`
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
`;

const ProfileInfo = styled.div`
  flex: 1;
`;

const ProfileName = styled.h3`
  margin: 0 0 0.5rem 0;
  font-size: 1.5rem;
  color: #2c3e50;
  transition: color 0.3s ease;

  .dark-mode & {
    color: #ffffff;
  }
`;

const ProfileDetails = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
`;

const DetailItem = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-size: 0.9rem;
  color: #6c757d;
  transition: color 0.3s ease;

  .dark-mode & {
    color: #b0b0b0;
  }
`;

const InterestsList = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
`;

const ProfileInterestTag = styled.span`
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  background: linear-gradient(135deg, #3498db 0%, #2ecc71 100%);
  color: white;
  padding: 0.3rem 0.8rem;
  border-radius: 15px;
  font-size: 0.8rem;
  font-weight: 500;
  margin: 0.25rem;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  transition: all 0.3s ease;

  &:hover {
    transform: translateY(-1px);
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.15);
  }

  button {
    background: none;
    border: none;
    color: white;
    cursor: pointer;
    font-size: 1rem;
    padding: 0;
    width: 16px;
    height: 16px;
    display: flex;
    align-items: center;
    justify-content: center;
    border-radius: 50%;
    transition: all 0.3s ease;

    &:hover {
      background: rgba(255, 255, 255, 0.2);
    }
  }
`;

const FilterSection = styled.div`
  background: rgba(46, 204, 113, 0.1);
  backdrop-filter: blur(20px);
  border: 2px solid #2ecc71;
  border-radius: 12px;
  padding: 0.8rem 1.1rem 1.1rem 1.1rem;
  margin-bottom: 0.2rem;
  transition: all 0.3s ease;

  .dark-mode & {
    background: rgba(45, 45, 45, 0.9);
    border: 2px solid #2ecc71;
  }
`;

const FilterTitle = styled.h3`
  text-align: center;
  margin-bottom: 0.5rem;
  font-size: 1.3rem;
  font-weight: 600;
  color: #2c3e50;
  transition: color 0.3s ease;

  .dark-mode & {
    color: #ffffff;
  }
`;

const FilterForm = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr 1fr;
  gap: 1rem;

  @media (max-width: 768px) {
    grid-template-columns: 1fr;
    gap: 0.8rem;
  }
`;

const FilterGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.5rem;

  label {
    font-weight: 600;
    font-size: 0.95rem;
    color: #2c3e50;
    transition: color 0.3s ease;

    .dark-mode & {
      color: #b0b0b0;
    }
  }

  select {
    padding: 0.75rem;
    border: 2px solid #e1e8ed;
    border-radius: 8px;
    background: rgba(255, 255, 255, 0.9);
    color: #2c3e50;
    font-size: 1rem;
    transition: all 0.3s ease;

    &:focus {
      outline: none;
      border-color: #2ecc71;
      box-shadow: 0 0 0 3px rgba(46, 204, 113, 0.2);
    }

    .dark-mode & {
      background: rgba(60, 60, 60, 0.9);
      color: #ffffff;
      border-color: #555;
    }
  }
`;

const LanguageButton = styled.button`
  padding: 0.75rem;
  border: 2px solid #e1e8ed;
  border-radius: 8px;
  background: rgba(255, 255, 255, 0.9);
  color: #2c3e50;
  font-size: 1rem;
  transition: all 0.3s ease;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: space-between;
  text-align: left;
  min-height: 48px;

  &:hover {
    border-color: #2ecc71;
    background: rgba(46, 204, 113, 0.05);
    transform: translateY(-1px);
    box-shadow: 0 2px 8px rgba(46, 204, 113, 0.2);
  }

  &:focus {
    outline: none;
    border-color: #2ecc71;
    box-shadow: 0 0 0 3px rgba(46, 204, 113, 0.2);
  }

  .dark-mode & {
    background: rgba(60, 60, 60, 0.9);
    color: #ffffff;
    border-color: #555;

    &:hover {
      border-color: #5dade2;
      background: rgba(93, 173, 226, 0.1);
    }
  }
`;

const LanguageDisplay = styled.span`
  flex: 1;
  text-align: left;
`;

const ArrowIcon = styled.span`
  font-size: 1.2rem;
  color: #6c757d;
  transition: all 0.3s ease;

  .dark-mode & {
    color: #b0b0b0;
  }
`;

const ButtonContainer = styled.div`
  text-align: center;
  margin-top: 0.6rem;
  padding: 0.4rem 0;

  @media (max-width: 768px) {
    margin-top: 0.4rem;
    padding: 0.3rem 0;
  }
`;

const ProfileForm = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
`;

const FormGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.5rem;

  label {
    font-weight: 600;
    font-size: 1.1rem;
    color: #2c3e50;
  }

  input,
  select {
    padding: 0.75rem;
    border: 1px solid rgba(52, 152, 219, 0.3);
    border-radius: 8px;
    background: rgba(255, 255, 255, 0.9);
    color: #2c3e50;
    font-size: 1rem;
    transition: all 0.3s ease;

    &:focus {
      outline: none;
      border-color: #3498db;
      box-shadow: 0 0 0 3px rgba(52, 152, 219, 0.2);
    }

    &::placeholder {
      color: rgba(44, 62, 80, 0.7);
    }

    option {
      background: #fff;
      color: #2c3e50;
    }
  }
`;

const FormRow = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 1rem;

  @media (max-width: 768px) {
    grid-template-columns: 1fr;
  }
`;

const InterestsContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1rem;
`;

const InterestTags = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
`;

const InterestTag = styled.button`
  padding: 0.5rem 1rem;
  border: 1px solid rgba(52, 152, 219, 0.3);
  border-radius: 20px;
  background: rgba(52, 152, 219, 0.1);
  color: #3498db;
  cursor: pointer;
  transition: all 0.3s ease;
  font-size: 0.9rem;

  @media (min-width: 769px) {
    &:hover:not(:disabled) {
      background: rgba(52, 152, 219, 0.2);
      transform: translateY(-2px);
      box-shadow: 0 4px 15px rgba(52, 152, 219, 0.3);
    }
  }

  &.selected {
    background: linear-gradient(135deg, #3498db 0%, #2ecc71 100%);
    border-color: #3498db;
    color: white;
    box-shadow: 0 4px 15px rgba(52, 152, 219, 0.4);
  }

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
`;

const SelectedInterests = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
`;

const SelectedInterest = styled.span`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.5rem 1rem;
  background: linear-gradient(135deg, #3498db 0%, #2ecc71 100%);
  border-radius: 20px;
  font-size: 0.9rem;
  color: white;

  button {
    background: none;
    border: none;
    color: white;
    cursor: pointer;
    font-size: 1.2rem;
    padding: 0;
    width: 20px;
    height: 20px;
    display: flex;
    align-items: center;
    justify-content: center;
    border-radius: 50%;
    transition: all 0.3s ease;

    &:hover {
      background: rgba(255, 255, 255, 0.2);
    }
  }
`;

const MatchingBtn = styled.button`
  padding: 0.9rem 1.8rem;
  border: none;
  border-radius: 8px;
  font-size: 1.05rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  background: linear-gradient(135deg, #3498db 0%, #2ecc71 100%);
  color: white;
  box-shadow: 0 4px 15px rgba(52, 152, 219, 0.4);
  margin-top: 0.7rem;

  @media (min-width: 769px) {
    &:hover:not(:disabled) {
      transform: translateY(-3px);
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

const MatchingAnimation = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 60vh;
  text-align: center;
`;

const LoadingSpinner = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 200px;
  flex-direction: column;
  gap: 1rem;

  .spinner {
    width: 40px;
    height: 40px;
    border: 4px solid #f3f3f3;
    border-top: 4px solid #3498db;
    border-radius: 50%;
    animation: spin 1s linear infinite;
  }

  @keyframes spin {
    0% {
      transform: rotate(0deg);
    }
    100% {
      transform: rotate(360deg);
    }
  }
`;

const MatchingContent = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 1rem;
`;

const MatchingIcon = styled.div`
  font-size: 4rem;
  animation: ${spin} 2s linear infinite;
  margin-bottom: 1rem;
`;

const Countdown = styled.div`
  font-size: 3rem;
  font-weight: 700;
  color: #ff6b6b;
  animation: ${pulse} 1s ease-in-out infinite;
`;

const LoadingDots = styled.div`
  display: flex;
  gap: 0.5rem;
  margin-top: 1rem;

  span {
    width: 10px;
    height: 10px;
    background: #ff6b6b;
    border-radius: 50%;
    animation: ${bounce} 1.4s ease-in-out infinite both;

    &:nth-child(1) {
      animation-delay: -0.32s;
    }

    &:nth-child(2) {
      animation-delay: -0.16s;
    }
  }
`;

// 모달 컴포넌트들
const ModalOverlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
  backdrop-filter: blur(5px);
`;

const ModalContent = styled.div`
  background: white;
  border-radius: 12px;
  padding: 2rem;
  max-width: 400px;
  width: 90%;
  text-align: center;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.3);
  animation: modalSlideIn 0.3s ease-out;

  @keyframes modalSlideIn {
    from {
      opacity: 0;
      transform: translateY(-20px) scale(0.95);
    }
    to {
      opacity: 1;
      transform: translateY(0) scale(1);
    }
  }
`;

const ModalIcon = styled.div`
  font-size: 3rem;
  margin-bottom: 1rem;
  ${(props) => {
    switch (props.type) {
      case "success":
        return "color: #2ecc71;";
      case "warning":
        return "color: #f39c12;";
      case "error":
        return "color: #e74c3c;";
      default:
        return "color: #3498db;";
    }
  }}
`;

const ModalTitle = styled.h3`
  margin: 0 0 1rem 0;
  font-size: 1.5rem;
  color: #2c3e50;
`;

const ModalMessage = styled.p`
  margin: 0 0 2rem 0;
  color: #666;
  line-height: 1.8;
  white-space: pre-line;
  text-align: center;
  font-size: 1.1rem;
`;

const ModalButton = styled.button`
  background: ${(props) => {
    switch (props.type) {
      case "success":
        return "linear-gradient(135deg, #2ecc71 0%, #27ae60 100%)";
      case "warning":
        return "linear-gradient(135deg, #f39c12 0%, #e67e22 100%)";
      case "error":
        return "linear-gradient(135deg, #e74c3c 0%, #c0392b 100%)";
      default:
        return "linear-gradient(135deg, #3498db 0%, #2980b9 100%)";
    }
  }};
  color: white;
  border: none;
  padding: 0.75rem 2rem;
  border-radius: 8px;
  cursor: pointer;
  font-size: 1rem;
  font-weight: 600;
  transition: all 0.3s ease;

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 5px 15px rgba(0, 0, 0, 0.2);
  }
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

const PartnerName = styled.h3`
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

const Matching = () => {
  const navigate = useNavigate();
  const { t } = useLanguage();
  const { user, token } = useAuth();
  const [isPending, setIsPending] = useState(false);
  const [isRequesting, setIsRequesting] = useState(false);
  const [countdown, setCountdown] = useState(3);
  const [showStatusModal, setShowStatusModal] = useState(false);
  const [modalMessage, setModalMessage] = useState("");
  const [modalType, setModalType] = useState("info"); // "info", "success", "warning"
  const [hasNewNotification, setHasNewNotification] = useState(
    window.globalHasNewNotification || false
  );

  // 모달 닫기 함수
  const closeModal = () => {
    setShowStatusModal(false);
    // 성공 모달인 경우 닫힌 후 pending 상태로 변경 (UI는 모달로만 처리)
    if (modalType === "success") {
      setIsPending(true);
    }
  };

  const [userProfile, setUserProfile] = useState({
    nickname: "",
    gender: "",
    profileImage: null,
    teachingLanguage: "",
    learningLanguage: "",
    school: "",
    interests: [],
  });
  const [isProfileLoaded, setIsProfileLoaded] = useState(false);
  const [filterSettings, setFilterSettings] = useState({
    gender: "",
    learningLanguage: "",
    university: "",
    specificUniversity: "",
  });
  const [selectedLearningLanguageName, setSelectedLearningLanguageName] =
    useState(localStorage.getItem("selectedLearningLanguageName") || "");
  const [potentialPartners, setPotentialPartners] = useState([]);
  const [isLoadingPartners, setIsLoadingPartners] = useState(false);

  // 파트너 목록 로드
  useEffect(() => {
    const loadPotentialPartners = async () => {
      if (!token) return;

      setIsLoadingPartners(true);
      try {
        // 테스트 환경: 가짜 파트너 데이터 생성
        const savedUser = localStorage.getItem("user");
        if (savedUser) {
          // 테스트용 가짜 파트너 데이터
          const mockPartners = [
            {
              id: 2,
              nickname: "김영희",
              gender: "female",
              school: "연세대학교",
              department: "영어영문학과",
              learning_languages: ["한국어", "영어"],
              teaching_languages: ["일본어", "중국어"],
              interests: ["드라마", "음악", "여행"],
              profile_image: null,
              avatar: "👩",
              age: 22,
              university: "seoul_area",
            },
            {
              id: 3,
              nickname: "박민수",
              gender: "male",
              school: "고려대학교",
              department: "중국어중문학과",
              learning_languages: ["한국어"],
              teaching_languages: ["중국어", "영어"],
              interests: ["게임", "스포츠", "영화"],
              profile_image: null,
              avatar: "👨",
              age: 24,
              university: "seoul_area",
            },
            {
              id: 4,
              nickname: "이지은",
              gender: "female",
              school: "서강대학교",
              department: "일본어일본문학과",
              learning_languages: ["한국어", "일본어"],
              teaching_languages: ["영어", "중국어"],
              interests: ["K-pop", "요리", "책"],
              profile_image: null,
              avatar: "👩",
              age: 21,
              university: "seoul_area",
            },
          ];

          setPotentialPartners(mockPartners);
          setIsLoadingPartners(false);
          console.log("테스트 파트너 데이터 로드 완료:", mockPartners);
          return;
        }

        // 백엔드에서 파트너 목록 불러오기 (실제 배포 시)
        const response = await fetch(API_ENDPOINTS.MATCHING_PARTNERS, {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        });

        if (response.ok) {
          const partnersData = await response.json();
          setPotentialPartners(partnersData);
        } else {
          console.error("파트너 목록을 불러오는데 실패했습니다.");
          setPotentialPartners([]);
        }
      } catch (error) {
        console.error("파트너 목록 로딩 중 오류가 발생했습니다:", error);
        setPotentialPartners([]);
      } finally {
        setIsLoadingPartners(false);
      }
    };

    if (token) {
      loadPotentialPartners();
    }
  }, [token]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setUserProfile((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilterSettings((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // 사용자 프로필 데이터 로드
  // 사용자 프로필 로드
  useEffect(() => {
    const loadUserProfile = async () => {
      if (!token) return;

      try {
        // 테스트 환경: localStorage에서 사용자 정보 로드
        const savedUser = localStorage.getItem("user");
        if (savedUser) {
          const userData = JSON.parse(savedUser);
          const { learningLanguage, teachingLanguage } =
            extractLanguageData(userData);

          const normalizedInterests = normalizeInterests(userData.interests);

          setUserProfile({
            nickname: userData.nickname || "",
            gender: userData.gender || "",
            profileImage: userData.profile_image || null,
            teachingLanguage,
            learningLanguage,
            school: userData.school || "",
            interests: normalizedInterests,
          });
          setIsProfileLoaded(true);
          console.log("테스트 계정 프로필 로드 완료:", userData);
          return;
        }

        // 백엔드에서 프로필 데이터 불러오기 (실제 배포 시)
        const response = await fetch(API_ENDPOINTS.PROFILE, {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        });

        if (response.ok) {
          const userData = await response.json();
          const { learningLanguage, teachingLanguage } =
            extractLanguageData(userData);

          const normalizedInterests = normalizeInterests(userData.interests);

          setUserProfile({
            nickname: userData.nickname || "",
            gender: userData.gender || "",
            profileImage: userData.profileImage || null,
            teachingLanguage,
            learningLanguage,
            school: userData.school || "",
            interests: normalizedInterests,
          });
          setIsProfileLoaded(true);
        } else {
          console.error("프로필 데이터를 불러오는데 실패했습니다.");
          // 에러 시 기본값 설정
          setUserProfile({
            nickname: "",
            gender: "",
            profileImage: null,
            teachingLanguage: "",
            learningLanguage: "",
            school: "",
            interests: [],
          });
          setIsProfileLoaded(true);
        }
      } catch (error) {
        console.error("프로필 로딩 중 오류가 발생했습니다:", error);
        // 에러 시 기본값 설정
        setUserProfile({
          nickname: "",
          gender: "",
          profileImage: null,
          teachingLanguage: "",
          learningLanguage: "",
          school: "",
          interests: [],
        });
        setIsProfileLoaded(true);
      }
    };

    if (token) {
      loadUserProfile();
    }
  }, [token]);

  // 사용자 프로필이 로드되면 배우고 싶은 언어를 필터 기본값으로 설정
  useEffect(() => {
    if (
      userProfile.learningLanguage &&
      userProfile.learningLanguage !== filterSettings.learningLanguage
    ) {
      setFilterSettings((prev) => ({
        ...prev,
        learningLanguage: userProfile.learningLanguage,
      }));
    }
  }, [userProfile.learningLanguage, filterSettings.learningLanguage]);

  // localStorage에서 선택된 성별과 대학교를 읽어와서 필터 설정에 반영
  useEffect(() => {
    const selectedGender = localStorage.getItem("selectedGender");
    const selectedUniversity = localStorage.getItem("selectedUniversity");

    if (selectedGender) {
      setFilterSettings((prev) => ({
        ...prev,
        gender: selectedGender,
      }));
    }

    if (selectedUniversity) {
      setFilterSettings((prev) => ({
        ...prev,
        university: selectedUniversity,
      }));
    }

    // 저장된 학습언어 불러오기 (프로필 설정 우선, 그 다음 매칭 필터 설정)
    const profileLearningLanguage = localStorage.getItem(
      "currentLearningLanguage"
    );
    const selectedLearningLanguage = localStorage.getItem(
      "selectedLearningLanguageName"
    );

    const learningLanguageToUse =
      profileLearningLanguage || selectedLearningLanguage;

    if (learningLanguageToUse) {
      setFilterSettings((prev) => ({
        ...prev,
        learningLanguage: learningLanguageToUse,
      }));
    }
  }, []);

  // 성별, 대학교, 학습 언어 선택 이벤트 감지
  useEffect(() => {
    const handleGenderSelected = (event) => {
      setFilterSettings((prev) => ({
        ...prev,
        gender: event.detail,
      }));
    };

    const handleUniversitySelected = (event) => {
      setFilterSettings((prev) => ({
        ...prev,
        university: event.detail,
      }));
    };

    const handleLearningLanguageSelected = (event) => {
      const languageName = event.detail;

      // localStorage도 업데이트
      localStorage.setItem("selectedLearningLanguageName", languageName);

      // state 업데이트
      setSelectedLearningLanguageName(languageName);

      setFilterSettings((prev) => ({
        ...prev,
        learningLanguage: languageName,
      }));
    };

    window.addEventListener("genderSelected", handleGenderSelected);
    window.addEventListener("universitySelected", handleUniversitySelected);
    window.addEventListener(
      "learningLanguageSelected",
      handleLearningLanguageSelected
    );

    return () => {
      window.removeEventListener("genderSelected", handleGenderSelected);
      window.removeEventListener(
        "universitySelected",
        handleUniversitySelected
      );
      window.removeEventListener(
        "learningLanguageSelected",
        handleLearningLanguageSelected
      );
    };
  }, []);

  // 사용자 정보 변경 감지하여 프로필 동기화
  useEffect(() => {
    if (user) {
      const { learningLanguage, teachingLanguage } = extractLanguageData(user);

      setUserProfile((prev) => ({
        ...prev,
        learningLanguage,
        teachingLanguage,
      }));

      // 필터도 업데이트
      if (learningLanguage) {
        setFilterSettings((prev) => ({
          ...prev,
          learningLanguage,
        }));
      }
    }
  }, [user]);

  const handleInterestAdd = (interest) => {
    if (
      !userProfile.interests.includes(interest) &&
      userProfile.interests.length < 3
    ) {
      setUserProfile((prev) => ({
        ...prev,
        interests: [...prev.interests, interest],
      }));
    }
  };

  // 매칭 상태 확인 함수 (간단하게 수정)
  const checkMatchingStatus = async () => {
    if (!token) return true;

    try {
      const response = await fetch(API_ENDPOINTS.MATCHING_STATUS, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });

      if (response.ok) {
        const data = await response.json();
        if (data.success) {
          // pending 상태면 새로운 요청 차단
          if (data.status === "pending") {
            return false;
          }
          // matched나 none 상태면 새로운 요청 허용
          return true;
        }
      }
      return true;
    } catch (error) {
      console.error("매칭 상태 확인 중 오류:", error);
      return true;
    }
  };

  const requestMatching = async () => {
    if (
      !filterSettings.gender ||
      !filterSettings.learningLanguage ||
      !filterSettings.university
    ) {
      setModalMessage("성별, 배우고 싶은 언어, 대학교를 모두 선택해주세요.");
      setModalType("warning");
      setShowStatusModal(true);
      return;
    }

    if (
      filterSettings.university === "specific_university" &&
      !filterSettings.specificUniversity.trim()
    ) {
      setModalMessage("대학명을 입력해주세요.");
      setModalType("warning");
      setShowStatusModal(true);
      return;
    }

    // 매칭 상태 확인
    const canRequest = await checkMatchingStatus();
    if (!canRequest) {
      setModalMessage(
        "이미 매칭 신청이 진행 중입니다. 관리자가 승인할 때까지 기다려주세요."
      );
      setModalType("warning");
      setShowStatusModal(true);
      return;
    }

    setIsRequesting(true);
    setCountdown(3);

    try {
      const response = await fetch(API_ENDPOINTS.MATCHING_REQUEST, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          learning_languages: [selectedLearningLanguageName || "한국어"],
          teaching_languages: [
            localStorage.getItem("currentTeachingLanguage") || "English",
          ],
          gender_preference: localStorage.getItem("selectedGender") || "무관",
          university_preference:
            localStorage.getItem("selectedUniversity") || "무관",
        }),
      });

      if (response.ok) {
        // 매칭 신청 성공 시 바로 완료 모달 표시
        setModalMessage(
          "친구찾기 신청이 완료되었습니다! 🎉\n\n관리자가 승인할 때까지 기다려주세요. 승인되면 알림을 받으실 수 있습니다."
        );
        setModalType("success");
        setShowStatusModal(true);
      } else {
        const errorData = await response.json();
        console.error("매칭 신청 실패:", errorData);
        setModalMessage(errorData.message || "매칭 신청에 실패했습니다.");
        setModalType("warning");
        setShowStatusModal(true);
      }
    } catch (error) {
      console.error("매칭 신청 중 오류:", error);
      setModalMessage("매칭 신청 중 오류가 발생했습니다. 다시 시도해주세요.");
      setModalType("warning");
      setShowStatusModal(true);
    } finally {
      setIsRequesting(false);
      setCountdown(3);
    }
  };

  useEffect(() => {
    let timer;
    if (isRequesting && countdown > 0) {
      timer = setTimeout(() => {
        setCountdown(countdown - 1);
      }, 1000);
    } else if (isRequesting && countdown === 0) {
      // 매칭 신청 완료
      setIsPending(true);
      setIsRequesting(false);

      // 더미 계정의 경우 모달 표시
      const userData = localStorage.getItem("user");
      const currentUser =
        userData && userData !== "undefined" && userData !== "null"
          ? JSON.parse(userData)
          : {};
    }
    return () => clearTimeout(timer);
  }, [isRequesting, countdown]);

  const resetMatching = () => {
    setIsPending(false);
    setIsRequesting(false);
    setCountdown(3);
  };

  // 매칭 상태를 저장할 ref
  const previousMatchingStatus = useRef(null);

  // 매칭 상태 확인 함수
  const checkMatchingStatusWithNotification = async () => {
    if (!token) return;

    try {
      const response = await fetch(API_ENDPOINTS.MATCHING_STATUS, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });

      if (response.ok) {
        const data = await response.json();
        if (data.success) {
          const currentStatus = data.status;

          // 이전 상태와 비교하여 매칭 성공 시 알림 추가
          if (
            previousMatchingStatus.current === "pending" &&
            currentStatus === "matched"
          ) {
            // 매칭 성공! 파트너 정보 가져와서 알림 추가
            try {
              const partnerResponse = await fetch(
                API_ENDPOINTS.MATCHING_PARTNER,
                {
                  method: "GET",
                  headers: {
                    Authorization: `Bearer ${token}`,
                    "Content-Type": "application/json",
                  },
                }
              );

              if (partnerResponse.ok) {
                const partnerData = await partnerResponse.json();
                if (partnerData.success && partnerData.partner) {
                  const partner = partnerData.partner;
                  const partnerName =
                    partner.nickname || partner.name || "상대방";

                  // 매칭된 파트너 정보 저장 (변수 제거됨)

                  if (window.addMatchingNotification) {
                    window.addMatchingNotification(partnerName);
                  }
                }
              }
            } catch (error) {
              console.error("파트너 정보 가져오기 실패:", error);
            }
          }

          // 상태 업데이트
          previousMatchingStatus.current = currentStatus;
          setIsPending(currentStatus === "pending");
        }
      }
    } catch (error) {
      console.error("매칭 상태 확인 중 오류:", error);
    }
  };

  // 페이지 로드 시 매칭 상태 확인
  useEffect(() => {
    if (token) {
      checkMatchingStatusWithNotification();
    }
  }, [token]);

  // 주기적으로 매칭 상태 확인 (30초마다)
  useEffect(() => {
    if (!token) return;

    const interval = setInterval(() => {
      checkMatchingStatusWithNotification();
    }, 30000); // 30초마다 체크

    return () => clearInterval(interval);
  }, [token]);

  const handleNavigation = (path) => {
    navigate(path);
  };

  const handleLogout = () => {
    // AuthContext의 logout 함수 사용
    // 이 함수는 이미 ProtectedRoute에서 처리되므로 여기서는 제거
    navigate("/login");
  };

  const handleNotificationClick = () => {
    navigate("/notifications");
  };

  return (
    <MatchingContainer>
      <MatchingHeader>
        <Logo>🎓 UniLingo</Logo>
        <NotificationContainer onClick={handleNotificationClick}>
          <NotificationIcon>
            <FiBell />
          </NotificationIcon>
          {hasNewNotification && <NotificationBadge>!</NotificationBadge>}
        </NotificationContainer>
      </MatchingHeader>

      <MatchingMain>
        {!isProfileLoaded ? (
          <LoadingSpinner>
            <div className="spinner"></div>
            <p>프로필을 불러오는 중...</p>
          </LoadingSpinner>
        ) : (
          <>
            {/* 사용자 프로필 카드 */}
            <UserProfileCard>
              <ProfileHeader>
                <ProfileImage>
                  {userProfile.profileImage ? (
                    <img
                      src={URL.createObjectURL(userProfile.profileImage)}
                      alt="프로필"
                    />
                  ) : (
                    <div className="placeholder">👤</div>
                  )}
                </ProfileImage>
                <ProfileInfo>
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                      marginBottom: "0.5rem",
                    }}
                  ></div>
                  <ProfileDetails>
                    <ProfileName>{userProfile.nickname}</ProfileName>
                    <DetailItem>
                      <span>{t("auth.gender")}:</span>
                      <span>
                        {userProfile.gender === "male"
                          ? t("matching.male")
                          : userProfile.gender === "female"
                          ? t("matching.female")
                          : ""}
                      </span>
                    </DetailItem>
                    <DetailItem>
                      <span>{t("auth.teachingLanguage")}:</span>
                      <span>{userProfile.teachingLanguage}</span>
                    </DetailItem>
                    <DetailItem>
                      <span>{t("auth.school")}:</span>
                      <span>{userProfile.school}</span>
                    </DetailItem>
                  </ProfileDetails>
                </ProfileInfo>
                <MatchingBtn
                  onClick={() => navigate("/profile")}
                  style={{
                    background:
                      "linear-gradient(135deg, #6c757d 0%, #495057 100%)",
                    fontSize: "0.8rem",
                    padding: "0.4rem 0.8rem",
                  }}
                  className="desktop-only"
                >
                  {t("profile.editProfile")}
                </MatchingBtn>
              </ProfileHeader>
              {userProfile.interests.length > 0 && (
                <InterestsList>
                  {normalizeInterests(userProfile.interests).map((interest) => (
                    <ProfileInterestTag key={interest}>
                      {t(`profile.interestsList.${interest}`)}
                    </ProfileInterestTag>
                  ))}
                </InterestsList>
              )}
              <MatchingBtn
                onClick={() => navigate("/profile")}
                style={{
                  background:
                    "linear-gradient(135deg, #6c757d 0%, #495057 100%)",
                  fontSize: "0.9rem",
                  padding: "0.8rem 1.5rem",
                  marginTop: "0.5rem",
                  width: "100%",
                }}
                className="mobile-only"
              >
                {t("profile.editProfile")}
              </MatchingBtn>
            </UserProfileCard>

            {/* 매칭 상대 필터 */}
            <FilterSection>
              <FilterTitle>{t("matching.desiredFriend")}</FilterTitle>
              <FilterForm>
                <FilterGroup>
                  <label>{t("auth.gender")}</label>
                  <LanguageButton onClick={() => navigate("/gender-settings")}>
                    <LanguageDisplay>
                      {filterSettings.gender === "male"
                        ? t("matching.male")
                        : filterSettings.gender === "female"
                        ? t("matching.female")
                        : t("matching.selectGender")}
                    </LanguageDisplay>
                    <ArrowIcon>→</ArrowIcon>
                  </LanguageButton>
                </FilterGroup>
                <FilterGroup>
                  <label>{t("matching.learningLanguage")}</label>
                  <LanguageButton
                    onClick={() => navigate("/learning-language-settings")}
                  >
                    <LanguageDisplay>
                      {selectedLearningLanguageName ||
                        t("matching.selectLanguage")}
                    </LanguageDisplay>
                    <ArrowIcon>→</ArrowIcon>
                  </LanguageButton>
                </FilterGroup>
                <FilterGroup>
                  <label>{t("auth.school")}</label>
                  <LanguageButton
                    onClick={() => navigate("/matching-university-settings")}
                  >
                    <LanguageDisplay>
                      {filterSettings.university === "same_university"
                        ? t("matching.sameUniversity")
                        : filterSettings.university === "specific_university"
                        ? t("matching.specificUniversity")
                        : filterSettings.university === "seoul_area"
                        ? t("matching.seoulArea")
                        : filterSettings.university === "gyeonggi_area"
                        ? t("matching.gyeonggiArea")
                        : filterSettings.university === "incheon_area"
                        ? t("matching.incheonArea")
                        : filterSettings.university === "busan_area"
                        ? t("matching.busanArea")
                        : filterSettings.university === "daegu_area"
                        ? t("matching.daeguArea")
                        : filterSettings.university === "gwangju_area"
                        ? t("matching.gwangjuArea")
                        : filterSettings.university === "daejeon_area"
                        ? t("matching.daejeonArea")
                        : filterSettings.university === "ulsan_area"
                        ? t("matching.ulsanArea")
                        : filterSettings.university === "gangwon_area"
                        ? t("matching.gangwonArea")
                        : filterSettings.university === "chungcheong_area"
                        ? t("matching.chungcheongArea")
                        : filterSettings.university === "jeolla_area"
                        ? t("matching.jeollaArea")
                        : filterSettings.university === "gyeongsang_area"
                        ? t("matching.gyeongsangArea")
                        : filterSettings.university === "jeju_area"
                        ? t("matching.jejuArea")
                        : filterSettings.university === "anywhere"
                        ? t("matching.anywhere")
                        : t("matching.selectUniversity")}
                    </LanguageDisplay>
                    <ArrowIcon>→</ArrowIcon>
                  </LanguageButton>
                </FilterGroup>
                {filterSettings.university === "specific_university" && (
                  <FilterGroup style={{ gridColumn: "1 / -1" }}>
                    <label>{t("matching.enterUniversityName")}</label>
                    <input
                      type="text"
                      name="specificUniversity"
                      value={filterSettings.specificUniversity}
                      onChange={handleFilterChange}
                      placeholder={t("matching.universityNamePlaceholder")}
                      style={{
                        padding: "0.75rem",
                        border: "2px solid #e1e8ed",
                        borderRadius: "8px",
                        background: "rgba(255, 255, 255, 0.9)",
                        color: "#2c3e50",
                        fontSize: "1rem",
                        transition: "all 0.3s ease",
                      }}
                    />
                  </FilterGroup>
                )}
              </FilterForm>
              <ButtonContainer>
                <MatchingBtn
                  onClick={requestMatching}
                  disabled={
                    !filterSettings.gender ||
                    !filterSettings.learningLanguage ||
                    !filterSettings.university
                  }
                  style={{ width: "100%" }}
                >
                  {t("matching.findFriends")} 📝
                </MatchingBtn>

                {/* 디버깅용: 로컬 스토리지 초기화 버튼 */}
              </ButtonContainer>
            </FilterSection>

            {isRequesting && (
              <MatchingAnimation>
                <MatchingContent>
                  <MatchingIcon>📝</MatchingIcon>
                  <h2>{t("matching.requesting")}</h2>
                  <p>{t("matching.sendingRequest")}</p>
                  <Countdown>
                    {countdown > 0 ? countdown : t("matching.requestComplete")}
                  </Countdown>
                  <LoadingDots>
                    <span></span>
                    <span></span>
                    <span></span>
                  </LoadingDots>
                </MatchingContent>
              </MatchingAnimation>
            )}

            {/* 매칭 신청 완료 페이지는 모달로 대체됨 - 이 부분 제거 */}

            {/* 매칭 완료 UI 제거 - 관리자 승인 후 채팅방으로 이동 */}
          </>
        )}
      </MatchingMain>

      {/* 상태 모달 */}
      {showStatusModal && (
        <ModalOverlay onClick={closeModal}>
          <ModalContent onClick={(e) => e.stopPropagation()}>
            <ModalIcon type={modalType}>
              {modalType === "success" && "✅"}
              {modalType === "warning" && "⚠️"}
              {modalType === "error" && "❌"}
              {modalType === "info" && "ℹ️"}
            </ModalIcon>
            <ModalTitle>
              {modalType === "success" && "성공!"}
              {modalType === "warning" && "알림"}
              {modalType === "error" && "오류"}
              {modalType === "info" && "정보"}
            </ModalTitle>
            <ModalMessage>{modalMessage}</ModalMessage>
            <ModalButton type={modalType} onClick={closeModal}>
              확인
            </ModalButton>
          </ModalContent>
        </ModalOverlay>
      )}
      <Sidebar />
      <UnderBar />
    </MatchingContainer>
  );
};

export default Matching;
