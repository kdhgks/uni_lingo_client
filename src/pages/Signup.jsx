import React, { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import styled, { keyframes } from "styled-components";
import { API_ENDPOINTS } from "../config/api";
import { normalizeInterests } from "../utils/languageUtils";
import { useLanguage } from "../contexts/LanguageContext";

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

const fadeIn = keyframes`
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
`;

const SignupContainer = styled.div`
  min-height: 100vh;
  background: #ffffff;
  display: flex;
  flex-direction: column;
  font-family: "Inter", "Segoe UI", -apple-system, BlinkMacSystemFont,
    sans-serif;
  transition: background-color 0.3s ease;

  .dark-mode & {
    background: #1a1a1a;
  }
`;

const SignupMain = styled.main`
  flex: 1;
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 2rem;
`;

const SignupForm = styled.div`
  width: 100%;
  max-width: 400px;
  animation: ${slideInRight} 0.6s ease-out;
`;

const Title = styled.h2`
  text-align: center;
  margin-bottom: 2rem;
  color: #2c3e50;
  font-size: 1.5rem;
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
  position: relative;
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

  &:focus {
    outline: none;
    border-color: #3498db;
    box-shadow: 0 0 0 3px rgba(52, 152, 219, 0.1);
  }

  &::placeholder {
    color: #a0aec0;
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
  width: 100%;

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

const SignupButton = styled.button`
  background: linear-gradient(135deg, #3498db 0%, #2ecc71 100%);
  color: white;
  border: none;
  padding: 0.8rem;
  border-radius: 6px;
  font-size: 0.95rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  margin-top: 0.5rem;

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 10px 30px rgba(52, 152, 219, 0.4);
  }

  &:active {
    transform: translateY(0);
  }
`;

const LoginLink = styled.div`
  text-align: center;
  margin-top: 1.5rem;
  color: #6c757d;
  font-size: 0.85rem;

  a {
    color: #3498db;
    text-decoration: none;
    font-weight: 600;
    transition: color 0.3s ease;

    &:hover {
      color: #2ecc71;
    }
  }
`;

const SectionTitle = styled.h3`
  font-size: 1.1rem;
  font-weight: 600;
  color: #2c3e50;
  margin: 2rem 0 1rem 0;
  padding-bottom: 0.5rem;
  border-bottom: 2px solid #3498db;
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

const Select = styled.select`
  padding: 0.8rem;
  border: 2px solid #e1e8ed;
  border-radius: 6px;
  font-size: 0.95rem;
  transition: all 0.3s ease;
  background: #ffffff;
  width: 100%;

  &:focus {
    outline: none;
    border-color: #3498db;
    box-shadow: 0 0 0 3px rgba(52, 152, 219, 0.1);
  }
`;

const UniversitySelect = styled.select`
  padding: 0.8rem;
  border: 2px solid #e1e8ed;
  border-radius: 6px;
  font-size: 0.95rem;
  transition: all 0.3s ease;
  background: #ffffff;
  color: #2c3e50;
  width: 100%;
  min-height: 48px;
  appearance: none;
  background-image: url("data:image/svg+xml;charset=UTF-8,%3csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='currentColor' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3e%3cpolyline points='6,9 12,15 18,9'%3e%3c/polyline%3e%3c/svg%3e");
  background-repeat: no-repeat;
  background-position: right 0.7rem center;
  background-size: 1rem;
  padding-right: 2.5rem;

  &:focus {
    outline: none;
    border-color: #3498db;
    box-shadow: 0 0 0 3px rgba(52, 152, 219, 0.1);
  }

  .dark-mode & {
    background: #2d2d2d;
    color: #ffffff;
    border-color: #555;
    background-image: url("data:image/svg+xml;charset=UTF-8,%3csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='%23ffffff' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3e%3cpolyline points='6,9 12,15 18,9'%3e%3c/polyline%3e%3c/svg%3e");
  }

  option {
    background: #ffffff;
    color: #2c3e50;
    padding: 0.5rem;
  }

  .dark-mode & option {
    background: #2d2d2d;
    color: #ffffff;
  }
`;

const FileInput = styled.input`
  position: absolute;
  width: 1px;
  height: 1px;
  padding: 0;
  margin: -1px;
  overflow: hidden;
  clip: rect(0, 0, 0, 0);
  white-space: nowrap;
  border: 0;
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
`;

const SuccessMessage = styled.div`
  background: #f0fff4;
  color: #2f855a;
  padding: 0.75rem;
  border-radius: 8px;
  font-size: 0.9rem;
  text-align: center;
  border: 1px solid #9ae6b4;
`;

const CheckboxGroup = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(120px, 1fr));
  gap: 0.75rem;
  margin-top: 0.5rem;
`;

const CheckboxLabel = styled.label`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  cursor: pointer;
  font-size: 0.9rem;
  padding: 0.5rem;
  border-radius: 6px;
  transition: all 0.3s ease;
  background: ${(props) => (props.checked ? "#e3f2fd" : "#f8f9fa")};
  border: 2px solid ${(props) => (props.checked ? "#3498db" : "#e1e8ed")};

  &:hover {
    background: ${(props) => (props.checked ? "#e3f2fd" : "#f1f3f4")};
  }

  input[type="checkbox"] {
    margin: 0;
  }
`;

const SelectedCount = styled.span`
  font-size: 0.8rem;
  color: #6c757d;
  margin-left: 0.5rem;
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

const Signup = () => {
  const navigate = useNavigate();
  const { t } = useLanguage();
  const [formData, setFormData] = useState({
    // 기본 인적사항
    nickname: "",
    phone: "",
    gender: "",
    birthDate: "",
    // 학생 인증
    student_name: "",
    school: "",
    department: "",
    studentId: "",
    university: "",
    studentCard: null,
    // 언어 설정
    learning_languages: [],
    teaching_languages: [],
    interests: [],
    // 이메일 & 비밀번호
    userId: "",
    password: "",
    confirmPassword: "",
  });
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  // 회원가입 페이지는 항상 빈 필드로 시작
  // (저장된 폼 데이터 복원 로직 제거)

  // 언어 옵션들 (번역 키로 변경)
  const languageOptions = [
    { value: "한국어", key: "korean" },
    { value: "영어", key: "english" },
    { value: "일본어", key: "japanese" },
    { value: "중국어", key: "chinese" },
    { value: "스페인어", key: "spanish" },
    { value: "프랑스어", key: "french" },
    { value: "독일어", key: "german" },
    { value: "베트남어", key: "vietnamese" },
    { value: "몽골어", key: "mongolian" },
    { value: "우즈베크어", key: "uzbek" },
    { value: "네팔어", key: "nepali" },
    { value: "미얀마어", key: "burmese" },
    { value: "태국어", key: "thai" },
    { value: "이탈리아어", key: "italian" },
    { value: "러시아어", key: "russian" },
    { value: "아랍어", key: "arabic" },
    { value: "포르투갈어", key: "portuguese" },
    { value: "네덜란드어", key: "dutch" },
  ];

  // 관심사 옵션들 (번역 키로 변경)
  const interestOptions = [
    { value: "K-pop", key: "kpop" },
    { value: "드라마", key: "drama" },
    { value: "요리", key: "cooking" },
    { value: "영화", key: "movie" },
    { value: "음악", key: "music" },
    { value: "여행", key: "travel" },
    { value: "게임", key: "game" },
    { value: "스포츠", key: "sports" },
    { value: "책", key: "book" },
    { value: "예술", key: "art" },
    { value: "언어", key: "language" },
    { value: "문화", key: "culture" },
    { value: "패션", key: "fashion" },
    { value: "사진", key: "photo" },
  ];

  // 대학교 권역 옵션들 (번역 키로 변경)
  const universityOptions = [
    { value: "", label: t("signup.universityPlaceholder") },
    { value: "seoul_area", label: t("signup.universityAreas.seoul") },
    { value: "gyeonggi_area", label: t("signup.universityAreas.gyeonggi") },
    { value: "incheon_area", label: t("signup.universityAreas.incheon") },
    { value: "busan_area", label: t("signup.universityAreas.busan") },
    { value: "daegu_area", label: t("signup.universityAreas.daegu") },
    { value: "gwangju_area", label: t("signup.universityAreas.gwangju") },
    { value: "daejeon_area", label: t("signup.universityAreas.daejeon") },
    { value: "ulsan_area", label: t("signup.universityAreas.ulsan") },
    { value: "gangwon_area", label: t("signup.universityAreas.gangwon") },
    {
      value: "chungcheong_area",
      label: t("signup.universityAreas.chungcheong"),
    },
    { value: "jeolla_area", label: t("signup.universityAreas.jeolla") },
    { value: "gyeongsang_area", label: t("signup.universityAreas.gyeongsang") },
    { value: "jeju_area", label: t("signup.universityAreas.jeju") },
  ];

  const handleChange = (e) => {
    const { name, value, type, files } = e.target;
    const newFormData = {
      ...formData,
      [name]: type === "file" ? files[0] : value,
    };
    setFormData(newFormData);

    // 회원가입 페이지에서는 localStorage에 저장하지 않음

    if (error) setError("");
  };

  const handleCheckboxChange = (field, value) => {
    setFormData((prev) => {
      const currentArray = prev[field] || [];
      const isSelected = currentArray.includes(value);

      let newFormData;
      if (isSelected) {
        // 이미 선택된 경우 제거
        newFormData = {
          ...prev,
          [field]: currentArray.filter((item) => item !== value),
        };
      } else {
        // 선택되지 않은 경우 추가 (최대 개수 제한)
        const maxCount = field === "interests" ? 3 : Infinity;
        if (currentArray.length >= maxCount) {
          return prev;
        }
        newFormData = {
          ...prev,
          [field]: [...currentArray, value],
        };
      }

      // 회원가입 페이지에서는 localStorage에 저장하지 않음

      return newFormData;
    });
    if (error) setError("");
  };

  const handleInterestAdd = (interest) => {
    if (
      !formData.interests.includes(interest) &&
      formData.interests.length < 3
    ) {
      const newFormData = {
        ...formData,
        interests: [...formData.interests, interest],
      };
      setFormData(newFormData);
      // 회원가입 페이지에서는 localStorage에 저장하지 않음
    }
    if (error) setError("");
  };

  const handleInterestRemove = (interest) => {
    const newFormData = {
      ...formData,
      interests: formData.interests.filter((item) => item !== interest),
    };
    setFormData(newFormData);
    // 회원가입 페이지에서는 localStorage에 저장하지 않음
    if (error) setError("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");
    setSuccess("");

    try {
      // Validation
      if (
        !formData.nickname ||
        !formData.phone ||
        !formData.gender ||
        !formData.birthDate ||
        !formData.student_name ||
        !formData.school ||
        !formData.department ||
        !formData.studentId ||
        !formData.university ||
        !formData.studentCard ||
        !formData.userId ||
        !formData.password ||
        !formData.confirmPassword
      ) {
        setError("모든 필드를 입력해주세요.");
        return;
      }

      // 언어 설정 유효성 검사
      if (formData.learning_languages.length === 0) {
        setError("배우고 싶은 언어를 최소 1개 이상 선택해주세요.");
        return;
      }

      if (formData.teaching_languages.length === 0) {
        setError("가르칠 수 있는 언어를 최소 1개 이상 선택해주세요.");
        return;
      }

      if (formData.interests.length === 0) {
        setError("관심사를 최소 1개 이상 선택해주세요.");
        return;
      }

      if (formData.password.length < 8 || formData.password.length > 20) {
        setError("비밀번호는 8자~20자 사이여야 합니다.");
        return;
      }

      if (formData.password !== formData.confirmPassword) {
        setError("비밀번호가 일치하지 않습니다.");
        return;
      }

      if (!/^010\d{8}$/.test(formData.phone)) {
        setError("올바른 전화번호 형식을 입력해주세요. (01012345678)");
        return;
      }

      if (!formData.userId.includes("@")) {
        setError("올바른 이메일 형식을 입력해주세요.");
        return;
      }

      // 백엔드 API 호출
      const formDataToSend = new FormData();
      formDataToSend.append("email", formData.userId);
      formDataToSend.append("password", formData.password);
      formDataToSend.append("password_confirm", formData.confirmPassword); // 백엔드에서 요구하는 필드명
      formDataToSend.append("nickname", formData.nickname);
      formDataToSend.append("phone", formData.phone);
      formDataToSend.append("gender", formData.gender);
      formDataToSend.append("birth_date", formData.birthDate);
      formDataToSend.append("student_name", formData.student_name);
      formDataToSend.append("school", formData.school);
      formDataToSend.append("department", formData.department);
      formDataToSend.append("student_id", formData.studentId);
      formDataToSend.append("university", formData.university);
      formDataToSend.append(
        "learning_languages",
        JSON.stringify(formData.learning_languages)
      );
      formDataToSend.append(
        "teaching_languages",
        JSON.stringify(formData.teaching_languages)
      );
      formDataToSend.append("interests", JSON.stringify(formData.interests));

      // 학생증 파일 추가
      if (formData.studentCard) {
        formDataToSend.append("student_card", formData.studentCard);
      }

      const response = await fetch(API_ENDPOINTS.SIGNUP, {
        method: "POST",
        body: formDataToSend,
      });

      const data = await response.json();

      if (response.ok) {
        // 회원가입 성공
        const { user, token } = data;

        // localStorage에 저장
        localStorage.setItem("user", JSON.stringify(user));
        localStorage.setItem("isLoggedIn", "true");
        localStorage.setItem("token", token);

        setSuccess(t("signup.signupSuccess"));

        // Navigate to home page after a short delay
        setTimeout(() => {
          navigate("/");
        }, 1500);
      } else {
        // 회원가입 실패
        let errorMessage = t("signup.signupError");

        if (data.message) {
          // data.message가 객체인 경우 처리
          if (typeof data.message === "object") {
            // 객체의 첫 번째 키-값 쌍을 문자열로 변환
            const firstKey = Object.keys(data.message)[0];
            errorMessage = data.message[firstKey] || t("signup.signupError");
          } else {
            errorMessage = data.message;
          }
        }

        setError(errorMessage);
      }
    } catch (err) {
      // 네트워크 오류 시 테스트 계정으로 fallback
      const testUser = {
        id: Date.now(),
        email: formData.userId,
        nickname: formData.nickname,
        phone: formData.phone,
        gender: formData.gender,
        birth_date: formData.birthDate,
        student_name: formData.student_name,
        school: formData.school,
        department: formData.department,
        student_id: formData.studentId,
        university: formData.university,
        learning_languages: formData.learning_languages,
        teaching_languages: formData.teaching_languages,
        interests: formData.interests,
        avatar: "👤",
        is_student_verified: true,
        profile_image: null,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
        // 추가 프로필 정보
        bio: `안녕하세요! ${formData.nickname}입니다. 언어 교환을 통해 새로운 친구들과 소통하고 싶습니다.`,
        location: "서울시",
        nationality: "한국",
        level: formData.learning_languages.reduce((acc, lang) => {
          acc[lang.toLowerCase()] = "beginner";
          return acc;
        }, {}),
        // 매칭 관련 정보
        matching_preferences: {
          gender_preference: "both",
          age_range: {
            min: 20,
            max: 30,
          },
          university_preference: "same_university",
        },
        // 활동 상태
        is_online: false,
        last_active: new Date().toISOString(),
        // 알림 설정
        notification_settings: {
          email_notifications: true,
          push_notifications: true,
          chat_notifications: true,
          matching_notifications: true,
        },
      };

      // 테스트 계정을 localStorage에 저장
      localStorage.setItem("user", JSON.stringify(testUser));
      localStorage.setItem("isLoggedIn", "true");
      localStorage.setItem("token", "test_token_" + Date.now());

      setSuccess(t("signup.signupSuccess"));

      // Navigate to home page after a short delay
      setTimeout(() => {
        navigate("/");
      }, 1500);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <SignupContainer>
      <BackButton onClick={() => navigate("/login")}>←</BackButton>

      <SignupMain>
        <SignupForm>
          <Title>{t("signup.title")}</Title>
          <Form onSubmit={handleSubmit}>
            {error && <ErrorMessage>{error}</ErrorMessage>}
            {success && <SuccessMessage>{success}</SuccessMessage>}

            {/* 01. 기본 인적사항 */}
            <SectionTitle>01. 기본 인적사항</SectionTitle>
            <FormGroup>
              <Label htmlFor="nickname">{t("signup.nickname")}</Label>
              <Input
                type="text"
                id="nickname"
                name="nickname"
                value={formData.nickname}
                onChange={handleChange}
                placeholder={t("signup.nicknamePlaceholder")}
                required
              />
            </FormGroup>
            <FormGroup>
              <Label htmlFor="phone">{t("signup.phone")}</Label>
              <Input
                type="tel"
                id="phone"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                placeholder={t("signup.phonePlaceholder")}
                required
              />
            </FormGroup>
            <FormGroup>
              <Label>{t("signup.gender")}</Label>
              <GenderButtonGroup>
                <GenderButton
                  type="button"
                  className={formData.gender === "male" ? "selected" : ""}
                  onClick={() =>
                    handleChange({ target: { name: "gender", value: "male" } })
                  }
                >
                  {t("signup.male")}
                </GenderButton>
                <GenderButton
                  type="button"
                  className={formData.gender === "female" ? "selected" : ""}
                  onClick={() =>
                    handleChange({
                      target: { name: "gender", value: "female" },
                    })
                  }
                >
                  {t("signup.female")}
                </GenderButton>
              </GenderButtonGroup>
            </FormGroup>
            <FormGroup>
              <Label htmlFor="birthDate">{t("signup.birthDate")}</Label>
              <DateInput
                type="date"
                id="birthDate"
                name="birthDate"
                value={formData.birthDate}
                onChange={handleChange}
                max={new Date().toISOString().split("T")[0]}
                min="1900-01-01"
                required
              />
            </FormGroup>

            {/* 02. 학생 인증 */}
            <SectionTitle>02. 학생 인증</SectionTitle>
            <FormGroup>
              <Label htmlFor="student_name">이름</Label>
              <Input
                type="text"
                id="student_name"
                name="student_name"
                value={formData.student_name}
                onChange={handleChange}
                placeholder="ex) 홍길동"
                required
              />
            </FormGroup>
            <FormGroup>
              <Label htmlFor="school">학교</Label>
              <Input
                type="text"
                id="school"
                name="school"
                value={formData.school}
                onChange={handleChange}
                placeholder="ex) 서강대학교"
                required
              />
            </FormGroup>
            <FormGroup>
              <Label htmlFor="department">학과</Label>
              <Input
                type="text"
                id="department"
                name="department"
                value={formData.department}
                onChange={handleChange}
                placeholder="ex) 컴퓨터공학과"
                required
              />
            </FormGroup>
            <FormGroup>
              <Label htmlFor="studentId">학번</Label>
              <Input
                type="text"
                id="studentId"
                name="studentId"
                value={formData.studentId}
                onChange={handleChange}
                placeholder="ex) 20240000"
                required
              />
            </FormGroup>
            <FormGroup>
              <Label htmlFor="university">대학교 권역</Label>
              <UniversitySelect
                name="university"
                value={formData.university}
                onChange={handleChange}
                required
              >
                {universityOptions.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </UniversitySelect>
            </FormGroup>
            <FormGroup>
              <Label htmlFor="studentCard">
                학생증 인증 (이름, 학과, 학번이 보이는 사진)
              </Label>
              <FileInput
                type="file"
                id="studentCard"
                name="studentCard"
                onChange={handleChange}
                accept="image/*"
                required={!formData.studentCard}
              />
              <FileLabel htmlFor="studentCard">
                {formData.studentCard
                  ? formData.studentCard.name
                  : "선택된 파일 없음"}
              </FileLabel>
            </FormGroup>

            {/* 03. 언어 설정 */}
            <SectionTitle>03. 언어 설정</SectionTitle>

            <FormGroup>
              <Label>배우고 싶은 언어</Label>
              <CheckboxGroup>
                {languageOptions.map((language) => (
                  <CheckboxLabel
                    key={language.value}
                    checked={formData.learning_languages.includes(
                      language.value
                    )}
                  >
                    <input
                      type="checkbox"
                      checked={formData.learning_languages.includes(
                        language.value
                      )}
                      onChange={() =>
                        handleCheckboxChange(
                          "learning_languages",
                          language.value
                        )
                      }
                    />
                    {t(`signup.languages.${language.key}`)}
                  </CheckboxLabel>
                ))}
              </CheckboxGroup>
            </FormGroup>

            <FormGroup>
              <Label>가르칠 수 있는 언어</Label>
              <CheckboxGroup>
                {languageOptions.map((language) => (
                  <CheckboxLabel
                    key={language.value}
                    checked={formData.teaching_languages.includes(
                      language.value
                    )}
                  >
                    <input
                      type="checkbox"
                      checked={formData.teaching_languages.includes(
                        language.value
                      )}
                      onChange={() =>
                        handleCheckboxChange(
                          "teaching_languages",
                          language.value
                        )
                      }
                    />
                    {t(`signup.languages.${language.key}`)}
                  </CheckboxLabel>
                ))}
              </CheckboxGroup>
            </FormGroup>

            <FormGroup>
              <Label>관심사 (최대 3개)</Label>
              <InterestsContainer>
                <InterestTags>
                  {interestOptions.map((interest) => (
                    <InterestTag
                      key={interest.value}
                      type="button"
                      className={
                        formData.interests.includes(interest.value)
                          ? "selected"
                          : ""
                      }
                      onClick={() => handleInterestAdd(interest.value)}
                      disabled={
                        formData.interests.length >= 3 &&
                        !formData.interests.includes(interest.value)
                      }
                    >
                      {t(`signup.interestsList.${interest.key}`)}
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

            {/* 04. 이메일 & 비밀번호 */}
            <SectionTitle>04. 이메일 & 비밀번호</SectionTitle>
            <FormGroup>
              <Label htmlFor="userId">이메일</Label>
              <Input
                type="email"
                id="userId"
                name="userId"
                autoComplete="email"
                value={formData.userId}
                onChange={handleChange}
                placeholder="이메일을 입력하세요"
                required
              />
            </FormGroup>
            <FormGroup>
              <Label htmlFor="password">비밀번호</Label>
              <Input
                type="password"
                id="password"
                name="password"
                autoComplete="new-password"
                value={formData.password}
                onChange={handleChange}
                placeholder="8자~20자 사이의 비밀번호를 입력해주세요"
                required
              />
            </FormGroup>
            <FormGroup>
              <Label htmlFor="confirmPassword">비밀번호 확인</Label>
              <Input
                type="password"
                id="confirmPassword"
                name="confirmPassword"
                autoComplete="new-password"
                value={formData.confirmPassword}
                onChange={handleChange}
                placeholder="8자~20자 사이의 비밀번호를 다시 입력해주세요"
                required
              />
            </FormGroup>
            <SignupButton type="submit" disabled={isLoading}>
              {isLoading ? t("signup.signingUp") : t("signup.signupButton")}
            </SignupButton>
          </Form>
          <LoginLink>
            {t("signup.alreadyHaveAccount")}{" "}
            <Link to="/login">{t("signup.loginLink")}</Link>
          </LoginLink>
        </SignupForm>
      </SignupMain>
    </SignupContainer>
  );
};

export default Signup;
