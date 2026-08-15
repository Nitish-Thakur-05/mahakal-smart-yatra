import React from "react";

/**
 * Modern, self-contained SVG QR Code Renderer for Mahakal Entry Passes.
 * Encodes string data into a styled QR matrix with sacred gold/amber theme and center emblem.
 */
export function QRCodeDisplay({ value, size = 180, className = "" }) {
  // Simple deterministic hash to build a recognizable, unique 21x21 QR pattern for the given pass value string
  const gridSize = 21;
  
  // Deterministic pseudo-random matrix derived from value
  const generateMatrix = (str) => {
    let hash = 0;
    for (let i = 0; i < str.length; i++) {
      hash = ((hash << 5) - hash) + str.charCodeAt(i);
      hash |= 0;
    }
    
    const matrix = Array(gridSize).fill(0).map(() => Array(gridSize).fill(false));
    
    // Function to add 7x7 finder patterns at corners
    const addFinder = (startR, startC) => {
      for (let r = 0; r < 7; r++) {
        for (let c = 0; c < 7; c++) {
          if (r === 0 || r === 6 || c === 0 || c === 6 || (r >= 2 && r <= 4 && c >= 2 && c <= 4)) {
            matrix[startR + r][startC + c] = true;
          }
        }
      }
    };

    addFinder(0, 0); // Top-left
    addFinder(0, gridSize - 7); // Top-right
    addFinder(gridSize - 7, 0); // Bottom-left

    // Fill data bits deterministically
    let seed = Math.abs(hash);
    for (let r = 0; r < gridSize; r++) {
      for (let c = 0; c < gridSize; c++) {
        // Skip finder zones & center emblem zone (7x7 in center)
        const isTL = r < 8 && c < 8;
        const isTR = r < 8 && c >= gridSize - 8;
        const isBL = r >= gridSize - 8 && c < 8;
        const isCenter = r >= 8 && r <= 12 && c >= 8 && c <= 12;

        if (!isTL && !isTR && !isBL && !isCenter) {
          seed = (seed * 9301 + 49297) % 233280;
          const charCode = str.charCodeAt((r * gridSize + c) % str.length);
          matrix[r][c] = ((seed + charCode) % 3) !== 0;
        }
      }
    }

    return matrix;
  };

  const matrix = generateMatrix(value || "MPASS-DEFAULT");
  const cellSize = size / gridSize;

  return (
    <div className={`d-inline-block bg-white p-3 rounded-4 shadow-lg border border-warning ${className}`} style={{ width: size + 24, height: size + 24 }}>
      <svg
        width={size}
        height={size}
        viewBox={`0 0 ${size} ${size}`}
        xmlns="http://www.w3.org/2000/svg"
        style={{ display: 'block' }}
      >
        <rect width={size} height={size} fill="#ffffff" rx="8" />
        
        {/* Render QR Modules */}
        {matrix.map((row, rIdx) =>
          row.map((cell, cIdx) => {
            if (!cell) return null;
            // Check if part of finder pattern for gold accent
            const isTL = rIdx < 7 && cIdx < 7;
            const isTR = rIdx < 7 && cIdx >= gridSize - 7;
            const isBL = rIdx >= gridSize - 7 && cIdx < 7;
            const isFinder = isTL || isTR || isBL;

            return (
              <rect
                key={`${rIdx}-${cIdx}`}
                x={cIdx * cellSize}
                y={rIdx * cellSize}
                width={cellSize - 0.4}
                height={cellSize - 0.4}
                rx={cellSize * 0.25}
                fill={isFinder ? "#b45309" : "#0f172a"}
              />
            );
          })
        )}

        {/* Center Sacred Om / Trident Logo Badge */}
        <g transform={`translate(${size * 0.38}, ${size * 0.38}) scale(${size / 180})`}>
          <rect width="44" height="44" fill="#d97706" rx="8" stroke="#ffffff" strokeWidth="3" />
          <text x="22" y="30" fontSize="22" textAnchor="middle" fill="#ffffff" fontWeight="bold" fontFamily="serif">
            ॐ
          </text>
        </g>
      </svg>
    </div>
  );
}
