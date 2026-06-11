import { useEffect, useState } from "react";
import api from "../services/api";

function MyRidesPage() {

  const [rides, setRides] = useState([]);

  useEffect(() => {
    fetchMyRides();
  }, []);

  const fetchMyRides = async () => {

    try {

      const response =
        await api.get("/rides/my-rides");

      setRides(response.data);

    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div className="p-6">

      <h1 className="text-3xl font-bold mb-6">
        My Rides 🚗
      </h1>

      {rides.map((ride) => (

        <div
          key={ride.id}
          className="border p-4 rounded-lg mb-4"
        >

          <h2>{ride.fromLocation} → {ride.toLocation}</h2>

          <p>
            Available Seats:
            {ride.availableSeats}
          </p>

          <p>
            Price:
            ₹{ride.price}
          </p>

        </div>
      ))}

    </div>
  );
}

export default MyRidesPage;