import React from "react";
import { Link, useLocation } from "react-router-dom";
import { Globe } from "lucide-react";

const Header: React.FC = () => {
  const location = useLocation();

  const linkClass = (path: string) =>
    `px-4 py-2 rounded-lg transition ${
      location.pathname === path
        ? "bg-white/20 text-white font-semibold"
        : "text-gray-300 hover:bg-white/10"
    }`;

  return (
    <header className="fixed inset-x-0 top-0 bg-black/70 backdrop-blur-xl z-20">
      <div className="max-w-7xl mx-auto flex items-center justify-between py-3 px-4 md:px-8">
        <div className="flex items-center gap-3">
          <Globe className="w-6 h-6 text-blue-400" />
          <h1 className="text-xl font-bold text-white">
            Flight Tracker
          </h1>
        </div>

        <nav className="flex items-center gap-2">
          <Link to="/" className={linkClass("/")}>
            Home
          </Link>
          <Link to="/track" className={linkClass("/track")}>
            Tracker
          </Link>
        </nav>
      </div>
    </header>
  );
};

export default Header;
