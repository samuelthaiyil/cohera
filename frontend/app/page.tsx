"use client";

import TooltipEditor, { Client } from "@/components/TooltipEditor";
import { useDebounce } from "@/hooks/useDebounce";
import { useWebSocket } from "@/hooks/useWebsocket";
import { useUser } from "@clerk/nextjs";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export default function Home() {
  const { hasTimeoutReached, updateLastKeyPress } = useDebounce(1000);
  const [value, setValue] = useState("");
  const { isConnected, messages, sendMessage } = useWebSocket(
    "ws://localhost:3001"
  );
  const [clients, setClients] = useState<Client[]>([]);
  const { isSignedIn, user } = useUser();
  const router  = useRouter();

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

  if (!isSignedIn) {
    router.push('/signin');
  }

  return (
    <div className="p-8 flex justify-center">
      <TooltipEditor
        clients={clients}
        value={value}
        onValueChange={setValue}
        hasKeyDownTimeoutReached={hasTimeoutReached}
        updateLastKeyPress={updateLastKeyPress}
        broadcastPosition={sendMessage}
      />
    </div>
  );
}
