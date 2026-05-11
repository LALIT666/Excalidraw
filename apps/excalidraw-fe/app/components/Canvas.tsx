import { useEffect, useRef } from "react";
import { canvasEngine } from "../canvasEngine/canvas-engine";

export default function Canvas({
  roomId,
  socket,
}: {
  socket: WebSocket;
  roomId: string;
}) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };

    resize(); // initial size set
    window.addEventListener("resize", resize);

    canvasEngine(canvas, roomId, socket);

    return () => {
      window.removeEventListener("resize", resize);
    };
  }, [roomId, socket]);

  return (
    <div>
      <canvas ref={canvasRef}></canvas>
    </div>
  );
}
