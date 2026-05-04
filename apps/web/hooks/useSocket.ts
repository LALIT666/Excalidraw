import { useEffect, useState } from "react";
import { WS_URL } from "../lib/config";

export function useSocket() {
  const [loading, setLoading] = useState(true);
  const [socket, setSocket] = useState<WebSocket>();

  useEffect(() => {
    const ws = new WebSocket(
      `${WS_URL}?token=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiIwZmM3YjMwMC1iMzAxLTRiMDYtODQ0OS0wODE3MTNlZDVlZWIiLCJpYXQiOjE3Nzc4NTM3NTQsImV4cCI6MTc3Nzk0MDE1NH0.iOK_hAATWmQhOdzl2yDeohaHx3F_kl_d4Vny0nVODvA`,
    );
    ws.onopen = () => {
      setLoading(false);
      setSocket(ws);
    };

    return () => {
      ws.close();
    };
  }, []);

  return {
    socket,
    loading,
  };
}
