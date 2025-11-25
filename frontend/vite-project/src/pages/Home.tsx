import React from "react";
import { Link } from "react-router-dom";
import { Plane, Search, Clock, Globe, Zap } from "lucide-react";

const Home: React.FC = () => {
  return (
    <div className="max-w-6xl mx-auto space-y-16">
      {/* Hero Section */}
      <section className="text-center py-12">
        <div className="inline-flex items-center justify-center w-24 h-24 bg-linear-to-br from-blue-500 to-indigo-600 rounded-3xl shadow-2xl mb-8 animate-bounce">
          <Plane className="w-12 h-12 text-white" />
        </div>

        <h1 className="text-5xl md:text-6xl font-bold text-white mb-6 tracking-tight">
          Global Flight Tracker
        </h1>

        <p className="text-xl text-blue-100 mb-4 max-w-2xl mx-auto leading-relaxed">
          Track flights in real-time and explore historical flight data from
          around the world
        </p>

        <p className="text-md text-blue-200 mb-10 max-w-xl mx-auto">
          Powered by AviationStack API for accurate, up-to-date flight
          information
        </p>

        <Link
          to="/track"
          className="inline-flex items-center gap-3 bg-white text-indigo-600 font-bold px-8 py-4 rounded-xl hover:bg-blue-50 transition-all shadow-2xl hover:shadow-xl hover:scale-105 transform"
        >
          <Search className="w-6 h-6" />
          Start Tracking Flights
        </Link>
      </section>

      {/* Features Section */}
      <section className="grid md:grid-cols-3 gap-8 px-4">
        <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-8 border border-white/20 hover:bg-white/15 transition-all">
          <div className="bg-linear-to-br from-blue-500 to-blue-600 w-14 h-14 rounded-xl flex items-center justify-center mb-4">
            <Search className="w-7 h-7 text-white" />
          </div>
          <h3 className="text-xl font-bold text-white mb-3">
            Live & Historical Search
          </h3>
          <p className="text-blue-100 leading-relaxed">
            Search both active and past flights by callsign, ICAO24, or flight
            number with date selection
          </p>
        </div>

        <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-8 border border-white/20 hover:bg-white/15 transition-all">
          <div className="bg-linear-to-br from-green-500 to-green-600 w-14 h-14 rounded-xl flex items-center justify-center mb-4">
            <Zap className="w-7 h-7 text-white" />
          </div>
          <h3 className="text-xl font-bold text-white mb-3">
            Real-Time Telemetry
          </h3>
          <p className="text-blue-100 leading-relaxed">
            View live flight data including altitude, speed, heading, vertical
            rate, and GPS coordinates for active flights
          </p>
        </div>

        <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-8 border border-white/20 hover:bg-white/15 transition-all">
          <div className="bg-linear-to-br from-purple-500 to-purple-600 w-14 h-14 rounded-xl flex items-center justify-center mb-4">
            <Clock className="w-7 h-7 text-white" />
          </div>
          <h3 className="text-xl font-bold text-white mb-3">Historical Data</h3>
          <p className="text-blue-100 leading-relaxed">
            Access past flights with route information, airline details, and
            explore up to 14 days of flight history
          </p>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="bg-white/10 backdrop-blur-lg rounded-3xl p-10 border border-white/20">
        <div className="flex items-center gap-3 mb-8">
          <Globe className="w-8 h-8 text-blue-300" />
          <h2 className="text-3xl font-bold text-white">How It Works</h2>
        </div>

        <div className="grid md:grid-cols-3 gap-6">
          <div className="text-center">
            <div className="bg-linear-to-br from-blue-500 to-indigo-600 w-12 h-12 rounded-full flex items-center justify-center text-white font-bold text-xl mx-auto mb-4">
              1
            </div>
            <h4 className="font-semibold text-white mb-2">Search</h4>
            <p className="text-sm text-blue-100">
              Enter a flight callsign or aircraft ICAO24 code
            </p>
          </div>

          <div className="text-center">
            <div className="bg-linear-to-br from-blue-500 to-indigo-600 w-12 h-12 rounded-full flex items-center justify-center text-white font-bold text-xl mx-auto mb-4">
              2
            </div>
            <h4 className="font-semibold text-white mb-2">View Live Data</h4>
            <p className="text-sm text-blue-100">
              See real-time telemetry and flight information
            </p>
          </div>

          <div className="text-center">
            <div className="bg-linear-to-br from-blue-500 to-indigo-600 w-12 h-12 rounded-full flex items-center justify-center text-white font-bold text-xl mx-auto mb-4">
              3
            </div>
            <h4 className="font-semibold text-white mb-2">Explore History</h4>
            <p className="text-sm text-blue-100">
              Load historical data for the past 14 days
            </p>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="text-center pb-16">
        <p className="text-lg text-blue-100 mb-6">
          Ready to track flights around the globe?
        </p>
        <Link
          to="/track"
          className="inline-flex items-center gap-2 bg-linear-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white font-bold px-8 py-4 rounded-xl transition-all shadow-2xl hover:shadow-xl hover:scale-105 transform"
        >
          <Plane className="w-5 h-5" />
          Launch Flight Tracker
        </Link>
      </section>
    </div>
  );
};

export default Home;
