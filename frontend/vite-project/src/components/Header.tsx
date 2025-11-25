import React from "react";
import { Link, useLocation } from "react-router-dom";
import { Globe, Home, Search } from "lucide-react";

const Header: React.FC = () => {
  const location = useLocation();

  const linkClass = (path: string) =>
    `px-4 py-2 rounded-lg transition-all flex items-center gap-2 ${
      location.pathname === path
        ? "bg-white/20 text-white font-semibold shadow-lg"
        : "text-gray-300 hover:bg-white/10 hover:text-white"
    }`;

  return (
    <header className="fixed inset-x-0 top-0 bg-black/70 backdrop-blur-xl z-50 border-b border-white/10">
      <div className="max-w-7xl mx-auto flex items-center justify-between py-4 px-4 md:px-8">
        <Link to="/" className="flex items-center gap-3 group">
          <div className="bg-gradient-to-br from-blue-500 to-indigo-600 p-2 rounded-xl shadow-lg group-hover:shadow-xl transition-shadow">
            <Globe className="w-6 h-6 text-white" />
          </div>
          <div>
            <h1 className="text-xl font-bold text-white">
              Flight Tracker
            </h1>
            <p className="text-xs text-blue-200">Real-time flight data</p>
          </div>
        </Link>

        <nav className="flex items-center gap-2">
          <Link to="/" className={linkClass("/")}>
            <Home className="w-4 h-4" />
            Home
          </Link>
          <Link to="/track" className={linkClass("/track")}>
            <Search className="w-4 h-4" />
            Tracker
          </Link>
        </nav>
      </div>
    </header>
  );
};

export default Header;