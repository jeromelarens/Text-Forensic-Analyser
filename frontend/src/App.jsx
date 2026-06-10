import { BrowserRouter, Routes, Route } from "react-router-dom";
import Login from "./pages/Login";
import Register from "./pages/Register";
import HomeDashboard from "./pages/HomeDashboard";
import UploadText from "./pages/UploadText";
import UploadImage from "./pages/UploadImage";
import UploadVideo from "./pages/UploadVideo";
import ResultDashboard from "./pages/ResultDashboard";
import ExplainableView from "./pages/ExplainableView";
import History from "./pages/History";

import AppLayout from "./layout/AppLayout";

export default function App() {
  return (
    <BrowserRouter>
      <Routes>

        {/* AUTH */}
        <Route path="/" element={<Login />} />
        <Route path="/login" element={<Login />} />   {/* ← ADD THIS */}
        <Route path="/register" element={<Register />} />

        {/* APP */}
        <Route path="/home" element={<AppLayout><HomeDashboard /></AppLayout>} />
        <Route path="/upload/text" element={<AppLayout><UploadText /></AppLayout>} />
        <Route path="/upload/image" element={<AppLayout><UploadImage /></AppLayout>} />
        <Route path="/upload/video" element={<AppLayout><UploadVideo /></AppLayout>} />
        <Route path="/result" element={<AppLayout><ResultDashboard /></AppLayout>} />
        <Route path="/explain" element={<AppLayout><ExplainableView /></AppLayout>} />
        <Route path="/history" element={<AppLayout><History /></AppLayout>} />

      </Routes>
    </BrowserRouter>
  );
}