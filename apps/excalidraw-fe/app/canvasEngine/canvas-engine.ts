import axios from "axios";
import { BACKEND_ROOM_URL } from "../config";

type Shape =
  | {
      type: "rect";
      x: number;
      y: number;
      width: number;
      height: number;
    }
  | {
      type: "circle";
      centerX: number;
      centerY: number;
      radius: number;
    };

export async function canvasEngine(
  canvas: HTMLCanvasElement,
  roomId: string,
  socket: WebSocket,
) {
  const ctx = canvas.getContext("2d");

  const existingShape: Shape[] = (await getExistingShapes(roomId)) ?? [];

  if (!ctx) return;

  socket.onmessage = (event) => {
    const eventData = JSON.parse(event.data);

    if (eventData.type == "chat") {
      const parsedShape = JSON.parse(eventData.message);
      existingShape.push(parsedShape.shape);
      clearCanvas(existingShape, canvas, ctx);
    }
  };

  clearCanvas(existingShape, canvas, ctx);
  let clicked = false;
  let startX = 0;
  let startY = 0;

  canvas.addEventListener("mousedown", (e) => {
    const rect = canvas.getBoundingClientRect();

    clicked = true;
    startX = e.clientX - rect.left;
    startY = e.clientY - rect.top;
  });

  canvas.addEventListener("mouseup", (e) => {
    clicked = false;

    const rect = canvas.getBoundingClientRect();

    const currentX = e.clientX - rect.left;
    const currentY = e.clientY - rect.top;

    const width = currentX - startX;
    const height = currentY - startY;

    const shape: Shape = {
      type: "rect",
      x: startX,
      y: startY,
      height,
      width,
    };

    existingShape.push(shape);
    socket.send(
      JSON.stringify({
        type: "chat",
        message: JSON.stringify({
          shape,
        }),
        roomId,
      }),
    );
  });

  canvas.addEventListener("mousemove", (e) => {
    if (clicked) {
      const rect = canvas.getBoundingClientRect();

      const currentX = e.clientX - rect.left;
      const currentY = e.clientY - rect.top;

      const width = currentX - startX;
      const height = currentY - startY;

      clearCanvas(existingShape, canvas, ctx);
      // white rectangle
      ctx.strokeStyle = "white";
      ctx.lineWidth = 2;
      ctx.strokeRect(startX, startY, width, height);
    }
  });
}

function clearCanvas(
  existingShapes: Shape[],
  canvas: HTMLCanvasElement,
  ctx: CanvasRenderingContext2D,
) {
  // clear + redraw background
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  ctx.fillStyle = "rgba(0,0,0,1)";
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  existingShapes.forEach((shape) => {
    if (shape.type === "rect") {
      ctx.strokeStyle = "white";
      ctx.strokeRect(shape.x, shape.y, shape.width, shape.height);
    }
  });
}

async function getExistingShapes(roomId: string): Promise<Shape[]> {
  try {
    const token = localStorage.getItem("token");
    console.log({ token });

    if (!token) {
      console.error("No token found");
      return [];
    }

    const res = await axios.get(`${BACKEND_ROOM_URL}/chats/${roomId}`, {
      headers: { Authorization: `Bearer ${token}` },
    });

    console.log(res.data.data);

    const messages = res.data.data;

    if (!Array.isArray(messages)) {
      return [];
    }

    const shapes = messages.map((x: { message: string }) => {
      const messageData = JSON.parse(x.message);
      return messageData.shape;
    });

    return shapes;
  } catch (error) {
    console.error("Error in fetching shapes:", error);
    return [];
  }
}
