"use client";

import { useCallback, useEffect, useRef, useState } from "react";

export const useWebSocket = (url: string) => {
  const ws = useRef<WebSocket | null>(null);
  const [isConnected, setIsConnected] = useState(false);
  const [messages, setMessages] = useState<string[]>([]);

  useEffect(() => {
    ws.current = new WebSocket(url);

    ws.current.onopen = () => {
      console.log("WebSocket connected.");
      setIsConnected(true);
    };

    ws.current.onmessage = (e: MessageEvent) => {
      setMessages((prev) => [e.data, ...prev]);
    };

    ws.current.onerror = () => {
      console.log("WebSocket error");
      setIsConnected(false);
    };

    ws.current.onclose = () => {
      console.log("WebSocket disconnected.");
      setIsConnected(false);
    };

    return () => ws.current?.close();
  }, [url]);

  const sendMessage = useCallback((data: object) => {
    if (!ws.current) throw "WebSocket is not connected";

    if (ws.current.readyState === 1) {
      ws.current.send(JSON.stringify(data));
    }
  }, []);

  return { isConnected, messages, sendMessage };
};
 