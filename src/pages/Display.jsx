import { useEffect, useState } from "react";
import { ref, onValue } from "firebase/database";
import { db } from "../firebase";

export default function Display() {
  const [wahana, setWahana] = useState({});

  useEffect(() => {
    const wahanaRef = ref(db, "wahana");
    onValue(wahanaRef, (snapshot) => {
      setWahana(snapshot.val() || {});
    });
  }, []);

  return (
    <div className="min-h-screen bg-black text-white flex flex-col items-center justify-center">
      <h1 className="text-3xl font-bold mb-10">
        STATUS PROSES WAHANA
      </h1>

      {/* 7 TITIK */}
      <div className="flex gap-8">
        {[1,2,3,4,5,6,7].map((i) => {
          const status = wahana[`wahana${i}`];

          return (
            <div key={i} className="flex flex-col items-center">
              <div
                className={`w-20 h-20 rounded-full mb-3
                  ${status === "proses"
                    ? "bg-yellow-400 animate-pulse"
                    : "bg-gray-400"}`}
              />
              <span className="text-lg font-semibold">
                {i}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
