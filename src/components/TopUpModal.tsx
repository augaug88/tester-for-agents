import React, { useState } from 'react';

interface Props {
  currentBalance: number;
  onClose: () => void;
  onTopUp: (amount: number) => void;
}

export const TopUpModal: React.FC<Props> = ({ currentBalance, onClose, onTopUp }) => {
  const [selectedAmount, setSelectedAmount] = useState(50);
  const [success, setSuccess] = useState(false);

  const amounts = [20, 50, 100, 200];

  const handleConfirm = () => {
    setSuccess(true);
    setTimeout(() => {
      onTopUp(selectedAmount);
      onClose();
    }, 1500);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fadeIn">
      <div className="bg-[#ffffff] text-[#0b1c30] rounded-2xl max-w-sm w-full p-5 shadow-2xl border border-[#bbcabf]/30 flex flex-col gap-4">
        <div className="flex items-center justify-between pb-2 border-b border-[#e5eeff]">
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-[#006398] text-[22px]">account_balance_wallet</span>
            <h3 className="font-bold text-base text-[#0b1c30]">ERP 2.0 OBU Top-Up</h3>
          </div>
          <button onClick={onClose} className="text-[#6c7a70] hover:text-[#0b1c30]">
            <span className="material-symbols-outlined text-[20px]">close</span>
          </button>
        </div>

        {success ? (
          <div className="py-6 flex flex-col items-center text-center gap-2">
            <div className="w-12 h-12 rounded-full bg-[#00b87a]/20 text-[#006c46] flex items-center justify-center">
              <span className="material-symbols-outlined text-[30px]">check</span>
            </div>
            <h4 className="font-bold text-base">Top-Up Successful!</h4>
            <p className="text-xs text-[#3c4a41]">
              ${selectedAmount.toFixed(2)} added to OBU #9842103982. New balance: ${(currentBalance + selectedAmount).toFixed(2)}.
            </p>
          </div>
        ) : (
          <>
            <div className="bg-[#eff4ff] p-3 rounded-xl flex items-center justify-between">
              <span className="text-xs text-[#3c4a41]">Current OBU Balance</span>
              <span className="font-mono font-bold text-lg text-[#006398]">${currentBalance.toFixed(2)}</span>
            </div>

            <div>
              <label className="text-xs font-semibold text-[#3c4a41] block mb-2">Select Amount</label>
              <div className="grid grid-cols-4 gap-2">
                {amounts.map((amt) => (
                  <button
                    key={amt}
                    type="button"
                    onClick={() => setSelectedAmount(amt)}
                    className={`py-2 rounded-xl font-mono text-sm font-bold border transition-all ${
                      selectedAmount === amt
                        ? 'border-[#00b87a] bg-[#00b87a]/15 text-[#006c46] shadow-sm'
                        : 'border-[#bbcabf] bg-white text-[#0b1c30] hover:border-[#006398]'
                    }`}
                  >
                    ${amt}
                  </button>
                ))}
              </div>
            </div>

            <div className="text-xs text-[#6c7a70] bg-[#f8f9ff] p-2.5 rounded-lg border border-[#e5eeff]">
              Linked to PayNow / DBS Auto-Debit (Account ending in ···4891). Zero transaction surcharge.
            </div>

            <div className="flex gap-2 pt-1">
              <button
                type="button"
                onClick={onClose}
                className="flex-1 py-2.5 rounded-xl border border-[#bbcabf] text-xs font-semibold text-[#3c4a41]"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleConfirm}
                className="flex-1 py-2.5 rounded-xl bg-[#00b87a] hover:bg-[#006c46] text-white text-xs font-bold shadow-md transition-colors"
              >
                Confirm +${selectedAmount}
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
};
