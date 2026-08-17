import React, { useEffect, useRef, useState } from "react";
import * as THREE from "three";
import {
  Compass,
  Maximize,
  Minimize,
  ChevronLeft,
  ChevronRight,
  ZoomIn,
  ZoomOut,
  Eye,
  RotateCcw,
  MapPin,
  Sparkles,
} from "lucide-react";
import styles from "../Navigation.module.css";

// Seamless 2:1 Equirectangular 360° Panorama Locations for Shri Mahakaleshwar Temple
export const REAL_TEMPLE_LOCATIONS = [
  {
    id: "mahakal_main",
    name: "Shri Mahakaleshwar Main Temple & Spire 360°",
    nameHi: "श्री महाकालेश्वर मुख्य मंदिर एवं भव्य शिखर 360°",
    image: "/mahakal_360_panorama.png",
    lat: 23.183055,
    lng: 75.768222,
    desc: "Primary grand sanctum spire of Shri Mahakaleshwar Jyotirlinga, Ujjain.",
  },
  {
    id: "mahakal_lok",
    name: "Mahakal Lok 108 Shiva Corridor 360°",
    nameHi: "महाकाल लोक 108 शिव स्तंभ गलियारा 360°",
    image: "/mahakal_lok_360_panorama.png",
    lat: 23.1838,
    lng: 75.768,
    desc: "108 ornate carved Shiva pillars, lotus fountains & evening illumination promenade.",
  },
  {
    id: "koti_tirth",
    name: "Koti Tirth Kunda & Courtyard Shrines 360°",
    nameHi: "कोटि तीर्थ कुंड एवं मंदिर प्रांगण 360°",
    image: "/koti_tirth_360_panorama.png",
    lat: 23.18365,
    lng: 75.76865,
    desc: "Sacred holy water sarovar inside the temple inner courtyard surrounded by shrines.",
  },
  {
    id: "bada_ganesh",
    name: "Bada Ganesh Mandir & Gate 2 Plaza 360°",
    nameHi: "श्री बड़ा गणेश मंदिर एवं द्वार 2 प्लाजा 360°",
    image: "/bada_ganesh_360_panorama.png",
    lat: 23.1843,
    lng: 75.7691,
    desc: "18-foot colossal Ganesha shrine and northern entry plaza of Mahakal.",
  },
  {
    id: "ram_ghat",
    name: "Ram Ghat & Holy Shipra Riverfront 360°",
    nameHi: "रामघाट एवं शिप्रा नदी तट महाआरती 360°",
    image: "/ram_ghat_360_panorama.png",
    lat: 23.1865,
    lng: 75.7632,
    desc: "Ancient bathing ghat for holy Kshipra snan and evening 1008-lamp river Aarti.",
  },
];

export function Three360Viewer({
  selectedLocationName,
  onPanoramaChange,
  onPovChange,
}) {
  const containerRef = useRef(null);
  const canvasRef = useRef(null);

  const [currentIndex, setCurrentIndex] = useState(0);
  const [heading, setHeading] = useState(0);
  const [isFullscreen, setIsFullscreen] = useState(false);

  const isUserInteractingRef = useRef(false);
  const onPointerDownPointerXRef = useRef(0);
  const onPointerDownPointerYRef = useRef(0);
  const onPointerDownLonRef = useRef(0);
  const onPointerDownLatRef = useRef(0);
  const lonRef = useRef(0);
  const latRef = useRef(0);
  const fovRef = useRef(75);

  const sceneRef = useRef(null);
  const cameraRef = useRef(null);
  const rendererRef = useRef(null);
  const meshRef = useRef(null);
  const textureRef = useRef(null);

  const currentLoc = REAL_TEMPLE_LOCATIONS[currentIndex] || REAL_TEMPLE_LOCATIONS[0];

  // Synchronize index when external landmark is selected
  useEffect(() => {
    if (!selectedLocationName) return;
    const matchIdx = REAL_TEMPLE_LOCATIONS.findIndex((loc) =>
      loc.name.toLowerCase().includes(selectedLocationName.toLowerCase()) ||
      selectedLocationName.toLowerCase().includes(loc.name.toLowerCase()) ||
      loc.id === selectedLocationName
    );
    if (matchIdx !== -1 && matchIdx !== currentIndex) {
      setCurrentIndex(matchIdx);
    }
  }, [selectedLocationName]);

  // Main Three.js 360° Photo Sphere Scene Setup & Texture Load
  useEffect(() => {
    if (!canvasRef.current || !containerRef.current) return;

    const width = containerRef.current.clientWidth || window.innerWidth;
    const height = containerRef.current.clientHeight || 500;

    // 1. Scene
    const scene = new THREE.Scene();
    sceneRef.current = scene;

    // 2. Camera
    const camera = new THREE.PerspectiveCamera(fovRef.current, width / height, 1, 1100);
    camera.target = new THREE.Vector3(0, 0, 0);
    cameraRef.current = camera;

    // 3. 3D Sphere Geometry for 360 equirectangular projection
    const geometry = new THREE.SphereGeometry(500, 60, 40);
    geometry.scale(-1, 1, 1);

    // 4. Texture Loader with 2:1 Equirectangular 360° Image
    const textureLoader = new THREE.TextureLoader();
    const texture = textureLoader.load(currentLoc.image, () => {
      if (rendererRef.current && sceneRef.current && cameraRef.current) {
        rendererRef.current.render(sceneRef.current, cameraRef.current);
      }
    });
    textureRef.current = texture;
    const material = new THREE.MeshBasicMaterial({ map: texture });

    const mesh = new THREE.Mesh(geometry, material);
    scene.add(mesh);
    meshRef.current = mesh;

    // 5. WebGL Renderer
    const renderer = new THREE.WebGLRenderer({
      canvas: canvasRef.current,
      antialias: true,
    });
    renderer.setPixelRatio(window.devicePixelRatio);
    renderer.setSize(width, height);
    rendererRef.current = renderer;

    // Pointer Drag Listeners for smooth 360 rotation
    const onPointerDown = (event) => {
      isUserInteractingRef.current = true;
      const clientX = event.clientX || (event.touches && event.touches[0].clientX);
      const clientY = event.clientY || (event.touches && event.touches[0].clientY);
      onPointerDownPointerXRef.current = clientX;
      onPointerDownPointerYRef.current = clientY;
      onPointerDownLonRef.current = lonRef.current;
      onPointerDownLatRef.current = latRef.current;
    };

    const onPointerMove = (event) => {
      if (!isUserInteractingRef.current) return;
      const clientX = event.clientX || (event.touches && event.touches[0].clientX);
      const clientY = event.clientY || (event.touches && event.touches[0].clientY);
      lonRef.current =
        (onPointerDownPointerXRef.current - clientX) * 0.15 +
        onPointerDownLonRef.current;
      latRef.current =
        (clientY - onPointerDownPointerYRef.current) * 0.15 +
        onPointerDownLatRef.current;
    };

    const onPointerUp = () => {
      isUserInteractingRef.current = false;
    };

    const onWheel = (event) => {
      fovRef.current += event.deltaY * 0.05;
      fovRef.current = Math.max(30, Math.min(100, fovRef.current));
      if (cameraRef.current) {
        cameraRef.current.fov = fovRef.current;
        cameraRef.current.updateProjectionMatrix();
      }
    };

    const domElement = containerRef.current;
    domElement.addEventListener("pointerdown", onPointerDown);
    domElement.addEventListener("pointermove", onPointerMove);
    domElement.addEventListener("pointerup", onPointerUp);
    domElement.addEventListener("wheel", onWheel, { passive: true });

    // Handle Resize
    const handleResize = () => {
      if (!containerRef.current || !rendererRef.current || !cameraRef.current)
        return;
      const w = containerRef.current.clientWidth;
      const h = containerRef.current.clientHeight;
      cameraRef.current.aspect = w / h;
      cameraRef.current.updateProjectionMatrix();
      rendererRef.current.setSize(w, h);
    };
    window.addEventListener("resize", handleResize);

    // Animation Render Loop
    let animationFrameId;
    const animate = () => {
      animationFrameId = requestAnimationFrame(animate);

      latRef.current = Math.max(-85, Math.min(85, latRef.current));
      const phi = THREE.MathUtils.degToRad(90 - latRef.current);
      const theta = THREE.MathUtils.degToRad(lonRef.current);

      const targetX = 500 * Math.sin(phi) * Math.cos(theta);
      const targetY = 500 * Math.cos(phi);
      const targetZ = 500 * Math.sin(phi) * Math.sin(theta);

      if (cameraRef.current) {
        cameraRef.current.lookAt(targetX, targetY, targetZ);
        rendererRef.current.render(sceneRef.current, cameraRef.current);
      }

      // Sync Compass Heading Angle
      const normalizedHeading = Math.round(((lonRef.current % 360) + 360) % 360);
      setHeading(normalizedHeading);
      if (onPovChange) {
        onPovChange({ heading: normalizedHeading, pitch: latRef.current });
      }
    };
    animate();

    // Notify Parent Component of Position & Location Update
    if (onPanoramaChange) {
      onPanoramaChange({
        lat: currentLoc.lat,
        lng: currentLoc.lng,
        name: currentLoc.name,
      });
    }

    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener("resize", handleResize);
      domElement.removeEventListener("pointerdown", onPointerDown);
      domElement.removeEventListener("pointermove", onPointerMove);
      domElement.removeEventListener("pointerup", onPointerUp);
      domElement.removeEventListener("wheel", onWheel);
      if (rendererRef.current) rendererRef.current.dispose();
      if (geometry) geometry.dispose();
      if (material) material.dispose();
      if (texture) texture.dispose();
    };
  }, [currentIndex]);

  // Navigate to Next 360° Location
  const handleNextSpot = () => {
    const nextIdx = (currentIndex + 1) % REAL_TEMPLE_LOCATIONS.length;
    setCurrentIndex(nextIdx);
    const loc = REAL_TEMPLE_LOCATIONS[nextIdx];
    if (onPanoramaChange) {
      onPanoramaChange({
        lat: loc.lat,
        lng: loc.lng,
        name: loc.name,
      });
    }
  };

  // Navigate to Previous 360° Location
  const handlePrevSpot = () => {
    const prevIdx =
      (currentIndex - 1 + REAL_TEMPLE_LOCATIONS.length) %
      REAL_TEMPLE_LOCATIONS.length;
    setCurrentIndex(prevIdx);
    const loc = REAL_TEMPLE_LOCATIONS[prevIdx];
    if (onPanoramaChange) {
      onPanoramaChange({
        lat: loc.lat,
        lng: loc.lng,
        name: loc.name,
      });
    }
  };

  const handleResetHeading = () => {
    lonRef.current = 0;
    latRef.current = 0;
    fovRef.current = 75;
    if (cameraRef.current) {
      cameraRef.current.fov = 75;
      cameraRef.current.updateProjectionMatrix();
    }
  };

  const handleZoomIn = () => {
    fovRef.current = Math.max(30, fovRef.current - 15);
    if (cameraRef.current) {
      cameraRef.current.fov = fovRef.current;
      cameraRef.current.updateProjectionMatrix();
    }
  };

  const handleZoomOut = () => {
    fovRef.current = Math.min(100, fovRef.current + 15);
    if (cameraRef.current) {
      cameraRef.current.fov = fovRef.current;
      cameraRef.current.updateProjectionMatrix();
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
      className="w-100 h-100 position-relative overflow-hidden user-select-none"
      style={{ backgroundColor: "#000000", cursor: "grab" }}
    >
      <canvas ref={canvasRef} className="w-100 h-100 d-block" />

      {/* Top Header Controls Overlay */}
      <div className={styles.overlayTop}>
        <div className="d-flex align-items-center gap-2">
          <div className={`${styles.glassCard} px-3 py-2 d-flex align-items-center gap-2`}>
            <span className="badge bg-warning bg-opacity-20 text-warning border border-warning border-opacity-40 rounded-circle p-1.5 d-flex align-items-center justify-content-center">
              <Eye size={15} />
            </span>
            <div>
              <div className="text-white fw-bold small leading-none mb-0.5">
                {currentLoc.name}
              </div>
              <div className="text-warning small font-semibold" style={{ fontSize: "0.74rem" }}>
                {currentLoc.nameHi}
              </div>
            </div>
          </div>
        </div>

        {/* Heading Compass & Fullscreen Button */}
        <div className="d-flex align-items-center gap-2">
          <button
            onClick={handleResetHeading}
            className={styles.compassWidget}
            title="Reset Orientation Heading to North"
            style={{ transform: `rotate(${-heading}deg)` }}
          >
            <Compass size={22} />
          </button>

          <button
            onClick={toggleFullscreen}
            className={styles.compassWidget}
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
          className={styles.compassWidget}
          title="Zoom In"
        >
          <ZoomIn size={18} />
        </button>
        <button
          onClick={handleZoomOut}
          className={styles.compassWidget}
          title="Zoom Out"
        >
          <ZoomOut size={18} />
        </button>
      </div>

      {/* Linked Location Navigation Controls Overlay Bar */}
      <div className={styles.overlayBottom}>
        <button
          onClick={handlePrevSpot}
          className={`btn btn-sm rounded-pill px-3 py-1.5 d-inline-flex align-items-center gap-1.5 font-semibold ${styles.gateBtn}`}
          style={{ fontSize: "0.82rem" }}
          title="Navigate to Previous 360° Location"
        >
          <ChevronLeft size={16} /> Prev 360° Spot
        </button>

        <div className="d-flex flex-column align-items-center px-2">
          <span
            className="fw-bold leading-none mb-0.5 text-body"
            style={{ fontSize: "0.82rem" }}
          >
            360° Location {currentIndex + 1} of {REAL_TEMPLE_LOCATIONS.length}
          </span>
          <small
            className="font-monospace text-uppercase"
            style={{ fontSize: "0.66rem", color: "#f59e0b", fontWeight: "bold" }}
          >
            Equirectangular 360° View
          </small>
        </div>

        <button
          onClick={handleNextSpot}
          className={`btn btn-sm rounded-pill px-3 py-1.5 d-inline-flex align-items-center gap-1.5 font-bold shadow-sm ${styles.gateBtnSelected}`}
          style={{ fontSize: "0.82rem" }}
          title="Navigate to Next 360° Location"
        >
          Next 360° Spot <ChevronRight size={16} />
        </button>
      </div>
    </div>
  );
}
