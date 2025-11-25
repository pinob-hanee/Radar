import React from "react";
import SearchBar from "../components/SearchBar";
import FlightCard from "../components/FlightCard";
import HistoricalFlightCard from "../components/HistoricalFlightCard";
import HistorySection from "../components/HistorySection";
import { TrackerProvider } from "../components/TrackerContext";
import { Plane } from "lucide-react";

const Tracker: React.FC = () => {
  return (
    <TrackerProvider>
      <div className="max-w-7xl mx-auto space-y-8 pb-16">
        {/* Page Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center gap-3 mb-4">
            <Plane className="w-8 h-8 text-blue-300" />
            <h1 className="text-3xl font-bold text-white">Flight Tracker</h1>
          </div>
          <p className="text-blue-100 text-lg">
            Search for live or historical flights and view detailed information
          </p>
        </div>

        {/* Main Content */}
        <div className="space-y-6">
          <SearchBar />
          <FlightCard />
          <HistoricalFlightCard />
          <HistorySection />
        </div>

        {/* Info Footer */}
        <div className="bg-white/5 backdrop-blur rounded-xl p-4 border border-white/10">
          <div className="text-sm text-blue-200 space-y-2">
            <p>
              💡 <strong>Live Flights:</strong> Search currently active flights
              for real-time telemetry (altitude, speed, position)
            </p>
            <p>
              📅 <strong>Historical Flights:</strong> Search past flights by
              date to view route and airline information
            </p>
            <p className="text-xs text-blue-300 mt-2">
              Data availability depends on AviationStack API limits and aircraft
              equipment
            </p>
          </div>
        </div>
      </div>
    </TrackerProvider>
  );
};

export default Tracker;