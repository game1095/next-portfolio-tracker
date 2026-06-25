import { PieChart as PieChartIcon } from 'lucide-react';
import { Treemap, ResponsiveContainer, Tooltip } from 'recharts';
import InfoTooltip from './InfoTooltip';

const COLORS = ['#FCD535', '#0ecb81', '#f6465d', '#3b82f6', '#8b5cf6', '#ec4899', '#f97316'];

const CustomTooltip = ({ active, payload }) => {
  if (active && payload && payload.length) {
    const data = payload[0].payload;
    return (
      <div className="bg-surface-card border border-surface-elevated p-3 rounded-lg">
        <p className="font-bold text-text-body text-sm mb-1">{data.name}</p>
        <p className="text-xs text-text-muted">Value: <span className="font-tabular font-bold text-text-body">${data.value.toLocaleString(undefined, {minimumFractionDigits: 2, maximumFractionDigits: 2})}</span></p>
        <p className="text-xs text-text-muted">P/L: <span className={`font-tabular font-bold ${data.unrealizedPl >= 0 ? 'text-trading-up' : 'text-trading-down'}`}>
          {data.unrealizedPl >= 0 ? '+' : ''}${data.unrealizedPl.toLocaleString(undefined, {minimumFractionDigits: 2, maximumFractionDigits: 2})} ({data.plPercent.toFixed(2)}%)
        </span></p>
      </div>
    );
  }
  return null;
};

export default function SectorHeatmap({ data, loading }) {
  if (loading || !data?.holdings) {
    return (
      <section className="bg-surface-card rounded-xl border border-surface-elevated overflow-hidden h-72 animate-pulse p-4">
      </section>
    );
  }

  // Aggregate by sector
  const sectorMap = {};
  data.holdings.forEach(h => {
    const sector = h.sector || 'Unknown';
    if (!sectorMap[sector]) {
      sectorMap[sector] = { totalValue: 0, totalCost: 0, unrealizedPl: 0 };
    }
    sectorMap[sector].totalValue += h.totalValue;
    sectorMap[sector].totalCost += h.totalCost;
    sectorMap[sector].unrealizedPl += h.unrealizedPl;
  });

  const chartData = Object.keys(sectorMap).map(sector => {
    const cost = sectorMap[sector].totalCost;
    const plPercent = cost > 0 ? (sectorMap[sector].unrealizedPl / cost) * 100 : 0;
    return {
      name: sector,
      value: sectorMap[sector].totalValue,
      plPercent: plPercent,
      unrealizedPl: sectorMap[sector].unrealizedPl
    };
  }).sort((a, b) => b.value - a.value);

  if (chartData.length === 0) return null;

  return (
    <section className="bg-surface-card rounded-xl border border-surface-elevated">
      <div className="px-4 py-3 border-b border-surface-elevated flex items-center gap-2">
        <PieChartIcon size={14} className="text-primary"/>
        <h2 className="text-xs font-bold">Sector Allocation</h2>
        <InfoTooltip text="สัดส่วนการลงทุนของคุณที่กระจายตัวอยู่ในหมวดหมู่อุตสาหกรรม (Sector) ต่างๆ" />
      </div>
      <div className="h-64 w-full p-3">
        <ResponsiveContainer width="100%" height="100%">
          <Treemap
            data={chartData}
            dataKey="value"
            stroke="#1e2329"
            fill="#FCD535"
            content={<CustomizedContent colors={COLORS} />}
          >
            <Tooltip content={<CustomTooltip />} />
          </Treemap>
        </ResponsiveContainer>
      </div>
    </section>
  );
}

const getColorForPl = (plPercent) => {
  if (plPercent === undefined || plPercent === null) return '#2b3139';
  if (plPercent >= 5) return '#0ecb81'; // Trading Up
  if (plPercent > 0) return '#0b9c64';  // Darker Green
  if (plPercent === 0) return '#2b3139'; // Neutral
  if (plPercent <= -5) return '#f6465d'; // Trading Down
  return '#c43346'; // Darker Red
};

const CustomizedContent = (props) => {
  const { root, depth, x, y, width, height, index, colors, name, value } = props;
  const plPercent = props.plPercent || 0;

  return (
    <g>
      <rect
        x={x}
        y={y}
        width={width}
        height={height}
        style={{
          fill: depth < 2 ? getColorForPl(plPercent) : '#ffffff00',
          stroke: '#1e2329',
          strokeWidth: 2,
          strokeOpacity: 1,
        }}
      />
      {width > 50 && height > 35 ? (
        <>
          <text
            x={x + width / 2}
            y={y + height / 2 - 6}
            textAnchor="middle"
            fill="#eaecef"
            stroke="none"
            className="font-sans font-bold text-[10px]"
          >
            {name}
          </text>
          <text
            x={x + width / 2}
            y={y + height / 2 + 8}
            textAnchor="middle"
            fill="#eaecef"
            stroke="none"
            className="font-tabular font-bold text-[10px] opacity-90"
          >
            {plPercent > 0 ? '+' : ''}{Number(plPercent).toFixed(1)}%
          </text>
        </>
      ) : width > 30 && height > 18 ? (
        <text
          x={x + width / 2}
          y={y + height / 2}
          textAnchor="middle"
          fill="#eaecef"
          stroke="none"
          className="font-sans font-bold text-[9px]"
        >
          {name}
        </text>
      ) : null}
    </g>
  );
};
