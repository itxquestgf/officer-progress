import { Link } from "react-router-dom";
import Logo from "../assets/logo.png";
import { MonitorIcon, SettingsIcon, HomeIcon } from "../components/Icons";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { MdOutlineExitToApp } from "react-icons/md";
import Footer from "../components/Footer";

const wahanaCards = [
  {
    id: "hologram",
    name: "Hologram & Totem",
    path: "/officer/hologram",
    icon: "🗿",
  },
  {
    id: "train",
    name: "Train 1 & 2",
    path: "/officer/train",
    icon: "🚆",
  },
  {
    id: "tunel",
    name: "Tunel & Chamber",
    path: "/officer/tunel",
    icon: "🧠",
  },
  {
    id: "dreamfarm",
    name: "Dream Farm",
    path: "/dreamfarm", 
    icon: "🐮",
  },
  {
    id: "spacex",
    name: "Space-X",
    path: "/spacex",    
    icon: "🚀",
  },
  {
    id: "gondola",
    name: "B.Gondola & Gondola",
    path: "/gondola",   
    icon: "🚢",
  },
];

export default function Home() {
  // Simulasi user login untuk sistem lokal (bisa disesuaikan dengan sistem login baru Anda)
  const [user, setUser] = useState({ name: "Officer" }); 
  const navigate = useNavigate();

  const handleLogout = () => {
    // Logic logout lokal
    navigate("/login");
  };

  return (
    <div className="min-h-screen bg-slate-900 text-white flex flex-col items-center justify-center px-4 py-8">
      
      {/* Tombol Logout */}
      {user && (
        <button
          onClick={handleLogout}
          className="absolute top-4 right-4 p-2 rounded-full hover:bg-gray-800 transition-colors"
        >
          <MdOutlineExitToApp className="text-3xl text-yellow-400" />
        </button>
      )}

      {/* Logo Section */}
      <div className="mb-8 md:mb-12 text-center animate-in fade-in duration-700">
        <div className="relative inline-block">
          <img
            src={Logo}
            alt="logo"
            className="w-32 h-auto mx-auto mb-4 md:w-40 drop-shadow-2xl"
          />
          <div className="absolute inset-0 bg-yellow-400/10 rounded-full blur-3xl -z-10"></div>
        </div>
        <h1 className="text-2xl md:text-3xl font-bold text-yellow-400">
          Officer Progress
        </h1>
        <p className="text-sm text-gray-400 mt-1">
          Lokal Monitoring System
        </p>
      </div>

      {/* Wahana Grid */}
      <div className="w-full max-w-4xl mb-10">
        <div className="flex items-center justify-center gap-2 mb-6">
          <HomeIcon className="w-5 h-5 text-yellow-400" />
          <h2 className="text-lg font-semibold text-gray-300">
            Pilih Wahana
          </h2>
        </div>
        
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
          {wahanaCards.map((wahana, index) => (
            <Link
              key={wahana.id}
              to={wahana.path}
              className="bg-gray-800/50 backdrop-blur-md hover:bg-gray-700/80 p-6 rounded-2xl text-center transition-all duration-300 border border-gray-700 hover:border-yellow-500/50 flex flex-col items-center gap-3 group active:scale-95"
            >
              <span className="text-4xl transform transition-transform group-hover:scale-110">
                {wahana.icon}
              </span>
              <span className="font-semibold text-sm md:text-base leading-tight">
                {wahana.name}
              </span>
            </Link>
          ))}
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex flex-col sm:flex-row gap-4 w-full max-w-md">
        <Link
          to="/monitor"
          className="bg-blue-600 hover:bg-blue-700 px-6 py-4 rounded-xl font-bold text-center transition-all shadow-lg flex-1 flex items-center justify-center gap-2 hover:scale-105"
        >
          <MonitorIcon className="w-5 h-5" />
          <span>MODE MONITOR</span>
        </Link>

        <Link
          to="/developer"
          className="bg-yellow-500 hover:bg-yellow-400 text-black px-6 py-4 rounded-xl font-bold text-center transition-all shadow-lg flex-1 flex items-center justify-center gap-2 hover:scale-105"
        >
          <SettingsIcon className="w-5 h-5" />
          <span>DEVELOPER</span>
        </Link>
      </div>
      
      <Footer />
    </div>
  );
}