"use client";

import TooltipEditor, { Client } from "@/components/TooltipEditor";
import { useDebounce } from "@/hooks/useDebounce";
import { useWebSocket } from "@/hooks/useWebsocket";
import { useEffect, useState } from "react";

export default function Home() {
  const { hasTimeoutReached, updateLastKeyPress } = useDebounce(1000);
  const [value, setValue] = useState("");
  const [tabNumber, setTabNumber] = useState<number | null>(null);
  const { isConnected, messages, sendMessage } = useWebSocket(
    "ws://localhost:3001"
  );
  const [clients, setClients] = useState<Client[]>([]);

  useEffect(() => {
    if (typeof window === "undefined") return;

    const TAB_ID_KEY = "cohera-tab-id";
    const TAB_COUNTER_KEY = "cohera-tab-counter";

    let storedTabNumber = sessionStorage.getItem(TAB_ID_KEY);

    if (!storedTabNumber) {
      const nextId = Number(localStorage.getItem(TAB_COUNTER_KEY) ?? "0") + 1;
      localStorage.setItem(TAB_COUNTER_KEY, String(nextId));
      sessionStorage.setItem(TAB_ID_KEY, String(nextId - 1));
      storedTabNumber = String(nextId - 1);
    }

    setTabNumber(Number(storedTabNumber));
  }, []);

  useEffect(() => {
    const updateClients = (): void => {
      if (!messages[0]) {
        return;
      }

      const latestMessage = JSON.parse(messages[0]);

      const existingClient = clients.find(
        (client) => client.id === latestMessage.clientId
      );

      if (!existingClient) {
        setClients((prev) => [
          {
            id: latestMessage.clientId,
            position: { top: latestMessage.top, left: latestMessage.left },
          },
          ...prev,
        ]);
        return;
      }

      setClients((prev) => {
        return prev.map((client) => {
          if (client.id === latestMessage.clientId) {
            return {
              ...client,
              position: {
                left: latestMessage.left,
                top: latestMessage.top,
              },
            };
          }
          return client;
        });
      });
    };

    updateClients();
  }, [messages]);

  return (
    <div className="p-8 flex justify-center">
      <TooltipEditor
        clients={clients}
        value={value}
        onValueChange={setValue}
        hasKeyDownTimeoutReached={hasTimeoutReached}
        updateLastKeyPress={updateLastKeyPress}
        tabNumber={tabNumber}
        broadcastPosition={sendMessage}
      />
    </div>
  );
}
