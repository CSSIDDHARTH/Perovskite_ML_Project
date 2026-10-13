import React from 'react';
import { RecipeInput } from '../types';

interface DeviceStackVisualizerProps {
  recipe: RecipeInput;
}

export const DeviceStackVisualizer: React.FC<DeviceStackVisualizerProps> = ({ recipe }) => {
  const isNip = recipe.architecture === 'nip';

  // Dynamic perovskite absorber height scaled between 44px (200nm) and 100px (650nm)
  const normThickness = (recipe.layerThickness - 200) / 450;
  const perovskiteHeight = 44 + normThickness * 56;

  // Material styling properties
  const getEtlColor = () => {
    switch (recipe.etlRecipe) {
      case 'SnO2 (spin-coated)':
        return { fill: '#0284c7', label: 'SnO2 (30nm, Spin-coated)', text: 'text-sky-400' };
      case 'TiO2 (compact+mesoporous)':
        return { fill: '#0369a1', label: 'c-TiO2 + mp-TiO2 (150nm)', text: 'text-sky-300' };
      case 'C60 / BCP':
        return { fill: '#0f766e', label: 'C60 (25nm) / BCP (6nm)', text: 'text-teal-300' };
      case 'ZnO':
        return { fill: '#0891b2', label: 'ZnO (40nm, Nanoparticle)', text: 'text-cyan-400' };
    }
  };

  const getHtlColor = () => {
    switch (recipe.htlRecipe) {
      case 'Spiro-OMeTAD':
        return { fill: '#6366f1', label: 'Spiro-OMeTAD (150nm)', text: 'text-indigo-300' };
      case 'PTAA':
        return { fill: '#8b5cf6', label: 'PTAA (35nm, Dopant-free)', text: 'text-purple-300' };
      case 'NiOx (nanoparticle)':
        return { fill: '#475569', label: 'NiOx (20nm, Sputtered/NP)', text: 'text-slate-300' };
      case '2PACz':
        return { fill: '#14b8a6', label: '2PACz SAM (~1.5nm)', text: 'text-teal-300' };
    }
  };

  const etl = getEtlColor();
  const htl = getHtlColor();

  return (
    <div className="p-4 rounded-xl bg-slate-950/80 border border-slate-800/80 flex flex-col justify-between">
      <div className="flex items-center justify-between pb-3 border-b border-slate-800 text-xs">
        <div className="flex items-center gap-2">
          <span className="font-mono uppercase font-semibold text-cyan-400">
            {recipe.architecture.toUpperCase()} Architecture
          </span>
          <span className="text-slate-500">·</span>
          <span className="text-slate-300 font-medium">Device Stack Simulation</span>
        </div>
        <span className="font-mono text-[11px] text-slate-400">
          Thickness: {recipe.layerThickness} nm
        </span>
      </div>

      {/* SVG Device Cross-Section Schematic */}
      <div className="py-4 flex justify-center">
        <svg
          viewBox="0 0 380 260"
          className="w-full max-w-[360px] h-auto select-none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <defs>
            {/* Gradients */}
            <linearGradient id="perovGrad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#d97706" />
              <stop offset="50%" stopColor="#b45309" />
              <stop offset="100%" stopColor="#78350f" />
            </linearGradient>

            <linearGradient id="goldGrad" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#fbbf24" />
              <stop offset="50%" stopColor="#f59e0b" />
              <stop offset="100%" stopColor="#d97706" />
            </linearGradient>

            <linearGradient id="glassGrad" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="#334155" stopOpacity="0.4" />
              <stop offset="100%" stopColor="#1e293b" stopOpacity="0.8" />
            </linearGradient>

            {/* Micro crystalline grain boundary pattern */}
            <pattern id="grainPattern" width="20" height="20" patternUnits="userSpaceOnUse">
              <path
                d="M0 10 L10 0 L20 10 L10 20 Z"
                fill="none"
                stroke="rgba(255,255,255,0.08)"
                strokeWidth="1"
              />
              <circle cx="10" cy="10" r="1.5" fill="rgba(251,191,36,0.3)" />
            </pattern>
          </defs>

          {/* Incoming Photons (hv) from Bottom if Glass is substrate */}
          <g>
            <path d="M 50 250 L 50 215" stroke="#38bdf8" strokeWidth="2" strokeDasharray="3 3" />
            <polygon points="46,217 50,209 54,217" fill="#38bdf8" />
            <path d="M 120 250 L 120 215" stroke="#facc15" strokeWidth="2" strokeDasharray="3 3" />
            <polygon points="116,217 120,209 124,217" fill="#facc15" />
            <path d="M 190 250 L 190 215" stroke="#38bdf8" strokeWidth="2" strokeDasharray="3 3" />
            <polygon points="186,217 190,209 194,217" fill="#38bdf8" />
            <text x="210" y="244" fill="#94a3b8" fontSize="10" fontFamily="monospace">
              hν (Solar AM1.5G)
            </text>
          </g>

          {/* Layer 1: Glass Substrate (SLG) */}
          <rect x="30" y="185" width="320" height="22" rx="2" fill="url(#glassGrad)" stroke="#475569" strokeWidth="1" />
          <text x="40" y="200" fill="#cbd5e1" fontSize="10" fontFamily="sans-serif" fontWeight="500">
            Glass (Soda-Lime Glass, ~1.1 mm)
          </text>

          {/* Layer 2: Transparent Conducting Oxide (FTO or ITO) */}
          <rect x="30" y="165" width="320" height="18" rx="2" fill="#1e293b" stroke="#38bdf8" strokeWidth="1" strokeDasharray="2 1" />
          <text x="40" y="178" fill="#38bdf8" fontSize="10" fontFamily="sans-serif" fontWeight="600">
            {recipe.substrate} (~150nm, Sheet R &lt; 15 Ω/sq)
          </text>

          {isNip ? (
            /* nip: Bottom is ETL, Top is HTL */
            <>
              {/* ETL Layer */}
              <rect x="30" y="145" width="320" height="18" rx="2" fill={etl.fill} opacity="0.85" />
              <text x="40" y="158" fill="#e0f2fe" fontSize="9" fontFamily="sans-serif" fontWeight="500">
                ETL: {etl.label}
              </text>

              {/* Perovskite Absorber Layer */}
              <g>
                <rect
                  x="30"
                  y={145 - perovskiteHeight}
                  width="320"
                  height={perovskiteHeight}
                  rx="3"
                  fill="url(#perovGrad)"
                  stroke="#f59e0b"
                  strokeWidth="1.2"
                />
                <rect
                  x="30"
                  y={145 - perovskiteHeight}
                  width="320"
                  height={perovskiteHeight}
                  fill="url(#grainPattern)"
                  rx="3"
                />
                <text
                  x="40"
                  y={145 - perovskiteHeight / 2 + 3}
                  fill="#fef3c7"
                  fontSize="11"
                  fontFamily="sans-serif"
                  fontWeight="700"
                >
                  Perovskite: {recipe.composition} ({recipe.layerThickness} nm)
                </text>
              </g>

              {/* HTL Layer */}
              <rect
                x="30"
                y={145 - perovskiteHeight - 20}
                width="320"
                height="18"
                rx="2"
                fill={htl.fill}
                opacity="0.9"
              />
              <text
                x="40"
                y={145 - perovskiteHeight - 8}
                fill="#ffffff"
                fontSize="9"
                fontFamily="sans-serif"
                fontWeight="500"
              >
                HTL: {htl.label}
              </text>

              {/* Top Contact: Gold Au or Ag */}
              <g>
                <rect
                  x="60"
                  y={145 - perovskiteHeight - 34}
                  width="60"
                  height="12"
                  rx="1"
                  fill="url(#goldGrad)"
                />
                <rect
                  x="160"
                  y={145 - perovskiteHeight - 34}
                  width="60"
                  height="12"
                  rx="1"
                  fill="url(#goldGrad)"
                />
                <rect
                  x="260"
                  y={145 - perovskiteHeight - 34}
                  width="60"
                  height="12"
                  rx="1"
                  fill="url(#goldGrad)"
                />
                <text
                  x="168"
                  y={145 - perovskiteHeight - 39}
                  fill="#fde047"
                  fontSize="9"
                  fontFamily="monospace"
                  fontWeight="600"
                >
                  Au Contacts (80nm)
                </text>
              </g>
            </>
          ) : (
            /* pin (inverted): Bottom is HTL, Top is ETL */
            <>
              {/* HTL Layer on TCO */}
              <rect x="30" y="145" width="320" height="18" rx="2" fill={htl.fill} opacity="0.85" />
              <text x="40" y="158" fill="#ffffff" fontSize="9" fontFamily="sans-serif" fontWeight="500">
                HTL: {htl.label}
              </text>

              {/* Perovskite Absorber */}
              <g>
                <rect
                  x="30"
                  y={145 - perovskiteHeight}
                  width="320"
                  height={perovskiteHeight}
                  rx="3"
                  fill="url(#perovGrad)"
                  stroke="#f59e0b"
                  strokeWidth="1.2"
                />
                <rect
                  x="30"
                  y={145 - perovskiteHeight}
                  width="320"
                  height={perovskiteHeight}
                  fill="url(#grainPattern)"
                  rx="3"
                />
                <text
                  x="40"
                  y={145 - perovskiteHeight / 2 + 3}
                  fill="#fef3c7"
                  fontSize="11"
                  fontFamily="sans-serif"
                  fontWeight="700"
                >
                  Perovskite: {recipe.composition} ({recipe.layerThickness} nm)
                </text>
              </g>

              {/* ETL Layer on Perovskite */}
              <rect
                x="30"
                y={145 - perovskiteHeight - 20}
                width="320"
                height="18"
                rx="2"
                fill={etl.fill}
                opacity="0.9"
              />
              <text
                x="40"
                y={145 - perovskiteHeight - 8}
                fill="#e0f2fe"
                fontSize="9"
                fontFamily="sans-serif"
                fontWeight="500"
              >
                ETL: {etl.label}
              </text>

              {/* Top Contact: Ag or Cu */}
              <g>
                <rect
                  x="60"
                  y={145 - perovskiteHeight - 34}
                  width="60"
                  height="12"
                  rx="1"
                  fill="#cbd5e1"
                  stroke="#94a3b8"
                  strokeWidth="1"
                />
                <rect
                  x="160"
                  y={145 - perovskiteHeight - 34}
                  width="60"
                  height="12"
                  rx="1"
                  fill="#cbd5e1"
                  stroke="#94a3b8"
                  strokeWidth="1"
                />
                <rect
                  x="260"
                  y={145 - perovskiteHeight - 34}
                  width="60"
                  height="12"
                  rx="1"
                  fill="#cbd5e1"
                  stroke="#94a3b8"
                  strokeWidth="1"
                />
                <text
                  x="168"
                  y={145 - perovskiteHeight - 39}
                  fill="#e2e8f0"
                  fontSize="9"
                  fontFamily="monospace"
                  fontWeight="600"
                >
                  Ag / Cu Contacts (100nm)
                </text>
              </g>
            </>
          )}
        </svg>
      </div>

      <div className="pt-2 border-t border-slate-900 grid grid-cols-2 gap-2 text-[11px] text-slate-400">
        <div>
          <span className="text-slate-500 font-mono">Illumination:</span> Substrate side
        </div>
        <div>
          <span className="text-slate-500 font-mono">Extraction:</span> Bilateral ohmic
        </div>
      </div>
    </div>
  );
};
