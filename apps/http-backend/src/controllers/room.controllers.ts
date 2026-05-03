import { RoomSchema } from "@repo/common/schema";
import type { Request, Response } from "express";
import { failure, serverError, successFunc } from "../helperFunction";
import { prisma } from "db/client";

export async function createRoom(req: Request, res: Response) {
  try {
    const parsedRoomData = RoomSchema.safeParse(req.body);

    if (!parsedRoomData.success) {
      return res
        .status(400)
        .json(
          failure(JSON.stringify(parsedRoomData.error.flatten().formErrors)),
        );
    }

    const { roomname } = parsedRoomData.data;
    const userId = req.userId;

    if (!userId) {
      return res
        .status(401)
        .json(failure("Unauthorized: user is not allowed!⚠️"));
    }

    const newRoom = await prisma.room.create({
      data: {
        slug: roomname,
        admin: {
          connect: { id: userId },
        },
      },
    });

    return res
      .status(201)
      .json(
        successFunc(`room created successfully with roomId: ${newRoom.id}`),
      );
  } catch (error: any) {
    if (error.code === "P2002") {
      //ye error prisma error hai hum pakka kahae sakatae hai ki yaha par room exist karta hai
      return res
        .status(409)
        .json(failure("Room already exists with this name"));
    }

    console.error(`Error in createRoom:`, error);
    return res.status(500).json(failure("Internal Server Error"));
  }
}

export async function getMessages(req: Request, res: Response) {
  try {
    const roomId = Number(req.params.roomId);

    if (isNaN(roomId)) {
      return res.status(400).json(failure("Invalid roomId"));
    }

    const roomExists = await prisma.room.findUnique({
      where: {
        id: roomId,
      },
    });

    if (!roomExists) {
      res.status(404).json(failure("Room does not exists"));
    }

    const messages = await prisma.chat.findMany({
      where: {
        roomId,
      },
      orderBy: {
        id: "desc",
      },
      take: 50,
    });

    return res.status(200).json(successFunc(messages));
  } catch (error) {
    console.error("Error in getMessages:", error);
    return res.status(500).json(failure("Internal server error"));
  }
}

export async function getRoomWithSlug(req: Request, res: Response) {
  try {
    const { rawSlug } = req.params;

    const slug = Array.isArray(rawSlug) ? rawSlug[0] : rawSlug;

    if (!slug) {
      return res.status(400).json(failure("Slug is required"));
    }

    const room = await prisma.room.findUnique({
      where: {
        slug,
      },
    });

    if (!room) {
      return res.status(404).json(failure("Room not found"));
    }

    return res.status(200).json(successFunc(room));
  } catch (error) {
    console.error("Error in getRoomWithSlug:", error);
    return res.status(500).json(serverError());
  }
}
