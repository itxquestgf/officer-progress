import { useParams } from "react-router-dom";
import { ref, onValue, set, update, push, remove } from "firebase/database";
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
    if (step === 2) return "bg-blue-500";   // READY
    if (step === 1) return "bg-yellow-400"; // PROSES
    return "bg-gray-400";                  // IDLE
  };


  // ▶️ klik tombol utama
  const calcDuration = (start) => {
    const diff = Math.floor((Date.now() - start) / 1000);
    return {
      minutes: Math.floor(diff / 60),
      seconds: diff % 60
    };
  };

  const handleClick = () => {
    if (!myData) return;

    let {
      batch,
      group,
      step,
      startTime = null
    } = myData;

    const now = Date.now();

    // IDLE → PROSES (KUNING, START TIMER)
    if (step === 0) {
      step = 1;
      startTime = now;
    }

    // PROSES → READY (BIRU, STOP TIMER)
    else if (step === 1) {
      step = 2;

      if (startTime !== null) {
        const duration = calcDuration(startTime);
        set(
          ref(db, `logs/${key}/batch${batch}/group${group}`),
          { duration }
        );
      }

      startTime = null;
    }

    // READY → IDLE (NEXT GROUP)
    else if (step === 2) {
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
      startTime
    });
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

  // Handle previous
  const handlePrevious = async () => {
  if (!myData) return;

  const { batch, group, step } = myData;

  // hanya boleh saat idle
  if (step !== 0) return;

  // sudah paling awal
  if (batch === 1 && group === 1) return;

  let prevBatch = batch;
  let prevGroup = group - 1;

  if (prevGroup < 1) {
    prevBatch = batch - 1;
    prevGroup = 3;
  }

  // hapus data group yang salah
  await remove(
    ref(db, `logs/${key}/batch${batch}/group${group}`)
  );

  // update posisi officer
  set(ref(db, `wahana/${key}`), {
    ...myData,
    batch: prevBatch,
    group: prevGroup,
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
        {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => {
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
        className={`w-28 h-28 rounded-full ${getColor(myData?.step)}
    flex items-center justify-center`}
      />
      <div className="flex gap-4 mt-6">
  {/* PREVIOUS */}
  <button
    onClick={handlePrevious}
    disabled={myData?.step !== 0}
    className={`px-4 py-2 rounded-lg text-sm font-bold
      ${myData?.step === 0
        ? "bg-gray-600 hover:bg-gray-500"
        : "bg-gray-800 opacity-40 cursor-not-allowed"}
    `}
  >
    ◀ Previous
  </button>

  {/* RESET */}
  <button
    onClick={resetWrongClick}
    className="px-4 py-2 rounded-lg bg-red-600 hover:bg-red-700 text-sm font-bold"
  >
    Reset
  </button>
</div>
      <p className="mt-6 text-xs opacity-60 text-center">
        Kalo salah klik don't panic ges<br />
        pake tombol ini nanti ke abu lagi :"
      </p>
    </div>
  );
}
