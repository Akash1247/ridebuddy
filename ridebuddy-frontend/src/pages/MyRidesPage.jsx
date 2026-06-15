import { useEffect, useState } from "react";
import api from "../services/api";

function MyRidesPage() {
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

  console.log("API RESPONSE:");
  console.log(response.data);

  setBookings((prev) => ({
    ...prev,
    [rideId]: response.data,
  }));
};

  const handleViewBookings = async (rideId) => {
    if (!bookings[rideId]) {
      await fetchRideBookings(rideId);
    }

    setExpandedRide(
      expandedRide === rideId ? null : rideId
    );
  };

  if (loading) {
    return (
      <div className="p-6 text-center text-lg">
        Loading rides...
      </div>
    );
  }

  return (
    <div className="p-6 max-w-5xl mx-auto">
      <h1 className="text-3xl font-bold mb-6">
        My Rides 🚗
      </h1>

      {rides.length === 0 ? (
        <div className="text-gray-500">
          No rides found.
        </div>
      ) : (
        rides.map((ride) => (
          <div
            key={ride.id}
            className="border rounded-xl p-5 mb-5 shadow-sm"
          >
            <h2 className="text-xl font-semibold mb-2">
              {ride.fromLocation} → {ride.toLocation}
            </h2>

            <div className="space-y-1 mb-4">
              <p>
                <strong>Host:</strong> {ride.host}
              </p>

              <p>
                <strong>Car:</strong> {ride.carModel}
              </p>

              <p>
                <strong>Available Seats:</strong>{" "}
                {ride.availableSeats}
              </p>

              <p>
                <strong>Price:</strong> ₹{ride.price}
              </p>

              <p>
                <strong>Status:</strong> {ride.status}
              </p>
            </div>

            <button
              onClick={() =>
                handleViewBookings(ride.id)
              }
              className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
            >
              {expandedRide === ride.id
                ? "Hide Bookings"
                : "View Bookings"}
            </button>

            {expandedRide === ride.id && (
              <div className="mt-4 border-t pt-4">
                <h3 className="font-bold text-lg mb-3">
                  Passenger Bookings
                </h3>

                {bookings[ride.id]?.length > 0 ? (
                  bookings[ride.id].map((booking) => (
                    <div
                      key={booking.bookingId}
                      className="border rounded p-3 mb-3 bg-gray-50"
                    >
                      <p>
                        <strong>Name:</strong>{" "}
                        {booking.passengerName}
                      </p>

                      <p>
                        <strong>Email:</strong>{" "}
                        {booking.passengerEmail}
                      </p>

                      <p>
                        <strong>Seats:</strong>{" "}
                        {booking.seatsBooked}
                      </p>

                      <p>
                        <strong>Status:</strong>{" "}
                        <span
                          className={
                            booking.status === "BOOKED"
                              ? "text-green-600 font-semibold"
                              : "text-red-600 font-semibold"
                          }
                        >
                          {booking.status}
                        </span>
                      </p>
                    </div>
                  ))
                ) : (
                  <p className="text-gray-500">
                    No bookings found for this ride.
                  </p>
                )}
              </div>
            )}
          </div>
        ))
      )}
    </div>
  );
}

export default MyRidesPage;