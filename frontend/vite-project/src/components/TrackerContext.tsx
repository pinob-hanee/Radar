/* eslint-disable react-refresh/only-export-components */
// src/components/TrackerContext.tsx
import React, { createContext, useContext, useState } from "react";
/* -------------------------------------------------
   👉 IMPORTANT: use a *relative* import!
   ------------------------------------------------- */
import type { FlightState, HistoryFlight } from "../types";

/* -------------------------------------------------
   Context shape
   ------------------------------------------------- */
interface TrackerContextProps {
  /* ----- selected flight ----- */
  selectedFlight: FlightState | null;
  setSelectedFlight: React.Dispatch<
    React.SetStateAction<FlightState | null>
  >;

  /* ----- history handling ----- */
  historyData: HistoryFlight[];
  setHistoryData: React.Dispatch<React.SetStateAction<HistoryFlight[]>>;
  historyLoading: boolean;
  setHistoryLoading: React.Dispatch<React.SetStateAction<boolean>>;
  historyError: string;
  setHistoryError: React.Dispatch<React.SetStateAction<string>>;
}

/* -------------------------------------------------
   Create context (undefined at start so we can
   detect misuse)
   ------------------------------------------------- */
const TrackerContext = createContext<TrackerContextProps | undefined>(
  undefined
);

/* -------------------------------------------------
   Hook for consuming the context
   ------------------------------------------------- */
export const useTracker = (): TrackerContextProps => {
  const ctx = useContext(TrackerContext);
  if (!ctx) {
    throw new Error(
      "useTracker must be used within a TrackerProvider"
    );
  }
  return ctx;
};

/* -------------------------------------------------
   Provider – holds all state for the tracker page
   ------------------------------------------------- */
export const TrackerProvider: React.FC<{
  children: React.ReactNode;
}> = ({ children }) => {
  const [selectedFlight, setSelectedFlight] = useState<FlightState | null>(null);
  const [historyData, setHistoryData] = useState<HistoryFlight[]>([]);
  const [historyLoading, setHistoryLoading] = useState(false);
  const [historyError, setHistoryError] = useState("");

  const value: TrackerContextProps = {
    selectedFlight,
    setSelectedFlight,
    historyData,
    setHistoryData,
    historyLoading,
    setHistoryLoading,
    historyError,
    setHistoryError,
  };

  return (
    <TrackerContext.Provider value={value}>
      {children}
    </TrackerContext.Provider>
  );
};
