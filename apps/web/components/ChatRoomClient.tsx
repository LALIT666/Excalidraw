"use client";

import { useEffect, useState } from "react";
import { useSocket } from "../hooks/useSocket";

export function ChatRoomClient({
  messages,
  id,
}: {
  messages: { message: string }[];
  id: string;
}) {
  const [chats, setChats] = useState(messages);
  const [currentMessage, setCurrentMessage] = useState("");
  const { socket, loading } = useSocket();

  useEffect(() => {
    if (socket && !loading) {
      socket.send(
        JSON.stringify({
          type: "join_room",
          roomId: id,
        }),
      );

      socket.onmessage = (event) => {
        const parsedData = JSON.parse(event.data);
        if (parsedData.type === "chat") {
          setChats((prevChats) => [
            ...prevChats,
            { message: parsedData.message },
          ]);
        }
      };
    }
  }, [socket, loading, id]);

  if (!socket) {
    console.log(`No Socket `);
    return <div>loading...</div>;
  }

  return (
    <div>
      {chats.map((chat) => (
        <div>{chat.message}</div>
      ))}

      <input
        type="text"
        value={currentMessage}
        onChange={(e) => {
          setCurrentMessage(e.target.value);
        }}
      />

      <button
        onClick={() => {
          socket.send(
            JSON.stringify({
              type: "chat",
              roomId: id,
              message: currentMessage,
            }),
          );
        }}
      ></button>
    </div>
  );
}
