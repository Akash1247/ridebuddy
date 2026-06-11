import { useState } from "react";
import api from "../services/api";

function RideCard({ ride }) {

  const [seats, setSeats] = useState(1);

  const bookRide = async () => {

    try {

      await api.post("/bookings/create", {
        rideId: ride.id,
        seatsBooked: seats
      });

      alert("Ride booked successfully 🚗");

    } catch (error) {
      console.log(error);
      alert("Booking failed");
    }
  };

  return (
    <div className="bg-white rounded-2xl shadow-md hover:shadow-2xl transition-all duration-300 p-6 border border-gray-100">

      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-bold text-blue-600">
          {ride.host}
        </h2>

        <span className="bg-green-100 text-green-700 px-3 py-1 rounded-full text-sm font-medium">
          Available
        </span>
      </div>

      <div className="space-y-2 text-gray-700">

        <p>
          📍 <span className="font-semibold">From:</span> {ride.fromLocation}
        </p>

        <p>
          🏁 <span className="font-semibold">To:</span> {ride.toLocation}
        </p>

        <p>
          💺 <span className="font-semibold">Seats:</span>{" "}
          {ride.availableSeats ?? ride.totalSeats}
        </p>

        <p>
          🚘 <span className="font-semibold">Car:</span>{" "}
          {ride.carModel}
        </p>

        <p>
          🕒 <span className="font-semibold">Departure:</span>{" "}
          {ride.departureTime}
        </p>

      </div>

      <div className="mt-5 flex justify-between items-center">

        <p className="text-2xl font-bold text-green-600">
          ₹ {ride.price}
        </p>
        <div className="flex items-center gap-2">
        <button
          onClick={() => seats > 1 && setSeats(seats - 1)}
          className="bg-gray-200 px-3 py-1 rounded"
        >
          -
        </button>
        <span>{seats}</span>
        <button
          onClick={() =>
            seats < ride.availableSeats &&
            setSeats(seats + 1)
          }
          className="bg-gray-200 px-3 py-1 rounded"
        >
          +
        </button>
        <button
          onClick={bookRide}
          className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-2 rounded-lg font-medium transition"
        >
          Book Ride
        </button>
      </div>
      </div>
    </div>
  );
}

export default RideCard;