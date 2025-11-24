import dotenv from "dotenv";
dotenv.config();

export const PORT = Number(process.env.PORT) || 3000;

export const AVIATIONSTACK_API =
  (process.env.AVIATIONSTACK_API?.replace(/\/$/, "")) ||
  "https://api.aviationstack.com/v1";

export const AVIATIONSTACK_KEY = process.env.AVIATIONSTACK_KEY ?? "";

export const REQUEST_TIMEOUT = 8_000;   // ms – live requests
export const HISTORY_TIMEOUT = 12_000; // ms – history requests
