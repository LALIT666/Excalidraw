import axios from "axios";
import { BACKEND_ROOM_URL } from "../config";

// ---------- TYPES ----------

type Coordinate = {
  x: number;
  y: number;
};

type Shape =
  | {
      type: "rect";
      id: string;
      x: number;
      y: number;
      width: number;
      height: number;
    }
  | {
      type: "circle";
      id: string;
      centerX: number;
      centerY: number;
      radius: number;
    }
  | {
      type: "diamond";
      id: string;
      x: number;
      y: number;
      width: number;
      height: number;
    }
  | {
      type: "pencil";
      id: string;
      points: Coordinate[];
    }
  | {
      // Eraser ke points — ye bhi save hoga taaki reload pe bhi erase dikhey
      type: "eraser";
      id: string;
      points: Coordinate[];
      size: number;
    }
  | {
      type: "deleteShape";
      targetId: string;
    };

const ERASER_SIZE = 20; // Eraser kitna bada hoga

// ---------- MAIN ENGINE ----------

export async function canvasEngine(
  canvas: HTMLCanvasElement,
  roomId: string,
  socket: WebSocket,
  toolRef: {
    current: "rect" | "circle" | "diamond" | "eraser" | "pencil" | "objEraser";
  },
) {
  const ctx = canvas.getContext("2d");
  if (!ctx) return;

  let existingShapes: Shape[] = [];
  let currentPath: Coordinate[] = [];
  let clicked = false;
  let startX = 0;
  let startY = 0;

  // ---------- SHAPES LOAD KARO ----------
  const shapesFromServer = await getExistingShapes(roomId);
  existingShapes = shapesFromServer;
  redrawCanvas(existingShapes, canvas, ctx);

  // ---------- SOCKET MESSAGES ----------
  socket.onmessage = (event) => {
    const eventData = JSON.parse(event.data);

    if (eventData.type === "chat") {
      const parsed = JSON.parse(eventData.message);

      if (parsed.type === "deleteShape") {
        existingShapes = existingShapes.filter((s) => {
          if ("id" in s) return s.id !== parsed.targetId;
          return true;
        });
      } else if (parsed.shape) {
        existingShapes.push(parsed.shape);
      }

      redrawCanvas(existingShapes, canvas, ctx);
    }
  };

  // ---------- MOUSE DOWN ----------
  canvas.addEventListener("mousedown", (e) => {
    const rect = canvas.getBoundingClientRect();
    clicked = true;
    startX = e.clientX - rect.left;
    startY = e.clientY - rect.top;

    if (toolRef.current === "pencil" || toolRef.current === "eraser") {
      currentPath = [];
      currentPath.push({ x: startX, y: startY });
    }

    // Eraser: pehla point pe bhi erase karo
    if (toolRef.current === "eraser") {
      eraseAtPoint(ctx, startX, startY, ERASER_SIZE);
    }
  });

  // ---------- MOUSE MOVE ----------
  canvas.addEventListener("mousemove", (e) => {
    const rect = canvas.getBoundingClientRect();
    const currentX = e.clientX - rect.left;
    const currentY = e.clientY - rect.top;

    // --- ERASER TOOL ---
    if (toolRef.current === "eraser") {
      canvas.style.cursor = "none";

      if (clicked) {
        // Path mein point add karo
        currentPath.push({ x: currentX, y: currentY });

        // Us point pe erase karo — background color se paint karo
        eraseAtPoint(ctx, currentX, currentY, ERASER_SIZE);
      }

      // Eraser cursor dikhao (red square)
      // Pehle cursor area clear karo aur redraw karo

      drawEraserCursor(ctx, currentX, currentY, ERASER_SIZE);

      return;
    } else if (toolRef.current === "objEraser") {
      canvas.style.cursor = "pointer";
    } else {
      canvas.style.cursor = "crosshair";
    }

    if (!clicked) return;

    // Shapes preview ke liye redraw
    redrawCanvas(existingShapes, canvas, ctx);
    ctx.strokeStyle = "white";
    ctx.lineWidth = 2;

    if (toolRef.current === "rect") {
      ctx.strokeRect(startX, startY, currentX - startX, currentY - startY);
    } else if (toolRef.current === "circle") {
      const radius = Math.abs(currentX - startX);
      ctx.beginPath();
      ctx.arc(startX, startY, radius, 0, 2 * Math.PI);
      ctx.strokeStyle = "white";
      ctx.lineWidth = 2;
      ctx.stroke();
    } else if (toolRef.current === "diamond") {
      drawDiamond(ctx, startX, startY, currentX - startX, currentY - startY);
    } else if (toolRef.current === "pencil") {
      currentPath.push({ x: currentX, y: currentY });

      ctx.beginPath();
      ctx.moveTo(currentPath[0].x, currentPath[0].y);
      for (let i = 1; i < currentPath.length; i++) {
        ctx.lineTo(currentPath[i].x, currentPath[i].y);
      }
      ctx.strokeStyle = "white";
      ctx.lineWidth = 2;
      ctx.stroke();
    }
  });

  // ---------- MOUSE UP ----------
  canvas.addEventListener("mouseup", (e) => {
    if (!clicked) return;
    clicked = false;

    const rect = canvas.getBoundingClientRect();
    const currentX = e.clientX - rect.left;
    const currentY = e.clientY - rect.top;

    let shape: Shape | null = null;

    if (toolRef.current === "rect") {
      shape = {
        type: "rect",
        id: crypto.randomUUID(),
        x: startX,
        y: startY,
        width: currentX - startX,
        height: currentY - startY,
      };
    } else if (toolRef.current === "circle") {
      shape = {
        type: "circle",
        id: crypto.randomUUID(),
        centerX: startX,
        centerY: startY,
        radius: Math.abs(currentX - startX),
      };
    } else if (toolRef.current === "diamond") {
      shape = {
        type: "diamond",
        id: crypto.randomUUID(),
        x: startX,
        y: startY,
        width: currentX - startX,
        height: currentY - startY,
      };
    } else if (toolRef.current === "pencil") {
      shape = {
        type: "pencil",
        id: crypto.randomUUID(),
        points: [...currentPath],
      };
      currentPath = [];
    } else if (toolRef.current === "eraser") {
      // Eraser path save karo — taaki reload pe bhi erase dikhe
      if (currentPath.length > 0) {
        shape = {
          type: "eraser",
          id: crypto.randomUUID(),
          points: [...currentPath],
          size: ERASER_SIZE,
        };
      }
      currentPath = [];
      redrawCanvas(existingShapes, canvas, ctx);
      // Shape add hone ke baad return nahi karenge, neeche add hoga
    } else if (toolRef.current === "objEraser") {
      const shapeToDelete = findShapeAtPoint(
        existingShapes,
        currentX,
        currentY,
      );

      if (shapeToDelete && "id" in shapeToDelete) {
        existingShapes = existingShapes.filter((s) => {
          if ("id" in s) return s.id !== shapeToDelete.id;
          return true;
        });

        socket.send(
          JSON.stringify({
            type: "chat",
            message: JSON.stringify({
              type: "deleteShape",
              targetId: shapeToDelete.id,
            }),
            roomId,
          }),
        );

        redrawCanvas(existingShapes, canvas, ctx);
      }
      return;
    }

    if (shape) {
      existingShapes.push(shape);

      socket.send(
        JSON.stringify({
          type: "chat",
          message: JSON.stringify({ shape }),
          roomId,
        }),
      );

      redrawCanvas(existingShapes, canvas, ctx);
    }
  });

  // ---------- MOUSE LEAVE ----------
  canvas.addEventListener("mouseleave", () => {
    if (toolRef.current === "eraser") {
      redrawCanvas(existingShapes, canvas, ctx);
    }
  });
}

// ---------- ERASER HELPERS ----------

// Ek point pe erase karo — black circle paint karo
function eraseAtPoint(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  size: number,
) {
  ctx.save();
  ctx.beginPath();
  ctx.arc(x, y, size / 2, 0, Math.PI * 2);
  ctx.fillStyle = "black"; // Background color se paint — erase effect
  ctx.fill();
  ctx.restore();
}

// Eraser cursor — red border wala square
function drawEraserCursor(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  size: number,
) {
  ctx.save();
  ctx.strokeStyle = "red";
  ctx.lineWidth = 2;
  ctx.strokeRect(x - size / 2, y - size / 2, size, size);
  ctx.restore();
}

// ---------- FIND SHAPE AT POINT ----------

function findShapeAtPoint(
  shapes: Shape[],
  px: number,
  py: number,
): Shape | null {
  for (let i = shapes.length - 1; i >= 0; i--) {
    const shape = shapes[i];

    if (shape.type === "rect") {
      const x = Math.min(shape.x, shape.x + shape.width);
      const y = Math.min(shape.y, shape.y + shape.height);
      const w = Math.abs(shape.width);
      const h = Math.abs(shape.height);
      if (isPointInRect(px, py, x, y, w, h)) return shape;
    } else if (shape.type === "circle") {
      if (isPointInCircle(px, py, shape.centerX, shape.centerY, shape.radius))
        return shape;
    } else if (shape.type === "diamond") {
      const centerX = shape.x + shape.width / 2;
      const centerY = shape.y + shape.height / 2;
      const halfW = Math.abs(shape.width / 2);
      const halfH = Math.abs(shape.height / 2);
      if (isPointInDiamond(px, py, centerX, centerY, halfW, halfH))
        return shape;
    } else if (shape.type === "pencil") {
      if (isPointNearPath(px, py, shape.points, 10)) return shape;
    }
  }
  return null;
}

// ---------- HIT DETECTION ----------

function isPointInRect(
  px: number,
  py: number,
  x: number,
  y: number,
  w: number,
  h: number,
): boolean {
  return px >= x && px <= x + w && py >= y && py <= y + h;
}

function isPointInCircle(
  mx: number,
  my: number,
  cx: number,
  cy: number,
  r: number,
): boolean {
  const dx = mx - cx;
  const dy = my - cy;
  return dx * dx + dy * dy <= r * r;
}

function isPointInDiamond(
  mx: number,
  my: number,
  cx: number,
  cy: number,
  halfW: number,
  halfH: number,
): boolean {
  if (halfW === 0 || halfH === 0) return false;
  return Math.abs(mx - cx) / halfW + Math.abs(my - cy) / halfH <= 1;
}

function isPointNearPath(
  px: number,
  py: number,
  points: Coordinate[],
  threshold: number,
): boolean {
  for (let i = 0; i < points.length - 1; i++) {
    const dist = distToSegment(
      px,
      py,
      points[i].x,
      points[i].y,
      points[i + 1].x,
      points[i + 1].y,
    );
    if (dist <= threshold) return true;
  }
  return false;
}

function distToSegment(
  px: number,
  py: number,
  x1: number,
  y1: number,
  x2: number,
  y2: number,
): number {
  const dx = x2 - x1;
  const dy = y2 - y1;
  const lenSq = dx * dx + dy * dy;
  if (lenSq === 0) return Math.sqrt((px - x1) ** 2 + (py - y1) ** 2);

  let t = ((px - x1) * dx + (py - y1) * dy) / lenSq;
  t = Math.max(0, Math.min(1, t));

  const nx = x1 + t * dx;
  const ny = y1 + t * dy;
  return Math.sqrt((px - nx) ** 2 + (py - ny) ** 2);
}

// ---------- DRAW DIAMOND ----------

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

// ---------- REDRAW CANVAS ----------

function redrawCanvas(
  shapes: Shape[],
  canvas: HTMLCanvasElement,
  ctx: CanvasRenderingContext2D,
) {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  ctx.fillStyle = "black";
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  shapes.forEach((shape) => {
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
      drawDiamond(ctx, shape.x, shape.y, shape.width, shape.height);
    } else if (shape.type === "pencil") {
      if (shape.points.length > 0) {
        ctx.beginPath();
        ctx.moveTo(shape.points[0].x, shape.points[0].y);
        for (let i = 1; i < shape.points.length; i++) {
          ctx.lineTo(shape.points[i].x, shape.points[i].y);
        }
        ctx.strokeStyle = "white";
        ctx.lineWidth = 2;
        ctx.stroke();
      }
    } else if (shape.type === "eraser") {
      // Eraser ke points pe black circles draw karo
      // Ye shapes ke UPAR draw hoga — isliye erase effect aayega
      if (shape.points.length > 0) {
        shape.points.forEach((point) => {
          eraseAtPointStatic(ctx, point.x, point.y, shape.size);
        });
      }
    }
  });
}

// Redraw ke time eraser points draw karne ke liye
function eraseAtPointStatic(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  size: number,
) {
  ctx.save();
  ctx.beginPath();
  ctx.arc(x, y, size / 2, 0, Math.PI * 2);
  ctx.fillStyle = "black";
  ctx.fill();
  ctx.restore();
}

// ---------- GET SHAPES FROM SERVER ----------

async function getExistingShapes(roomId: string): Promise<Shape[]> {
  try {
    const token = localStorage.getItem("token");
    if (!token) return [];

    const res = await axios.get(`${BACKEND_ROOM_URL}/chats/${roomId}`, {
      headers: { Authorization: `Bearer ${token}` },
    });

    const messages = res.data.data;
    if (!Array.isArray(messages)) return [];

    const allShapes: Shape[] = [];
    const deletedIds = new Set<string>();

    for (const msg of messages) {
      try {
        const parsed = JSON.parse(msg.message);
        if (parsed.type === "deleteShape" && parsed.targetId) {
          deletedIds.add(parsed.targetId);
        } else if (parsed.shape) {
          allShapes.push(parsed.shape);
        }
      } catch {
        // skip
      }
    }

    // Deleted shapes hatao (eraser shapes mat hatao)
    const finalShapes = allShapes.filter((s) => {
      if ("id" in s) return !deletedIds.has(s.id);
      return true;
    });

    return finalShapes;
  } catch (error) {
    console.error("Shapes load error:", error);
    return [];
  }
}
