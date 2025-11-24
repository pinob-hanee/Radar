// src/server.ts
import express, { Request, Response } from "express";
import cors from "cors";
import dotenv from "dotenv";

/* -------------------------------------------------
   NOTE: add .js extension so ts-node/esm can resolve it
   ------------------------------------------------- */
import flightsRouter from "./routes/flights.js";

dotenv.config();

const app = express();
const PORT = Number(process.env.PORT) || 3000;

app.use(cors());
app.use(express.json());

app.use("/api", flightsRouter);

// 404 for unknown API routes (must be after router)
app.use("/api/*", (_req: Request, res: Response) => {
  res.status(404).json({ error: "Endpoint not found" });
});

app.listen(PORT, () => {
  console.log(`🛫 Flight Tracker Backend listening on http://localhost:${PORT}`);
  console.log(`📡 Using AviationStack (${process.env.AVIATIONSTACK_API})`);
});
