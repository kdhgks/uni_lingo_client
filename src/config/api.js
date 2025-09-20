// API Configuration
const API_BASE_URL =
  process.env.REACT_APP_API_URL || "http://localhost:8001/api";

export const API_ENDPOINTS = {
  // Authentication
  LOGIN: `${API_BASE_URL}/auth/login/`,
  SIGNUP: `${API_BASE_URL}/auth/signup/`,
  CHANGE_PASSWORD: `${API_BASE_URL}/users/change-password/`,
  DELETE_USER: `${API_BASE_URL}/users/delete/`,

  // Profile
  PROFILE: `${API_BASE_URL}/users/profile/`,

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
