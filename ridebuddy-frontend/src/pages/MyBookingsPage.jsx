import { useEffect, useState } from "react";
import { Navigate } from "react-router-dom";
import api from "../services/api";

function MyBookingsPage() {

  const role = localStorage.getItem("role");

  if (role !== "USER") {
    return <Navigate to="/rides" />;
  }

  const [bookings, setBookings] = useState([]);

  useEffect(() => {
    fetchBookings();
  }, []);

  const fetchBookings = async () => {

    try {

      const response = await api.get(
        "/bookings/my-bookings"
      );

      setBookings(response.data);

    } catch (error) {

      console.log(error);
    }
  };

  const cancelBooking = async (bookingId) => {

    try {

      await api.put(
        `/bookings/${bookingId}/cancel`
      );

      alert("Booking cancelled successfully");

      fetchBookings();

    } catch (error) {

      console.log(error);
      alert("Failed to cancel booking");
    }
  };

  return (

    <div className="min-h-screen bg-gray-100 p-6">

      <div className="max-w-5xl mx-auto">

        <h1 className="text-3xl font-bold mb-8">
          My Bookings
        </h1>

        <div className="space-y-6">

          {bookings.map((booking) => (

            <div
              key={booking.bookingId}
              className="bg-white rounded-2xl shadow-md p-6"
            >

              <div className="flex justify-between items-start">

                <div>

                  <h2 className="text-2xl font-bold text-blue-600">

                    📍 {booking.fromLocation}
                    {" → "}
                    {booking.toLocation}

                  </h2>

                  <p className="text-gray-500 mt-1">

                    🛣️ {booking.distanceKm} km • {" "}
                    ⏱️ {booking.estimatedDurationMinutes} mins

                  </p>

                </div>

                <span
                  className={`px-4 py-2 rounded-full text-sm font-semibold ${
                    booking.status === "BOOKED"
                      ? "bg-green-100 text-green-700"
                      : "bg-red-100 text-red-700"
                  }`}
                >
                  {booking.status}
                </span>

              </div>

              <div className="mt-6 grid md:grid-cols-2 gap-4 text-gray-700">

                <p>
                  🕒 <strong>Departure:</strong>{" "}
                  {booking.departureTime}
                </p>

                <p>
                  👤 <strong>Driver:</strong>{" "}
                  {booking.driverName}
                </p>

                <p>
                  🚗 <strong>Car:</strong>{" "}
                  {booking.carModel}
                </p>

                <p>
                  💺 <strong>Seats:</strong>{" "}
                  {booking.seatsBooked}
                </p>

                <p>
                  💰 <strong>Price:</strong>{" "}
                  ₹{booking.price}
                </p>

              </div>

              {booking.status === "BOOKED" && (

                <button
                  onClick={() =>
                    cancelBooking(booking.bookingId)
                  }
                  className="mt-6 bg-red-500 hover:bg-red-600 text-white px-5 py-2 rounded-lg"
                >
                  Cancel Booking
                </button>

              )}

            </div>

          ))}

        </div>

      </div>

    </div>
  );
}

export default MyBookingsPage;