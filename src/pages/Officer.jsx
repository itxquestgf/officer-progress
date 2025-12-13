import { useParams } from "react-router-dom";
import { ref, onValue, set } from "firebase/database";
import { useEffect, useState } from "react";
import { db } from "../firebase";

export default function Officer() {
  const { id } = useParams();
  const myKey = `wahana${id}`;
  const [wahana, setWahana] = useState({});

  useEffect(() => {
    const wahanaRef = ref(db, "wahana");
    onValue(wahanaRef, (snap) => {
      setWahana(snap.val() || {});
    });
  }, []);

  const toggleMyStatus = () => {
    const current = wahana[myKey];
    set(
      ref(db, `wahana/${myKey}`),
      current === "proses" ? "idle" : "proses"
    );
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white flex flex-col items-center justify-center px-4">
      <h1 className="text-2xl font-bold mb-6">
        Officer {id}
      </h1>

      {/* 🔵 7 LAMPU STATUS (READ ONLY) */}
      <div className="flex gap-4 mb-10">
        {[1,2,3,4,5,6,7].map((i) => {
          const status = wahana[`wahana${i}`];

          return (
            <div key={i} className="flex flex-col items-center">
              <div
                className={`w-10 h-10 rounded-full
                  ${status === "proses"
                    ? "bg-yellow-400 animate-pulse"
                    : "bg-gray-400"}`}
              />
              <span className="text-xs mt-1">
                {i}
              </span>
            </div>
          );
        })}
      </div>

      {/* 🔘 1 TOMBOL KONTROL OFFICER */}
      <button
        onClick={toggleMyStatus}
        className={`
          px-10 py-6 rounded-2xl text-xl font-bold
          ${wahana[myKey] === "proses"
            ? "bg-yellow-500 text-black"
            : "bg-gray-300 text-black"}
        `}
      >
        {wahana[myKey] === "proses" ? "PROSES" : "IDLE"}
      </button>

      <p className="mt-6 text-sm opacity-70 text-center">
        Lampu di atas hanya informasi<br />
        Tombol ini hanya untuk Officer {id}
      </p>
    </div>
  );
}
