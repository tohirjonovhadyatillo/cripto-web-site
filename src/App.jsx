import { Routes, Route } from "react-router-dom";
import HomePage from "./pages/HomePage";
import CoinDetails from "./pages/CoinDetails";
import React from "react";

export default function App() {
    return (
        <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/coin/:id" element={<CoinDetails />} />
        </Routes>
    );
}
