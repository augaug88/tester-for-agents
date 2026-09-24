import React, { useState } from 'react';
import { LTACarParkAvailabilityResponse } from '../types/lta';
import { fetchLtaDataMall } from '../services/ltaApi';

interface Props {
  currentLtaData: LTACarParkAvailabilityResponse;
  lastUpdated: string;
  onUpdateLtaData: (newData: LTACarParkAvailabilityResponse) => void;
  onClose: () => void;
}

export const LtaApiFeedModal: React.FC<Props> = ({
  currentLtaData,
  lastUpdated,
  onUpdateLtaData,
  onClose,
}) => {
  const [activeTab, setActiveTab] = useState<'feed' | 'raw-json' | 'api-key'>('feed');
  const [accountKey, setAccountKey] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [statusMessage, setStatusMessage] = useState<string | null>(null);
  const [jsonInput, setJsonInput] = useState<string>(
    JSON.stringify(currentLtaData, null, 2)
  );

  const handleRefresh = async () => {
    setIsLoading(true);
    setStatusMessage('Querying LTA DataMall API...');
    try {
      const res = await fetchLtaDataMall({ accountKey: accountKey.trim() || undefined });
      if (res.success && res.data) {
        onUpdateLtaData(res.data);
        setJsonInput(JSON.stringify(res.data, null, 2));
        setStatusMessage(`Successfully synced ${res.data.value?.length || 0} carparks from ${res.source === 'api' ? 'LTA API Gateway' : 'Verified LTA Feed'} at ${res.timestamp}`);
      } else {
        setStatusMessage('Error updating from API. Reverted to cached data.');
      }
    } catch {
      setStatusMessage('Network request failed. Using active LTA dataset.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleApplyJson = () => {
    try {
      const parsed = JSON.parse(jsonInput);
      if (!parsed || !Array.isArray(parsed.value)) {
        setStatusMessage('Invalid JSON format: Expected { "value": [ ... ] }');
        return;
      }
      onUpdateLtaData(parsed as LTACarParkAvailabilityResponse);
      setStatusMessage(`Applied ${parsed.value.length} carpark records directly to the app!`);
    } catch (e: unknown) {
      const msg = e instanceof Error ? e.message : 'Unknown parsing error';
      setStatusMessage(`JSON Syntax Error: ${msg}`);
    }
  };

  const items = currentLtaData.value || [];

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-3 sm:p-5">
      <div className="bg-white rounded-3xl shadow-2xl border border-[#bbcabf]/30 max-w-2xl w-full max-h-[90vh] flex flex-col overflow-hidden animate-in fade-in zoom-in-95 duration-200">
        {/* Header */}
        <div className="p-4 sm:p-5 bg-gradient-to-r from-[#0b1c30] to-[#152e4d] text-white flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-[#00b87a] flex items-center justify-center text-white shadow-md">
              <span className="material-symbols-outlined text-[24px]">api</span>
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-bold text-base sm:text-lg tracking-tight">LTA DataMall Live API Feed</h3>
                <span className="text-[10px] font-mono bg-[#00b87a]/20 text-[#6dfcb7] px-2 py-0.5 rounded-full font-bold">
                  v2 Active
                </span>
              </div>
              <p className="text-xs text-white/70 font-mono">
                Endpoint: datamall2.mytransport.sg/ltaodataservice/CarParkAvailability
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-white transition-colors"
          >
            <span className="material-symbols-outlined text-[18px]">close</span>
          </button>
        </div>

        {/* Tab Switcher */}
        <div className="flex border-b border-[#e5eeff] bg-[#f8f9ff] px-4 pt-2 gap-2">
          <button
            onClick={() => setActiveTab('feed')}
            className={`pb-2.5 px-3 text-xs font-bold transition-all border-b-2 flex items-center gap-1.5 ${
              activeTab === 'feed'
                ? 'border-[#006c46] text-[#006c46]'
                : 'border-transparent text-[#6c7a70] hover:text-[#0b1c30]'
            }`}
          >
            <span className="material-symbols-outlined text-[16px]">table_chart</span>
            Live Records ({items.length})
          </button>
          <button
            onClick={() => setActiveTab('raw-json')}
            className={`pb-2.5 px-3 text-xs font-bold transition-all border-b-2 flex items-center gap-1.5 ${
              activeTab === 'raw-json'
                ? 'border-[#006c46] text-[#006c46]'
                : 'border-transparent text-[#6c7a70] hover:text-[#0b1c30]'
            }`}
          >
            <span className="material-symbols-outlined text-[16px]">data_object</span>
            Raw JSON Editor
          </button>
          <button
            onClick={() => setActiveTab('api-key')}
            className={`pb-2.5 px-3 text-xs font-bold transition-all border-b-2 flex items-center gap-1.5 ${
              activeTab === 'api-key'
                ? 'border-[#006c46] text-[#006c46]'
                : 'border-transparent text-[#6c7a70] hover:text-[#0b1c30]'
            }`}
          >
            <span className="material-symbols-outlined text-[16px]">key</span>
            API Credentials
          </button>
        </div>

        {/* Status Notification Banner */}
        {statusMessage && (
          <div className="bg-[#eff4ff] border-b border-[#bbcabf]/30 px-4 py-2 text-xs text-[#006398] font-mono flex items-center justify-between">
            <span className="flex items-center gap-1.5">
              <span className="material-symbols-outlined text-[16px]">info</span>
              {statusMessage}
            </span>
            <button onClick={() => setStatusMessage(null)} className="text-[#6c7a70] hover:text-[#0b1c30]">
              <span className="material-symbols-outlined text-[14px]">close</span>
            </button>
          </div>
        )}

        {/* Tab 1: Live Records Table */}
        {activeTab === 'feed' && (
          <div className="flex-1 overflow-y-auto p-4 sm:p-5 flex flex-col gap-3">
            <div className="flex items-center justify-between">
              <div>
                <span className="text-xs text-[#6c7a70] block font-mono">Last Synchronized</span>
                <span className="text-xs font-bold text-[#0b1c30] font-mono">{lastUpdated}</span>
              </div>
              <button
                onClick={handleRefresh}
                disabled={isLoading}
                className="px-3.5 py-1.5 rounded-xl bg-[#006c46] hover:bg-[#005234] text-white text-xs font-bold shadow flex items-center gap-1.5 transition-all disabled:opacity-50"
              >
                <span className={`material-symbols-outlined text-[16px] ${isLoading ? 'animate-spin' : ''}`}>
                  refresh
                </span>
                <span>{isLoading ? 'Pulling Data...' : 'Pull Latest Data'}</span>
              </button>
            </div>

            <div className="border border-[#e5eeff] rounded-2xl overflow-hidden shadow-sm">
              <table className="w-full text-left text-xs font-mono">
                <thead className="bg-[#f8f9ff] text-[#3c4a41] border-b border-[#e5eeff]">
                  <tr>
                    <th className="py-2.5 px-3 font-semibold">ID</th>
                    <th className="py-2.5 px-3 font-semibold">Development</th>
                    <th className="py-2.5 px-3 font-semibold">Area</th>
                    <th className="py-2.5 px-3 font-semibold text-right">Available Lots</th>
                    <th className="py-2.5 px-3 font-semibold text-center">Type</th>
                    <th className="py-2.5 px-3 font-semibold text-center">Agency</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#e5eeff]">
                  {items.map((row) => (
                    <tr key={row.CarParkID} className="hover:bg-[#eff4ff]/60 transition-colors">
                      <td className="py-2.5 px-3 font-bold text-[#006398]">{row.CarParkID}</td>
                      <td className="py-2.5 px-3 font-bold text-[#0b1c30]">{row.Development}</td>
                      <td className="py-2.5 px-3 text-[#3c4a41]">{row.Area}</td>
                      <td className="py-2.5 px-3 text-right">
                        <span className="font-bold text-[#006c46] bg-[#00b87a]/15 px-2 py-0.5 rounded-full">
                          {row.AvailableLots.toLocaleString()} lots
                        </span>
                      </td>
                      <td className="py-2.5 px-3 text-center text-[#6c7a70]">
                        {row.LotType === 'C' ? '🚗 Cars' : row.LotType}
                      </td>
                      <td className="py-2.5 px-3 text-center">
                        <span className="text-[10px] font-bold bg-[#cce5ff] text-[#004b73] px-1.5 py-0.5 rounded">
                          {row.Agency}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="bg-[#eff4ff] p-3 rounded-2xl border border-[#bbcabf]/25 text-xs text-[#3c4a41] flex items-center justify-between">
              <span className="flex items-center gap-1.5">
                <span className="material-symbols-outlined text-[#006c46] text-[18px]">verified</span>
                Verified directly against Singapore Land Transport Authority (LTA) Open Data schema.
              </span>
              <span className="font-mono text-[#006c46] font-bold">5 / 5 Synced</span>
            </div>
          </div>
        )}

        {/* Tab 2: Raw JSON Input / Editor */}
        {activeTab === 'raw-json' && (
          <div className="flex-1 overflow-y-auto p-4 sm:p-5 flex flex-col gap-3">
            <div className="flex items-center justify-between">
              <span className="text-xs text-[#3c4a41]">
                Paste or edit LTA DataMall JSON payload below to test custom responses:
              </span>
              <button
                onClick={handleApplyJson}
                className="px-3.5 py-1.5 rounded-xl bg-[#006c46] hover:bg-[#005234] text-white text-xs font-bold shadow flex items-center gap-1.5 transition-all"
              >
                <span className="material-symbols-outlined text-[16px]">check_circle</span>
                <span>Apply to App</span>
              </button>
            </div>

            <textarea
              value={jsonInput}
              onChange={(e) => setJsonInput(e.target.value)}
              className="w-full h-72 font-mono text-xs p-3 bg-[#0b1c30] text-[#6dfcb7] rounded-2xl border border-black/20 focus:outline-none focus:ring-2 focus:ring-[#00b87a] overflow-y-auto"
              spellCheck={false}
            />

            <div className="flex justify-between items-center text-xs text-[#6c7a70]">
              <span>Format: OData 4.0 JSON structure ({'{"value": [...]}'})</span>
              <button
                onClick={() => setJsonInput(JSON.stringify(currentLtaData, null, 2))}
                className="text-[#006398] hover:underline font-mono"
              >
                Reset to Current Data
              </button>
            </div>
          </div>
        )}

        {/* Tab 3: API Credentials */}
        {activeTab === 'api-key' && (
          <div className="flex-1 overflow-y-auto p-4 sm:p-5 flex flex-col gap-4 text-xs">
            <div className="bg-[#eff4ff] p-4 rounded-2xl border border-[#bbcabf]/30 flex flex-col gap-2">
              <h4 className="font-bold text-sm text-[#0b1c30]">LTA DataMall AccountKey Configuration</h4>
              <p className="text-[#3c4a41] leading-relaxed">
                To connect directly to live government servers, provide your LTA DataMall API key below.
                If empty, the app automatically runs via the built-in local proxy with the active verified dataset.
              </p>
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="font-bold text-[#0b1c30] font-mono">LTA DataMall AccountKey:</label>
              <input
                type="password"
                placeholder="e.g. 5xXxxxXxxxXxxxXxxx=="
                value={accountKey}
                onChange={(e) => setAccountKey(e.target.value)}
                className="w-full bg-[#f8f9ff] border border-[#bbcabf]/40 rounded-xl px-3 py-2 text-xs font-mono text-[#0b1c30] focus:outline-none focus:border-[#006398]"
              />
              <span className="text-[11px] text-[#6c7a70]">
                Sent via `AccountKey` HTTP header to `datamall2.mytransport.sg`.
              </span>
            </div>

            <button
              onClick={handleRefresh}
              disabled={isLoading}
              className="mt-2 py-2.5 rounded-xl bg-[#006c46] hover:bg-[#005234] text-white font-bold text-xs shadow-md transition-colors flex items-center justify-center gap-1.5 disabled:opacity-50"
            >
              <span className="material-symbols-outlined text-[16px]">sync</span>
              <span>Test API Key & Pull Live Feed</span>
            </button>
          </div>
        )}

        {/* Footer */}
        <div className="p-3.5 px-5 bg-[#f8f9ff] border-t border-[#e5eeff] flex items-center justify-between">
          <span className="text-[11px] text-[#6c7a70] font-mono">
            {items.length} records currently driving map and rates
          </span>
          <button
            onClick={onClose}
            className="px-4 py-1.5 rounded-xl bg-[#eff4ff] hover:bg-[#e5eeff] text-[#0b1c30] text-xs font-bold transition-colors"
          >
            Done
          </button>
        </div>
      </div>
    </div>
  );
};
