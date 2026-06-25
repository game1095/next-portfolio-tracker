import { Grid3X3 } from 'lucide-react';
import InfoTooltip from '../InfoTooltip';

export default function CorrelationMatrix({ matrix, topSymbols }) {
  if (!matrix || !topSymbols || topSymbols.length === 0) return null;

  return (
    <div className="bg-surface-card rounded-xl border border-surface-elevated flex flex-col h-full">
      <div className="px-4 py-3 border-b border-surface-elevated">
        <div className="flex items-center gap-2">
          <Grid3X3 size={16} className="text-primary" />
          <h3 className="text-sm font-bold font-sans text-text-body">Asset Correlation</h3>
          <InfoTooltip text="ตารางวัดความสัมพันธ์ของหุ้น หากค่าเข้าใกล้ 1.0 แปลว่าหุ้นวิ่งไปทางเดียวกัน หากติดลบแปลว่าวิ่งสวนทางกัน" />
        </div>
      </div>
      <div className="p-4 flex-1 overflow-x-auto">
        <table className="w-full text-center text-xs">
          <thead>
            <tr>
              <th className="p-1.5 border border-surface-elevated text-text-muted font-medium"></th>
              {topSymbols.map(sym => (
                <th key={sym} className="p-1.5 border border-surface-elevated font-bold text-text-body">{sym}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {topSymbols.map(sym1 => (
              <tr key={sym1}>
                <td className="p-1.5 border border-surface-elevated font-bold text-text-body">{sym1}</td>
                {topSymbols.map(sym2 => {
                  const val = matrix[sym1]?.[sym2] || 0;
                  const color = val > 0 
                    ? `rgba(14, 203, 129, ${Math.abs(val) * 0.7})` 
                    : `rgba(246, 70, 93, ${Math.abs(val) * 0.7})`;
                  return (
                    <td 
                      key={sym2} 
                      className="p-1.5 border border-surface-elevated font-tabular font-bold"
                      style={{ backgroundColor: color }}
                    >
                      {val.toFixed(2)}
                    </td>
                  );
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className="px-4 pb-3">
        <p className="text-[11px] text-text-muted leading-relaxed">
          1.0 = move together · -1.0 = move opposite · High positive correlation reduces diversification.
        </p>
      </div>
    </div>
  );
}
