import { ref, onValue, update, remove } from "firebase/database";
import { useEffect, useState } from "react";
import { db } from "../firebase";
import { OFFICERS } from "../constants/officers";

export default function Monitor() {
  const [logs, setLogs] = useState({});

  useEffect(() => {
    onValue(ref(db, "logs"), (snap) => {
      setLogs(snap.val() || {});
    });
  }, []);

  const resetAll = () => {
    const updates = {};
    for (let i = 1; i <= 8; i++) {
      updates[`wahana/wahana${i}`] = {
        batch: 1,
        group: 1,
        step: 0,
        startTime: null
      };
    }
    update(ref(db), updates);
    remove(ref(db, "logs"));
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white p-6">
      <h1 className="text-xl font-bold mb-4">Monitor</h1>

      <button
        onClick={resetAll}
        className="bg-red-600 px-4 py-2 rounded mb-6"
      >
        RESET SEMUA
      </button>

      {Object.keys(OFFICERS).map((id) => (
        <div key={id} className="mb-4">
          <h2 className="font-bold">{OFFICERS[id]}</h2>
          {logs[`wahana${id}`] &&
            Object.entries(logs[`wahana${id}`]).map(([batch, groups]) =>
              Object.entries(groups).map(([group, data]) => (
                <p key={batch+group} className="text-sm opacity-80">
                  {batch} {group} : {data.duration.minutes}m {data.duration.seconds}s
                </p>
              ))
            )}
        </div>
      ))}
    </div>
  );
}
