import { useNavigate } from "react-router-dom";

export default function Home() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gray-900 text-white flex flex-col items-center justify-center">
      <h1 className="text-2xl font-bold mb-6">
        Pilih Officer
      </h1>

      <div className="grid grid-cols-2 gap-4">
        {[1,2,3,4,5,6,7].map((i) => (
          <button
            key={i}
            onClick={() => navigate(`/officer/${i}`)}
            className="bg-blue-600 hover:bg-blue-700 px-6 py-4 rounded-xl font-semibold"
          >
            Officer {i}
          </button>
        ))}
      </div>

      <button
        onClick={() => navigate("/display")}
        className="mt-8 underline text-sm opacity-70"
      >
        Lihat Display Umum
      </button>
    </div>
  );
}
