import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import styled, { keyframes } from "styled-components";
import UnderBar from "../components/UnderBar";
import Sidebar from "../components/Sidebar";
import { useLanguage } from "../contexts/LanguageContext";
import { API_ENDPOINTS } from "../config/api";

// Keyframes
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

// Styled Components
const SettingsContainer = styled.div`
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
  padding: 2rem;

  @media (max-width: 768px) {
    padding: 1rem;
  }
`;

const Section = styled.section`
  background: rgba(255, 255, 255, 0.95);
  backdrop-filter: blur(20px);
  border-radius: 16px;
  padding: 2rem;
  margin-bottom: 2rem;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
  border: 1px solid rgba(255, 255, 255, 0.2);
  animation: ${slideInUp} 0.6s ease-out;
  transition: all 0.3s ease;

  @media (max-width: 768px) {
    padding: 1.5rem;
    margin-bottom: 1.5rem;
  }

  .dark-mode & {
    background: rgba(45, 45, 45, 0.95);
    border: 1px solid rgba(64, 64, 64, 0.3);
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.3);
  }
`;

const SectionTitle = styled.h2`
  margin: 0 0 1.5rem 0;
  font-size: 1.4rem;
  font-weight: 600;
  color: #2c3e50;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  transition: color 0.3s ease;

  &::before {
    content: "";
    width: 4px;
    height: 24px;
    background: linear-gradient(135deg, #3498db 0%, #2ecc71 100%);
    border-radius: 2px;
  }

  .dark-mode & {
    color: #ffffff;
  }
`;

const SettingItem = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1rem 0;
  border-bottom: 1px solid rgba(52, 152, 219, 0.1);

  @media (max-width: 768px) {
    display: flex !important;
    flex-direction: row !important;
    align-items: center !important;
    justify-content: space-between !important;
    gap: 0.5rem;
  }

  &:last-child {
    border-bottom: none;
  }
`;

const SettingInfo = styled.div`
  flex: 1;
  min-width: 0;

  @media (max-width: 768px) {
    flex: 1;
    min-width: 0;
  }
`;

const SettingLabel = styled.div`
  font-weight: 600;
  color: #2c3e50;
  font-size: 1rem;
  margin-bottom: 0.25rem;
  transition: color 0.3s ease;

  .dark-mode & {
    color: #ffffff;
  }
`;

const SettingDescription = styled.div`
  color: #6c757d;
  font-size: 0.9rem;
  transition: color 0.3s ease;

  .dark-mode & {
    color: #b0b0b0;
  }
`;

const ToggleSwitch = styled.label`
  position: relative;
  display: inline-block;
  width: 50px;
  height: 24px;
  cursor: pointer;
`;

const ToggleInput = styled.input`
  opacity: 0;
  width: 0;
  height: 0;

  &:checked + span {
    background-color: #3498db;
  }

  &:checked + span:before {
    transform: translateX(26px);
  }
`;

const ToggleSlider = styled.span`
  position: absolute;
  cursor: pointer;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: #ccc;
  transition: 0.3s;
  border-radius: 24px;

  &:before {
    position: absolute;
    content: "";
    height: 18px;
    width: 18px;
    left: 3px;
    bottom: 3px;
    background-color: white;
    transition: 0.3s;
    border-radius: 50%;
  }
`;

const LanguageSettingButton = styled.button`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0.75rem 1rem;
  border: 2px solid #e1e8ed;
  border-radius: 8px;
  background: #ffffff;
  cursor: pointer;
  transition: all 0.3s ease;
  width: auto;
  min-width: 140px;
  max-width: 200px;
  min-height: 50px;
  flex-shrink: 0;

  @media (max-width: 768px) {
    display: flex !important;
    flex-direction: row !important;
    align-items: center !important;
    justify-content: space-between !important;
    padding: 0.5rem 0.75rem;
    min-height: 45px;
    min-width: 120px;
    max-width: 180px;
  }

  &:hover {
    border-color: #3498db;
    background: rgba(52, 152, 219, 0.05);
    transform: translateY(-1px);
    box-shadow: 0 4px 15px rgba(52, 152, 219, 0.2);
  }

  .dark-mode & {
    background: #2d2d2d;
    border-color: #555;
    color: #ffffff;

    &:hover {
      border-color: #5dade2;
      background: rgba(93, 173, 226, 0.1);
    }
  }
`;

const LanguageName = styled.span`
  font-size: 0.9rem;
  font-weight: 500;
  color: #2c3e50;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;

  @media (max-width: 768px) {
    font-size: 0.85rem;
  }

  .dark-mode & {
    color: #ffffff;
  }
`;

const ArrowIcon = styled.span`
  font-size: 1.2rem;
  color: #6c757d;
  transition: all 0.3s ease;

  .dark-mode & {
    color: #b0b0b0;
  }
`;

// 회원정보 관리 관련 styled components
const AccountSection = styled.section`
  background: rgba(255, 255, 255, 0.95);
  backdrop-filter: blur(20px);
  border-radius: 16px;
  padding: 2rem;
  margin-bottom: 2rem;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
  border: 1px solid rgba(255, 255, 255, 0.2);
  animation: ${slideInUp} 0.6s ease-out;
  transition: all 0.3s ease;

  @media (max-width: 768px) {
    padding: 1.5rem;
    margin-bottom: 4rem;
  }

  .dark-mode & {
    background: rgba(45, 45, 45, 0.95);
    border: 1px solid rgba(64, 64, 64, 0.3);
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.3);
  }
`;

const AccountTitle = styled.h3`
  font-size: 1.4rem;
  font-weight: 600;
  color: #2c3e50;
  margin: 0 0 1.5rem 0;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  transition: color 0.3s ease;

  &::before {
    content: "";
    width: 4px;
    height: 24px;
    background: linear-gradient(135deg, #3498db 0%, #2ecc71 100%);
    border-radius: 2px;
  }

  .dark-mode & {
    color: #ffffff;
  }
`;

const AccountItem = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1rem 0;
  border-bottom: 1px solid rgba(52, 152, 219, 0.1);

  &:last-child {
    border-bottom: none;
  }
`;

const AccountInfo = styled.div`
  flex: 1;
`;

const AccountLabel = styled.div`
  font-weight: 600;
  color: #2c3e50;
  font-size: 1rem;
  margin-bottom: 0.25rem;
  transition: color 0.3s ease;

  .dark-mode & {
    color: #ffffff;
  }
`;

const AccountDescription = styled.div`
  color: #6c757d;
  font-size: 0.9rem;
  transition: color 0.3s ease;

  .dark-mode & {
    color: #b0b0b0;
  }
`;

const AccountButton = styled.button`
  background: linear-gradient(135deg, #3498db 0%, #2ecc71 100%);
  color: white;
  border: none;
  padding: 0.6rem 1.2rem;
  border-radius: 8px;
  font-size: 0.85rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  min-width: 60px;

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 4px 15px rgba(52, 152, 219, 0.3);
  }
`;

const DangerButton = styled.button`
  background: #ff6b6b;
  color: white;
  border: none;
  padding: 0.6rem 1.2rem;
  border-radius: 8px;
  font-size: 0.85rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  min-width: 60px;

  &:hover {
    background: #e74c3c;
    transform: translateY(-2px);
    box-shadow: 0 4px 15px rgba(255, 107, 107, 0.3);
  }
`;

const LogoutButton = styled.button`
  background: #6c757d;
  color: white;
  border: none;
  padding: 0.6rem 1.2rem;
  border-radius: 8px;
  font-size: 0.85rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  min-width: 60px;

  &:hover {
    background: #5a6268;
    transform: translateY(-2px);
    box-shadow: 0 4px 15px rgba(108, 117, 125, 0.3);
  }
`;

const Modal = styled.div`
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
`;

const ModalContent = styled.div`
  background: white;
  padding: 2rem;
  border-radius: 16px;
  max-width: 500px;
  width: 90%;
  max-height: 90vh;
  overflow-y: auto;
  box-shadow: 0 20px 40px rgba(0, 0, 0, 0.2);
`;

const ModalTitle = styled.h3`
  color: #2c3e50;
  font-size: 1.4rem;
  font-weight: 600;
  margin: 0 0 1.5rem 0;
  text-align: center;
`;

const Form = styled.form`
  display: flex;
  flex-direction: column;
  gap: 1rem;
`;

const FormGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
`;

const Label = styled.label`
  font-weight: 600;
  color: #2c3e50;
  font-size: 0.9rem;
`;

const Input = styled.input`
  padding: 0.8rem;
  border: 2px solid #e1e8ed;
  border-radius: 8px;
  font-size: 0.95rem;
  transition: all 0.3s ease;

  &:focus {
    outline: none;
    border-color: #3498db;
    box-shadow: 0 0 0 3px rgba(52, 152, 219, 0.1);
  }
`;

const ButtonGroup = styled.div`
  display: flex;
  gap: 1rem;
  justify-content: center;
  margin-top: 1.5rem;
`;

const CancelButton = styled.button`
  background: #6c757d;
  color: white;
  border: none;
  padding: 0.8rem 1.5rem;
  border-radius: 8px;
  font-size: 0.9rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;

  &:hover {
    background: #5a6268;
  }
`;

const SubmitButton = styled.button`
  background: linear-gradient(135deg, #3498db 0%, #2ecc71 100%);
  color: white;
  border: none;
  padding: 0.8rem 1.5rem;
  border-radius: 8px;
  font-size: 0.9rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;

  &:hover:not(:disabled) {
    transform: translateY(-2px);
    box-shadow: 0 4px 15px rgba(52, 152, 219, 0.3);
  }

  &:disabled {
    background: #ccc;
    cursor: not-allowed;
  }
`;

const DangerSubmitButton = styled.button`
  background: #ff6b6b;
  color: white;
  border: none;
  padding: 0.8rem 1.5rem;
  border-radius: 8px;
  font-size: 0.9rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;

  &:hover:not(:disabled) {
    background: #e74c3c;
    transform: translateY(-2px);
    box-shadow: 0 4px 15px rgba(255, 107, 107, 0.3);
  }

  &:disabled {
    background: #ccc;
    cursor: not-allowed;
  }
`;

const ErrorMessage = styled.div`
  background: #ffebee;
  color: #c62828;
  padding: 0.8rem;
  border-radius: 8px;
  font-size: 0.9rem;
  margin-bottom: 1rem;
  border-left: 4px solid #f44336;
`;

const SuccessMessage = styled.div`
  background: #e8f5e8;
  color: #2e7d32;
  padding: 0.8rem;
  border-radius: 8px;
  font-size: 0.9rem;
  margin-bottom: 1rem;
  border-left: 4px solid #4caf50;
`;

const WarningText = styled.p`
  color: #e74c3c;
  font-size: 0.9rem;
  margin: 0 0 1.5rem 0;
  line-height: 1.5;
  text-align: center;
`;

const Settings = () => {
  const navigate = useNavigate();
  const { language, changeLanguage, t } = useLanguage();
  const [isDarkMode, setIsDarkMode] = useState(false);

  // 회원정보 관리 관련 상태
  const [showPasswordChange, setShowPasswordChange] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [passwordData, setPasswordData] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });
  const [deletePassword, setDeletePassword] = useState("");
  const [isChangingPassword, setIsChangingPassword] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  useEffect(() => {
    // 로컬 스토리지에서 설정 불러오기
    const savedDarkMode = localStorage.getItem("darkMode") === "true";
    setIsDarkMode(savedDarkMode);

    // 다크 모드 적용
    if (savedDarkMode) {
      document.body.classList.add("dark-mode");
    } else {
      document.body.classList.remove("dark-mode");
    }
  }, []);

  const handleDarkModeToggle = () => {
    const newDarkMode = !isDarkMode;
    setIsDarkMode(newDarkMode);
    localStorage.setItem("darkMode", newDarkMode.toString());

    if (newDarkMode) {
      document.body.classList.add("dark-mode");
    } else {
      document.body.classList.remove("dark-mode");
    }
  };

  const handleLanguageChange = (newLanguage) => {
    changeLanguage(newLanguage);
  };

  // 비밀번호 변경 함수
  const handlePasswordChange = async (e) => {
    e.preventDefault();
    setIsChangingPassword(true);
    setError("");
    setSuccess("");

    // 비밀번호 확인 검증
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      setError(t("settings.passwordMismatch"));
      setIsChangingPassword(false);
      return;
    }

    // 비밀번호 길이 검증
    if (passwordData.newPassword.length < 8) {
      setError(t("settings.passwordTooShort"));
      setIsChangingPassword(false);
      return;
    }

    try {
      const response = await fetch(API_ENDPOINTS.CHANGE_PASSWORD, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: JSON.stringify({
          current_password: passwordData.currentPassword,
          new_password: passwordData.newPassword,
        }),
      });

      const data = await response.json();

      if (response.ok && data.success) {
        setSuccess(t("settings.passwordChangeSuccess"));
        setPasswordData({
          currentPassword: "",
          newPassword: "",
          confirmPassword: "",
        });
        setTimeout(() => {
          setShowPasswordChange(false);
          setSuccess("");
        }, 2000);
      } else {
        setError(data.message || t("settings.passwordChangeError"));
      }
    } catch (error) {
      console.error("비밀번호 변경 오류:", error);
      setError(t("settings.passwordChangeError"));
    } finally {
      setIsChangingPassword(false);
    }
  };

  // 회원탈퇴 함수
  const handleDeleteAccount = async () => {
    setIsDeleting(true);
    setError("");

    try {
      const response = await fetch(API_ENDPOINTS.DELETE_USER, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          password: deletePassword,
        }),
      });

      let data;
      try {
        data = await response.json();
      } catch (err) {
        console.error("JSON 파싱 오류:", err);
        setError("서버 응답을 처리하는 중 오류가 발생했습니다.");
        return;
      }

      if (response.ok && data.success) {
        // 로컬 스토리지 정리
        localStorage.removeItem("user");
        localStorage.removeItem("isLoggedIn");
        localStorage.removeItem("token");

        setSuccess(t("settings.accountDeleteSuccess"));
        setTimeout(() => {
          navigate("/");
        }, 1500);
      } else {
        setError(data.message || t("settings.accountDeleteError"));
      }
    } catch (err) {
      setError(t("settings.accountDeleteError"));
    } finally {
      setIsDeleting(false);
    }
  };

  // 로그아웃 함수
  const handleLogout = () => {
    // 로컬 스토리지에서 사용자 정보 제거
    localStorage.removeItem("user");
    localStorage.removeItem("isLoggedIn");
    localStorage.removeItem("token");
    localStorage.removeItem("selectedGender");
    localStorage.removeItem("selectedUniversity");

    // 로그인 페이지로 이동
    navigate("/login");
  };

  // 모달 닫기 함수들
  const closePasswordModal = () => {
    setShowPasswordChange(false);
    setPasswordData({
      currentPassword: "",
      newPassword: "",
      confirmPassword: "",
    });
    setError("");
    setSuccess("");
  };

  const closeDeleteModal = () => {
    setShowDeleteConfirm(false);
    setDeletePassword("");
    setError("");
  };

  return (
    <SettingsContainer>
      <Main>
        <Section>
          <SectionTitle>{t("settings.displaySettings")}</SectionTitle>

          <SettingItem>
            <SettingInfo>
              <SettingLabel>{t("settings.darkMode")}</SettingLabel>
              <SettingDescription>
                {t("settings.darkModeDescription")}
              </SettingDescription>
            </SettingInfo>
            <ToggleSwitch>
              <ToggleInput
                type="checkbox"
                checked={isDarkMode}
                onChange={handleDarkModeToggle}
              />
              <ToggleSlider />
            </ToggleSwitch>
          </SettingItem>
        </Section>

        <Section>
          <SectionTitle>{t("settings.languageSettings")}</SectionTitle>

          <SettingItem>
            <SettingInfo>
              <SettingLabel>{t("settings.language")}</SettingLabel>
              <SettingDescription>
                {t("settings.languageDescription")}
              </SettingDescription>
            </SettingInfo>
            <LanguageSettingButton
              onClick={() => navigate("/language-settings")}
            >
              <LanguageName>
                {language === "ko" && "한국어"}
                {language === "en" && "English"}
                {language === "ja" && "日本語"}
                {language === "zh" && "中文"}
                {language === "vi" && "Tiếng Việt"}
                {language === "mn" && "Монгол"}
                {language === "uz" && "O'zbek"}
                {language === "ne" && "नेपाली"}
                {language === "my" && "မြန်မာ"}
                {language === "th" && "ไทย"}
                {language === "es" && "Español"}
                {language === "fr" && "Français"}
                {language === "de" && "Deutsch"}
                {language === "it" && "Italiano"}
                {language === "ru" && "Русский"}
                {language === "ar" && "العربية"}
                {language === "pt" && "Português"}
                {language === "nl" && "Nederlands"}
              </LanguageName>
              <ArrowIcon>→</ArrowIcon>
            </LanguageSettingButton>
          </SettingItem>
        </Section>

        <Section>
          <SectionTitle>{t("settings.appInfo")}</SectionTitle>

          <SettingItem>
            <SettingInfo>
              <SettingLabel>{t("settings.version")}</SettingLabel>
              <SettingDescription>1.0.0</SettingDescription>
            </SettingInfo>
          </SettingItem>

          <SettingItem>
            <SettingInfo>
              <SettingLabel>{t("settings.developer")}</SettingLabel>
              <SettingDescription>유니링고 김동휘</SettingDescription>
            </SettingInfo>
          </SettingItem>
        </Section>

        {/* 회원정보 관리 섹션 */}
        <AccountSection>
          <AccountTitle>{t("settings.accountManagement")}</AccountTitle>

          <AccountItem>
            <AccountInfo>
              <AccountLabel>{t("settings.logout")}</AccountLabel>
              <AccountDescription>
                {t("settings.logoutDescription")}
              </AccountDescription>
            </AccountInfo>
            <LogoutButton onClick={handleLogout}>
              {t("settings.logout")}
            </LogoutButton>
          </AccountItem>

          <AccountItem>
            <AccountInfo>
              <AccountLabel>{t("settings.changePassword")}</AccountLabel>
              <AccountDescription>
                {t("settings.changePasswordDescription")}
              </AccountDescription>
            </AccountInfo>
            <AccountButton onClick={() => setShowPasswordChange(true)}>
              {t("common.edit")}
            </AccountButton>
          </AccountItem>

          <AccountItem>
            <AccountInfo>
              <AccountLabel>{t("settings.deleteAccount")}</AccountLabel>
              <AccountDescription>
                {t("settings.deleteAccountDescription")}
              </AccountDescription>
            </AccountInfo>
            <DangerButton onClick={() => setShowDeleteConfirm(true)}>
              {t("common.delete")}
            </DangerButton>
          </AccountItem>
        </AccountSection>
      </Main>

      {/* 비밀번호 변경 모달 */}
      {showPasswordChange && (
        <Modal>
          <ModalContent>
            <ModalTitle>{t("settings.passwordChangeTitle")}</ModalTitle>
            <Form onSubmit={handlePasswordChange}>
              {error && <ErrorMessage>{error}</ErrorMessage>}
              {success && <SuccessMessage>{success}</SuccessMessage>}

              <FormGroup>
                <Label>{t("profile.currentPassword")}</Label>
                <Input
                  type="password"
                  value={passwordData.currentPassword}
                  onChange={(e) =>
                    setPasswordData({
                      ...passwordData,
                      currentPassword: e.target.value,
                    })
                  }
                  placeholder={t("profile.currentPassword")}
                  required
                />
              </FormGroup>

              <FormGroup>
                <Label>{t("profile.newPassword")}</Label>
                <Input
                  type="password"
                  value={passwordData.newPassword}
                  onChange={(e) =>
                    setPasswordData({
                      ...passwordData,
                      newPassword: e.target.value,
                    })
                  }
                  placeholder={t("profile.newPassword") + " (8자 이상)"}
                  required
                />
              </FormGroup>

              <FormGroup>
                <Label>{t("profile.confirmNewPassword")}</Label>
                <Input
                  type="password"
                  value={passwordData.confirmPassword}
                  onChange={(e) =>
                    setPasswordData({
                      ...passwordData,
                      confirmPassword: e.target.value,
                    })
                  }
                  placeholder={t("profile.confirmNewPassword")}
                  required
                />
              </FormGroup>

              <ButtonGroup>
                <CancelButton type="button" onClick={closePasswordModal}>
                  {t("common.cancel")}
                </CancelButton>
                <SubmitButton type="submit" disabled={isChangingPassword}>
                  {isChangingPassword
                    ? t("common.loading")
                    : t("settings.passwordChangeTitle")}
                </SubmitButton>
              </ButtonGroup>
            </Form>
          </ModalContent>
        </Modal>
      )}

      {/* 회원탈퇴 확인 모달 */}
      {showDeleteConfirm && (
        <Modal>
          <ModalContent>
            <ModalTitle>{t("settings.deleteAccountTitle")}</ModalTitle>
            <WarningText>
              ⚠️ {t("settings.deleteAccountDescription")}
            </WarningText>

            <Form
              onSubmit={(e) => {
                e.preventDefault();
                handleDeleteAccount();
              }}
            >
              {error && <ErrorMessage>{error}</ErrorMessage>}
              {success && <SuccessMessage>{success}</SuccessMessage>}

              <FormGroup>
                <Label>{t("settings.passwordConfirm")}</Label>
                <Input
                  type="password"
                  value={deletePassword}
                  onChange={(e) => setDeletePassword(e.target.value)}
                  placeholder={t("settings.passwordConfirmPlaceholder")}
                  required
                />
              </FormGroup>

              <ButtonGroup>
                <CancelButton type="button" onClick={closeDeleteModal}>
                  {t("common.cancel")}
                </CancelButton>
                <DangerSubmitButton
                  type="submit"
                  disabled={isDeleting || !deletePassword}
                >
                  {isDeleting
                    ? t("common.loading")
                    : t("settings.deleteAccountTitle")}
                </DangerSubmitButton>
              </ButtonGroup>
            </Form>
          </ModalContent>
        </Modal>
      )}

      <Sidebar />
      <UnderBar />
    </SettingsContainer>
  );
};

export default Settings;
