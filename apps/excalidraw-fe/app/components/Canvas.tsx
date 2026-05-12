"use client";
import { useEffect, useRef, useState } from "react";
import { canvasEngine } from "../canvasEngine/canvas-engine";

export default function Canvas({
  roomId,
  socket,
}: {
  socket: WebSocket;
  roomId: string;
}) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [currentTool, setCurrentTool] = useState<
    "rect" | "circle" | "diamond" | "eraser"
  >("rect");

  const toolRef = useRef(currentTool);

  useEffect(() => {
    toolRef.current = currentTool;
  }, [currentTool]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };

    resize();
    window.addEventListener("resize", resize);
    canvasEngine(canvas, roomId, socket, toolRef);

    return () => window.removeEventListener("resize", resize);
  }, [roomId, socket]);

  return (
    <div className="relative w-full h-screen bg-black overflow-hidden">
      <div className="fixed top-5 left-1/2 -translate-x-1/2 z-50 bg-neutral-900 border border-neutral-700 p-2 rounded-xl flex gap-3 shadow-2xl">
        {["rect", "circle", "diamond", "eraser"].map((tool) => (
          <button
            key={tool}
            onClick={() => setCurrentTool(tool as any)}
            className={`px-4 py-2 rounded-lg capitalize transition-all ${
              currentTool === tool
                ? "bg-white text-black font-bold"
                : "bg-transparent text-white hover:bg-neutral-800"
            }`}
          >
            {tool}
          </button>
        ))}
      </div>
      <canvas ref={canvasRef} className="block touch-none"></canvas>
    </div>
  );
}
