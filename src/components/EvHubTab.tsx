import React, { useState } from 'react';
import { Carpark, USER_VEHICLE } from '../data/carparks';

interface Props {
  carparks: Carpark[];
  onOpenReserve: (carpark: Carpark) => void;
  onStartGps: (carpark: Carpark) => void;
}

export const EvHubTab: React.FC<Props> = ({ carparks, onOpenReserve, onStartGps }) => {
  const [filterType, setFilterType] = useState<'all' | 'dc-fast' | 'supercharger' | 'sp'>('all');
  const [searchQuery, setSearchQuery] = useState('');

  const filteredCarparks = carparks.filter((cp) => {
    if (searchQuery && !cp.name.toLowerCase().includes(searchQuery.toLowerCase())) return false;
    if (filterType === 'dc-fast') return cp.evSummary.speedBadge.includes('DC') || cp.evSummary.speedBadge.includes('High Power') || cp.evSummary.speedBadge.includes('Supercharger');
    if (filterType === 'supercharger') return cp.evSummary.operator.includes('Tesla');
    if (filterType === 'sp') return cp.evSummary.operator.includes('SP Mobility');
    return true;
  });

  return (
    <div className="flex flex-col gap-4 p-4 pb-28 max-w-2xl mx-auto w-full">
      {/* Vehicle Live Telemetry Pod */}
      <div className="bg-gradient-to-br from-[#0b1c30] to-[#162a45] text-white rounded-2xl p-4 shadow-lg border border-white/10 flex flex-col gap-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-xl bg-[#00b87a] text-white flex items-center justify-center shadow-md">
              <span className="material-symbols-outlined text-[22px]">directions_car</span>
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-mono font-bold text-sm">{USER_VEHICLE.plateNumber}</span>
                <span className="text-[10px] bg-[#00b87a]/20 text-[#6dfcb7] px-2 py-0.5 rounded-full font-mono">
                  Online
                </span>
              </div>
              <p className="text-xs text-white/70">{USER_VEHICLE.model}</p>
            </div>
          </div>
          <div className="text-right">
            <span className="text-2xl font-bold font-mono text-[#6dfcb7]">{USER_VEHICLE.batteryPercentage}%</span>
            <span className="text-xs text-white/60 block font-mono">{USER_VEHICLE.estimatedRangeKm} km range</span>
          </div>
        </div>

        {/* Battery Progress Bar */}
        <div className="w-full bg-white/10 rounded-full h-2 overflow-hidden">
          <div
            className="bg-gradient-to-r from-[#00b87a] to-[#6dfcb7] h-full rounded-full transition-all duration-500"
            style={{ width: `${USER_VEHICLE.batteryPercentage}%` }}
          />
        </div>

        <div className="flex items-center justify-between text-[11px] text-white/80 pt-1 border-t border-white/10">
          <span>Target Destination: <strong>Suntec Multi-Storey (1.2 km)</strong></span>
          <span className="text-[#6dfcb7] font-semibold">Recommended Top-Up: +25%</span>
        </div>
      </div>

      {/* Network Overview Bar */}
      <div className="flex items-center justify-between bg-white rounded-2xl p-3.5 shadow-sm border border-[#bbcabf]/30">
        <div className="flex items-center gap-2">
          <span className="material-symbols-outlined text-[#006398] text-[20px]">bolt</span>
          <div>
            <span className="text-xs font-bold text-[#0b1c30] block">Singapore High-Speed EV Grid</span>
            <span className="text-[10px] text-[#6c7a70]">SP Mobility · Tesla Superchargers · Shell Recharge · CDG ENGIE</span>
          </div>
        </div>
        <span className="text-xs font-mono font-bold text-[#006c46] bg-[#00b87a]/15 px-2.5 py-1 rounded-full">
          34 Bays Free
        </span>
      </div>

      {/* Filters and Search */}
      <div className="flex flex-col gap-2">
        <div className="relative">
          <span className="material-symbols-outlined text-[#6c7a70] text-[20px] absolute left-3 top-2.5">
            search
          </span>
          <input
            type="text"
            placeholder="Search EV station location, operator..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-white border border-[#bbcabf]/40 rounded-xl pl-9 pr-3 py-2 text-xs text-[#0b1c30] placeholder:text-[#6c7a70] focus:outline-none focus:border-[#006398]"
          />
        </div>

        <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar py-0.5">
          <button
            onClick={() => setFilterType('all')}
            className={`px-3 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap transition-all ${
              filterType === 'all'
                ? 'bg-[#006c46] text-white shadow-sm'
                : 'bg-white text-[#3c4a41] border border-[#bbcabf]/40 hover:bg-[#eff4ff]'
            }`}
          >
            All Chargers
          </button>
          <button
            onClick={() => setFilterType('dc-fast')}
            className={`px-3 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap transition-all ${
              filterType === 'dc-fast'
                ? 'bg-[#006c46] text-white shadow-sm'
                : 'bg-white text-[#3c4a41] border border-[#bbcabf]/40 hover:bg-[#eff4ff]'
            }`}
          >
            ⚡ 100kW+ DC Fast
          </button>
          <button
            onClick={() => setFilterType('supercharger')}
            className={`px-3 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap transition-all ${
              filterType === 'supercharger'
                ? 'bg-[#006c46] text-white shadow-sm'
                : 'bg-white text-[#3c4a41] border border-[#bbcabf]/40 hover:bg-[#eff4ff]'
            }`}
          >
            🔴 Tesla Supercharger
          </button>
          <button
            onClick={() => setFilterType('sp')}
            className={`px-3 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap transition-all ${
              filterType === 'sp'
                ? 'bg-[#006c46] text-white shadow-sm'
                : 'bg-white text-[#3c4a41] border border-[#bbcabf]/40 hover:bg-[#eff4ff]'
            }`}
          >
            🟢 SP Mobility
          </button>
        </div>
      </div>

      {/* EV Hub Stations List */}
      <div className="flex flex-col gap-3">
        {filteredCarparks.map((cp) => (
          <div
            key={cp.id}
            className="bg-white rounded-2xl p-4 shadow-sm border border-[#bbcabf]/30 hover:border-[#006398] transition-all flex flex-col gap-3"
          >
            {/* Operator and Status */}
            <div className="flex items-start justify-between">
              <div>
                <div className="flex items-center gap-1.5 flex-wrap">
                  <span className="text-[10px] font-bold bg-[#cce5ff] text-[#004b73] px-2 py-0.5 rounded-full">
                    {cp.evSummary.speedBadge}
                  </span>
                  <span className="text-xs text-[#6c7a70]">{cp.distanceKm} km away</span>
                </div>
                <h3 className="font-bold text-base text-[#0b1c30] mt-1">{cp.name}</h3>
                <p className="text-xs text-[#3c4a41] flex items-center gap-1 mt-0.5">
                  <span className="material-symbols-outlined text-[15px] text-[#006398]">location_on</span>
                  {cp.evSummary.locationDetail}
                </p>
              </div>

              <div className="text-right">
                <span className="font-mono text-lg font-bold text-[#006c46]">
                  {cp.evSummary.freeCount} / {cp.evSummary.totalCount}
                </span>
                <span className="text-[10px] text-[#6c7a70] block font-mono">Bays Available</span>
              </div>
            </div>

            {/* Individual Bay Live Chips */}
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
              {cp.evBays.map((bay) => (
                <div
                  key={bay.id}
                  className={`p-2 rounded-xl border text-xs flex flex-col justify-between ${
                    bay.status === 'available'
                      ? 'bg-[#eff4ff] border-[#bbcabf]/40 text-[#0b1c30]'
                      : 'bg-slate-50 border-slate-200 text-slate-500 opacity-60'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="font-mono font-bold">{bay.id}</span>
                    <span className="text-[10px] font-mono font-semibold">{bay.powerKw}kW</span>
                  </div>
                  <span className="text-[11px] truncate mt-1">{bay.connector}</span>
                  <span className="text-[10px] font-mono mt-1 font-semibold text-[#006c46]">
                    {bay.status === 'available' ? `$${bay.tariffKwh.toFixed(2)}/kWh` : bay.timeRemaining || 'Busy'}
                  </span>
                </div>
              ))}
            </div>

            {/* Bottom Actions */}
            <div className="flex items-center justify-between pt-2 border-t border-[#e5eeff]">
              <span className="text-xs font-mono text-[#3c4a41]">
                Tariff: <strong>${cp.evSummary.tariffKwh.toFixed(2)}/kWh</strong>
              </span>
              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() => onStartGps(cp)}
                  className="px-3 py-1.5 rounded-xl border border-[#bbcabf] text-xs font-semibold text-[#0b1c30] hover:bg-[#eff4ff] flex items-center gap-1"
                >
                  <span className="material-symbols-outlined text-[15px]">navigation</span>
                  Route
                </button>
                <button
                  type="button"
                  onClick={() => onOpenReserve(cp)}
                  className="px-4 py-1.5 rounded-xl bg-[#00b87a] hover:bg-[#006c46] text-white text-xs font-bold shadow-sm flex items-center gap-1 transition-colors"
                >
                  <span className="material-symbols-outlined text-[15px]">lock_clock</span>
                  Reserve Bay
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
