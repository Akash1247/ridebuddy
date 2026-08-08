import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";

import Navbar from "./components/Navbar";
import LoginPage from "./pages/LoginPage";
import SignupPage from "./pages/SignupPage";
import RideListPage from "./pages/RideListPage";
import CreateRidePage from "./pages/CreateRidePage";
import MyBookingsPage from "./pages/MyBookingsPage";
import MyRidesPage from "./pages/MyRidesPage";

function Layout() {
  const location = useLocation();

  return (
    <>
      {/* Show Navbar everywhere EXCEPT login and signup pages */}
      {location.pathname !== "/login" &&
       location.pathname !== "/signup" && (
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

function App() {
  return (
    <BrowserRouter>
      <Layout />
    </BrowserRouter>
  );
}

export default App;