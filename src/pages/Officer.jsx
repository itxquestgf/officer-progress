import { useParams } from "react-router-dom";
import { ref, onValue, set } from "firebase/database";
import { useEffect, useState } from "react";
import { db } from "../firebase";
import { OFFICERS } from "../constants/officers";

export default function Officer({ forceId }) {
  const params = useParams();
  const id = forceId || params.id;
  const key = `wahana${id}`;

  const [allWahana, setAllWahana] = useState({});
  const myData = allWahana[key];

  useEffect(() => {
    onValue(ref(db, "wahana"), (snap) => {
      setAllWahana(snap.val() || {});
    });
  }, []);

  const getColor = (step) => {
    if (step === 2) return "bg-blue-500";
    if (step === 1) return "bg-yellow-400";
    return "bg-gray-400";
  };

  const handleClick = () => {
    if (!myData) return;

    let { batch, group, step, startTime } = myData;
    const now = Date.now();

    if (step === 0) {
      set(ref(db, `wahana/${key}`), { ...myData, step: 1, startTime: now });
      return;
    }

    if (step === 1) {
      set(ref(db, `wahana/${key}`), { ...myData, step: 2 });
      return;
    }

    if (step === 2) {
      const diff = Math.floor((now - startTime) / 1000);

      set(
        ref(db, `logs/${key}/batch${batch}/group${group}`),
        {
          duration: {
            minutes: Math.floor(diff / 60),
            seconds: diff % 60
          }
        }
      );

      group++;
      if (group > 3) {
        group = 1;
        batch++;
      }

      set(ref(db, `wahana/${key}`), {
        ...myData,
        batch,
        group,
        step: 0,
        startTime: null
      });
    }
  };

  return (
    <div className="bg-gray-900 text-white flex flex-col items-center p-6">
      <h1 className="text-xl font-bold">{OFFICERS[id]}</h1>
      {myData && (
        <p className="text-sm opacity-70 mb-6">
          Batch {myData.batch} • Group {myData.group}
        </p>
      )}

      <div className="grid grid-cols-4 gap-8 mb-8">
        {[1,2,3,4,5,6,7,8].map((i) => (
          <div key={i} className="flex flex-col items-center">
            <div className={`w-10 h-10 rounded-full ${getColor(allWahana[`wahana${i}`]?.step)}`} />
            <span className="text-[11px] mt-1 text-center opacity-70">{OFFICERS[i]}</span>
          </div>
        ))}
      </div>

      <button
        onClick={handleClick}
        className={`w-40 h-40 rounded-full ${getColor(myData?.step)}`}
      />
    </div>
  );
}
