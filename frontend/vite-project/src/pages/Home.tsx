import React from "react";
import { Link } from "react-router-dom";
import { Plane, Search } from "lucide-react";

const Home: React.FC = () => {
  return (
    <section className="max-w-4xl mx-auto py-20 text-center text-white">
      <Plane className="mx-auto w-20 h-20 text-indigo-300 mb-6" />
      <h2 className="text-4xl font-bold mb-4">
        Global Flight Tracker (AviationStack)
      </h2>
      <p className="text-lg mb-8 max-w-xl mx-auto">
        Search any active flight by **callsign** or **ICAO24** and view live
        telemetry as well as up to two weeks of historic data. The data comes
        from the free AviationStack API (no key required for basic usage).
      </p>

      <Link
        to="/track"
        className="inline-flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold px-6 py-3 rounded-lg transition"
      >
        <Search className="w-5 h-5" />
        Go to Tracker
      </Link>
    </section>
  );
};

export default Home;
