import { useState } from "react";
import api from "../services/api";
import { formatDateTime } from "../utils/dateUtils";
import { Users, Car, Calendar, Navigation, Plus, Minus } from "lucide-react";
import { useNavigate } from "react-router-dom";

function RideCard({ ride, distance }) {
  const [seats, setSeats] = useState(1);
  const [isBooking, setIsBooking] = useState(false);

  const navigate = useNavigate();

  const bookRide = async () => {
    const token = localStorage.getItem("token");
    const role = localStorage.getItem("role");

    // 1. Check if logged in
    if (!token) {
      alert("Please login to book a ride.");
      navigate("/login");
      return;
    }
    
    // 2. Check if they are a passenger
    if (role !== "USER") {
      alert("Only passengers can book rides.");
      return;
    }

    // 3. Proceed with booking
    setIsBooking(true);
    try {
      await api.post("/bookings/create", { rideId: ride.id, seatsBooked: seats });
      alert("Ride booked successfully 🚗");
    } catch (error) {
      console.log(error);
      alert("Booking failed");
    } finally {
      setIsBooking(false);
    }
  };

  return (
    <div className="bg-white rounded-2xl shadow-sm hover:shadow-md transition-all duration-200 p-5 border border-[#E8E1D5] flex flex-col h-full">
      
      {/* Route & Status (Horizontal) */}
      <div className="flex justify-between items-start mb-4">
        <h2 className="text-lg font-bold text-[#162740] leading-tight">
          {ride.fromLocation} <span className="text-gray-300 mx-1">→</span> {ride.toLocation}
        </h2>
        <span className="bg-[#E6F4EA] text-[#137333] px-2.5 py-1 rounded-md text-[10px] font-bold uppercase tracking-wide border border-[#CEEAD6] shrink-0 ml-2">
          Available
        </span>
      </div>

      {/* High-Density Details Row */}
      <div className="flex flex-wrap items-center gap-x-4 gap-y-2 text-xs text-gray-600 mb-4">
        <div className="flex items-center gap-1.5"><Calendar size={14} className="text-[#9A7D46]" /> {formatDateTime(ride.departureTime)}</div>
        <div className="flex items-center gap-1.5"><Car size={14} className="text-[#9A7D46]" /> {ride.carModel}</div>
        <div className="flex items-center gap-1.5"><Users size={14} className="text-[#9A7D46]" /> {ride.availableSeats ?? ride.totalSeats} Left</div>
      </div>

      {/* Distance Badge (If available) */}
      {distance && (
        <div className="bg-[#F6F3EC] text-[#162740] text-xs font-semibold px-3 py-1.5 rounded-lg inline-flex items-center gap-1.5 mb-4 w-fit">
          <Navigation size={12} className="text-[#9A7D46]" /> {distance} km away
        </div>
      )}

      <div className="flex-grow"></div>

      {/* Compact Footer: Price & Booking */}
      <div className="pt-4 border-t border-gray-100 flex items-center justify-between">
        <div>
          <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-0.5">Host: {ride.host}</p>
          <p className="text-xl font-bold text-[#162740]">₹{ride.price}</p>
        </div>

        <div className="flex items-center gap-2">
          <div className="flex items-center bg-gray-50 border border-gray-200 rounded-lg overflow-hidden">
            <button onClick={() => seats > 1 && setSeats(seats - 1)} className="p-1.5 hover:bg-gray-200 text-gray-600"><Minus size={14} /></button>
            <span className="w-6 text-center text-sm font-bold text-[#162740]">{seats}</span>
            <button onClick={() => seats < ride.availableSeats && setSeats(seats + 1)} className="p-1.5 hover:bg-gray-200 text-gray-600"><Plus size={14} /></button>
          </div>
          <button onClick={bookRide} disabled={isBooking} className="bg-[#162740] hover:bg-[#111F33] disabled:bg-gray-400 text-white px-4 py-2 rounded-lg text-sm font-semibold transition-all shadow-sm">
            {isBooking ? "..." : "Book"}
          </button>
        </div>
      </div>
    </div>
  );
}

export default RideCard;