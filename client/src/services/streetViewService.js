import { loadGoogleMaps } from "./mapsService";

let streetViewServiceInstance = null;

async function getStreetViewService() {
  const google = await loadGoogleMaps();
  if (!streetViewServiceInstance) {
    streetViewServiceInstance = new google.maps.StreetViewService();
  }
  return streetViewServiceInstance;
}

// Known coordinates in Mahakal Temple vicinity with frequent Street View coverage
const VICINITY_COORDINATES = [
  { lat: 23.1843, lng: 75.7691, name: "Bada Ganesh & Mahakal North Gate" },
  { lat: 23.1838, lng: 75.768, name: "Mahakal Temple Entrance Road" },
  { lat: 23.1821, lng: 75.7654, name: "Harsiddhi Mata Temple Marg" },
  { lat: 23.1865, lng: 75.7632, name: "Ram Ghat & Shipra River Banks" },
  { lat: 23.183, lng: 75.7675, name: "Mahakal Lok Approach Road" },
];

/**
 * Searches for real Google Street View panorama imagery near specific lat/lng coordinates.
 * Automatically expands search radius (100m -> 500m -> 1500m) and checks vicinity if needed.
 * @param {number} lat - Latitude
 * @param {number} lng - Longitude
 * @param {number} initialRadius - Initial search radius in meters (default 500m)
 * @returns {Promise<{ found: boolean, data?: object, status?: string }>}
 */
export async function getNearestPanorama(lat, lng, initialRadius = 500) {
  try {
    const google = await loadGoogleMaps();
    const service = await getStreetViewService();

    // Strategy 1: Expand search radii progressively (150m, 500m, 1500m)
    const radiiToTry = Array.from(new Set([150, initialRadius, 1000, 2000]));

    for (const radius of radiiToTry) {
      const res = await queryPanoAtLocation(service, google, lat, lng, radius);
      if (res.found) {
        return res;
      }
    }

    // Strategy 2: If central point has no coverage within 2km, test nearby vicinity points around Mahakal
    for (const point of VICINITY_COORDINATES) {
      const res = await queryPanoAtLocation(service, google, point.lat, point.lng, 500);
      if (res.found) {
        return {
          ...res,
          description: `${point.name} (${res.description})`,
        };
      }
    }

    return {
      found: false,
      status: "ZERO_RESULTS",
      lat,
      lng,
    };
  } catch (error) {
    console.error("Error in getNearestPanorama:", error);
    return { found: false, error: error.message };
  }
}

/**
 * Helper to query single location & radius via StreetViewService
 */
function queryPanoAtLocation(service, google, lat, lng, radius) {
  return new Promise((resolve) => {
    const request = {
      location: { lat: Number(lat), lng: Number(lng) },
      radius: radius,
      preference: google.maps.StreetViewPreference.NEAREST,
      source: google.maps.StreetViewSource.DEFAULT,
    };

    service.getPanorama(request, (data, status) => {
      if (status === google.maps.StreetViewStatus.OK && data) {
        resolve({
          found: true,
          status,
          panoId: data.location.pano,
          lat: data.location.latLng.lat(),
          lng: data.location.latLng.lng(),
          description:
            data.location.description ||
            data.location.shortDescription ||
            "Mahakal Temple Vicinity",
          links: data.links || [],
          raw: data,
        });
      } else {
        resolve({
          found: false,
          status,
          lat,
          lng,
        });
      }
    });
  });
}

/**
 * Retrieves panorama details by exact panorama ID
 * @param {string} panoId
 */
export async function getPanoramaById(panoId) {
  try {
    const google = await loadGoogleMaps();
    const service = await getStreetViewService();

    return new Promise((resolve) => {
      service.getPanorama({ pano: panoId }, (data, status) => {
        if (status === google.maps.StreetViewStatus.OK && data) {
          resolve({
            found: true,
            status,
            panoId: data.location.pano,
            lat: data.location.latLng.lat(),
            lng: data.location.latLng.lng(),
            description: data.location.description || "Mahakal Premises",
            links: data.links || [],
            raw: data,
          });
        } else {
          resolve({ found: false, status });
        }
      });
    });
  } catch (error) {
    console.error("Error in getPanoramaById:", error);
    return { found: false, error: error.message };
  }
}
