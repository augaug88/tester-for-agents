import React, { useState } from 'react';
import { Carpark, USER_VEHICLE } from '../data/carparks';
import { MapCanvas } from './MapCanvas';
import { TripPlannerTab } from './TripPlannerTab';
import { EvHubTab } from './EvHubTab';
import { PassesTab } from './PassesTab';

interface Props {
  carparks: Carpark[];
  selectedCarpark: Carpark;
  onSelectCarpark: (carpark: Carpark) => void;
  onStartGps: (carpark: Carpark) => void;
  onOpenReserve: (carpark: Carpark) => void;
  onOpenTopUp: () => void;
  obuBalance: number;
  bookmarkedCarparkIds: string[];
  onToggleBookmark: (carparkId: string) => void;
  onToggleViewMode?: () => void;
  onOpenLtaFeed?: () => void;
  isLandscape?: boolean;
}

export const MobileAppView: React.FC<Props> = ({
  carparks,
  selectedCarpark,
  onSelectCarpark,
  onStartGps,
  onOpenReserve,
  onOpenTopUp,
  obuBalance,
  bookmarkedCarparkIds,
  onToggleBookmark,
  onToggleViewMode,
  onOpenLtaFeed,
  isLandscape = false,
}) => {
  const [activeTab, setActiveTab] = useState<'map-and-rates' | 'trip-planner' | 'ev-hub' | 'passes'>('map-and-rates');
  const [searchQuery, setSearchQuery] = useState('Suntec City, Temasek Blvd');
  const [activeFilter, setActiveFilter] = useState<'all' | 'ev' | 'price' | 'grace' | 'clearance'>('ev');
  const [showTraffic, setShowTraffic] = useState(true);
  const [mapLayer, setMapLayer] = useState<'standard' | 'satellite' | 'density'>('standard');
  const [zoomLevel, setZoomLevel] = useState(1);
  const [calcHours, setCalcHours] = useState(2);
  const [showRateCalc, setShowRateCalc] = useState(false);
  const [isVoiceListening, setIsVoiceListening] = useState(false);

  // Apply quick filters
  const filteredCarparks = carparks.filter((cp) => {
    if (activeFilter === 'ev' && cp.evSummary.freeCount === 0) return false;
    if (activeFilter === 'price' && cp.ratePerFirstHour >= 3.0) return false;
    if (activeFilter === 'grace' && cp.gracePeriodMinutes < 10) return false;
    if (activeFilter === 'clearance' && cp.maxClearance < 2.0) return false;
    return true;
  });

  const isBookmarked = bookmarkedCarparkIds.includes(selectedCarpark.id);
  const calculatedFee = (
    selectedCarpark.ratePerFirstHour +
    Math.max(0, (calcHours - 1) * 2 * selectedCarpark.rateSubsequent)
  ).toFixed(2);

  const handleVoiceSearch = () => {
    setIsVoiceListening(true);
    setTimeout(() => {
      setIsVoiceListening(false);
      setSearchQuery('Marina Bay Sands, 10 Bayfront Ave');
      const mbs = carparks.find((c) => c.id === 'mbfc') || carparks[0];
      onSelectCarpark(mbs);
    }, 1800);
  };

  return (
    <div className={`flex flex-col relative w-full bg-[#f8f9ff] text-[#0b1c30] ${isLandscape ? 'h-full' : 'min-h-screen'}`}>
      {/* TOP HEADER */}
      <header className="sticky top-0 w-full z-40 bg-[#ffffff]/95 backdrop-blur-xl shadow-sm border-b border-[#e5eeff] px-3 py-2 flex items-center justify-between gap-2">
        {/* Brand info */}
        <div className="flex items-center gap-2 min-w-0">
          <img
            alt="ParkSG Brand Logo"
            className="h-7 w-auto object-contain flex-shrink-0"
            src="https://lh3.googleusercontent.com/aida/AEtjO1VbNxf9PLobrPGRxb0T2Z_vTpRPdVgAsvI_BE8_SrTvAFIcUYt16w7YrBLc6pe-G8k1vKhvc4uRih7SvDFky3GprIt21fnZZmhzwatk00u2UaFVokgxyM4tsZ4uS5IFfNHqc9jEDN5YX_GQML-1I_Kx86MJ3WQfPgj7s2x3N7RvukZQEWFENL87NxV3SjuPqWcKL2E_t4ZKEzONrZlf-j5GIDEhM-vDk6BnSGvtpFD_a8NIHYJ1ZoqZP2-I"
          />
          <div className="flex flex-col min-w-0">
            <div className="flex items-center gap-1">
              <span className="font-bold text-sm text-[#0b1c30] tracking-tight truncate">ParkSG</span>
              <span className="text-xs text-[#bbcabf]">·</span>
              <span className="text-xs text-[#3c4a41] font-medium truncate">
                {activeTab === 'map-and-rates'
                  ? 'Map & Rates'
                  : activeTab === 'trip-planner'
                  ? 'Trip Planner'
                  : activeTab === 'ev-hub'
                  ? 'EV Hub'
                  : 'Passes'}
              </span>
            </div>
            <div className="flex items-center gap-1">
              <button
                onClick={onOpenLtaFeed}
                className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded-full bg-[#e5eeff] hover:bg-[#d0e4ff] text-[#006c46] font-mono text-[9px] uppercase tracking-wide cursor-pointer transition-colors"
                title="View LTA DataMall Live API Feed"
              >
                <span className="w-1.5 h-1.5 rounded-full bg-[#00b87a] animate-pulse" />
                LTA & URA Live ▾
              </button>
            </div>
          </div>
        </div>

        {/* Center / Right controls with Top Toggle Button */}
        <div className="flex items-center gap-2 flex-shrink-0">
          {/* Top Button to toggle to Web View */}
          {onToggleViewMode && (
            <button
              onClick={onToggleViewMode}
              className="flex items-center gap-1 px-2.5 py-1 rounded-lg bg-[#006398]/10 hover:bg-[#006398]/20 text-[#006398] text-[11px] font-bold border border-[#006398]/30 transition-all active:scale-95"
              title="Switch to Web View"
            >
              <span className="material-symbols-outlined text-[15px]">desktop_windows</span>
              <span className="hidden sm:inline">Web View</span>
            </button>
          )}

          {/* Vehicle info */}
          <div className="hidden xs:flex flex-col items-end text-right">
            <span className="font-mono text-[10px] text-[#0b1c30] font-semibold leading-tight">
              {USER_VEHICLE.plateNumber}
            </span>
            <span className="font-mono text-[9px] text-[#3c4a41]">Tesla 3</span>
          </div>

          <button
            onClick={() => setActiveTab('passes')}
            aria-label="Vehicle Profile Tesla Model 3"
            className="w-8 h-8 rounded-full hover:bg-[#eff4ff] transition-colors flex items-center justify-center"
            type="button"
          >
            <img
              alt="Profile"
              className="w-7 h-7 rounded-full object-cover ring-2 ring-[#00b87a]/40"
              src="https://lh3.googleusercontent.com/aida/AEtjO1VFmD2SuqZU_DSwx9ZqMHYVjfyBG7xZPOktu-9kGOIIBP3ruq0JqW7xjKPRiMdb9cN0ZlwO7Q5KczHHyqJmFcCtC8jB463iS5AriJeWrS7wSoNEvD3m0deQAxJ7_4FXUeOeMd4dgQqR1mA7j2VK2J5xi5en4Fv_aXSLjUd0sTQUwH7MIt2Ovz4Fe4yvoyKJECumBoM1gkNO4RRc01OO7sPsd3oS99EBOA_V_jsQ73v-7rL0xhT6QBBbDC2o"
            />
          </button>
        </div>
      </header>

      {/* MAIN VIEWPORT CONTENT */}
      <main className={`flex-1 relative w-full ${isLandscape ? 'overflow-hidden flex flex-col' : 'pb-16'}`}>
        {activeTab === 'map-and-rates' && (
          isLandscape ? (
            /* =========================================================================
               LANDSCAPE SPLIT-VIEW (Rotated Phone: Map on Left, Carpark Details on Right)
               ========================================================================= */
            <div className="flex-1 flex overflow-hidden w-full h-[calc(100%-48px)]">
              {/* Left Column: Interactive Map */}
              <div className="w-[52%] h-full relative bg-[#eff4ff] border-r border-[#bbcabf]/30 flex flex-col">
                {/* Search Bar on Map in Landscape */}
                <div className="absolute top-2 left-2 right-14 z-30">
                  <div className="flex items-center bg-white/95 backdrop-blur-md rounded-full shadow-md px-3 py-1.5 gap-2 border border-[#bbcabf]/30">
                    <span className="material-symbols-outlined text-[#006398] text-[18px]">search</span>
                    <input
                      className="w-full bg-transparent text-xs text-[#0b1c30] placeholder:text-[#6c7a70] focus:outline-none truncate"
                      placeholder="Search Marina Bay, CBD..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                    />
                  </div>
                </div>

                <MapCanvas
                  carparks={filteredCarparks}
                  selectedCarpark={selectedCarpark}
                  onSelectCarpark={onSelectCarpark}
                  evOnlyFilter={activeFilter === 'ev'}
                  onToggleEvFilter={() => setActiveFilter((prev) => (prev === 'ev' ? 'all' : 'ev'))}
                  showTraffic={showTraffic}
                  onToggleTraffic={() => setShowTraffic(!showTraffic)}
                  mapLayer={mapLayer}
                  onChangeLayer={() =>
                    setMapLayer((prev) =>
                      prev === 'standard' ? 'satellite' : prev === 'satellite' ? 'density' : 'standard'
                    )
                  }
                  onRecenter={() => {
                    setZoomLevel(1);
                    onSelectCarpark(carparks[0]);
                  }}
                  zoomLevel={zoomLevel}
                  onZoomIn={() => setZoomLevel((z) => Math.min(1.8, Number((z + 0.15).toFixed(2))))}
                  onZoomOut={() => setZoomLevel((z) => Math.max(0.85, Number((z - 0.15).toFixed(2))))}
                  isLandscape={true}
                />
              </div>

              {/* Right Column: Carpark Inspector Panel (Scrollable) */}
              <div className="w-[48%] h-full overflow-y-auto p-3 flex flex-col gap-2.5 bg-white">
                {/* Header */}
                <div className="flex items-start justify-between">
                  <div>
                    <div className="flex items-center gap-1.5 flex-wrap">
                      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-[#006c46]/10 text-[#006c46] font-mono text-[9px] font-semibold">
                        <span className="material-symbols-outlined text-[11px] material-symbols-fill">verified</span>
                        LTA Sensor
                      </span>
                      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-[#cce5ff] text-[#004b73] font-mono text-[9px] font-semibold">
                        {selectedCarpark.evSummary.speedBadge}
                      </span>
                    </div>
                    <h3 className="font-bold text-sm text-[#0b1c30] mt-1">{selectedCarpark.name}</h3>
                    <p className="text-[11px] text-[#3c4a41] truncate">{selectedCarpark.address}</p>
                  </div>
                  <div className="bg-[#eff4ff] px-2 py-1 rounded-lg text-right flex-shrink-0">
                    <span className="font-mono text-xs font-bold text-[#006398]">{selectedCarpark.etaMin} min</span>
                    <span className="font-mono text-[9px] text-[#6c7a70] block">{selectedCarpark.distanceKm} km</span>
                  </div>
                </div>

                {/* 3 Metrics in Landscape */}
                <div className="grid grid-cols-3 gap-1.5 text-center">
                  <div className="bg-[#eff4ff] p-2 rounded-xl border border-[#bbcabf]/20">
                    <span className="font-mono text-[9px] text-[#6c7a70] block">Lots</span>
                    <span className="font-mono text-base font-bold text-[#006c46]">{selectedCarpark.availableLots}</span>
                    <span className="text-[8px] text-[#006c46] block font-semibold">Optimal</span>
                  </div>
                  <div className="bg-[#eff4ff] p-2 rounded-xl border border-[#bbcabf]/20">
                    <span className="font-mono text-[9px] text-[#6c7a70] block">Clearance</span>
                    <span className="font-mono text-base font-bold text-[#0b1c30]">{selectedCarpark.maxClearance.toFixed(2)}m</span>
                    <span className="text-[8px] text-[#3c4a41] block truncate">{selectedCarpark.clearanceNote}</span>
                  </div>
                  <div className="bg-[#eff4ff] p-2 rounded-xl border border-[#bbcabf]/20">
                    <span className="font-mono text-[9px] text-[#6c7a70] block">ERP</span>
                    <span className="font-mono text-base font-bold text-[#006398]">${selectedCarpark.erpGantry.rate.toFixed(2)}</span>
                    <span className="text-[8px] text-[#006398] block">Active</span>
                  </div>
                </div>

                {/* EV Charger Row */}
                <div className="bg-[#e5eeff] p-2.5 rounded-xl border border-[#bbcabf]/25 flex items-center justify-between text-xs">
                  <div>
                    <span className="font-bold text-[#0b1c30] block leading-tight">{selectedCarpark.evSummary.operator}</span>
                    <span className="text-[10px] text-[#3c4a41] font-mono">
                      {selectedCarpark.evSummary.freeCount} / {selectedCarpark.evSummary.totalCount} Free · ${selectedCarpark.evSummary.tariffKwh.toFixed(2)}/kWh
                    </span>
                  </div>
                  <button
                    onClick={() => onOpenReserve(selectedCarpark)}
                    className="px-2.5 py-1 bg-white text-[#006c46] text-[10px] font-bold rounded-full shadow-sm border border-[#00b87a]/30"
                  >
                    Reserve
                  </button>
                </div>

                {/* Tariff */}
                <div className="bg-[#eff4ff] p-2.5 rounded-xl border border-[#bbcabf]/20 text-[11px]">
                  <div className="flex justify-between font-mono font-bold">
                    <span>Weekday Tariff</span>
                    <span className="text-[#006c46]">{selectedCarpark.gracePeriodMinutes}m Grace</span>
                  </div>
                  <p className="mt-0.5 text-xs text-[#0b1c30]">
                    <strong>${selectedCarpark.ratePerFirstHour.toFixed(2)}</strong> 1st hr · <strong>${selectedCarpark.rateSubsequent.toFixed(2)}</strong> /30m
                  </p>
                </div>

                {/* Actions */}
                <div className="flex gap-1.5 mt-auto pt-1">
                  <button
                    onClick={() => onToggleBookmark(selectedCarpark.id)}
                    className={`w-10 h-10 flex items-center justify-center rounded-xl border transition-all ${
                      isBookmarked ? 'bg-[#00b87a] text-white' : 'bg-[#eff4ff] text-[#0b1c30]'
                    }`}
                  >
                    <span className={`material-symbols-outlined text-[18px] ${isBookmarked ? 'material-symbols-fill' : ''}`}>
                      bookmark
                    </span>
                  </button>
                  <button
                    onClick={() => onStartGps(selectedCarpark)}
                    className="flex-1 h-10 px-3 rounded-xl bg-[#00b87a] text-white text-xs font-bold flex items-center justify-center gap-1.5 shadow-md"
                  >
                    <span className="material-symbols-outlined text-[18px]">navigation</span>
                    <span>Start Turn-By-Turn GPS</span>
                  </button>
                </div>
              </div>
            </div>
          ) : (
            /* =========================================================================
               PORTRAIT STANDARD VIEW (Exact layout matching the user's mobile prototype)
               ========================================================================= */
            <div className="flex flex-col w-full relative select-none">
              {/* Interactive Map Viewport Canvas with adaptive responsive height */}
              <div className="relative w-full h-[460px] bg-[#eff4ff] overflow-hidden">
                <MapCanvas
                  carparks={filteredCarparks}
                  selectedCarpark={selectedCarpark}
                  onSelectCarpark={onSelectCarpark}
                  evOnlyFilter={activeFilter === 'ev'}
                  onToggleEvFilter={() => setActiveFilter((prev) => (prev === 'ev' ? 'all' : 'ev'))}
                  showTraffic={showTraffic}
                  onToggleTraffic={() => setShowTraffic(!showTraffic)}
                  mapLayer={mapLayer}
                  onChangeLayer={() =>
                    setMapLayer((prev) =>
                      prev === 'standard' ? 'satellite' : prev === 'satellite' ? 'density' : 'standard'
                    )
                  }
                  onRecenter={() => {
                    setZoomLevel(1);
                    onSelectCarpark(carparks[0]);
                  }}
                  zoomLevel={zoomLevel}
                  onZoomIn={() => setZoomLevel((z) => Math.min(1.8, Number((z + 0.15).toFixed(2))))}
                  onZoomOut={() => setZoomLevel((z) => Math.max(0.85, Number((z - 0.15).toFixed(2))))}
                />

                {/* FLOATING TOP SEARCH & FILTERS CONTAINER */}
                <div className="absolute top-0 inset-x-0 z-30 p-3 flex flex-col gap-2 bg-gradient-to-b from-[#f8f9ff]/95 via-[#f8f9ff]/75 to-transparent">
                  {/* Search Input Pill */}
                  <div className="w-full flex items-center bg-white rounded-full shadow-md px-3.5 py-2 gap-2 border border-[#bbcabf]/30">
                    <span className="material-symbols-outlined text-[#006398] text-[20px] flex-shrink-0">
                      search
                    </span>
                    <input
                      className="w-full bg-transparent text-xs sm:text-sm text-[#0b1c30] placeholder:text-[#6c7a70] focus:outline-none truncate font-medium"
                      placeholder="Search Marina Bay, Raffles Place, CBD..."
                      type="text"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                    />
                    {searchQuery && (
                      <button
                        onClick={() => setSearchQuery('')}
                        className="text-[#6c7a70] hover:text-[#0b1c30] p-0.5"
                      >
                        <span className="material-symbols-outlined text-[16px]">cancel</span>
                      </button>
                    )}
                    <button
                      aria-label="Voice search"
                      onClick={handleVoiceSearch}
                      className={`min-w-[28px] min-h-[28px] flex items-center justify-center rounded-full transition-colors ${
                        isVoiceListening ? 'bg-red-500 text-white animate-pulse' : 'bg-[#e5eeff] text-[#3c4a41]'
                      }`}
                      type="button"
                    >
                      <span className="material-symbols-outlined text-[16px]">mic</span>
                    </button>
                  </div>

                  {/* Quick Filter Pills (Horizontal Scroll) */}
                  <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar py-0.5 -mx-3 px-3">
                    <button
                      onClick={() => setActiveFilter(activeFilter === 'ev' ? 'all' : 'ev')}
                      className={`flex-shrink-0 flex items-center gap-1 px-3 py-1.5 rounded-full font-mono text-[11px] shadow-sm transition-all ${
                        activeFilter === 'ev'
                          ? 'bg-[#00b87a] text-white font-bold'
                          : 'bg-white text-[#0b1c30] border border-[#bbcabf]/30'
                      }`}
                      type="button"
                    >
                      <span className="material-symbols-outlined text-[15px] material-symbols-fill">bolt</span>
                      <span>EV Available (34)</span>
                    </button>

                    <button
                      onClick={() => setActiveFilter(activeFilter === 'price' ? 'all' : 'price')}
                      className={`flex-shrink-0 flex items-center gap-1 px-3 py-1.5 rounded-full font-mono text-[11px] shadow-sm transition-all ${
                        activeFilter === 'price'
                          ? 'bg-[#006398] text-white font-bold'
                          : 'bg-white text-[#0b1c30] border border-[#bbcabf]/30'
                      }`}
                      type="button"
                    >
                      <span className="material-symbols-outlined text-[15px]">payments</span>
                      <span>&lt; $3.00/hr</span>
                    </button>

                    <button
                      onClick={() => setActiveFilter(activeFilter === 'grace' ? 'all' : 'grace')}
                      className={`flex-shrink-0 flex items-center gap-1 px-3 py-1.5 rounded-full font-mono text-[11px] shadow-sm transition-all ${
                        activeFilter === 'grace'
                          ? 'bg-[#006c46] text-white font-bold'
                          : 'bg-white text-[#0b1c30] border border-[#bbcabf]/30'
                      }`}
                      type="button"
                    >
                      <span className="material-symbols-outlined text-[15px]">timer</span>
                      <span>Grace ≥ 10m</span>
                    </button>

                    <button
                      onClick={() => setActiveFilter(activeFilter === 'clearance' ? 'all' : 'clearance')}
                      className={`flex-shrink-0 flex items-center gap-1 px-3 py-1.5 rounded-full font-mono text-[11px] shadow-sm transition-all ${
                        activeFilter === 'clearance'
                          ? 'bg-[#006c46] text-white font-bold'
                          : 'bg-white text-[#0b1c30] border border-[#bbcabf]/30'
                      }`}
                      type="button"
                    >
                      <span className="material-symbols-outlined text-[15px]">height</span>
                      <span>Clearance &gt; 2.0m</span>
                    </button>
                  </div>
                </div>
              </div>

              {/* SLIDING BOTTOM SHEET CARD (Anchored securely above tab bar) */}
              <div className="w-full -mt-10 z-30 bg-[#ffffff] rounded-t-3xl shadow-xl flex flex-col p-4 pb-6 gap-3.5 border-t border-[#bbcabf]/20">
                <div className="w-full flex justify-center py-0.5">
                  <div className="w-10 h-1.5 bg-[#bbcabf] rounded-full" />
                </div>

                {/* Selected Carpark Header Section */}
                <div className="flex items-start justify-between gap-2">
                  <div className="flex flex-col min-w-0">
                    <div className="flex items-center gap-1.5 flex-wrap">
                      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-[#006c46]/10 text-[#006c46] font-mono text-[10px] font-semibold">
                        <span className="material-symbols-outlined text-[13px] material-symbols-fill">
                          verified
                        </span>
                        LTA Sensor Verified
                      </span>
                      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-[#cce5ff] text-[#004b73] font-mono text-[10px] font-semibold">
                        <span className="material-symbols-outlined text-[13px]">bolt</span>
                        {selectedCarpark.evSummary.speedBadge}
                      </span>
                    </div>
                    <h2 className="text-lg font-bold text-[#0b1c30] mt-1 tracking-tight truncate">
                      {selectedCarpark.name}
                    </h2>
                    <p className="text-xs text-[#3c4a41] flex items-center gap-1 truncate mt-0.5">
                      <span className="material-symbols-outlined text-[15px] text-[#6c7a70]">
                        location_on
                      </span>
                      {selectedCarpark.address}
                    </p>
                  </div>

                  <div className="flex flex-col items-end flex-shrink-0 bg-[#eff4ff] px-2.5 py-1.5 rounded-xl text-right border border-[#bbcabf]/20">
                    <span className="font-mono text-xs font-bold text-[#006398]">
                      {selectedCarpark.etaMin} min
                    </span>
                    <span className="font-mono text-[10px] text-[#6c7a70]">
                      {selectedCarpark.distanceKm} km away
                    </span>
                  </div>
                </div>

                {/* Key Telemetry Metrics Matrix */}
                <div className="grid grid-cols-3 gap-2">
                  <div className="flex flex-col bg-[#eff4ff] rounded-xl p-2.5 border border-[#bbcabf]/20">
                    <span className="font-mono text-[10px] text-[#6c7a70] font-medium">Available Lots</span>
                    <div className="flex items-baseline gap-1 mt-0.5">
                      <span className="font-mono text-xl font-bold text-[#006c46]">
                        {selectedCarpark.availableLots}
                      </span>
                      <span className="font-mono text-[10px] text-[#6c7a70]">
                        / {selectedCarpark.totalLots}
                      </span>
                    </div>
                    <span className="inline-flex items-center gap-1 font-mono text-[10px] text-[#006c46] font-semibold mt-1">
                      <span className="w-1.5 h-1.5 rounded-full bg-[#00b87a] animate-pulse" />
                      {selectedCarpark.status === 'optimal' ? 'Optimal' : selectedCarpark.status === 'moderate' ? 'Moderate' : 'Almost Full'}
                    </span>
                  </div>

                  <div className="flex flex-col bg-[#eff4ff] rounded-xl p-2.5 border border-[#bbcabf]/20">
                    <span className="font-mono text-[10px] text-[#6c7a70] font-medium">Max Clearance</span>
                    <div className="flex items-baseline gap-1 mt-0.5">
                      <span className="font-mono text-xl font-bold text-[#0b1c30]">
                        {selectedCarpark.maxClearance.toFixed(2)}
                      </span>
                      <span className="font-mono text-xs text-[#3c4a41]">m</span>
                    </div>
                    <span className="font-mono text-[10px] text-[#3c4a41] mt-1 truncate">
                      {selectedCarpark.clearanceNote}
                    </span>
                  </div>

                  <div className="flex flex-col bg-[#eff4ff] rounded-xl p-2.5 border border-[#bbcabf]/20">
                    <span className="font-mono text-[10px] text-[#6c7a70] font-medium">ERP Gantry</span>
                    <div className="flex items-baseline gap-1 mt-0.5">
                      <span className="font-mono text-xl font-bold text-[#006398]">
                        ${selectedCarpark.erpGantry.rate.toFixed(2)}
                      </span>
                    </div>
                    <span className="font-mono text-[10px] text-[#006398] font-medium mt-1 truncate">
                      Active till {selectedCarpark.erpGantry.activeTill}
                    </span>
                  </div>
                </div>

                {/* EV Charging Status Card */}
                <div className="bg-[#e5eeff] rounded-xl p-3.5 flex flex-col gap-2 border border-[#bbcabf]/25">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 rounded-lg bg-[#00b87a] text-white flex items-center justify-center shadow-sm">
                        <span className="material-symbols-outlined text-[18px]">ev_station</span>
                      </div>
                      <div>
                        <span className="text-xs font-bold text-[#0b1c30] leading-tight block truncate max-w-[180px]">
                          {selectedCarpark.evSummary.operator}
                        </span>
                        <span className="text-[11px] text-[#3c4a41] block truncate max-w-[180px]">
                          {selectedCarpark.evSummary.locationDetail}
                        </span>
                      </div>
                    </div>
                    <button
                      onClick={() => onOpenReserve(selectedCarpark)}
                      className="px-3 py-1.5 rounded-full bg-white text-[#006c46] font-mono text-[11px] font-bold shadow-sm active:scale-95 transition-transform border border-[#00b87a]/30"
                      type="button"
                    >
                      Reserve Plug
                    </button>
                  </div>

                  <div className="flex items-center justify-between pt-1 mt-0.5 text-[#3c4a41] text-[11px]">
                    <div className="flex items-center gap-1.5">
                      <span className="w-2 h-2 rounded-full bg-[#00b87a]" />
                      <span className="font-mono font-bold text-[#0b1c30]">
                        {selectedCarpark.evSummary.freeCount} / {selectedCarpark.evSummary.totalCount} Chargers Free
                      </span>
                      <span className="font-mono text-[10px] text-[#6c7a70]">
                        {selectedCarpark.evSummary.powerDesc}
                      </span>
                    </div>
                    <span className="font-mono font-semibold text-[#0b1c30]">
                      Tariff: ${selectedCarpark.evSummary.tariffKwh.toFixed(2)}/kWh
                    </span>
                  </div>
                </div>

                {/* Rate Structure */}
                <div className="flex flex-col bg-[#eff4ff] rounded-xl p-3.5 gap-1 border border-[#bbcabf]/20">
                  <div className="flex items-center justify-between">
                    <span className="font-mono text-[11px] font-bold text-[#0b1c30]">
                      Weekday Tariff (07:00 - {selectedCarpark.eveningStartTime})
                    </span>
                    <span className="font-mono text-[10px] font-bold text-[#006c46] bg-[#00b87a]/15 px-2 py-0.5 rounded-full">
                      {selectedCarpark.gracePeriodMinutes}m Grace Period
                    </span>
                  </div>
                  <p className="text-xs text-[#0b1c30]">
                    <strong className="font-bold text-[#0b1c30]">
                      ${selectedCarpark.ratePerFirstHour.toFixed(2)}
                    </strong>{' '}
                    for 1st hour ·{' '}
                    <strong className="font-bold text-[#0b1c30]">
                      ${selectedCarpark.rateSubsequent.toFixed(2)}
                    </strong>{' '}
                    per subsequent {selectedCarpark.subsequentIntervalMin} mins
                  </p>
                  <div className="flex items-center justify-between pt-0.5">
                    <p className="text-[11px] text-[#6c7a70]">
                      Per-minute charging applies after 1st hr. Evening flat rate $
                      {selectedCarpark.eveningFlatRate.toFixed(2)} entry after{' '}
                      {selectedCarpark.eveningStartTime}.
                    </p>
                    <button
                      onClick={() => setShowRateCalc(!showRateCalc)}
                      className="text-[11px] font-mono font-semibold text-[#006398] hover:underline flex-shrink-0 ml-2"
                    >
                      {showRateCalc ? 'Hide Calc' : 'Estimate Cost'}
                    </button>
                  </div>

                  {showRateCalc && (
                    <div className="mt-2 pt-2 border-t border-[#bbcabf]/30 flex flex-col gap-2">
                      <div className="flex items-center justify-between text-xs">
                        <span className="text-[#3c4a41]">Estimated Stay:</span>
                        <div className="flex items-center gap-1 font-mono">
                          {[1, 2, 3, 4].map((hr) => (
                            <button
                              key={hr}
                              onClick={() => setCalcHours(hr)}
                              className={`px-2 py-0.5 rounded text-xs font-semibold ${
                                calcHours === hr
                                  ? 'bg-[#006c46] text-white'
                                  : 'bg-white text-[#0b1c30] border border-[#bbcabf]/40'
                              }`}
                            >
                              {hr}h
                            </button>
                          ))}
                        </div>
                      </div>
                      <div className="flex items-center justify-between bg-white p-2 rounded-lg text-xs font-mono">
                        <span>Total Estimated Fee:</span>
                        <span className="font-bold text-[#006c46] text-sm">${calculatedFee}</span>
                      </div>
                    </div>
                  )}
                </div>

                {/* Primary Action CTA Row */}
                <div className="flex items-center gap-2 pt-1">
                  <button
                    aria-label="Save Carpark"
                    onClick={() => onToggleBookmark(selectedCarpark.id)}
                    className={`w-12 h-12 flex-shrink-0 flex items-center justify-center rounded-xl transition-all ${
                      isBookmarked
                        ? 'bg-[#00b87a] text-white shadow-sm'
                        : 'bg-[#eff4ff] text-[#0b1c30] hover:bg-[#e5eeff]'
                    }`}
                    type="button"
                  >
                    <span
                      className={`material-symbols-outlined text-[22px] ${
                        isBookmarked ? 'material-symbols-fill' : ''
                      }`}
                    >
                      bookmark
                    </span>
                  </button>

                  <button
                    onClick={() => onStartGps(selectedCarpark)}
                    className="flex-1 h-12 px-4 rounded-xl bg-[#00b87a] text-white font-bold text-sm flex items-center justify-center gap-2 shadow-md hover:bg-[#006c46] transition-colors active:scale-[0.99]"
                    type="button"
                  >
                    <span className="material-symbols-outlined text-[20px]">navigation</span>
                    <span>Start Turn-By-Turn GPS</span>
                  </button>
                </div>
              </div>
            </div>
          )
        )}

        {/* Tab 2: Trip Planner */}
        {activeTab === 'trip-planner' && (
          <div className="overflow-y-auto h-full">
            <TripPlannerTab
              carparks={carparks}
              onSelectCarpark={(cp) => {
                onSelectCarpark(cp);
                setActiveTab('map-and-rates');
              }}
              onStartGps={onStartGps}
            />
          </div>
        )}

        {/* Tab 3: EV Hub */}
        {activeTab === 'ev-hub' && (
          <div className="overflow-y-auto h-full">
            <EvHubTab
              carparks={carparks}
              onOpenReserve={onOpenReserve}
              onStartGps={onStartGps}
            />
          </div>
        )}

        {/* Tab 4: Passes */}
        {activeTab === 'passes' && (
          <div className="overflow-y-auto h-full">
            <PassesTab obuBalance={obuBalance} onOpenTopUp={onOpenTopUp} />
          </div>
        )}
      </main>

      {/* FIXED BOTTOM NAVIGATION BAR */}
      <nav className="fixed bottom-0 w-full z-40 bg-[#ffffff]/95 backdrop-blur-xl shadow-[0_-2px_12px_rgba(11,28,48,0.06)] border-t border-[#e5eeff]">
        <div className="h-14 px-2 flex items-center justify-around max-w-md mx-auto">
          <button
            onClick={() => setActiveTab('map-and-rates')}
            className={`flex flex-col items-center justify-center min-w-[50px] min-h-[40px] px-1 transition-colors ${
              activeTab === 'map-and-rates' ? 'text-[#006c46] font-bold' : 'text-[#6c7a70] hover:text-[#0b1c30]'
            }`}
            type="button"
          >
            <span
              className={`material-symbols-outlined text-[20px] ${
                activeTab === 'map-and-rates' ? 'material-symbols-fill' : ''
              }`}
            >
              local_parking
            </span>
            <span className="font-mono text-[9px] mt-0.5 tracking-tight">Map & Rates</span>
          </button>

          <button
            onClick={() => setActiveTab('trip-planner')}
            className={`flex flex-col items-center justify-center min-w-[50px] min-h-[40px] px-1 transition-colors ${
              activeTab === 'trip-planner' ? 'text-[#006c46] font-bold' : 'text-[#6c7a70] hover:text-[#0b1c30]'
            }`}
            type="button"
          >
            <span
              className={`material-symbols-outlined text-[20px] ${
                activeTab === 'trip-planner' ? 'material-symbols-fill' : ''
              }`}
            >
              alt_route
            </span>
            <span className="font-mono text-[9px] mt-0.5 tracking-tight">Trip Planner</span>
          </button>

          <button
            onClick={() => setActiveTab('ev-hub')}
            className={`flex flex-col items-center justify-center min-w-[50px] min-h-[40px] px-1 transition-colors ${
              activeTab === 'ev-hub' ? 'text-[#006c46] font-bold' : 'text-[#6c7a70] hover:text-[#0b1c30]'
            }`}
            type="button"
          >
            <span
              className={`material-symbols-outlined text-[20px] ${
                activeTab === 'ev-hub' ? 'material-symbols-fill' : ''
              }`}
            >
              ev_station
            </span>
            <span className="font-mono text-[9px] mt-0.5 tracking-tight">EV Hub</span>
          </button>

          <button
            onClick={() => setActiveTab('passes')}
            className={`flex flex-col items-center justify-center min-w-[50px] min-h-[40px] px-1 transition-colors ${
              activeTab === 'passes' ? 'text-[#006c46] font-bold' : 'text-[#6c7a70] hover:text-[#0b1c30]'
            }`}
            type="button"
          >
            <span
              className={`material-symbols-outlined text-[20px] ${
                activeTab === 'passes' ? 'material-symbols-fill' : ''
              }`}
            >
              badge
            </span>
            <span className="font-mono text-[9px] mt-0.5 tracking-tight">Passes</span>
          </button>
        </div>
      </nav>
    </div>
  );
};
