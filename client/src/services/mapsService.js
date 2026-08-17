import { Loader } from "@googlemaps/js-api-loader";

let mapsLoaderPromise = null;
let googleMapsInstance = null;

/**
 * Loads the Google Maps JavaScript API SDK dynamically.
 * Singleton promise prevents duplicate script tag injection.
 * @returns {Promise<typeof google.maps>}
 */
export async function loadGoogleMaps() {
  if (googleMapsInstance) {
    return googleMapsInstance;
  }

  if (mapsLoaderPromise) {
    return mapsLoaderPromise;
  }

  const apiKey = import.meta.env.VITE_GOOGLE_MAPS_API_KEY;

  if (!apiKey || apiKey === "AIzaSy_demo_google_maps_key_placeholder") {
    // If placeholder or missing key, throw a descriptive error so UI handles it gracefully
    console.warn(
      "Google Maps API key is missing or set to placeholder in VITE_GOOGLE_MAPS_API_KEY."
    );
  }

  const loader = new Loader({
    apiKey: apiKey || "",
    version: "weekly",
    libraries: ["places", "geometry"],
  });

  mapsLoaderPromise = loader
    .load()
    .then((google) => {
      googleMapsInstance = google;
      return google;
    })
    .catch((err) => {
      mapsLoaderPromise = null;
      console.error("Failed to load Google Maps SDK:", err);
      throw err;
    });

  return mapsLoaderPromise;
}

/**
 * Returns true if Google Maps API is already loaded in window
 */
export function isGoogleMapsLoaded() {
  return typeof window !== "undefined" && Boolean(window.google?.maps);
}
