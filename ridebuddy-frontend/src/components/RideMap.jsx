import {
  MapContainer,
  TileLayer,
  Marker,
  Polyline
} from "react-leaflet";

function RideMap({
  currentPosition,
  destinationPosition,
  routeCoordinates
}) {

  return (
    <MapContainer
      center={currentPosition || [28.6139, 77.2090]}
      zoom={12}
      style={{ height: "400px", width: "100%" }}
    >
      <TileLayer
        attribution='© OpenStreetMap contributors'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />

      {currentPosition && (
        <Marker position={currentPosition} />
      )}

      {destinationPosition && (
        <Marker position={destinationPosition} />
      )}

      {routeCoordinates.length > 0 && (
        <Polyline positions={routeCoordinates} />
      )}
    </MapContainer>
  );
}

export default RideMap;