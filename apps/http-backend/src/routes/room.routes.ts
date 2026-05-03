import { Router } from "express";
import {
  createRoom,
  getMessages,
  getRoomWithSlug,
} from "../controllers/room.controllers";

const roomRouter: Router = Router();

roomRouter.post("/", createRoom);
roomRouter.get("/chats/:roomId", getMessages);
roomRouter.get("/:rawSlug", getRoomWithSlug);

export default roomRouter;
