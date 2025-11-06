import React, { useEffect } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  useNavigate,
  useLocation,
} from "react-router-dom";
import ScrollToTop from "./components/ScrollToTop";
import { LanguageProvider } from "./contexts/LanguageContext";
import { AuthProvider } from "./contexts/AuthContext";
import ProtectedRoute from "./components/ProtectedRoute";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import Profile from "./pages/Profile";
import Matching from "./pages/Matching";
import Chatting from "./pages/Chatting";
import ChattingDetail from "./pages/ChattingDetail";
import AdminMatching from "./pages/AdminMatching";
import Settings from "./pages/Settings";
import LanguageSettings from "./pages/LanguageSettings";
import GenderSettings from "./pages/GenderSettings";
import UniversitySettings from "./pages/UniversitySettings";
import MatchingUniversitySettings from "./pages/MatchingUniversitySettings";
import LearningLanguageSettings from "./pages/LearningLanguageSettings";
import TeachingLanguageSettings from "./pages/TeachingLanguageSettings";
import ProfileLearningLanguageSettings from "./pages/ProfileLearningLanguageSettings";
import Notifications from "./pages/Notifications";
import PCNotSupported from "./pages/PCNotSupported";

// 전역 변수 초기화
if (!window.globalNotifications) {
  window.globalNotifications = [];
}
if (window.globalHasNewNotification === undefined) {
  window.globalHasNewNotification = false;
}

// 전역 알림 함수들
// 메시지 알림은 제거하고 친구 매칭 알림만 남김

// 매칭 성공 알림 추가 함수
window.addMatchingNotification = (partnerName) => {
  const newNotification = {
    id: Date.now(),
    type: "matching",
    message: `🎉 ${partnerName}와 매칭되었습니다!`,
    time: new Date(),
    isRead: false,
    partnerName: partnerName,
  };

  window.globalNotifications = [newNotification, ...window.globalNotifications];
  window.globalHasNewNotification = true;
};

// 모바일 기기 감지 함수 (userAgent 기준)
const isMobileDevice = () => {
  if (typeof window === "undefined") return true;

  const userAgent = navigator.userAgent || navigator.vendor || window.opera;

  // 모바일 기기 패턴
  const mobilePatterns = [
    /Android/i,
    /webOS/i,
    /iPhone/i,
    /iPad/i,
    /iPod/i,
    /BlackBerry/i,
    /Windows Phone/i,
    /Mobile/i,
  ];

  // 모바일 패턴이 있는지 확인
  const isMobile = mobilePatterns.some((pattern) => pattern.test(userAgent));

  return isMobile;
};

// PC 접속 차단 컴포넌트
const MobileOnlyGuard = ({ children }) => {
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    // PC 미지원 페이지는 체크하지 않음
    if (location.pathname === "/pc-not-supported") {
      return;
    }

    // 모바일이 아니면 PC 미지원 페이지로 리다이렉트
    if (!isMobileDevice()) {
      navigate("/pc-not-supported", { replace: true });
    }
  }, [navigate, location.pathname]);

  // PC 미지원 페이지이거나 모바일 기기인 경우에만 children 렌더링
  if (location.pathname === "/pc-not-supported") {
    return children;
  }

  if (!isMobileDevice()) {
    return null; // 리다이렉트 중
  }

  return children;
};

function App() {
  return (
    <AuthProvider>
      <LanguageProvider>
        <Router>
          <ScrollToTop />
          <MobileOnlyGuard>
            <Routes>
              {/* PC 미지원 페이지 */}
              <Route path="/pc-not-supported" element={<PCNotSupported />} />

              {/* 공개 라우트 (로그인 불필요) */}
              <Route path="/login" element={<Login />} />
              <Route path="/signup" element={<Signup />} />

              {/* 보호된 라우트 (로그인 필요) */}
              <Route
                path="/"
                element={
                  <ProtectedRoute>
                    <Matching />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/profile"
                element={
                  <ProtectedRoute>
                    <Profile />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/profile/:id"
                element={
                  <ProtectedRoute>
                    <Profile />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/matching"
                element={
                  <ProtectedRoute>
                    <Matching />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/admin/matching"
                element={
                  <ProtectedRoute>
                    <AdminMatching />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/chatting"
                element={
                  <ProtectedRoute>
                    <Chatting />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/chatting/:id"
                element={
                  <ProtectedRoute>
                    <ChattingDetail />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/settings"
                element={
                  <ProtectedRoute>
                    <Settings />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/language-settings"
                element={
                  <ProtectedRoute>
                    <LanguageSettings />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/gender-settings"
                element={
                  <ProtectedRoute>
                    <GenderSettings />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/university-settings"
                element={
                  <ProtectedRoute>
                    <UniversitySettings />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/matching-university-settings"
                element={
                  <ProtectedRoute>
                    <MatchingUniversitySettings />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/learning-language-settings"
                element={
                  <ProtectedRoute>
                    <LearningLanguageSettings />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/teaching-language-settings"
                element={
                  <ProtectedRoute>
                    <TeachingLanguageSettings />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/profile-learning-language-settings"
                element={
                  <ProtectedRoute>
                    <ProfileLearningLanguageSettings />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/notifications"
                element={
                  <ProtectedRoute>
                    <Notifications />
                  </ProtectedRoute>
                }
              />
            </Routes>
          </MobileOnlyGuard>
        </Router>
      </LanguageProvider>
    </AuthProvider>
  );
}

export default App;
