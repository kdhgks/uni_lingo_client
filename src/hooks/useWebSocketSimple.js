import { useState, useEffect, useRef, useCallback } from "react";

export const useWebSocketSimple = (url, options = {}) => {
  const [isConnected, setIsConnected] = useState(false);
  const [lastMessage, setLastMessage] = useState(null);
  const [error, setError] = useState(null);

  const wsRef = useRef(null);
  const reconnectTimeoutRef = useRef(null);
  const reconnectAttemptsRef = useRef(0);
  const isConnectingRef = useRef(false); // 연결 중인지 추적
  const connectionIdRef = useRef(null); // 연결 ID로 중복 방지
  const maxReconnectAttempts = options.maxReconnectAttempts || 5;
  const reconnectInterval = options.reconnectInterval || 3000;

  const connect = useCallback(() => {
    if (!url) return;

    // 연결 ID 생성
    const currentConnectionId = `${Date.now()}_${Math.random()}`;

    // 이미 연결 중이면 중복 연결 방지
    if (
      isConnectingRef.current ||
      (wsRef.current && wsRef.current.readyState === WebSocket.OPEN)
    ) {
      return;
    }

    // 기존 연결이 있으면 정리
    if (wsRef.current) {
      wsRef.current.close();
      wsRef.current = null;
    }

    isConnectingRef.current = true;
    connectionIdRef.current = currentConnectionId;

    try {
      const ws = new WebSocket(url);
      wsRef.current = ws;

      ws.onopen = (event) => {
        // 연결 ID 확인 - 다른 연결이면 무시
        if (connectionIdRef.current !== currentConnectionId) {
          return;
        }

        setIsConnected(true);
        setError(null);
        reconnectAttemptsRef.current = 0;
        isConnectingRef.current = false; // 연결 완료
        options.onOpen?.(event);
      };

      ws.onmessage = (event) => {
        try {
          const data = JSON.parse(event.data);
          setLastMessage(data);
          options.onMessage?.(data);
        } catch (e) {
          setLastMessage(event.data);
          options.onMessage?.(event.data);
        }
      };

      ws.onclose = (event) => {
        // 연결 ID 확인 - 다른 연결이면 무시
        if (connectionIdRef.current !== currentConnectionId) {
          return;
        }

        setIsConnected(false);
        wsRef.current = null;
        isConnectingRef.current = false; // 연결 종료
        options.onClose?.(event);

        // 정상 종료가 아니면 재연결 시도
        if (
          event.code !== 1000 &&
          reconnectAttemptsRef.current < maxReconnectAttempts
        ) {
          reconnectAttemptsRef.current++;
          reconnectTimeoutRef.current = setTimeout(() => {
            connect();
          }, reconnectInterval);
        }
      };

      ws.onerror = (event) => {
        // 연결 ID 확인 - 다른 연결이면 무시
        if (connectionIdRef.current !== currentConnectionId) {
          return;
        }

        setError(event);
        isConnectingRef.current = false; // 연결 실패
        options.onError?.(event);
      };
    } catch (e) {
      setError(e);
      isConnectingRef.current = false; // 연결 실패
    }
  }, [url, maxReconnectAttempts, reconnectInterval]);

  const disconnect = useCallback(() => {
    if (reconnectTimeoutRef.current) {
      clearTimeout(reconnectTimeoutRef.current);
      reconnectTimeoutRef.current = null;
    }

    if (wsRef.current) {
      wsRef.current.close(1000, "사용자 요청");
      wsRef.current = null;
    }

    setIsConnected(false);
    isConnectingRef.current = false;
    connectionIdRef.current = null;
    reconnectAttemptsRef.current = maxReconnectAttempts; // 재연결 방지
  }, [maxReconnectAttempts]);

  const sendMessage = useCallback((message) => {
    if (wsRef.current && wsRef.current.readyState === WebSocket.OPEN) {
      const data =
        typeof message === "string" ? message : JSON.stringify(message);
      wsRef.current.send(data);
      return true;
    }
    return false;
  }, []);

  // URL이 변경되거나 컴포넌트가 마운트될 때 연결
  useEffect(() => {
    if (!url) return;

    connect();

    return () => {
      disconnect();
    };
  }, [url]); // 의존성 배열에서 connect, disconnect 제거

  // 컴포넌트 언마운트 시 정리
  useEffect(() => {
    return () => {
      if (reconnectTimeoutRef.current) {
        clearTimeout(reconnectTimeoutRef.current);
      }
      if (wsRef.current) {
        wsRef.current.close();
      }
    };
  }, []);

  return {
    isConnected,
    lastMessage,
    error,
    sendMessage,
    connect,
    disconnect,
  };
};

export default useWebSocketSimple;
