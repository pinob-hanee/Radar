export interface FlightState {
  icao24: string;
  callsign: string | null;
  origin_country: string;
  time_position: number | null;
  last_contact: number | null;
  longitude: number | null;
  latitude: number | null;
  baro_altitude: number | null;
  on_ground: boolean;
  velocity: number | null;
  true_track: number | null;
  vertical_rate: number | null;
  sensors: number[] | null;
  geo_altitude: number | null;
  squawk: string | null;
  spi: boolean;
  position_source: number | null;
}

export interface FlightStats {
  total: number;
  countries: number;
  inAir: number;
  onGround: number;
}

export interface AllFlightsResponse {
  flights: FlightState[];
  stats: FlightStats;
  timestamp: number;
  source: string;
  warning?: string;
}

/* AviationStack raw types */
export interface AviationStackLive {
  latitude: number;
  longitude: number;
  altitude: number;      // feet
  direction: number;     // heading°
  speed_horizontal: number; // knots
  speed_vertical: number;   // ft/min
  is_ground: boolean;
  updated: string;       // ISO‑8601 UTC
}

export interface AviationStackFlight {
  flight_date: string;
  flight_status: string;
  airline: { name: string; iata: string; icao: string };
  flight: { number: string; iata: string; icao: string };
  aircraft: { registration?: string; iata?: string; icao?: string; icao24?: string };
  departure?: { airport?: string; iata?: string; icao?: string; scheduled?: string };
  arrival?: { airport?: string; iata?: string; icao?: string; scheduled?: string };
  live?: AviationStackLive;
}

/* Historic entry exposed to the UI */
export interface HistoryFlight {
  icao24: string;
  flight_date: string;
  callsign: string | null;
  airline?: { name: string; iata: string; icao: string };
  flight?: { number: string; iata: string; icao: string };
  departure?: { airport: string | null };
  arrival?: { airport: string | null };
}

/* Simple cache for /all (kept for compatibility) */
export interface FlightCache {
  data: AllFlightsResponse | null;
  timestamp: number | null;
  expiresIn: number;
}
