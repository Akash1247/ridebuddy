export async function geocodeLocation(address) {

  const response = await fetch(
    `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(address)}&format=json&limit=1`
  );

  const data = await response.json();

  if (!data.length) {
    throw new Error("Location not found");
  }

  return {
    latitude: parseFloat(data[0].lat),
    longitude: parseFloat(data[0].lon)
  };
}