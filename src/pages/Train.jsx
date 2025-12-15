import Officer from "./Officer";

export default function Train() {
  return (
    <div className="min-h-screen bg-gray-900 text-white grid md:grid-cols-2 gap-8 p-6">
      <Officer forceId="2" />
      <Officer forceId="5" />
    </div>
  );
}
