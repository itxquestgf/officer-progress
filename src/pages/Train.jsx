import { ref, onValue, set } from "firebase/database";
import { useEffect, useState } from "react";
import { db } from "../firebase";

/**
 * Train:
 * wahana2 = Train 1
 * wahana5 = Train 2
 */

const TRAINS = {
  wahana2: "Train 1",
  wahana5: "Train 2",
};

const WAHANA_NAME = {
  1: "Hologram",
  2: "Train 1",
  3: "Dream Farm",
  4: "Space-X",
  5: "Train 2",
  6: "Tunel",
  7: "Chamber AI & B.Gondola",
  8: "Gondola",
};

export default function Train() {
  const [allWahana, setAllWahana] = useState({});

  useEffect(() => {
    const unsub = onValue(ref(db, "wahana"), (snap) => {
      setAllWahana(snap.val() || {});
    });
    return () => unsub();
  }, []);

  const getColor = (step) => {
    if (step === 2) return "bg-blue-500";
    if (step === 1) return "bg-yellow-400";
    return "bg-gray-400";
  };

  /* =========================
      LOGIC UTAMA
  ========================== */

  const handleClick = (key) => {
    const data = allWahana[key];
    if (!data) return;

    let { batch, group, step, startTime = null } = data;
    const now = Date.now();

    if (step === 0) {
      step = 1;
      startTime = now;
    } else if (step === 1) {
      step = 2;
      startTime = null;
    } else if (step === 2) {
      step = 0;
      group++;
      if (group > 3) {
        group = 1;
        batch++;
      }
    }

    set(ref(db, `wahana/${key}`), {
      batch,
      group,
      step,
      startTime,
    });
  };

  const previousGroup = (key) => {
    const data = allWahana[key];
    if (!data) return;

    let { batch, group } = data;

    group--;
    if (group < 1) {
      batch = Math.max(1, batch - 1);
      group = 3;
    }

    set(ref(db, `wahana/${key}`), {
      ...data,
      batch,
      group,
      step: 0,
      startTime: null,
    });
  };

  const skipGroup = (key) => {
    const data = allWahana[key];
    if (!data) return;

    let { batch, group } = data;

    group++;
    if (group > 3) {
      group = 1;
      batch++;
    }

    set(ref(db, `wahana/${key}`), {
      ...data,
      batch,
      group,
      step: 0,
      startTime: null,
    });
  };

  const skipBatch = (key) => {
    const data = allWahana[key];
    if (!data) return;

    set(ref(db, `wahana/${key}`), {
      ...data,
      batch: data.batch + 1,
      group: 1,
      step: 0,
      startTime: null,
    });
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
    <div className="min-h-screen bg-gray-900 text-white px-6 py-8">

      <h1 className="text-2xl font-bold text-center mb-6">
        Monitor Train
      </h1>

      {/* 🔵 8 PROGRES WAHANA (WAJIB ADA) */}
      <div className="grid grid-cols-4 gap-x-10 gap-y-6 mb-14">
        {[1,2,3,4,5,6,7,8].map((i) => {
          const data = allWahana[`wahana${i}`];
          return (
            <div key={i} className="flex flex-col items-center text-center">
              {data && (
                <div className="text-xs text-yellow-400 font-semibold mb-1">
                  Batch {data.batch} • Group {data.group}
                </div>
              )}
              <div className={`w-10 h-10 rounded-full ${getColor(data?.step)}`} />
              <span className="text-[13px] mt-1 opacity-80">
                {WAHANA_NAME[i]}
              </span>
            </div>
          );
        })}
      </div>

      {/* 🚆 PANEL TRAIN */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-12 max-w-5xl mx-auto">
        {Object.keys(TRAINS).map((key) => {
          const data = allWahana[key];
          return (
            <div key={key} className="bg-gray-800 rounded-xl p-6 text-center">

              <h2 className="text-lg font-bold mb-1 text-yellow-400">
                {TRAINS[key]}
              </h2>

              {data && (
                <p className="text-sm mb-6">
                  Batch {data.batch} • Group {data.group}
                </p>
              )}

              {/* 🔘 TOMBOL UTAMA */}
              <button
                onClick={() => handleClick(key)}
                className={`w-24 h-24 rounded-full mx-auto mb-6 ${getColor(data?.step)}`}
              />

              {/* ⏮️ ⏭️ ⏭️⏭️ */}
              <div className="flex justify-center gap-4 mb-6">
                <button
                  onClick={() => previousGroup(key)}
                  className="px-4 py-2 bg-gray-600 rounded-lg text-sm font-bold"
                >
                  Previous
                </button>

                <button
                  onClick={() => skipBatch(key)}
                  className="px-4 py-2 bg-orange-600 rounded-lg text-sm font-bold"
                >
                  Skip Batch
                </button>

                <button
                  onClick={() => skipGroup(key)}
                  className="px-4 py-2 bg-yellow-500 text-black rounded-lg text-sm font-bold"
                >
                  Skip Group
                </button>
              </div>

              {/* 🔴 RESET */}
              <button
                onClick={() => resetWrongClick(key)}
                className="px-6 py-3 h-10 rounded-xl bg-red-600 hover:bg-red-700 text-sm font-bold"
              >
                Reset Salah Klik
              </button>

            </div>
          );
        })}
      </div>
    </div>
  );
}
