import React, { useState, useEffect, useCallback } from "react";
import { useNavigate, useParams } from "react-router-dom";
import styled, { keyframes } from "styled-components";
import {
  extractLanguageData,
  normalizeInterests,
} from "../utils/languageUtils";
import UnderBar from "../components/UnderBar";
import Sidebar from "../components/Sidebar";
import { useLanguage } from "../contexts/LanguageContext";
import { API_ENDPOINTS } from "../config/api";

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

const fadeIn = keyframes`
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
`;

const ProfileContainer = styled.div`
  min-height: 100vh;
  background: #ffffff;
  display: flex;
  flex-direction: column;
  font-family: "Inter", "Segoe UI", -apple-system, BlinkMacSystemFont,
    sans-serif;
  padding-left: 0;
  transition: background-color 0.3s ease;

  /* 모바일에서 언더바 공간 확보 */
  @media (max-width: 768px) {
    padding-bottom: 80px;
  }

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

const ProfileHeader = styled.header`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  background: rgba(255, 255, 255, 0.95);
  backdrop-filter: blur(20px);
  border-bottom: 1px solid rgba(52, 152, 219, 0.2);
  z-index: 100;
  padding: 1rem 2rem;
  display: flex;
  align-items: center;
  justify-content: space-between;
  transition: all 0.3s ease;

  @media (max-width: 768px) {
    padding: 1rem;
  }

  .dark-mode & {
    background: rgba(45, 45, 45, 0.95);
    border-bottom: 1px solid rgba(52, 152, 219, 0.4);
  }
`;

const Logo = styled.div`
  font-size: 1.5rem;
  font-weight: 700;
  background: linear-gradient(135deg, #3498db 0%, #2ecc71 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
`;

const NotificationContainer = styled.div`
  position: relative;
  cursor: pointer;
  padding: 0.5rem;
  border-radius: 50%;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  justify-content: center;

  &:hover {
    background: rgba(52, 152, 219, 0.1);
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

const ProfileMain = styled.main`
  flex: 1;
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 1rem 2rem;
  padding-top: 5rem; /* 헤더 높이만큼 상단 패딩 추가 */

  @media (max-width: 768px) {
    padding: 0.5rem 1.5rem;
    padding-top: 1rem;
  }
`;

const ProfileForm = styled.div`
  width: 100%;
  max-width: 500px;
  animation: ${slideInLeft} 0.6s ease-out;
`;

const Title = styled.h2`
  text-align: center;
  margin-bottom: 1rem;
  color: #2c3e50;
  font-size: 1.8rem;
  font-weight: 600;
  transition: color 0.3s ease;

  .dark-mode & {
    color: #ffffff;
  }
`;

const Form = styled.form`
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
`;

const FormGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
`;

const Label = styled.label`
  color: #2c3e50;
  font-weight: 600;
  font-size: 0.9rem;
  transition: color 0.3s ease;

  .dark-mode & {
    color: #ffffff;
  }
`;

const Input = styled.input`
  padding: 0.8rem;
  border: 2px solid #e1e8ed;
  border-radius: 6px;
  font-size: 1rem;
  transition: all 0.3s ease;
  background: #ffffff;
  color: #2c3e50;

  &:focus {
    outline: none;
    border-color: #3498db;
    box-shadow: 0 0 0 3px rgba(52, 152, 219, 0.1);
  }

  &::placeholder {
    color: #a0aec0;
  }

  &:disabled {
    background: #f8f9fa;
    color: #6c757d;
    border-color: #dee2e6;
    cursor: not-allowed;
    opacity: 0.7;
  }

  .dark-mode & {
    background: #2d2d2d;
    color: #ffffff;
    border-color: #555;

    &:focus {
      border-color: #3498db;
      box-shadow: 0 0 0 3px rgba(52, 152, 219, 0.3);
    }

    &::placeholder {
      color: #888;
    }

    &:disabled {
      background: #1a1a1a;
      color: #6c757d;
      border-color: #444;
      cursor: not-allowed;
      opacity: 0.7;
    }
  }
`;

const DateInput = styled.input`
  padding: 0.8rem;
  border: 2px solid #e1e8ed;
  border-radius: 6px;
  font-size: 1rem;
  transition: all 0.3s ease;
  background: #ffffff;
  color: #2c3e50;
  cursor: pointer;
  min-height: 48px;

  &:focus {
    outline: none;
    border-color: #3498db;
    box-shadow: 0 0 0 3px rgba(52, 152, 219, 0.1);
  }

  &:hover {
    border-color: #3498db;
    background: rgba(52, 152, 219, 0.02);
  }

  .dark-mode & {
    background: #2d2d2d;
    color: #ffffff;
    border-color: #555;

    &:focus {
      border-color: #3498db;
      box-shadow: 0 0 0 3px rgba(52, 152, 219, 0.3);
    }

    &:hover {
      border-color: #5dade2;
      background: rgba(93, 173, 226, 0.05);
    }
  }

  &:disabled {
    background: #f8f9fa;
    color: #6c757d;
    cursor: not-allowed;
    opacity: 0.6;

    .dark-mode & {
      background: #3d3d3d;
      color: #888;
    }
  }

  /* 모바일에서 날짜 선택기 스타일 개선 */
  @media (max-width: 768px) {
    font-size: 1rem; /* 모바일에서 더 큰 폰트 */
    padding: 0.9rem;
    min-height: 52px;
  }

  /* WebKit 브라우저에서 날짜 input 스타일 커스터마이징 */
  &::-webkit-calendar-picker-indicator {
    cursor: pointer;
    border-radius: 4px;
    margin-right: 2px;
    opacity: 0.6;
    transition: opacity 0.3s ease;

    &:hover {
      opacity: 1;
    }
  }

  /* Firefox에서 날짜 input 스타일 */
  &::-moz-calendar-picker-indicator {
    cursor: pointer;
    border-radius: 4px;
    margin-right: 2px;
    opacity: 0.6;
    transition: opacity 0.3s ease;

    &:hover {
      opacity: 1;
    }
  }
`;

const Select = styled.select`
  padding: 0.8rem;
  border: 2px solid #e1e8ed;
  border-radius: 6px;
  font-size: 0.95rem;
  transition: all 0.3s ease;
  background: #ffffff;
  color: #2c3e50;

  &:focus {
    outline: none;
    border-color: #3498db;
    box-shadow: 0 0 0 3px rgba(52, 152, 219, 0.1);
  }

  .dark-mode & {
    background: #2d2d2d;
    color: #ffffff;
    border-color: #555;

    &:focus {
      border-color: #3498db;
      box-shadow: 0 0 0 3px rgba(52, 152, 219, 0.3);
    }
  }
`;

const LanguageButton = styled.button`
  padding: 0.8rem;
  border: 2px solid #e1e8ed;
  border-radius: 6px;
  font-size: 0.95rem;
  transition: all 0.3s ease;
  background: #ffffff;
  color: #2c3e50;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: space-between;
  text-align: left;
  min-height: 48px;

  &:hover {
    border-color: #3498db;
    background: rgba(52, 152, 219, 0.05);
    transform: translateY(-1px);
    box-shadow: 0 2px 8px rgba(52, 152, 219, 0.2);
  }

  &:focus {
    outline: none;
    border-color: #3498db;
    box-shadow: 0 0 0 3px rgba(52, 152, 219, 0.1);
  }

  .dark-mode & {
    background: #2d2d2d;
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

const GenderButtonGroup = styled.div`
  display: flex;
  gap: 1rem;
`;

const GenderButton = styled.button`
  padding: 0.6rem 1.2rem;
  border: 1px solid rgba(52, 152, 219, 0.3);
  border-radius: 20px;
  background: rgba(52, 152, 219, 0.1);
  color: #3498db;
  cursor: pointer;
  transition: all 0.3s ease;
  font-size: 0.9rem;
  min-width: 80px;

  &.selected {
    background: linear-gradient(135deg, #3498db 0%, #2ecc71 100%);
    border-color: #3498db;
    color: white;
    box-shadow: 0 4px 15px rgba(52, 152, 219, 0.4);
  }

  .dark-mode & {
    background: rgba(93, 173, 226, 0.1);
    border-color: rgba(93, 173, 226, 0.3);
    color: #5dade2;

    &.selected {
      background: linear-gradient(135deg, #5dade2 0%, #58d68d 100%);
      border-color: #5dade2;
      color: white;
      box-shadow: 0 4px 15px rgba(93, 173, 226, 0.4);
    }
  }
`;

const SectionTitle = styled.h3`
  font-size: 1.1rem;
  font-weight: 600;
  color: #2c3e50;
  margin: 2rem 0 0.3rem 0;
  padding-bottom: 0.5rem;
  position: relative;
  transition: color 0.3s ease;

  &::after {
    content: "";
    position: absolute;
    bottom: 0;
    left: 0;
    width: 100%;
    height: 2px;
    background: linear-gradient(90deg, #3498db 0%, #2ecc71 100%);
    border-radius: 1px;
  }

  .dark-mode & {
    color: #ffffff;

    &::after {
      background: linear-gradient(90deg, #5dade2 0%, #58d68d 100%);
    }
  }
`;

const FormRow = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 1rem;

  @media (max-width: 768px) {
    grid-template-columns: 1fr;
    gap: 1.7rem;
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

  &:hover:not(:disabled) {
    background: rgba(52, 152, 219, 0.2);
    transform: translateY(-2px);
    box-shadow: 0 4px 15px rgba(52, 152, 219, 0.3);
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

  .dark-mode & {
    background: rgba(52, 152, 219, 0.2);
    border-color: rgba(52, 152, 219, 0.5);

    &:hover:not(:disabled) {
      background: rgba(52, 152, 219, 0.3);
    }
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

const SaveButton = styled.button`
  background: linear-gradient(135deg, #3498db 0%, #2ecc71 100%);
  color: white;
  border: none;
  padding: 1.2rem 2rem;
  border-radius: 8px;
  font-size: 1.1rem;
  font-weight: 700;
  cursor: pointer;
  transition: all 0.3s ease;
  margin-top: 0.6rem;
  margin-bottom: 0.4rem;
  width: 100%;
  min-height: 56px;
  box-shadow: 0 4px 15px rgba(52, 152, 219, 0.3);

  &:hover:not(:disabled) {
    transform: translateY(-3px);
    box-shadow: 0 8px 25px rgba(52, 152, 219, 0.5);
  }

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
    transform: none;
  }

  &:active {
    transform: translateY(-1px);
  }

  @media (max-width: 768px) {
    padding: 1.4rem 2rem;
    font-size: 1.2rem;
    min-height: 60px;
    margin-top: 0.8rem;
    margin-bottom: 0.6rem;
  }
`;

const BackButton = styled.button`
  position: fixed;
  top: 1.5rem;
  left: 1.5rem;
  background: none;
  border: none;
  font-size: 1.2rem;
  cursor: pointer;
  color: #6c757d;
  padding: 0.3rem;
  z-index: 1000;
`;

const ErrorMessage = styled.div`
  background: #fee;
  color: #c53030;
  padding: 0.75rem;
  border-radius: 8px;
  font-size: 0.9rem;
  text-align: center;
  border: 1px solid #feb2b2;
  transition: all 0.3s ease;

  .dark-mode & {
    background: #4a1a1a;
    color: #ff6b6b;
    border-color: #8b0000;
  }
`;

const SuccessMessage = styled.div`
  background: #f0fff4;
  color: #2f855a;
  padding: 0.75rem;
  border-radius: 8px;
  font-size: 0.9rem;
  text-align: center;
  border: 1px solid #9ae6b4;
  transition: all 0.3s ease;

  .dark-mode & {
    background: #1a4a1a;
    color: #68d391;
    border-color: #2d5a2d;
  }
`;

const FileInput = styled.input`
  display: none;
`;

const FileLabel = styled.label`
  display: block;
  padding: 0.8rem;
  border: 2px dashed #e1e8ed;
  border-radius: 6px;
  text-align: center;
  cursor: pointer;
  transition: all 0.3s ease;
  font-size: 0.9rem;
  color: #6c757d;

  &:hover {
    border-color: #3498db;
    background: rgba(52, 152, 219, 0.05);
  }

  .dark-mode & {
    border-color: #555;
    color: #b0b0b0;

    &:hover {
      border-color: #3498db;
      background: rgba(52, 152, 219, 0.1);
    }
  }
`;

const SchoolChangeWarning = styled.div`
  background: #fff3cd;
  color: #856404;
  padding: 0.75rem;
  border-radius: 8px;
  font-size: 0.9rem;
  text-align: center;
  border: 1px solid #ffeaa7;
  margin-bottom: 1rem;
  transition: all 0.3s ease;

  .dark-mode & {
    background: #4a3a1a;
    color: #ffd93d;
    border-color: #8b6914;
  }
`;

const ReverifySection = styled.div`
  background: #f8f9fa;
  border: 2px solid #e9ecef;
  border-radius: 8px;
  padding: 1rem;
  margin-top: 1rem;
  transition: all 0.3s ease;

  .dark-mode & {
    background: #2d2d2d;
    border-color: #555;
  }
`;

const ProfileImageSection = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 1rem;
  margin-bottom: 1rem;
`;

const ProfileImagePreview = styled.div`
  width: 120px;
  height: 120px;
  border-radius: 50%;
  border: 3px solid #e1e8ed;
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

const ProfileImageLabel = styled.label`
  display: block;
  padding: 0.8rem 1.5rem;
  border: 2px dashed #e1e8ed;
  border-radius: 6px;
  text-align: center;
  cursor: pointer;
  transition: all 0.3s ease;
  font-size: 0.9rem;
  color: #6c757d;
  background: #f8f9fa;

  &:hover {
    border-color: #3498db;
    background: rgba(52, 152, 219, 0.05);
    color: #3498db;
  }
`;

const Profile = () => {
  const navigate = useNavigate();
  const { id } = useParams(); // URL에서 사용자 ID 가져오기
  const { t, translations, language } = useLanguage();

  // 인증 상태 확인 - 토큰이나 사용자 정보가 없으면 로그인 페이지로 리다이렉트
  useEffect(() => {
    const token = localStorage.getItem("token");
    const user = localStorage.getItem("user");

    if (!token || !user) {
      navigate("/login");
      return;
    }
  }, [navigate]);

  const [formData, setFormData] = useState({
    // 기본 인적사항
    nickname: "",
    profileImage: null,
    phone: "",
    gender: "",
    birthDate: "",
    // 학생 인증
    studentName: "",
    school: "",
    department: "",
    studentId: "",
    // 언어 설정
    learningLanguage: "English",
    teachingLanguage: "한국어",
    interests: [],
    // 계정 정보 (제거됨)
  });
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isDataLoading, setIsDataLoading] = useState(true);
  const [isViewMode, setIsViewMode] = useState(false); // 다른 사용자 프로필 보기 모드

  const [hasNewNotification, setHasNewNotification] = useState(
    window.globalHasNewNotification || false
  );

  // 사용 가능한 관심사 목록
  const availableInterests = [
    "K-pop",
    "드라마",
    "요리",
    "영화",
    "음악",
    "여행",
    "게임",
    "스포츠",
    "책",
    "예술",
    "언어",
    "문화",
    "패션",
    "사진",
  ];

  // 프로필 데이터 로드
  // 백엔드에서 최신 사용자 데이터 로드
  const loadUserProfile = useCallback(async () => {
    try {
      setIsDataLoading(true);

      // URL 파라미터가 있으면 다른 사용자 프로필 보기 모드
      if (id) {
        setIsViewMode(true);
      }

      const response = await fetch(
        id ? `${API_ENDPOINTS.PROFILE}${id}/` : API_ENDPOINTS.PROFILE,
        {
          method: "GET",
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );

      if (response.ok) {
        const userData = await response.json();

        const {
          learningLanguage: parsedLearning,
          teachingLanguage: parsedTeaching,
        } = extractLanguageData(userData);
        let learningLanguage = parsedLearning;
        let teachingLanguage = parsedTeaching;

        // 언어 코드를 언어 이름으로 변환
        if (learningLanguage) {
          const learningLangObj = languages.find(
            (lang) =>
              lang.code === learningLanguage || lang.name === learningLanguage
          );
          if (learningLangObj) {
            learningLanguage = learningLangObj.name;
          }
        }

        if (teachingLanguage) {
          const teachingLangObj = languages.find(
            (lang) =>
              lang.code === teachingLanguage || lang.name === teachingLanguage
          );
          if (teachingLangObj) {
            teachingLanguage = teachingLangObj.name;
          }
        }

        // 언어 정보가 없으면 기본값 설정
        if (!learningLanguage || learningLanguage === "")
          learningLanguage = "English";
        if (!teachingLanguage || teachingLanguage === "")
          teachingLanguage = "한국어";

        // 기본값을 로컬에서만 설정 (백엔드 업데이트는 사용자가 명시적으로 저장할 때만)
        // 백엔드 API가 아직 완전히 구현되지 않았을 수 있으므로 임시로 비활성화
        console.log("Setting default languages locally:", {
          learningLanguage,
          teachingLanguage,
        });

        const normalizedInterests = normalizeInterests(userData.interests);

        setFormData((prevFormData) => {
          return {
            nickname: userData.nickname || "",
            phone: userData.phone || "",
            gender: userData.gender || "",
            birthDate: userData.birth_date || userData.birthDate || "",
            profileImage: userData.profile_image || userData.profileImage || "",
            studentName: userData.student_name || userData.studentName || "",
            school: userData.school || "",
            department: userData.department || "",
            studentId: userData.student_id || userData.studentId || "",
            university: userData.university || "",
            // 언어 정보는 현재 formData에 있으면 그것을 우선으로 사용
            learningLanguage: prevFormData.learningLanguage || learningLanguage,
            teachingLanguage: prevFormData.teachingLanguage || teachingLanguage,
            interests: normalizedInterests,
          };
        });

        // 현재 선택된 언어를 로컬 스토리지에 저장
        localStorage.setItem("currentLearningLanguage", learningLanguage);
        localStorage.setItem("currentTeachingLanguage", teachingLanguage);
      } else {
      }
    } catch (error) {
    } finally {
      setIsDataLoading(false);
    }
  }, [id, navigate]);

  // 사용자 프로필 로드
  useEffect(() => {
    // 로그인 상태 확인
    const isLoggedIn = localStorage.getItem("isLoggedIn");
    if (!isLoggedIn) {
      navigate("/login");
      return;
    }

    loadUserProfile();
    loadUnreadMessageCount(); // 안읽은 메시지 수 로드
  }, [id, navigate, loadUserProfile]);

  // 안읽은 메시지 수 로드 함수
  const loadUnreadMessageCount = async () => {
    const token = localStorage.getItem("token");
    if (!token) return;

    try {
      // 백엔드 API 호출
      const response = await fetch(API_ENDPOINTS.CHAT_ROOMS, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });

      if (response.ok) {
        const data = await response.json();
        const totalUnreadCount =
          data.rooms?.reduce((total, room) => {
            return total + (room.unread_count || 0);
          }, 0) || 0;

        // 전역 변수에 설정하여 언더바에서 사용
        window.globalTotalUnreadCount = totalUnreadCount;
      }
    } catch (error) {
      // 백엔드 연결 실패 시 테스트 데이터 사용
      try {
        const savedUser = localStorage.getItem("user");
        if (savedUser) {
          // 테스트용 안읽은 메시지 수 (랜덤)
          const testUnreadCount = Math.floor(Math.random() * 5); // 0-4개
          window.globalTotalUnreadCount = testUnreadCount;
        } else {
          window.globalTotalUnreadCount = 0;
        }
      } catch (testError) {
        window.globalTotalUnreadCount = 0;
      }
    }
  };

  // 언어 선택 이벤트 처리
  useEffect(() => {
    const handleTeachingLanguageSelected = (event) => {
      const languageName = event.detail;
      setFormData((prev) => {
        const newData = {
          ...prev,
          teachingLanguage: languageName,
        };
        return newData;
      });
    };

    const handleProfileLearningLanguageSelected = (event) => {
      const languageName = event.detail;
      setFormData((prev) => {
        const newData = {
          ...prev,
          learningLanguage: languageName,
        };
        return newData;
      });
    };

    window.addEventListener(
      "teachingLanguageSelected",
      handleTeachingLanguageSelected
    );
    window.addEventListener(
      "profileLearningLanguageSelected",
      handleProfileLearningLanguageSelected
    );

    return () => {
      window.removeEventListener(
        "teachingLanguageSelected",
        handleTeachingLanguageSelected
      );
      window.removeEventListener(
        "profileLearningLanguageSelected",
        handleProfileLearningLanguageSelected
      );
    };
  }, []);

  // localStorage에서 언어 변경 감지
  useEffect(() => {
    const checkLanguageChanges = () => {
      const currentLearningLanguage = localStorage.getItem(
        "currentLearningLanguage"
      );
      const currentTeachingLanguage = localStorage.getItem(
        "currentTeachingLanguage"
      );

      if (
        currentLearningLanguage &&
        currentLearningLanguage !== formData.learningLanguage
      ) {
        setFormData((prev) => ({
          ...prev,
          learningLanguage: currentLearningLanguage,
        }));
      }

      if (
        currentTeachingLanguage &&
        currentTeachingLanguage !== formData.teachingLanguage
      ) {
        setFormData((prev) => ({
          ...prev,
          teachingLanguage: currentTeachingLanguage,
        }));
      }
    };

    // 페이지 포커스 시 localStorage 확인
    const handleFocus = () => {
      checkLanguageChanges();
    };

    window.addEventListener("focus", handleFocus);

    // 컴포넌트 마운트 시에도 확인
    checkLanguageChanges();

    return () => {
      window.removeEventListener("focus", handleFocus);
    };
  }, [formData.learningLanguage, formData.teachingLanguage]);

  // 번역이 로드되지 않았으면 로딩 표시
  if (!translations || Object.keys(translations).length === 0) {
    return (
      <ProfileContainer>
        <ProfileMain>
          <ProfileForm>
            <Title>로딩 중...</Title>
          </ProfileForm>
        </ProfileMain>
      </ProfileContainer>
    );
  }

  const handleChange = (e) => {
    const { name, value, type, files } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "file" ? files[0] : value,
    }));

    // Clear error when user starts typing
    if (error) setError("");
  };

  // 폼 유효성 검사 함수
  const isFormValid = () => {
    return (
      formData.nickname &&
      formData.phone &&
      formData.gender &&
      formData.birthDate &&
      formData.studentName &&
      formData.school &&
      formData.department &&
      formData.studentId &&
      formData.university &&
      formData.learningLanguage &&
      formData.teachingLanguage &&
      formData.interests.length > 0
    );
  };

  const handleInterestAdd = (interest) => {
    if (
      !formData.interests.includes(interest) &&
      formData.interests.length < 3
    ) {
      setFormData((prev) => ({
        ...prev,
        interests: [...prev.interests, interest],
      }));
    }
  };

  const handleInterestRemove = (interest) => {
    setFormData((prev) => ({
      ...prev,
      interests: prev.interests.filter((item) => item !== interest),
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");
    setSuccess("");

    try {
      // Validation (계정 정보 필드 제외)
      if (!isFormValid()) {
        setError("모든 필수 필드를 입력해주세요.");
        return;
      }

      if (!/^010\d{8}$/.test(formData.phone)) {
        setError(t("profile.phoneFormatError"));
        return;
      }

      // 백엔드 API로 프로필 업데이트
      const formDataToSend = new FormData();
      formDataToSend.append("nickname", formData.nickname);
      formDataToSend.append("phone", formData.phone);
      formDataToSend.append("gender", formData.gender);
      formDataToSend.append("birth_date", formData.birthDate);
      formDataToSend.append("student_name", formData.studentName);
      formDataToSend.append("school", formData.school);
      formDataToSend.append("department", formData.department);
      formDataToSend.append("student_id", formData.studentId);
      formDataToSend.append("university", formData.university);
      // 프로필 이미지 처리
      if (formData.profileImage) {
        if (typeof formData.profileImage === "string") {
          // 문자열인 경우 (이모지나 URL) - 무시
        } else {
          // 파일 객체인 경우
          formDataToSend.append("profile_image", formData.profileImage);
        }
      }

      formDataToSend.append(
        "teaching_languages",
        JSON.stringify([formData.teachingLanguage])
      );
      formDataToSend.append(
        "learning_languages",
        JSON.stringify([formData.learningLanguage])
      );
      formDataToSend.append("interests", JSON.stringify(formData.interests));

      // 디버깅: 전송할 언어 정보 확인

      const response = await fetch(API_ENDPOINTS.PROFILE, {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: formDataToSend,
      });

      let data;
      try {
        data = await response.json();
      } catch (err) {
        setError("서버 응답을 처리하는 중 오류가 발생했습니다.");
        return;
      }

      // 에러 상세 정보 로깅
      if (!response.ok) {
      }

      if (response.ok && data.success) {
        // 백엔드에서 받은 업데이트된 사용자 정보를 localStorage에 저장
        if (data.user) {
          localStorage.setItem("user", JSON.stringify(data.user));
          window.dispatchEvent(new Event("storage"));
        }

        // 프로필 저장 성공 후 최신 데이터 다시 로드
        await loadUserProfile();

        setSuccess(t("profile.profileUpdateSuccess"));

        // 성공 메시지를 보기 위해 페이지 상단으로 스크롤
        window.scrollTo({ top: 0, behavior: "smooth" });

        // 홈으로 이동하지 않고 프로필 페이지에 머물기
        // setTimeout(() => {
        //   navigate("/");
        // }, 1500);
      } else {
        setError(data.message || t("profile.profileUpdateError"));
      }
    } catch (err) {
      setError(t("profile.profileUpdateError"));
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <ProfileContainer>
      <ProfileMain>
        <ProfileForm>
          <Title>
            {isViewMode ? t("profile.viewTitle") : t("profile.title")}
          </Title>
          <Form onSubmit={handleSubmit}>
            {error && <ErrorMessage>{error}</ErrorMessage>}
            {success && <SuccessMessage>{success}</SuccessMessage>}

            {/* 01. 기본 인적사항 */}
            <SectionTitle>{t("profile.basicInfo")}</SectionTitle>

            {/* 프로필 사진 */}
            <ProfileImageSection>
              <Label>{t("profile.profileImage")}</Label>
              <ProfileImagePreview>
                {formData.profileImage ? (
                  typeof formData.profileImage === "string" ? (
                    // 이모지나 URL인 경우
                    formData.profileImage.startsWith("http") ? (
                      <img
                        src={formData.profileImage}
                        alt={t("profile.profileImagePreview")}
                      />
                    ) : (
                      <div className="placeholder">{formData.profileImage}</div>
                    )
                  ) : (
                    // 파일 객체인 경우
                    <img
                      src={URL.createObjectURL(formData.profileImage)}
                      alt={t("profile.profileImagePreview")}
                    />
                  )
                ) : (
                  <div className="placeholder">📷</div>
                )}
              </ProfileImagePreview>
              <FileInput
                type="file"
                id="profileImage"
                name="profileImage"
                onChange={handleChange}
                accept="image/*"
              />
              <ProfileImageLabel htmlFor="profileImage">
                {formData.profileImage
                  ? t("profile.profileImageChange")
                  : t("profile.profileImageSelect")}
              </ProfileImageLabel>
            </ProfileImageSection>

            <FormGroup>
              <Label htmlFor="nickname">{t("profile.nickname")}</Label>
              <Input
                type="text"
                id="nickname"
                name="nickname"
                value={formData.nickname}
                onChange={handleChange}
                placeholder="ex) 홍길동"
                required
              />
            </FormGroup>
            <FormGroup>
              <Label htmlFor="phone">{t("profile.phoneNumber")}</Label>
              <Input
                type="tel"
                id="phone"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                placeholder="번호만 입력해주세요 ex) 01012345678"
                required
              />
            </FormGroup>
            <FormGroup>
              <Label>{t("profile.gender")}</Label>
              <GenderButtonGroup>
                <GenderButton
                  type="button"
                  className={formData.gender === "male" ? "selected" : ""}
                  onClick={() =>
                    handleChange({ target: { name: "gender", value: "male" } })
                  }
                  disabled={isDataLoading || isViewMode}
                >
                  {t("profile.male")}
                </GenderButton>
                <GenderButton
                  type="button"
                  className={formData.gender === "female" ? "selected" : ""}
                  onClick={() =>
                    handleChange({
                      target: { name: "gender", value: "female" },
                    })
                  }
                  disabled={isDataLoading || isViewMode}
                >
                  {t("profile.female")}
                </GenderButton>
              </GenderButtonGroup>
            </FormGroup>
            <FormGroup>
              <Label htmlFor="birthDate">{t("profile.birthDate")}</Label>
              <DateInput
                type="date"
                id="birthDate"
                name="birthDate"
                value={formData.birthDate}
                onChange={handleChange}
                max={new Date().toISOString().split("T")[0]}
                min="1900-01-01"
                required
                disabled={isDataLoading || isViewMode}
              />
            </FormGroup>

            {/* 02. 학생 인증 */}
            <SectionTitle>{t("profile.studentInfo")}</SectionTitle>
            <FormGroup>
              <Label htmlFor="studentName">{t("profile.name")}</Label>
              <Input
                type="text"
                id="studentName"
                name="studentName"
                value={formData.studentName}
                onChange={handleChange}
                placeholder="ex) 홍길동"
                required
                disabled={true}
              />
            </FormGroup>
            <FormGroup>
              <Label htmlFor="school">{t("profile.school")}</Label>
              <Input
                type="text"
                id="school"
                name="school"
                value={formData.school}
                onChange={handleChange}
                placeholder={t("profile.schoolPlaceholder")}
                required
                disabled={true}
              />
            </FormGroup>
            <FormGroup>
              <Label htmlFor="department">{t("profile.department")}</Label>
              <Input
                type="text"
                id="department"
                name="department"
                value={formData.department}
                onChange={handleChange}
                placeholder={t("profile.departmentPlaceholder")}
                required
                disabled={true}
              />
            </FormGroup>
            <FormGroup>
              <Label htmlFor="studentId">{t("profile.studentId")}</Label>
              <Input
                type="text"
                id="studentId"
                name="studentId"
                value={formData.studentId}
                onChange={handleChange}
                placeholder="ex) 20240000"
                required
                disabled={true}
              />
            </FormGroup>

            {/* 03. 언어 설정 */}
            <SectionTitle>{t("profile.languageSettings")}</SectionTitle>
            <FormGroup>
              <Label htmlFor="learningLanguage">
                {t("profile.learningLanguage")}
              </Label>
              <LanguageButton
                onClick={() => navigate("/profile-learning-language-settings")}
                disabled={isDataLoading || isViewMode}
              >
                <LanguageDisplay>
                  {formData.learningLanguage || "선택하세요"}
                </LanguageDisplay>
                <ArrowIcon>→</ArrowIcon>
              </LanguageButton>
            </FormGroup>
            <FormGroup>
              <Label htmlFor="teachingLanguage">
                {t("profile.teachingLanguage")}
              </Label>
              <LanguageButton
                onClick={() => navigate("/teaching-language-settings")}
                disabled={isDataLoading || isViewMode}
              >
                <LanguageDisplay>
                  {formData.teachingLanguage || "선택하세요"}
                </LanguageDisplay>
                <ArrowIcon>→</ArrowIcon>
              </LanguageButton>
            </FormGroup>
            <FormGroup>
              <Label>{t("profile.interests")}</Label>
              <InterestsContainer>
                <InterestTags>
                  {availableInterests.map((interest) => (
                    <InterestTag
                      key={interest}
                      type="button"
                      className={
                        formData.interests.includes(interest) ? "selected" : ""
                      }
                      onClick={() => handleInterestAdd(interest)}
                      disabled={
                        formData.interests.length >= 3 &&
                        !formData.interests.includes(interest)
                      }
                    >
                      {t(`profile.interestsList.${interest}`)}
                    </InterestTag>
                  ))}
                </InterestTags>
                <SelectedInterests>
                  {normalizeInterests(formData.interests).map((interest) => (
                    <SelectedInterest key={interest}>
                      {t(`profile.interestsList.${interest}`)}
                      <button
                        type="button"
                        onClick={() => handleInterestRemove(interest)}
                      >
                        ×
                      </button>
                    </SelectedInterest>
                  ))}
                </SelectedInterests>
              </InterestsContainer>
            </FormGroup>

            {/* 04. 계정 정보 - 비밀번호 변경 기능 제거됨 */}

            {!isViewMode && (
              <SaveButton
                type="submit"
                disabled={isLoading || isDataLoading || !isFormValid()}
              >
                {isLoading
                  ? t("profile.saving")
                  : isDataLoading
                  ? t("common.loading")
                  : t("profile.saveProfile")}
              </SaveButton>
            )}
          </Form>
        </ProfileForm>
      </ProfileMain>
      <Sidebar />
      <UnderBar />
    </ProfileContainer>
  );
};

export default Profile;
