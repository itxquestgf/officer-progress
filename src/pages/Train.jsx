import { ref, onValue, set, update } from "firebase/database";
import { useEffect, useState } from "react";
import { db } from "../firebase";

const TRAINS = [
  { id: 2, name: "Train 1" },
  { id: 5, name: "Train 2" },
];

export default function Train() {
  const [allWahana, setAllWahana] = useState({});

  useEffect(() => {
    const unsub = onValue(ref(db, "wahana"), (snap) => {
      setAllWahana(snap.val() || {});
    });
    return () => unsub();
  }, []);

  const getColor = (step) => {
    if (step === 2) return "bg-blue-500";   // ready
    if (step === 1) return "bg-yellow-400"; // proses
    return "bg-gray-400";                  // idle
  };

  const handleClick = (key) => {
    const data = allWahana[key];
    if (!data) return;

    let { batch, group, step, startTime } = data;

    // idle → proses
    if (step === 0) {
      set(ref(db, `wahana/${key}`), {
        ...data,
        step: 1,
        startTime: Date.now(),
      });
      return;
    }

    // proses → ready
    if (step === 1) {
      set(ref(db, `wahana/${key}`), {
        ...data,
        step: 2,
      });
      return;
    }

    // ready → idle (log time)
    if (step === 2) {
      const endTime = Date.now();
      const diff = Math.floor((endTime - startTime) / 1000);
      const minutes = Math.floor(diff / 60);
      const seconds = diff % 60;

      const logPath = `logs/${key}/batch${batch}/group${group}`;

      update(ref(db, logPath), {
        duration: { minutes, seconds },
      });

      let nextBatch = batch;
      let nextGroup = group + 1;

      if (nextGroup > 3) {
        nextGroup = 1;
        nextBatch++;
      }

      set(ref(db, `wahana/${key}`), {
        ...data,
        batch: nextBatch,
        group: nextGroup,
        step: 0,
        startTime: null,
      });
    }
  };

  const resetWrongClick = (key) => {
    const data = allWahana[key];
    if (!data) return;

    set(ref(db, `wahana/${key}`), {
      ...data,
      step: 0,
      startTime: null,
    });
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white flex flex-col items-center justify-center px-4">
      <h1 className="text-2xl font-bold mb-10">Train Control</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
        {TRAINS.map((t) => {
          const key = `wahana${t.id}`;
          const data = allWahana[key];

          return (
            <div key={t.id} className="flex flex-col items-center">
              <h2 className="text-lg font-bold mb-1">{t.name}</h2>

              {data && (
                <p className="text-sm text-yellow-400 mb-4">
                  Batch {data.batch} • Group {data.group}
                </p>
              )}

              <button
                onClick={() => handleClick(key)}
                className={`w-40 h-40 rounded-full ${getColor(data?.step)}`}
              />

              <button
                onClick={() => resetWrongClick(key)}
                className="mt-4 px-4 py-2 rounded-lg bg-red-600 hover:bg-red-700 text-sm font-bold"
              >
                Reset Salah Klik
              </button>
            </div>
          );
        })}
      </div>

      <p className="mt-8 text-xs opacity-60 text-center">
        Train 1 & Train 2 dikontrol dari halaman ini
      </p>
    </div>
  );
}
