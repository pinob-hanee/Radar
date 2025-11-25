import React from "react";
import { MapPin, Plane, Gauge, Navigation2, Clock } from "lucide-react";
import { useTracker } from "./TrackerContext";
import dayjs from "dayjs";
import utc from "dayjs/plugin/utc";

dayjs.extend(utc);

const formatAltitude = (alt: number | null) =>
  !alt ? "Ground" : `${Math.round(alt * 3.28084).toLocaleString()} ft`;

const formatSpeed = (spd: number | null) =>
  !spd ? "N/A" : `${Math.round(spd * 1.944)} knots`;

const formatVerticalRate = (rate: number | null) =>
  !rate ? "Level" : `${Math.round(rate * 196.85)} ft/min`;

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
  return map[c] ?? "🌍";
};

const FlightCard: React.FC = () => {
  const { selectedFlight } = useTracker();

  if (!selectedFlight) {
    return (
      <div className="bg-gradient-to-br from-blue-50 to-indigo-50 backdrop-blur rounded-2xl shadow-xl p-12 text-center border border-blue-100">
        <Plane className="w-16 h-16 text-blue-400 mx-auto mb-4 animate-pulse" />
        <h3 className="text-xl font-semibold text-gray-700 mb-2">
          No Flight Selected
        </h3>
        <p className="text-gray-500">
          Search for a flight using the callsign or ICAO24 code above
        </p>
      </div>
    );
  }

  const lastUpdate = selectedFlight.last_contact
    ? dayjs.unix(selectedFlight.last_contact).format("HH:mm:ss UTC")
    : "N/A";

  return (
    <div className="bg-white/95 backdrop-blur rounded-2xl shadow-2xl overflow-hidden border border-gray-100">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-600 to-indigo-600 p-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="bg-white/20 p-3 rounded-xl backdrop-blur">
              <Plane className="w-6 h-6 text-white" />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-white">
                {selectedFlight.callsign?.trim() || "Unknown Flight"}
              </h2>
              <p className="text-blue-100 text-sm">
                ICAO24: {selectedFlight.icao24.toUpperCase()}
              </p>
            </div>
          </div>
          <div
            className={`px-4 py-2 rounded-full text-sm font-semibold ${
              selectedFlight.on_ground
                ? "bg-gray-800 text-gray-100"
                : "bg-green-500 text-white"
            }`}
          >
            {selectedFlight.on_ground ? "🛬 On Ground" : "✈️ In Flight"}
          </div>
        </div>
      </div>

      <div className="p-6 space-y-6">
        {/* Aircraft Info */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="bg-gradient-to-br from-gray-50 to-gray-100 p-4 rounded-xl border border-gray-200">
            <div className="flex items-center gap-2 mb-2">
              <MapPin className="w-4 h-4 text-blue-600" />
              <span className="text-xs font-medium text-gray-500 uppercase tracking-wide">
                Origin Country
              </span>
            </div>
            <div className="text-lg font-bold text-gray-800">
              <span className="text-2xl mr-2">
                {getCountryFlag(selectedFlight.origin_country)}
              </span>
              {selectedFlight.origin_country}
            </div>
          </div>

          <div className="bg-gradient-to-br from-gray-50 to-gray-100 p-4 rounded-xl border border-gray-200">
            <div className="flex items-center gap-2 mb-2">
              <Clock className="w-4 h-4 text-blue-600" />
              <span className="text-xs font-medium text-gray-500 uppercase tracking-wide">
                Last Update
              </span>
            </div>
            <div className="text-lg font-bold text-gray-800">{lastUpdate}</div>
          </div>
        </div>

        {/* Flight Telemetry */}
        <div>
          <h3 className="text-sm font-semibold text-gray-700 mb-3 uppercase tracking-wide">
            Live Telemetry
          </h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="bg-gradient-to-br from-blue-50 to-blue-100 p-4 rounded-xl border border-blue-200">
              <div className="flex items-center gap-2 mb-1">
                <Gauge className="w-4 h-4 text-blue-600" />
                <div className="text-xs text-gray-600 font-medium">
                  Altitude
                </div>
              </div>
              <div className="text-xl font-bold text-blue-900">
                {formatAltitude(selectedFlight.baro_altitude)}
              </div>
            </div>

            <div className="bg-gradient-to-br from-green-50 to-green-100 p-4 rounded-xl border border-green-200">
              <div className="flex items-center gap-2 mb-1">
                <Gauge className="w-4 h-4 text-green-600" />
                <div className="text-xs text-gray-600 font-medium">Speed</div>
              </div>
              <div className="text-xl font-bold text-green-900">
                {formatSpeed(selectedFlight.velocity)}
              </div>
            </div>

            <div className="bg-gradient-to-br from-purple-50 to-purple-100 p-4 rounded-xl border border-purple-200">
              <div className="flex items-center gap-2 mb-1">
                <Navigation2 className="w-4 h-4 text-purple-600" />
                <div className="text-xs text-gray-600 font-medium">Heading</div>
              </div>
              <div className="text-xl font-bold text-purple-900">
                {selectedFlight.true_track
                  ? Math.round(selectedFlight.true_track) + "°"
                  : "N/A"}
              </div>
            </div>

            <div className="bg-gradient-to-br from-orange-50 to-orange-100 p-4 rounded-xl border border-orange-200">
              <div className="flex items-center gap-2 mb-1">
                <Gauge className="w-4 h-4 text-orange-600" />
                <div className="text-xs text-gray-600 font-medium">
                  V/S Rate
                </div>
              </div>
              <div className="text-xl font-bold text-orange-900">
                {formatVerticalRate(selectedFlight.vertical_rate)}
              </div>
            </div>
          </div>
        </div>

        {/* Position Info */}
        {selectedFlight.latitude && selectedFlight.longitude && (
          <div className="bg-gradient-to-br from-indigo-50 to-blue-50 p-4 rounded-xl border border-indigo-200">
            <div className="text-xs font-medium text-gray-500 uppercase tracking-wide mb-2">
              Current Position
            </div>
            <div className="flex gap-6 text-sm">
              <div>
                <span className="text-gray-600">Latitude:</span>{" "}
                <span className="font-mono font-semibold text-gray-800">
                  {selectedFlight.latitude.toFixed(4)}°
                </span>
              </div>
              <div>
                <span className="text-gray-600">Longitude:</span>{" "}
                <span className="font-mono font-semibold text-gray-800">
                  {selectedFlight.longitude.toFixed(4)}°
                </span>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default FlightCard;