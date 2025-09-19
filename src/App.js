import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
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

// 전역 변수 초기화
if (!window.globalNotifications) {
  window.globalNotifications = [];
}
if (window.globalHasNewNotification === undefined) {
  window.globalHasNewNotification = false;
}

// 전역 알림 함수들
window.addMessageNotification = (message, senderName, roomId = null) => {
  const newNotification = {
    id: Date.now(),
    type: "message",
    message: `${senderName}에게 채팅이 왔습니다: "${message}"`,
    time: new Date(),
    isRead: false,
    roomId: roomId,
    partnerName: senderName,
  };

  window.globalNotifications = [newNotification, ...window.globalNotifications];
  window.globalHasNewNotification = true;
};

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

function App() {
  return (
    <AuthProvider>
      <LanguageProvider>
        <Router>
          <ScrollToTop />
          <Routes>
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
        </Router>
      </LanguageProvider>
    </AuthProvider>
  );
}

export default App;
