import "./App.css";

import MapView from "./components/pages/MapView";
import DashBoard from "./components/pages/DashBoard";
import DeviceList from "./components/pages/DeviceList";
import Home from "./components/pages/Home";
import AnprCamera from "./components/pages/AnprCamera";
import HeadCount from "./components/pages/HeadCount";
import { Route, Routes } from "react-router-dom";

const App: React.FC = () => {
  return (
    <>
      <Routes>
        <Route path="/" element={<DashBoard />} />
        <Route path="/search_plat" element={<Home />} />
        <Route path="/devices" element={<DeviceList />} />
        <Route path="/map" element={<MapView />} />
        <Route path="/anpr" element={<AnprCamera />} />
        <Route path="/headcount" element={<HeadCount />} />
        <Route path="*" element={<div>Not Found</div>} />
      </Routes>
    </>
  );
};

export default App;
