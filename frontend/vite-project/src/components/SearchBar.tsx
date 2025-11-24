/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useState, useCallback, type KeyboardEvent } from "react";
import { Search, AlertCircle } from "lucide-react";
import { API_BASE } from "../config";
import { useTracker } from "./TrackerContext";

const SearchBar: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [searchError, setSearchError] = useState("");
  const {
    setSelectedFlight,
    setHistoryData,
    setHistoryError,
    setHistoryLoading,
  } = useTracker();

  const doSearch = useCallback(async () => {
    if (!searchTerm.trim()) {
      setSearchError("Enter a callsign or ICAO24");
      setSelectedFlight(null);
      return;
    }

    setSearchError("");
    setSelectedFlight(null);
    setHistoryData([]);
    setHistoryError("");

    try {
      const resp = await fetch(
        `${API_BASE}/flight/search?query=${encodeURIComponent(
          searchTerm.trim()
        )}`
      );
      const data = await resp.json();

      if (!resp.ok) {
        setSearchError(data.error ?? "Flight not found");
        return;
      }

      setSelectedFlight(data.flight);
    } catch (e: any) {
      console.error(e);
      setSearchError("Network error while searching");
    }
  }, [searchTerm, setSelectedFlight, setHistoryData, setHistoryError]);

  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") doSearch();
  };

  return (
    <div className="flex gap-2">
      <div className="relative flex-1">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
        <input
          type="text"
          placeholder="Callsign or ICAO24 (e.g. AA100 or 3c6444)"
          className="w-full pl-10 pr-4 py-3 border-2 border-gray-200 rounded-lg focus:outline-none focus:border-blue-500 text-lg"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          onKeyDown={handleKeyDown}
        />
      </div>
      <button
        onClick={doSearch}
        className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-2 rounded-lg transition"
      >
        Search
      </button>

      {searchError && (
        <div className="flex items-center gap-2 p-3 bg-red-50 border border-red-200 rounded text-red-700">
          <AlertCircle className="w-5 h-5" />
          {searchError}
        </div>
      )}
    </div>
  );
};

export default SearchBar;
