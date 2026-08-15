import React, { useState, useRef, useEffect } from 'react';
import { Compass, ZoomIn, ZoomOut, Maximize2, Minimize2, Volume2, VolumeX, Sparkles, MapPin, RotateCcw } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import * as THREE from 'three';
import styles from '../styles/custom.module.css';

const TEMPLE_360_DATA = {
  "shri-mahakaleshwar": {
    name: "Shri Mahakaleshwar Jyotirlinga",
    hindiName: "श्री महाकालेश्वर ज्योतिर्लिंग",
    panoramaImage: "https://images.unsplash.com/photo-1627894006596-9b057508007a?auto=format&fit=crop&q=80&w=2000",
    hotspots: [
      { id: "h1", x: 45, y: 55, title: "Dakshinamukhi Lingam", desc: "The only south-facing Jyotirlinga in India, symbolizing mastery over time and death." },
      { id: "h2", x: 75, y: 40, title: "Nandi Hall", desc: "Spacious assembly hall where thousands gather for Bhasma Aarti." },
      { id: "h3", x: 25, y: 48, title: "Silver Sanctum Gate", desc: "Sacred embossed silver doors crafted with Shiv-Parvati wedding scenes." }
    ]
  },
  "kal-bhairav": {
    name: "Kal Bhairav Temple",
    hindiName: "काल भैरव मंदिर",
    panoramaImage: "https://images.unsplash.com/photo-1582510003544-4d00b7f74220?auto=format&fit=crop&q=80&w=2000",
    hotspots: [
      { id: "h1", x: 50, y: 50, title: "Kal Bhairav Altar", desc: "Ancient sanctum where liquor offerings are poured into the deity's lips." },
      { id: "h2", x: 80, y: 60, title: "Shipra River Lookout", desc: "Panoramic view overlooking the holy Shipra River banks." }
    ]
  },
  "harsiddhi-mata": {
    name: "Harsiddhi Mata Temple",
    hindiName: "हरसिद्धि माता शक्तिपीठ",
    panoramaImage: "https://images.unsplash.com/photo-1567157577867-05ccb1388e66?auto=format&fit=crop&q=80&w=2000",
    hotspots: [
      { id: "h1", x: 35, y: 35, title: "Deepstambha (51 Feet Lamp Tower)", desc: "13th-century twin stone towers holding 1,008 oil lamps." },
      { id: "h2", x: 65, y: 52, title: "Shaktipeeth Sanctum", desc: "Spot where Goddess Sati's elbow fell, establishing Avantika Shaktipeeth." }
    ]
  },
  "chintaman-ganesh": {
    name: "Chintaman Ganesh Temple",
    hindiName: "चिंतामण गणेश मंदिर",
    panoramaImage: "https://images.unsplash.com/photo-1567591370504-20b1e428cf11?auto=format&fit=crop&q=80&w=2000",
    hotspots: [
      { id: "h1", x: 50, y: 52, title: "Swayambhu Ganesha Idol", desc: "Self-manifested trio representation of Chintaman, Icchaman, and Siddhiman Ganesha." }
    ]
  },
  "mangalnath-temple": {
    name: "Mangalnath Temple",
    hindiName: "मंगलनाथ मंदिर",
    panoramaImage: "https://images.unsplash.com/photo-1518709268805-4e9042af9f23?auto=format&fit=crop&q=80&w=2000",
    hotspots: [
      { id: "h1", x: 50, y: 48, title: "Planet Mars Birth Altar", desc: "The astrological zero meridian origin point of Mars (Mangal) in Vedic geography." }
    ]
  },
  "sandipani-ashram": {
    name: "Maharshi Sandipani Ashram",
    hindiName: "महर्षि सांदीपनि आश्रम",
    panoramaImage: "https://images.unsplash.com/photo-1544735716-392fe2489ffa?auto=format&fit=crop&q=80&w=2000",
    hotspots: [
      { id: "h1", x: 40, y: 55, title: "Gomti Kund Tank", desc: "Historic water Kund created by Lord Krishna during his Gurukul studies." }
    ]
  }
};

export function Temple360Viewer({ templeId = "shri-mahakaleshwar", onClose }) {
  const [currentId, setCurrentId] = useState(templeId);
  const [activeHotspot, setActiveHotspot] = useState(null);
  const [isPlayingAudio, setIsPlayingAudio] = useState(true);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [headingDegrees, setHeadingDegrees] = useState(0);

  const mountRef = useRef(null);
  const currentData = TEMPLE_360_DATA[currentId] || TEMPLE_360_DATA["shri-mahakaleshwar"];

  // Three.js Scene Refs
  const isUserInteractingRef = useRef(false);
  const onPointerDownPointerXRef = useRef(0);
  const onPointerDownPointerYRef = useRef(0);
  const lonRef = useRef(0);
  const onPointerDownLonRef = useRef(0);
  const latRef = useRef(0);
  const onPointerDownLatRef = useRef(0);
  const cameraRef = useRef(null);

  useEffect(() => {
    if (templeId && TEMPLE_360_DATA[templeId]) {
      setCurrentId(templeId);
    }
  }, [templeId]);

  // Three.js WebGL 3D Sphere Renderer Setup
  useEffect(() => {
    const container = mountRef.current;
    if (!container) return;

    const width = container.clientWidth;
    const height = container.clientHeight;

    // Scene & Camera
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(75, width / height, 1, 1100);
    camera.target = new THREE.Vector3(0, 0, 0);
    cameraRef.current = camera;

    // WebGL Renderer
    const renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    container.innerHTML = '';
    container.appendChild(renderer.domElement);

    // Inverted 3D Sphere Geometry for Panorama
    const geometry = new THREE.SphereGeometry(500, 60, 40);
    geometry.scale(-1, 1, 1);

    // Texture Loader
    const textureLoader = new THREE.TextureLoader();
    const texture = textureLoader.load(currentData.panoramaImage);
    texture.colorSpace = THREE.SRGBColorSpace;

    const material = new THREE.MeshBasicMaterial({ map: texture });
    const mesh = new THREE.Mesh(geometry, material);
    scene.add(mesh);

    // Animation Loop
    let animationFrameId;
    const animate = () => {
      animationFrameId = requestAnimationFrame(animate);

      latRef.current = Math.max(-85, Math.min(85, latRef.current));
      const phi = THREE.MathUtils.degToRad(90 - latRef.current);
      const theta = THREE.MathUtils.degToRad(lonRef.current);

      camera.target.x = 500 * Math.sin(phi) * Math.cos(theta);
      camera.target.y = 500 * Math.cos(phi);
      camera.target.z = 500 * Math.sin(phi) * Math.sin(theta);
      camera.lookAt(camera.target);

      setHeadingDegrees(Math.abs(Math.round(lonRef.current % 360)));
      renderer.render(scene, camera);
    };
    animate();

    // Mouse / Touch Event Handlers for 3D Drag
    const onPointerDown = (e) => {
      isUserInteractingRef.current = true;
      onPointerDownPointerXRef.current = e.clientX;
      onPointerDownPointerYRef.current = e.clientY;
      onPointerDownLonRef.current = lonRef.current;
      onPointerDownLatRef.current = latRef.current;
    };

    const onPointerMove = (e) => {
      if (!isUserInteractingRef.current) return;
      lonRef.current = (onPointerDownPointerXRef.current - e.clientX) * 0.15 + onPointerDownLonRef.current;
      latRef.current = (e.clientY - onPointerDownPointerYRef.current) * 0.15 + onPointerDownLatRef.current;
    };

    const onPointerUp = () => {
      isUserInteractingRef.current = false;
    };

    const domElement = renderer.domElement;
    domElement.addEventListener('pointerdown', onPointerDown);
    domElement.addEventListener('pointermove', onPointerMove);
    domElement.addEventListener('pointerup', onPointerUp);

    // Resize Handler
    const handleResize = () => {
      if (!container) return;
      const w = container.clientWidth;
      const h = container.clientHeight;
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h);
    };
    window.addEventListener('resize', handleResize);

    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener('resize', handleResize);
      domElement.removeEventListener('pointerdown', onPointerDown);
      domElement.removeEventListener('pointermove', onPointerMove);
      domElement.removeEventListener('pointerup', onPointerUp);
      if (container.contains(domElement)) {
        container.removeChild(domElement);
      }
      geometry.dispose();
      material.dispose();
      texture.dispose();
      renderer.dispose();
    };
  }, [currentId, currentData]);

  const handleZoomIn = () => {
    if (cameraRef.current && cameraRef.current.fov > 30) {
      cameraRef.current.fov -= 10;
      cameraRef.current.updateProjectionMatrix();
    }
  };

  const handleZoomOut = () => {
    if (cameraRef.current && cameraRef.current.fov < 100) {
      cameraRef.current.fov += 10;
      cameraRef.current.updateProjectionMatrix();
    }
  };

  const handleReset = () => {
    lonRef.current = 0;
    latRef.current = 0;
    if (cameraRef.current) {
      cameraRef.current.fov = 75;
      cameraRef.current.updateProjectionMatrix();
    }
    setActiveHotspot(null);
  };

  return (
    <div className={`modal show d-block ${isFullscreen ? 'p-0' : 'p-2 p-md-3'}`} style={{ backgroundColor: 'rgba(0,0,0,0.92)', zIndex: 1080 }}>
      <div className={`modal-dialog modal-dialog-centered ${isFullscreen ? 'mw-100 m-0 h-100' : 'modal-xl'}`} style={isFullscreen ? { width: '100vw', height: '100vh' } : { maxWidth: '1100px' }}>
        <motion.div 
          className={`modal-content bg-black text-white border border-warning border-opacity-40 overflow-hidden shadow-2xl d-flex flex-column ${isFullscreen ? 'rounded-0 h-100' : 'rounded-4'}`}
          style={{ height: isFullscreen ? '100vh' : '88vh' }}
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.95 }}
        >
          {/* Header Bar */}
          <div className="bg-dark px-4 py-3 border-bottom border-warning border-opacity-30 d-flex align-items-center justify-content-between flex-shrink-0">
            <div className="d-flex align-items-center gap-3">
              <div className="p-2 rounded-circle bg-warning text-dark font-monospace fw-bold small">
                360°
              </div>
              <div>
                <h5 className={`text-white fw-bold mb-0 ${styles.playfairFont}`}>{currentData.name}</h5>
                <span className="text-warning small">{currentData.hindiName} • Three.js WebGL 3D Panorama</span>
              </div>
            </div>

            <div className="d-flex align-items-center gap-2">
              <button
                onClick={() => setIsPlayingAudio(!isPlayingAudio)}
                className={`btn btn-sm rounded-pill px-3 d-flex align-items-center gap-1.5 ${isPlayingAudio ? 'btn-warning text-dark fw-bold' : 'btn-outline-secondary text-white'}`}
              >
                {isPlayingAudio ? <Volume2 size={16} /> : <VolumeX size={16} />}
                <span className="d-none d-md-inline">{isPlayingAudio ? 'Chants Playing' : 'Muted'}</span>
              </button>

              <button
                onClick={() => setIsFullscreen(!isFullscreen)}
                className="btn btn-outline-warning btn-sm rounded-circle p-2"
                title="Toggle Fullscreen"
              >
                {isFullscreen ? <Minimize2 size={18} /> : <Maximize2 size={18} />}
              </button>

              {onClose && (
                <button onClick={onClose} className="btn-close btn-close-white ms-2" />
              )}
            </div>
          </div>

          {/* 360 Three.js WebGL Canvas Viewport */}
          <div className="flex-grow-1 position-relative overflow-hidden cursor-grab active-cursor-grabbing user-select-none">
            {/* Mount container for Three.js WebGLRenderer */}
            <div ref={mountRef} className="w-100 h-100" />

            {/* Hotspots Overlay */}
            {currentData.hotspots.map((hs) => (
              <div
                key={hs.id}
                className="position-absolute cursor-pointer"
                style={{ left: `${hs.x}%`, top: `${hs.y}%`, transform: 'translate(-50%, -50%)', zIndex: 25 }}
                onClick={(e) => {
                  e.stopPropagation();
                  setActiveHotspot(activeHotspot?.id === hs.id ? null : hs);
                }}
              >
                <div className="position-relative">
                  <span className="animate-ping position-absolute inset-0 rounded-circle bg-warning opacity-75" />
                  <div className="rounded-circle bg-warning text-dark p-2 border border-dark shadow-lg d-flex align-items-center justify-content-center">
                    <Sparkles size={16} />
                  </div>
                </div>
              </div>
            ))}

            {/* Top Right HUD Controls */}
            <div className="position-absolute top-0 end-0 m-3 d-flex flex-column gap-2" style={{ zIndex: 30 }}>
              <div className="bg-black bg-opacity-80 p-2 rounded-3 border border-warning border-opacity-30 text-center text-warning font-monospace small">
                <Compass size={18} className="mb-1 d-block mx-auto animate-pulse" />
                <span>N {headingDegrees}°</span>
              </div>

              <div className="d-flex flex-column gap-1 bg-black bg-opacity-80 p-1.5 rounded-3 border border-secondary border-opacity-30">
                <button onClick={handleZoomIn} className="btn btn-dark btn-sm text-warning p-1.5" title="Zoom In">
                  <ZoomIn size={16} />
                </button>
                <button onClick={handleZoomOut} className="btn btn-dark btn-sm text-warning p-1.5" title="Zoom Out">
                  <ZoomOut size={16} />
                </button>
                <button onClick={handleReset} className="btn btn-dark btn-sm text-warning p-1.5" title="Reset View">
                  <RotateCcw size={16} />
                </button>
              </div>
            </div>

            {/* Bottom Left Drag Hint */}
            <div className="position-absolute bottom-0 start-0 m-3 pointer-events-none" style={{ zIndex: 30 }}>
              <div className="px-3 py-1.5 bg-black bg-opacity-80 border border-warning border-opacity-30 rounded-pill text-warning small font-monospace d-flex align-items-center gap-2">
                <span>🌐 Three.js WebGL: Click & Drag to Rotate 360° Sphere</span>
              </div>
            </div>

            {/* Hotspot Info Popup Card */}
            <AnimatePresence>
              {activeHotspot && (
                <motion.div
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 15 }}
                  className="position-absolute bottom-0 start-50 translate-middle-x mb-4 p-3 bg-black text-white rounded-4 border border-warning shadow-2xl max-w-450 w-90"
                  style={{ zIndex: 40 }}
                >
                  <div className="d-flex align-items-start justify-content-between mb-1">
                    <h6 className="text-warning fw-bold mb-0 d-flex align-items-center gap-1.5">
                      <Sparkles size={16} /> {activeHotspot.title}
                    </h6>
                    <button onClick={() => setActiveHotspot(null)} className="btn-close btn-close-white small" />
                  </div>
                  <p className="text-light small mb-0" style={{ fontSize: '0.82rem', lineHeight: 1.5 }}>
                    {activeHotspot.desc}
                  </p>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Bottom Temple Switcher Strip */}
          <div className="bg-dark p-3 border-top border-warning border-opacity-30 flex-shrink-0">
            <small className="text-secondary d-block mb-2 font-monospace" style={{ fontSize: '0.75rem' }}>
              SWITCH 360° VIRTUAL SHRINE:
            </small>

            <div className="d-flex gap-2 overflow-x-auto pb-1 scrollbar-none">
              {Object.keys(TEMPLE_360_DATA).map((key) => {
                const item = TEMPLE_360_DATA[key];
                const isActive = currentId === key;
                return (
                  <button
                    key={key}
                    onClick={() => {
                      setCurrentId(key);
                      handleReset();
                    }}
                    className={`btn btn-sm rounded-pill px-3 py-1.5 font-semibold text-nowrap transition-all d-flex align-items-center gap-1.5 ${
                      isActive
                        ? 'btn-warning text-dark shadow'
                        : 'btn-outline-secondary text-light opacity-75 hover-opacity-100'
                    }`}
                    style={{ fontSize: '0.8rem' }}
                  >
                    <MapPin size={14} /> {item.name}
                  </button>
                );
              })}
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
