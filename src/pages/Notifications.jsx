import React, { useState, useEffect } from "react";
import styled from "styled-components";
import { useNavigate } from "react-router-dom";
import UnderBar from "../components/UnderBar";
import Sidebar from "../components/Sidebar";
import { useLanguage } from "../contexts/LanguageContext";

const NotificationsContainer = styled.div`
  min-height: 100vh;
  background: #ffffff;
  padding-left: 0;
  transition: background-color 0.3s ease;

  @media (min-width: 769px) {
    padding-left: 250px;
  }

  .dark-mode & {
    background: #1a1a1a;
  }
`;

const NotificationsHeader = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  height: 60px;
  background: rgba(255, 255, 255, 0.95);
  backdrop-filter: blur(20px);
  border-bottom: 1px solid rgba(52, 152, 219, 0.2);
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 1rem;
  z-index: 1000;
  transition: all 0.3s ease;

  @media (min-width: 769px) {
    left: 250px;
  }

  .dark-mode & {
    background: rgba(45, 45, 45, 0.95);
    border-bottom: 1px solid rgba(52, 152, 219, 0.4);
  }
`;

const Logo = styled.div`
  font-size: 1.5rem;
  font-weight: bold;
  color: #3498db;
  cursor: pointer;
  position: absolute;
  left: 50%;
  transform: translateX(-50%);
`;

const BackBtn = styled.button`
  background: none;
  border: none;
  font-size: 1.2rem;
  color: #3498db;
  cursor: pointer;
  padding: 0.5rem;
  border-radius: 8px;
  transition: all 0.3s ease;

  &:hover {
    background: rgba(52, 152, 219, 0.1);
  }
`;

const NotificationsMain = styled.div`
  padding: 5rem 1rem 6rem 1rem;
  max-width: 800px;
  margin: 0 auto;
`;

const NotificationsTitle = styled.h1`
  color: white;
  text-align: center;
  margin-bottom: 2rem;
  font-size: 2rem;
  font-weight: 600;
  transition: color 0.3s ease;

  .dark-mode & {
    color: #ffffff;
  }
`;

const NotificationList = styled.div`
  background: rgba(255, 255, 255, 0.95);
  backdrop-filter: blur(20px);
  border-radius: 16px;
  padding: 1rem;
  border: 1px solid rgba(255, 255, 255, 0.2);
  transition: all 0.3s ease;

  .dark-mode & {
    background: rgba(45, 45, 45, 0.95);
    border: 1px solid rgba(64, 64, 64, 0.3);
  }
`;

const NotificationItem = styled.div`
  padding: 1.25rem 1rem;
  border-bottom: 1px solid rgba(52, 152, 219, 0.1);
  cursor: pointer;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 1rem;
  border-radius: 12px;
  margin-bottom: 0.75rem;
  background: rgba(255, 255, 255, 0.8);
  backdrop-filter: blur(10px);
  border: 1px solid rgba(52, 152, 219, 0.1);

  &:hover {
    background: rgba(52, 152, 219, 0.08);
    transform: translateY(-2px);
    box-shadow: 0 4px 12px rgba(52, 152, 219, 0.15);
  }

  &:last-child {
    border-bottom: none;
    margin-bottom: 0;
  }

  .dark-mode & {
    background: rgba(45, 45, 45, 0.8);
    border: 1px solid rgba(64, 64, 64, 0.3);
  }
`;

const NotificationIcon = styled.div`
  font-size: 1.5rem;
  min-width: 40px;
  text-align: center;
`;

const NotificationContent = styled.div`
  flex: 1;
`;

const NotificationTitle = styled.div`
  font-weight: 600;
  color: #2c3e50;
  font-size: 1rem;
  margin-bottom: 0.25rem;
  transition: color 0.3s ease;

  .dark-mode & {
    color: #ffffff;
  }
`;

const NotificationMessage = styled.div`
  color: #6c757d;
  font-size: 0.9rem;
  line-height: 1.4;
  margin-bottom: 0.25rem;
  transition: color 0.3s ease;

  .dark-mode & {
    color: #b0b0b0;
  }
`;

const NotificationTime = styled.div`
  color: #95a5a6;
  font-size: 0.8rem;
  transition: color 0.3s ease;
  white-space: nowrap;
  margin-left: 1rem;

  .dark-mode & {
    color: #888;
  }
`;

const EmptyState = styled.div`
  text-align: center;
  padding: 4rem 1rem;
  color: #6c757d;
  font-size: 1.1rem;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: 200px;
  background: transparent;
  border: none;
  box-shadow: none;
  transition: all 0.3s ease;

  .dark-mode & {
    color: #b0b0b0;
  }
`;

const Notifications = () => {
  const navigate = useNavigate();
  const { t } = useLanguage();
  const [notifications, setNotifications] = useState([]);

  useEffect(() => {
    // 전역 알림 데이터 가져오기
    const globalNotifications = window.globalNotifications || [];
    setNotifications(globalNotifications);

    // 전역 알림 상태 초기화
    window.globalHasNewNotification = false;
    window.dispatchEvent(new CustomEvent("notificationUpdate"));
  }, []);

  const formatTime = (time) => {
    const now = new Date();
    const notificationTime = new Date(time);
    const diffInMinutes = Math.floor((now - notificationTime) / (1000 * 60));

    if (diffInMinutes < 1) return "방금 전";
    if (diffInMinutes < 60) return `${diffInMinutes}분 전`;
    if (diffInMinutes < 1440) return `${Math.floor(diffInMinutes / 60)}시간 전`;
    return notificationTime.toLocaleDateString();
  };

  const handleNotificationClick = (notification) => {
    if (notification.roomId) {
      navigate(`/chatting/${notification.roomId}`);
    } else if (notification.type === "matching") {
      // 매칭 성공 알림 클릭 시 채팅방으로 이동
      navigate("/chatting");
    } else if (notification.type === "match") {
      navigate("/matching");
    }
  };

  const handleBack = () => {
    navigate(-1);
  };

  return (
    <NotificationsContainer>
      <NotificationsHeader>
        <BackBtn onClick={handleBack}>←</BackBtn>
        <Logo>{t("notifications.title")}</Logo>
        <div></div>
      </NotificationsHeader>

      <NotificationsMain>
        <NotificationList>
          {notifications.length > 0 ? (
            notifications.map((notification, index) => (
              <NotificationItem
                key={notification.id || index}
                onClick={() => handleNotificationClick(notification)}
              >
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "1rem",
                    flex: 1,
                  }}
                >
                  <NotificationIcon>
                    {notification.type === "message"
                      ? "💬"
                      : notification.type === "matching"
                      ? "🎉"
                      : "🔔"}
                  </NotificationIcon>
                  <NotificationContent>
                    <NotificationTitle>
                      {notification.type === "message"
                        ? t("notifications.newMessage")
                        : notification.type === "matching"
                        ? "매칭 성공"
                        : t("notifications.matchComplete")}
                    </NotificationTitle>
                    <NotificationMessage>
                      {notification.message}
                    </NotificationMessage>
                  </NotificationContent>
                </div>
                <NotificationTime>
                  {formatTime(notification.time)}
                </NotificationTime>
              </NotificationItem>
            ))
          ) : (
            <EmptyState>
              <div style={{ fontSize: "3rem", marginBottom: "1rem" }}>🔔</div>
              {t("notifications.noNotifications")}
            </EmptyState>
          )}
        </NotificationList>
      </NotificationsMain>

      <UnderBar />
      <Sidebar />
    </NotificationsContainer>
  );
};

export default Notifications;
