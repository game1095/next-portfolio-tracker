import { Calculator } from 'lucide-react';
import InfoTooltip from '../InfoTooltip';

export default function DCAAnalyzer({ holdings }) {
  if (!holdings || holdings.length === 0) return null;

  return (
    <div className="bg-surface-card rounded-xl border border-surface-elevated flex flex-col">
      <div className="px-4 py-3 border-b border-surface-elevated">
        <div className="flex items-center gap-2">
          <Calculator size={16} className="text-primary" />
          <h3 className="text-sm font-bold font-sans text-text-body">DCA vs Lump Sum</h3>
          <InfoTooltip text="เปรียบเทียบ 'ต้นทุนเฉลี่ย (DCA)' ของคุณ กับ 'ราคาในวันแรก' เพื่อดูว่าการทยอยซื้อทำให้คุณได้เปรียบหรือไม่" />
        </div>
      </div>
      <div className="p-4 overflow-x-auto flex-1">
        <table className="w-full text-left">
          <thead>
            <tr className="text-text-muted text-xs border-b border-surface-elevated">
              <th className="px-2 py-2 font-medium font-sans">Asset</th>
              <th className="px-2 py-2 font-medium text-right font-sans">First Entry</th>
              <th className="px-2 py-2 font-medium text-right font-sans">Lump Sum</th>
              <th className="px-2 py-2 font-medium text-right font-sans">DCA Cost</th>
              <th className="px-2 py-2 font-medium text-right font-sans">Advantage</th>
            </tr>
          </thead>
          <tbody>
            {holdings.filter(h => h.transactions.length > 1).map(h => {
              const sortedTxs = [...h.transactions].sort((a, b) => new Date(a.tradeDate) - new Date(b.tradeDate));
              const firstTx = sortedTxs[0];
              const lumpSumPrice = firstTx.buyPrice;
              const dcaCost = h.averageCost;
              
              const diffPercent = ((lumpSumPrice - dcaCost) / lumpSumPrice) * 100;
              
              let advantageText = '';
              let advantageColor = '';
              
              if (diffPercent > 0) {
                advantageText = `Saved ${diffPercent.toFixed(1)}%`;
                advantageColor = 'text-trading-up font-bold';
              } else if (diffPercent < 0) {
                advantageText = `Lost ${Math.abs(diffPercent).toFixed(1)}%`;
                advantageColor = 'text-trading-down font-bold';
              } else {
                advantageText = 'Neutral';
                advantageColor = 'text-text-muted';
              }

              return (
                <tr key={h.symbol} className="border-b border-surface-elevated/50 hover:bg-surface-elevated/20 transition-colors">
                  <td className="px-2 py-2.5 font-bold text-sm">{h.symbol}</td>
                  <td className="px-2 py-2.5 text-right text-text-muted text-xs font-tabular">
                    {new Date(firstTx.tradeDate).toLocaleDateString()}
                  </td>
                  <td className="px-2 py-2.5 text-right font-tabular text-sm">
                    ${lumpSumPrice.toLocaleString(undefined, {minimumFractionDigits: 2, maximumFractionDigits: 2})}
                  </td>
                  <td className="px-2 py-2.5 text-right font-tabular text-sm">
                    ${dcaCost.toLocaleString(undefined, {minimumFractionDigits: 2, maximumFractionDigits: 2})}
                  </td>
                  <td className={`px-2 py-2.5 text-right font-tabular text-sm ${advantageColor}`}>
                    {advantageText}
                  </td>
                </tr>
              );
            })}
            
            {holdings.filter(h => h.transactions.length > 1).length === 0 && (
              <tr>
                <td colSpan="5" className="p-4 text-center text-text-muted text-xs">
                  Need at least 2 transactions in the same asset to analyze DCA.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
      <div className="px-4 pb-3">
        <p className="text-[11px] text-text-muted leading-relaxed">
          Compares your DCA average cost against a theoretical lump sum on your first trade date. Positive % means DCA lowered your cost basis.
        </p>
      </div>
    </div>
  );
}
