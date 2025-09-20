import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import styled from "styled-components";
import { useLanguage } from "../contexts/LanguageContext";
import { FiHome, FiMessageCircle, FiUser, FiSettings } from "react-icons/fi";

const UnderBarContainer = styled.div`
  position: fixed !important;
  bottom: 0 !important;
  left: 0 !important;
  right: 0 !important;
  background: rgba(255, 255, 255, 0.95) !important;
  backdrop-filter: blur(20px);
  border-top: 1px solid rgba(52, 152, 219, 0.2);
  z-index: 99999 !important;
  display: none;
  padding: 0.5rem 0;
  box-shadow: 0 -2px 10px rgba(0, 0, 0, 0.1);
  width: 100% !important;
  height: auto !important;
  transition: all 0.3s ease;

  @media (max-width: 768px) {
    display: block !important;
  }

  .dark-mode & {
    background: rgba(45, 45, 45, 0.95) !important;
    border-top: 1px solid rgba(52, 152, 219, 0.4);
    box-shadow: 0 -2px 10px rgba(0, 0, 0, 0.3);
  }
`;

const TabList = styled.div`
  display: flex;
  justify-content: space-around;
  align-items: center;
  max-width: 500px;
  margin: 0 auto;
  padding: 0 1rem;
`;

const TabItem = styled.button`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  background: none;
  border: none;
  padding: 0.75rem;
  cursor: pointer;
  transition: all 0.3s ease;
  border-radius: 12px;
  min-width: 50px;
  min-height: 50px;
  position: relative;

  @media (min-width: 769px) {
    &:hover {
      background: rgba(52, 152, 219, 0.1);
    }
  }

  &.active {
    color: #3498db;
    background: rgba(52, 152, 219, 0.1);

    &::before {
      content: "";
      position: absolute;
      top: -0.5rem;
      left: 50%;
      transform: translateX(-50%);
      width: 4px;
      height: 4px;
      background: #3498db;
      border-radius: 50%;
    }
  }

  &:not(.active) {
    color: #6c757d;
  }

  .dark-mode & {
    @media (min-width: 769px) {
      &:hover {
        background: rgba(52, 152, 219, 0.2);
      }
    }

    &.active {
      background: rgba(52, 152, 219, 0.2);
    }

    &:not(.active) {
      color: #b0b0b0;
    }
  }
`;

const TabIcon = styled.div`
  font-size: 1.8rem;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 32px;
  height: 32px;
`;

const NotificationBadge = styled.div`
  position: absolute;
  top: 0.25rem;
  right: 0.25rem;
  background: #e74c3c;
  color: white;
  border-radius: 50%;
  min-width: 18px;
  height: 18px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 0.7rem;
  font-weight: bold;
  padding: 0 4px;
  box-sizing: border-box;
`;

const UnderBar = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { t } = useLanguage();
  const [totalUnreadCount, setTotalUnreadCount] = useState(0);
  const [hasNewNotification, setHasNewNotification] = useState(false);

  // console.log("UnderBar 렌더링됨, 현재 경로:", location.pathname);

  // 전역 unread count 변경 감지 (성능 최적화)
  useEffect(() => {
    const updateUnreadCount = () => {
      const newCount = window.globalTotalUnreadCount || 0;
      setTotalUnreadCount((prevCount) => {
        // 값이 변경된 경우에만 업데이트
        return prevCount !== newCount ? newCount : prevCount;
      });
    };

    // 초기값 설정
    updateUnreadCount();

    // 주기적으로 업데이트 (2초마다로 변경하여 성능 개선)
    const interval = setInterval(updateUnreadCount, 2000);

    return () => clearInterval(interval);
  }, []);

  // 새로운 알림 상태 감지
  useEffect(() => {
    const updateNotificationStatus = () => {
      const newNotificationStatus = window.globalHasNewNotification || false;
      setHasNewNotification(newNotificationStatus);
    };

    // 초기값 설정
    updateNotificationStatus();

    // 주기적으로 업데이트
    const interval = setInterval(updateNotificationStatus, 1000);

    return () => clearInterval(interval);
  }, []);

  const tabs = [
    {
      id: "home",
      label: t("common.home"),
      icon: <FiHome />,
      path: "/", // 홈 = 루트 경로
    },
    {
      id: "chatting",
      label: t("common.chat"),
      icon: <FiMessageCircle />,
      path: "/chatting",
    },
    {
      id: "profile",
      label: t("common.profile"),
      icon: <FiUser />,
      path: "/profile",
    },
    {
      id: "settings",
      label: t("common.settings"),
      icon: <FiSettings />,
      path: "/settings",
    },
  ];

  const isActive = (path) => {
    if (path === "/") {
      return location.pathname === "/" || location.pathname === "/matching";
    }
    return location.pathname.startsWith(path);
  };

  const hasNotification = window.globalHasNewNotification || false;

  return (
    <UnderBarContainer>
      <TabList>
        {tabs.map((tab) => (
          <TabItem
            key={tab.id}
            className={isActive(tab.path) ? "active" : ""}
            onClick={() => {
              navigate(tab.path);
            }}
          >
            <TabIcon>
              {tab.icon}
              {tab.id === "chatting" && totalUnreadCount > 0 && (
                <NotificationBadge>{totalUnreadCount}</NotificationBadge>
              )}
            </TabIcon>
          </TabItem>
        ))}
      </TabList>
    </UnderBarContainer>
  );
};

export default UnderBar;
