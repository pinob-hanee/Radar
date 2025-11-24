/* eslint-disable @typescript-eslint/no-unused-vars */
import React from "react";
import { MapPin, Navigation, Gauge } from "lucide-react";
import { useTracker } from "./TrackerContext";

const formatAltitude = (alt: number | null) =>
  !alt ? "Ground" : `${Math.round(alt * 3.28084).toLocaleString()} ft`;

const formatSpeed = (spd: number | null) =>
  !spd ? "N/A" : `${Math.round(spd * 3.6)} km/h`;

const getCountryFlag = (c: string) => {
  const map: Record<string, string> = {
    "United States": "🇺🇸",
    "United Kingdom": "🇬🇧",
    Germany: "🇩🇪",
    France: "🇫🇷",
    China: "🇨🇳",
    Japan: "🇯🇵",
    Canada: "🇨🇦",
    Australia: "🇦🇺",
    India: "🇮🇳",
    Brazil: "🇧🇷",
    Russia: "🇷🇺",
    Spain: "🇪🇸",
    Italy: "🇮🇹",
    Netherlands: "🇳🇱",
    Switzerland: "🇨🇭",
    Turkey: "🇹🇷",
    UAE: "🇦🇪",
    Singapore: "🇸🇬",
    "South Korea": "🇰🇷",
    Mexico: "🇲🇽",
  };
  return map[c] ?? "✈️";
};

const FlightCard: React.FC = () => {
  const { selectedFlight } = useTracker();

  if (!selectedFlight) return null; // nothing selected yet

  return (
    <div className="bg-white/95 backdrop-blur rounded-2xl shadow-2xl p-6">
      <div className="flex items-center gap-3 mb-4">
        <MapPin className="w-6 h-6 text-blue-600" />
        <h2 className="text-xl font-bold text-gray-800">
          Live Flight –{" "}
          {selectedFlight.callsign || selectedFlight.icao24}
        </h2>
      </div>

      {/* Basic info */}
      <div className="grid grid-cols-2 gap-4 mb-6">
        <div className="bg-gray-50 p-3 rounded">
          <span className="text-sm text-gray-600 block">ICAO24</span>
          <span className="font-mono text-lg">{selectedFlight.icao24}</span>
        </div>
        <div className="bg-gray-50 p-3 rounded">
          <span className="text-sm text-gray-600 block">Callsign</span>
          <span className="font-bold text-lg">
            {selectedFlight.callsign ?? "N/A"}
          </span>
        </div>
        <div className="bg-gray-50 p-3 rounded">
          <span className="text-sm text-gray-600 block">
            Origin Country
          </span>
          <span className="font-bold">
            {getCountryFlag(selectedFlight.origin_country)}{" "}
            {selectedFlight.origin_country}
          </span>
        </div>
        <div className="bg-gray-50 p-3 rounded">
          <span className="text-sm text-gray-600 block">Status</span>
          <span
            className={`px-2 py-1 rounded text-xs font-semibold ${
              selectedFlight.on_ground
                ? "bg-gray-200 text-gray-800"
                : "bg-green-100 text-green-800"
            }`}
          >
            {selectedFlight.on_ground ? "On Ground" : "In Air"}
          </span>
        </div>
      </div>

      {/* Live telemetry */}
      <div className="grid grid-cols-3 gap-4 mb-6">
        <div className="bg-blue-50 p-4 rounded">
          <div className="text-sm text-gray-600">Altitude</div>
          <div className="text-xl font-bold">
            {formatAltitude(selectedFlight.baro_altitude)}
          </div>
        </div>

        <div className="bg-blue-50 p-4 rounded">
          <div className="text-sm text-gray-600">Ground Speed</div>
          <div className="text-xl font-bold">
            {formatSpeed(selectedFlight.velocity)}
          </div>
        </div>

        <div className="bg-blue-50 p-4 rounded">
          <div className="text-sm text-gray-600">Heading</div>
          <div className="text-xl font-bold">
            {selectedFlight.true_track
              ? Math.round(selectedFlight.true_track) + "°"
              : "N/A"}
          </div>
        </div>
      </div>
    </div>
  );
};

export default FlightCard;
