import { useEffect, useState } from "react";
import { Navigate } from "react-router-dom";
import api from "../services/api";
import { Users, User, Car, MapPin, Ticket, ChevronDown, ChevronUp } from "lucide-react"; // Added User here

function MyRidesPage() {
  const role = localStorage.getItem("role");

  // Protect route for Drivers only
  if (role !== "DRIVER") {
    return <Navigate to="/rides" />;
  }

  const [rides, setRides] = useState([]);
  const [bookings, setBookings] = useState({});
  const [expandedRide, setExpandedRide] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchMyRides();
  }, []);

  const fetchMyRides = async () => {
    try {
      const response = await api.get("/rides/my-rides");
      setRides(response.data);
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  const fetchRideBookings = async (rideId) => {
    const response = await api.get(`/bookings/ride/${rideId}`);
    setBookings((prev) => ({
      ...prev,
      [rideId]: response.data,
    }));
  };

  const handleViewBookings = async (rideId) => {
    if (!bookings[rideId]) {
      await fetchRideBookings(rideId);
    }
    setExpandedRide(expandedRide === rideId ? null : rideId);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#F6F3EC] flex items-center justify-center p-6 text-[#162740] text-lg font-medium animate-pulse">
        Loading your rides...
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F6F3EC] py-10 px-4">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl font-bold text-[#162740] mb-8 tracking-tight">
          My Published Rides
        </h1>

        {rides.length === 0 ? (
          <div className="bg-white rounded-3xl p-10 text-center border border-[#E8E1D5] shadow-sm">
            <p className="text-gray-500 text-lg">No rides found. Start sharing your journey!</p>
          </div>
        ) : (
          <div className="space-y-6">
            {rides.map((ride) => (
              <div
                key={ride.id}
                className="bg-white rounded-3xl shadow-sm border border-[#E8E1D5] p-6 lg:p-8 transition-all"
              >
                <div className="flex justify-between items-start mb-6">
                  <h2 className="text-2xl font-bold text-[#162740] flex items-center gap-3">
                    {ride.fromLocation} <span className="text-gray-300">→</span> {ride.toLocation}
                  </h2>
                  <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wide border ${
                    ride.status === "ACTIVE" ? "bg-[#E6F4EA] text-[#137333] border-[#CEEAD6]" : "bg-gray-100 text-gray-600 border-gray-200"
                  }`}>
                    {ride.status}
                  </span>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6 bg-gray-50 p-4 rounded-2xl border border-gray-100">
                  <div>
                    <p className="text-xs text-gray-500 font-bold uppercase flex items-center gap-1 mb-1"><User size={14}/> Host</p>
                    <p className="font-semibold text-[#162740]">{ride.host}</p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500 font-bold uppercase flex items-center gap-1 mb-1"><Car size={14}/> Car</p>
                    <p className="font-semibold text-[#162740]">{ride.carModel}</p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500 font-bold uppercase flex items-center gap-1 mb-1"><Users size={14}/> Available Seats</p>
                    <p className="font-semibold text-[#162740]">{ride.availableSeats}</p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500 font-bold uppercase flex items-center gap-1 mb-1"><Ticket size={14}/> Price</p>
                    <p className="font-semibold text-[#162740]">₹{ride.price}</p>
                  </div>
                </div>

                <button
                  onClick={() => handleViewBookings(ride.id)}
                  className="w-full flex items-center justify-center gap-2 bg-gray-50 hover:bg-gray-100 text-[#162740] border border-gray-200 px-4 py-3 rounded-xl font-medium transition-colors"
                >
                  {expandedRide === ride.id ? (
                    <><ChevronUp size={20} /> Hide Bookings</>
                  ) : (
                    <><ChevronDown size={20} /> View Bookings</>
                  )}
                </button>

                {/* Passenger Bookings Dropdown */}
                {expandedRide === ride.id && (
                  <div className="mt-6 pt-6 border-t border-gray-100 animate-in fade-in slide-in-from-top-4 duration-300">
                    <h3 className="font-bold text-lg text-[#162740] mb-4 flex items-center gap-2">
                      <Users size={20} className="text-[#9A7D46]" /> Passenger Manifest
                    </h3>

                    {bookings[ride.id]?.length > 0 ? (
                      <div className="grid sm:grid-cols-2 gap-4">
                        {bookings[ride.id].map((booking) => (
                          <div
                            key={booking.bookingId}
                            className="bg-white border border-gray-200 rounded-2xl p-4 shadow-sm"
                          >
                            <div className="flex justify-between items-start mb-3">
                              <p className="font-bold text-[#162740]">{booking.passengerName}</p>
                              <span className={`text-xs font-bold uppercase ${booking.status === "BOOKED" ? "text-green-600" : "text-red-600"}`}>
                                {booking.status}
                              </span>
                            </div>
                            <p className="text-sm text-gray-600 mb-2">{booking.passengerEmail}</p>
                            <div className="flex items-center gap-1 text-sm font-semibold text-[#9A7D46] bg-[#F4ECDD] w-fit px-2 py-1 rounded-md">
                              <Users size={14} /> {booking.seatsBooked} Seat(s)
                            </div>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="bg-gray-50 text-center p-6 rounded-2xl border border-gray-100">
                        <p className="text-gray-500 font-medium">No bookings found for this ride yet.</p>
                      </div>
                    )}
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default MyRidesPage;