import { useState, useEffect, useRef, useCallback } from "react";

/**
 * useWebSocketPro
 * - 안정적인 재연결(지수 백오프 + 지터)
 * - 단일 리스너 보장/정리
 * - heartbeat(ping/pong)
 * - 오프라인/가시성 이벤트 처리
 * - send 큐(OPEN 전 메시지 버퍼링)
 */
export const useWebSocket = (url, opts = {}) => {
  const optionsRef = useRef(opts);
  useEffect(() => {
    optionsRef.current = opts;
  }, [opts]);

  const wsRef = useRef(null);
  const reconnectTimerRef = useRef(null);
  const heartbeatTimerRef = useRef(null);
  const pongTimerRef = useRef(null);
  const manualCloseRef = useRef(false); // 사용자가 끊었는지 여부
  const attemptsRef = useRef(0);
  const isConnectingRef = useRef(false); // 연결 중인지 추적

  const [isConnected, setIsConnected] = useState(false);
  const [lastMessage, setLastMessage] = useState(null);
  const [error, setError] = useState(null);

  // 재연결 설정
  const MAX_ATTEMPTS = optionsRef.current.maxReconnectAttempts ?? 8;
  const MAX_DELAY_MS = optionsRef.current.maxReconnectDelay ?? 30000;

  // 전송 큐 (OPEN 전 메시지 저장)
  const sendQueueRef = useRef([]);

  const clearTimers = () => {
    if (reconnectTimerRef.current) {
      clearTimeout(reconnectTimerRef.current);
      reconnectTimerRef.current = null;
    }
    if (heartbeatTimerRef.current) {
      clearInterval(heartbeatTimerRef.current);
      heartbeatTimerRef.current = null;
    }
    if (pongTimerRef.current) {
      clearTimeout(pongTimerRef.current);
      pongTimerRef.current = null;
    }
  };

  const scheduleReconnect = useCallback(() => {
    if (manualCloseRef.current) return; // 수동 종료면 재연결 X
    if (!url) return; // URL 없으면 X
    if (attemptsRef.current >= MAX_ATTEMPTS) return; // 횟수 초과

    attemptsRef.current += 1;
    const base = Math.min(1000 * 2 ** attemptsRef.current, MAX_DELAY_MS);
    const jitter = Math.floor(Math.random() * 400); // ± 지터
    const delay = Math.max(1000, base - jitter);

    reconnectTimerRef.current = setTimeout(() => {
      connect(); // 재시도
    }, delay);

    optionsRef.current.onReconnectAttempt?.({
      attempt: attemptsRef.current,
      delay,
    });
  }, [url, MAX_ATTEMPTS, MAX_DELAY_MS]);

  const startHeartbeat = useCallback(() => {
    const PING_INTERVAL = optionsRef.current.heartbeatInterval ?? 25000; // 25s
    const PONG_TIMEOUT = optionsRef.current.pongTimeout ?? 8000; // 8s

    // 주기적 ping
    heartbeatTimerRef.current = setInterval(() => {
      const ws = wsRef.current;
      if (!ws || ws.readyState !== WebSocket.OPEN) return;

      try {
        ws.send(JSON.stringify({ type: "ping", t: Date.now() }));
      } catch {}

      // pong 대기
      if (pongTimerRef.current) clearTimeout(pongTimerRef.current);
      pongTimerRef.current = setTimeout(() => {
        // pong 못 받으면 연결 비정상 → 강제 종료해서 재연결 유도
        try {
          ws.close(4000, "pong timeout");
        } catch {}
      }, PONG_TIMEOUT);
    }, PING_INTERVAL);
  }, []);

  const handleOpen = useCallback(
    (ev) => {
      setIsConnected(true);
      setError(null);
      attemptsRef.current = 0;
      isConnectingRef.current = false; // 연결 완료
      optionsRef.current.onOpen?.(ev);

      // 큐 flush
      if (sendQueueRef.current.length) {
        const ws = wsRef.current;
        try {
          for (const msg of sendQueueRef.current) ws.send(msg);
        } catch (e) {
          /* send 실패는 onerror에서 처리 */
        }
        sendQueueRef.current = [];
      }

      // heartbeat 시작
      startHeartbeat();
    },
    [startHeartbeat]
  );

  const handleMessage = useCallback((ev) => {
    try {
      const data = JSON.parse(ev.data);
      // 서버에서 pong을 보낸다면 여기서 처리
      if (data?.type === "pong" && pongTimerRef.current) {
        clearTimeout(pongTimerRef.current);
        pongTimerRef.current = null;
        return; // 상태 업데이트 불필요
      }
      setLastMessage(data);
      optionsRef.current.onMessage?.(data);
    } catch (e) {
      // JSON이 아니면 그대로 전달
      setLastMessage(ev.data);
      optionsRef.current.onMessage?.(ev.data);
    }
  }, []);

  const handleClose = useCallback(
    (ev) => {
      setIsConnected(false);
      isConnectingRef.current = false; // 연결 종료
      optionsRef.current.onClose?.(ev);
      clearTimers();
      // 정상 종료(1000) 또는 수동 종료면 재연결 안 함
      if (manualCloseRef.current || ev.code === 1000) return;
      scheduleReconnect();
    },
    [scheduleReconnect]
  );

  const handleError = useCallback((err) => {
    setError(err);
    optionsRef.current.onError?.(err);
  }, []);

  const attachListeners = useCallback(
    (ws) => {
      ws.addEventListener("open", handleOpen);
      ws.addEventListener("message", handleMessage);
      ws.addEventListener("close", handleClose);
      ws.addEventListener("error", handleError);
    },
    [handleOpen, handleMessage, handleClose, handleError]
  );

  const detachListeners = useCallback(
    (ws) => {
      if (!ws) return;
      ws.removeEventListener("open", handleOpen);
      ws.removeEventListener("message", handleMessage);
      ws.removeEventListener("close", handleClose);
      ws.removeEventListener("error", handleError);
    },
    [handleOpen, handleMessage, handleClose, handleError]
  );

  const connect = useCallback(() => {
    if (!url) {
      return;
    }

    // 기존 연결이 있으면 먼저 정리
    if (wsRef.current) {
      detachListeners(wsRef.current);
      try {
        wsRef.current.close(1000, "URL changed");
      } catch (e) {
        // 이미 닫힌 경우 무시
      }
      wsRef.current = null;
    }

    manualCloseRef.current = false; // 새 연결이므로 플래그 초기화
    clearTimers();

    try {
      const ws = new WebSocket(url);
      wsRef.current = ws;
      attachListeners(ws);
    } catch (e) {
      setError(e);
      scheduleReconnect();
    }
  }, [url, attachListeners, detachListeners, scheduleReconnect]);

  const disconnect = useCallback(() => {
    manualCloseRef.current = true;
    clearTimers();
    const ws = wsRef.current;
    if (ws) {
      detachListeners(ws);
      try {
        ws.close(1000, "client disconnect");
      } catch {}
    }
    wsRef.current = null;
    setIsConnected(false);
  }, [detachListeners]);

  const sendMessage = useCallback((obj) => {
    const msg = typeof obj === "string" ? obj : JSON.stringify(obj);
    const ws = wsRef.current;

    if (ws && ws.readyState === WebSocket.OPEN) {
      try {
        ws.send(msg);
        return true;
      } catch (e) {
        setError(e);
        return false;
      }
    }
    // 아직 OPEN 전이면 큐에 저장
    sendQueueRef.current.push(msg);
    return false;
  }, []);

  // URL 변경/마운트 시 연결
  useEffect(() => {
    if (!url) return;

    // 이미 연결 중이면 중복 연결 방지
    if (isConnectingRef.current) return;

    // 기존 연결 정리
    const ws = wsRef.current;
    if (ws) {
      detachListeners(ws);
      try {
        ws.close(1000, "URL changed");
      } catch (e) {
        // 이미 닫힌 경우 무시
      }
      wsRef.current = null;
    }

    isConnectingRef.current = true;
    manualCloseRef.current = false;
    clearTimers();

    // 새 연결 시도
    try {
      const newWs = new WebSocket(url);
      wsRef.current = newWs;
      attachListeners(newWs);
    } catch (e) {
      setError(e);
      scheduleReconnect();
      isConnectingRef.current = false;
    }

    return () => {
      manualCloseRef.current = true;
      isConnectingRef.current = false;
      clearTimers();
      const ws = wsRef.current;
      if (ws) {
        detachListeners(ws);
        try {
          ws.close(1000, "component unmount");
        } catch (e) {
          // 이미 닫힌 경우 무시
        }
      }
      wsRef.current = null;
      setIsConnected(false);
    };
  }, [url]); // URL만 의존성으로 설정

  // 온라인/오프라인
  useEffect(() => {
    const onOnline = () => {
      if (!isConnected && !manualCloseRef.current) connect();
    };
    const onOffline = () => {
      /* 오프라인일 땐 대기 */
    };
    window.addEventListener("online", onOnline);
    window.addEventListener("offline", onOffline);
    return () => {
      window.removeEventListener("online", onOnline);
      window.removeEventListener("offline", onOffline);
    };
  }, [isConnected, connect]);

  // 탭 가시성: 숨김→보임 전환 시 끊겨있으면 재연결
  useEffect(() => {
    const onVisibility = () => {
      if (document.visibilityState === "visible") {
        const ws = wsRef.current;
        if (!ws || ws.readyState !== WebSocket.OPEN) {
          if (!manualCloseRef.current) connect();
        }
      }
    };
    document.addEventListener("visibilitychange", onVisibility);
    return () => document.removeEventListener("visibilitychange", onVisibility);
  }, [connect]);

  return {
    socket: wsRef.current,
    isConnected,
    lastMessage,
    error,
    sendMessage,
    connect,
    disconnect,
  };
};
