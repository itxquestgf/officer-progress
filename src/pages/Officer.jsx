import { useParams } from "react-router-dom";
import { ref, onValue, set, update, push } from "firebase/database";
import { useEffect, useState } from "react";
import { db } from "../firebase";

/**
 * INDEX:
 * 1 = Hologram
 * 2 = Train 1
 * 3 = Dream Farm
 * 4 = Space-X
 * 5 = Train 2
 * 6 = Tunel
 * 7 = Chamber AI & B.Gondola
 * 8 = Gondola
 */

const WAHANA = {
  1: "Hologram",
  2: "Train 1",
  3: "Dream Farm",
  4: "Space-X",
  5: "Train 2",
  6: "Tunel",
  7: "Chamber AI & B.Gondola",
  8: "Gondola",
};

export default function Officer() {
  const { id } = useParams();
  const key = `wahana${id}`;

  const [allWahana, setAllWahana] = useState({});
  const myData = allWahana[key];

  // 🔄 realtime listener
  useEffect(() => {
    const unsub = onValue(ref(db, "wahana"), (snap) => {
      setAllWahana(snap.val() || {});
    });
    return () => unsub();
  }, []);

  // 🎨 warna status
  const getColor = (step) => {
    if (step === 2) return "bg-blue-500";   // ready
    if (step === 1) return "bg-yellow-400"; // proses
    return "bg-gray-400";                  // idle
  };

  // ▶️ klik tombol utama
  const handleClick = () => {
    if (!myData) return;

    let { batch, group, step, startTime } = myData;

    // idle → proses
    if (step === 0) {
      set(ref(db, `wahana/${key}`), {
        ...myData,
        step: 1,
        startTime: Date.now(),
      });
      return;
    }

    // proses → ready
    if (step === 1) {
      set(ref(db, `wahana/${key}`), {
        ...myData,
        step: 2,
      });
      return;
    }

    // ready → idle (simpan durasi)
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
        ...myData,
        batch: nextBatch,
        group: nextGroup,
        step: 0,
        startTime: null,
      });
    }
  };

  // 🔴 reset salah klik (hanya officer ini)
  const resetWrongClick = () => {
    if (!myData) return;

    set(ref(db, `wahana/${key}`), {
      ...myData,
      step: 0,
      startTime: null,
    });
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white flex flex-col items-center justify-center px-4">

      {/* NAMA WAHANA */}
      <h1 className="text-2xl font-bold mb-1">
        {WAHANA[id]}
      </h1>

      {/* BATCH & GROUP SENDIRI */}
      {myData && (
        <p className="text-sm text-yellow-400 mb-8">
          Batch {myData.batch} • Group {myData.group}
        </p>
      )}

      {/* 🔵 STATUS SEMUA WAHANA */}
      <div className="grid grid-cols-4 gap-x-10 gap-y-6 mb-12">
        {[1,2,3,4,5,6,7,8].map((i) => {
          const data = allWahana[`wahana${i}`];

          return (
            <div key={i} className="flex flex-col items-center text-center">
              
              {/* batch & group */}
              {data && (
                <div className="text-xs font-semibold text-yellow-400 mb-1">
                  Batch {data.batch} • Group {data.group}
                </div>
              )}

              {/* bulatan */}
              <div
                className={`w-10 h-10 rounded-full ${getColor(data?.step)}`}
              />

              {/* nama */}
              <span className="text-[13px] mt-1 opacity-80">
                {WAHANA[i]}
              </span>
            </div>
          );
        })}
      </div>

      {/* 🔘 TOMBOL UTAMA */}
      <button
        onClick={handleClick}
        className={`w-40 h-40 rounded-full ${getColor(myData?.step)}
          flex items-center justify-center`}
      />

      {/* 🔴 RESET SALAH KLIK */}
      <button
        onClick={resetWrongClick}
        className="mt-6 px-6 py-3 rounded-xl bg-red-600 hover:bg-red-700 text-sm font-bold"
      >
        Reset Salah Klik
      </button>

      <p className="mt-6 text-xs opacity-60 text-center">
        Bulatan atas hanya informasi<br />
        Tombol ini hanya untuk wahana ini
      </p>
    </div>
  );
}
