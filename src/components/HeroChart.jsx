import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { TrendingUp } from 'lucide-react';
import InfoTooltip from './InfoTooltip';

export default function HeroChart({ historicalTimeline }) {
  if (!historicalTimeline || historicalTimeline.length === 0) {
    return (
      <div className="bg-surface-card rounded-xl border border-surface-elevated flex flex-col h-[400px] mb-8 animate-pulse p-6">
        <div className="h-6 w-48 bg-surface-elevated rounded mb-4"></div>
        <div className="flex-1 bg-surface-elevated/50 rounded-lg"></div>
      </div>
    );
  }

  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-surface-card border border-surface-elevated p-3 rounded-lg shadow-xl">
          <p className="font-bold text-text-body mb-2">{label}</p>
          {payload.map((entry, index) => (
            <p key={index} className="text-sm" style={{ color: entry.color }}>
              {entry.name}: <span className="font-tabular font-bold">${entry.value.toLocaleString(undefined, {minimumFractionDigits: 2, maximumFractionDigits: 2})}</span>
            </p>
          ))}
          {payload.length >= 2 && (
            <div className="mt-2 pt-2 border-t border-surface-elevated">
              <p className="text-sm text-text-muted">
                Unrealized P/L: 
                <span className={`font-tabular font-bold ml-1 ${payload[1].value >= payload[0].value ? 'text-trading-up' : 'text-trading-down'}`}>
                  ${(payload[1].value - payload[0].value).toLocaleString(undefined, {minimumFractionDigits: 2, maximumFractionDigits: 2})}
                </span>
              </p>
            </div>
          )}
        </div>
      );
    }
    return null;
  };

  return (
    <div className="bg-surface-card rounded-xl border border-surface-elevated flex flex-col h-[400px] mb-8">
      <div className="p-6 border-b border-surface-elevated flex items-center justify-between">
        <div className="flex items-center gap-2">
          <h2 className="text-xl font-bold flex items-center gap-2 font-sans text-text-body">
            <TrendingUp size={20} className="text-primary" />
            Portfolio Growth Tracker
          </h2>
          <InfoTooltip text="กราฟแสดงมูลค่าตลาด (Market Value) เทียบกับต้นทุนสะสม (Cost Basis) ช่องว่างระหว่างสองเส้นคือกำไร/ขาดทุนของคุณ" />
        </div>
      </div>
      <div className="p-6 flex-1 min-h-0">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={historicalTimeline} margin={{ top: 10, right: 0, left: 0, bottom: 0 }}>
            <defs>
              <linearGradient id="colorValueHero" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#FCD535" stopOpacity={0.3}/>
                <stop offset="95%" stopColor="#FCD535" stopOpacity={0}/>
              </linearGradient>
              <linearGradient id="colorCostHero" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3}/>
                <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="#1e2329" vertical={false} />
            <XAxis 
              dataKey="date" 
              stroke="#848e9c" 
              fontSize={12} 
              tickLine={false} 
              axisLine={false}
              minTickGap={50}
            />
            <YAxis 
              stroke="#848e9c" 
              fontSize={12} 
              tickLine={false} 
              axisLine={false} 
              tickFormatter={(value) => `$${value.toLocaleString()}`}
              domain={['auto', 'auto']}
              width={80}
            />
            <Tooltip content={<CustomTooltip />} />
            
            <Area 
              type="monotone" 
              dataKey="totalCost" 
              name="Cost Basis" 
              stroke="#3b82f6" 
              strokeWidth={2}
              fillOpacity={1} 
              fill="url(#colorCostHero)" 
            />
            <Area 
              type="monotone" 
              dataKey="totalValue" 
              name="Market Value" 
              stroke="#FCD535" 
              strokeWidth={3}
              fillOpacity={1} 
              fill="url(#colorValueHero)" 
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
