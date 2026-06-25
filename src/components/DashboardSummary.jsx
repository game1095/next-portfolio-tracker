import { ArrowRightLeft } from 'lucide-react';
import InfoTooltip from './InfoTooltip';

export default function DashboardSummary({ summary, loading, currency, setCurrency }) {
  
  if (loading || !summary) {
    return (
      <section className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 mb-6 animate-pulse">
        {[1,2,3,4,5,6,7,8].map(i => (
          <div key={i} className="bg-surface-card p-5 rounded-lg h-24 border border-surface-elevated"></div>
        ))}
      </section>
    );
  }

  const exRate = currency === 'THB' ? summary.liveUsdThb : 1;
  const currencySymbol = currency === 'USD' ? '$' : '฿';
  
  const formatVal = (val) => `${currencySymbol}${(val * exRate).toLocaleString(undefined, {minimumFractionDigits: 2, maximumFractionDigits: 2})}`;

  const renderMetric = (label, value, valuePercent = null, colorClass = "text-text-body", tooltipText = "") => (
    <div className="bg-surface-card p-4 rounded-lg border border-surface-elevated">
      <div className="flex items-center gap-1 mb-1.5">
        <h3 className="text-text-muted font-sans text-xs font-medium">{label}</h3>
        {tooltipText && <InfoTooltip text={tooltipText} />}
      </div>
      <div className={`flex flex-wrap items-baseline gap-x-2 gap-y-1 ${colorClass}`}>
        <span className="text-xl lg:text-2xl font-tabular font-bold truncate" title={value}>
          {value}
        </span>
        {valuePercent !== null && (
          <span className="text-xs opacity-80 font-tabular font-bold whitespace-nowrap">
            ({valuePercent >= 0 ? '+' : ''}{valuePercent.toFixed(2)}%)
          </span>
        )}
      </div>
    </div>
  );

  return (
    <div className="mb-6">
      {/* Controls Row */}
      <div className="flex justify-between items-center mb-4">
        <div className="flex items-center gap-2 bg-surface-card border border-surface-elevated px-3 py-1.5 rounded-lg">
          <span className="text-text-muted text-xs font-sans font-bold flex items-center gap-1.5">
            USD/THB
            <InfoTooltip text="อัตราแลกเปลี่ยนดอลลาร์/บาท ปัจจุบัน ระบบจะอัปเดตข้อมูลให้คุณอัตโนมัติทุกๆ 1 นาที" />
          </span>
          <span className="text-text-body font-bold font-tabular text-sm">฿{summary.liveUsdThb.toFixed(2)}</span>
          <span className="w-1.5 h-1.5 rounded-full bg-trading-up animate-pulse" title="Live Connection Active"></span>
        </div>
        <button 
          onClick={() => setCurrency(currency === 'USD' ? 'THB' : 'USD')}
          className="bg-surface-card text-text-body px-3 py-1.5 rounded-md text-xs flex items-center gap-1.5 hover:bg-surface-elevated transition-colors border border-surface-elevated font-semibold"
        >
          <ArrowRightLeft size={12}/>
          View in {currency === 'USD' ? 'THB' : 'USD'}
        </button>
      </div>

      {/* Metric Cards Grid */}
      <section className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 mb-6">
        {renderMetric(
          "Total Portfolio Value", 
          formatVal(summary.totalValue),
          null,
          "text-text-body",
          "มูลค่าตลาดรวมของสินทรัพย์ทั้งหมดที่คุณถือครองอยู่ในปัจจุบัน"
        )}
        
        {renderMetric(
          "Total P/L", 
          `${summary.totalUnrealizedPl >= 0 ? '+' : ''}${formatVal(Math.abs(summary.totalUnrealizedPl))}`,
          summary.totalUnrealizedPlPercent,
          summary.totalUnrealizedPl >= 0 ? 'text-trading-up' : 'text-trading-down',
          "กำไรหรือขาดทุนที่ยังไม่เกิดขึ้นจริง (Unrealized) คำนวณจากสินทรัพย์ที่กำลังถืออยู่"
        )}

        {renderMetric(
          "Day Gain", 
          `${summary.dayGain >= 0 ? '+' : ''}${formatVal(Math.abs(summary.dayGain))}`,
          summary.dayGainPercent,
          summary.dayGain >= 0 ? 'text-trading-up' : 'text-trading-down',
          "การเปลี่ยนแปลงมูลค่าพอร์ตเทียบกับราคาปิดของวันทำการก่อนหน้า"
        )}

        {renderMetric(
          "Est. Annual Dividends", 
          `${formatVal(summary.totalDividends)}`,
          null,
          'text-primary',
          "รายได้แบบ Passive Income จากเงินปันผลที่คาดว่าจะได้รับใน 1 ปี"
        )}

        {renderMetric(
          "Realized P/L", 
          `${summary.totalRealizedPl >= 0 ? '+' : ''}${formatVal(Math.abs(summary.totalRealizedPl))}`,
          null,
          summary.totalRealizedPl >= 0 ? 'text-trading-up' : 'text-trading-down',
          "กำไรหรือขาดทุนสุทธิที่เกิดขึ้นจริง (Realized) จากสินทรัพย์ที่คุณกดขายไปแล้ว"
        )}

        {renderMetric(
          "Win Rate", 
          `${summary.winRate.toFixed(1)}%`,
          null,
          summary.winRate >= 50 ? 'text-trading-up' : 'text-trading-down',
          "เปอร์เซ็นต์ความแม่นยำในการเทรด คำนวณจากจำนวนครั้งที่ขายทำกำไรเทียบกับการขายทั้งหมด"
        )}

        {renderMetric(
          "FX Impact", 
          `${summary.fxImpactPercent >= 0 ? '+' : ''}${summary.fxImpactPercent.toFixed(2)}%`,
          null,
          summary.fxImpactPercent >= 0 ? 'text-trading-up' : 'text-trading-down',
          "ผลกระทบจากอัตราแลกเปลี่ยน (USD/THB) ต่อพอร์ตของคุณ"
        )}

        {/* Benchmark Card */}
        <div className="bg-surface-card p-4 rounded-lg border border-surface-elevated">
          <div className="flex items-center gap-1 mb-1.5">
            <h3 className="text-text-muted font-sans text-xs font-medium">vs S&P 500 (IVV)</h3>
            <InfoTooltip text="เปรียบเทียบผลตอบแทนพอร์ตของคุณกับดัชนี S&P 500 (IVV) หากคุณซื้อ IVV ในวันและเวลาเดียวกัน" />
          </div>
          <div className="space-y-1.5">
            <div className="flex justify-between items-center text-xs font-tabular">
              <span className="text-text-muted">Portfolio</span>
              <span className={`font-bold ${summary.totalUnrealizedPlPercent >= 0 ? 'text-trading-up' : 'text-trading-down'}`}>
                {summary.totalUnrealizedPlPercent >= 0 ? '+' : ''}{summary.totalUnrealizedPlPercent.toFixed(2)}%
              </span>
            </div>
            
            {(() => {
               const benchPl = summary.benchmarkTotalValue - summary.totalCost;
               const benchPercent = summary.totalCost > 0 ? (benchPl / summary.totalCost) * 100 : 0;
               return (
                 <>
                   <div className="flex justify-between items-center text-xs font-tabular">
                    <span className="text-text-muted">IVV</span>
                    <span className={`font-bold ${benchPercent >= 0 ? 'text-trading-up' : 'text-trading-down'}`}>
                      {benchPercent >= 0 ? '+' : ''}{benchPercent.toFixed(2)}%
                    </span>
                   </div>
                   <div className="w-full bg-surface-elevated h-1 mt-2 rounded-full overflow-hidden flex">
                      <div className={`h-full ${summary.totalUnrealizedPlPercent >= benchPercent ? 'bg-primary' : 'bg-text-muted'}`} style={{width: '50%'}}></div>
                      <div className={`h-full ${benchPercent > summary.totalUnrealizedPlPercent ? 'bg-primary' : 'bg-text-muted'}`} style={{width: '50%'}}></div>
                   </div>
                   <div className="flex justify-between text-[10px] mt-0.5 text-text-muted font-sans">
                     <span>Portfolio</span>
                     <span>IVV</span>
                   </div>
                 </>
               )
            })()}
          </div>
        </div>
      </section>
    </div>
  );
}
