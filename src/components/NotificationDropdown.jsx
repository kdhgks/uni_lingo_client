import React, { useState, useEffect } from "react";
import styled, { keyframes } from "styled-components";

const slideDown = keyframes`
  from {
    opacity: 0;
    transform: translateY(-10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
`;

const NotificationDropdownContainer = styled.div`
  position: relative;
  display: inline-block;
`;

const DropdownContent = styled.div`
  position: absolute;
  top: 100%;
  right: 0;
  background: rgba(255, 255, 255, 0.95);
  backdrop-filter: blur(20px);
  border: 1px solid rgba(52, 152, 219, 0.2);
  border-radius: 12px;
  box-shadow: 0 8px 30px rgba(0, 0, 0, 0.15);
  z-index: 1000;
  min-width: 300px;
  max-width: 400px;
  animation: ${slideDown} 0.3s ease-out;
  margin-top: 0.5rem;

  @media (max-width: 768px) {
    min-width: 280px;
    max-width: calc(100vw - 2rem);
    right: 0;
    left: 50%;
    transform: translateX(-50%);
    width: calc(100vw - 2rem);
  }
`;

const NotificationHeader = styled.div`
  padding: 1rem;
  border-bottom: 1px solid rgba(52, 152, 219, 0.1);
  background: linear-gradient(135deg, #3498db 0%, #2ecc71 100%);
  color: white;
  border-radius: 12px 12px 0 0;

  h3 {
    margin: 0;
    font-size: 1rem;
    font-weight: 600;
  }
`;

const NotificationList = styled.div`
  max-height: 300px;
  overflow-y: auto;
  padding: 0.5rem 0;
`;

const NotificationItem = styled.div`
  padding: 0.75rem 1rem;
  border-bottom: 1px solid rgba(52, 152, 219, 0.05);
  cursor: pointer;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  gap: 0.75rem;

  &:hover {
    background: rgba(52, 152, 219, 0.05);
  }

  &:last-child {
    border-bottom: none;
  }
`;

const NotificationIcon = styled.div`
  font-size: 1.2rem;
  min-width: 24px;
  text-align: center;
`;

const NotificationContent = styled.div`
  flex: 1;
`;

const NotificationTitle = styled.div`
  font-weight: 600;
  color: #2c3e50;
  font-size: 0.9rem;
  margin-bottom: 0.25rem;
`;

const NotificationMessage = styled.div`
  color: #6c757d;
  font-size: 0.8rem;
  line-height: 1.4;
`;

const NotificationTime = styled.div`
  color: #95a5a6;
  font-size: 0.7rem;
  margin-top: 0.25rem;
`;

const EmptyState = styled.div`
  padding: 2rem 1rem;
  text-align: center;
  color: #6c757d;
  font-size: 0.9rem;
`;

const NotificationDropdown = ({ isOpen, onClose, notifications = [] }) => {
  const [localNotifications, setLocalNotifications] = useState(notifications);

  useEffect(() => {
    setLocalNotifications(notifications);
  }, [notifications]);

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
    // 알림 클릭 시 처리 로직
    console.log("알림 클릭:", notification);

    // 알림을 읽음 처리
    if (notification.roomId) {
      // 채팅방으로 이동
      window.location.href = `/chatting/${notification.roomId}`;
    } else if (notification.type === "match") {
      // 매칭 페이지로 이동
      window.location.href = "/matching";
    }

    onClose();
  };

  if (!isOpen) return null;

  return (
    <NotificationDropdownContainer>
      <DropdownContent>
        <NotificationHeader>
          <h3>🔔 알림</h3>
        </NotificationHeader>
        <NotificationList>
          {localNotifications.length > 0 ? (
            localNotifications.map((notification, index) => (
              <NotificationItem
                key={notification.id || index}
                onClick={() => handleNotificationClick(notification)}
              >
                <NotificationIcon>
                  {notification.type === "message" ? "💬" : "🎉"}
                </NotificationIcon>
                <NotificationContent>
                  <NotificationTitle>
                    {notification.type === "message"
                      ? "새로운 메시지"
                      : "매칭 완료"}
                  </NotificationTitle>
                  <NotificationMessage>
                    {notification.message}
                  </NotificationMessage>
                  <NotificationTime>
                    {formatTime(notification.time)}
                  </NotificationTime>
                </NotificationContent>
              </NotificationItem>
            ))
          ) : (
            <EmptyState>새로운 알림이 없습니다</EmptyState>
          )}
        </NotificationList>
      </DropdownContent>
    </NotificationDropdownContainer>
  );
};

export default NotificationDropdown;
