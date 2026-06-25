import { useState } from 'react';
import { Target } from 'lucide-react';
import InfoTooltip from '../InfoTooltip';

export default function RebalanceReview({ holdings, totalValue }) {
  const [targets, setTargets] = useState({});

  if (!holdings || holdings.length === 0) return null;

  const handleTargetChange = (symbol, value) => {
    setTargets(prev => ({
      ...prev,
      [symbol]: Number(value)
    }));
  };

  const currentTotal = totalValue || 1;

  return (
    <div className="bg-surface-card rounded-xl border border-surface-elevated flex flex-col">
      <div className="px-4 py-3 border-b border-surface-elevated">
        <div className="flex items-center gap-2">
          <Target size={16} className="text-primary" />
          <h3 className="text-sm font-bold font-sans text-text-body">Rebalancing Review</h3>
          <InfoTooltip text="กำหนดสัดส่วนพอร์ตเป้าหมาย (%) แล้วระบบจะคำนวณจำนวนเงินที่ต้อง 'ซื้อเพิ่ม' หรือ 'ขายออก' ให้พอดีเป๊ะ" />
        </div>
      </div>
      <div className="p-4 overflow-x-auto flex-1">
        <table className="w-full text-left">
          <thead>
            <tr className="text-text-muted text-xs border-b border-surface-elevated">
              <th className="px-2 py-2 font-medium font-sans">Asset</th>
              <th className="px-2 py-2 font-medium text-right font-sans">Current %</th>
              <th className="px-2 py-2 font-medium text-right font-sans">Target %</th>
              <th className="px-2 py-2 font-medium text-right font-sans">Action</th>
            </tr>
          </thead>
          <tbody>
            {holdings.map(h => {
              const currentPercent = (h.totalValue / currentTotal) * 100;
              const targetPercent = targets[h.symbol] ?? currentPercent;
              const targetValue = (targetPercent / 100) * currentTotal;
              const diffValue = targetValue - h.totalValue;
              
              let actionText = '-';
              let actionColor = 'text-text-muted';
              
              if (Math.abs(diffValue) > 10) {
                if (diffValue > 0) {
                  actionText = `BUY $${diffValue.toLocaleString(undefined, {maximumFractionDigits: 0})}`;
                  actionColor = 'text-trading-up font-bold';
                } else {
                  actionText = `SELL $${Math.abs(diffValue).toLocaleString(undefined, {maximumFractionDigits: 0})}`;
                  actionColor = 'text-trading-down font-bold';
                }
              }

              return (
                <tr key={h.symbol} className="border-b border-surface-elevated/50 hover:bg-surface-elevated/20 transition-colors">
                  <td className="px-2 py-2.5 font-bold text-sm">{h.symbol}</td>
                  <td className="px-2 py-2.5 text-right font-tabular text-sm">{currentPercent.toFixed(1)}%</td>
                  <td className="px-2 py-2.5 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <input 
                        type="range" 
                        min="0" 
                        max="100" 
                        value={targetPercent}
                        onChange={(e) => handleTargetChange(h.symbol, e.target.value)}
                        className="w-20 accent-primary"
                      />
                      <span className="font-tabular text-sm inline-block w-10 text-right">{targetPercent.toFixed(0)}%</span>
                    </div>
                  </td>
                  <td className={`px-2 py-2.5 text-right font-tabular text-sm ${actionColor}`}>
                    {actionText}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
      <div className="px-4 pb-3">
        <p className="text-[11px] text-text-muted leading-relaxed">
          Drag sliders to set target allocation. Actions show exact $ amounts to reach your target.
        </p>
      </div>
    </div>
  );
}
