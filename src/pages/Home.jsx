import { useNavigate } from "react-router-dom";
import { ref, onValue, set } from "firebase/database";
import { useEffect, useState } from "react";
import { db } from "../firebase";
import { OFFICERS } from "../constants/officers";

export default function Home() {
  const navigate = useNavigate();
  const [wahana, setWahana] = useState({});

  useEffect(() => {
    onValue(ref(db, "wahana"), (snap) => {
      setWahana(snap.val() || {});
    });
  }, []);

  const handleReset = () => {
    const ok = window.confirm(
      "Reset semua proses?\nBatch & Group akan kembali ke awal."
    );
    if (!ok) return;

    const resetData = {};
    Object.keys(OFFICERS).forEach((id) => {
      resetData[`wahana${id}`] = {
        batch: 1,
        group: 1,
        step: 0,
      };
    });

    set(ref(db, "wahana"), resetData);
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white flex flex-col items-center justify-center px-6">
      <h1 className="text-3xl font-bold mb-8">
        Pilih Officer
      </h1>

      {/* 🔘 LIST OFFICER */}
      <div className="grid grid-cols-2 gap-5 mb-10">
        {Object.entries(OFFICERS).map(([id, name]) => {
          const data = wahana[`wahana${id}`];

          return (
            <button
              key={id}
              onClick={() => navigate(`/officer/${id}`)}
              className="bg-blue-600 hover:bg-blue-700 px-6 py-5 rounded-xl text-left"
            >
              <div className="font-semibold text-lg">
                {name}
              </div>
              {data && (
                <div className="text-sm opacity-80 mt-1">
                  Batch {data.batch} • Group {data.group}
                </div>
              )}
            </button>
          );
        })}
      </div>

      {/* 🔴 TOMBOL RESET */}
      <button
        onClick={handleReset}
        className="bg-red-600 hover:bg-red-700 px-8 py-4 rounded-xl font-bold"
      >
        RESET SEMUA PROSES
      </button>

      <p className="mt-4 text-xs opacity-60 text-center">
        Gunakan saat awal hari atau ganti sesi
      </p>
    </div>
  );
}
