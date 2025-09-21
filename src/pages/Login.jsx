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

        // Navigate to home page
        navigate("/");
      } else {
        // 로그인 실패
        setError(data.message || t("auth.loginError"));
      }
    } catch (err) {
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
