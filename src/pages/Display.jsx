import { useEffect, useState } from "react";
import { ref, onValue } from "firebase/database";
import { db } from "../firebase";
import { OFFICERS } from "../constants/officers";

export default function Display() {
  const [wahana, setWahana] = useState({});

  useEffect(() => {
    onValue(ref(db, "wahana"), (snap) => {
      setWahana(snap.val() || {});
    });
  }, []);

  const getColor = (step) => {
    if (step === 3) return "bg-blue-500";
    if (step > 0) return "bg-yellow-400";
    return "bg-gray-400";
  };

  return (
    <div className="min-h-screen bg-black text-white flex flex-col items-center justify-center px-6">
      <h1 className="text-4xl font-bold mb-12">
        STATUS PROSES SEMUA OFFICER
      </h1>

      {/* 🔵 7 BULATAN STATUS */}
      <div className="flex flex-wrap justify-center gap-10">
        {[1,2,3,4,5,6,7].map((i) => {
          const data = wahana[`wahana${i}`];

          return (
            <div
              key={i}
              className="flex flex-col items-center text-center"
            >
              <div
                className={`w-24 h-24 rounded-full
                  flex items-center justify-center
                  text-4xl font-bold text-black
                  ${getColor(data?.step)}`}
              >
                {data?.step > 0 && data.step}
              </div>

              <div className="mt-4 text-lg font-semibold">
                {OFFICERS[i]}
              </div>

              {data && (
                <div className="text-sm opacity-80">
                  Batch {data.batch} • Group {data.group}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
