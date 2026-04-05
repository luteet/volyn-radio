import { useEffect, useRef, useState } from "react";
import { io, type Socket } from "socket.io-client";
import { isRunningInDiscord } from "../discord";
import type { HelloPayload, ProgressPayload, QueueState } from "../types/queue";

export function useQueueSocket({
  apiOrigin,
  socketPath,
  onError,
}: {
  apiOrigin: string;
  socketPath: string;
  onError: (msg: string) => void;
}) {
  const socketRef = useRef<Socket | null>(null);
  const [socketStatus, setSocketStatus] = useState<"connecting" | "connected" | "disconnected">(
    "connecting"
  );
  const [queue, setQueue] = useState<QueueState | null>(null);

  useEffect(() => {
    queueMicrotask(() => setSocketStatus("connecting"));

    const inDiscord = isRunningInDiscord();
    const socket = io(apiOrigin, {
      path: socketPath,
      transports: inDiscord ? ["polling"] : ["websocket", "polling"],
      upgrade: !inDiscord,
      withCredentials: false,
      autoConnect: true,
      reconnection: true,
    });
    socketRef.current = socket;

    const onConnect = () => setSocketStatus("connected");
    const onDisconnect = () => setSocketStatus("disconnected");
    const onConnectError = (e: Error) => {
      setSocketStatus("disconnected");
      onError(`Socket connect error: ${e.message} (origin: ${apiOrigin}, path: ${socketPath})`);
    };

    socket.on("connect", onConnect);
    socket.on("disconnect", onDisconnect);
    socket.on("connect_error", onConnectError);

    const applyState = (state: QueueState) => {
      setQueue(state);
    };

    socket.on("hello", (state: HelloPayload) => applyState(state));
    socket.on("state", (state: QueueState) => applyState(state));
    socket.on("progress", (state: ProgressPayload) => applyState(state));
    socket.on("errorMessage", (payload: { ok: false; error: string }) => {
      onError(payload?.error || "Unknown error");
    });

    socket.emit("getState");

    return () => {
      socket.off("connect", onConnect);
      socket.off("disconnect", onDisconnect);
      socket.off("connect_error", onConnectError);
      socket.disconnect();
      socketRef.current = null;
    };
  }, [apiOrigin, socketPath, onError]);

  return { socketRef, socketStatus, queue, setQueue };
}

