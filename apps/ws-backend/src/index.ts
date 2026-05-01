import { WebSocketServer } from "ws";
import type { WebSocket } from "ws";

const wss = new WebSocketServer({ port: 8080 });

wss.on("connection", function connection(ws: WebSocket) {
  ws.on("message", function message(data) {
    ws.send("pong");
  });
});
