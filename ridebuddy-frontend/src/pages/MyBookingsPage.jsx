import { useEffect, useState } from "react";
import { Navigate } from "react-router-dom";
import api from "../services/api";
import { Route, Clock, User, Car, Users, Navigation, ChevronDown, ChevronUp, IndianRupee } from "lucide-react";

function MyBookingsPage() {
  const role = localStorage.getItem("role");

  if (role !== "USER") {
    return <Navigate to="/rides" />;
  }

  const [bookings, setBookings] = useState([]);
  const [expandedBookingId, setExpandedBookingId] = useState(null); // New state for accordion

  useEffect(() => {
    fetchBookings();
  }, []);

  const fetchBookings = async () => {
    try {
      const response = await api.get("/bookings/my-bookings");
      setBookings(response.data);
    } catch (error) {
      console.log(error);
    }
  };

  const cancelBooking = async (bookingId, e) => {
    e.stopPropagation(); // Prevents the card from collapsing when clicking cancel
    try {
      await api.put(`/bookings/${bookingId}/cancel`);
      alert("Booking cancelled successfully");
      fetchBookings();
    } catch (error) {
      console.log(error);
      alert("Failed to cancel booking");
    }
  };

  const toggleExpand = (id) => {
    setExpandedBookingId(expandedBookingId === id ? null : id);
  };

  const formatDistance = (dist) => {
    const parsed = parseFloat(dist);
    return isNaN(parsed) ? dist : parsed.toFixed(1);
  };

  return (
    <div className="min-h-screen bg-[#F6F3EC] py-10 px-4">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl md:text-4xl font-bold text-[#162740] mb-8 tracking-tight">
          My Bookings
        </h1>

        <div className="space-y-4">
          {bookings.map((booking) => {
            const isExpanded = expandedBookingId === booking.bookingId;

            return (
              <div
                key={booking.bookingId}
                className={`bg-white rounded-2xl shadow-sm border transition-all duration-300 overflow-hidden ${
                  isExpanded ? "border-[#9A7D46] shadow-md" : "border-[#E8E1D5] hover:border-gray-300 hover:shadow-md"
                }`}
              >
                {/* --- COMPACT SUMMARY (Always Visible) --- */}
                <div 
                  onClick={() => toggleExpand(booking.bookingId)}
                  className="p-5 flex justify-between items-center cursor-pointer group hover:bg-gray-50/50 transition-colors"
                >
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-1.5">
                      <h2 className="text-xl font-bold text-[#162740]">
                        {booking.fromLocation} <span className="text-gray-300 font-normal mx-1">→</span> {booking.toLocation}
                      </h2>
                      <span className={`px-2.5 py-0.5 rounded-md text-[10px] font-bold uppercase tracking-wide border shrink-0 hidden sm:inline-block ${
                          booking.status === "BOOKED" ? "bg-[#E6F4EA] text-[#137333] border-[#CEEAD6]" : "bg-red-50 text-red-700 border-red-100"
                        }`}
                      >
                        {booking.status}
                      </span>
                    </div>
                    <div className="text-sm font-medium text-gray-500 flex items-center gap-2">
                      <Clock size={16} className="text-[#9A7D46]" />
                      {booking.departureTime.replace("T", " ")}
                    </div>
                  </div>

                  <div className="flex items-center gap-6">
                    <div className="text-right">
                      <p className="text-xl font-bold text-[#162740]">₹{booking.price}</p>
                    </div>
                    <div className={`p-2 rounded-full transition-colors ${isExpanded ? "bg-[#F4ECDD] text-[#9A7D46]" : "text-gray-400 group-hover:bg-gray-100 group-hover:text-gray-600"}`}>
                      {isExpanded ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
                    </div>
                  </div>
                </div>

                {/* --- DETAILED EXPANDED VIEW (Revealed on Click) --- */}
                {isExpanded && (
                  <div className="border-t border-gray-100 bg-[#FCFBF8] p-5 animate-in slide-in-from-top-2 fade-in duration-200">
                    
                    {/* Mobile Status Badge (Visible only on small screens) */}
                    <div className="mb-4 sm:hidden">
                       <span className={`px-2.5 py-1 rounded-md text-xs font-bold uppercase tracking-wide border ${
                          booking.status === "BOOKED" ? "bg-[#E6F4EA] text-[#137333] border-[#CEEAD6]" : "bg-red-50 text-red-700 border-red-100"
                        }`}
                      >
                        Status: {booking.status}
                      </span>
                    </div>

                    <div className="grid grid-cols-2 md:grid-cols-4 gap-y-5 gap-x-4 mb-6">
                      <div>
                        <p className="text-[11px] font-bold text-gray-400 uppercase tracking-wider mb-1 flex items-center gap-1"><User size={14}/> Driver</p>
                        <p className="font-semibold text-[#162740]">{booking.driverName}</p>
                      </div>
                      
                      <div>
                        <p className="text-[11px] font-bold text-gray-400 uppercase tracking-wider mb-1 flex items-center gap-1"><Car size={14}/> Car</p>
                        <p className="font-semibold text-[#162740]">{booking.carModel}</p>
                      </div>
                      
                      <div>
                        <p className="text-[11px] font-bold text-gray-400 uppercase tracking-wider mb-1 flex items-center gap-1"><Users size={14}/> Seats Booked</p>
                        <p className="font-semibold text-[#162740]">{booking.seatsBooked}</p>
                      </div>
                      
                      <div>
                        <p className="text-[11px] font-bold text-gray-400 uppercase tracking-wider mb-1 flex items-center gap-1"><Navigation size={14}/> Distance & ETA</p>
                        <p className="font-semibold text-[#162740]">
                          {formatDistance(booking.distanceKm)} km <span className="text-gray-300 mx-1">•</span> {booking.estimatedDurationMinutes}m
                        </p>
                      </div>
                    </div>

                    {booking.status === "BOOKED" && (
                      <div className="flex justify-end border-t border-gray-200 pt-4">
                        <button
                          onClick={(e) => cancelBooking(booking.bookingId, e)}
                          className="bg-white text-red-600 hover:bg-red-50 border border-red-200 hover:border-red-600 px-6 py-2.5 rounded-xl text-sm font-semibold transition-colors shadow-sm"
                        >
                          Cancel Booking
                        </button>
                      </div>
                    )}

                  </div>
                )}
              </div>
            );
          })}

          {bookings.length === 0 && (
            <div className="bg-white rounded-2xl p-10 text-center border border-[#E8E1D5]">
              <p className="text-gray-500 font-medium text-lg">You have no bookings yet.</p>
            </div>
          )}
        </div>

      </div>
    </div>
  );
}

export default MyBookingsPage;