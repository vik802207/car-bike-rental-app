export const fetchCars = async () => {
  const res = await fetch("https://myfakeapi.com/api/cars/");
  if (!res.ok) throw new Error("Failed to fetch cars");
  const data = await res.json();
  return data.cars;
};

// Fetch bike-sharing networks from CityBikes API
export const fetchBikes = async () => {
  const res = await fetch("https://api.citybik.es/v2/networks");
  if (!res.ok) throw new Error("Failed to fetch bikes");
  const data = await res.json();
  // data.networks is an array of bike-sharing networks (cities with bike stations)
  // You can process or filter this data as needed
  return data.networks;
};

// Optional: For Mockaroo or custom JSON endpoint (update your own URL here)
export const fetchCustomVehicles = async () => {
  const res = await fetch("https://my.api.mockaroo.com/users.json?key=224aa740");
  if (!res.ok) throw new Error("Failed to fetch custom vehicles");
  const data = await res.json();
  return data;
};