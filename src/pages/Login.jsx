import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import styled, { keyframes } from "styled-components";
import { useLanguage } from "../contexts/LanguageContext";
import { useAuth } from "../contexts/AuthContext";
import { API_ENDPOINTS } from "../config/api";

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

const LoginContainer = styled.div`
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

const LoginMain = styled.main`
  flex: 1;
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 2rem;
`;

const LoginForm = styled.div`
  width: 100%;
  max-width: 400px;
  animation: ${slideInLeft} 0.6s ease-out;
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

const LoginButton = styled.button`
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

const SignupLink = styled.div`
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

const ErrorMessage = styled.div`
  background: #fee;
  color: #c53030;
  padding: 0.75rem;
  border-radius: 8px;
  font-size: 0.9rem;
  text-align: center;
  border: 1px solid #feb2b2;
`;

const InfoMessage = styled.div`
  background: #f0f9ff;
  color: #0369a1;
  padding: 0.75rem;
  border-radius: 8px;
  font-size: 0.85rem;
  text-align: center;
  border: 1px solid #bae6fd;
  margin-bottom: 1rem;
`;

const Login = () => {
  const navigate = useNavigate();
  const { t } = useLanguage();
  const { login } = useAuth();
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    // Clear error when user starts typing
    if (error) setError("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    try {
      // 입력 검증
      if (!formData.email || !formData.password) {
        setError(t("auth.loginError"));
        return;
      }

      // 이메일 형식 검증
      if (!formData.email.includes("@")) {
        setError(t("auth.emailFormatError"));
        return;
      }

      if (formData.password.length < 6) {
        setError(t("auth.passwordLengthError"));
        return;
      }

      // 테스트 계정 우선 처리 (백엔드 연결 실패 시 fallback)
      if (
        formData.email === "test@example.com" &&
        formData.password === "test123456"
      ) {
        const testUser = {
          id: 1,
          email: "test@example.com",
          nickname: "테스트유저",
          phone: "01012345678",
          gender: "male",
          birth_date: "1995-06-15",
          student_name: "홍길동",
          school: "서강대학교",
          department: "컴퓨터공학과",
          student_id: "20240001",
          university: "seoul_area",
          learning_languages: ["영어", "일본어", "중국어"],
          teaching_languages: ["한국어", "영어"],
          interests: ["K-pop", "드라마", "여행"],
          avatar: "👤",
          is_student_verified: true,
          profile_image: null,
          created_at: "2024-01-01T00:00:00.000Z",
          updated_at: "2024-01-01T00:00:00.000Z",
          // 추가 프로필 정보
          bio: "안녕하세요! 언어 교환을 통해 새로운 친구들과 소통하고 싶습니다. K-pop과 드라마를 좋아해요!",
          location: "서울시 서대문구",
          nationality: "한국",
          level: {
            english: "intermediate",
            japanese: "beginner",
            chinese: "beginner",
          },
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

        const testToken = "test_token_" + Date.now();

        // localStorage에 테스트 계정 저장
        localStorage.setItem("user", JSON.stringify(testUser));
        localStorage.setItem("isLoggedIn", "true");
        localStorage.setItem("token", testToken);

        // AuthContext를 통해 로그인 처리
        login(testUser, testToken);

        console.log("테스트 계정으로 로그인 성공:", testUser);

        // Navigate to home page
        navigate("/");
      } else {
        // 백엔드 API 호출
        const response = await fetch(API_ENDPOINTS.LOGIN, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            email: formData.email,
            password: formData.password,
          }),
        });

        const data = await response.json();

        if (response.ok) {
          // 로그인 성공
          const { user, token } = data;

          // localStorage에 저장
          localStorage.setItem("user", JSON.stringify(user));
          localStorage.setItem("isLoggedIn", "true");
          localStorage.setItem("token", token);

          // AuthContext를 통해 로그인 처리
          login(user, token);

          console.log("백엔드 로그인 성공:", user);

          // Navigate to home page
          navigate("/");
        } else {
          // 로그인 실패
          setError(data.message || t("auth.loginError"));
        }
      }
    } catch (err) {
      console.error("로그인 오류:", err);

      // 네트워크 오류 시 안내 메시지
      if (err.name === "TypeError" && err.message.includes("fetch")) {
        setError("서버에 연결할 수 없습니다. 인터넷 연결을 확인해주세요.");
      } else {
        setError(t("auth.loginError"));
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <LoginContainer>
      <LoginMain>
        <LoginForm>
          <Title>{t("auth.login")}</Title>
          <Form onSubmit={handleSubmit}>
            <InfoMessage>
              <strong>테스트 계정:</strong>
              <br />
              이메일: test@example.com
              <br />
              비밀번호: test123456
            </InfoMessage>
            {error && <ErrorMessage>{error}</ErrorMessage>}
            <FormGroup>
              <Label htmlFor="email">{t("auth.email")}</Label>
              <Input
                type="email"
                id="email"
                name="email"
                autoComplete="email"
                value={formData.email}
                onChange={handleChange}
                placeholder={t("auth.emailPlaceholder")}
                required
              />
            </FormGroup>
            <FormGroup>
              <Label htmlFor="password">{t("auth.password")}</Label>
              <Input
                type="password"
                id="password"
                name="password"
                autoComplete="current-password"
                value={formData.password}
                onChange={handleChange}
                placeholder={t("auth.passwordPlaceholder")}
                required
              />
            </FormGroup>
            <LoginButton type="submit" disabled={isLoading}>
              {isLoading ? t("common.loading") : t("auth.login")}
            </LoginButton>
          </Form>
          <SignupLink>
            {t("auth.noAccount")} <Link to="/signup">{t("auth.signup")}</Link>
          </SignupLink>
        </LoginForm>
      </LoginMain>
    </LoginContainer>
  );
};

export default Login;
