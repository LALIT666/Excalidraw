import axios from "axios";
import { BACKEND_ROOM_URL } from "../config";

type Coordinate = {
  x: number;
  y: number;
};

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
    }
  | {
      type: "diamond";
      x: number;
      y: number;
      width: number;
      height: number;
    }
  | {
      type: "eraser";
      points: Coordinate[];
    };

export async function canvasEngine(
  canvas: HTMLCanvasElement,
  roomId: string,
  socket: WebSocket,
  toolRef: { current: "rect" | "circle" | "diamond" | "eraser" },
) {
  const ctx = canvas.getContext("2d");
  if (!ctx) return;

  let existingShape: Shape[] = [];

  //eraser
  let currentPath: Coordinate[] = [];

  getExistingShapes(roomId).then((shapes) => {
    existingShape = shapes;
    clearCanvas(existingShape, canvas, ctx);
  });

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

    if (toolRef.current === "eraser") {
      currentPath = [];
      currentPath.push({ x: startX, y: startY });
    }
  });

  canvas.addEventListener("mouseup", (e) => {
    clicked = false;

    const rect = canvas.getBoundingClientRect();

    const currentX = e.clientX - rect.left;
    const currentY = e.clientY - rect.top;

    let shape: Shape | null = null;

    if (toolRef.current === "rect") {
      shape = {
        type: "rect",
        x: startX,
        y: startY,
        width: currentX - startX,
        height: currentY - startY,
      };
    } else if (toolRef.current === "circle") {
      shape = {
        type: "circle",
        centerX: startX,
        centerY: startY,
        radius: Math.abs(currentX - startX),
      };
    } else if (toolRef.current === "diamond") {
      shape = {
        type: "diamond",
        x: startX,
        y: startY,
        width: currentX - startX,
        height: currentY - startY,
      };
    } else if (toolRef.current === "eraser") {
      shape = {
        type: "eraser",
        points: [...currentPath],
      };
      currentPath = [];
    }

    if (shape) {
      existingShape.push(shape);

      socket.send(
        JSON.stringify({
          type: "chat",
          message: JSON.stringify({ shape }),
          roomId,
        }),
      );
    }
    clearCanvas(existingShape, canvas, ctx);
  });

  canvas.addEventListener("mousemove", (e) => {
    if (clicked) {
      const rect = canvas.getBoundingClientRect();

      const currentX = e.clientX - rect.left;
      const currentY = e.clientY - rect.top;

      clearCanvas(existingShape, canvas, ctx);
      ctx.strokeStyle = "white";
      ctx.lineWidth = 2;

      if (toolRef.current === "rect") {
        ctx.strokeRect(startX, startY, currentX - startX, currentY - startY);
      } else if (toolRef.current === "circle") {
        const radius = Math.abs(currentX - startX);

        clearCanvas(existingShape, canvas, ctx);

        ctx.beginPath();
        ctx.arc(startX, startY, radius, 0, 2 * Math.PI);

        ctx.stroke();
      } else if (toolRef.current === "diamond") {
        drawDiamond(ctx, startX, startY, currentX - startX, currentY - startY);
      } else if (toolRef.current === "eraser") {
        currentPath.push({ x: currentX, y: currentY });

        ctx.beginPath();
        ctx.moveTo(currentPath[0].x, currentPath[0].y);

        for (let i = 1; i < currentPath.length; i++) {
          ctx.lineTo(currentPath[i].x, currentPath[i].y);
        }

        ctx.stroke();
      }
    }
  });
}

function drawDiamond(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  width: number,
  height: number,
) {
  ctx.beginPath();

  ctx.moveTo(x + width / 2, y);
  ctx.lineTo(x + width, y + height / 2);
  ctx.lineTo(x + width / 2, y + height);
  ctx.lineTo(x, y + height / 2);
  ctx.closePath();
  ctx.strokeStyle = "white";
  ctx.lineWidth = 2;
  ctx.stroke();
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
      ctx.lineWidth = 2;
      ctx.strokeRect(shape.x, shape.y, shape.width, shape.height);
    } else if (shape.type === "circle") {
      ctx.strokeStyle = "white";
      ctx.lineWidth = 2;

      ctx.beginPath();
      ctx.arc(shape.centerX, shape.centerY, shape.radius, 0, 2 * Math.PI);
      ctx.stroke();
    } else if (shape.type === "diamond") {
      ctx.strokeStyle = "white";
      ctx.lineWidth = 2;
      drawDiamond(ctx, shape.x, shape.y, shape.width, shape.height);
    } else if (shape.type === "eraser") {
      if (shape.points.length > 0) {
        return;
      }
      ctx.strokeStyle = "black";
      ctx.lineWidth = 15;
      ctx.beginPath();

      ctx.moveTo(shape.points[0].x, shape.points[0].y);

      for (let i = 0; i < shape.points.length; i++)
        ctx.lineTo(shape.points[i].x, shape.points[i].y);

      ctx.stroke();
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
