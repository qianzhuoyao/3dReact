import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.tsx";
import { BrowserRouter, Route, Routes } from "react-router";
import { ModelDetail } from "./details/ModelDetail.tsx";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<App />}></Route>
        <Route path="ModelDetail/:id" element={<ModelDetail />} />
        <Route path="*" element={<>not found</>}></Route>
      </Routes>
    </BrowserRouter>
  </StrictMode>
);
