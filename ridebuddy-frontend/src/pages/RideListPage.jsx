import { useEffect, useRef, useState } from "react";
import api from "../services/api";
import RideCard from "../components/RideCard";
import { calculateDistance } from "../utils/Distance";

import SockJS from "sockjs-client/dist/sockjs";
import { Client } from "@stomp/stompjs";

function RideListPage() {

  const [rides, setRides] = useState([]);
  const [loading, setLoading] = useState(false);
  
  const stompClient = useRef(null);
  const [fromLocation, setFromLocation] = useState("");
  const [toLocation, setToLocation] = useState("");
  const [userLocation, setUserLocation] = useState(null);

  const role = localStorage.getItem("role");

  useEffect(() => {
    // fetchRides();
    getUserLocation();
  }, []);

  const fetchRides = async () => {
    
    try {

      setLoading(true);

      const response = await api.get("/rides/all");

      setRides(response.data);

    } catch (error) {

      console.log(error);
      alert("Failed to load rides");

    } finally {

      setLoading(false);
    }
  };

  const getUserLocation = () => {

    navigator.geolocation.getCurrentPosition(
      async (position) => {

        const lat = position.coords.latitude;
        const lon = position.coords.longitude;

        setUserLocation({
          latitude: lat,
          longitude: lon
        });

        // const response = await fetch(
        //   `https://nominatim.openstreetmap.org/reverse?lat=${lat}&lon=${lon}&format=json`
        // );

        // const data = await response.json();

        // setFromLocation(
        //   data.address.city ||
        //   data.address.town ||
        //   data.address.suburb ||
        //   ""
        // );
      }
    );
  };

  const getCurrentLocation = () => {

    navigator.geolocation.getCurrentPosition(
      async (position) => {

        const lat = position.coords.latitude;
        const lon = position.coords.longitude;

        setUserLocation({
          latitude: lat,
          longitude: lon
        });

        const response = await fetch(
          `https://nominatim.openstreetmap.org/reverse?lat=${lat}&lon=${lon}&format=json`
        );

        const data = await response.json();

        setFromLocation(
          data.address.city ||
          data.address.town ||
          data.address.suburb ||
          ""
        );
      }
    );
  };

  const searchRides = async () => {

    try {

      setLoading(true);

      const response = await api.get(
        `/rides/search?fromLocation=${fromLocation}&toLocation=${toLocation}`
      );

      setRides(response.data);

    } catch (error) {

      console.log(error);
      alert("Search Failed");

    } finally {

      setLoading(false);
    }
  };


useEffect(() => {

  console.log("🚀 Initializing WebSocket...");

  const socket = new SockJS(
    `${import.meta.env.VITE_API_URL}/ws`
  );

  const client = new Client({

    webSocketFactory: () => socket,

    reconnectDelay: 5000,

    debug: (msg) => {
      console.log("STOMP:", msg);
    },

    onConnect: () => {

      console.log("✅ WebSocket Connected");

      client.subscribe(
        "/topic/rides",
        (message) => {

          console.log(
            "📩 WebSocket Message:",
            message.body
          );

          const update = JSON.parse(message.body);

          setRides((prevRides) =>
            prevRides.map((ride) =>
              ride.id === update.rideId
                ? {
                    ...ride,
                    availableSeats:
                      update.availableSeats
                  }
                : ride
            )
          );
        }
      );
    },

    onWebSocketError: (error) => {
      console.error(error);
    },

    onStompError: (frame) => {
      console.error(frame.headers["message"]);
    }
  });

  client.activate();

  stompClient.current = client;

  return () => {

    client.deactivate();

    stompClient.current = null;
  };

}, []);

const sortedRides = [...rides].sort((a, b) => {

  if (!userLocation) return 0;

  const distanceA = calculateDistance(
    userLocation.latitude,
    userLocation.longitude,
    a.pickupLatitude,
    a.pickupLongitude
  );

  const distanceB = calculateDistance(
    userLocation.latitude,
    userLocation.longitude,
    b.pickupLatitude,
    b.pickupLongitude
  );

  return distanceA - distanceB;
});

  return (

    <div className="min-h-screen bg-gray-100">

      <div className="max-w-7xl mx-auto px-6 py-8">

        <div className="text-center mb-10">

          <h1 className="text-5xl font-bold text-blue-600 mb-3">
            Available Rides 🚗
          </h1>

          <p className="text-gray-500">
            Find your perfect ride partner
          </p>

        </div>

        {/* Search Section */}

        <div className="bg-white rounded-2xl shadow-md p-6 mb-10">

          <h2 className="text-xl font-semibold mb-4">
            Search Ride
          </h2>

          <div className="grid md:grid-cols-3 gap-4">

            <input
              placeholder="From Location"
              value={fromLocation}
              onChange={(e) =>
                setFromLocation(e.target.value)
              }
              className="border rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />

            <input
              placeholder="To Location"
              value={toLocation}
              onChange={(e) =>
                setToLocation(e.target.value)
              }
              className="border rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />

            <button
              onClick={searchRides}
              className="bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-semibold"
            >
              Search Ride
            </button>

          </div>

          <div className="mt-4 col-span-2 flex gap-4">
            
            <button
              onClick={getCurrentLocation}
              className="bg-green-600 text-white px-4 py-2 rounded-lg"
            >
              Use Current Location 📍
            </button> 

            <button
              onClick={fetchRides}
              className="bg-gray-200 hover:bg-gray-300 px-4 py-2 rounded-lg"
            >
              Show All Rides
            </button>

          </div>

        </div>

        {/* Loading */}

        {
          loading && (

            <div className="text-center py-10">

              <p className="text-lg font-medium">
                Loading rides...
              </p>

            </div>
          )
        }

        {/* Empty State */}

        {
          !loading &&
          rides.length === 0 && (

            <div className="bg-white rounded-2xl shadow-md p-10 text-center">

              <h2 className="text-2xl font-bold mb-2">
                Search For the Rides you want.
              </h2>

              <p className="text-gray-500">
                Try changing your search criteria.
              </p>

            </div>
          )
        }

        {/* Ride Cards */}

        {
          !loading &&
          rides.length > 0 && (

          <div className="grid sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {sortedRides.map((ride) => {
              // Calculate distance for this specific ride
              const distance = userLocation && ride.pickupLatitude 
                ? calculateDistance(
                    userLocation.latitude,
                    userLocation.longitude,
                    ride.pickupLatitude,
                    ride.pickupLongitude
                  )
                : null;

              return (
                <RideCard
                  key={ride.id}
                  ride={ride}
                  distance={distance}
                />
              );
            })}
          </div>
          )
        }

      </div>

    </div>
  );
}

export default RideListPage;