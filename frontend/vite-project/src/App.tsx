import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import Header from "./components/Header";
import Home from "./pages/Home";
import Tracker from "./pages/Tracker";

const App: React.FC = () => (
  <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-indigo-900">
    <Header />
    <main className="pt-20 px-4 md:px-8">
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/track" element={<Tracker />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </main>
  </div>
);

export default App;
