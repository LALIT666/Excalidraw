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
    "rect" | "circle" | "diamond" | "eraser" | "pencil" | "objEraser"
  >("rect");

  const toolRef = useRef(currentTool);

  // Jab bhi tool change ho, ref update karo
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

    return () => {
      window.removeEventListener("resize", resize);
    };
  }, [roomId, socket]);

  // Tool buttons ka config
  const tools = [
    { name: "rect", label: "▭ Rect" },
    { name: "circle", label: "○ Circle" },
    { name: "diamond", label: "◇ Diamond" },
    { name: "pencil", label: "✏️ Pencil" },
    { name: "eraser", label: "🧹 Eraser" },
    { name: "objEraser", label: "🗑️ Delete" },
  ];

  return (
    <div className="relative w-full h-screen bg-black overflow-hidden">
      {/* TOOLBAR */}
      <div className="fixed top-5 left-1/2 -translate-x-1/2 z-50 bg-neutral-900 border border-neutral-700 p-2 rounded-xl flex gap-2 shadow-2xl">
        {tools.map((tool) => (
          <button
            key={tool.name}
            onClick={() => setCurrentTool(tool.name as any)}
            className={`px-4 py-2 rounded-lg text-sm transition-all ${
              currentTool === tool.name
                ? "bg-white text-black font-bold"
                : "bg-transparent text-white hover:bg-neutral-800"
            }`}
          >
            {tool.label}
          </button>
        ))}
      </div>

      {/* CANVAS */}
      <canvas ref={canvasRef} className="block touch-none" />
    </div>
  );
}
