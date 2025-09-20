// 프로덕션 환경 API 설정
export const API_CONFIG = {
  // 프로덕션 환경
  production: {
    API_BASE_URL: "https://uni-lingo-client.vercel.app/api",
    WS_BASE_URL: "wss://uni-lingo-client.vercel.app/ws",
  },

  // 개발 환경
  development: {
    API_BASE_URL: "http://localhost:8001/api",
    WS_BASE_URL: "ws://localhost:8001/ws",
  },
};

// 현재 환경에 따른 설정 선택
const currentEnv = process.env.NODE_ENV || "development";
const config = API_CONFIG[currentEnv];

export const API_BASE_URL = config.API_BASE_URL;
export const WS_BASE_URL = config.WS_BASE_URL;

// API 엔드포인트들
export const API_ENDPOINTS = {
  LOGIN: `${API_BASE_URL}/auth/login/`,
  SIGNUP: `${API_BASE_URL}/auth/signup/`,
  PROFILE: `${API_BASE_URL}/users/profile/`,
  CHANGE_PASSWORD: `${API_BASE_URL}/users/change-password/`,
  DELETE_USER: `${API_BASE_URL}/users/delete/`,
  GET_USER_PROFILE: `${API_BASE_URL}/users/profile/`,
  GET_PARTNERS: `${API_BASE_URL}/users/partners/`,
  REQUEST_MATCHING: `${API_BASE_URL}/matching/request/`,
  GET_MATCHING_STATUS: `${API_BASE_URL}/matching/status/`,
  SIMULATE_MATCHING: `${API_BASE_URL}/matching/simulate/`,
  GET_ALL_MATCHING_REQUESTS: `${API_BASE_URL}/matching/admin/requests/`,
  GET_AVAILABLE_PARTNERS: `${API_BASE_URL}/matching/admin/available-partners/`,
  APPROVE_MATCHING_REQUEST: `${API_BASE_URL}/matching/admin/approve/`,
  REJECT_MATCHING_REQUEST: `${API_BASE_URL}/matching/admin/reject/`,
  GET_MATCHED_PARTNER: `${API_BASE_URL}/matching/matched-partner/`,
  GET_NOTIFICATIONS: `${API_BASE_URL}/notifications/`,
  MARK_NOTIFICATIONS_READ: `${API_BASE_URL}/notifications/mark-read/`,
  GET_CHAT_ROOMS: `${API_BASE_URL}/chat/rooms/`,
  GET_CHAT_MESSAGES: `${API_BASE_URL}/chat/messages/`,
  SEND_MESSAGE: `${API_BASE_URL}/chat/send-message/`,
};

// WebSocket URL 생성 함수
export const getWebSocketURL = (roomId) => {
  return `${WS_BASE_URL}/chat/${roomId}/`;
};
