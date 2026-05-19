export const isWahanaTimerRunning = (data) => {
  return (data?.step === 1 || data?.step === 2) && Boolean(data?.startTime);
};

export const formatWahanaDuration = (data, now = Date.now()) => {
  if (!isWahanaTimerRunning(data)) return null;

  const diff = Math.max(0, Math.floor((now - data.startTime) / 1000));
  const minutes = Math.floor(diff / 60);
  const seconds = diff % 60;

  return `${String(minutes).padStart(2, "0")}:${String(seconds).padStart(2, "0")}`;
};
