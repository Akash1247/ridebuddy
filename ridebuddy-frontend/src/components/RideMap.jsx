import { useEffect } from "react";
import {
  MapContainer,
  TileLayer,
  Marker,
  Polyline,
  useMap
} from "react-leaflet";

function MapUpdater({ currentPosition, destinationPosition, routeCoordinates }) {
  const map = useMap();

  useEffect(() => {
    if (routeCoordinates && routeCoordinates.length > 0) {
      map.fitBounds(routeCoordinates, { padding: [40, 40] });
    } else if (currentPosition && destinationPosition) {
      map.fitBounds([currentPosition, destinationPosition], { padding: [50, 50] });
    } else if (currentPosition) {
      map.setView(currentPosition, 14);
    } else if (destinationPosition) {
      map.setView(destinationPosition, 14);
    }
  }, [currentPosition, destinationPosition, routeCoordinates, map]);

  return null;
}

function RideMap({ currentPosition, destinationPosition, routeCoordinates }) {
  return (
    <div className="rounded-2xl overflow-hidden shadow-sm border border-[#E8E1D5] relative z-0 w-full h-full">
      <MapContainer
        center={currentPosition || [28.6139, 77.2090]}
        zoom={12}
        style={{ height: "100%", width: "100%", position: "absolute", top: 0, left: 0 }}
      >
        <TileLayer
          attribution='© OpenStreetMap contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />

        <MapUpdater 
          currentPosition={currentPosition}
          destinationPosition={destinationPosition}
          routeCoordinates={routeCoordinates}
        />

        {currentPosition && <Marker position={currentPosition} />}
        {destinationPosition && <Marker position={destinationPosition} />}

        {routeCoordinates?.length > 0 && (
          <Polyline positions={routeCoordinates} color="#162740" weight={4} opacity={0.8} />
        )}
      </MapContainer>
    </div>
  );
}

export default RideMap;