/* eslint-disable react-refresh/only-export-components */
import React, { createContext, useContext, useState } from "react";
import type { FlightState, HistoryFlight } from "../types";

interface TrackerContextProps {
  /* ----- Live flight ----- */
  selectedFlight: FlightState | null;
  setSelectedFlight: React.Dispatch<React.SetStateAction<FlightState | null>>;

  /* ----- Historical flight ----- */
  selectedHistoricalFlight: HistoryFlight | null;
  setSelectedHistoricalFlight: React.Dispatch<React.SetStateAction<HistoryFlight | null>>;

  /* ----- History handling ----- */
  historyData: HistoryFlight[];
  setHistoryData: React.Dispatch<React.SetStateAction<HistoryFlight[]>>;
  historyLoading: boolean;
  setHistoryLoading: React.Dispatch<React.SetStateAction<boolean>>;
  historyError: string;
  setHistoryError: React.Dispatch<React.SetStateAction<string>>;
}

const TrackerContext = createContext<TrackerContextProps | undefined>(undefined);

export const useTracker = (): TrackerContextProps => {
  const ctx = useContext(TrackerContext);
  if (!ctx) {
    throw new Error("useTracker must be used within a TrackerProvider");
  }
  return ctx;
};

export const TrackerProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [selectedFlight, setSelectedFlight] = useState<FlightState | null>(null);
  const [selectedHistoricalFlight, setSelectedHistoricalFlight] = useState<HistoryFlight | null>(null);
  const [historyData, setHistoryData] = useState<HistoryFlight[]>([]);
  const [historyLoading, setHistoryLoading] = useState(false);
  const [historyError, setHistoryError] = useState("");

  const value: TrackerContextProps = {
    selectedFlight,
    setSelectedFlight,
    selectedHistoricalFlight,
    setSelectedHistoricalFlight,
    historyData,
    setHistoryData,
    historyLoading,
    setHistoryLoading,
    historyError,
    setHistoryError,
  };

  return <TrackerContext.Provider value={value}>{children}</TrackerContext.Provider>;
};