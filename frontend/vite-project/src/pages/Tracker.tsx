import React from "react";
import SearchBar from "../components/SearchBar";
import FlightCard from "../components/FlightCard";
import HistorySection from "../components/HistorySection";
import { TrackerProvider } from "../components/TrackerContext";

const Tracker: React.FC = () => {
  return (
    <TrackerProvider>
      <section className="space-y-8">
        <SearchBar />
        <FlightCard />
        <HistorySection />
      </section>
    </TrackerProvider>
  );
};

export default Tracker;
