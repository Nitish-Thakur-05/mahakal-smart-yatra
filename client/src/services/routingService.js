import { loadGoogleMaps } from "./mapsService";

let directionsServiceInstance = null;

async function getDirectionsService() {
  const google = await loadGoogleMaps();
  if (!directionsServiceInstance) {
    directionsServiceInstance = new google.maps.DirectionsService();
  }
  return directionsServiceInstance;
}

/**
 * Calculates real walking or driving route using Google Maps Directions Service
 * @param {{ lat: number, lng: number }} origin
 * @param {{ lat: number, lng: number }} destination
 * @param {string} mode - 'WALKING' | 'DRIVING'
 * @returns {Promise<{ success: boolean, result?: object, distance?: string, duration?: string, error?: string }>}
 */
export async function calculateRoute(origin, destination, mode = "WALKING") {
  try {
    const google = await loadGoogleMaps();
    const service = await getDirectionsService();

    const travelMode =
      mode === "DRIVING"
        ? google.maps.TravelMode.DRIVING
        : google.maps.TravelMode.WALKING;

    const request = {
      origin: new google.maps.LatLng(origin.lat, origin.lng),
      destination: new google.maps.LatLng(destination.lat, destination.lng),
      travelMode,
    };

    return new Promise((resolve) => {
      service.route(request, (result, status) => {
        if (status === google.maps.DirectionsStatus.OK && result) {
          const leg = result.routes[0]?.legs[0];
          resolve({
            success: true,
            result,
            distance: leg?.distance?.text || "",
            duration: leg?.duration?.text || "",
            steps: leg?.steps || [],
          });
        } else {
          resolve({
            success: false,
            status,
            error: `Routing status: ${status}`,
          });
        }
      });
    });
  } catch (error) {
    console.error("Error in calculateRoute:", error);
    return { success: false, error: error.message };
  }
}
