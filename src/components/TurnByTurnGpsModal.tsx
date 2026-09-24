import React, { useState, useEffect } from 'react';
import { Carpark } from '../data/carparks';

interface Props {
  carpark: Carpark;
  onClose: () => void;
}

export const TurnByTurnGpsModal: React.FC<Props> = ({ carpark, onClose }) => {
  const [step, setStep] = useState(0);
  const [speed, setSpeed] = useState(42);
  const [remainingDist, setRemainingDist] = useState(carpark.distanceKm);
  const [remainingMinutes, setRemainingMinutes] = useState(carpark.etaMin);
  const [voiceMuted, setVoiceMuted] = useState(false);

  const instructions = [
    {
      action: 'Turn right',
      street: 'Temasek Boulevard',
      subtext: 'In 180 meters, prepare to enter Suntec Carpark Entrance A',
      icon: 'turn_right',
      lotsNotice: `${carpark.availableLots} lots available now`,
    },
    {
      action: 'Keep left',
      street: 'Raffles Boulevard Slipway',
      subtext: 'Pass Sheares Ave ERP gantry ($2.00 deducted via OBU)',
      icon: 'fork_left',
      lotsNotice: 'Optimal lot availability in Zone Green',
    },
    {
      action: 'Enter Carpark Ramp',
      street: `${carpark.name} · Basement 1`,
      subtext: 'Sensor auto-clearance approved: 2.00m limit',
      icon: 'arrow_upward',
      lotsNotice: 'EV DC Fast bays in Lobby C',
    },
    {
      action: 'Arrived at Destination',
      street: 'Proceed to Sector Green West, Bay #142',
      subtext: '15-minute grace period has commenced',
      icon: 'check_circle',
      lotsNotice: 'Parking session started',
    },
  ];

  useEffect(() => {
    const timer = setInterval(() => {
      setSpeed((prev) => Math.max(28, Math.min(52, prev + (Math.random() > 0.5 ? 2 : -2))));
      setRemainingDist((prev) => {
        const next = Math.max(0.1, Number((prev - 0.05).toFixed(2)));
        if (next < 0.3) setStep(2);
        else if (next < 0.7) setStep(1);
        return next;
      });
      setRemainingMinutes((prev) => Math.max(1, prev > 1 && Math.random() > 0.7 ? prev - 1 : prev));
    }, 2500);

    return () => clearInterval(timer);
  }, []);

  const currentInst = instructions[step] || instructions[0];

  return (
    <div className="fixed inset-0 z-50 flex flex-col bg-[#0b1c30] text-white">
      {/* Top HUD Navigation Banner */}
      <div className="bg-[#006c46] p-4 pt-6 shadow-xl flex items-center justify-between border-b border-[#00b87a]/30">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-xl bg-[#00b87a] text-white flex items-center justify-center shadow-lg animate-pulse-subtle">
            <span className="material-symbols-outlined text-[28px]">{currentInst.icon}</span>
          </div>
          <div>
            <div className="text-xl font-bold tracking-tight text-white flex items-center gap-2">
              <span>{currentInst.action}</span>
              <span className="text-xs bg-white/20 px-2 py-0.5 rounded-full font-mono font-normal">
                {remainingDist} km
              </span>
            </div>
            <p className="text-sm text-white/90 font-medium">{currentInst.street}</p>
          </div>
        </div>

        <button
          onClick={() => setVoiceMuted(!voiceMuted)}
          className="w-10 h-10 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center transition-colors"
          title={voiceMuted ? 'Unmute voice navigation' : 'Mute voice navigation'}
        >
          <span className="material-symbols-outlined text-[20px]">
            {voiceMuted ? 'volume_off' : 'volume_up'}
          </span>
        </button>
      </div>

      {/* Live Simulation Map & Guidance Surface */}
      <div className="flex-1 relative overflow-hidden bg-[#132337]">
        {/* Dynamic Road Perspective Graphic */}
        <div className="absolute inset-0 flex items-center justify-center">
          <svg className="w-full h-full opacity-80" viewBox="0 0 400 500" preserveAspectRatio="none">
            {/* Horizon & Sky */}
            <rect width="400" height="180" fill="#0d1b2a" />
            <line x1="0" y1="180" x2="400" y2="180" stroke="#00b87a" strokeWidth="1" strokeDasharray="4 4" opacity="0.3" />
            
            {/* Road Perspective lines */}
            <polygon points="170,180 230,180 380,500 20,500" fill="#1b2a3d" />
            {/* Lane dividers animated */}
            <line x1="200" y1="180" x2="200" y2="500" stroke="#00e599" strokeWidth="4" strokeDasharray="16 16" className="animate-pulse" />
            
            {/* Approaching Carpark Beacon */}
            <circle cx="200" cy="185" r="14" fill="#00e599" opacity="0.4" />
            <circle cx="200" cy="185" r="6" fill="#00e599" />
            <text x="200" y="165" textAnchor="middle" fill="#00e599" fontSize="11" fontWeight="bold" fontFamily="monospace">
              {carpark.shortName} ENTRANCE
            </text>
            
            {/* GPS Vehicle Pointer */}
            <g transform="translate(190, 410)">
              <polygon points="10,0 20,24 10,18 0,24" fill="#ffffff" stroke="#00e599" strokeWidth="2" />
            </g>
          </svg>
        </div>

        {/* Live Warning / Guidance Pill */}
        <div className="absolute top-4 left-4 right-4 z-10 flex flex-col gap-2">
          <div className="bg-[#0b1c30]/90 backdrop-blur-md border border-white/10 rounded-xl p-3 flex items-center justify-between shadow-lg">
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-[#00b87a] animate-ping" />
              <span className="text-xs text-white/80 font-medium">{currentInst.subtext}</span>
            </div>
            <span className="text-[11px] font-mono text-[#00e599] font-semibold bg-[#00e599]/10 px-2 py-0.5 rounded">
              LTA Real-time
            </span>
          </div>

          <div className="flex gap-2">
            <div className="flex-1 bg-[#0b1c30]/80 backdrop-blur-md border border-white/10 rounded-lg p-2 px-3 flex items-center gap-2">
              <span className="material-symbols-outlined text-[#00e599] text-[18px]">local_parking</span>
              <div>
                <span className="text-[10px] text-white/60 block leading-tight">Live Lots</span>
                <span className="text-sm font-mono font-bold text-white">{carpark.availableLots} Vacant</span>
              </div>
            </div>
            <div className="flex-1 bg-[#0b1c30]/80 backdrop-blur-md border border-white/10 rounded-lg p-2 px-3 flex items-center gap-2">
              <span className="material-symbols-outlined text-[#5bb8fe] text-[18px]">toll</span>
              <div>
                <span className="text-[10px] text-white/60 block leading-tight">ERP Rate</span>
                <span className="text-sm font-mono font-bold text-[#5bb8fe]">
                  ${carpark.erpGantry.rate.toFixed(2)} Active
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Speedometer Overlay */}
        <div className="absolute bottom-6 left-4 bg-[#0b1c30]/90 backdrop-blur-md border border-white/10 rounded-2xl p-3 px-4 shadow-xl flex items-center gap-3">
          <div className="w-10 h-10 rounded-full border-2 border-red-500 bg-white text-[#0b1c30] flex flex-col items-center justify-center font-bold text-xs leading-none">
            <span>50</span>
            <span className="text-[7px] uppercase font-normal">km/h</span>
          </div>
          <div>
            <div className="flex items-baseline gap-1">
              <span className="text-2xl font-mono font-extrabold text-white">{speed}</span>
              <span className="text-xs text-white/60 font-mono">km/h</span>
            </div>
            <span className="text-[10px] text-[#00e599] font-medium block">Within Limit</span>
          </div>
        </div>
      </div>

      {/* Bottom HUD Action Bar */}
      <div className="bg-[#0b1c30] border-t border-white/10 p-4 pb-8 flex items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="flex flex-col">
            <div className="flex items-baseline gap-1">
              <span className="text-2xl font-bold font-mono text-[#00e599]">{remainingMinutes}</span>
              <span className="text-xs text-white/60">min</span>
            </div>
            <span className="text-xs text-white/70 font-mono">
              {remainingDist} km · ETA 12:44
            </span>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setStep((prev) => Math.min(instructions.length - 1, prev + 1))}
            className="px-4 py-2.5 rounded-xl bg-white/10 hover:bg-white/20 text-xs font-semibold text-white transition-colors"
          >
            Next Maneuver
          </button>
          <button
            onClick={onClose}
            className="px-5 py-2.5 rounded-xl bg-red-600 hover:bg-red-700 text-xs font-bold text-white transition-colors flex items-center gap-1.5 shadow-md"
          >
            <span className="material-symbols-outlined text-[16px]">close</span>
            Exit GPS
          </button>
        </div>
      </div>
    </div>
  );
};
