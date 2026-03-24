import "./App.css";
import { Routes, Route } from "react-router-dom";
import InitialScreen from "./components/InitialScreen";
import MemoryLane from "./components/MemoryLane";
import RevealPage from "./components/RevealPage";
import Celebration from "./components/Celebration";

function App() {
  return (
    <div className="w-full h-full">
      <Routes>
        <Route path="/" element={<InitialScreen />} />
        <Route path="/memory-lane" element={<MemoryLane />} />
        <Route path="/reveal" element={<RevealPage />} />
        <Route path="/celebration" element={<Celebration />} />
      </Routes>
    </div>
  );
}

export default App;
