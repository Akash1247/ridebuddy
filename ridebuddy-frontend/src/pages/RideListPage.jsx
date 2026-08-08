import { useEffect, useRef, useState } from "react";
import api from "../services/api";
import RideCard from "../components/RideCard";
import { calculateDistance } from "../utils/Distance";
import AiSearchBar from "../components/AiSearch";
import SockJS from "sockjs-client/dist/sockjs";
import { Client } from "@stomp/stompjs";
import { MapPin, Navigation2, Search, Calendar } from "lucide-react";

function RideListPage() {
  const [rides, setRides] = useState([]);
  const [loading, setLoading] = useState(false);
  
  const stompClient = useRef(null);
  const [fromLocation, setFromLocation] = useState("");
  const [toLocation, setToLocation] = useState("");
  const [searchDate, setSearchDate] = useState("");
  const [userLocation, setUserLocation] = useState(null);

  const role = localStorage.getItem("role");

  useEffect(() => {
    getUserLocation();
    fetchRides();
  }, []);

  const fetchRides = async () => {
    try {
      setLoading(true);
      const response = await api.get("/rides/all");
      setRides(response.data);
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  const getUserLocation = () => {
    navigator.geolocation.getCurrentPosition(
      async (position) => {
        setUserLocation({ latitude: position.coords.latitude, longitude: position.coords.longitude });
      }
    );
  };

  const getCurrentLocation = () => {
    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const lat = position.coords.latitude;
        const lon = position.coords.longitude;
        setUserLocation({ latitude: lat, longitude: lon });
        const response = await fetch(`https://nominatim.openstreetmap.org/reverse?lat=${lat}&lon=${lon}&format=json`);
        const data = await response.json();
        setFromLocation(data.address.city || data.address.town || data.address.suburb || "");
      }
    );
  };

  const searchRides = async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams();
      if (fromLocation) params.append("fromLocation", fromLocation);
      if (toLocation) params.append("toLocation", toLocation);
      if (searchDate) params.append("date", searchDate); 
      const response = await api.get(`/rides/search?${params.toString()}`);
      setRides(response.data);
    } catch (error) {
      console.log(error);
      alert("Search Failed");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const socket = new SockJS(`${import.meta.env.VITE_WS_URL}/ws`);
    const client = new Client({
      webSocketFactory: () => socket,
      reconnectDelay: 5000,
      onConnect: () => {
        client.subscribe("/topic/rides", (message) => {
          const update = JSON.parse(message.body);
          setRides((prevRides) =>
            prevRides.map((ride) =>
              ride.id === update.rideId ? { ...ride, availableSeats: update.availableSeats } : ride
            )
          );
        });
      }
    });
    client.activate();
    stompClient.current = client;
    return () => { client.deactivate(); stompClient.current = null; };
  }, []);

  const sortedRides = [...rides].sort((a, b) => {
    if (!userLocation) return 0;
    const distanceA = calculateDistance(userLocation.latitude, userLocation.longitude, a.pickupLatitude, a.pickupLongitude);
    const distanceB = calculateDistance(userLocation.latitude, userLocation.longitude, b.pickupLatitude, b.pickupLongitude);
    return distanceA - distanceB;
  });

  return (
    <div className="min-h-screen bg-[#F6F3EC]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-10">

        {/* Hero Section */}
        <div className="max-w-3xl mx-auto text-center mb-10">
          <h1 className="text-4xl md:text-5xl font-bold text-[#162740] mb-8 tracking-tight">
            Where are you heading?
          </h1>
          
          <AiSearchBar 
            onSearchStart={() => setLoading(true)}
            onSearchResults={(data) => {
              setRides(data);
              setLoading(false);
            }}
            onSearchError={() => setLoading(false)}
          />
        </div>

        {/* Manual Filters (Always visible, no title, tightly integrated) */}
        <div className="bg-white rounded-2xl shadow-sm border border-[#E8E1D5] p-4 max-w-5xl mx-auto mb-10">
          <div className="flex flex-col md:flex-row gap-3">
            <div className="flex-1 flex flex-col sm:flex-row gap-3">
              <div className="relative flex-1">
                <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"><MapPin size={16} /></div>
                <input placeholder="From Location" value={fromLocation} onChange={(e) => setFromLocation(e.target.value)} className="w-full border border-gray-200 bg-gray-50 pl-9 pr-3 py-3 rounded-xl text-sm focus:outline-none focus:ring-1 focus:ring-[#9A7D46]" />
              </div>
              <div className="relative flex-1">
                <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"><MapPin size={16} /></div>
                <input placeholder="To Location" value={toLocation} onChange={(e) => setToLocation(e.target.value)} className="w-full border border-gray-200 bg-gray-50 pl-9 pr-3 py-3 rounded-xl text-sm focus:outline-none focus:ring-1 focus:ring-[#9A7D46]" />
              </div>
              <div className="relative w-full sm:w-auto">
                <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"><Calendar size={16} /></div>
                <input type="date" value={searchDate} onChange={(e) => setSearchDate(e.target.value)} className="w-full border border-gray-200 bg-gray-50 pl-9 pr-3 py-3 rounded-xl text-sm text-gray-700 focus:outline-none focus:ring-1 focus:ring-[#9A7D46]" />
              </div>
            </div>
            
            <div className="flex gap-2 shrink-0">
              <button onClick={searchRides} className="bg-[#162740] hover:bg-[#111F33] text-white rounded-xl text-sm font-semibold px-5 py-3 flex items-center gap-1.5 transition-all shadow-sm">
                <Search size={16} /> Search
              </button>
              <button onClick={getCurrentLocation} title="Use Current Location" className="bg-[#E6F4EA] text-[#137333] hover:bg-[#CEEAD6] border border-[#137333]/20 px-3.5 py-3 rounded-xl transition-colors flex items-center justify-center">
                <Navigation2 size={18} />
              </button>
              <button onClick={fetchRides} className="bg-gray-50 border border-gray-200 hover:bg-gray-100 text-gray-700 px-4 py-3 rounded-xl text-sm font-semibold transition-colors flex items-center">
                Show All Rides
              </button>
            </div>
          </div>
        </div>

        {/* Results Header */}
        {!loading && rides.length > 0 && (
          <div className="mb-6 flex items-center justify-between">
            <h3 className="text-xl font-bold text-[#162740]">Available Rides</h3>
            <span className="text-sm font-semibold text-[#162740] bg-white border border-[#E8E1D5] px-3 py-1 rounded-full">{rides.length} options found</span>
          </div>
        )}

        {/* Loading State */}
        {loading && (
          <div className="text-center py-16 flex flex-col items-center">
            <div className="w-10 h-10 border-4 border-[#9A7D46] border-t-transparent rounded-full animate-spin mb-4"></div>
            <p className="text-base font-medium text-[#162740]">Analyzing routes...</p>
          </div>
        )}

        {/* Empty State */}
        {!loading && rides.length === 0 && (
          <div className="text-center py-20 max-w-md mx-auto">
             <div className="bg-white text-gray-300 w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-sm border border-gray-100"><Search size={32} /></div>
             <h2 className="text-xl font-bold text-[#162740] mb-2">No rides found</h2>
             <p className="text-gray-500 text-sm">Try asking the AI to search a different route or adjust your manual filters.</p>
          </div>
        )}

        {/* Results Grid - Max 3 columns for spacious cards */}
        {!loading && rides.length > 0 && (
          <div className="grid sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {sortedRides.map((ride) => {
              const distance = userLocation && ride.pickupLatitude 
                ? calculateDistance(userLocation.latitude, userLocation.longitude, ride.pickupLatitude, ride.pickupLongitude) 
                : null;
              return <RideCard key={ride.id} ride={ride} distance={distance} />;
            })}
          </div>
        )}

      </div>
    </div>
  );
}

export default RideListPage;