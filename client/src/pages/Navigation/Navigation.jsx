import React, { useState, useEffect, useCallback } from "react";
import { toast } from "react-hot-toast";
import { getNearestPanorama } from "../../services/streetViewService";
import { calculateRoute } from "../../services/routingService";
import { PanoramaViewer } from "./components/PanoramaViewer";
import { Three360Viewer } from "./components/Three360Viewer";
import { TempleMap } from "./components/TempleMap";
import { NavigationControls } from "./components/NavigationControls";
import { LocationPanel } from "./components/LocationPanel";
import { NoCoverage } from "./components/NoCoverage";
import { AlertCircle, Compass, MapPin, Footprints, Info } from "lucide-react";
import styles from "./Navigation.module.css";

// Shri Mahakaleshwar Temple, Ujjain Coordinates
const MAHALAK_TEMPLE_COORDS = {
  lat: 23.183055,
  lng: 75.768222,
  name: "Shri Mahakaleshwar Jyotirlinga Main Plaza",
};

export function Navigation() {
  const [currentPos, setCurrentPos] = useState(MAHALAK_TEMPLE_COORDS);
  const [heading, setHeading] = useState(0);
  const [userLocation, setUserLocation] = useState(null);
  const [isUserLocating, setIsUserLocating] = useState(false);
  const [activeLandmark, setActiveLandmark] = useState(null);
  const [routeResult, setRouteResult] = useState(null);

  const [isLoading360, setIsLoading360] = useState(true);
  const [hasNoCoverage, setHasNoCoverage] = useState(false);

  const [isMapOpenMobile, setIsMapOpenMobile] = useState(true);
  const [showDrawer, setShowDrawer] = useState(false);

  const apiKey = import.meta.env.VITE_GOOGLE_MAPS_API_KEY;
  const isKeyPlaceholder =
    !apiKey || apiKey === "AIzaSy_demo_google_maps_key_placeholder";

  // Handle panorama state update from StreetViewPanorama or Three360Viewer
  const handlePanoramaChange = useCallback((panoData) => {
    if (!panoData || !panoData.lat) return;
    setCurrentPos((prev) => {
      // Guard against infinite loop if coordinates are virtually unchanged
      if (
        Math.abs(prev.lat - panoData.lat) < 0.00005 &&
        Math.abs(prev.lng - panoData.lng) < 0.00005
      ) {
        return prev;
      }
      return {
        ...prev,
        lat: panoData.lat,
        lng: panoData.lng,
        panoId: panoData.panoId || prev.panoId,
        name: panoData.name || prev.name,
      };
    });
  }, []);

  // Handle POV heading change
  const handlePovChange = useCallback((povData) => {
    setHeading(povData.heading || 0);
  }, []);

  // Select a location/landmark and query real 360° coverage
  const handleSelectLocation = useCallback(async (lat, lng, name) => {
    setIsLoading360(true);
    setHasNoCoverage(false);

    // Query nearest real panorama with radius expansion
    const res = await getNearestPanorama(lat, lng, 1000);

    if (res.found) {
      setCurrentPos({
        lat: res.lat,
        lng: res.lng,
        panoId: res.panoId,
        name: name || res.description || "Mahakal Temple Vicinity",
      });
      setIsLoading360(false);
      setHasNoCoverage(false);
    } else {
      setIsLoading360(false);
      setHasNoCoverage(true);
      setCurrentPos({ lat, lng, name: name || "Selected Location" });
    }
  }, []);

  // Initial load: Snap to nearest available 360° Street View location near Mahakal
  useEffect(() => {
    handleSelectLocation(
      MAHALAK_TEMPLE_COORDS.lat,
      MAHALAK_TEMPLE_COORDS.lng,
      MAHALAK_TEMPLE_COORDS.name
    );
  }, []);

  // Select landmark from map or list
  const handleSelectLandmark = useCallback(
    (landmark, lat, lng) => {
      setActiveLandmark(landmark);
      handleSelectLocation(lat, lng, landmark.name);
    },
    [handleSelectLocation]
  );

  // Reset to Mahakaleshwar Main Plaza
  const handleResetToTemple = useCallback(() => {
    setActiveLandmark(null);
    setRouteResult(null);
    handleSelectLocation(
      MAHALAK_TEMPLE_COORDS.lat,
      MAHALAK_TEMPLE_COORDS.lng,
      MAHALAK_TEMPLE_COORDS.name
    );
  }, [handleSelectLocation]);

  // Request browser GPS Geolocation
  const handleLocateUser = useCallback(() => {
    if (!navigator.geolocation) {
      toast.error("Geolocation is not supported by your browser.");
      return;
    }

    setIsUserLocating(true);
    toast.loading("Fetching your GPS coordinates...", { id: "gps" });

    navigator.geolocation.getCurrentPosition(
      async (pos) => {
        setIsUserLocating(false);
        toast.dismiss("gps");
        const uLat = pos.coords.latitude;
        const uLng = pos.coords.longitude;
        setUserLocation({ lat: uLat, lng: uLng });
        toast.success("GPS location found! Searching nearest 360° spot...");

        handleSelectLocation(uLat, uLng, "Your Location");
      },
      (error) => {
        setIsUserLocating(false);
        toast.dismiss("gps");
        console.warn("Geolocation permission denied or error:", error);
        toast.error(
          "Location access was denied or unavailable. Starting from Mahakal Temple."
        );
      },
      { enableHighAccuracy: true, timeout: 10000 }
    );
  }, [handleSelectLocation]);

  // Calculate real directions route
  const handleCalculateRoute = useCallback(
    async (destLat, destLng, destName) => {
      const origin = userLocation || {
        lat: currentPos.lat,
        lng: currentPos.lng,
      };
      const destination = { lat: destLat, lng: destLng };

      toast.loading(`Calculating route to ${destName}...`, { id: "route" });
      const res = await calculateRoute(origin, destination, "WALKING");
      toast.dismiss("route");

      if (res.success) {
        setRouteResult(res.result);
        toast.success(
          `Route to ${destName}: ${res.distance} (${res.duration} walk)`
        );
      } else {
        toast.error("Unable to calculate route directions.");
      }
    },
    [userLocation, currentPos]
  );

  return (
    <div className={styles.navPageWrapper}>
      {/* Missing/Placeholder API Key Guidance Warning Banner */}
      {isKeyPlaceholder && (
        <div className="container max-w-7xl mx-auto mb-3">
          <div className="bg-warning bg-opacity-15 border border-warning border-opacity-30 p-2.5 rounded-3 text-center text-warning small fw-semibold d-flex align-items-center justify-content-center gap-2">
            <AlertCircle size={16} />
            <span>
              <strong>Note:</strong> Google Maps API key is using a placeholder in <code className="text-white">client/.env</code>. Set <code className="text-white">VITE_GOOGLE_MAPS_API_KEY</code> for live street view rendering.
            </span>
          </div>
        </div>
      )}

      <div className="container max-w-7xl mx-auto px-3 px-md-4">
        {/* Minimal Page Header */}
        <NavigationControls
          currentLocationName={currentPos.name}
          isMapOpen={isMapOpenMobile}
          onToggleMap={() => {
            if (!isMapOpenMobile) {
              setIsMapOpenMobile(true);
            }
            setTimeout(() => {
              document.getElementById("temple-map-section")?.scrollIntoView({ behavior: "smooth" });
            }, 50);
          }}
          onOpenLandmarks={() => setShowDrawer(!showDrawer)}
        />
      </div>

      {/* Widescreen 100vw 360° Hero Viewer Section */}
      <div className={styles.heroViewerSection}>
        {/* Loading Indicator Overlay */}
        {isLoading360 && (
          <div className={styles.loaderOverlay}>
            <div className="spinner-border text-warning mb-3" role="status" style={{ width: "3rem", height: "3rem" }}>
              <span className="visually-hidden">Loading...</span>
            </div>
            <h3 className="h5 fw-bold text-white mb-1">
              Loading 360° Experience...
            </h3>
            <p className="text-secondary small mb-0 font-monospace">
              Shri Mahakaleshwar Temple Virtual Tour
            </p>
          </div>
        )}

        {/* 360° Viewer rendering: Live Street View or Real Temple 360 Viewer */}
        {hasNoCoverage ? (
          <Three360Viewer
            selectedLocationName={currentPos.name}
            onPanoramaChange={handlePanoramaChange}
            onPovChange={handlePovChange}
          />
        ) : (
          <PanoramaViewer
            location={{
              lat: currentPos.lat,
              lng: currentPos.lng,
              panoId: currentPos.panoId,
            }}
            onPanoramaChange={handlePanoramaChange}
            onPovChange={handlePovChange}
            onNoCoverage={() => setHasNoCoverage(true)}
            onLoadingStateChange={(loading) => setIsLoading360(loading)}
          />
        )}

        {/* Slide-over Landmark Directory Drawer */}
        {showDrawer && (
          <div className={styles.landmarkDrawer}>
            <LocationPanel
              onSelectLandmark={(landmark, lat, lng) => {
                handleSelectLandmark(landmark, lat, lng);
                setShowDrawer(false);
              }}
              onCalculateRoute={handleCalculateRoute}
              activeLandmark={activeLandmark}
              onClose={() => setShowDrawer(false)}
            />
          </div>
        )}
      </div>

      {/* Integrated Interactive 2D Map Section */}
      {isMapOpenMobile && (
        <div id="temple-map-section" className="container max-w-7xl mx-auto px-3 px-md-4 pt-3">
          <div className="d-flex align-items-center justify-content-between mb-2">
            <h3 className="h5 fw-bold text-white mb-0 font-playfair">
              Interactive 2D Temple Map & Gates
            </h3>
            <span className="text-warning small font-monospace">
              Synchronized 360° Heading & Pins
            </span>
          </div>
          <div className={styles.mapSection}>
            <TempleMap
              currentPos={currentPos}
              heading={heading}
              userLocation={userLocation}
              activeLandmark={activeLandmark}
              routeResult={routeResult}
              onSelectLandmark={handleSelectLandmark}
            />
          </div>
        </div>
      )}
    </div>
  );
}
export default Navigation;
