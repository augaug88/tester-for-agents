import React from 'react';
import { Carpark } from '../data/carparks';

interface Props {
  carparks: Carpark[];
  selectedCarpark: Carpark;
  onSelectCarpark: (carpark: Carpark) => void;
  evOnlyFilter: boolean;
  onToggleEvFilter: () => void;
  showTraffic: boolean;
  onToggleTraffic: () => void;
  mapLayer: 'standard' | 'satellite' | 'density';
  onChangeLayer: () => void;
  onRecenter: () => void;
  zoomLevel: number;
  onZoomIn: () => void;
  onZoomOut: () => void;
  isLandscape?: boolean;
}

export const MapCanvas: React.FC<Props> = ({
  carparks,
  selectedCarpark,
  onSelectCarpark,
  evOnlyFilter,
  onToggleEvFilter,
  showTraffic,
  onToggleTraffic,
  mapLayer,
  onChangeLayer,
  onRecenter,
  zoomLevel,
  onZoomIn,
  onZoomOut,
  isLandscape = false,
}) => {
  return (
    <div className="relative w-full h-full min-h-[300px] bg-[#eff4ff] overflow-hidden select-none flex items-center justify-center">
      {/* Zoomable & Scalable Canvas Layer */}
      <div
        className="relative w-full h-full transition-transform duration-300 ease-out origin-center"
        style={{ transform: `scale(${zoomLevel})` }}
      >
        {/* SVG Vector Map Base */}
        <svg
          className="absolute inset-0 w-full h-full"
          fill="none"
          preserveAspectRatio={isLandscape ? "xMidYMid meet" : "xMidYMid slice"}
          viewBox="0 0 420 780"
          xmlns="http://www.w3.org/2000/svg"
        >
          {/* Background Land Tone / Satellite Mode */}
          {mapLayer === 'satellite' ? (
            <rect width="420" height="780" fill="#1b2838" />
          ) : (
            <rect width="420" height="780" fill="#f8f9ff" />
          )}

          {/* Water bodies: Marina Reservoir & Singapore River */}
          <path
            d="M-20 480 C 60 490, 140 560, 190 620 C 230 670, 270 790, 290 820 L 450 820 L 450 420 C 370 410, 310 430, 240 400 C 180 370, 140 310, 80 300 C 40 295, -10 320, -20 330 Z"
            fill={mapLayer === 'satellite' ? '#0f2038' : '#cce5ff'}
            opacity={mapLayer === 'satellite' ? 0.9 : 0.65}
          />
          <path
            d="M-10 320 C 50 310, 90 280, 120 220 C 140 180, 160 140, 180 100 C 190 80, 210 20, 215 -10 L 170 -10 C 160 30, 130 90, 100 130 C 70 170, 30 200, -10 220 Z"
            fill={mapLayer === 'satellite' ? '#0f2038' : '#cce5ff'}
            opacity={mapLayer === 'satellite' ? 0.9 : 0.55}
          />

          {/* Urban Land Mass Fill / Green Parks: Esplanade & Marina Square Greens */}
          <path
            d="M 230 330 C 280 310, 330 340, 350 390 C 320 410, 270 410, 240 370 Z"
            fill={mapLayer === 'satellite' ? '#163828' : '#dce9ff'}
            opacity={0.7}
          />
          <path
            d="M 60 110 C 110 90, 130 130, 110 160 C 80 180, 50 150, 60 110 Z"
            fill={mapLayer === 'satellite' ? '#163828' : '#dce9ff'}
            opacity={0.5}
          />

          {/* Secondary Street Mesh (CBD Raffles / Robinson / Marina Bay) */}
          <path d="M 40 200 L 260 520" stroke={mapLayer === 'satellite' ? '#2c3e50' : '#eff4ff'} strokeWidth="4" />
          <path d="M 80 160 L 300 480" stroke={mapLayer === 'satellite' ? '#2c3e50' : '#eff4ff'} strokeWidth="3" />
          <path d="M-10 260 L 200 440" stroke={mapLayer === 'satellite' ? '#2c3e50' : '#eff4ff'} strokeWidth="3" />
          <path d="M 20 340 L 240 480" stroke={mapLayer === 'satellite' ? '#2c3e50' : '#eff4ff'} strokeWidth="3" />
          <path d="M 170 190 L 80 380" stroke={mapLayer === 'satellite' ? '#2c3e50' : '#eff4ff'} strokeWidth="3" />
          <path d="M 240 230 L 150 420" stroke={mapLayer === 'satellite' ? '#2c3e50' : '#eff4ff'} strokeWidth="3" />
          <path d="M 310 270 L 220 460" stroke={mapLayer === 'satellite' ? '#2c3e50' : '#eff4ff'} strokeWidth="3" />

          {/* Primary Arterials & Expressways (Nicoll Hwy, ECP, Sheares Ave, Marina Blvd, Bras Basah) */}
          <path d="M-20 180 L 440 220" stroke="#bbcabf" strokeLinecap="round" strokeWidth="6" />
          <path d="M-20 180 L 440 220" stroke="#ffffff" strokeLinecap="round" strokeWidth="4" />
          
          <path d="M 120 -20 L 320 540" stroke="#bbcabf" strokeLinecap="round" strokeWidth="7" />
          <path d="M 120 -20 L 320 540" stroke="#ffffff" strokeLinecap="round" strokeWidth="5" />
          
          <path d="M 240 210 C 280 290, 360 420, 440 500" stroke="#bbcabf" strokeLinecap="round" strokeWidth="6" />
          <path d="M 240 210 C 280 290, 360 420, 440 500" stroke="#ffffff" strokeLinecap="round" strokeWidth="4" />

          {/* Benjamin Sheares Bridge spanning the basin */}
          <path d="M 180 430 L 430 460" stroke="#93ccff" strokeDasharray="8 4" strokeLinecap="round" strokeWidth="8" />

          {/* Live Traffic Density Layer (if enabled) */}
          {showTraffic && (
            <g opacity="0.85">
              <path d="M-20 180 L 200 200" stroke="#00b87a" strokeLinecap="round" strokeWidth="3" />
              <path d="M 200 200 L 440 220" stroke="#f59e0b" strokeLinecap="round" strokeWidth="3" />
              <path d="M 190 200 L 280 410" stroke="#ef4444" strokeLinecap="round" strokeWidth="3" />
              <path d="M 180 430 L 430 460" stroke="#00b87a" strokeLinecap="round" strokeWidth="3" />
            </g>
          )}

          {/* Floating Platform / Helix contour */}
          <circle cx="280" cy="420" fill="none" r="16" stroke="#5bb8fe" strokeDasharray="3 3" strokeWidth="2" />
          <path d="M 190 620 C 230 670, 270 790, 290 820" fill="none" stroke="#93ccff" strokeWidth="2" />

          {/* User GPS Vehicle Marker */}
          <g transform="translate(145, 170)">
            <circle cx="0" cy="0" r="10" fill="#006398" opacity="0.2" className="animate-ping" />
            <circle cx="0" cy="0" r="5" fill="#006398" />
            <polygon points="0,-12 4,-5 -4,-5" fill="#006398" />
          </g>

          {/* ERP Live Gantry Indicator (Grounded inside SVG coordinates) */}
          <g transform="translate(210, 260)">
            <rect x="0" y="0" width="136" height="24" rx="12" fill="#d3e4fe" stroke="#bbcabf" strokeWidth="0.8" opacity="0.95" />
            <circle cx="12" cy="12" r="3.5" fill="#006398" />
            <text x="22" y="16" fill="#0b1c30" fontSize="10.5" fontWeight="600" fontFamily="JetBrains Mono, monospace">
              ERP: Sheares $2.00
            </text>
          </g>

          {/* INTERACTIVE CARPARK PINS AS SVG FOREIGN OBJECTS */}
          {carparks.map((carpark) => {
            const isSelected = selectedCarpark.id === carpark.id;

            if (carpark.id === 'suntec-city') {
              return (
                <foreignObject
                  key={carpark.id}
                  x="60"
                  y="160"
                  width="170"
                  height="115"
                  className="overflow-visible"
                >
                  <div
                    onClick={(e) => {
                      e.stopPropagation();
                      onSelectCarpark(carpark);
                    }}
                    className={`flex flex-col items-center cursor-pointer transition-transform duration-200 ${
                      isSelected ? 'scale-105 z-30' : 'hover:scale-105'
                    }`}
                  >
                    <div className="relative flex flex-col items-center bg-white shadow-xl rounded-xl p-1.5 px-2.5 border border-[#bbcabf]/30">
                      <div className="flex items-center gap-1.5">
                        <span className="font-mono text-[13px] font-bold text-[#006c46]">
                          ${carpark.ratePerFirstHour.toFixed(2)}
                        </span>
                        <span className="text-[#bbcabf] font-mono text-[10px]">|</span>
                        <span className="font-mono text-[11px] font-bold text-[#0b1c30]">
                          {carpark.availableLots} lots
                        </span>
                      </div>
                      <div className="mt-1 flex items-center gap-1 bg-[#dce9ff] px-1.5 py-0.5 rounded-full">
                        <span className="material-symbols-outlined text-[#006c46] text-[11px] material-symbols-fill">
                          bolt
                        </span>
                        <span className="font-mono text-[10px] text-[#005234] font-semibold whitespace-nowrap">
                          {carpark.evSummary.freeCount} Free (120kW)
                        </span>
                      </div>
                      <div className="w-2.5 h-2.5 bg-white rotate-45 -mb-2 mt-1 rounded-[1px] shadow-sm border-r border-b border-[#bbcabf]/20" />
                    </div>

                    <div className="relative mt-2 flex items-center justify-center">
                      <span className="absolute w-7 h-7 bg-[#00b87a]/30 rounded-full animate-ping" />
                      <span className="w-4 h-4 bg-[#006c46] rounded-full shadow-md flex items-center justify-center ring-2 ring-white">
                        <span className="w-1.5 h-1.5 bg-white rounded-full" />
                      </span>
                    </div>
                  </div>
                </foreignObject>
              );
            }

            if (carpark.id === 'mbfc') {
              return (
                <foreignObject
                  key={carpark.id}
                  x="260"
                  y="310"
                  width="130"
                  height="90"
                  className="overflow-visible"
                >
                  <div
                    onClick={(e) => {
                      e.stopPropagation();
                      onSelectCarpark(carpark);
                    }}
                    className={`flex flex-col items-center cursor-pointer transition-transform ${
                      isSelected ? 'scale-110 z-30' : 'hover:scale-105'
                    }`}
                  >
                    <div className="flex flex-col items-center bg-white shadow-md rounded-lg py-1 px-2 border border-[#bbcabf]/30">
                      <div className="flex items-center gap-1">
                        <span className="font-mono text-[11px] font-semibold text-[#0b1c30]">
                          ${carpark.ratePerFirstHour.toFixed(2)}
                        </span>
                        <span className="text-[#bbcabf] text-[10px]">•</span>
                        <span className="font-mono text-[10px] font-semibold text-[#006c46]">
                          {carpark.availableLots} lots
                        </span>
                      </div>
                      <span className="font-mono text-[10px] text-[#006398] flex items-center gap-0.5">
                        <span className="material-symbols-outlined text-[10px]">bolt</span>
                        {carpark.evSummary.freeCount} Avail
                      </span>
                      <div className="w-2 h-2 bg-white rotate-45 -mb-1 mt-0.5 rounded-[1px]" />
                    </div>
                    <div className="mt-1 w-3 h-3 bg-[#006398] rounded-full shadow-sm ring-1 ring-white" />
                  </div>
                </foreignObject>
              );
            }

            if (carpark.id === 'one-raffles-quay') {
              return (
                <foreignObject
                  key={carpark.id}
                  x="30"
                  y="370"
                  width="130"
                  height="90"
                  className="overflow-visible"
                >
                  <div
                    onClick={(e) => {
                      e.stopPropagation();
                      onSelectCarpark(carpark);
                    }}
                    className={`flex flex-col items-center cursor-pointer transition-transform ${
                      isSelected ? 'scale-110 z-30' : 'hover:scale-105'
                    }`}
                  >
                    <div className="flex flex-col items-center bg-[#ffdad6] shadow-md rounded-lg py-1 px-2 text-[#93000a] border border-[#ba1a1a]/20">
                      <div className="flex items-center gap-1">
                        <span className="font-mono text-[11px] font-bold">
                          ${carpark.ratePerFirstHour.toFixed(2)}
                        </span>
                        <span className="opacity-60 text-[10px]">•</span>
                        <span className="font-mono text-[10px] font-bold flex items-center gap-0.5">
                          <span className="w-1.5 h-1.5 rounded-full bg-[#ba1a1a] animate-pulse" />
                          {carpark.availableLots} lots
                        </span>
                      </div>
                      <span className="font-mono text-[9px] uppercase tracking-wide opacity-90 font-bold whitespace-nowrap">
                        Almost Full
                      </span>
                      <div className="w-2 h-2 bg-[#ffdad6] rotate-45 -mb-1 mt-0.5 rounded-[1px]" />
                    </div>
                    <div className="mt-1 w-3 h-3 bg-[#ba1a1a] rounded-full shadow-sm ring-1 ring-white" />
                  </div>
                </foreignObject>
              );
            }

            if (carpark.id === 'capitagreen') {
              return (
                <foreignObject
                  key={carpark.id}
                  x="110"
                  y="280"
                  width="130"
                  height="80"
                  className="overflow-visible"
                >
                  <div
                    onClick={(e) => {
                      e.stopPropagation();
                      onSelectCarpark(carpark);
                    }}
                    className={`flex flex-col items-center cursor-pointer transition-transform ${
                      isSelected ? 'scale-110 z-30' : 'hover:scale-105'
                    }`}
                  >
                    <div className="flex flex-col items-center bg-white shadow-sm rounded-lg py-1 px-2 border border-[#bbcabf]/30">
                      <div className="flex items-center gap-1">
                        <span className="font-mono text-[11px] font-semibold text-[#0b1c30]">
                          ${carpark.ratePerFirstHour.toFixed(2)}
                        </span>
                        <span className="text-[#bbcabf] text-[10px]">•</span>
                        <span className="font-mono text-[10px] text-[#006c46] font-medium">
                          {carpark.availableLots} lots
                        </span>
                      </div>
                      <div className="w-2 h-2 bg-white rotate-45 -mb-1 mt-0.5 rounded-[1px]" />
                    </div>
                    <div className="mt-1 w-2.5 h-2.5 bg-[#6c7a70] rounded-full shadow-sm" />
                  </div>
                </foreignObject>
              );
            }

            if (carpark.id === 'marina-square' || carpark.id.includes('marina-square')) {
              return (
                <foreignObject
                  key={carpark.id}
                  x="200"
                  y="120"
                  width="130"
                  height="80"
                  className="overflow-visible"
                >
                  <div
                    onClick={(e) => {
                      e.stopPropagation();
                      onSelectCarpark(carpark);
                    }}
                    className={`flex flex-col items-center cursor-pointer transition-transform ${
                      isSelected ? 'scale-110 z-30' : 'hover:scale-105'
                    }`}
                  >
                    <div className="flex flex-col items-center bg-white shadow-sm rounded-lg py-1 px-2 border border-[#bbcabf]/30">
                      <div className="flex items-center gap-1">
                        <span className="font-mono text-[11px] font-semibold text-[#0b1c30]">
                          ${carpark.ratePerFirstHour.toFixed(2)}
                        </span>
                        <span className="text-[#bbcabf] text-[10px]">•</span>
                        <span className="font-mono text-[10px] text-[#006c46] font-medium">
                          {carpark.availableLots} lots
                        </span>
                      </div>
                      <div className="w-2 h-2 bg-white rotate-45 -mb-1 mt-0.5 rounded-[1px]" />
                    </div>
                    <div className="mt-1 w-2.5 h-2.5 bg-[#00b87a] rounded-full shadow-sm" />
                  </div>
                </foreignObject>
              );
            }

            // Raffles City (LTA ID: 3)
            if (carpark.id === 'raffles-city' || carpark.name.toLowerCase().includes('raffles city')) {
              return (
                <foreignObject
                  key={carpark.id}
                  x="50"
                  y="100"
                  width="130"
                  height="80"
                  className="overflow-visible"
                >
                  <div
                    onClick={(e) => {
                      e.stopPropagation();
                      onSelectCarpark(carpark);
                    }}
                    className={`flex flex-col items-center cursor-pointer transition-transform ${
                      isSelected ? 'scale-110 z-30' : 'hover:scale-105'
                    }`}
                  >
                    <div className="flex flex-col items-center bg-white shadow-sm rounded-lg py-1 px-2 border border-[#bbcabf]/30">
                      <div className="flex items-center gap-1">
                        <span className="font-mono text-[11px] font-semibold text-[#0b1c30]">
                          ${carpark.ratePerFirstHour.toFixed(2)}
                        </span>
                        <span className="text-[#bbcabf] text-[10px]">•</span>
                        <span className="font-mono text-[10px] text-[#006c46] font-medium">
                          {carpark.availableLots} lots
                        </span>
                      </div>
                      <div className="w-2 h-2 bg-white rotate-45 -mb-1 mt-0.5 rounded-[1px]" />
                    </div>
                    <div className="mt-1 w-2.5 h-2.5 bg-[#006398] rounded-full shadow-sm" />
                  </div>
                </foreignObject>
              );
            }

            // The Esplanade (LTA ID: 4)
            if (carpark.id === 'the-esplanade' || carpark.name.toLowerCase().includes('esplanade')) {
              return (
                <foreignObject
                  key={carpark.id}
                  x="140"
                  y="230"
                  width="130"
                  height="80"
                  className="overflow-visible"
                >
                  <div
                    onClick={(e) => {
                      e.stopPropagation();
                      onSelectCarpark(carpark);
                    }}
                    className={`flex flex-col items-center cursor-pointer transition-transform ${
                      isSelected ? 'scale-110 z-30' : 'hover:scale-105'
                    }`}
                  >
                    <div className="flex flex-col items-center bg-white shadow-sm rounded-lg py-1 px-2 border border-[#bbcabf]/30">
                      <div className="flex items-center gap-1">
                        <span className="font-mono text-[11px] font-semibold text-[#0b1c30]">
                          ${carpark.ratePerFirstHour.toFixed(2)}
                        </span>
                        <span className="text-[#bbcabf] text-[10px]">•</span>
                        <span className="font-mono text-[10px] text-[#006c46] font-medium">
                          {carpark.availableLots} lots
                        </span>
                      </div>
                      <div className="w-2 h-2 bg-white rotate-45 -mb-1 mt-0.5 rounded-[1px]" />
                    </div>
                    <div className="mt-1 w-2.5 h-2.5 bg-[#00b87a] rounded-full shadow-sm" />
                  </div>
                </foreignObject>
              );
            }

            // Millenia Singapore (LTA ID: 5)
            if (carpark.id === 'millenia-singapore' || carpark.name.toLowerCase().includes('millenia')) {
              return (
                <foreignObject
                  key={carpark.id}
                  x="270"
                  y="160"
                  width="130"
                  height="80"
                  className="overflow-visible"
                >
                  <div
                    onClick={(e) => {
                      e.stopPropagation();
                      onSelectCarpark(carpark);
                    }}
                    className={`flex flex-col items-center cursor-pointer transition-transform ${
                      isSelected ? 'scale-110 z-30' : 'hover:scale-105'
                    }`}
                  >
                    <div className="flex flex-col items-center bg-white shadow-sm rounded-lg py-1 px-2 border border-[#bbcabf]/30">
                      <div className="flex items-center gap-1">
                        <span className="font-mono text-[11px] font-semibold text-[#0b1c30]">
                          ${carpark.ratePerFirstHour.toFixed(2)}
                        </span>
                        <span className="text-[#bbcabf] text-[10px]">•</span>
                        <span className="font-mono text-[10px] text-[#006c46] font-medium">
                          {carpark.availableLots} lots
                        </span>
                      </div>
                      <div className="w-2 h-2 bg-white rotate-45 -mb-1 mt-0.5 rounded-[1px]" />
                    </div>
                    <div className="mt-1 w-2.5 h-2.5 bg-[#006c46] rounded-full shadow-sm" />
                  </div>
                </foreignObject>
              );
            }

            // Generic dynamic pin for any other carparks
            const posX = Math.min(320, Math.max(20, Math.round((carpark.pinPosition?.x || 50) * 3.6)));
            const posY = Math.min(680, Math.max(50, Math.round((carpark.pinPosition?.y || 50) * 7.0)));

            return (
              <foreignObject
                key={carpark.id}
                x={posX}
                y={posY}
                width="130"
                height="80"
                className="overflow-visible"
              >
                <div
                  onClick={(e) => {
                    e.stopPropagation();
                    onSelectCarpark(carpark);
                  }}
                  className={`flex flex-col items-center cursor-pointer transition-transform ${
                    isSelected ? 'scale-110 z-30' : 'hover:scale-105'
                  }`}
                >
                  <div className="flex flex-col items-center bg-white shadow-sm rounded-lg py-1 px-2 border border-[#bbcabf]/30">
                    <div className="flex items-center gap-1">
                      <span className="font-mono text-[11px] font-semibold text-[#0b1c30]">
                        ${carpark.ratePerFirstHour.toFixed(2)}
                      </span>
                      <span className="text-[#bbcabf] text-[10px]">•</span>
                      <span className="font-mono text-[10px] text-[#006c46] font-medium">
                        {carpark.availableLots} lots
                      </span>
                    </div>
                    <div className="w-2 h-2 bg-white rotate-45 -mb-1 mt-0.5 rounded-[1px]" />
                  </div>
                  <div className="mt-1 w-2.5 h-2.5 bg-[#006398] rounded-full shadow-sm" />
                </div>
              </foreignObject>
            );
          })}
        </svg>
      </div>

      {/* FLOATING MAP CONTROLS (RIGHT RAIL) */}
      <div className="absolute top-20 sm:top-24 right-3 z-30 flex flex-col gap-2 items-center">
        {/* EV Filter Active Toggle */}
        <button
          aria-label="Toggle EV filter"
          onClick={onToggleEvFilter}
          title="Toggle EV Available Only"
          className={`w-10 h-10 rounded-lg shadow-md flex flex-col items-center justify-center relative transition-all ${
            evOnlyFilter
              ? 'bg-[#00b87a] text-white ring-2 ring-[#006c46]'
              : 'bg-white text-[#0b1c30] hover:bg-[#eff4ff]'
          }`}
          type="button"
        >
          <span className="material-symbols-outlined text-[18px] material-symbols-fill">ev_station</span>
          <span className="font-mono text-[9px] font-bold leading-none">42</span>
        </button>

        {/* Recenter GPS User Location */}
        <button
          aria-label="Locate me"
          onClick={onRecenter}
          title="Recenter GPS Location"
          className="w-10 h-10 bg-white text-[#0b1c30] rounded-lg shadow-md flex items-center justify-center hover:bg-[#eff4ff] active:scale-95 transition-all"
          type="button"
        >
          <span className="material-symbols-outlined text-[18px] text-[#006398]">my_location</span>
        </button>

        {/* Map Layer Switcher */}
        <button
          aria-label="Map layers"
          onClick={onChangeLayer}
          title={`Layer: ${mapLayer}`}
          className={`w-10 h-10 rounded-lg shadow-md flex items-center justify-center hover:bg-[#eff4ff] active:scale-95 transition-all ${
            mapLayer !== 'standard' ? 'bg-[#cce5ff] text-[#006398]' : 'bg-white text-[#0b1c30]'
          }`}
          type="button"
        >
          <span className="material-symbols-outlined text-[18px]">layers</span>
        </button>

        {/* Traffic Density Layer */}
        <button
          aria-label="Traffic conditions"
          onClick={onToggleTraffic}
          title={showTraffic ? 'Hide Traffic' : 'Show Traffic'}
          className={`w-10 h-10 rounded-lg shadow-md flex items-center justify-center hover:bg-[#eff4ff] active:scale-95 transition-all ${
            showTraffic ? 'bg-[#00b87a]/15 text-[#006c46] ring-1 ring-[#00b87a]' : 'bg-white text-[#0b1c30]'
          }`}
          type="button"
        >
          <span className="material-symbols-outlined text-[18px] text-[#006c46]">traffic</span>
        </button>

        {/* Zoom Controls */}
        <div className="flex flex-col bg-white rounded-lg shadow-md overflow-hidden border border-[#bbcabf]/20">
          <button
            onClick={onZoomIn}
            className="w-10 h-7 flex items-center justify-center hover:bg-[#eff4ff] text-[#0b1c30] border-b border-[#bbcabf]/20"
            title="Zoom In"
          >
            <span className="material-symbols-outlined text-[16px]">add</span>
          </button>
          <button
            onClick={onZoomOut}
            className="w-10 h-7 flex items-center justify-center hover:bg-[#eff4ff] text-[#0b1c30]"
            title="Zoom Out"
          >
            <span className="material-symbols-outlined text-[16px]">remove</span>
          </button>
        </div>
      </div>
    </div>
  );
};
