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
  onSwitchToMobile: () => void;
  onOpenLtaFeed?: () => void;
}

export const DesktopDashboardView: React.FC<Props> = ({
  carparks,
  selectedCarpark,
  onSelectCarpark,
  onStartGps,
  onOpenReserve,
  onOpenTopUp,
  obuBalance,
  bookmarkedCarparkIds,
  onToggleBookmark,
  onSwitchToMobile,
  onOpenLtaFeed,
}) => {
  const [navTab, setNavTab] = useState<'map' | 'planner' | 'ev' | 'passes'>('map');
  const [searchQuery, setSearchQuery] = useState('');
  const [activeFilter, setActiveFilter] = useState<'all' | 'ev' | 'price' | 'grace' | 'clearance'>('all');
  const [showTraffic, setShowTraffic] = useState(true);
  const [mapLayer, setMapLayer] = useState<'standard' | 'satellite' | 'density'>('standard');
  const [zoomLevel, setZoomLevel] = useState(1);
  const [calcHours, setCalcHours] = useState(2);
  const [showLeftSidebar, setShowLeftSidebar] = useState(true);
  const [showRightInspector, setShowRightInspector] = useState(true);

  const filteredCarparks = carparks.filter((cp) => {
    if (searchQuery && !cp.name.toLowerCase().includes(searchQuery.toLowerCase()) && !cp.area.toLowerCase().includes(searchQuery.toLowerCase())) {
      return false;
    }
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

  return (
    <div className="flex flex-col min-h-screen bg-[#f8f9ff] text-[#0b1c30]">
      {/* 3-ZONE TOP BAR CONTRACT */}
      <header className="sticky top-0 z-50 h-16 bg-white/95 backdrop-blur-md border-b border-[#e5eeff] px-4 lg:px-6 flex items-center justify-between shadow-sm">
        {/* Zone 1: Single text element brand mark with logo */}
        <div className="flex items-center gap-3">
          <img
            alt="ParkSG Brand Logo"
            className="h-8 lg:h-9 w-auto object-contain flex-shrink-0"
            src="https://lh3.googleusercontent.com/aida/AEtjO1VbNxf9PLobrPGRxb0T2Z_vTpRPdVgAsvI_BE8_SrTvAFIcUYt16w7YrBLc6pe-G8k1vKhvc4uRih7SvDFky3GprIt21fnZZmhzwatk00u2UaFVokgxyM4tsZ4uS5IFfNHqc9jEDN5YX_GQML-1I_Kx86MJ3WQfPgj7s2x3N7RvukZQEWFENL87NxV3SjuPqWcKL2E_t4ZKEzONrZlf-j5GIDEhM-vDk6BnSGvtpFD_a8NIHYJ1ZoqZP2-I"
          />
          <div className="flex items-baseline gap-2">
            <span className="text-lg lg:text-xl font-bold text-[#0b1c30] tracking-tight">ParkSG</span>
            <button
              onClick={onOpenLtaFeed}
              className="hidden sm:inline-flex items-center gap-1.5 text-xs font-semibold text-[#006c46] bg-[#00b87a]/15 hover:bg-[#00b87a]/25 px-2.5 py-0.5 rounded-full font-mono uppercase tracking-wider cursor-pointer transition-colors"
              title="View LTA DataMall Live API Feed"
            >
              <span className="w-1.5 h-1.5 rounded-full bg-[#00b87a] animate-pulse" />
              LTA & URA Live ▾
            </button>
          </div>
        </div>

        {/* Zone 2: Navigation Links (Clean text with active indicator) */}
        <nav className="hidden md:flex items-center gap-4 lg:gap-6">
          <button
            onClick={() => setNavTab('map')}
            className={`text-xs lg:text-sm font-semibold transition-colors pb-1 border-b-2 flex items-center gap-1.5 ${
              navTab === 'map'
                ? 'text-[#006c46] border-[#00b87a]'
                : 'text-[#3c4a41] border-transparent hover:text-[#0b1c30]'
            }`}
          >
            <span className="material-symbols-outlined text-[17px]">local_parking</span>
            Live Map & Rates
          </button>
          <button
            onClick={() => setNavTab('planner')}
            className={`text-xs lg:text-sm font-semibold transition-colors pb-1 border-b-2 flex items-center gap-1.5 ${
              navTab === 'planner'
                ? 'text-[#006c46] border-[#00b87a]'
                : 'text-[#3c4a41] border-transparent hover:text-[#0b1c30]'
            }`}
          >
            <span className="material-symbols-outlined text-[17px]">alt_route</span>
            Trip Planner
          </button>
          <button
            onClick={() => setNavTab('ev')}
            className={`text-xs lg:text-sm font-semibold transition-colors pb-1 border-b-2 flex items-center gap-1.5 ${
              navTab === 'ev'
                ? 'text-[#006c46] border-[#00b87a]'
                : 'text-[#3c4a41] border-transparent hover:text-[#0b1c30]'
            }`}
          >
            <span className="material-symbols-outlined text-[17px]">ev_station</span>
            EV Fast Charging
          </button>
          <button
            onClick={() => setNavTab('passes')}
            className={`text-xs lg:text-sm font-semibold transition-colors pb-1 border-b-2 flex items-center gap-1.5 ${
              navTab === 'passes'
                ? 'text-[#006c46] border-[#00b87a]'
                : 'text-[#3c4a41] border-transparent hover:text-[#0b1c30]'
            }`}
          >
            <span className="material-symbols-outlined text-[17px]">badge</span>
            Passes & OBU
          </button>
        </nav>

        {/* Zone 3: Actions & Prominent Mobile View Toggle Button */}
        <div className="flex items-center gap-2 lg:gap-3">
          {/* LTA Live Feed Button */}
          {onOpenLtaFeed && (
            <button
              onClick={onOpenLtaFeed}
              className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-[#eff4ff] hover:bg-[#dce9ff] text-[#006398] text-xs font-bold transition-all border border-[#006398]/30 shadow-sm active:scale-95"
              title="Inspect LTA DataMall Live API Stream"
            >
              <span className="material-symbols-outlined text-[16px]">api</span>
              <span>LTA Feed</span>
            </button>
          )}

          {/* Prominent Button on Top to Toggle Between Views */}
          <button
            onClick={onSwitchToMobile}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-[#006c46] hover:bg-[#005234] text-white text-xs font-bold transition-all shadow-md active:scale-95"
            title="Switch to Mobile App View"
          >
            <span className="material-symbols-outlined text-[16px]">smartphone</span>
            <span>Mobile App View</span>
          </button>

          {/* Vehicle Telemetry Chip */}
          <div className="hidden xl:flex items-center gap-2 bg-[#eff4ff] px-3 py-1 rounded-xl border border-[#bbcabf]/30">
            <div className="w-2 h-2 rounded-full bg-[#00b87a] animate-pulse" />
            <span className="font-mono text-xs font-bold text-[#0b1c30]">{USER_VEHICLE.plateNumber}</span>
            <span className="text-[11px] text-[#6c7a70] font-mono">OBU: ${obuBalance.toFixed(2)}</span>
          </div>

          {/* Profile Avatar */}
          <button
            onClick={() => setNavTab('passes')}
            className="w-8 h-8 lg:w-9 lg:h-9 rounded-full ring-2 ring-[#00b87a]/40 overflow-hidden hover:opacity-90 transition-opacity"
            title="Vehicle Profile"
          >
            <img
              alt="Profile"
              className="w-full h-full object-cover"
              src="https://lh3.googleusercontent.com/aida/AEtjO1VFmD2SuqZU_DSwx9ZqMHYVjfyBG7xZPOktu-9kGOIIBP3ruq0JqW7xjKPRiMdb9cN0ZlwO7Q5KczHHyqJmFcCtC8jB463iS5AriJeWrS7wSoNEvD3m0deQAxJ7_4FXUeOeMd4dgQqR1mA7j2VK2J5xi5en4Fv_aXSLjUd0sTQUwH7MIt2Ovz4Fe4yvoyKJECumBoM1gkNO4RRc01OO7sPsd3oS99EBOA_V_jsQ73v-7rL0xhT6QBBbDC2o"
            />
          </button>
        </div>
      </header>

      {/* BODY CONTENT */}
      {navTab === 'map' && (
        <div className="flex-1 flex overflow-hidden h-[calc(100vh-64px)] relative">
          {/* LEFT SIDEBAR: Carpark List & Live Directory */}
          {showLeftSidebar && (
            <aside className="w-80 lg:w-96 flex-shrink-0 bg-white border-r border-[#e5eeff] flex flex-col h-full z-20 shadow-md transition-all">
              {/* Search and Filters Header */}
              <div className="p-3.5 border-b border-[#e5eeff] flex flex-col gap-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-[#0b1c30] uppercase tracking-wider font-mono">
                    CBD Carparks ({filteredCarparks.length})
                  </span>
                  <button
                    onClick={() => setShowLeftSidebar(false)}
                    className="text-[#6c7a70] hover:text-[#0b1c30] p-1 rounded-md text-xs lg:hidden"
                    title="Collapse Sidebar"
                  >
                    <span className="material-symbols-outlined text-[16px]">close</span>
                  </button>
                </div>

                <div className="relative">
                  <span className="material-symbols-outlined text-[#006398] text-[18px] absolute left-3 top-2.5">
                    search
                  </span>
                  <input
                    type="text"
                    placeholder="Search carparks, buildings..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full bg-[#f8f9ff] border border-[#bbcabf]/40 rounded-xl pl-9 pr-3 py-1.5 text-xs text-[#0b1c30] placeholder:text-[#6c7a70] focus:outline-none focus:border-[#006398]"
                  />
                </div>

                {/* Quick Filter Buttons */}
                <div className="flex items-center gap-1 overflow-x-auto no-scrollbar py-0.5">
                  <button
                    onClick={() => setActiveFilter('all')}
                    className={`px-2.5 py-1 rounded-lg text-xs font-semibold whitespace-nowrap transition-all ${
                      activeFilter === 'all'
                        ? 'bg-[#006c46] text-white'
                        : 'bg-[#eff4ff] text-[#3c4a41] hover:bg-[#e5eeff]'
                    }`}
                  >
                    All
                  </button>
                  <button
                    onClick={() => setActiveFilter(activeFilter === 'ev' ? 'all' : 'ev')}
                    className={`px-2.5 py-1 rounded-lg text-xs font-semibold whitespace-nowrap flex items-center gap-1 transition-all ${
                      activeFilter === 'ev'
                        ? 'bg-[#00b87a] text-white font-bold'
                        : 'bg-[#eff4ff] text-[#3c4a41] hover:bg-[#e5eeff]'
                    }`}
                  >
                    <span className="material-symbols-outlined text-[13px]">bolt</span>
                    EV Ready
                  </button>
                  <button
                    onClick={() => setActiveFilter(activeFilter === 'price' ? 'all' : 'price')}
                    className={`px-2.5 py-1 rounded-lg text-xs font-semibold whitespace-nowrap transition-all ${
                      activeFilter === 'price'
                        ? 'bg-[#006398] text-white'
                        : 'bg-[#eff4ff] text-[#3c4a41] hover:bg-[#e5eeff]'
                    }`}
                  >
                    &lt; $3/hr
                  </button>
                  <button
                    onClick={() => setActiveFilter(activeFilter === 'clearance' ? 'all' : 'clearance')}
                    className={`px-2.5 py-1 rounded-lg text-xs font-semibold whitespace-nowrap transition-all ${
                      activeFilter === 'clearance'
                        ? 'bg-[#006c46] text-white'
                        : 'bg-[#eff4ff] text-[#3c4a41] hover:bg-[#e5eeff]'
                    }`}
                  >
                    &gt; 2.0m SUV
                  </button>
                </div>
              </div>

              {/* Carpark Items Scroll List */}
              <div className="flex-1 overflow-y-auto p-3 flex flex-col gap-2">
                {filteredCarparks.map((cp) => {
                  const isSelected = cp.id === selectedCarpark.id;
                  const occupancyPct = Math.round(((cp.totalLots - cp.availableLots) / cp.totalLots) * 100);

                  return (
                    <div
                      key={cp.id}
                      onClick={() => onSelectCarpark(cp)}
                      className={`p-3 rounded-xl border cursor-pointer transition-all ${
                        isSelected
                          ? 'bg-[#eff4ff] border-[#00b87a] ring-2 ring-[#00b87a]/30 shadow-sm'
                          : 'bg-white border-[#bbcabf]/30 hover:border-[#006398]'
                      }`}
                    >
                      <div className="flex items-start justify-between">
                        <div className="min-w-0 pr-2">
                          <span className="text-[9px] font-mono font-bold uppercase tracking-wider text-[#6c7a70] block">
                            {cp.area}
                          </span>
                          <h4 className="font-bold text-xs lg:text-sm text-[#0b1c30] truncate">{cp.name}</h4>
                        </div>
                        <div className="text-right flex-shrink-0">
                          <span className="font-mono text-sm lg:text-base font-bold text-[#006c46]">
                            ${cp.ratePerFirstHour.toFixed(2)}
                          </span>
                          <span className="text-[9px] text-[#6c7a70] block font-mono">/ 1st hr</span>
                        </div>
                      </div>

                      {/* Occupancy Bar */}
                      <div className="mt-2 flex items-center justify-between text-[11px] font-mono">
                        <span className="text-[#3c4a41]">
                          <strong className="text-[#006c46]">{cp.availableLots}</strong> lots vacant
                        </span>
                        <span className="text-[10px] text-[#6c7a70]">{occupancyPct}% full</span>
                      </div>
                      <div className="w-full bg-[#e5eeff] rounded-full h-1.5 mt-1 overflow-hidden">
                        <div
                          className={`h-full rounded-full ${
                            occupancyPct > 90
                              ? 'bg-[#ba1a1a]'
                              : occupancyPct > 70
                              ? 'bg-[#f59e0b]'
                              : 'bg-[#00b87a]'
                          }`}
                          style={{ width: `${occupancyPct}%` }}
                        />
                      </div>

                      {/* Meta row */}
                      <div className="mt-2 pt-1.5 border-t border-[#e5eeff] flex items-center justify-between text-[10px] text-[#3c4a41]">
                        <span className="flex items-center gap-1 font-mono">
                          <span className="material-symbols-outlined text-[#006398] text-[13px]">bolt</span>
                          {cp.evSummary.freeCount} EV Slots
                        </span>
                        <span className="font-mono text-[#6c7a70]">
                          {cp.distanceKm} km · {cp.etaMin} min
                        </span>
                        <span className="font-mono font-semibold text-[#006398]">
                          ERP ${cp.erpGantry.rate.toFixed(2)}
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </aside>
          )}

          {/* CENTER: Expansive Vector Map Canvas */}
          <div className="flex-1 relative h-full bg-[#eff4ff]">
            {/* Top Toolbar overlay with Sidebar Toggle buttons */}
            <div className="absolute top-3 left-3 z-30 flex items-center gap-2">
              {!showLeftSidebar && (
                <button
                  onClick={() => setShowLeftSidebar(true)}
                  className="bg-white/95 backdrop-blur-md px-3 py-1.5 rounded-xl shadow-md border border-[#bbcabf]/30 text-xs font-bold text-[#0b1c30] flex items-center gap-1.5 hover:bg-[#eff4ff] transition-all"
                >
                  <span className="material-symbols-outlined text-[16px]">menu</span>
                  <span>Show Carparks</span>
                </button>
              )}

              {/* Status Legend */}
              <div className="hidden sm:flex bg-white/90 backdrop-blur-md border border-[#bbcabf]/30 rounded-xl px-3 py-1.5 shadow-md items-center gap-3 text-[11px] font-mono">
                <div className="flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-[#00b87a]" />
                  <span>Available</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-[#ba1a1a]" />
                  <span>Almost Full</span>
                </div>
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
            />

            {/* Toggle Details button on map if inspector is collapsed */}
            {!showRightInspector && (
              <button
                onClick={() => setShowRightInspector(true)}
                className="absolute top-3 right-16 z-30 bg-white/95 backdrop-blur-md px-3 py-1.5 rounded-xl shadow-md border border-[#bbcabf]/30 text-xs font-bold text-[#006c46] flex items-center gap-1.5 hover:bg-[#eff4ff]"
              >
                <span className="material-symbols-outlined text-[16px]">info</span>
                <span>Inspect {selectedCarpark.name}</span>
              </button>
            )}
          </div>

          {/* RIGHT PANEL: Carpark Inspector & Rate Calculator */}
          {showRightInspector && (
            <aside className="w-80 lg:w-[380px] xl:w-[400px] flex-shrink-0 bg-white border-l border-[#e5eeff] flex flex-col h-full overflow-y-auto p-4 lg:p-5 gap-3.5 z-20 shadow-md">
              {/* Header with verified badges & close button */}
              <div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-1.5 flex-wrap">
                    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-[#006c46]/10 text-[#006c46] font-mono text-[10px] font-semibold">
                      <span className="material-symbols-outlined text-[12px] material-symbols-fill">verified</span>
                      LTA Sensor Verified
                    </span>
                    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-[#cce5ff] text-[#004b73] font-mono text-[10px] font-semibold">
                      <span className="material-symbols-outlined text-[12px]">bolt</span>
                      {selectedCarpark.evSummary.speedBadge}
                    </span>
                  </div>
                  <button
                    onClick={() => setShowRightInspector(false)}
                    className="text-[#6c7a70] hover:text-[#0b1c30] p-1 rounded-md text-xs lg:hidden"
                    title="Collapse Inspector"
                  >
                    <span className="material-symbols-outlined text-[16px]">close</span>
                  </button>
                </div>

                <h2 className="text-lg lg:text-xl font-bold text-[#0b1c30] mt-1.5">{selectedCarpark.name}</h2>
                <p className="text-xs text-[#3c4a41] flex items-center gap-1 mt-0.5">
                  <span className="material-symbols-outlined text-[15px] text-[#6c7a70]">location_on</span>
                  {selectedCarpark.address}
                </p>
              </div>

              {/* 3 Metrics Matrix */}
              <div className="grid grid-cols-3 gap-2">
                <div className="bg-[#eff4ff] rounded-xl p-2.5 border border-[#bbcabf]/20">
                  <span className="font-mono text-[9px] text-[#6c7a70] uppercase block">Available Lots</span>
                  <div className="flex items-baseline gap-1 mt-0.5">
                    <span className="font-mono text-xl font-bold text-[#006c46]">
                      {selectedCarpark.availableLots}
                    </span>
                    <span className="font-mono text-[10px] text-[#6c7a70]">/ {selectedCarpark.totalLots}</span>
                  </div>
                  <span className="font-mono text-[9px] text-[#006c46] font-semibold mt-1 block">
                    ● Optimal
                  </span>
                </div>

                <div className="bg-[#eff4ff] rounded-xl p-2.5 border border-[#bbcabf]/20">
                  <span className="font-mono text-[9px] text-[#6c7a70] uppercase block">Max Clearance</span>
                  <div className="flex items-baseline gap-1 mt-0.5">
                    <span className="font-mono text-xl font-bold text-[#0b1c30]">
                      {selectedCarpark.maxClearance.toFixed(2)}
                    </span>
                    <span className="font-mono text-xs text-[#3c4a41]">m</span>
                  </div>
                  <span className="font-mono text-[9px] text-[#3c4a41] mt-1 block truncate">
                    {selectedCarpark.clearanceNote}
                  </span>
                </div>

                <div className="bg-[#eff4ff] rounded-xl p-2.5 border border-[#bbcabf]/20">
                  <span className="font-mono text-[9px] text-[#6c7a70] uppercase block">ERP Gantry</span>
                  <div className="flex items-baseline gap-1 mt-0.5">
                    <span className="font-mono text-xl font-bold text-[#006398]">
                      ${selectedCarpark.erpGantry.rate.toFixed(2)}
                    </span>
                  </div>
                  <span className="font-mono text-[9px] text-[#006398] font-medium mt-1 block truncate">
                    Active till {selectedCarpark.erpGantry.activeTill}
                  </span>
                </div>
              </div>

              {/* EV Charging Status Card */}
              <div className="bg-[#e5eeff] rounded-xl p-3.5 flex flex-col gap-2 border border-[#bbcabf]/30">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-lg bg-[#00b87a] text-white flex items-center justify-center shadow-sm">
                      <span className="material-symbols-outlined text-[18px]">ev_station</span>
                    </div>
                    <div>
                      <h4 className="text-xs font-bold text-[#0b1c30] leading-tight">
                        {selectedCarpark.evSummary.operator}
                      </h4>
                      <p className="text-[11px] text-[#3c4a41]">{selectedCarpark.evSummary.locationDetail}</p>
                    </div>
                  </div>
                  <button
                    onClick={() => onOpenReserve(selectedCarpark)}
                    className="px-2.5 py-1 rounded-full bg-white hover:bg-[#f8f9ff] text-[#006c46] font-mono text-[11px] font-bold shadow-sm transition-transform active:scale-95 border border-[#00b87a]/30"
                  >
                    Reserve Plug
                  </button>
                </div>

                <div className="flex items-center justify-between pt-1.5 border-t border-[#bbcabf]/20 text-[11px]">
                  <div className="flex items-center gap-1 font-mono">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#00b87a]" />
                    <span className="font-bold text-[#0b1c30]">
                      {selectedCarpark.evSummary.freeCount} / {selectedCarpark.evSummary.totalCount} Free
                    </span>
                  </div>
                  <span className="font-mono font-semibold text-[#0b1c30]">
                    ${selectedCarpark.evSummary.tariffKwh.toFixed(2)}/kWh
                  </span>
                </div>
              </div>

              {/* Dynamic Tariff Schedule & Calculator */}
              <div className="bg-[#eff4ff] rounded-xl p-3.5 border border-[#bbcabf]/30 flex flex-col gap-2 text-xs">
                <div className="flex items-center justify-between">
                  <span className="font-mono text-[11px] font-bold text-[#0b1c30]">
                    Weekday Tariff (07:00 - {selectedCarpark.eveningStartTime})
                  </span>
                  <span className="font-mono text-[9px] font-bold text-[#006c46] bg-[#00b87a]/15 px-2 py-0.5 rounded-full">
                    {selectedCarpark.gracePeriodMinutes}m Grace
                  </span>
                </div>

                <p className="text-[#0b1c30]">
                  <strong className="font-bold">${selectedCarpark.ratePerFirstHour.toFixed(2)}</strong> 1st hr ·{' '}
                  <strong className="font-bold">${selectedCarpark.rateSubsequent.toFixed(2)}</strong> /{selectedCarpark.subsequentIntervalMin}m
                </p>

                {/* Duration Slider */}
                <div className="pt-2 border-t border-[#bbcabf]/30 flex flex-col gap-1.5">
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-[#3c4a41]">Stay Duration:</span>
                    <span className="font-mono font-bold text-xs text-[#006c46]">{calcHours} Hours</span>
                  </div>
                  <input
                    type="range"
                    min="1"
                    max="8"
                    step="1"
                    value={calcHours}
                    onChange={(e) => setCalcHours(Number(e.target.value))}
                    className="w-full accent-[#00b87a] cursor-pointer"
                  />
                  <div className="flex items-center justify-between bg-white p-2 rounded-lg border border-[#e5eeff] text-xs font-mono">
                    <span>Projected Fee:</span>
                    <span className="font-bold text-sm text-[#006c46]">${calculatedFee}</span>
                  </div>
                </div>
              </div>

              {/* Action Buttons Row */}
              <div className="flex items-center gap-2 pt-1 mt-auto">
                <button
                  onClick={() => onToggleBookmark(selectedCarpark.id)}
                  className={`w-11 h-11 flex-shrink-0 flex items-center justify-center rounded-xl border transition-all ${
                    isBookmarked
                      ? 'bg-[#00b87a] text-white border-[#00b87a]'
                      : 'bg-[#eff4ff] text-[#0b1c30] border-[#bbcabf]/40 hover:bg-[#e5eeff]'
                  }`}
                  title={isBookmarked ? 'Bookmarked' : 'Add to Bookmarks'}
                >
                  <span className={`material-symbols-outlined text-[20px] ${isBookmarked ? 'material-symbols-fill' : ''}`}>
                    bookmark
                  </span>
                </button>

                <button
                  onClick={() => onStartGps(selectedCarpark)}
                  className="flex-1 h-11 px-3 rounded-xl bg-[#00b87a] hover:bg-[#006c46] text-white font-bold text-xs shadow-md transition-colors flex items-center justify-center gap-1.5"
                >
                  <span className="material-symbols-outlined text-[18px]">navigation</span>
                  Start Turn-By-Turn GPS
                </button>
              </div>
            </aside>
          )}
        </div>
      )}

      {navTab === 'planner' && (
        <div className="flex-1 overflow-y-auto p-4 lg:p-6 max-w-5xl mx-auto w-full">
          <TripPlannerTab
            carparks={carparks}
            onSelectCarpark={(cp) => {
              onSelectCarpark(cp);
              setNavTab('map');
            }}
            onStartGps={onStartGps}
          />
        </div>
      )}

      {navTab === 'ev' && (
        <div className="flex-1 overflow-y-auto p-4 lg:p-6 max-w-5xl mx-auto w-full">
          <EvHubTab
            carparks={carparks}
            onOpenReserve={onOpenReserve}
            onStartGps={onStartGps}
          />
        </div>
      )}

      {navTab === 'passes' && (
        <div className="flex-1 overflow-y-auto p-4 lg:p-6 max-w-5xl mx-auto w-full">
          <PassesTab obuBalance={obuBalance} onOpenTopUp={onOpenTopUp} />
        </div>
      )}
    </div>
  );
};
