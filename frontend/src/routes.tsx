import { Routes, Route } from "react-router-dom";
import { Lobby } from "./pages/lobby";
import { RoomPage } from "./pages/room";

export const AppRoutes = () => {
  return (
      <Routes>
        <Route path="/" element={<Lobby />} />
        <Route path="/room/:roomId" element={<RoomPage />} />
      </Routes>
  );
};
