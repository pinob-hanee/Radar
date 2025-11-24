/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useState, useCallback } from "react";
import {
  Calendar,
  Loader2,
  AlertCircle,
  X,
} from "lucide-react";
import dayjs from "dayjs";
import utc from "dayjs/plugin/utc";
import { API_BASE } from "../config";
import { useTracker } from "./TrackerContext";

dayjs.extend(utc);

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
    dayjs().subtract(13, "day").format("YYYY-MM-DD")
  );
  const [rangeEnd, setRangeEnd] = useState(
    dayjs().format("YYYY-MM-DD")
  );

  const fetchHistory = useCallback(async () => {
    if (!selectedFlight) return;

    setHistoryLoading(true);
    setHistoryError("");
    setHistoryData([]);

    const start = dayjs.utc(rangeStart);
    const end = dayjs.utc(rangeEnd);

    if (end.diff(start, "day") > 13) {
      setHistoryError("Maximum range is 14 days");
      setHistoryLoading(false);
      return;
    }

    const dates: string[] = [];
    for (let d = start.clone(); !d.isAfter(end); d = d.add(1, "day")) {
      dates.push(d.format("YYYY-MM-DD"));
    }

    const all: any[] = [];

    try {
      for (const d of dates) {
        const resp = await fetch(
          `${API_BASE}/flight/history/${selectedFlight.icao24}?date=${d}`
        );
        const json = await resp.json();

        if (!resp.ok) {
          throw new Error(json.error ?? `Failed for ${d}`);
        }

        all.push(...(json.flights as any[]));
      }

      if (all.length === 0) {
        setHistoryError("No historic records for the selected period.");
      } else {
        setHistoryData(all);
      }
    } catch (e: any) {
      console.error(e);
      setHistoryError(e.message ?? "Error loading history");
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

  if (!selectedFlight) return null; // hide section until a flight is selected

  return (
    <section className="bg-white/95 backdrop-blur rounded-2xl shadow-2xl p-6">
      <h3 className="text-lg font-bold text-gray-800 mb-4">
        Flight History (last 2 weeks)
      </h3>

      {/* Date‑range picker */}
      <div className="flex items-center gap-3 mb-4">
        <Calendar className="w-5 h-5 text-gray-600" />
        <label>
          From
          <input
            type="date"
            className="ml-1 border rounded px-2 py-1"
            value={rangeStart}
            max={dayjs().format("YYYY-MM-DD")}
            onChange={(e) => setRangeStart(e.target.value)}
          />
        </label>
        <label className="ml-3">
          To
          <input
            type="date"
            className="ml-1 border rounded px-2 py-1"
            value={rangeEnd}
            max={dayjs().format("YYYY-MM-DD")}
            onChange={(e) => setRangeEnd(e.target.value)}
          />
        </label>
        <button
          onClick={fetchHistory}
          disabled={historyLoading}
          className={`px-4 py-2 rounded bg-indigo-600 text-white hover:bg-indigo-700 transition ${
            historyLoading ? "opacity-50 cursor-not-allowed" : ""
          }`}
        >
          {historyLoading ? "Loading…" : "Load History"}
        </button>

        {historyData.length > 0 && (
          <button
            onClick={() => {
              setHistoryData([]);
              setHistoryError("");
            }}
            className="text-gray-500 hover:text-gray-800"
          >
            <X className="w-5 h-5" />
          </button>
        )}
      </div>

      {/* Loading / error / empty states */}
      {historyLoading && (
        <div className="flex items-center gap-2 text-gray-600 mb-2">
          <Loader2 className="animate-spin w-5 h-5" />
          <span>Fetching history…</span>
        </div>
      )}
      {historyError && (
        <div className="p-3 mb-2 bg-red-50 border border-red-200 rounded text-red-700">
          <AlertCircle className="w-5 h-5 inline mr-2" />
          {historyError}
        </div>
      )}
      {!historyLoading && !historyError && historyData.length === 0 && (
        <p className="text-gray-600">
          No historic records loaded yet. Pick a range and click “Load History”.
        </p>
      )}

      {/* Table */}
      {historyData.length > 0 && (
        <div className="overflow-x-auto">
          <table className="w-full table-auto border-collapse">
            <thead className="bg-gray-50">
              <tr>
                <th className="p-2 text-left text-sm font-medium text-gray-600">
                  Date (UTC)
                </th>
                <th className="p-2 text-left text-sm font-medium text-gray-600">
                  Airline
                </th>
                <th className="p-2 text-left text-sm font-medium text-gray-600">
                  Flight #
                </th>
                <th className="p-2 text-left text-sm font-medium text-gray-600">
                  Departure
                </th>
                <th className="p-2 text-left text-sm font-medium text-gray-600">
                  Arrival
                </th>
                <th className="p-2 text-left text-sm font-medium text-gray-600">
                  Callsign
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {historyData.map((fh, i) => (
                <tr key={i} className="hover:bg-gray-50">
                  <td className="p-2 text-sm text-gray-800">
                    {fh.flight_date}
                  </td>
                  <td className="p-2 text-sm text-gray-800">
                    {fh.airline?.name ?? "–"}
                  </td>
                  <td className="p-2 text-sm font-mono text-gray-800">
                    {fh.flight?.iata ?? fh.flight?.icao ?? "–"}
                  </td>
                  <td className="p-2 text-sm text-gray-800">
                    {fh.departure?.airport ?? "–"}
                  </td>
                  <td className="p-2 text-sm text-gray-800">
                    {fh.arrival?.airport ?? "–"}
                  </td>
                  <td className="p-2 text-sm font-mono text-gray-800">
                    {fh.callsign?.trim() ?? "–"}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </section>
  );
};

export default HistorySection;
