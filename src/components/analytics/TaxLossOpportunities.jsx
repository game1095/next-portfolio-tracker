import { Receipt } from 'lucide-react';
import InfoTooltip from '../InfoTooltip';

export default function TaxLossOpportunities({ data, currency }) {
  if (!data?.rawTransactions) return null;

  const exRate = currency === 'THB' ? (data?.summary?.liveUsdThb || 1) : 1;
  const currencySymbol = currency === 'USD' ? '$' : '฿';

  const opportunities = data.rawTransactions.filter(tx => {
    if (tx.type === 'SELL') return false;
    
    const holding = data.holdings?.find(h => h.symbol === tx.symbol);
    if (!holding || !holding.currentPrice) return false;

    const currentPrice = holding.currentPrice;
    const dropPercent = ((currentPrice - tx.buyPrice) / tx.buyPrice) * 100;
    
    tx.currentPrice = currentPrice;
    tx.dropPercent = dropPercent;
    tx.potentialLoss = (tx.buyPrice - currentPrice) * tx.shares;

    return dropPercent <= -15;
  }).sort((a, b) => b.potentialLoss - a.potentialLoss);

  const Header = () => (
    <div className="px-4 py-3 border-b border-surface-elevated">
      <div className="flex items-center gap-2">
        <Receipt size={16} className="text-primary" />
        <h3 className="text-sm font-bold font-sans text-text-body">Tax-Loss Harvesting</h3>
        <InfoTooltip text="ตรวจหาหุ้นที่ขาดทุนหนักเพื่อนำไปขายทำ Loss Harvesting ซึ่งอาจช่วยลดหย่อนภาษีจากการลงทุนได้" />
      </div>
    </div>
  );

  if (opportunities.length === 0) {
    return (
      <div className="bg-surface-card rounded-xl border border-surface-elevated flex flex-col h-full">
        <Header />
        <div className="p-4 flex-1 flex items-center justify-center">
          <p className="text-text-muted text-xs">No significant underwater tax lots found. Great job!</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-surface-card rounded-xl border border-surface-elevated flex flex-col h-full">
      <Header />
      <div className="p-4 flex-1 overflow-x-auto">
        <table className="w-full text-left">
          <thead>
            <tr className="text-text-muted text-xs border-b border-surface-elevated">
              <th className="px-2 py-2 font-medium">Asset</th>
              <th className="px-2 py-2 font-medium text-right">Trade Date</th>
              <th className="px-2 py-2 font-medium text-right">Drop %</th>
              <th className="px-2 py-2 font-medium text-right">Harvestable Loss</th>
            </tr>
          </thead>
          <tbody>
            {opportunities.map((tx, i) => (
              <tr key={i} className="border-b border-surface-elevated/50 hover:bg-surface-elevated/20 transition-colors">
                <td className="px-2 py-2.5 font-bold text-sm">{tx.symbol}</td>
                <td className="px-2 py-2.5 text-right text-text-muted text-xs font-tabular">{new Date(tx.tradeDate).toLocaleDateString()}</td>
                <td className="px-2 py-2.5 text-right font-tabular text-sm text-trading-down font-bold">
                  {tx.dropPercent.toFixed(2)}%
                </td>
                <td className="px-2 py-2.5 text-right font-tabular text-sm text-trading-down font-bold">
                  -{currencySymbol}{(tx.potentialLoss * exRate).toLocaleString(undefined, {minimumFractionDigits: 2, maximumFractionDigits: 2})}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className="px-4 pb-3 mt-auto">
        <p className="text-[11px] text-text-muted leading-relaxed">
          Selling these lots can realize capital losses to offset gains, potentially lowering your tax bill.
        </p>
      </div>
    </div>
  );
}
