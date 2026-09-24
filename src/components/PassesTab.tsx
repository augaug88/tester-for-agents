import React, { useState } from 'react';
import { USER_VEHICLE } from '../data/carparks';

interface Props {
  obuBalance: number;
  onOpenTopUp: () => void;
}

export const PassesTab: React.FC<Props> = ({ obuBalance, onOpenTopUp }) => {
  const [activeTab, setActiveTab] = useState<'passes' | 'active-session' | 'history'>('passes');
  const [sessionActive, setSessionActive] = useState(true);
  const [sessionDurationMinutes, setSessionDurationMinutes] = useState(38);

  const sessionFee = (2.4 + (sessionDurationMinutes > 60 ? Math.ceil((sessionDurationMinutes - 60) / 30) * 1.2 : 0)).toFixed(2);

  return (
    <div className="flex flex-col gap-4 p-4 pb-28 max-w-2xl mx-auto w-full">
      {/* Vehicle Profile Card */}
      <div className="bg-gradient-to-br from-[#0b1c30] to-[#1e344e] rounded-2xl p-5 text-white shadow-xl border border-white/10 relative overflow-hidden">
        {/* Subtle background glow */}
        <div className="absolute -right-10 -bottom-10 w-48 h-48 bg-[#00b87a]/15 rounded-full blur-3xl pointer-events-none" />

        <div className="flex items-start justify-between">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xl font-bold font-mono tracking-wider">{USER_VEHICLE.plateNumber}</span>
              <span className="text-[10px] bg-[#00b87a] text-white px-2 py-0.5 rounded font-mono font-semibold">
                ERP 2.0 OBU Connected
              </span>
            </div>
            <p className="text-xs text-white/70 mt-0.5">{USER_VEHICLE.model}</p>
          </div>
          <img
            src="https://lh3.googleusercontent.com/aida/AEtjO1VFmD2SuqZU_DSwx9ZqMHYVjfyBG7xZPOktu-9kGOIIBP3ruq0JqW7xjKPRiMdb9cN0ZlwO7Q5KczHHyqJmFcCtC8jB463iS5AriJeWrS7wSoNEvD3m0deQAxJ7_4FXUeOeMd4dgQqR1mA7j2VK2J5xi5en4Fv_aXSLjUd0sTQUwH7MIt2Ovz4Fe4yvoyKJECumBoM1gkNO4RRc01OO7sPsd3oS99EBOA_V_jsQ73v-7rL0xhT6QBBbDC2o"
            alt="Profile Avatar"
            className="w-11 h-11 rounded-full border-2 border-[#00b87a] object-cover shadow-md"
          />
        </div>

        {/* OBU CashCard Balance Bar */}
        <div className="mt-4 bg-white/10 backdrop-blur-md rounded-xl p-3 border border-white/10 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-[#006398] text-white flex items-center justify-center">
              <span className="material-symbols-outlined text-[18px]">credit_card</span>
            </div>
            <div>
              <span className="text-[10px] uppercase tracking-wider text-white/60 block">OBU Smart CashCard</span>
              <span className="text-lg font-mono font-bold text-white">${obuBalance.toFixed(2)}</span>
            </div>
          </div>
          <button
            onClick={onOpenTopUp}
            className="px-3.5 py-1.5 rounded-lg bg-[#00b87a] hover:bg-[#00e599] text-[#0b1c30] font-bold text-xs shadow transition-all active:scale-95"
          >
            + Top Up
          </button>
        </div>

        {/* IU & Tech Info */}
        <div className="grid grid-cols-2 gap-2 mt-3 pt-3 border-t border-white/10 text-xs text-white/70 font-mono">
          <div>IU Number: <strong className="text-white">{USER_VEHICLE.iuNumber}</strong></div>
          <div className="text-right">Auto-Debit: <strong className="text-[#6dfcb7]">Enabled</strong></div>
        </div>
      </div>

      {/* Segmented Control */}
      <div className="flex bg-[#eff4ff] p-1 rounded-xl border border-[#bbcabf]/30">
        <button
          onClick={() => setActiveTab('passes')}
          className={`flex-1 py-2 text-xs font-semibold rounded-lg transition-all ${
            activeTab === 'passes' ? 'bg-white text-[#006c46] shadow-sm' : 'text-[#3c4a41]'
          }`}
        >
          Season Passes ({USER_VEHICLE.seasonPasses.length})
        </button>
        <button
          onClick={() => setActiveTab('active-session')}
          className={`flex-1 py-2 text-xs font-semibold rounded-lg transition-all ${
            activeTab === 'active-session' ? 'bg-white text-[#006c46] shadow-sm' : 'text-[#3c4a41]'
          }`}
        >
          Active Session {sessionActive && '🔴'}
        </button>
        <button
          onClick={() => setActiveTab('history')}
          className={`flex-1 py-2 text-xs font-semibold rounded-lg transition-all ${
            activeTab === 'history' ? 'bg-white text-[#006c46] shadow-sm' : 'text-[#3c4a41]'
          }`}
        >
          Receipts History
        </button>
      </div>

      {/* Sub-view: Season Passes */}
      {activeTab === 'passes' && (
        <div className="flex flex-col gap-3">
          {USER_VEHICLE.seasonPasses.map((pass, i) => (
            <div
              key={i}
              className="bg-white rounded-2xl p-4 shadow-sm border border-[#bbcabf]/30 flex flex-col gap-3"
            >
              <div className="flex items-start justify-between">
                <div>
                  <span className="text-[10px] font-bold uppercase tracking-wider text-[#006c46] bg-[#00b87a]/15 px-2 py-0.5 rounded-full">
                    {pass.status === 'active' ? 'Active Permit' : 'Expiring Soon'}
                  </span>
                  <h3 className="font-bold text-base text-[#0b1c30] mt-1">{pass.carparkName}</h3>
                  <p className="text-xs text-[#3c4a41]">{pass.type}</p>
                </div>
                <div className="text-right">
                  <span className="text-xs text-[#6c7a70] block">Valid Until</span>
                  <span className="font-mono font-bold text-xs text-[#0b1c30]">{pass.expiryDate}</span>
                </div>
              </div>

              {/* Digital Barcode Simulation */}
              <div className="bg-[#f8f9ff] p-3 rounded-xl border border-[#e5eeff] flex items-center justify-between">
                <div className="flex flex-col">
                  <span className="text-[10px] uppercase font-mono text-[#6c7a70]">Digital Barrier Pass ID</span>
                  <span className="font-mono font-bold text-xs text-[#006398]">PSG-SG-84920491</span>
                </div>
                <div className="h-8 flex items-center gap-1 font-mono tracking-tighter text-lg font-bold text-[#0b1c30]">
                  ||| | |||| | ||||| | |||
                </div>
              </div>

              <div className="flex items-center justify-between text-xs pt-1">
                <span className="text-[#006c46] flex items-center gap-1 font-medium">
                  <span className="material-symbols-outlined text-[16px]">verified</span>
                  Automated Gantry Recognition
                </span>
                <button className="text-[#006398] hover:underline font-semibold text-xs">
                  Renew Pass →
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Sub-view: Active Session */}
      {activeTab === 'active-session' && (
        <div className="flex flex-col gap-3">
          {sessionActive ? (
            <div className="bg-white rounded-2xl p-5 shadow-sm border border-[#00b87a] ring-1 ring-[#00b87a]/30 flex flex-col gap-4">
              <div className="flex items-center justify-between pb-3 border-b border-[#e5eeff]">
                <div className="flex items-center gap-2">
                  <span className="w-3 h-3 rounded-full bg-red-500 animate-pulse" />
                  <span className="text-xs font-bold uppercase tracking-wider text-[#ba1a1a]">
                    Active Parking Session
                  </span>
                </div>
                <span className="font-mono text-xs text-[#006398] bg-[#eff4ff] px-2 py-0.5 rounded">
                  Entry: 11:58 AM
                </span>
              </div>

              <div>
                <h3 className="font-bold text-lg text-[#0b1c30]">Suntec City Multi-Storey</h3>
                <p className="text-xs text-[#3c4a41]">Sector Green West · Level B1, Lot #142</p>
              </div>

              <div className="grid grid-cols-2 gap-3 text-center">
                <div className="bg-[#eff4ff] p-3 rounded-xl border border-[#bbcabf]/30">
                  <span className="text-[10px] uppercase font-bold text-[#6c7a70] block">Elapsed Duration</span>
                  <span className="text-2xl font-mono font-extrabold text-[#006398]">{sessionDurationMinutes}m</span>
                </div>
                <div className="bg-[#eff4ff] p-3 rounded-xl border border-[#bbcabf]/30">
                  <span className="text-[10px] uppercase font-bold text-[#6c7a70] block">Accrued Tariff</span>
                  <span className="text-2xl font-mono font-extrabold text-[#006c46]">${sessionFee}</span>
                </div>
              </div>

              <div className="bg-[#f8f9ff] p-3 rounded-xl border border-[#e5eeff] text-xs text-[#3c4a41] flex items-center justify-between">
                <span>Grace Period (15m): <strong className="text-[#006c46]">Completed</strong></span>
                <span className="font-mono text-[#6c7a70]">Next 30m starts in 22m</span>
              </div>

              <div className="flex gap-2">
                <button
                  onClick={() => setSessionActive(false)}
                  className="w-full py-2.5 rounded-xl bg-[#006c46] hover:bg-[#005234] text-white font-bold text-xs shadow-md transition-colors"
                >
                  Simulate Gantry Exit & Auto-Pay
                </button>
              </div>
            </div>
          ) : (
            <div className="bg-white rounded-2xl p-8 text-center border border-[#bbcabf]/30 flex flex-col items-center gap-2">
              <span className="material-symbols-outlined text-[#00b87a] text-[36px]">check_circle</span>
              <h4 className="font-bold text-base text-[#0b1c30]">No Active Parking Session</h4>
              <p className="text-xs text-[#6c7a70] max-w-xs">
                Your vehicle will automatically register sessions upon driving through any LTA/URA automated gantry.
              </p>
              <button
                onClick={() => setSessionActive(true)}
                className="mt-2 px-4 py-2 rounded-xl bg-[#eff4ff] text-[#006398] font-bold text-xs hover:bg-[#cce5ff]"
              >
                Restart Session Simulation
              </button>
            </div>
          )}
        </div>
      )}

      {/* Sub-view: Receipts History */}
      {activeTab === 'history' && (
        <div className="flex flex-col gap-2.5">
          {USER_VEHICLE.recentSessions.map((rec) => (
            <div
              key={rec.id}
              className="bg-white rounded-2xl p-4 shadow-sm border border-[#bbcabf]/30 flex items-center justify-between"
            >
              <div>
                <span className="font-mono text-[10px] text-[#6c7a70] block">{rec.receiptRef}</span>
                <h4 className="font-bold text-xs text-[#0b1c30] mt-0.5">{rec.carparkName}</h4>
                <p className="text-[11px] text-[#3c4a41] mt-0.5">
                  {rec.date} ({rec.duration})
                </p>
              </div>

              <div className="text-right">
                <span className="text-base font-bold font-mono text-[#0b1c30] block">
                  ${(rec.parkingFee + rec.erpFee).toFixed(2)}
                </span>
                <span className="text-[10px] text-[#6c7a70] font-mono block">
                  Park: ${rec.parkingFee.toFixed(2)} | ERP: ${rec.erpFee.toFixed(2)}
                </span>
                <button className="text-[11px] text-[#006398] font-semibold hover:underline mt-0.5">
                  Download PDF
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
