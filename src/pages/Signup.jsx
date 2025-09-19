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
  font-size: 0.95rem;
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
  font-size: 0.95rem;
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

const RadioGroup = styled.div`
  display: flex;
  gap: 1rem;
`;

const RadioLabel = styled.label`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  cursor: pointer;
  font-size: 0.9rem;

  input[type="radio"] {
    margin: 0;
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

  // 컴포넌트 마운트 시 저장된 폼 데이터 복원
  useEffect(() => {
    const savedFormData = localStorage.getItem("signupFormData");
    if (savedFormData) {
      try {
        const parsedData = JSON.parse(savedFormData);
        setFormData(parsedData);
      } catch (error) {
        console.error("저장된 폼 데이터 파싱 실패:", error);
      }
    }
  }, []);

  // 언어 옵션들
  const languageOptions = [
    "한국어",
    "영어",
    "일본어",
    "중국어",
    "스페인어",
    "프랑스어",
    "독일어",
    "베트남어",
    "몽골어",
    "우즈베크어",
    "네팔어",
    "미얀마어",
    "태국어",
    "이탈리아어",
    "러시아어",
    "아랍어",
    "포르투갈어",
    "네덜란드어",
  ];

  // 관심사 옵션들
  const interestOptions = [
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

  // 대학교 권역 옵션들
  const universityOptions = [
    { value: "", label: "대학교 권역을 선택하세요" },
    { value: "seoul_area", label: "서울권" },
    { value: "gyeonggi_area", label: "경기권" },
    { value: "incheon_area", label: "인천권" },
    { value: "busan_area", label: "부산권" },
    { value: "daegu_area", label: "대구권" },
    { value: "gwangju_area", label: "광주권" },
    { value: "daejeon_area", label: "대전권" },
    { value: "ulsan_area", label: "울산권" },
    { value: "gangwon_area", label: "강원권" },
    { value: "chungcheong_area", label: "충청권" },
    { value: "jeolla_area", label: "전라권" },
    { value: "gyeongsang_area", label: "경상권" },
    { value: "jeju_area", label: "제주권" },
  ];

  const handleChange = (e) => {
    const { name, value, type, files } = e.target;
    const newFormData = {
      ...formData,
      [name]: type === "file" ? files[0] : value,
    };
    setFormData(newFormData);

    // localStorage에 저장 (파일은 제외)
    const dataToSave = { ...newFormData };
    if (type === "file") {
      dataToSave.studentCard = null; // 파일 객체는 저장하지 않음
    }
    localStorage.setItem("signupFormData", JSON.stringify(dataToSave));

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

      // localStorage에 저장
      localStorage.setItem("signupFormData", JSON.stringify(newFormData));

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
      localStorage.setItem("signupFormData", JSON.stringify(newFormData));
    }
    if (error) setError("");
  };

  const handleInterestRemove = (interest) => {
    const newFormData = {
      ...formData,
      interests: formData.interests.filter((item) => item !== interest),
    };
    setFormData(newFormData);
    localStorage.setItem("signupFormData", JSON.stringify(newFormData));
    if (error) setError("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");
    setSuccess("");

    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000));

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

      // 백엔드 API로 회원가입 요청
      const formDataToSend = new FormData();
      formDataToSend.append("email", formData.userId);
      formDataToSend.append("password", formData.password);
      formDataToSend.append("password_confirm", formData.confirmPassword);
      formDataToSend.append("nickname", formData.nickname);
      formDataToSend.append("phone", formData.phone);
      formDataToSend.append("gender", formData.gender);
      formDataToSend.append("birth_date", formData.birthDate);
      formDataToSend.append("student_name", formData.student_name);
      formDataToSend.append("school", formData.school);
      formDataToSend.append("department", formData.department);
      formDataToSend.append("student_id", formData.studentId);
      formDataToSend.append("university", formData.university);
      formDataToSend.append("student_card", formData.studentCard);

      // 언어 설정 데이터 추가
      formDataToSend.append(
        "learning_languages",
        JSON.stringify(formData.learning_languages)
      );
      formDataToSend.append(
        "teaching_languages",
        JSON.stringify(formData.teaching_languages)
      );
      formDataToSend.append("interests", JSON.stringify(formData.interests));

      console.log("회원가입 요청 데이터:", {
        email: formData.userId,
        nickname: formData.nickname,
        university: formData.university,
        learning_languages: formData.learning_languages,
        teaching_languages: formData.teaching_languages,
        interests: formData.interests,
      });

      const response = await fetch(API_ENDPOINTS.SIGNUP, {
        method: "POST",
        body: formDataToSend,
      });

      const data = await response.json();
      console.log("회원가입 응답:", data);

      if (response.ok && data.success) {
        // 백엔드에서 받은 사용자 정보를 localStorage에 저장
        localStorage.setItem("user", JSON.stringify(data.user));
        localStorage.setItem("isLoggedIn", "true");
        localStorage.setItem("token", data.token);

        // 회원가입 성공 시 임시 데이터 정리
        localStorage.removeItem("selectedUniversity");

        setSuccess("회원가입이 완료되었습니다! 로그인 중...");

        // Navigate to home page after a short delay
        setTimeout(() => {
          navigate("/");
        }, 1500);
      } else {
        const errorMessage =
          typeof data.message === "string"
            ? data.message
            : data.message?.detail || "회원가입 중 오류가 발생했습니다.";
        setError(errorMessage);
      }
    } catch (err) {
      setError("회원가입 중 오류가 발생했습니다. 다시 시도해주세요.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <SignupContainer>
      <BackButton onClick={() => navigate("/login")}>← 이전</BackButton>

      <SignupMain>
        <SignupForm>
          <Title>회원가입</Title>
          <Form onSubmit={handleSubmit}>
            {error && <ErrorMessage>{error}</ErrorMessage>}
            {success && <SuccessMessage>{success}</SuccessMessage>}

            {/* 01. 기본 인적사항 */}
            <SectionTitle>01. 기본 인적사항</SectionTitle>
            <FormGroup>
              <Label htmlFor="nickname">닉네임</Label>
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
              <Label htmlFor="phone">전화번호</Label>
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
              <Label>성별</Label>
              <RadioGroup>
                <RadioLabel>
                  <input
                    type="radio"
                    name="gender"
                    value="male"
                    checked={formData.gender === "male"}
                    onChange={handleChange}
                    required
                  />
                  남자
                </RadioLabel>
                <RadioLabel>
                  <input
                    type="radio"
                    name="gender"
                    value="female"
                    checked={formData.gender === "female"}
                    onChange={handleChange}
                    required
                  />
                  여자
                </RadioLabel>
              </RadioGroup>
            </FormGroup>
            <FormGroup>
              <Label htmlFor="birthDate">생년월일</Label>
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
                    key={language}
                    checked={formData.learning_languages.includes(language)}
                  >
                    <input
                      type="checkbox"
                      checked={formData.learning_languages.includes(language)}
                      onChange={() =>
                        handleCheckboxChange("learning_languages", language)
                      }
                    />
                    {language}
                  </CheckboxLabel>
                ))}
              </CheckboxGroup>
            </FormGroup>

            <FormGroup>
              <Label>가르칠 수 있는 언어</Label>
              <CheckboxGroup>
                {languageOptions.map((language) => (
                  <CheckboxLabel
                    key={language}
                    checked={formData.teaching_languages.includes(language)}
                  >
                    <input
                      type="checkbox"
                      checked={formData.teaching_languages.includes(language)}
                      onChange={() =>
                        handleCheckboxChange("teaching_languages", language)
                      }
                    />
                    {language}
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
              {isLoading ? "회원가입 중..." : "회원가입"}
            </SignupButton>
          </Form>
          <LoginLink>
            이미 계정이 있으신가요? <Link to="/login">로그인</Link>
          </LoginLink>
        </SignupForm>
      </SignupMain>
    </SignupContainer>
  );
};

export default Signup;
