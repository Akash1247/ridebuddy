import { useState, useEffect } from "react";
import api from "../services/api";
import { Navigate } from "react-router-dom";
import RideMap from "../components/RideMap";
import { geocodeLocation, reverseGeocode } from "../utils/locationService";
import { MapPin, Search, Navigation2, Clock } from "lucide-react";

const formatDuration = (totalMinutes) => {
  if (!totalMinutes) return "";
  const hours = Math.floor(totalMinutes / 60);
  const minutes = totalMinutes % 60;
  
  if (hours > 0) {
    return `${hours} hr ${minutes} min`;
  }
  return `${minutes} min`;
};

function CreateRidePage() {
  const role = localStorage.getItem("role");

  if (role !== "DRIVER") {
    return <Navigate to="/rides" />;
  }

  const [currentPosition, setCurrentPosition] = useState(null);
  const [destinationPosition, setDestinationPosition] = useState(null);
  const [routeCoordinates, setRouteCoordinates] = useState([]);
  const [distance, setDistance] = useState("");
  const [duration, setDuration] = useState("");

  const [ride, setRide] = useState({
    host: "", fromLocation: "", toLocation: "", departureTime: "",
    totalSeats: "", price: "", carModel: "", carLicensePlate: "",
    pickupLatitude: "", pickupLongitude: "", destinationLatitude: "",
    destinationLongitude: "", distanceKm: "", estimatedDurationMinutes: ""
  });

  const handleChange = (e) => {
    setRide({ ...ride, [e.target.name]: e.target.value });
  };

  const handleSubmit = async () => {
    try {
      const token = localStorage.getItem("token");
      await api.post("/rides/create", ride, {
        headers: { Authorization: `Bearer ${token}` }
      });
      alert("Ride Created Successfully 🚗");
      setRide({
        host: "", fromLocation: "", toLocation: "", departureTime: "",
        totalSeats: "", price: "", carModel: "", carLicensePlate: "",
        pickupLatitude: "", pickupLongitude: "", destinationLatitude: "",
        destinationLongitude: "", distanceKm: "", estimatedDurationMinutes: "",
      });
    } catch (error) {
      console.log(error);
      alert("Failed To Create Ride");
    }
  };

  const getCurrentLocation = () => {
    navigator.geolocation.getCurrentPosition(
      async (position) => {
        try {
          const lat = position.coords.latitude;
          const lng = position.coords.longitude;
          setCurrentPosition([lat, lng]);
          const locationName = await reverseGeocode(lat, lng);
          setRide((prev) => ({
            ...prev,
            pickupLatitude: lat,
            pickupLongitude: lng,
            fromLocation: locationName
          }));
        } catch (error) {
          console.log(error);
          alert("Unable to fetch address");
        }
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
        destinationLatitude: lat,
        destinationLongitude: lon
      }));
    } catch (error) {
      console.log(error);
    }
  };

  const calculateRouteFromInputs = async () => {
    if (!ride.fromLocation || !ride.toLocation) return;
    try {
      const fromCoords = await geocodeLocation(ride.fromLocation);
      const toCoords = await geocodeLocation(ride.toLocation);
      setCurrentPosition([fromCoords.latitude, fromCoords.longitude]);
      setDestinationPosition([toCoords.latitude, toCoords.longitude]);
      setRide((prev) => ({
        ...prev,
        pickupLatitude: fromCoords.latitude,
        pickupLongitude: fromCoords.longitude,
        destinationLatitude: toCoords.latitude,
        destinationLongitude: toCoords.longitude
      }));
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    const timer = setTimeout(() => {
      if (ride.fromLocation && ride.toLocation) {
        calculateRouteFromInputs();
      }
    }, 1500); 
    return () => clearTimeout(timer);
  }, [ride.fromLocation, ride.toLocation]);

  const getRoute = async () => {
    if (!currentPosition || !destinationPosition) return;
    try {
      const response = await fetch(
        "https://api.openrouteservice.org/v2/directions/driving-car/geojson",
        {
          method: "POST",
          headers: {
            Authorization: import.meta.env.VITE_ORS_API_KEY,
            "Content-Type": "application/json"
          },
          body: JSON.stringify({
            coordinates: [
              [currentPosition[1], currentPosition[0]],
              [destinationPosition[1], destinationPosition[0]]
            ]
          })
        }
      );
      const data = await response.json();
      if (!data.features || data.features.length === 0) {
        console.log("Route not found");
        return;
      }
      const coordinates = data.features[0].geometry.coordinates;
      const formatted = coordinates.map(([lng, lat]) => [lat, lng]);
      setRouteCoordinates(formatted);
      const summary = data.features[0].properties.summary;

      setDistance((summary.distance / 1000).toFixed(1));
      
      const totalMinutes = Math.round(summary.duration / 60);
      setDuration(totalMinutes);

      setRide((prev) => ({
        ...prev,
        distanceKm: summary.distance / 1000,
        estimatedDurationMinutes: totalMinutes
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
    <div className="min-h-screen bg-[#F6F3EC] py-10 px-4">
      {/* Explicit items-stretch to lock the columns together */}
      <div className="max-w-6xl mx-auto grid lg:grid-cols-2 gap-8 items-stretch">
        
        {/* Left Column: Map & Route Planning */}
        <div className="bg-white rounded-3xl shadow-sm border border-[#E8E1D5] p-6 flex flex-col h-full">
          <h2 className="text-xl font-bold text-[#162740] mb-5 flex items-center gap-2">
            <MapPin className="text-[#9A7D46]" size={20} /> Plan Route
          </h2>
          
          <div className="flex flex-col gap-3 mb-5 shrink-0">
            <button
              type="button"
              onClick={getCurrentLocation}
              className="w-full bg-[#E6F4EA] text-[#137333] hover:bg-[#CEEAD6] border border-[#137333]/20 px-4 py-2.5 rounded-xl text-sm font-semibold transition-colors flex justify-center items-center gap-2"
            >
              <Navigation2 size={16} /> Use Current Location
            </button>

            <div className="flex gap-2">
              <div className="relative flex-1">
                <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
                  <Search size={16} />
                </div>
                <input
                  value={ride.toLocation}
                  onChange={handleChange}
                  name="toLocation"
                  placeholder="Search destination"
                  className="w-full bg-gray-50 border border-gray-200 pl-9 pr-4 py-2.5 rounded-xl text-sm focus:outline-none focus:ring-1 focus:ring-[#9A7D46] focus:bg-white transition-colors"
                />
              </div>
              <button
                type="button"
                onClick={searchDestination}
                className="bg-[#162740] hover:bg-[#111F33] text-white px-5 rounded-xl text-sm font-semibold transition-colors"
              >
                Search
              </button>
            </div>
          </div>

          {distance && duration && (
            <div className="bg-[#F4ECDD] border border-[#9A7D46]/20 p-3 rounded-xl flex items-center justify-around mb-5 shadow-sm shrink-0">
              <div className="text-center">
                <p className="text-[10px] text-[#9A7D46] font-bold uppercase tracking-wider mb-0.5">Total Distance</p>
                <p className="text-base font-bold text-[#162740]">{distance} km</p>
              </div>
              <div className="w-px h-8 bg-[#9A7D46]/20"></div>
              <div className="text-center">
                <p className="text-[10px] text-[#9A7D46] font-bold uppercase tracking-wider mb-0.5">Estimated Time</p>
                <p className="text-base font-bold text-[#162740] flex items-center justify-center gap-1">
                  <Clock size={14} /> {formatDuration(duration)}
                </p>
              </div>
            </div>
          )}

          {/* Dynamic Flex-Grow container to absorb empty space */}
          <div className="relative flex-grow w-full min-h-[300px] mt-2">
            <div className="absolute inset-0">
              <RideMap
                currentPosition={currentPosition}
                destinationPosition={destinationPosition}
                routeCoordinates={routeCoordinates}
              />
            </div>
          </div>
        </div>

        {/* Right Column: Ride Details Form */}
        <div className="bg-white rounded-3xl shadow-sm border border-[#E8E1D5] p-8 lg:p-10 flex flex-col h-full">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-[#162740] mb-2 tracking-tight">
              Publish Ride
            </h1>
            <p className="text-gray-500 text-sm">
              Set your ride details and start sharing your journey.
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-5 flex-grow">
            <div className="md:col-span-2">
              <label className="block mb-1.5 text-xs font-bold text-gray-500 uppercase tracking-wider">Host Name</label>
              <input name="host" value={ride.host} onChange={handleChange} placeholder="Enter Host Name" className="w-full bg-gray-50 border border-gray-200 rounded-xl p-3 text-sm focus:outline-none focus:ring-1 focus:ring-[#9A7D46] focus:bg-white transition-colors" />
            </div>

            <div className="md:col-span-2">
              <label className="block mb-1.5 text-xs font-bold text-gray-500 uppercase tracking-wider">Departure Time</label>
              <input type="datetime-local" name="departureTime" value={ride.departureTime} onChange={handleChange} className="w-full bg-gray-50 border border-gray-200 rounded-xl p-3 text-sm focus:outline-none focus:ring-1 focus:ring-[#9A7D46] focus:bg-white transition-colors" />
            </div>

            <div>
              <label className="block mb-1.5 text-xs font-bold text-gray-500 uppercase tracking-wider">From Location</label>
              <input name="fromLocation" value={ride.fromLocation} onChange={handleChange} placeholder="e.g. Noida" className="w-full bg-gray-50 border border-gray-200 rounded-xl p-3 text-sm focus:outline-none focus:ring-1 focus:ring-[#9A7D46] focus:bg-white transition-colors" />
            </div>

            <div>
              <label className="block mb-1.5 text-xs font-bold text-gray-500 uppercase tracking-wider">To Location</label>
              <input name="toLocation" value={ride.toLocation} onChange={handleChange} placeholder="e.g. Gurgaon" className="w-full bg-gray-50 border border-gray-200 rounded-xl p-3 text-sm focus:outline-none focus:ring-1 focus:ring-[#9A7D46] focus:bg-white transition-colors" />
            </div>

            <div>
              <label className="block mb-1.5 text-xs font-bold text-gray-500 uppercase tracking-wider">Total Seats</label>
              <input type="number" name="totalSeats" value={ride.totalSeats} onChange={handleChange} placeholder="4" className="w-full bg-gray-50 border border-gray-200 rounded-xl p-3 text-sm focus:outline-none focus:ring-1 focus:ring-[#9A7D46] focus:bg-white transition-colors" />
            </div>

            <div>
              <label className="block mb-1.5 text-xs font-bold text-gray-500 uppercase tracking-wider">Price Per Seat (₹)</label>
              <input type="number" name="price" value={ride.price} onChange={handleChange} placeholder="250" className="w-full bg-gray-50 border border-gray-200 rounded-xl p-3 text-sm focus:outline-none focus:ring-1 focus:ring-[#9A7D46] focus:bg-white transition-colors" />
            </div>

            <div>
              <label className="block mb-1.5 text-xs font-bold text-gray-500 uppercase tracking-wider">Car Model</label>
              <input name="carModel" value={ride.carModel} onChange={handleChange} placeholder="e.g. Hyundai i20" className="w-full bg-gray-50 border border-gray-200 rounded-xl p-3 text-sm focus:outline-none focus:ring-1 focus:ring-[#9A7D46] focus:bg-white transition-colors" />
            </div>

            <div>
              <label className="block mb-1.5 text-xs font-bold text-gray-500 uppercase tracking-wider">Car Number</label>
              <input name="carLicensePlate" value={ride.carLicensePlate} onChange={handleChange} placeholder="e.g. UP32 AB 1234" className="w-full bg-gray-50 border border-gray-200 rounded-xl p-3 text-sm focus:outline-none focus:ring-1 focus:ring-[#9A7D46] focus:bg-white transition-colors" />
            </div>
          </div>

          <button
            onClick={handleSubmit}
            className="mt-8 w-full bg-[#162740] hover:bg-[#111F33] text-white py-3.5 rounded-xl text-base font-bold transition-all shadow-md shrink-0"
          >
            Publish Ride
          </button>
        </div>
      </div>
    </div>
  );
}

export default CreateRidePage;