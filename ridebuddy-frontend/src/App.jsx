import React, { useState, useEffect } from "react";
import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";
import api from "./services/api";

import ServerWarmingGame from "./components/ServerWarmingGame";
import Navbar from "./components/Navbar";
import LoginPage from "./pages/LoginPage";
import SignupPage from "./pages/SignupPage";
import RideListPage from "./pages/RideListPage";
import CreateRidePage from "./pages/CreateRidePage";
import MyBookingsPage from "./pages/MyBookingsPage";
import MyRidesPage from "./pages/MyRidesPage";

// --- 1. LAYOUT COMPONENT (Handles Navbar & Routing) ---
function Layout() {
  const location = useLocation();

  return (
    <>
      {/* Show Navbar everywhere EXCEPT login and signup pages */}
      {location.pathname !== "/login" && location.pathname !== "/signup" && (
        <Navbar />
      )}

      <Routes>
        {/* Make RideListPage the main landing page */}
        <Route path="/" element={<RideListPage />} />
        <Route path="/rides" element={<RideListPage />} />

        {/* Dedicated routes for authentication */}
        <Route path="/login" element={<LoginPage />} />
        <Route path="/signup" element={<SignupPage />} />

        <Route path="/create-ride" element={<CreateRidePage />} />
        <Route path="/my-bookings" element={<MyBookingsPage />} />
        <Route path="/my-rides" element={<MyRidesPage />} />
      </Routes>
    </>
  );
}

// --- 2. MAIN APP COMPONENT (Handles Health Check & Fallback UI) ---
function App() {
  const [isServerReady, setIsServerReady] = useState(false);
  const [isSlowStart, setIsSlowStart] = useState(false);

  useEffect(() => {
    // If backend doesn't respond in 1.5 seconds, show the game
    const timer = setTimeout(() => setIsSlowStart(true), 1500);

    const checkServerHealth = async () => {
      try {
        // Hit any public endpoint to wake up the server
        await api.get('/rides/all');
        setIsServerReady(true);
        setIsSlowStart(false);
        clearTimeout(timer);
      } catch (error) {
        // If it fails (server is sleeping), try again in 4 seconds
        setTimeout(checkServerHealth, 4000);
      }
    };

    checkServerHealth();

    return () => clearTimeout(timer);
  }, []);

  // Show the game ONLY if the server is slow and hasn't responded yet
  if (isSlowStart && !isServerReady) {
    return <ServerWarmingGame />;
  }

  // Once server is ready (or if it was fast enough), render the normal app
  return (
    <BrowserRouter>
      <Layout />
    </BrowserRouter>
  );
}

export default App;
