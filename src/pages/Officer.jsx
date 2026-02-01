import { useParams } from "react-router-dom";
import { ref, onValue, set } from "firebase/database";
import { useEffect, useState } from "react";
import { db } from "../firebase";
import { PlayIcon, PauseIcon, StopIcon, ClockIcon, StatusActiveIcon, StatusIdleIcon, StatusReadyIcon } from "../components/Icons";
import Footer from "../components/Footer";

const WAHANA = {
  1: "Hologram",
  2: "Train 1",
  3: "Dream Farm",
  4: "Space-X",
  5: "Train 2",
  6: "Tunel",
  7: "Chamber AI",
  8: "B.Gondola & Gondola",
};

export default function Officer() {
  const { id } = useParams();
  const key = `wahana${id}`;

  const [allWahana, setAllWahana] = useState({});
  const [liveTime, setLiveTime] = useState({ minutes: 0, seconds: 0 });
  const [maintenanceStart, setMaintenanceStart] = useState(null);
  const [isMaintenance, setIsMaintenance] = useState(false);

  const myData = allWahana[key];

  useEffect(() => {
    const unsub = onValue(ref(db, "wahana"), (snap) => {
      setAllWahana(snap.val() || {});
    });
    return () => unsub();
  }, []);

  useEffect(() => {
    let timer;

    if (
      (myData?.step === 1 || myData?.step === 2) &&
      myData.startTime
    ) {
      timer = setInterval(() => {
        const diff = Math.floor((Date.now() - myData.startTime) / 1000);
        setLiveTime({
          minutes: Math.floor(diff / 60),
          seconds: diff % 60,
        });
      }, 1000);
    } else {
      setLiveTime({ minutes: 0, seconds: 0 });
    }

    return () => clearInterval(timer);
  }, [myData?.step, myData?.startTime]);

  const getColor = (step) => {
    if (step === 2) return "bg-blue-500";
    if (step === 1) return "bg-yellow-400";
    return "bg-gray-400";
  };

  const calcDuration = (start) => {
    const diff = Math.floor((Date.now() - start) / 1000);
    return {
      minutes: Math.floor(diff / 60),
      seconds: diff % 60,
    };
  };

  const handleClick = () => {
    if (!myData) return;

    let { batch, group, step, startTime = null } = myData;
    const now = Date.now();

    if (step === 0) {
      step = 1;
      startTime = now;
    }

    else if (step === 1) {
      step = 2;
    }

    else if (step === 2) {
      if (startTime) {
        const duration = calcDuration(startTime);
        set(ref(db, `logs/${key}/batch${batch}/group${group}`), {
          duration,
        });
      }

      startTime = null;
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

  const getStatusIcon = (step) => {
    if (step === 2) return <StatusReadyIcon className="w-5 h-5 text-white" />;
    if (step === 1) return <StatusActiveIcon className="w-5 h-5 text-black" />;
    return <StatusIdleIcon className="w-5 h-5" />;
  };

  const getMainIcon = () => {
    if (myData?.step === 0) return <PlayIcon className="w-14 h-14 text-gray-600" />;
    if (myData?.step === 1) return <PauseIcon className="w-14 h-14 text-black" />;
    return <StopIcon className="w-14 h-14 text-white" />;
  };

  const handleMaintenance = () => {
    if (!myData) return;
    const now = Date.now();
    if (!isMaintenance) {
      setIsMaintenance(true);
      setMaintenanceStart(now);

      set(ref(db, `wahana/${key}`), {
        ...myData,
        maintenance: true,
      });
    }
    else {
      const duration = calcDuration(maintenanceStart);
      set(ref(db, `maintenance/${key}/batch${myData.batch}/group${myData.group}`), {
        duration,
      });
      setIsMaintenance(false);
      setMaintenanceStart(null);
      set(ref(db, `wahana/${key}`), {
        ...myData,
        maintenance: false,
      });
    }
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white flex flex-col items-center px-4 py-6">
      <h1 className="text-2xl font-bold text-yellow-400 mb-1">
        {WAHANA[id]}
      </h1>
      {myData && (
        <p className="text-yellow-400 mb-6 flex items-center gap-2">
          <ClockIcon className="w-4 h-4" />
          Batch {myData.batch} • Group {myData.group}
        </p>
      )}
      <div className="grid grid-cols-4 gap-4 mb-10">
        {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => {
          const data = allWahana[`wahana${i}`];
          return (
            <div key={i} className="flex flex-col items-center text-center">
              {data && (
                <div className="text-[10px] text-yellow-400 mb-1">
                  B{data.batch} • G{data.group}
                </div>
              )}
              <div
                className={`w-10 h-10 rounded-full ${getColor(data?.step)}
  flex items-center justify-center
  ${data?.maintenance ? "ring-2 ring-red-500" : ""}`}
              >
                {getStatusIcon(data?.step)}
              </div>

              <span className="text-[11px] mt-1 opacity-80">
                {WAHANA[i]}
              </span>
            </div>
          );
        })}
      </div>
      <div className="flex gap-6 items-center mb-8">
        <div className="relative">
          <button
            onClick={handleClick}
            className={`w-36 h-36 rounded-full flex items-center justify-center shadow-xl transition active:scale-95 ${getColor(myData?.step)}`}
          >
            {(myData?.step === 1 || myData?.step === 2) ? (
              <div className="flex flex-col items-center gap-1">
                <ClockIcon className={`w-6 h-6 ${myData.step === 2 ? "text-white" : "text-black"}`} />
                <span className={`text-2xl font-mono font-bold ${myData.step === 2 ? "text-white" : "text-black"}`}>
                  {String(liveTime.minutes).padStart(2, "0")}:
                  {String(liveTime.seconds).padStart(2, "0")}
                </span>
              </div>
            ) : (
              getMainIcon()
            )}
          </button>
        </div>
        <button
          onClick={handleMaintenance}
          className={`w-24 h-24 rounded-full flex items-center justify-center font-bold text-sm shadow-xl
      ${isMaintenance ? "bg-red-700 animate-pulse" : "bg-gray-700"}`}
        >
          MAINT
        </button>
      </div>
      <div className="flex justify-center mt-6 w-full max-w-sm">
        <a
          href="https://wa.me/628989244418" // Replace with the developer's number
          target="_blank"
          rel="noopener noreferrer"
          className="flex-1 py-3 rounded-full bg-linear-to-r from-green-500 to-teal-500 text-white font-bold text-sm md:text-lg text-center shadow-lg transform transition-all duration-300 hover:scale-105 active:scale-95 hover:shadow-xl hover:bg-green-600 flex items-center justify-center gap-2 ease-in-out"
        >
          <span className="flex items-center justify-center gap-2">
            <i className="fab fa-whatsapp text-2xl"></i>
            <span>WA Developer</span>
          </span>
        </a>
      </div>
      <p className="text-xs opacity-60 mt-6 text-center">
        Kuning & Biru = timer berjalan<br />
        Abu = timer berhenti
      </p>
      <Footer />
    </div>
  );
}
