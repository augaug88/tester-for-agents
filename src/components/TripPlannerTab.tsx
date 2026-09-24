import React, { useState } from 'react';
import { Carpark, ERP_GANTRIES } from '../data/carparks';

interface Props {
  carparks: Carpark[];
  onSelectCarpark: (carpark: Carpark) => void;
  onStartGps: (carpark: Carpark) => void;
}

export const TripPlannerTab: React.FC<Props> = ({ carparks, onSelectCarpark, onStartGps }) => {
  const [destination, setDestination] = useState('Suntec Singapore Convention & Exhibition Centre');
  const [arrivalTime, setArrivalTime] = useState('12:30');
  const [dayType, setDayType] = useState<'weekday' | 'saturday' | 'sunday'>('weekday');
  const [stayDurationHours, setStayDurationHours] = useState(2);
  const [selectedSort, setSelectedSort] = useState<'recommended' | 'cheapest' | 'walk' | 'ev'>('recommended');

  const destinations = [
    'Suntec Singapore Convention & Exhibition Centre',
    'Marina Bay Sands Casino & Shoppes',
    'Raffles Place Financial Hub (One Raffles Quay)',
    'Millenia Walk & Promenade MRT',
    'CapitaGreen & Telok Ayer Food Centre',
  ];

  // Calculate fees for each carpark based on duration
  const rankedCarparks = [...carparks].map((cp) => {
    const parkFee = cp.ratePerFirstHour + Math.max(0, (stayDurationHours - 1) * 2 * cp.rateSubsequent);
    const totalTripCost = parkFee + cp.erpGantry.rate;
    const walkMin = Math.round(cp.distanceKm * 4.5);

    return {
      ...cp,
      calcParkFee: parkFee,
      totalTripCost: totalTripCost,
      calcWalkMin: walkMin,
    };
  });

  if (selectedSort === 'cheapest') {
    rankedCarparks.sort((a, b) => a.totalTripCost - b.totalTripCost);
  } else if (selectedSort === 'walk') {
    rankedCarparks.sort((a, b) => a.calcWalkMin - b.calcWalkMin);
  } else if (selectedSort === 'ev') {
    rankedCarparks.sort((a, b) => b.evSummary.freeCount - a.evSummary.freeCount);
  }

  return (
    <div className="flex flex-col gap-4 p-4 pb-28 max-w-2xl mx-auto w-full">
      {/* Route Header Banner */}
      <div className="bg-gradient-to-r from-[#006c46] to-[#00b87a] rounded-2xl p-4 text-white shadow-md">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-[24px]">alt_route</span>
            <h2 className="text-lg font-bold">Smart Urban Trip Planner</h2>
          </div>
          <span className="text-xs bg-white/20 px-2.5 py-1 rounded-full font-mono">
            ERP + Parking Optimized
          </span>
        </div>
        <p className="text-xs text-white/90 mt-1">
          Simulate departure times to bypass peak ERP gantries and secure reserved EV slots.
        </p>
      </div>

      {/* Input Form Card */}
      <div className="bg-white rounded-2xl p-4 shadow-sm border border-[#bbcabf]/30 flex flex-col gap-3">
        <div>
          <label className="text-xs font-semibold text-[#3c4a41] uppercase tracking-wide block mb-1.5">
            Destination
          </label>
          <div className="relative">
            <span className="material-symbols-outlined text-[#006398] text-[20px] absolute left-3 top-3">
              flag
            </span>
            <select
              value={destination}
              onChange={(e) => setDestination(e.target.value)}
              className="w-full bg-[#f8f9ff] border border-[#bbcabf]/40 rounded-xl pl-9 pr-3 py-2.5 text-xs text-[#0b1c30] font-medium focus:outline-none focus:border-[#006398]"
            >
              {destinations.map((d) => (
                <option key={d} value={d}>
                  {d}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Time and Duration Controls */}
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
          <div>
            <label className="text-[11px] font-semibold text-[#6c7a70] block mb-1">Arrival Time</label>
            <input
              type="time"
              value={arrivalTime}
              onChange={(e) => setArrivalTime(e.target.value)}
              className="w-full bg-[#f8f9ff] border border-[#bbcabf]/40 rounded-xl px-3 py-2 text-xs font-mono text-[#0b1c30]"
            />
          </div>

          <div>
            <label className="text-[11px] font-semibold text-[#6c7a70] block mb-1">Stay Duration</label>
            <select
              value={stayDurationHours}
              onChange={(e) => setStayDurationHours(Number(e.target.value))}
              className="w-full bg-[#f8f9ff] border border-[#bbcabf]/40 rounded-xl px-3 py-2 text-xs font-mono text-[#0b1c30]"
            >
              <option value={1}>1 Hour</option>
              <option value={2}>2 Hours</option>
              <option value={3}>3 Hours</option>
              <option value={4}>4 Hours</option>
              <option value={6}>Full Half-Day (6h)</option>
            </select>
          </div>

          <div className="col-span-2 sm:col-span-1">
            <label className="text-[11px] font-semibold text-[#6c7a70] block mb-1">Day Type</label>
            <div className="flex bg-[#eff4ff] p-0.5 rounded-xl border border-[#bbcabf]/30">
              <button
                type="button"
                onClick={() => setDayType('weekday')}
                className={`flex-1 py-1.5 text-[11px] rounded-lg font-medium transition-all ${
                  dayType === 'weekday' ? 'bg-white text-[#006c46] shadow-sm font-bold' : 'text-[#3c4a41]'
                }`}
              >
                Weekday
              </button>
              <button
                type="button"
                onClick={() => setDayType('saturday')}
                className={`flex-1 py-1.5 text-[11px] rounded-lg font-medium transition-all ${
                  dayType !== 'weekday' ? 'bg-white text-[#006c46] shadow-sm font-bold' : 'text-[#3c4a41]'
                }`}
              >
                Weekend
              </button>
            </div>
          </div>
        </div>

        {/* Live ERP Forecast Banner */}
        <div className="bg-[#eff4ff] rounded-xl p-3 border border-[#bbcabf]/20 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-[#006398] animate-pulse" />
            <div>
              <span className="text-xs font-bold text-[#0b1c30]">ERP Peak Status at {arrivalTime}</span>
              <span className="text-[11px] text-[#3c4a41] block">
                Sheares Ave Gantry: $2.00 active. Shift arrival by +20m to save $2.00.
              </span>
            </div>
          </div>
          <span className="font-mono text-xs font-bold text-[#006398] bg-white px-2 py-1 rounded-md shadow-sm">
            Total ERP: $2.00
          </span>
        </div>
      </div>

      {/* Sort Strategy Pills */}
      <div className="flex items-center gap-2 overflow-x-auto no-scrollbar py-1">
        <button
          onClick={() => setSelectedSort('recommended')}
          className={`flex-shrink-0 px-3.5 py-1.5 rounded-full text-xs font-semibold transition-all ${
            selectedSort === 'recommended'
              ? 'bg-[#006c46] text-white shadow-sm'
              : 'bg-white text-[#3c4a41] border border-[#bbcabf]/40 hover:bg-[#eff4ff]'
          }`}
        >
          ⭐ Best Overall Match
        </button>
        <button
          onClick={() => setSelectedSort('cheapest')}
          className={`flex-shrink-0 px-3.5 py-1.5 rounded-full text-xs font-semibold transition-all ${
            selectedSort === 'cheapest'
              ? 'bg-[#006c46] text-white shadow-sm'
              : 'bg-white text-[#3c4a41] border border-[#bbcabf]/40 hover:bg-[#eff4ff]'
          }`}
        >
          💰 Lowest Price
        </button>
        <button
          onClick={() => setSelectedSort('walk')}
          className={`flex-shrink-0 px-3.5 py-1.5 rounded-full text-xs font-semibold transition-all ${
            selectedSort === 'walk'
              ? 'bg-[#006c46] text-white shadow-sm'
              : 'bg-white text-[#3c4a41] border border-[#bbcabf]/40 hover:bg-[#eff4ff]'
          }`}
        >
          🚶 Closest Walk
        </button>
        <button
          onClick={() => setSelectedSort('ev')}
          className={`flex-shrink-0 px-3.5 py-1.5 rounded-full text-xs font-semibold transition-all ${
            selectedSort === 'ev'
              ? 'bg-[#006c46] text-white shadow-sm'
              : 'bg-white text-[#3c4a41] border border-[#bbcabf]/40 hover:bg-[#eff4ff]'
          }`}
        >
          ⚡ Most EV Plugs
        </button>
      </div>

      {/* Recommended Carpark Options List */}
      <div className="flex flex-col gap-3">
        {rankedCarparks.map((cp, idx) => (
          <div
            key={cp.id}
            className={`bg-white rounded-2xl p-4 shadow-sm border transition-all flex flex-col gap-3 ${
              idx === 0
                ? 'border-[#00b87a] ring-1 ring-[#00b87a]/40 bg-gradient-to-b from-white to-[#eff4ff]/30'
                : 'border-[#bbcabf]/30 hover:border-[#006398]'
            }`}
          >
            {/* Top row */}
            <div className="flex items-start justify-between">
              <div>
                <div className="flex items-center gap-2">
                  {idx === 0 && (
                    <span className="text-[10px] font-bold uppercase tracking-wider bg-[#00b87a] text-white px-2 py-0.5 rounded-md">
                      Top Pick
                    </span>
                  )}
                  <span className="text-xs font-semibold text-[#006c46]">
                    {cp.availableLots} lots available
                  </span>
                  <span className="text-[#bbcabf]">·</span>
                  <span className="text-xs text-[#3c4a41]">{cp.distanceKm} km drive</span>
                </div>
                <h3 className="font-bold text-base text-[#0b1c30] mt-0.5">{cp.name}</h3>
                <p className="text-xs text-[#6c7a70]">{cp.address}</p>
              </div>

              {/* Price Tag */}
              <div className="text-right">
                <span className="text-xl font-bold font-mono text-[#006c46]">
                  ${cp.totalTripCost.toFixed(2)}
                </span>
                <span className="text-[10px] text-[#6c7a70] block font-mono">
                  ${cp.calcParkFee.toFixed(2)} park + ${cp.erpGantry.rate.toFixed(2)} ERP
                </span>
              </div>
            </div>

            {/* Feature Highlights Grid */}
            <div className="grid grid-cols-3 gap-2 text-center text-xs">
              <div className="bg-[#f8f9ff] p-2 rounded-xl border border-[#e5eeff]">
                <span className="text-[10px] text-[#6c7a70] block">Walking Time</span>
                <span className="font-bold font-mono text-[#0b1c30]">{cp.calcWalkMin} min</span>
              </div>
              <div className="bg-[#f8f9ff] p-2 rounded-xl border border-[#e5eeff]">
                <span className="text-[10px] text-[#6c7a70] block">EV Availability</span>
                <span className="font-bold font-mono text-[#006398]">{cp.evSummary.freeCount} free</span>
              </div>
              <div className="bg-[#f8f9ff] p-2 rounded-xl border border-[#e5eeff]">
                <span className="text-[10px] text-[#6c7a70] block">Grace Period</span>
                <span className="font-bold font-mono text-[#006c46]">{cp.gracePeriodMinutes} mins</span>
              </div>
            </div>

            {/* Sheltered Linkway Guarantee */}
            <div className="text-[11px] text-[#3c4a41] flex items-center gap-1.5 bg-[#eff4ff] px-2.5 py-1.5 rounded-lg">
              <span className="material-symbols-outlined text-[#006398] text-[16px]">umbrella</span>
              <span className="truncate">{cp.shelteredWalk}</span>
            </div>

            {/* Actions */}
            <div className="flex items-center gap-2 pt-1">
              <button
                type="button"
                onClick={() => onSelectCarpark(cp)}
                className="flex-1 py-2 rounded-xl border border-[#bbcabf] hover:bg-[#eff4ff] text-xs font-semibold text-[#0b1c30] transition-colors"
              >
                Inspect Rates
              </button>
              <button
                type="button"
                onClick={() => onStartGps(cp)}
                className="flex-1 py-2 rounded-xl bg-[#00b87a] hover:bg-[#006c46] text-white text-xs font-bold shadow-sm transition-colors flex items-center justify-center gap-1.5"
              >
                <span className="material-symbols-outlined text-[16px]">navigation</span>
                Navigate Here
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
