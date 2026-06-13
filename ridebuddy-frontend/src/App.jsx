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
      {location.pathname !== "/" &&
       location.pathname !== "/signup" && (
        <Navbar />
      )}

      <Routes>
        <Route path="/" element={<LoginPage />} />
        <Route path="/signup" element={<SignupPage />} />
        <Route path="/rides" element={<RideListPage />} />
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
