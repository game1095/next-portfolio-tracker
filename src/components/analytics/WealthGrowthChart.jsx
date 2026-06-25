import { memo } from 'react';
import { AreaChart, Area, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { LineChart as LineChartIcon } from 'lucide-react';
import InfoTooltip from '../InfoTooltip';

export default memo(function WealthGrowthChart({ deepData }) {
  if (!deepData?.historicalTimeline) return null;

  const combinedData = [...deepData.historicalTimeline, ...(deepData.forecast || [])];

  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-surface-card border border-surface-elevated p-3 rounded-lg text-xs">
          <p className="text-text-muted font-sans mb-1">{label}</p>
          {payload.map((entry, i) => (
            <p key={i} className="font-tabular font-bold" style={{ color: entry.color }}>
              {entry.name}: ${Number(entry.value).toLocaleString(undefined, { maximumFractionDigits: 0 })}
            </p>
          ))}
        </div>
      );
    }
    return null;
  };

  return (
    <div className="bg-surface-card rounded-xl border border-surface-elevated flex flex-col h-[420px]">
      <div className="px-4 py-3 border-b border-surface-elevated">
        <div className="flex items-center gap-2">
          <LineChartIcon size={16} className="text-primary" />
          <h3 className="text-sm font-bold font-sans text-text-body">
            Wealth Growth & Logarithmic Forecast
          </h3>
          <InfoTooltip text="กราฟแสดงการเติบโตของพอร์ตในอดีต พร้อมเส้นพยากรณ์ Logarithmic ที่จำลองแนวโน้มการเติบโตในปีหน้า" />
        </div>
      </div>
      <div className="p-4 flex-1 min-h-0">
        <ResponsiveContainer width="100%" height="100%">
        <AreaChart data={combinedData}>
          <defs>
            <linearGradient id="colorValue" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#FCD535" stopOpacity={0.3}/>
              <stop offset="95%" stopColor="#FCD535" stopOpacity={0}/>
            </linearGradient>
            <linearGradient id="colorCost" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#707a8a" stopOpacity={0.3}/>
              <stop offset="95%" stopColor="#707a8a" stopOpacity={0}/>
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" stroke="#2b3139" vertical={false} />
          <XAxis 
            dataKey="date" 
            tickFormatter={(tick) => {
              const d = new Date(tick);
              return `${d.getMonth()+1}/${d.getFullYear().toString().substr(2)}`;
            }}
            stroke="#707a8a"
            tick={{ fontSize: 11 }}
          />
          <YAxis stroke="#707a8a" tickFormatter={(v) => `$${(v/1000).toFixed(0)}k`} tick={{ fontSize: 11 }} />
          <Tooltip content={<CustomTooltip />} />
          <Area type="monotone" dataKey="marketValue" stroke="#FCD535" fillOpacity={1} fill="url(#colorValue)" name="Market Value" strokeWidth={1.5} />
          <Area type="stepAfter" dataKey="costBasis" stroke="#707a8a" fillOpacity={1} fill="url(#colorCost)" name="Cost Basis" strokeWidth={1} />
          <Line type="monotone" dataKey="projectedValue" stroke="#0ecb81" strokeDasharray="5 5" dot={false} name="Forecast" strokeWidth={1.5} />
        </AreaChart>
      </ResponsiveContainer>
      </div>
    </div>
  );
});
