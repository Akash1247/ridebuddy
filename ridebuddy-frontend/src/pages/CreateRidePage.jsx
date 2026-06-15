import { useState } from "react";
import api from "../services/api";
import { Navigate } from "react-router-dom";

function CreateRidePage() {

  const role = localStorage.getItem("role");

  if (role !== "DRIVER") {
    return <Navigate to="/rides" />;
  }

  const [ride, setRide] = useState({
    host: "",
    fromLocation: "",
    toLocation: "",
    departureTime: "",
    totalSeats: "",
    price: "",
    carModel: "",
    carLicensePlate: ""
  });

  const handleChange = (e) => {
    setRide({
      ...ride,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async () => {

    try {

      const token = localStorage.getItem("token");

      await api.post(
        "/rides/create",
        ride,
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );

      alert("Ride Created Successfully 🚗");

      setRide({
        host: "",
        fromLocation: "",
        toLocation: "",
        departureTime: "",
        totalSeats: "",
        price: "",
        carModel: "",
        carLicensePlate: ""
      });

    } catch (error) {

      console.log(error);
      alert("Failed To Create Ride");
    }
  };

  return (

    <div className="min-h-screen bg-gray-100 py-10">

      <div className="max-w-4xl mx-auto bg-white shadow-xl rounded-2xl p-8">

        <h1 className="text-4xl font-bold text-center text-blue-600 mb-2">
          Create Ride
        </h1>

        <p className="text-center text-gray-500 mb-8">
          Publish your ride and start sharing your journey
        </p>

        <div className="grid md:grid-cols-2 gap-5">

          <div>
            <label className="block mb-2 font-medium">
              Host Name
            </label>

            <input
              name="host"
              value={ride.host}
              onChange={handleChange}
              placeholder="Enter Host Name"
              className="w-full border rounded-lg p-3"
            />
          </div>

          <div>
            <label className="block mb-2 font-medium">
              Departure Time
            </label>

            <input
              type="datetime-local"
              name="departureTime"
              value={ride.departureTime}
              onChange={handleChange}
              className="w-full border rounded-lg p-3"
            />
          </div>

          <div>
            <label className="block mb-2 font-medium">
              From Location
            </label>

            <input
              name="fromLocation"
              value={ride.fromLocation}
              onChange={handleChange}
              placeholder="Noida"
              className="w-full border rounded-lg p-3"
            />
          </div>

          <div>
            <label className="block mb-2 font-medium">
              To Location
            </label>

            <input
              name="toLocation"
              value={ride.toLocation}
              onChange={handleChange}
              placeholder="Gurgaon"
              className="w-full border rounded-lg p-3"
            />
          </div>

          <div>
            <label className="block mb-2 font-medium">
              Total Seats
            </label>

            <input
              type="number"
              name="totalSeats"
              value={ride.totalSeats}
              onChange={handleChange}
              placeholder="4"
              className="w-full border rounded-lg p-3"
            />
          </div>

          <div>
            <label className="block mb-2 font-medium">
              Price Per Seat (₹)
            </label>

            <input
              type="number"
              name="price"
              value={ride.price}
              onChange={handleChange}
              placeholder="250"
              className="w-full border rounded-lg p-3"
            />
          </div>

          <div>
            <label className="block mb-2 font-medium">
              Car Model
            </label>

            <input
              name="carModel"
              value={ride.carModel}
              onChange={handleChange}
              placeholder="Hyundai i20"
              className="w-full border rounded-lg p-3"
            />
          </div>

          <div>
            <label className="block mb-2 font-medium">
              Car Number
            </label>

            <input
              name="carLicensePlate"
              value={ride.carLicensePlate}
              onChange={handleChange}
              placeholder="UP32 AB 1234"
              className="w-full border rounded-lg p-3"
            />
          </div>

        </div>

        <button
          onClick={handleSubmit}
          className="mt-8 w-full bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-lg text-lg font-semibold"
        >
          Create Ride 🚀
        </button>

      </div>

    </div>
  );
}

export default CreateRidePage;