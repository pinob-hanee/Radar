import React, { useState, useCallback } from "react";
import { Calendar, Loader2, AlertCircle, X, Clock, Plane } from "lucide-react";
import dayjs from "dayjs";
import utc from "dayjs/plugin/utc";
import { API_BASE } from "../config";
import { useTracker } from "./TrackerContext";

dayjs.extend(utc);

interface HistoryFlight {
  icao24: string;
  flight_date: string;
  callsign: string | null;
  airline?: { name: string; iata: string; icao: string };
  flight?: { number: string; iata: string; icao: string };
  departure?: { airport: string | null };
  arrival?: { airport: string | null };
}

const HistorySection: React.FC = () => {
  const {
    selectedFlight,
    historyData,
    setHistoryData,
    historyLoading,
    setHistoryLoading,
    historyError,
    setHistoryError,
  } = useTracker();

  const [rangeStart, setRangeStart] = useState(
    dayjs().subtract(6, "day").format("YYYY-MM-DD")
  );
  const [rangeEnd, setRangeEnd] = useState(dayjs().format("YYYY-MM-DD"));

  const fetchHistory = useCallback(async () => {
    if (!selectedFlight) return;

    setHistoryLoading(true);
    setHistoryError("");
    setHistoryData([]);

    const start = dayjs.utc(rangeStart);
    const end = dayjs.utc(rangeEnd);
    const daysDiff = end.diff(start, "day");

    if (daysDiff > 13) {
      setHistoryError("Maximum range is 14 days. Please select a shorter period.");
      setHistoryLoading(false);
      return;
    }

    if (daysDiff < 0) {
      setHistoryError("End date must be after start date.");
      setHistoryLoading(false);
      return;
    }

    const dates: string[] = [];
    for (let d = start.clone(); !d.isAfter(end); d = d.add(1, "day")) {
      dates.push(d.format("YYYY-MM-DD"));
    }

    const all: HistoryFlight[] = [];
    let errorCount = 0;

    try {
      for (const d of dates) {
        try {
          const resp = await fetch(
            `${API_BASE}/flight/history/${selectedFlight.icao24}?date=${d}`
          );
          const json = await resp.json();

          if (resp.ok && json.flights && Array.isArray(json.flights)) {
            all.push(...json.flights);
          } else {
            errorCount++;
          }
        } catch (err) {
          errorCount++;
          console.warn(`Failed to fetch history for ${d}:`, err);
        }
      }

      if (all.length === 0) {
        setHistoryError(
          `No flight history found for ${selectedFlight.callsign || selectedFlight.icao24} between ${start.format("MMM D")} and ${end.format("MMM D, YYYY")}.`
        );
      } else {
        setHistoryData(all);
        if (errorCount > 0) {
          console.info(`Note: ${errorCount} date(s) had no data or errors.`);
        }
      }
    } catch (e: unknown) {
      console.error("History fetch error:", e);
      setHistoryError("Failed to load flight history. Please try again.");
    } finally {
      setHistoryLoading(false);
    }
  }, [
    selectedFlight,
    rangeStart,
    rangeEnd,
    setHistoryData,
    setHistoryError,
    setHistoryLoading,
  ]);

  const clearHistory = () => {
    setHistoryData([]);
    setHistoryError("");
  };

  if (!selectedFlight) {
    return null;
  }

  return (
    <section className="bg-white/95 backdrop-blur rounded-2xl shadow-2xl overflow-hidden border border-gray-100">
      {/* Header */}
      <div className="bg-gradient-to-r from-indigo-600 to-purple-600 p-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="bg-white/20 p-3 rounded-xl backdrop-blur">
              <Clock className="w-6 h-6 text-white" />
            </div>
            <div>
              <h3 className="text-xl font-bold text-white">Flight History</h3>
              <p className="text-indigo-100 text-sm">
                View past flights for {selectedFlight.callsign || selectedFlight.icao24}
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="p-6 space-y-6">
        {/* Date Range Picker */}
        <div className="bg-gray-50 p-4 rounded-xl border border-gray-200">
          <div className="flex flex-wrap items-end gap-4">
            <div className="flex-1 min-w-[200px]">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <Calendar className="w-4 h-4 inline mr-1" />
                From Date
              </label>
              <input
                type="date"
                className="w-full border-2 border-gray-200 rounded-lg px-3 py-2 focus:outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 transition-all"
                value={rangeStart}
                max={dayjs().format("YYYY-MM-DD")}
                onChange={(e) => setRangeStart(e.target.value)}
                disabled={historyLoading}
              />
            </div>

            <div className="flex-1 min-w-[200px]">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <Calendar className="w-4 h-4 inline mr-1" />
                To Date
              </label>
              <input
                type="date"
                className="w-full border-2 border-gray-200 rounded-lg px-3 py-2 focus:outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 transition-all"
                value={rangeEnd}
                max={dayjs().format("YYYY-MM-DD")}
                onChange={(e) => setRangeEnd(e.target.value)}
                disabled={historyLoading}
              />
            </div>

            <button
              onClick={fetchHistory}
              disabled={historyLoading}
              className="bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 disabled:from-gray-400 disabled:to-gray-500 text-white px-6 py-2 rounded-lg font-semibold transition-all shadow-lg hover:shadow-xl disabled:cursor-not-allowed flex items-center gap-2"
            >
              {historyLoading ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  Loading...
                </>
              ) : (
                <>
                  <Clock className="w-5 h-5" />
                  Load History
                </>
              )}
            </button>

            {historyData.length > 0 && (
              <button
                onClick={clearHistory}
                className="text-gray-500 hover:text-gray-700 hover:bg-gray-100 p-2 rounded-lg transition"
                title="Clear history"
              >
                <X className="w-5 h-5" />
              </button>
            )}
          </div>

          <div className="text-xs text-gray-500 mt-3 bg-white p-2 rounded border border-gray-200">
            <strong>Note:</strong> Maximum date range is 14 days. Data availability depends on AviationStack API limits.
          </div>
        </div>

        {/* Loading State */}
        {historyLoading && (
          <div className="flex flex-col items-center justify-center py-12 gap-4">
            <Loader2 className="w-12 h-12 animate-spin text-indigo-600" />
            <p className="text-gray-600 font-medium">Loading flight history...</p>
            <p className="text-sm text-gray-500">This may take a few moments</p>
          </div>
        )}

        {/* Error State */}
        {historyError && !historyLoading && (
          <div className="flex items-start gap-3 p-4 bg-red-50 border border-red-200 rounded-xl text-red-700">
            <AlertCircle className="w-5 h-5 flex-shrink-0 mt-0.5" />
            <div>
              <p className="font-medium">{historyError}</p>
              <p className="text-sm text-red-600 mt-1">
                Try adjusting the date range or searching for a different flight.
              </p>
            </div>
          </div>
        )}

        {/* Empty State */}
        {!historyLoading && !historyError && historyData.length === 0 && (
          <div className="text-center py-12">
            <Plane className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <p className="text-gray-600 font-medium mb-2">No History Loaded</p>
            <p className="text-sm text-gray-500">
              Select a date range and click "Load History" to view past flights
            </p>
          </div>
        )}

        {/* History Table */}
        {historyData.length > 0 && !historyLoading && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <p className="text-sm font-medium text-gray-700">
                Found <span className="font-bold text-indigo-600">{historyData.length}</span> flight
                {historyData.length !== 1 ? "s" : ""}
              </p>
            </div>

            <div className="overflow-x-auto rounded-xl border border-gray-200">
              <table className="w-full">
                <thead className="bg-gradient-to-r from-gray-50 to-gray-100">
                  <tr>
                    <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                      Date
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                      Flight
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                      Airline
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                      Route
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                      Callsign
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-100">
                  {historyData.map((fh, i) => (
                    <tr key={i} className="hover:bg-gray-50 transition">
                      <td className="px-4 py-3 text-sm text-gray-800 font-medium">
                        {dayjs(fh.flight_date).format("MMM D, YYYY")}
                      </td>
                      <td className="px-4 py-3 text-sm font-mono font-semibold text-indigo-600">
                        {fh.flight?.iata || fh.flight?.icao || "–"}
                      </td>
                      <td className="px-4 py-3 text-sm text-gray-700">
                        {fh.airline?.name || "–"}
                      </td>
                      <td className="px-4 py-3 text-sm text-gray-700">
                        <span className="font-medium">
                          {fh.departure?.airport || "–"}
                        </span>
                        <span className="text-gray-400 mx-2">→</span>
                        <span className="font-medium">
                          {fh.arrival?.airport || "–"}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-sm font-mono text-gray-600">
                        {fh.callsign?.trim() || "–"}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </section>
  );
};

export default HistorySection;