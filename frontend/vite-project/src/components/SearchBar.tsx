import React, { useState, useCallback, type KeyboardEvent } from "react";
import { Search, AlertCircle, Loader2, X, Calendar } from "lucide-react";
import dayjs from "dayjs";
import { API_BASE } from "../config";
import { useTracker } from "./TrackerContext";

const SearchBar: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [searchDate, setSearchDate] = useState("");
  const [searchMode, setSearchMode] = useState<"live" | "historical">("live");
  const [isSearching, setIsSearching] = useState(false);
  const [searchError, setSearchError] = useState("");

  const {
    setSelectedFlight,
    setHistoryData,
    setHistoryError,
    setSelectedHistoricalFlight,
  } = useTracker();

  const doSearch = useCallback(async () => {
    const trimmed = searchTerm.trim();

    if (!trimmed) {
      setSearchError("Please enter a callsign or ICAO24 code");
      setSelectedFlight(null);
      setSelectedHistoricalFlight(null);
      return;
    }

    if (searchMode === "historical" && !searchDate) {
      setSearchError("Please select a date for historical search");
      return;
    }

    setSearchError("");
    setIsSearching(true);
    setSelectedFlight(null);
    setSelectedHistoricalFlight(null);
    setHistoryData([]);
    setHistoryError("");

    try {
      let url = `${API_BASE}/flight/search?query=${encodeURIComponent(
        trimmed
      )}`;

      if (searchMode === "historical" && searchDate) {
        url += `&date=${searchDate}`;
      }

      const resp = await fetch(url);
      const data = await resp.json();

      if (!resp.ok) {
        setSearchError(
          data.error || "Flight not found. Try another callsign or date."
        );
        return;
      }

      if (data.flight) {
        if (data.isHistorical) {
          setSelectedHistoricalFlight(data.flight);
        } else {
          setSelectedFlight(data.flight);
        }
        setSearchError("");
      } else {
        setSearchError("No flight data returned from server");
      }
    } catch (e: unknown) {
      console.error("Search error:", e);
      setSearchError(
        "Network error. Please check your connection and try again."
      );
    } finally {
      setIsSearching(false);
    }
  }, [
    searchTerm,
    searchDate,
    searchMode,
    setSelectedFlight,
    setSelectedHistoricalFlight,
    setHistoryData,
    setHistoryError,
  ]);

  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && !isSearching) {
      doSearch();
    }
  };

  const clearSearch = () => {
    setSearchTerm("");
    setSearchDate("");
    setSearchError("");
    setSelectedFlight(null);
    setSelectedHistoricalFlight(null);
    setHistoryData([]);
    setHistoryError("");
  };

  return (
    <div className="bg-white/95 backdrop-blur rounded-2xl shadow-xl p-6 border border-gray-100">
      <div className="flex flex-col gap-4">
        {/* Search Mode Toggle */}
        <div className="flex gap-2 p-1 bg-gray-100 rounded-lg">
          <button
            onClick={() => {
              setSearchMode("live");
              setSearchDate("");
            }}
            className={`flex-1 px-4 py-2 rounded-lg font-medium transition-all ${
              searchMode === "live"
                ? "bg-white text-blue-600 shadow"
                : "text-gray-600 hover:text-gray-800"
            }`}
          >
            🔴 Live Flights
          </button>
          <button
            onClick={() => setSearchMode("historical")}
            className={`flex-1 px-4 py-2 rounded-lg font-medium transition-all ${
              searchMode === "historical"
                ? "bg-white text-indigo-600 shadow"
                : "text-gray-600 hover:text-gray-800"
            }`}
          >
            📅 Historical Flights
          </button>
        </div>

        {/* Search Input */}
        <div className="flex flex-col md:flex-row gap-2">
          <div className="relative flex-1">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5 pointer-events-none" />
            <input
              type="text"
              placeholder={
                searchMode === "live"
                  ? "Enter callsign (e.g., AA100) or ICAO24 (e.g., 3c6444)"
                  : "Enter flight number (e.g., AA100) or callsign"
              }
              className="w-full pl-12 pr-12 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200 text-lg transition-all"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              onKeyDown={handleKeyDown}
              disabled={isSearching}
            />
            {searchTerm && (
              <button
                onClick={() => setSearchTerm("")}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition"
                disabled={isSearching}
              >
                <X className="w-5 h-5" />
              </button>
            )}
          </div>

          {searchMode === "historical" && (
            <div className="relative md:w-64">
              <Calendar className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5 pointer-events-none" />
              <input
                type="date"
                className="w-full pl-12 pr-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 text-lg transition-all"
                value={searchDate}
                max={dayjs().format("YYYY-MM-DD")}
                onChange={(e) => setSearchDate(e.target.value)}
                disabled={isSearching}
              />
            </div>
          )}

          <button
            onClick={doSearch}
            disabled={
              isSearching ||
              !searchTerm.trim() ||
              (searchMode === "historical" && !searchDate)
            }
            className={`px-8 py-3 rounded-xl font-semibold transition-all shadow-lg hover:shadow-xl disabled:cursor-not-allowed disabled:shadow-none flex items-center gap-2 whitespace-nowrap ${
              searchMode === "live"
                ? "bg-linear-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 disabled:from-gray-400 disabled:to-gray-500 text-white"
                : "bg-linear-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 disabled:from-gray-400 disabled:to-gray-500 text-white"
            }`}
          >
            {isSearching ? (
              <>
                <Loader2 className="w-5 h-5 animate-spin" />
                Searching...
              </>
            ) : (
              <>
                <Search className="w-5 h-5" />
                Search
              </>
            )}
          </button>

          {(searchTerm || searchDate) && (
            <button
              onClick={clearSearch}
              className="text-gray-500 hover:text-gray-700 hover:bg-gray-100 px-4 py-2 rounded-xl transition"
              title="Clear all"
              disabled={isSearching}
            >
              <X className="w-5 h-5" />
            </button>
          )}
        </div>

        {searchError && (
          <div className="flex items-start gap-3 p-4 bg-red-50 border border-red-200 rounded-xl text-red-700 animate-in fade-in slide-in-from-top-2 duration-300">
            <AlertCircle className="w-5 h-5 flex-shrink-0 mt-0.5" />
            <div className="flex-1">
              <p className="font-medium">{searchError}</p>
              <p className="text-sm text-red-600 mt-1">
                {searchMode === "live"
                  ? "Make sure the flight is currently active. Try historical search for past flights."
                  : "Make sure the flight number and date are correct."}
              </p>
            </div>
          </div>
        )}

        <div className="text-sm text-gray-500 bg-blue-50 p-3 rounded-lg border border-blue-100">
          <strong className="text-gray-700">💡 Tip:</strong>{" "}
          {searchMode === "live"
            ? "Search for currently active flights by flight number or aircraft ICAO24 code"
            : "Search for past flights by selecting a date (up to historical data availability)"}
        </div>
      </div>
    </div>
  );
};

export default SearchBar;
