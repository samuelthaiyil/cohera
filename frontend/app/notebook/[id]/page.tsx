"use client";

import TooltipEditor from "@/components/TooltipEditor";
import { ClientCursorPosition } from "@/types/cursor";
import { useDebounce } from "@/hooks/useDebounce";
import { useWebSocket } from "@/hooks/useWebsocket";
import { useEffect, useState } from "react";


export default function Home() {
  const { hasTimeoutReached, updateLastKeyPress } = useDebounce(1000);
  const [value, setValue] = useState("");
  const { isConnected, messages, sendMessage } = useWebSocket(
    "ws://localhost:3001"
  );
  const [clientCursorPositions, setClientCursorPositions] = useState<
    ClientCursorPosition[]
  >([]);

  useEffect(() => {
    if (!isConnected) {
      return;
    }

    if (!messages[0]) {
      return;
    }

    const addClientCursorPosition = (
      clientCursorPosition: ClientCursorPosition
    ) => {
      setClientCursorPositions((prev) => [clientCursorPosition, ...prev]);
      return;
    };

    const updateClientCursorPosition = (
      clientCursorPosition: ClientCursorPosition
    ) => {
      setClientCursorPositions((prev) => {
        return prev.map((ccp) => {
          if (ccp.id === latestMessage.id) {
            return {
              ...ccp,
              position: {
                ...clientCursorPosition.position,
              },
            };
          }
          return ccp;
        });
      });
    };

    const latestMessage = JSON.parse(messages[0]);
    const existingClient = clientCursorPositions.find(
      (client) => client.id === latestMessage.id
    );

    existingClient
      ? updateClientCursorPosition(latestMessage)
      : addClientCursorPosition(latestMessage);
  }, [messages]);

  return (
    <>
      <div className="p-8 flex justify-center">
        <TooltipEditor
          clientCursorPositions={clientCursorPositions}
          value={value}
          onValueChange={setValue}
          hasKeyDownTimeoutReached={hasTimeoutReached}
          updateLastKeyPress={updateLastKeyPress}
          broadcastPosition={sendMessage}
        />
      </div>
    </>
  );
}

