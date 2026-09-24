import React, { useState } from 'react';
import { Carpark, EVBay } from '../data/carparks';

interface Props {
  carpark: Carpark;
  onClose: () => void;
  onReserved: (bayId: string) => void;
}

export const ReservePlugModal: React.FC<Props> = ({ carpark, onClose, onReserved }) => {
  const [selectedBay, setSelectedBay] = useState<EVBay>(
    carpark.evBays.find((b) => b.status === 'available') || carpark.evBays[0]
  );
  const [targetBattery, setTargetBattery] = useState(85);
  const [confirmed, setConfirmed] = useState(false);

  const currentBattery = 68;
  const batteryToChargeKwh = Math.max(0, ((targetBattery - currentBattery) / 100) * 75); // 75kWh pack
  const estChargingTimeMin = Math.round((batteryToChargeKwh / (selectedBay.powerKw * 0.9)) * 60);
  const estCost = (batteryToChargeKwh * selectedBay.tariffKwh).toFixed(2);

  const handleConfirm = () => {
    setConfirmed(true);
    setTimeout(() => {
      onReserved(selectedBay.id);
      onClose();
    }, 1800);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fadeIn">
      <div className="bg-[#ffffff] text-[#0b1c30] rounded-2xl max-w-md w-full p-5 shadow-2xl border border-[#bbcabf]/30 flex flex-col gap-4">
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-[#e5eeff]">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-[#00b87a] text-white flex items-center justify-center shadow-sm">
              <span className="material-symbols-outlined text-[20px]">ev_station</span>
            </div>
            <div>
              <h3 className="font-bold text-base text-[#0b1c30] leading-tight">Reserve EV Charging Bay</h3>
              <p className="text-xs text-[#3c4a41]">{carpark.shortName} · {carpark.evSummary.operator}</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full hover:bg-[#eff4ff] flex items-center justify-center text-[#6c7a70] transition-colors"
          >
            <span className="material-symbols-outlined text-[20px]">close</span>
          </button>
        </div>

        {confirmed ? (
          <div className="py-8 flex flex-col items-center justify-center text-center gap-3">
            <div className="w-16 h-16 rounded-full bg-[#00b87a]/15 text-[#006c46] flex items-center justify-center animate-bounce">
              <span className="material-symbols-outlined text-[36px]">check_circle</span>
            </div>
            <h4 className="text-lg font-bold text-[#0b1c30]">Bay {selectedBay.id} Reserved!</h4>
            <p className="text-sm text-[#3c4a41] max-w-xs">
              Connector locked for your Tesla (SLL 4821 K). 15-minute hold timer activated.
            </p>
            <span className="text-xs font-mono bg-[#eff4ff] text-[#006398] px-3 py-1 rounded-full font-semibold">
              Hold expires at 12:47 PM
            </span>
          </div>
        ) : (
          <>
            {/* Bay Selector */}
            <div>
              <label className="text-xs font-semibold text-[#3c4a41] uppercase tracking-wide block mb-2">
                Available Bays in Lobby C
              </label>
              <div className="grid grid-cols-2 gap-2">
                {carpark.evBays.map((bay) => {
                  const isAvailable = bay.status === 'available';
                  const isSelected = selectedBay.id === bay.id;

                  return (
                    <button
                      key={bay.id}
                      type="button"
                      disabled={!isAvailable}
                      onClick={() => setSelectedBay(bay)}
                      className={`p-2.5 rounded-xl border text-left transition-all relative ${
                        isSelected
                          ? 'border-[#00b87a] bg-[#eff4ff] shadow-sm ring-1 ring-[#00b87a]'
                          : isAvailable
                          ? 'border-[#bbcabf] bg-white hover:border-[#006398]'
                          : 'border-slate-200 bg-slate-50 opacity-50 cursor-not-allowed'
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-mono font-bold text-[#0b1c30]">{bay.id}</span>
                        <span
                          className={`text-[10px] font-mono px-1.5 py-0.5 rounded font-semibold ${
                            isAvailable ? 'bg-[#00b87a]/20 text-[#006c46]' : 'bg-slate-200 text-slate-600'
                          }`}
                        >
                          {bay.powerKw}kW
                        </span>
                      </div>
                      <p className="text-[11px] text-[#3c4a41] mt-1 truncate">{bay.connector}</p>
                      <p className="text-[10px] font-mono text-[#6c7a70] mt-0.5">
                        {isAvailable ? `$${bay.tariffKwh.toFixed(2)}/kWh` : bay.timeRemaining || 'In Use'}
                      </p>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Target Battery Slider */}
            <div className="bg-[#eff4ff] p-3 rounded-xl flex flex-col gap-2">
              <div className="flex items-center justify-between text-xs font-medium">
                <span className="text-[#3c4a41]">Target Battery Level</span>
                <span className="font-mono font-bold text-[#006c46] text-sm">{targetBattery}%</span>
              </div>
              <input
                type="range"
                min="70"
                max="100"
                step="5"
                value={targetBattery}
                onChange={(e) => setTargetBattery(Number(e.target.value))}
                className="w-full accent-[#00b87a] cursor-pointer"
              />
              <div className="flex justify-between text-[11px] font-mono text-[#6c7a70]">
                <span>Current: {currentBattery}%</span>
                <span>+{targetBattery - currentBattery}% charge (~{batteryToChargeKwh.toFixed(1)} kWh)</span>
              </div>
            </div>

            {/* Telemetry Summary */}
            <div className="grid grid-cols-2 gap-2 text-center">
              <div className="bg-[#f8f9ff] border border-[#e5eeff] p-2.5 rounded-xl">
                <span className="text-[10px] uppercase font-semibold text-[#6c7a70] block">Estimated Time</span>
                <span className="text-base font-bold font-mono text-[#006398]">{estChargingTimeMin} mins</span>
              </div>
              <div className="bg-[#f8f9ff] border border-[#e5eeff] p-2.5 rounded-xl">
                <span className="text-[10px] uppercase font-semibold text-[#6c7a70] block">Estimated Cost</span>
                <span className="text-base font-bold font-mono text-[#006c46]">${estCost}</span>
              </div>
            </div>

            {/* Hold Policy Notice */}
            <p className="text-[11px] text-[#6c7a70] leading-relaxed">
              Reservation holds the selected bay for 15 minutes. Idle fees ($0.80/min) apply if plugged in after 100% capacity is reached.
            </p>

            {/* Actions */}
            <div className="flex items-center gap-2 pt-1">
              <button
                type="button"
                onClick={onClose}
                className="flex-1 py-2.5 rounded-xl border border-[#bbcabf] font-semibold text-xs text-[#3c4a41] hover:bg-[#f8f9ff]"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleConfirm}
                className="flex-1 py-2.5 rounded-xl bg-[#00b87a] hover:bg-[#006c46] text-white font-bold text-xs shadow-md transition-colors flex items-center justify-center gap-1.5"
              >
                <span className="material-symbols-outlined text-[16px]">lock</span>
                Hold 15m
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
};
