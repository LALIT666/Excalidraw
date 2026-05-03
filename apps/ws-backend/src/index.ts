import { WebSocketServer, WebSocket } from "ws";

import jwt from "jsonwebtoken";
import { JWT_SECRET } from "@repo/backend-common/config";

declare module "ws" {
  interface WebSocket {
    userId?: string;
  }
}

const wss = new WebSocketServer({ port: 8080 });

const roomRegister = new Map<string, Set<WebSocket>>();

wss.on("connection", function connection(ws: WebSocket, request) {
  const usersUrl = request.url;

  if (!usersUrl) {
    ws.close();
    return;
  }

  const queryParams = new URLSearchParams(usersUrl.split("?")[1]);
  const token = queryParams.get("token") || "";

  try {
    const decode = jwt.verify(token, JWT_SECRET) as { userId?: string };

    if (typeof decode === "string" || !decode || !decode.userId) {
      ws.close();
      return;
    }

    ws.userId = decode.userId;
  } catch (error) {
    console.error("Error decoding JWT in ws-backend:", error);
    ws.close();
    return;
  }

  ws.on("message", function message(data) {
    let parseData;

    try {
      parseData = JSON.parse(data.toString());
    } catch (error) {
      ws.send(JSON.stringify({ type: "error", message: "Invalid JSON" }));
      return;
    }

    if (parseData.type === "join_room") {
      const { roomId } = parseData;
      if (!roomId) return;

      if (!roomRegister.has(roomId)) {
        roomRegister.set(roomId, new Set());
      }

      roomRegister.get(roomId)!.add(ws);
      ws.send(JSON.stringify({ type: "room_joined", roomId }));
    } else if (parseData.type === "chat") {
      const { roomId, message } = parseData;
      if (!roomId || !message) return;

      const room = roomRegister.get(roomId);
      if (!room) return;

      const payload = JSON.stringify({
        type: "chat",
        message: message,
        userId: ws.userId,
      });

      // Broadcast to everyone in the room EXCEPT the sender
      for (const client of room) {
        if (client !== ws && client.readyState === WebSocket.OPEN) {
          client.send(payload);
        }
      }
    } else if (parseData.type === "ping") {
      ws.send(JSON.stringify({ type: "pong" }));
    } else {
      ws.send(
        JSON.stringify({ type: "error", message: "Unknown message type" }),
      );
    }
  });

  ws.on("close", function close() {
    console.log(`Connection closed for user: ${ws.userId}`);

    // Clean up: remove user from all rooms
    roomRegister.forEach((clients, roomId) => {
      if (clients.has(ws)) {
        clients.delete(ws);

        // If the room is now empty, delete the room from the Map to save memory
        if (clients.size === 0) {
          roomRegister.delete(roomId);
        }
      }
    });
  });
});
