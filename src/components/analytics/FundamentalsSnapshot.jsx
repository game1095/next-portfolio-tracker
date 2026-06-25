import { Activity, Target, TrendingDown, Crosshair } from 'lucide-react';
import InfoTooltip from '../InfoTooltip';

export default function FundamentalsSnapshot({ summary, deepData, holdings }) {
  // Calculate Win/Loss Ratio
  let winCount = 0;
  let lossCount = 0;
  
  if (holdings) {
    holdings.forEach(h => {
      winCount += h.winCount || 0;
      lossCount += h.lossCount || 0;
    });
  }

  const totalClosed = winCount + lossCount;
  const winRate = totalClosed > 0 ? (winCount / totalClosed) * 100 : 0;

  const MetricCard = ({ icon, label, tooltip, value, valueColor = "text-text-body", subtitle }) => (
    <div className="bg-surface-card p-4 rounded-lg border border-surface-elevated flex flex-col justify-between">
      <div className="flex items-center gap-1.5 mb-2">
        {icon}
        <h3 className="text-text-muted text-xs font-medium font-sans">{label}</h3>
        <InfoTooltip text={tooltip} />
      </div>
      <div className={`text-2xl font-bold font-tabular ${valueColor}`}>{value}</div>
      <p className="text-[11px] text-text-muted mt-1.5 font-sans">{subtitle}</p>
    </div>
  );

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
      <MetricCard 
        icon={<Activity size={14} className="text-primary" />}
        label="Portfolio Beta"
        tooltip="ค่าวัดความผันผวน หาก Beta > 1 แปลว่าพอร์ตคุณสวิงแรงกว่าตลาด หาก < 1 แปลว่าพอร์ตค่อนข้างนิ่ง"
        value={summary?.portfolioBeta?.toFixed(2) || '1.00'}
        subtitle={summary?.portfolioBeta > 1 ? 'More volatile than S&P 500' : 'Less volatile than S&P 500'}
      />
      <MetricCard 
        icon={<Target size={14} className="text-primary" />}
        label="Weighted P/E"
        tooltip="ค่าเฉลี่ย P/E Ratio ของพอร์ต (ถ่วงน้ำหนักตามมูลค่าการลงทุน) ยิ่งสูงยิ่งเป็นหุ้นเติบโต (Growth)"
        value={summary?.portfolioPE?.toFixed(2) || '0.00'}
        subtitle={summary?.portfolioPE > 25 ? 'Growth-leaning portfolio' : 'Value-leaning portfolio'}
      />
      <MetricCard 
        icon={<TrendingDown size={14} className="text-primary" />}
        label="Max Drawdown"
        tooltip="จุดที่พอร์ตเคยขาดทุนหนักที่สุด (จากจุดสูงสุดลงมาจุดต่ำสุด) ในอดีต"
        value={deepData?.maxDrawdown ? (deepData.maxDrawdown * 100).toFixed(2) + '%' : '0.00%'}
        valueColor="text-trading-down"
        subtitle="Historical peak-to-trough drop"
      />
      <MetricCard 
        icon={<Crosshair size={14} className="text-primary" />}
        label="Win Rate"
        tooltip="เปอร์เซ็นต์ความแม่นยำของการขายทำกำไร"
        value={totalClosed > 0 ? winRate.toFixed(1) + '%' : '-'}
        valueColor={winRate >= 50 ? 'text-trading-up' : 'text-trading-down'}
        subtitle={`${winCount} Wins / ${lossCount} Losses`}
      />
    </div>
  );
}
