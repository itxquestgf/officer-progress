import { ref, onValue, update, remove } from "firebase/database";
import { useEffect, useState } from "react";
import { db } from "../firebase";

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

export default function Monitor() {
  const [logs, setLogs] = useState({});
  const [wahana, setWahana] = useState({});

  useEffect(() => {
    onValue(ref(db, "logs"), (snap) => {
      setLogs(snap.val() || {});
    });

    onValue(ref(db, "wahana"), (snap) => {
      setWahana(snap.val() || {});
    });
  }, []);

  const getColor = (step) => {
    if (step === 2) return "bg-blue-500";   // READY
    if (step === 1) return "bg-yellow-400"; // PROSES
    return "bg-gray-400";                  // IDLE
  };

  /* =========================
      RESET SEMUA
  ========================== */
  const resetAll = () => {
    const updates = {};

    for (let i = 1; i <= 8; i++) {
      updates[`wahana/wahana${i}`] = {
        ...wahana[`wahana${i}`],
        batch: 1,
        group: 1,
        step: 0,
        startTime: null,
      };
    }

    update(ref(db), updates);
    remove(ref(db, "logs"));
  };

  /* =========================
      DOWNLOAD CSV
  ========================== */
  const downloadCSV = () => {
    let csv = "Wahana,Batch,Group,Menit,Detik\n";

    Object.keys(logs).forEach((wahanaKey) => {
      const wahanaIndex = wahanaKey.replace("wahana", "");
      const wahanaName = WAHANA[wahanaIndex] || wahanaKey;

      Object.keys(logs[wahanaKey] || {}).forEach((batchKey) => {
        Object.keys(logs[wahanaKey][batchKey] || {}).forEach((groupKey) => {
          const d = logs[wahanaKey][batchKey][groupKey]?.duration;
          if (d) {
            csv += `${wahanaName},${batchKey.replace("batch","")},${groupKey.replace("group","")},${d.minutes},${d.seconds}\n`;
          }
        });
      });
    });

    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = "monitor_wahana.csv";
    link.click();
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white p-4">

      <h1 className="text-xl font-bold text-center mb-4">
        Monitor Progress Wahana
      </h1>

      {/* 🔵 8 BULATAN STATUS (MOBILE FRIENDLY) */}
      <div className="grid grid-cols-4 gap-y-4 gap-x-2 mb-8">
        {[1,2,3,4,5,6,7,8].map((i) => {
          const data = wahana[`wahana${i}`];
          return (
            <div key={i} className="flex flex-col items-center text-center">
              <div className={`w-9 h-9 rounded-full ${getColor(data?.step)}`} />
              <span className="text-[11px] mt-1 font-semibold text-yellow-400 leading-tight">
                {WAHANA[i]}
              </span>
              {data && (
                <span className="text-[10px] text-yellow-300">
                  B{data.batch} • G{data.group}
                </span>
              )}
            </div>
          );
        })}
      </div>

      {/* ===============================
          LIST TIMING (TETAP SEPERTI ASLI)
         =============================== */}
      <div className="space-y-6">
        {[1,2,3,4,5,6,7,8].map((i) => {
          const wahanaLogs = logs[`wahana${i}`] || {};
          return (
            <div key={i} className="bg-gray-800 rounded-xl p-4">
              <h2 className="font-bold text-lg mb-3 text-yellow-400">
                {WAHANA[i]}
              </h2>

              {[1,2,3,4,5].map((batch) => (
                <div key={batch} className="mb-2">
                  <div className="font-semibold text-sm mb-1">
                    Batch {batch}
                  </div>

                  <div className="grid grid-cols-3 gap-2 text-xs">
                    {[1,2,3].map((group) => {
                      const d =
                        wahanaLogs?.[`batch${batch}`]?.[`group${group}`]?.duration;

                      const m = d?.minutes != null ? String(d.minutes).padStart(2,"0") : "--";
                      const s = d?.seconds != null ? String(d.seconds).padStart(2,"0") : "--";

                      return (
                        <div key={group} className="bg-gray-700 rounded-md px-2 py-1 text-center">
                          Group {group}
                          <br />
                          <span className="text-yellow-300">{m}:{s}</span>
                        </div>
                      );
                    })}
                  </div>
                </div>
              ))}
            </div>
          );
        })}
      </div>

      {/* ACTION */}
      <div className="flex flex-col sm:flex-row gap-4 justify-center mt-8">
        <button
          onClick={downloadCSV}
          className="px-6 py-3 rounded-xl bg-green-600 font-bold"
        >
          Unduh Data
        </button>

        <button
          onClick={resetAll}
          className="px-6 py-3 rounded-xl bg-red-600 font-bold"
        >
          Reset Semua
        </button>
      </div>
    </div>
  );
}
