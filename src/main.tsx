import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import { BrowserRouter } from "react-router-dom";
import { HelmetProvider } from "react-helmet-async";
import { QueryClientProvider, QueryClient } from "@tanstack/react-query";

import "bootstrap/dist/css/bootstrap.min.css";

const queryClient = new QueryClient();

ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
  <React.StrictMode>
    <BrowserRouter>
      <HelmetProvider>
        <style>{"body { background-color: #282c34; color: whitesmoke}"}</style>
      </HelmetProvider>
      <QueryClientProvider client={queryClient}>
        <App />
      </QueryClientProvider>
    </BrowserRouter>
  </React.StrictMode>
);

/*
 * MODIFICAR ELEMENTOS PADRES EN BOOTSTRAP. VER:
 * https://stackoverflow.com/questions/42464888/how-do-i-change-the-background-color-of-the-body
 */
