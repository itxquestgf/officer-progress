import { useEffect, useState } from "react";
import { IoIosWifi } from "react-icons/io";
import { socket, SOCKET_URL } from "../socket";

export default function NetworkStatus() {
  const [online, setOnline] = useState(navigator.onLine);
  const [show, setShow] = useState(true);
  const [socketConnected, setSocketConnected] = useState(socket.connected);
  const [socketId, setSocketId] = useState(socket.id || "-");
  const [transport, setTransport] = useState(socket.io.engine?.transport?.name || "-");
  const [socketError, setSocketError] = useState("-");

  useEffect(() => {
    const handleOnline = () => {
      setOnline(true);
      setShow(true);
      setTimeout(() => setShow(false), 3000);
    };

    const handleOffline = () => {
      setOnline(false);
      setShow(true);
    };

    window.addEventListener("online", handleOnline);
    window.addEventListener("offline", handleOffline);

    return () => {
      window.removeEventListener("online", handleOnline);
      window.removeEventListener("offline", handleOffline);
    };
  }, []);

  useEffect(() => {
    let hideTimer;

    const scheduleHide = () => {
      clearTimeout(hideTimer);
      hideTimer = setTimeout(() => setShow(false), 3000);
    };

    const updateTransport = () => {
      setTransport(socket.io.engine?.transport?.name || "-");
    };

    const handleConnect = () => {
      setSocketConnected(true);
      setSocketId(socket.id || "-");
      setSocketError("-");
      setShow(true);
      updateTransport();
      scheduleHide();
    };

    const handleDisconnect = () => {
      setSocketConnected(false);
      setSocketId("-");
      setShow(true);
      updateTransport();
    };

    const handleConnectError = (err) => {
      setSocketConnected(false);
      setSocketError(err?.message || "connect_error");
      setShow(true);
      updateTransport();
    };

    socket.on("connect", handleConnect);
    socket.on("disconnect", handleDisconnect);
    socket.on("connect_error", handleConnectError);
    socket.io.on("reconnect", handleConnect);
    socket.io.engine?.on("upgrade", updateTransport);

    updateTransport();

    if (socket.connected) {
      scheduleHide();
    }

    return () => {
      clearTimeout(hideTimer);
      socket.off("connect", handleConnect);
      socket.off("disconnect", handleDisconnect);
      socket.off("connect_error", handleConnectError);
      socket.io.off("reconnect", handleConnect);
      socket.io.engine?.off("upgrade", updateTransport);
    };
  }, []);

  if (!show && socketConnected) return null;

  return (
    <div className="fixed top-4 left-4 z-[9999] flex flex-col gap-2">
      <div
        className={`flex items-center gap-2 px-4 py-2 rounded-xl shadow-lg text-white text-sm
        ${online ? "bg-green-600" : "bg-red-600"}`}
      >
        <IoIosWifi size={18} />
        {online ? "Connected" : "Disconnected"}
      </div>

      <div className="max-w-[260px] rounded-xl bg-black/80 px-3 py-2 text-[11px] text-white shadow-lg backdrop-blur">
        <div>Socket: {socketConnected ? "connected" : "disconnected"}</div>
        <div>ID: {socketId}</div>
        <div>Transport: {transport}</div>
        <div className="truncate">Error: {socketError}</div>
        <div className="truncate">URL: {SOCKET_URL}</div>
      </div>
    </div>
  );
}
