"use client";

import { useEffect, useState } from "react";
import { WEBSOCKET_URL } from "../config";
import Canvas from "./Canvas";
import { useRouter } from "next/navigation";

export function RoomCanvas({ roomId }: { roomId: string }) {
  const [socket, setSocket] = useState<WebSocket | null>(null);
  const router = useRouter();

  useEffect(() => {
    const token = localStorage.getItem("token");

    if (!token) {
      router.push("/signin");
      return;
    }

    const ws = new WebSocket(`${WEBSOCKET_URL}?token=${token}`);

    ws.onopen = () => {
      setSocket(ws);

      ws.send(
        JSON.stringify({
          type: "join_room",
          roomId,
        }),
      );
    };

    ws.onclose = () => {
      console.log("WEBSOCKET CLOSED");
    };

    return () => {
      ws.close();
    };
  }, [roomId, router]);

  if (!socket) {
    return <div>Connecting to Websocket...</div>;
  }

  return <Canvas roomId={roomId} socket={socket} />;
}
