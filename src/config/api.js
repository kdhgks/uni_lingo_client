// API Configuration
const API_BASE_URL =
  process.env.REACT_APP_API_URL || "https://uni-lingo-backend.onrender.com/api";

const getBaseDomain = () => {
  try {
    const url = new URL(API_BASE_URL);
    return `${url.protocol}//${url.host}`;
  } catch (e) {
    // Fallback if URL parsing fails
    return API_BASE_URL.replace(/\/api\/?$/, "");
  }
};

/**
 * 이미지 URL을 처리하는 유틸리티 함수
 * /media/로 시작하는 상대 경로를 완전한 URL로 변환
 * @param {string} imagePath - 이미지 경로 (상대 경로 또는 완전한 URL)
 * @returns {string} - 완전한 이미지 URL
 */
export const getImageUrl = (imagePath) => {
  if (!imagePath || typeof imagePath !== "string") {
    return imagePath;
  }

  // 이미 완전한 URL인 경우 (http://, https://, data:image/)
  if (
    imagePath.startsWith("http://") ||
    imagePath.startsWith("https://") ||
    imagePath.startsWith("data:image/")
  ) {
    return imagePath;
  }

  // /media/로 시작하는 상대 경로인 경우
  if (imagePath.startsWith("/media/")) {
    const baseDomain = getBaseDomain();
    return `${baseDomain}${imagePath}`;
  }

  // 다른 상대 경로인 경우도 처리
  if (imagePath.startsWith("/")) {
    const baseDomain = getBaseDomain();
    return `${baseDomain}${imagePath}`;
  }

  // 그 외의 경우 (이모지 등)는 그대로 반환
  return imagePath;
};

export const API_ENDPOINTS = {
  // Authentication
  LOGIN: `${API_BASE_URL}/auth/login/`,
  SIGNUP: `${API_BASE_URL}/auth/signup/`,
  CHANGE_PASSWORD: `${API_BASE_URL}/users/change-password/`,
  DELETE_USER: `${API_BASE_URL}/users/delete/`,

  // Profile
  PROFILE: `${API_BASE_URL}/users/profile/`,
  PROFILE_UPDATE: `${API_BASE_URL}/users/profile/`,

  // Matching
  MATCHING_PARTNERS: `${API_BASE_URL}/matching/partners/`,
  MATCHING_STATUS: `${API_BASE_URL}/matching/status/`,
  MATCHING_REQUEST: `${API_BASE_URL}/matching/request/`,
  MATCHING_PARTNER: `${API_BASE_URL}/matching/partner/`,
  MATCHING_REQUESTS: `${API_BASE_URL}/matching/requests/`,
  AVAILABLE_PARTNERS: `${API_BASE_URL}/matching/available-partners/`,
  APPROVE_REQUEST: (requestId) =>
    `${API_BASE_URL}/matching/requests/${requestId}/approve/`,
  REJECT_REQUEST: (requestId) =>
    `${API_BASE_URL}/matching/requests/${requestId}/reject/`,

  // Chat
  CHAT_ROOMS: `${API_BASE_URL}/chat/rooms/`,
  CHAT_ROOM_PARTNER: (roomId) =>
    `${API_BASE_URL}/chat/rooms/${roomId}/partner/`,
  CHAT_ROOM_MESSAGES: (roomId) =>
    `${API_BASE_URL}/chat/rooms/${roomId}/messages/`,
  CHAT_ROOM_MESSAGES_READ: (roomId) =>
    `${API_BASE_URL}/chat/rooms/${roomId}/messages/read/`,
  CHAT_ROOM_MESSAGES_SEND: (roomId) =>
    `${API_BASE_URL}/chat/rooms/${roomId}/messages/send/`,
  CHAT_ROOM_HEART_REACTIONS: (roomId) =>
    `${API_BASE_URL}/chat/rooms/${roomId}/heart-reactions/`,
  CHAT_ROOM_REPORT: (roomId) => `${API_BASE_URL}/chat/rooms/${roomId}/report/`,
  CHAT_ROOM_LEAVE: (roomId) => `${API_BASE_URL}/chat/rooms/${roomId}/leave/`,
  ADMIN_REPORTS: `${API_BASE_URL}/admin/reports/`,

  // Notifications
  NOTIFICATIONS: `${API_BASE_URL}/notifications/`,
  MARK_NOTIFICATIONS_READ: `${API_BASE_URL}/notifications/mark-read/`,
};

export default API_ENDPOINTS;
