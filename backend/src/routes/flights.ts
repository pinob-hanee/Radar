// src/routes/flights.ts
import { Router, Request, Response } from "express";
import axios from "axios";
import dayjs from "dayjs";

/* -------------------------------------------------
   IMPORTANT – add the .js extension for each Dayjs plugin
   ------------------------------------------------- */
import utc from "dayjs/plugin/utc.js";                     // <-- .js
import isSameOrBefore from "dayjs/plugin/isSameOrBefore.js"; // <-- .js

dayjs.extend(utc);
dayjs.extend(isSameOrBefore);

/* -------------------------------------------------
   Types & config
   ------------------------------------------------- */
import {
  FlightState,
  FlightStats,
  AllFlightsResponse,
  HistoryFlight,
  FlightCache,
  AviationStackFlight,
  AviationStackLive,
} from "../types.js";

import {
  AVIATIONSTACK_API,
  AVIATIONSTACK_KEY,
  REQUEST_TIMEOUT,
  HISTORY_TIMEOUT,
} from "../config.js";

const router = Router();

/* -------------------------------------------------
   In‑memory cache for /all (optional)
   ------------------------------------------------- */
const flightCache: FlightCache = {
  data: null,
  timestamp: null,
  expiresIn: 10_000, // 10 seconds
};

/* -------------------------------------------------
   Helper – map AviationStack raw → FlightState
   ------------------------------------------------- */
function mapAviationStackFlight(raw: AviationStackFlight): FlightState {
  const live: AviationStackLive = raw.live ?? ({} as AviationStackLive);
  const ftToM = (ft: number) => ft * 0.3048;
  const ktToMs = (kt: number) => kt * 0.514444;
  const fpmToMs = (fpm: number) => fpm * 0.00508;

  return {
    icao24: raw.aircraft?.icao24?.toLowerCase() ?? "",
    callsign: raw.flight?.iata?.trim() ?? null,
    origin_country: raw.airline?.name ?? "",
    time_position: null,
    last_contact: live.updated
      ? Math.floor(new Date(live.updated).getTime() / 1000)
      : null,
    longitude: live.longitude ?? null,
    latitude: live.latitude ?? null,
    baro_altitude: live.altitude ? ftToM(live.altitude) : null,
    on_ground: live.is_ground ?? false,
    velocity: live.speed_horizontal ? ktToMs(live.speed_horizontal) : null,
    true_track: live.direction ?? null,
    vertical_rate: live.speed_vertical ? fpmToMs(live.speed_vertical) : null,
    sensors: null,
    geo_altitude: live.altitude ? ftToM(live.altitude) : null,
    squawk: null,
    spi: false,
    position_source: null,
  };
}

/* -------------------------------------------------
   GET /api/flights/all  (kept for compat)
   ------------------------------------------------- */
router.get("/all", async (_req: Request, res: Response) => {
  try {
    if (
      flightCache.data &&
      flightCache.timestamp &&
      Date.now() - flightCache.timestamp < flightCache.expiresIn
    ) {
      return res.json(flightCache.data);
    }

    const resp = await axios.get<{ data: AviationStackFlight[] }>(
      `${AVIATIONSTACK_API}/flights`,
      {
        params: { access_key: AVIATIONSTACK_KEY, limit: 100 },
        timeout: REQUEST_TIMEOUT,
      }
    );

    const raw = resp.data?.data ?? [];
    const liveRaw = raw.filter((f) => !!f.live);
    const flights = liveRaw.map(mapAviationStackFlight);

    const stats: FlightStats = {
      total: flights.length,
      countries: new Set(flights.map((f) => f.origin_country)).size,
      inAir: flights.filter((f) => !f.on_ground).length,
      onGround: flights.filter((f) => f.on_ground).length,
    };

    const payload: AllFlightsResponse = {
      flights,
      stats,
      timestamp: Math.floor(Date.now() / 1000),
      source: "AviationStack",
    };

    flightCache.data = payload;
    flightCache.timestamp = Date.now();

    res.json(payload);
  } catch (err: any) {
    console.error("Error in /flights/all:", err.message);
    if (flightCache.data) {
      return res.json({
        ...flightCache.data,
        warning: "Serving cached data – error: " + err.message,
      });
    }
    res.status(500).json({ error: "Failed to fetch flights", message: err.message });
  }
});

/* -------------------------------------------------
   GET /api/flight/search?query=…
   ------------------------------------------------- */
router.get("/flight/search", async (req: Request, res: Response) => {
  const { query } = req.query;
  if (!query || typeof query !== "string") {
    return res.status(400).json({ error: "Query parameter required" });
  }

  const term = query.toUpperCase().trim();

  // 1️⃣ Try cache first
  if (flightCache.data) {
    const cached = flightCache.data.flights.find(
      (f) =>
        f.callsign?.toUpperCase().includes(term) ||
        f.icao24.toUpperCase() === term
    );
    if (cached) return res.json({ flight: cached, source: "cache" });
  }

  // 2️⃣ Query AviationStack
  try {
    const resp = await axios.get<{ data: AviationStackFlight[] }>(
      `${AVIATIONSTACK_API}/flights`,
      {
        params: { access_key: AVIATIONSTACK_KEY, limit: 100 },
        timeout: REQUEST_TIMEOUT,
      }
    );

    const raw = resp.data?.data ?? [];

    const found = raw.find(
      (f) =>
        (f.flight?.iata && f.flight.iata.toUpperCase().includes(term)) ||
        (f.flight?.icao && f.flight.icao.toUpperCase() === term) ||
        (f.aircraft?.icao24 && f.aircraft.icao24.toUpperCase() === term)
    );

    if (!found) return res.status(404).json({ error: "Flight not found" });

    const flight = mapAviationStackFlight(found);
    return res.json({ flight, source: "aviationstack" });
  } catch (err: any) {
    console.error("Error in /flight/search:", err.message);
    res.status(500).json({ error: "Failed to search flight", message: err.message });
  }
});

/* -------------------------------------------------
   GET /api/flight/history/:icao24
   ------------------------------------------------- */
router.get(
  "/flight/history/:icao24",
  async (req: Request, res: Response) => {
    const { icao24 } = req.params;
    const { date } = req.query; // optional single day

    // Build date list (single day or last 14 days)
    const startDate = date
      ? dayjs.utc(date as string).format("YYYY-MM-DD")
      : dayjs.utc().subtract(13, "day").format("YYYY-MM-DD");
    const endDate = dayjs.utc().format("YYYY-MM-DD");

    const start = dayjs.utc(startDate);
    const end = dayjs.utc(endDate);
    const dates: string[] = [];

    for (let d = start.clone(); d.isSameOrBefore(end); d = d.add(1, "day")) {
      dates.push(d.format("YYYY-MM-DD"));
    }

    const all: HistoryFlight[] = [];

    try {
      for (const d of dates) {
        const resp = await axios.get<{ data: AviationStackFlight[] }>(
          `${AVIATIONSTACK_API}/flights`,
          {
            params: {
              access_key: AVIATIONSTACK_KEY,
              icao24: icao24.toLowerCase(),
              flight_date: d,
              limit: 100,
            },
            timeout: HISTORY_TIMEOUT,
          }
        );

        const raw: AviationStackFlight[] = resp.data?.data ?? [];

        const converted: HistoryFlight[] = raw.map((r) => ({
          icao24: r.aircraft?.icao24?.toLowerCase() ?? "",
          flight_date: r.flight_date,
          callsign: r.flight?.iata?.trim() ?? null,
          airline: r.airline,
          flight: r.flight,
          departure: r.departure
            ? { airport: r.departure.airport ?? null }
            : undefined,
          arrival: r.arrival
            ? { airport: r.arrival.airport ?? null }
            : undefined,
        }));

        all.push(...converted);
      }

      if (all.length === 0) {
        return res
          .status(404)
          .json({ error: "No historic data for the requested period" });
      }

      res.json({ flights: all, count: all.length });
    } catch (err: any) {
      console.error(`❌ History error for ${icao24}:`, err.message);
      if (err.response?.status === 429) {
        return res.status(429).json({ error: "Rate limit exceeded – try later" });
      }
      if (err.response?.status === 401) {
        return res.status(401).json({ error: "Invalid AviationStack API key" });
      }
      res.status(500).json({ error: "Failed to fetch history", message: err.message });
    }
  }
);

/* -------------------------------------------------
   GET /api/health
   ------------------------------------------------- */
router.get("/health", async (_req: Request, res: Response) => {
  try {
    const resp = await axios.get<{ data: AviationStackFlight[] }>(
      `${AVIATIONSTACK_API}/flights`,
      {
        params: { access_key: AVIATIONSTACK_KEY, limit: 1 },
        timeout: 5_000,
      }
    );

    res.json({
      status: "OK",
      message: "Flight Tracker API is running",
      aviationstack_status:
        resp.status === 200 ? "Connected" : "Error",
      flights_available: resp.data?.data?.length ?? 0,
      cache_status: flightCache.data ? "Active" : "Empty",
    });
  } catch (err: any) {
    res.status(500).json({
      status: "ERROR",
      message: "AviationStack connection failed",
      error: err.message,
    });
  }
});

/* -------------------------------------------------
   GET /api/examples – optional
   ------------------------------------------------- */
router.get("/examples", (_req: Request, res: Response) => {
  res.json({
    message: "Example API calls (AviationStack)",
    examples: [
      {
        name: "Search a flight",
        url: "http://localhost:3000/api/flight/search?query=AA100",
      },
      {
        name: "History (last 2 weeks)",
        url: "http://localhost:3000/api/flight/history/3c6444",
      },
    ],
  });
});

export default router;
