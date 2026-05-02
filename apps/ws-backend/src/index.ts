import { WebSocketServer } from "ws";
import jwt, { JwtPayload } from "jsonwebtoken";
import { JWT_SECRET } from "./config";

const wss = new WebSocketServer({ port: 8080 });

wss.on("connection", function connection(ws, request) {
  const usersUrl = request.url;

  if (!usersUrl) {
    return;
  }

  const queryParams = new URLSearchParams(usersUrl.split("?")[1]);
  const token = queryParams.get("token") || "fall-back-to-empty-string";
  const decode = jwt.verify(token, JWT_SECRET);

  if (!decode || !(decode as JwtPayload).userId) {
    ws.close();
    return;
  }
  ws.on("message", function message(data) {
    ws.send("pong");
  });
});
