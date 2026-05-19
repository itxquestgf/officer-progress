import { io } from "socket.io-client";

// URL Ngrok yang Anda dapatkan
export const SOCKET_URL = "https://cody-chronographic-tobi.ngrok-free.dev";

export const socket = io(SOCKET_URL, {
  transports: ["websocket", "polling"],
  upgrade: true,
  autoConnect: true,
  reconnection: true,
  reconnectionAttempts: Infinity,
  reconnectionDelay: 1000,
  reconnectionDelayMax: 5000,
  timeout: 20000,
});

export const requestInitialData = () => {
  socket.emit("requestInitialData");
};

export const subscribeToDatabase = (onDatabase) => {
  const handleDatabase = (db = {}) => {
    onDatabase(db);
  };

  const handleConnect = () => {
    requestInitialData();
  };

  socket.on("connect", handleConnect);
  socket.on("initData", handleDatabase);
  socket.on("dataChanged", handleDatabase);

  if (socket.connected) {
    requestInitialData();
  } else {
    socket.connect();
  }

  return () => {
    socket.off("connect", handleConnect);
    socket.off("initData", handleDatabase);
    socket.off("dataChanged", handleDatabase);
  };
};

// Debugging
socket.on("connect", () => {
  console.log("✅ Terhubung ke Server PC:", socket.id);
});

socket.on("connect_error", (err) => {
  console.error("❌ Gagal konek ke Server PC:", err.message);
});

socket.on("disconnect", (reason) => {
  console.warn("⚠️ Terputus dari server:", reason);
});
