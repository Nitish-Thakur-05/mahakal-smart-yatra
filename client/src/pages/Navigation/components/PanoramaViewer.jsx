import React, { useEffect, useRef, useState, useCallback } from "react";
import { loadGoogleMaps } from "../../../services/mapsService";
import {
  Compass,
  Maximize,
  Minimize,
  RotateCcw,
  ChevronLeft,
  ChevronRight,
  ZoomIn,
  ZoomOut,
  MapPin,
  Eye,
} from "lucide-react";
import styles from "../Navigation.module.css";

export function PanoramaViewer({
  location,
  onPanoramaChange,
  onPovChange,
  onNoCoverage,
  onLoadingStateChange,
}) {
  const containerRef = useRef(null);
  const panoDomRef = useRef(null);
  const panoramaRef = useRef(null);
  const listenersRef = useRef([]);

  const [heading, setHeading] = useState(0);
  const [pitch, setPitch] = useState(0);
  const [zoom, setZoom] = useState(1);
  const [panoId, setPanoId] = useState("");
  const [links, setLinks] = useState([]);
  const [locationName, setLocationName] = useState("");
  const [isFullscreen, setIsFullscreen] = useState(false);

  // Clear existing listeners
  const clearListeners = () => {
    listenersRef.current.forEach((listener) => {
      if (listener && listener.remove) listener.remove();
    });
    listenersRef.current = [];
  };

  const lastKeyRef = useRef("");

  // Initialize or update Street View Panorama
  useEffect(() => {
    let isMounted = true;
    const currentKey = `${location.panoId || ""}_${location.lat?.toFixed(4)}_${location.lng?.toFixed(4)}`;

    if (lastKeyRef.current === currentKey && panoramaRef.current) {
      return;
    }
    lastKeyRef.current = currentKey;

    async function initPanorama() {
      if (!panoDomRef.current) return;
      onLoadingStateChange(true);

      try {
        const google = await loadGoogleMaps();
        if (!isMounted) return;

        const options = {
          pov: { heading: 0, pitch: 0 },
          zoom: 1,
          radius: 1000, // Snap to nearest Street View node within 1000m
          addressControl: false,
          showRoadNames: true,
          zoomControl: false,
          fullscreenControl: false,
          motionTrackingControl: false,
          linksControl: true,
          panControl: true,
        };

        if (location.panoId) {
          options.pano = location.panoId;
        } else {
          options.position = { lat: location.lat, lng: location.lng };
        }

        if (!panoramaRef.current) {
          panoramaRef.current = new google.maps.StreetViewPanorama(
            panoDomRef.current,
            options
          );
        } else {
          if (location.panoId) {
            panoramaRef.current.setPano(location.panoId);
          } else {
            panoramaRef.current.setPosition({
              lat: location.lat,
              lng: location.lng,
            });
          }
        }

        const pano = panoramaRef.current;
        clearListeners();

        // Status changed listener
        const statusListener = google.maps.event.addListener(
          pano,
          "status_changed",
          () => {
            const status = pano.getStatus();
            if (status === google.maps.StreetViewStatus.OK) {
              onLoadingStateChange(false);
            } else {
              console.warn("StreetView status:", status);
              onLoadingStateChange(false);
              onNoCoverage(true);
            }
          }
        );

        // Position changed listener
        const posListener = google.maps.event.addListener(
          pano,
          "position_changed",
          () => {
            const pos = pano.getPosition();
            if (pos) {
              const curLat = pos.lat();
              const curLng = pos.lng();
              const curPanoId = pano.getPano();
              setPanoId(curPanoId);

              const locData = pano.getLocation();
              const name =
                locData?.description ||
                locData?.shortDescription ||
                "Shri Mahakaleshwar Premises";
              setLocationName(name);

              onPanoramaChange({
                lat: curLat,
                lng: curLng,
                panoId: curPanoId,
                name,
              });
            }
          }
        );

        // POV (heading & pitch) changed listener
        const povListener = google.maps.event.addListener(
          pano,
          "pov_changed",
          () => {
            const pov = pano.getPov();
            setHeading(pov.heading || 0);
            setPitch(pov.pitch || 0);
            setZoom(pano.getZoom() || 1);
            onPovChange({ heading: pov.heading || 0, pitch: pov.pitch || 0 });
          }
        );

        // Links changed listener (connected 360° positions)
        const linksListener = google.maps.event.addListener(
          pano,
          "links_changed",
          () => {
            const connectedLinks = pano.getLinks() || [];
            setLinks(connectedLinks);
          }
        );

        listenersRef.current = [
          statusListener,
          posListener,
          povListener,
          linksListener,
        ];
      } catch (err) {
        console.error("Error setting up StreetViewPanorama:", err);
        if (isMounted) {
          onLoadingStateChange(false);
          onNoCoverage(true);
        }
      }
    }

    initPanorama();

    return () => {
      isMounted = false;
    };
  }, [location.lat, location.lng, location.panoId]);

  // Clean up on unmount
  useEffect(() => {
    return () => {
      clearListeners();
    };
  }, []);

  // Controls Handlers
  const handleZoomIn = () => {
    if (panoramaRef.current) {
      const curZoom = panoramaRef.current.getZoom() || 1;
      panoramaRef.current.setZoom(Math.min(curZoom + 1, 4));
    }
  };

  const handleZoomOut = () => {
    if (panoramaRef.current) {
      const curZoom = panoramaRef.current.getZoom() || 1;
      panoramaRef.current.setZoom(Math.max(curZoom - 1, 0));
    }
  };

  const handleResetHeading = () => {
    if (panoramaRef.current) {
      panoramaRef.current.setPov({ heading: 0, pitch: 0 });
    }
  };

  const handleNextPanoLink = (direction) => {
    if (!links || links.length === 0 || !panoramaRef.current) return;
    if (direction === "next") {
      const target = links[0];
      if (target?.pano) panoramaRef.current.setPano(target.pano);
    } else {
      const target = links[links.length - 1];
      if (target?.pano) panoramaRef.current.setPano(target.pano);
    }
  };

  const toggleFullscreen = () => {
    if (!containerRef.current) return;
    if (!document.fullscreenElement) {
      containerRef.current.requestFullscreen().catch(() => {});
      setIsFullscreen(true);
    } else {
      document.exitFullscreen().catch(() => {});
      setIsFullscreen(false);
    }
  };

  return (
    <div
      ref={containerRef}
      className="w-100 h-100 position-relative overflow-hidden"
      style={{ backgroundColor: "#000000" }}
    >
      {/* 360 View DOM Container */}
      <div ref={panoDomRef} className="w-100 h-100" />

      {/* Glassmorphic Overlay Header Controls */}
      <div className={styles.overlayTop}>
        <div className="d-flex align-items-center gap-2">
          <div className={`${styles.glassCard} px-3 py-2 d-flex align-items-center gap-2`}>
            <span className="badge bg-warning bg-opacity-20 text-warning border border-warning border-opacity-40 rounded-circle p-1.5 d-flex align-items-center justify-content-center">
              <Eye size={15} />
            </span>
            <div>
              <div className="text-white fw-bold small leading-none mb-0.5">
                {locationName || "Mahakal Temple Premises"}
              </div>
              <small className="text-warning text-uppercase font-monospace" style={{ fontSize: "0.68rem" }}>
                360° Real Street View
              </small>
            </div>
          </div>
        </div>

        {/* Heading Compass & Fullscreen Button */}
        <div className="d-flex align-items-center gap-2">
          <button
            onClick={handleResetHeading}
            className={styles.compassWidget}
            title="Reset Compass Heading to North"
            style={{ transform: `rotate(${-heading}deg)` }}
          >
            <Compass size={22} />
          </button>

          <button
            onClick={toggleFullscreen}
            className="btn btn-outline-warning btn-sm rounded-circle p-0 d-flex align-items-center justify-content-center shadow-md"
            style={{ width: "42px", height: "42px", backdropFilter: "blur(12px)", backgroundColor: "rgba(18, 18, 26, 0.85)" }}
            title={isFullscreen ? "Exit Fullscreen" : "Fullscreen 360° View"}
          >
            {isFullscreen ? <Minimize size={18} /> : <Maximize size={18} />}
          </button>
        </div>
      </div>

      {/* Zoom Control Sidebar Overlay */}
      <div
        className="position-absolute end-0 top-50 translate-middle-y me-3 d-flex flex-column gap-2 z-3"
        style={{ pointerEvents: "auto" }}
      >
        <button
          onClick={handleZoomIn}
          className="btn btn-dark btn-sm text-warning rounded-circle p-0 d-flex align-items-center justify-content-center shadow-lg border border-warning border-opacity-30"
          style={{ width: "38px", height: "38px", backdropFilter: "blur(12px)", backgroundColor: "rgba(12, 12, 18, 0.88)" }}
          title="Zoom In"
        >
          <ZoomIn size={18} />
        </button>
        <button
          onClick={handleZoomOut}
          className="btn btn-dark btn-sm text-warning rounded-circle p-0 d-flex align-items-center justify-content-center shadow-lg border border-warning border-opacity-30"
          style={{ width: "38px", height: "38px", backdropFilter: "blur(12px)", backgroundColor: "rgba(12, 12, 18, 0.88)" }}
          title="Zoom Out"
        >
          <ZoomOut size={18} />
        </button>
      </div>

      {/* Linked Panorama Navigation Overlay Bar */}
      {links.length > 0 && (
        <div className={styles.overlayBottom}>
          <button
            onClick={() => handleNextPanoLink("prev")}
            className="btn btn-outline-warning btn-sm rounded-pill px-3 py-1 d-inline-flex align-items-center gap-1 font-semibold"
            style={{ fontSize: "0.8rem" }}
            title="Step to Previous Connected 360° Position"
          >
            <ChevronLeft size={16} /> Prev Spot
          </button>

          <span className="text-light small px-2 font-mono" style={{ fontSize: "0.78rem" }}>
            {links.length} Connected {links.length === 1 ? "Path" : "Paths"}
          </span>

          <button
            onClick={() => handleNextPanoLink("next")}
            className="btn btn-warning btn-sm text-dark rounded-pill px-3 py-1 d-inline-flex align-items-center gap-1 font-bold shadow-sm"
            style={{ fontSize: "0.8rem" }}
            title="Step to Next Connected 360° Position"
          >
            Next Spot <ChevronRight size={16} />
          </button>
        </div>
      )}
    </div>
  );
}
