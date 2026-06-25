import { ArrowUpRight, ArrowDownRight, Flame, Snowflake } from 'lucide-react';
import InfoTooltip from './InfoTooltip';

export default function TopMovers({ gainers, losers }) {
  if (!gainers && !losers) return null;

  const MoverCard = ({ asset, isGainer }) => (
    <div className="flex items-center justify-between p-2.5 rounded-lg bg-canvas-dark border border-surface-elevated">
      <div className="flex items-center gap-2.5">
        <div className="w-7 h-7 rounded-full flex items-center justify-center shrink-0 bg-surface-elevated">
          <span className="text-[10px] font-bold text-text-body">{asset.symbol.substring(0, 2)}</span>
        </div>
        <div>
          <div className="font-bold text-xs text-text-body">{asset.symbol}</div>
          <div className="text-[10px] text-text-muted font-tabular">${asset.currentPrice.toLocaleString(undefined, {minimumFractionDigits: 2, maximumFractionDigits: 2})}</div>
        </div>
      </div>
      <div className={`text-right flex items-center gap-1 font-tabular font-bold text-xs ${isGainer ? 'text-trading-up' : 'text-trading-down'}`}>
        {isGainer ? <ArrowUpRight size={12} /> : <ArrowDownRight size={12} />}
        {Math.abs(asset.unrealizedPlPercent).toFixed(2)}%
      </div>
    </div>
  );

  return (
    <div className="space-y-4">
      {/* Gainers */}
      <div className="bg-surface-card p-4 rounded-xl border border-surface-elevated">
        <div className="flex items-center gap-1.5 mb-3">
          <Flame size={14} className="text-trading-up" />
          <h3 className="text-xs font-bold font-sans text-text-body">Top Gainers</h3>
          <InfoTooltip text="หุ้นที่ทำกำไรให้พอร์ตคุณมากที่สุดในตอนนี้" />
        </div>
        <div className="space-y-2">
          {gainers?.length > 0 ? (
            gainers.map(h => <MoverCard key={h.symbol} asset={h} isGainer={true} />)
          ) : (
            <div className="text-xs text-text-muted py-3 text-center">No gainers found.</div>
          )}
        </div>
      </div>

      {/* Losers */}
      <div className="bg-surface-card p-4 rounded-xl border border-surface-elevated">
        <div className="flex items-center gap-1.5 mb-3">
          <Snowflake size={14} className="text-trading-down" />
          <h3 className="text-xs font-bold font-sans text-text-body">Top Losers</h3>
          <InfoTooltip text="หุ้นที่ขาดทุนมากที่สุดในพอร์ตตอนนี้" />
        </div>
        <div className="space-y-2">
          {losers?.length > 0 ? (
            losers.map(h => <MoverCard key={h.symbol} asset={h} isGainer={false} />)
          ) : (
            <div className="text-xs text-text-muted py-3 text-center">No losers found.</div>
          )}
        </div>
      </div>
    </div>
  );
}
