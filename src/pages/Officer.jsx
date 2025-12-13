import { useParams } from "react-router-dom";
import { ref, onValue, set } from "firebase/database";
import { useEffect, useState } from "react";
import { db } from "../firebase";
import { OFFICERS } from "../constants/officers";

export default function Officer() {
  const { id } = useParams();
  const key = `wahana${id}`;
  const [allWahana, setAllWahana] = useState({});
  const myData = allWahana[key];

  useEffect(() => {
    onValue(ref(db, "wahana"), (snap) => {
      setAllWahana(snap.val() || {});
    });
  }, []);

  const handleClick = () => {
    if (!myData) return;

    let { batch, group, step } = myData;
    step++;

    if (step > 3) {
      step = 0;
      group++;

      if (group > 3) {
        group = 1;
        batch++;
      }
    }

    set(ref(db, `wahana/${key}`), { batch, group, step });
  };

  const getColor = (step) => {
    if (step === 3) return "bg-blue-500";
    if (step > 0) return "bg-yellow-400";
    return "bg-gray-400";
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white flex flex-col items-center justify-center px-4">
      {/* NAMA OFFICER */}
      <h1 className="text-2xl font-bold mb-1">
        {OFFICERS[id]}
      </h1>

      {/* BATCH & GROUP */}
      {myData && (
        <p className="text-sm opacity-70 mb-6">
          Batch {myData.batch} • Group {myData.group}
        </p>
      )}

      {/* 🔵 7 BULATAN STATUS OFFICER LAIN */}
      <div className="flex gap-4 mb-10">
        {[1,2,3,4,5,6,7].map((i) => {
          const data = allWahana[`wahana${i}`];

          return (
            <div key={i} className="flex flex-col items-center">
              <div
                className={`w-10 h-10 rounded-full
                  flex items-center justify-center
                  text-sm font-bold text-black
                  ${getColor(data?.step)}`}
              >
                {data?.step > 0 && data.step}
              </div>
              <span className="text-[10px] mt-1 text-center opacity-80">
                {OFFICERS[i]}
              </span>
            </div>
          );
        })}
      </div>

      {/* 🔘 TOMBOL OFFICER SENDIRI */}
      <button
        onClick={handleClick}
        className={`w-40 h-40 rounded-full
          flex items-center justify-center
          text-5xl font-bold text-black
          ${getColor(myData?.step)}`}
      >
        {myData?.step > 0 && myData.step}
      </button>

      <p className="mt-6 text-xs opacity-60 text-center">
        Bulatan atas hanya informasi<br />
        Tombol ini hanya untuk {OFFICERS[id]}
      </p>
    </div>
  );
}
