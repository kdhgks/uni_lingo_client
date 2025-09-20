import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import styled, { keyframes } from "styled-components";
import UnderBar from "../components/UnderBar";
import Sidebar from "../components/Sidebar";
import { useLanguage } from "../contexts/LanguageContext";
import { API_ENDPOINTS } from "../config/api";
import { FiBell } from "react-icons/fi";

// Keyframes
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

const float = keyframes`
  0%, 100% {
    transform: translateY(0px);
  }
  50% {
    transform: translateY(-10px);
  }
`;

const neonGlow = keyframes`
  0%, 100% {
    text-shadow: 
      0 0 5px rgba(0, 255, 255, 0.5),
      0 0 10px rgba(0, 255, 255, 0.3),
      0 0 15px rgba(0, 255, 255, 0.1);
  }
  50% {
    text-shadow: 
      0 0 10px rgba(0, 255, 255, 0.8),
      0 0 20px rgba(0, 255, 255, 0.5),
      0 0 30px rgba(0, 255, 255, 0.2);
  }
`;

const gradientShift = keyframes`
  0% {
    background-position: 0% 50%;
  }
  50% {
    background-position: 100% 50%;
  }
  100% {
    background-position: 0% 50%;
  }
`;

const pulse = keyframes`
  0%, 100% {
    transform: scale(1);
    opacity: 1;
  }
  50% {
    transform: scale(1.05);
    opacity: 0.8;
  }
`;

// Styled Components
const ChattingContainer = styled.div`
  min-height: 100vh;
  background: #ffffff;
  color: #2c3e50;
  font-family: "Inter", "Segoe UI", -apple-system, BlinkMacSystemFont,
    sans-serif;
  position: relative;
  overflow: hidden;
  padding-left: 0;
  transition: background-color 0.3s ease, color 0.3s ease;

  /* 모바일에서 언더바 공간 확보 */
  @media (max-width: 768px) {
    padding-bottom: 80px;
  }

  @media (min-width: 769px) {
    padding-left: 250px;
  }

  @media (min-width: 1200px) {
    padding-left: 280px;
  }

  .dark-mode & {
    background: #1a1a1a;
    color: #ffffff;
  }

  &::before {
    content: "";
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: radial-gradient(
        circle at 20% 80%,
        rgba(52, 152, 219, 0.05) 0%,
        transparent 50%
      ),
      radial-gradient(
        circle at 80% 20%,
        rgba(46, 204, 113, 0.05) 0%,
        transparent 50%
      ),
      radial-gradient(
        circle at 40% 40%,
        rgba(41, 128, 185, 0.03) 0%,
        transparent 50%
      );
    pointer-events: none;
  }

  &::after {
    content: "";
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: linear-gradient(
      90deg,
      transparent 0%,
      rgba(52, 152, 219, 0.02) 25%,
      transparent 50%,
      rgba(46, 204, 113, 0.02) 75%,
      transparent 100%
    );
    animation: ${gradientShift} 8s ease-in-out infinite;
    pointer-events: none;
  }
`;

const ChattingHeader = styled.header`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1rem 2rem;
  background: rgba(255, 255, 255, 0.9);
  backdrop-filter: blur(20px);
  border-bottom: 1px solid rgba(52, 152, 219, 0.2);
  position: relative;
  z-index: 10;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
  transition: all 0.3s ease;

  @media (max-width: 1024px) {
    padding: 1.3rem 1.5rem;
  }

  @media (min-width: 769px) {
    display: none;
  }

  .dark-mode & {
    background: rgba(45, 45, 45, 0.9);
    border-bottom: 1px solid rgba(52, 152, 219, 0.4);
    box-shadow: 0 2px 10px rgba(0, 0, 0, 0.3);
  }

  @media (max-width: 768px) {
    padding: 1rem;
    gap: 0.5rem;
  }

  @media (max-width: 480px) {
    padding: 0.8rem;
    gap: 0.3rem;
  }

  .desktop-only {
    @media (max-width: 768px) {
      display: none !important;
    }
  }

  h1 {
    margin: 0;
    font-size: 1.8rem;
    font-weight: 700;
    background: linear-gradient(135deg, #3498db 0%, #2ecc71 100%);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    background-clip: text;
    position: relative;

    @media (max-width: 768px) {
      font-size: 1.5rem;
    }

    @media (max-width: 480px) {
      font-size: 1.3rem;
    }
  }
`;

const BackBtn = styled.button`
  background: none;
  border: none;
  color: #6c757d;
  padding: 0.75rem 1.5rem;
  cursor: pointer;
  font-weight: 500;
  font-size: 1.5rem;

  @media (max-width: 768px) {
    padding: 0.6rem 1.2rem;
    font-size: 1.3rem;
  }

  @media (max-width: 480px) {
    padding: 0.5rem 1rem;
    font-size: 1.2rem;
  }
`;

const MatchingBtn = styled.button`
  background: linear-gradient(135deg, #3498db 0%, #2ecc71 100%);
  border: none;
  color: white;
  padding: 0.75rem 1.5rem;
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.3s ease;
  font-weight: 600;
  font-size: 1rem;
  box-shadow: 0 4px 15px rgba(52, 152, 219, 0.4);

  @media (max-width: 768px) {
    padding: 0.6rem 1.2rem;
    font-size: 0.9rem;
  }

  @media (max-width: 480px) {
    padding: 0.5rem 1rem;
    font-size: 0.85rem;
  }

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 8px 30px rgba(52, 152, 219, 0.6);
    animation: ${pulse} 0.6s ease-in-out;
  }
`;

// Mobile Menu Components 제거됨 - PC에서만 사이드바 사용

// Header Components

const Logo = styled.div`
  font-family: "Fredoka One", cursive;
  font-size: 1.8rem;
  font-weight: 400;
  background: linear-gradient(135deg, #3498db 0%, #2ecc71 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  letter-spacing: 0.5px;
  text-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  margin-left: 0.7rem;
`;

const NotificationContainer = styled.div`
  position: relative;
  cursor: pointer;
  padding: 0.5rem;
  border-radius: 50%;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  justify-content: center;

  &:hover {
    background: rgba(52, 152, 219, 0.1);
  }
`;

const NotificationIcon = styled.span`
  font-size: 1.8rem;
  display: block;
  color: #6c757d;
  transition: color 0.3s ease;

  .dark-mode & {
    color: #b0b0b0;
  }
`;

const NotificationBadge = styled.div`
  position: absolute;
  top: 5px;
  right: 5px;
  background: #e74c3c;
  border-radius: 50%;
  width: 10px;
  height: 10px;
`;

const ChattingMain = styled.main`
  max-width: 1200px;
  margin: 0 auto;
  padding: 0;
  position: relative;
  z-index: 1;
  transition: all 0.3s ease;

  .dark-mode & {
    color: #ffffff;
  }
`;

const ChatList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0;
`;

const ChatItem = styled.div`
  background: linear-gradient(
    135deg,
    rgba(255, 255, 255, 0.95) 0%,
    rgba(248, 250, 252, 0.95) 100%
  );
  backdrop-filter: blur(20px);
  border: 1px solid rgba(52, 152, 219, 0.15);
  border-radius: 0;
  padding: 1rem 0.5rem;
  cursor: pointer;
  transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
  display: flex;
  align-items: center;
  gap: 0.8rem;
  position: relative;
  overflow: hidden;
  box-shadow: 0 4px 20px rgba(52, 152, 219, 0.08);
  margin-bottom: 0;

  @media (max-width: 768px) {
    border-radius: 12px;
  }

  &::before {
    content: "";
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: linear-gradient(
      135deg,
      rgba(52, 152, 219, 0.02) 0%,
      rgba(46, 204, 113, 0.02) 100%
    );
    opacity: 0;
    transition: opacity 0.3s ease;
  }

  &::after {
    content: "";
    position: absolute;
    top: 0;
    left: -100%;
    width: 100%;
    height: 100%;
    background: linear-gradient(
      90deg,
      transparent,
      rgba(52, 152, 219, 0.1),
      transparent
    );
    transition: left 0.6s ease;
  }

  .dark-mode & {
    background: linear-gradient(
      135deg,
      rgba(45, 45, 45, 0.95) 0%,
      rgba(35, 35, 35, 0.95) 100%
    );
    border-color: rgba(52, 152, 219, 0.3);
    box-shadow: 0 4px 20px rgba(0, 0, 0, 0.2);
  }
`;

const PartnerAvatar = styled.div`
  font-size: 2.5rem;
  min-width: 70px;
  height: 70px;
  text-align: center;
  display: flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(
    135deg,
    rgba(52, 152, 219, 0.1) 0%,
    rgba(46, 204, 113, 0.1) 100%
  );
  border-radius: 50%;
  border: 2px solid rgba(52, 152, 219, 0.2);
  transition: all 0.3s ease;

  .dark-mode & {
    background: linear-gradient(
      135deg,
      rgba(52, 152, 219, 0.2) 0%,
      rgba(46, 204, 113, 0.2) 100%
    );
    border-color: rgba(52, 152, 219, 0.4);
  }
`;

const ChatInfo = styled.div`
  flex: 1;
  min-width: 0;
`;

const PartnerName = styled.h3`
  margin: 0 0 0.3rem 0;
  font-size: 1.3rem;
  font-weight: 700;
  color: #2c3e50;
  background: linear-gradient(135deg, #3498db 0%, #2ecc71 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  letter-spacing: -0.02em;
  line-height: 1.3;
  transition: all 0.3s ease;

  .dark-mode & {
    color: #ffffff;
    background: linear-gradient(135deg, #5dade2 0%, #2ecc71 100%);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    background-clip: text;
  }
`;

const LastMessage = styled.p`
  margin: 0 0 0.3rem 0;
  opacity: 0.8;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  color: #6c757d;
  font-size: 0.95rem;
  line-height: 1.4;
  transition: all 0.3s ease;

  .dark-mode & {
    color: #b0b0b0;
  }
`;

const ChatMeta = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-size: 0.9rem;
  opacity: 0.7;
  margin: 0;
`;

const ChatRightSection = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  gap: 0.3rem;
  min-width: 60px;
`;

const TimeStamp = styled.span`
  font-size: 0.8rem;
  color: #6c757d;
  font-weight: 500;
  opacity: 0.7;
  transition: all 0.3s ease;

  .dark-mode & {
    color: #b0b0b0;
  }
`;

const UnreadBadge = styled.span`
  background: linear-gradient(135deg, #e74c3c 0%, #f39c12 100%);
  color: white;
  border-radius: 50%;
  width: 20px;
  height: 20px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 0.7rem;
  font-weight: 700;
  box-shadow: 0 2px 8px rgba(231, 76, 60, 0.3);
  animation: ${pulse} 2s infinite;
`;

const EmptyState = styled.div`
  text-align: center;
  padding: 2rem 1rem;
  position: relative;
  transition: all 0.3s ease;

  h2 {
    font-size: 1.8rem;
    margin-bottom: 0.5rem;
    background: linear-gradient(135deg, #3498db 0%, #2ecc71 100%);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    background-clip: text;
  }

  p {
    font-size: 1.1rem;
    opacity: 0.8;
    margin-bottom: 1rem;
    color: #2c3e50;
    transition: color 0.3s ease;

    .dark-mode & {
      color: #b0b0b0;
    }
  }
`;

const StartChatBtn = styled.button`
  padding: 1.2rem 2.5rem;
  border: none;
  border-radius: 16px;
  font-size: 1.1rem;
  font-weight: 700;
  cursor: pointer;
  transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
  background: linear-gradient(135deg, #3498db 0%, #2ecc71 100%);
  color: white;
  box-shadow: 0 8px 24px rgba(52, 152, 219, 0.3);
  position: relative;
  overflow: hidden;
  letter-spacing: -0.02em;

  &::before {
    content: "";
    position: absolute;
    top: 0;
    left: -100%;
    width: 100%;
    height: 100%;
    background: linear-gradient(
      90deg,
      transparent,
      rgba(255, 255, 255, 0.2),
      transparent
    );
    transition: left 0.6s ease;
  }

  &:hover {
    transform: translateY(-4px) scale(1.05);
    box-shadow: 0 16px 40px rgba(52, 152, 219, 0.4);
    animation: ${pulse} 0.6s ease-in-out;

    &::before {
      left: 100%;
    }
  }

  &:active {
    transform: translateY(-2px) scale(1.02);
  }
`;

const Chatting = () => {
  const navigate = useNavigate();
  const { t } = useLanguage();
  const [chats, setChats] = useState([]);
  const [isLoadingChats, setIsLoadingChats] = useState(false);
  const [hasNewNotification, setHasNewNotification] = useState(false);
  const [totalUnreadCount, setTotalUnreadCount] = useState(0);

  // 인증 상태 확인 - 토큰이나 사용자 정보가 없으면 로그인 페이지로 리다이렉트
  useEffect(() => {
    const token = localStorage.getItem("token");
    const user = localStorage.getItem("user");

    if (!token || !user) {
      console.log("No authentication found, redirecting to login");
      navigate("/login");
      return;
    }
  }, [navigate]);

  // 채팅 시간 포맷팅 함수 (카카오톡 스타일)
  const formatChatTime = (timestamp, hasMessage = true) => {
    if (!timestamp) return "방금 전";

    const now = new Date();
    const messageTime = new Date(timestamp);

    // Invalid Date 체크
    if (isNaN(messageTime.getTime())) return "방금 전";

    const diffInMinutes = Math.floor((now - messageTime) / (1000 * 60));
    const diffInHours = Math.floor(diffInMinutes / 60);
    const diffInDays = Math.floor(diffInHours / 24);

    // 메시지가 없는 경우 (채팅방 생성 시간)
    if (!hasMessage) {
      if (diffInDays < 1) {
        // 오늘 생성된 채팅방: 시간:분 형식 (예: 2:30 PM)
        return messageTime.toLocaleTimeString("en-US", {
          hour: "numeric",
          minute: "2-digit",
          hour12: true,
        });
      } else if (diffInDays === 1) {
        return "어제";
      } else if (diffInDays < 7) {
        return messageTime.toLocaleDateString("ko-KR", { weekday: "short" });
      } else {
        return messageTime.toLocaleDateString("ko-KR", {
          month: "numeric",
          day: "numeric",
        });
      }
    }

    // 메시지가 있는 경우 (기존 로직)
    // 오늘인지 확인 (같은 날)
    const isToday = now.toDateString() === messageTime.toDateString();

    // 어제인지 확인
    const yesterday = new Date(now);
    yesterday.setDate(yesterday.getDate() - 1);
    const isYesterday = yesterday.toDateString() === messageTime.toDateString();

    if (isToday) {
      // 오늘: 시간:분 형식 (예: 2:30 PM)
      return messageTime.toLocaleTimeString("en-US", {
        hour: "numeric",
        minute: "2-digit",
        hour12: true,
      });
    } else if (isYesterday) {
      // 어제: "어제" 텍스트
      return "어제";
    } else if (diffInDays < 7) {
      // 이번 주: 요일 (예: 월요일)
      return messageTime.toLocaleDateString("ko-KR", { weekday: "short" });
    } else {
      // 그 외: 월/일 형식 (예: 12/25)
      return messageTime.toLocaleDateString("ko-KR", {
        month: "numeric",
        day: "numeric",
      });
    }
  };

  // 채팅방 목록 로드 함수
  const loadChats = async () => {
    setIsLoadingChats(true);
    try {
      const currentUser = JSON.parse(localStorage.getItem("user") || "{}");

      if (currentUser.nickname === "sarah_k") {
        // Sarah Kim 더미 계정인 경우 로컬 더미 데이터 사용
        const dummyChats = [
          {
            id: 1,
            partner: {
              name: "박지영",
              avatar: "👩‍🎓",
            },
            lastMessage: "안녕하세요! 오늘 영어 공부 어떠셨나요?",
            timestamp: formatChatTime(new Date().toISOString()), // 오늘
            unreadCount: 2,
          },
          {
            id: 2,
            partner: {
              name: "김민수",
              avatar: "👨‍🎓",
            },
            lastMessage: "Thank you for helping me with English!",
            timestamp: formatChatTime(
              new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString()
            ), // 1일 전 (어제)
            unreadCount: 0,
          },
          {
            id: 3,
            partner: {
              name: "Yuki Tanaka",
              avatar: "👩‍💼",
            },
            lastMessage: "こんにちは！今日は日本語を教えてください。",
            timestamp: formatChatTime(
              new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString()
            ), // 3일 전
            unreadCount: 1,
          },
          {
            id: 4,
            partner: {
              name: "Alex Johnson",
              avatar: "👨‍💼",
            },
            lastMessage: "Hello! How was your Korean study today?",
            timestamp: formatChatTime(
              new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString()
            ), // 5일 전
            unreadCount: 0,
          },
        ];
        setChats(dummyChats);

        // 더미 데이터에서 전체 unread count 계산
        const totalUnreadCount = dummyChats.reduce((total, chat) => {
          return total + (chat.unreadCount || 0);
        }, 0);
        window.globalTotalUnreadCount = totalUnreadCount;
        setTotalUnreadCount(totalUnreadCount);
      } else {
        // 새로운 유저의 경우 백엔드에서 채팅방 목록 불러오기
        const response = await fetch(API_ENDPOINTS.CHAT_ROOMS, {
          method: "GET",
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
            "Content-Type": "application/json",
          },
        });

        if (response.ok) {
          const chatsData = await response.json();
          console.log("📱 API 응답 데이터:", chatsData);

          if (chatsData.success && chatsData.rooms) {
            // API 응답 구조에 맞게 데이터 변환 (백엔드에서 이미 정렬됨)
            const transformedChats = chatsData.rooms.map((room) => ({
              id: room.id,
              partner: {
                name: room.partner?.nickname || "Unknown",
                avatar: room.partner?.profile_image ? "👤" : "👤",
              },
              lastMessage: room.last_message?.content || "메시지가 없습니다",
              timestamp: room.last_message?.timestamp
                ? formatChatTime(
                    room.last_message.timestamp,
                    !!room.last_message?.content
                  )
                : "방금 전",
              unreadCount: room.unread_count || 0,
            }));

            console.log("📱 채팅 데이터:", transformedChats);
            setChats(transformedChats);

            // 전체 unread count 계산
            const totalUnreadCount = transformedChats.reduce((total, chat) => {
              return total + (chat.unreadCount || 0);
            }, 0);
            window.globalTotalUnreadCount = totalUnreadCount;
            setTotalUnreadCount(totalUnreadCount);
          } else {
            console.error("채팅방 데이터 형식이 올바르지 않습니다:", chatsData);
            setChats([]);
          }
        } else {
          console.error(
            "채팅방 목록을 불러오는데 실패했습니다. 상태:",
            response.status
          );
          setChats([]);
          window.globalTotalUnreadCount = 0;
          setTotalUnreadCount(0);
        }
      }
    } catch (error) {
      console.error("채팅방 목록 로딩 중 오류가 발생했습니다:", error);
      setChats([]);
      window.globalTotalUnreadCount = 0;
      setTotalUnreadCount(0);
    } finally {
      setIsLoadingChats(false);
    }
  };

  // 읽지 않은 알림 확인 함수
  const checkUnreadNotifications = async () => {
    try {
      const response = await fetch(API_ENDPOINTS.NOTIFICATIONS, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });

      if (response.ok) {
        const data = await response.json();
        const hasUnread = (data.unread_count || 0) > 0;
        setHasNewNotification(hasUnread);
      }
    } catch (error) {
      console.error("알림 확인 중 오류:", error);
    }
  };

  // 초기 로드
  useEffect(() => {
    loadChats();
    checkUnreadNotifications();
  }, []);

  // 페이지 포커스 시 채팅방 목록 새로고침
  useEffect(() => {
    const handleFocus = () => {
      loadChats();
    };

    window.addEventListener("focus", handleFocus);
    return () => window.removeEventListener("focus", handleFocus);
  }, []);

  // 실시간 메시지 확인 및 알림 표시
  useEffect(() => {
    const checkForNewMessages = async () => {
      try {
        const response = await fetch(API_ENDPOINTS.CHAT_ROOMS, {
          method: "GET",
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
            "Content-Type": "application/json",
          },
        });

        if (response.ok) {
          const data = await response.json();
          if (data.success && data.rooms) {
            console.log("📱 채팅방 상세 정보:", data.rooms);

            // 전체 읽지 않은 메시지 수 계산
            const totalUnreadCount = data.rooms.reduce((total, room) => {
              return total + (room.unread_count || 0);
            }, 0);

            // 전역 변수에 전체 unread count 저장
            window.globalTotalUnreadCount = totalUnreadCount;
            console.log("📱 전체 읽지 않은 메시지 수:", totalUnreadCount);

            // 읽지 않은 메시지가 있는 채팅방 확인
            data.rooms.forEach((room) => {
              console.log(
                `📱 채팅방 ${room.id}: unreadCount = ${room.unread_count}`
              );
              if (room.unread_count > 0) {
                console.log("📱 읽지 않은 메시지 발견:", room);

                // 전역 변수에 직접 알림 추가
                console.log("📱 전역 변수에 알림 추가 시도");

                if (window.addMessageNotification) {
                  // roomId를 포함한 알림 생성
                  const notification = {
                    id: `chat_${room.id}_${Date.now()}`,
                    type: "message",
                    message: `새로운 메시지 ${room.unread_count}개`,
                    time: new Date(),
                    isRead: false,
                    roomId: room.id,
                    partnerName: room.partner?.nickname || "Unknown",
                  };

                  window.globalNotifications = [
                    notification,
                    ...window.globalNotifications,
                  ];
                  window.globalHasNewNotification = true;

                  console.log("📱 채팅방 알림 추가 완료:", notification);
                } else {
                  console.log("📱 addMessageNotification 함수가 정의되지 않음");
                }
              }
            });
          }
        }
      } catch (error) {
        console.error("메시지 확인 중 오류:", error);
      }
    };

    // 5초마다 새로운 메시지 확인
    const interval = setInterval(checkForNewMessages, 5000);

    return () => clearInterval(interval);
  }, []);

  // 알림 상태 업데이트 감지
  useEffect(() => {
    const handleNotificationUpdate = () => {
      setHasNewNotification(window.globalHasNewNotification || false);
    };

    window.addEventListener("notificationUpdate", handleNotificationUpdate);
    return () =>
      window.removeEventListener(
        "notificationUpdate",
        handleNotificationUpdate
      );
  }, []);

  const handleChatClick = (chatId) => {
    navigate(`/chatting/${chatId}`);
  };

  const handleNavigation = (path) => {
    navigate(path);
  };

  const handleLogout = () => {
    localStorage.removeItem("isLoggedIn");
    localStorage.removeItem("user");
    localStorage.removeItem("token");
    navigate("/");
  };

  const handleNotificationClick = () => {
    navigate("/notifications");
  };

  return (
    <ChattingContainer>
      <ChattingHeader>
        <Logo>UniLingo</Logo>
        <NotificationContainer onClick={handleNotificationClick}>
          <NotificationIcon>
            <FiBell />
          </NotificationIcon>
          {hasNewNotification && <NotificationBadge></NotificationBadge>}
        </NotificationContainer>
      </ChattingHeader>

      <Sidebar />
      <ChattingMain>
        {chats.length > 0 ? (
          <ChatList>
            {chats.map((chat) => (
              <ChatItem key={chat.id} onClick={() => handleChatClick(chat.id)}>
                <PartnerAvatar>{chat.partner.avatar}</PartnerAvatar>
                <ChatInfo>
                  <PartnerName>{chat.partner.name}</PartnerName>
                  <LastMessage>{chat.lastMessage}</LastMessage>
                </ChatInfo>
                <ChatRightSection>
                  <TimeStamp>{chat.timestamp}</TimeStamp>
                  {chat.unreadCount > 0 && (
                    <UnreadBadge>{chat.unreadCount}</UnreadBadge>
                  )}
                </ChatRightSection>
              </ChatItem>
            ))}
          </ChatList>
        ) : (
          <EmptyState>
            <h2>{t("chatting.noMessages")}</h2>
            <p>{t("chatting.startConversation")}</p>
            <StartChatBtn onClick={() => navigate("/matching")}>
              {t("matching.findFriends")}
            </StartChatBtn>
          </EmptyState>
        )}
      </ChattingMain>
      <UnderBar />
    </ChattingContainer>
  );
};

export default Chatting;
