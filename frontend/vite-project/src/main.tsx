// src/index.tsx
import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";   // <‑‑ import the router
import App from "./App";
import "./index.css";   // Tailwind (or your own CSS)

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    {/* The router is now the outermost wrapper */}
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </React.StrictMode>
);
