"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { api } from "@/lib/api";

export default function CreateRoomPage() {
  const [roomname, setRoomname] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  // ✅ Protect page
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      router.push("/signin");
    }
  }, [router]);

  async function handleCreateRoom() {
    if (!roomname.trim()) {
      setError("Room name is required");
      return;
    }

    try {
      setLoading(true);
      setError("");

      const token = localStorage.getItem("token");

      if (!token) {
        router.push("/signin");
        return;
      }

      const res = await api.post(
        "/room",
        { roomname },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );

      console.log("ROOM FULL RESPONSE:", res);
      console.log("ROOM DATA:", res.data);

      console.log("ROOM ID:", res.data?.data?.roomId);

      const roomId = res.data.data.roomId;

      // const dataString = res.data.data;
      // const roomId = dataString.split(": ")[1];

      console.log(roomId);

      if (!roomId) {
        setError("Room ID missing");
        console.log(res.data);
        return;
      }

      router.push(`/canvas/${roomId}`);
    } catch (err: any) {
      setError(err.response?.data?.message || "Failed to create room");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-[#070b14] text-white px-4">
      <div className="w-full max-w-md space-y-6 rounded-3xl border border-white/10 bg-white/5 p-8 backdrop-blur-xl">
        <h2 className="text-2xl font-semibold tracking-tight">
          Create a New Room
        </h2>

        <p className="text-sm text-white/60">
          Enter a name for your workspace.
        </p>

        <input
          type="text"
          placeholder="e.g. Product Brainstorm"
          value={roomname}
          onChange={(e) => setRoomname(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              handleCreateRoom();
            }
          }}
          className="w-full rounded-xl border border-white/20 bg-transparent px-4 py-3 text-sm outline-none focus:border-white/40"
        />

        {error && <p className="text-sm text-red-400">{error}</p>}

        <button
          onClick={handleCreateRoom}
          disabled={loading}
          className="w-full rounded-xl bg-white py-3 text-sm font-semibold text-black transition hover:opacity-90 disabled:opacity-60"
        >
          {loading ? "Creating..." : "Create Room"}
        </button>
      </div>
    </div>
  );
}
