import React from "react";
import { Calendar, Plane, MapPin, Clock } from "lucide-react";
import { useTracker } from "./TrackerContext";
import dayjs from "dayjs";

const HistoricalFlightCard: React.FC = () => {
  const { selectedHistoricalFlight } = useTracker();

  if (!selectedHistoricalFlight) {
    return null;
  }

  const flt = selectedHistoricalFlight;

  return (
    <div className="bg-white/95 backdrop-blur rounded-2xl shadow-2xl overflow-hidden border border-gray-100">
      {/* Header */}
      <div className="bg-linear-to-r from-indigo-600 to-purple-600 p-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="bg-white/20 p-3 rounded-xl backdrop-blur">
              <Calendar className="w-6 h-6 text-white" />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-white">
                {flt.callsign?.trim() ||
                  flt.flight?.iata ||
                  "Historical Flight"}
              </h2>
              <p className="text-indigo-100 text-sm">
                ICAO24: {flt.icao24.toUpperCase()}
              </p>
            </div>
          </div>
          <div className="px-4 py-2 rounded-full text-sm font-semibold bg-purple-800 text-white">
            📅 Historical
          </div>
        </div>
      </div>

      <div className="p-6 space-y-6">
        {/* Flight Date */}
        <div className="bg-linear-to-br from-purple-50 to-indigo-50 p-4 rounded-xl border border-purple-200">
          <div className="flex items-center gap-2 mb-2">
            <Clock className="w-5 h-5 text-purple-600" />
            <span className="text-sm font-medium text-gray-700 uppercase tracking-wide">
              Flight Date
            </span>
          </div>
          <div className="text-2xl font-bold text-purple-900">
            {dayjs(flt.flight_date).format("MMMM D, YYYY")}
          </div>
        </div>

        {/* Flight Details */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {flt.airline && (
            <div className="bg-linear-to-br from-gray-50 to-gray-100 p-4 rounded-xl border border-gray-200">
              <div className="flex items-center gap-2 mb-2">
                <Plane className="w-4 h-4 text-blue-600" />
                <span className="text-xs font-medium text-gray-500 uppercase tracking-wide">
                  Airline
                </span>
              </div>
              <div className="text-lg font-bold text-gray-800">
                {flt.airline.name}
              </div>
              <div className="text-sm text-gray-600 mt-1">
                {flt.airline.iata} / {flt.airline.icao}
              </div>
            </div>
          )}

          {flt.flight && (
            <div className="bg-linear-to-br from-gray-50 to-gray-100 p-4 rounded-xl border border-gray-200">
              <div className="flex items-center gap-2 mb-2">
                <Plane className="w-4 h-4 text-blue-600" />
                <span className="text-xs font-medium text-gray-500 uppercase tracking-wide">
                  Flight Number
                </span>
              </div>
              <div className="text-lg font-bold text-gray-800">
                {flt.flight.iata || flt.flight.number}
              </div>
              <div className="text-sm text-gray-600 mt-1">
                ICAO: {flt.flight.icao}
              </div>
            </div>
          )}
        </div>

        {/* Route Information */}
        {(flt.departure || flt.arrival) && (
          <div className="bg-linear-to-br from-blue-50 to-indigo-50 p-6 rounded-xl border border-blue-200">
            <div className="text-xs font-medium text-gray-500 uppercase tracking-wide mb-4">
              Flight Route
            </div>
            <div className="flex items-center gap-4">
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-2">
                  <MapPin className="w-4 h-4 text-blue-600" />
                  <span className="text-sm font-medium text-gray-600">
                    Departure
                  </span>
                </div>
                <div className="text-xl font-bold text-blue-900">
                  {flt.departure?.airport || "Unknown"}
                </div>
              </div>

              <div className="flex flex-col items-center justify-center px-4">
                <Plane className="w-8 h-8 text-indigo-500 transform rotate-90" />
                <div className="text-xs text-gray-500 mt-1">→</div>
              </div>

              <div className="flex-1 text-right">
                <div className="flex items-center justify-end gap-2 mb-2">
                  <span className="text-sm font-medium text-gray-600">
                    Arrival
                  </span>
                  <MapPin className="w-4 h-4 text-blue-600" />
                </div>
                <div className="text-xl font-bold text-blue-900">
                  {flt.arrival?.airport || "Unknown"}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Info Note */}
        <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-4">
          <p className="text-sm text-yellow-800">
            <strong>ℹ️ Historical Flight:</strong> This is a past flight record.
            Live telemetry data (altitude, speed, position) is not available for
            historical flights.
          </p>
        </div>
      </div>
    </div>
  );
};

export default HistoricalFlightCard;
