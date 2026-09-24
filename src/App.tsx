import { useState, useEffect } from 'react';
import { CARPARKS, Carpark, USER_VEHICLE } from './data/carparks';
import { MobileAppView } from './components/MobileAppView';
import { DesktopDashboardView } from './components/DesktopDashboardView';
import { TurnByTurnGpsModal } from './components/TurnByTurnGpsModal';
import { ReservePlugModal } from './components/ReservePlugModal';
import { TopUpModal } from './components/TopUpModal';
import { LtaApiFeedModal } from './components/LtaApiFeedModal';
import { INITIAL_LTA_DATA, mapLtaToCarparks } from './services/ltaApi';
import { LTACarParkAvailabilityResponse } from './types/lta';

export default function App() {
  const [viewMode, setViewMode] = useState<'app' | 'webpage'>('app');
  const [phoneOrientation, setPhoneOrientation] = useState<'portrait' | 'landscape'>('portrait');
  
  // Initialize carparks directly with user's LTA DataMall payload
  const [ltaData, setLtaData] = useState<LTACarParkAvailabilityResponse>(INITIAL_LTA_DATA);
  const [carparks, setCarparks] = useState<Carpark[]>(() => mapLtaToCarparks(INITIAL_LTA_DATA, CARPARKS));
  const [lastLtaSyncTime, setLastLtaSyncTime] = useState<string>('Live Connected');
  const [showLtaModal, setShowLtaModal] = useState(false);

  const [selectedCarpark, setSelectedCarpark] = useState<Carpark>(() => {
    const initialList = mapLtaToCarparks(INITIAL_LTA_DATA, CARPARKS);
    return initialList[0];
  });
  
  const [activeGpsCarpark, setActiveGpsCarpark] = useState<Carpark | null>(null);
  const [reserveModalCarpark, setReserveModalCarpark] = useState<Carpark | null>(null);
  const [showTopUpModal, setShowTopUpModal] = useState(false);
  const [obuBalance, setObuBalance] = useState(USER_VEHICLE.obuBalance);
  const [bookmarkedCarparkIds, setBookmarkedCarparkIds] = useState<string[]>(['suntec-city', 'marina-square']);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Auto-detect real device orientation on resize
  useEffect(() => {
    const handleResize = () => {
      const isWindowLandscape = window.innerWidth > window.innerHeight && window.innerHeight < 600;
      if (isWindowLandscape && phoneOrientation !== 'landscape') {
        setPhoneOrientation('landscape');
      }
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [phoneOrientation]);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage(null);
    }, 2800);
  };

  const handleUpdateLtaData = (newData: LTACarParkAvailabilityResponse) => {
    setLtaData(newData);
    const updated = mapLtaToCarparks(newData, CARPARKS);
    setCarparks(updated);
    
    // Maintain or update currently selected carpark
    if (selectedCarpark) {
      const updatedSelected = updated.find((c) => c.id === selectedCarpark.id || c.name.toLowerCase().includes(selectedCarpark.name.toLowerCase())) || updated[0];
      setSelectedCarpark(updatedSelected);
    }

    const timestamp = new Date().toLocaleTimeString('en-SG', {
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
    });
    setLastLtaSyncTime(timestamp);
    showToast(`Synced ${newData.value?.length || 0} carparks from LTA DataMall!`);
  };

  const handleToggleBookmark = (carparkId: string) => {
    setBookmarkedCarparkIds((prev) => {
      const exists = prev.includes(carparkId);
      if (exists) {
        showToast('Removed from saved carparks');
        return prev.filter((id) => id !== carparkId);
      } else {
        showToast('Saved to your favourite carparks ⭐');
        return [...prev, carparkId];
      }
    });
  };

  const handleReservedBay = (bayId: string) => {
    showToast(`EV Bay ${bayId} locked for 15 mins!`);
    if (reserveModalCarpark) {
      setCarparks((prev) =>
        prev.map((cp) => {
          if (cp.id === reserveModalCarpark.id) {
            return {
              ...cp,
              evSummary: {
                ...cp.evSummary,
                freeCount: Math.max(0, cp.evSummary.freeCount - 1),
              },
              evBays: cp.evBays.map((bay) =>
                bay.id === bayId ? { ...bay, status: 'reserved' as const } : bay
              ),
            };
          }
          return cp;
        })
      );
    }
  };

  const handleTopUpSuccess = (amount: number) => {
    setObuBalance((prev) => prev + amount);
    showToast(`$${amount.toFixed(2)} added to OBU smart cashcard!`);
  };

  return (
    <div className="min-h-screen bg-[#e2e8f0] text-[#0b1c30] flex flex-col items-center select-none font-sans">
      {/* =========================================================================
          PROMINENT GLOBAL TOP SWITCHER & LTA LIVE STATUS BAR
          ========================================================================= */}
      <div className="w-full bg-[#0b1c30] text-white py-2 px-3 sm:px-6 shadow-md flex items-center justify-between border-b border-white/10 z-50 sticky top-0">
        {/* Brand identity lockup & LTA Feed Indicator */}
        <div className="flex items-center gap-2.5 min-w-0">
          <span className="w-2.5 h-2.5 rounded-full bg-[#00e599] animate-pulse flex-shrink-0" />
          <span className="font-bold text-xs sm:text-sm tracking-tight truncate">
            ParkSG Platform
          </span>
          <span className="text-white/40 hidden md:inline">|</span>
          <button
            onClick={() => setShowLtaModal(true)}
            className="hidden sm:inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-white/10 hover:bg-white/20 text-[#6dfcb7] text-[11px] font-mono cursor-pointer transition-colors border border-white/15"
            title="Open LTA DataMall Live API Feed Manager"
          >
            <span className="material-symbols-outlined text-[13px]">api</span>
            <span>LTA DataMall ({ltaData.value?.length || 5} Feed Lots)</span>
          </button>
        </div>

        {/* PRIMARY TOGGLE BUTTONS */}
        <div className="flex items-center gap-2">
          {/* LTA API Feed Trigger Button */}
          <button
            onClick={() => setShowLtaModal(true)}
            className="flex items-center gap-1 px-2.5 py-1 rounded-lg bg-[#00e599]/15 hover:bg-[#00e599]/25 text-[#00e599] text-xs font-bold border border-[#00e599]/30 transition-all active:scale-95"
            title="Pull/inspect live data from LTA DataMall API"
          >
            <span className="material-symbols-outlined text-[16px]">sync</span>
            <span className="hidden xs:inline">API Feed</span>
          </button>

          {/* Mobile vs Web View Segmented Button */}
          <div className="flex items-center bg-white/15 p-1 rounded-xl border border-white/15 shadow-inner">
            <button
              onClick={() => setViewMode('app')}
              className={`px-3 py-1 rounded-lg text-xs font-bold flex items-center gap-1.5 transition-all ${
                viewMode === 'app'
                  ? 'bg-[#00b87a] text-white shadow-sm'
                  : 'text-white/80 hover:text-white hover:bg-white/10'
              }`}
            >
              <span className="material-symbols-outlined text-[16px]">smartphone</span>
              <span>Mobile View</span>
            </button>

            <button
              onClick={() => setViewMode('webpage')}
              className={`px-3 py-1 rounded-lg text-xs font-bold flex items-center gap-1.5 transition-all ${
                viewMode === 'webpage'
                  ? 'bg-[#00b87a] text-white shadow-sm'
                  : 'text-white/80 hover:text-white hover:bg-white/10'
              }`}
            >
              <span className="material-symbols-outlined text-[16px]">desktop_windows</span>
              <span>Web View</span>
            </button>
          </div>

          {/* Rotate Phone Button (Visible when in Mobile App mode) */}
          {viewMode === 'app' && (
            <button
              onClick={() =>
                setPhoneOrientation((prev) => (prev === 'portrait' ? 'landscape' : 'portrait'))
              }
              className="flex items-center gap-1 px-2.5 py-1.5 rounded-xl bg-white/10 hover:bg-white/20 text-white text-xs font-semibold border border-white/20 transition-all active:scale-95"
              title="Rotate phone orientation"
            >
              <span className="material-symbols-outlined text-[16px]">screen_rotation</span>
              <span className="hidden sm:inline">
                {phoneOrientation === 'portrait' ? 'Rotate Phone 🔄' : 'Portrait 📱'}
              </span>
            </button>
          )}
        </div>
      </div>

      {/* =========================================================================
          VIEWPORT CONTAINER
          ========================================================================= */}
      {viewMode === 'app' ? (
        <div className="w-full flex-1 flex justify-center items-center py-2 sm:py-6 px-1 sm:px-4">
          {/* Phone Chassis Container */}
          <div
            className={`w-full bg-white shadow-2xl transition-all duration-300 relative flex flex-col overflow-hidden ${
              phoneOrientation === 'landscape'
                ? 'max-w-[880px] h-[460px] sm:h-[480px] rounded-2xl md:rounded-[36px] border-4 md:border-[10px] md:border-[#0b1c30]'
                : 'max-w-[420px] min-h-screen md:min-h-[820px] rounded-none md:rounded-[40px] border-0 md:border-[10px] md:border-[#0b1c30]'
            }`}
          >
            {/* Simulated iPhone Speaker / Camera island on desktop */}
            <div className="hidden md:flex justify-center items-center h-5 bg-[#0b1c30] w-full flex-shrink-0">
              <div className="w-20 h-3.5 bg-black rounded-full flex items-center justify-between px-2.5">
                <span className="w-1.5 h-1.5 rounded-full bg-[#1b2a3d]" />
                <span className="w-2 h-2 rounded-full bg-[#142334] border border-white/20" />
              </div>
            </div>

            {/* Mobile App Component */}
            <div className="flex-1 flex flex-col overflow-y-auto no-scrollbar relative">
              <MobileAppView
                carparks={carparks}
                selectedCarpark={selectedCarpark}
                onSelectCarpark={(cp) => setSelectedCarpark(cp)}
                onStartGps={(cp) => setActiveGpsCarpark(cp)}
                onOpenReserve={(cp) => setReserveModalCarpark(cp)}
                onOpenTopUp={() => setShowTopUpModal(true)}
                obuBalance={obuBalance}
                bookmarkedCarparkIds={bookmarkedCarparkIds}
                onToggleBookmark={handleToggleBookmark}
                onToggleViewMode={() => setViewMode('webpage')}
                onOpenLtaFeed={() => setShowLtaModal(true)}
                isLandscape={phoneOrientation === 'landscape'}
              />
            </div>
          </div>
        </div>
      ) : (
        /* Full-Width Desktop Webpage Dashboard */
        <div className="w-full flex-1 flex flex-col bg-white">
          <DesktopDashboardView
            carparks={carparks}
            selectedCarpark={selectedCarpark}
            onSelectCarpark={(cp) => setSelectedCarpark(cp)}
            onStartGps={(cp) => setActiveGpsCarpark(cp)}
            onOpenReserve={(cp) => setReserveModalCarpark(cp)}
            onOpenTopUp={() => setShowTopUpModal(true)}
            obuBalance={obuBalance}
            bookmarkedCarparkIds={bookmarkedCarparkIds}
            onToggleBookmark={handleToggleBookmark}
            onSwitchToMobile={() => setViewMode('app')}
            onOpenLtaFeed={() => setShowLtaModal(true)}
          />
        </div>
      )}

      {/* =========================================================================
          MODALS
          ========================================================================= */}
      {/* 1. LTA DataMall Live API Feed Modal */}
      {showLtaModal && (
        <LtaApiFeedModal
          currentLtaData={ltaData}
          lastUpdated={lastLtaSyncTime}
          onUpdateLtaData={handleUpdateLtaData}
          onClose={() => setShowLtaModal(false)}
        />
      )}

      {/* 2. Turn-by-Turn GPS Modal */}
      {activeGpsCarpark && (
        <TurnByTurnGpsModal
          carpark={activeGpsCarpark}
          onClose={() => setActiveGpsCarpark(null)}
        />
      )}

      {/* 3. EV Plug Reservation Modal */}
      {reserveModalCarpark && (
        <ReservePlugModal
          carpark={reserveModalCarpark}
          onClose={() => setReserveModalCarpark(null)}
          onReserved={handleReservedBay}
        />
      )}

      {/* 4. OBU CashCard Top-Up Modal */}
      {showTopUpModal && (
        <TopUpModal
          currentBalance={obuBalance}
          onClose={() => setShowTopUpModal(false)}
          onTopUp={handleTopUpSuccess}
        />
      )}

      {/* Toast Feedback */}
      {toastMessage && (
        <div className="fixed bottom-20 md:bottom-6 z-50 bg-[#0b1c30] text-white px-4 py-2.5 rounded-2xl shadow-2xl border border-white/20 text-xs font-semibold flex items-center gap-2 animate-bounce">
          <span className="material-symbols-outlined text-[#00e599] text-[18px]">info</span>
          <span>{toastMessage}</span>
        </div>
      )}
    </div>
  );
}
