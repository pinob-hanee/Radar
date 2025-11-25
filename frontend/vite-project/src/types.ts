// src/types.ts

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

export interface HistoryFlight {
  icao24: string;
  flight_date: string;
  callsign: string | null;
  airline?: {
    name: string;
    iata: string;
    icao: string;
  };
  flight?: {
    number: string;
    iata: string;
    icao: string;
  };
  departure?: {
    airport: string | null;
  };
  arrival?: {
    airport: string | null;
  };
}

export interface AllFlightsResponse {
  flights: FlightState[];
  stats: {
    total: number;
    countries: number;
    inAir: number;
    onGround: number;
  };
  timestamp: number;
  source: string;
  warning?: string;
}