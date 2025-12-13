import { Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import Officer from "./pages/Officer";
import Display from "./pages/Display";

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/officer/:id" element={<Officer />} />
      <Route path="/display" element={<Display />} />
    </Routes>
  );
}
