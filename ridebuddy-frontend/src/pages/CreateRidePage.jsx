import { useState, useEffect } from "react";
import api from "../services/api";
import { Navigate } from "react-router-dom";
import RideMap from "../components/RideMap";
// CreateRidePage.jsx ke top par
import { geocodeLocation } from "../utils/locationService";

function CreateRidePage() {
  
  const role = localStorage.getItem("role");
  
  if (role !== "DRIVER") {
    return <Navigate to="/rides" />;
  }
  
  const [currentPosition, setCurrentPosition] = useState(null);
  
  // const [destination, setDestination] = useState("");
  
  const [destinationPosition, setDestinationPosition] = useState(null);
  
  const [routeCoordinates, setRouteCoordinates] = useState([]);
  
  const [distance, setDistance] = useState("");

  const [duration, setDuration] = useState("");


  const [ride, setRide] = useState({
    host: "",
    fromLocation: "",
    toLocation: "",
    departureTime: "",
    totalSeats: "",
    price: "",
    carModel: "",
    carLicensePlate: "",
    pickupLatitude: "",
    pickupLongitude: "",
    destinationLatitude: "",
    destinationLongitude: "",
    distanceKm: "",
    estimatedDurationMinutes: "" 
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
        carLicensePlate: "",
        pickupLatitude: "",
        pickupLongitude: "",
        destinationLatitude: "",
        destinationLongitude: "",
        distanceKm: "",
        estimatedDurationMinutes: "",
      });

    } catch (error) {

      console.log(error);
      alert("Failed To Create Ride");
    }
  };

  const getCurrentLocation = () => {
    navigator.geolocation.getCurrentPosition(
      (position) => {
        const lat = position.coords.latitude;
        const lng = position.coords.longitude;
        setCurrentPosition([lat, lng]);
        setRide((prev) => ({
          ...prev,

          pickupLatitude: lat,
          pickupLongitude: lng,
          
          fromLocation: `${lat.toFixed(4)}, ${lng.toFixed(4)}`
        }));
        },
        (error) => {
          console.log(error);
          alert("Unable to fetch location");
        }
      );
    };
    const searchDestination = async () => {
      if (!ride.toLocation) return;
      try {
        const response = await fetch(
          `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(ride.toLocation)}&format=json&limit=1`
        );
        const data = await response.json();
        if (data.length === 0) {
          alert("Location not found");
          return;
        }
        const lat = parseFloat(data[0].lat);
        const lon = parseFloat(data[0].lon);
        setDestinationPosition([lat, lon]);
        setRide((prev) => ({
          ...prev,
          toLocation: destination,
          destinationLatitude: lat,
          destinationLongitude: lon
        }));
      } catch (error) {
        console.log(error);
      }
    };
    
    const calculateRouteFromInputs = async () => {

      if (!ride.fromLocation || !ride.toLocation) {
        return;
      }

      try {

        const fromCoords =
          await geocodeLocation(ride.fromLocation);

        const toCoords =
          await geocodeLocation(ride.toLocation);

        setCurrentPosition([
        fromCoords.latitude,
        fromCoords.longitude
      ]);

      setDestinationPosition([
        toCoords.latitude,
        toCoords.longitude
      ]);

      setRide((prev) => ({
        ...prev,

        pickupLatitude: fromCoords.latitude,
        pickupLongitude: fromCoords.longitude,

        destinationLatitude: toCoords.latitude,
        destinationLongitude: toCoords.longitude
      }));

      } catch (error) {

        console.log(error);

        alert("Unable to find route");
      }
    };

    useEffect(() => {

  const timer = setTimeout(() => {

    if (
      ride.fromLocation &&
      ride.toLocation
    ) {
      calculateRouteFromInputs();
    }

  }, 1000);

  return () => clearTimeout(timer);

}, [
  ride.fromLocation,
  ride.toLocation
]);

    const getRoute = async () => {
      if (!currentPosition || !destinationPosition) return;
      try {
        const response = await fetch(
          "https://api.openrouteservice.org/v2/directions/driving-car/geojson",
          {
            method: "POST",
            headers: {
              Authorization:
                import.meta.env.VITE_ORS_API_KEY,
                "Content-Type": "application/json"
              },
              body: JSON.stringify({
                coordinates: [
                [
                  currentPosition[1],
                  currentPosition[0]
                ],
                [
                  destinationPosition[1],
                  destinationPosition[0]
                ]
              ]
            })
          }
        );
        const data = await response.json();
        if (!data.features || data.features.length === 0) {
          console.log(data);
          alert("Route not found");
          return;
        }
        const coordinates =
          data.features[0].geometry.coordinates;
        const formatted = coordinates.map(
          ([lng, lat]) => [lat, lng]
        );
        setRouteCoordinates(formatted);
        const summary =
          data.features[0].properties.summary;

        setDistance(
          (summary.distance / 1000).toFixed(1)
        );

        setDuration(
          Math.round(summary.duration / 60)
        );

        setRide((prev) => ({
          ...prev,

          distanceKm: summary.distance / 1000,

          estimatedDurationMinutes:
            Math.round(summary.duration / 60)
        }));
      } catch (error) {
        console.log(error);
      }
    };

    useEffect(() => {
      if (currentPosition && destinationPosition) {
        getRoute();
      }
    }, [currentPosition, destinationPosition]);

  return (
    <div className="min-h-screen bg-gray-100 py-10">
      <div className="space-y-4 mb-6">
        <button
          type="button"
          onClick={getCurrentLocation}
          className="bg-green-600 text-white px-4 py-2 rounded-lg"
        >
          Use Current Location 📍
        </button>

        <div className="flex gap-2">

          {/* <input
            value={destination}
            onChange={(e) =>
              setDestination(e.target.value)
            } */}
            <input
              value={ride.toLocation}
              onChange={handleChange}
              name="toLocation"
            placeholder="Search destination"
            className="border p-3 rounded-lg flex-1"
          />

          <button
            type="button"
            onClick={searchDestination}
            className="bg-blue-600 text-white px-4 rounded-lg"
          >
            Search
          </button>

        </div>

        {distance && duration && (

          <div className="bg-gray-100 p-4 rounded-lg">

            <p>Distance: {distance} km</p>

            <p>ETA: {duration} min</p>

          </div>
        )}

        <RideMap
          currentPosition={currentPosition}
          destinationPosition={destinationPosition}
          routeCoordinates={routeCoordinates}
        />

      </div>

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