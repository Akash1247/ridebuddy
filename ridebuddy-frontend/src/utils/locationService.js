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


export async function reverseGeocode(lat, lon) {

  const response = await fetch(
    `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lon}`
  );

  const data = await response.json();

  return (
    data.address.city ||
    data.address.town ||
    data.address.suburb ||
    data.address.village ||
    data.display_name
  );
}