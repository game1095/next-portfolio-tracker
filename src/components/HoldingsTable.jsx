import { useState, useEffect, useRef, useMemo } from 'react';
import { LayoutDashboard, ArrowUpDown, ChevronLeft, ChevronRight } from 'lucide-react';
import InfoTooltip from './InfoTooltip';

const HoldingRow = ({ h, currencySymbol, exRate }) => {
  const [flashClass, setFlashClass] = useState('');
  const prevPrice = useRef(h.currentPrice);

  useEffect(() => {
    if (h.currentPrice !== prevPrice.current) {
      if (h.currentPrice > prevPrice.current) {
        setFlashClass('flash-up');
      } else if (h.currentPrice < prevPrice.current) {
        setFlashClass('flash-down');
      }
      prevPrice.current = h.currentPrice;

      const timer = setTimeout(() => {
        setFlashClass('');
      }, 3500);

      return () => clearTimeout(timer);
    }
  }, [h.currentPrice]);

  return (
    <tr className={`border-b border-surface-elevated/50 transition-colors ${flashClass || 'hover:bg-surface-elevated/20'}`}>
      <td className="px-4 py-3 flex items-center gap-3">
        <div className="w-8 h-8 rounded-full overflow-hidden bg-surface-elevated flex items-center justify-center shrink-0 border border-surface-elevated relative">
          <span className="text-xs font-bold text-text-muted absolute z-0">
            {h.symbol.charAt(0)}
          </span>
          {h.website && (
            <img 
              src={`https://www.google.com/s2/favicons?domain=${h.website.replace(/^https?:\/\//, '').replace(/^www\./, '').split('/')[0]}&sz=128`} 
              alt={h.symbol}
              className="w-full h-full object-cover z-10 bg-white"
              onError={(e) => {
                e.target.style.display = 'none';
              }}
            />
          )}
        </div>
        <div>
          <div className="font-bold text-sm">{h.symbol}</div>
          <div className="text-[11px] text-text-muted font-normal">{h.sector}</div>
        </div>
      </td>
      <td className="px-4 py-3 text-right font-tabular text-sm">{h.totalShares.toLocaleString()}</td>
      <td className="px-4 py-3 text-right font-tabular text-sm text-text-muted">{currencySymbol}{(h.averageCost * exRate)?.toLocaleString(undefined, {minimumFractionDigits: 2, maximumFractionDigits: 2})}</td>
      <td className="px-4 py-3 text-right font-tabular text-sm">{currencySymbol}{(h.currentPrice * exRate)?.toLocaleString(undefined, {minimumFractionDigits: 2, maximumFractionDigits: 2})}</td>
      <td className="px-4 py-3 text-right font-tabular text-sm font-bold">{currencySymbol}{(h.totalValue * exRate)?.toLocaleString(undefined, {minimumFractionDigits: 2, maximumFractionDigits: 2})}</td>
      <td className={`px-4 py-3 text-right font-tabular text-sm ${h.unrealizedPl >= 0 ? 'text-trading-up' : 'text-trading-down'}`}>
        <div className="font-bold">{h.unrealizedPl >= 0 ? '+' : ''}{currencySymbol}{(Math.abs(h.unrealizedPl) * exRate).toLocaleString(undefined, {minimumFractionDigits: 2, maximumFractionDigits: 2})}</div>
        <div className="text-[11px] opacity-80">{h.unrealizedPl >= 0 ? '+' : ''}{h.unrealizedPlPercent?.toLocaleString(undefined, {minimumFractionDigits: 2, maximumFractionDigits: 2})}%</div>
      </td>
      <td className="px-4 py-3 text-right font-tabular text-sm text-primary font-bold">
        {h.yieldOnCost > 0 ? `${h.yieldOnCost.toFixed(2)}%` : '-'}
      </td>
    </tr>
  );
};

export default function HoldingsTable({ data, loading, currency }) {
  const [sortConfig, setSortConfig] = useState({ key: 'totalValue', direction: 'desc' });
  const [lastUpdate, setLastUpdate] = useState(Date.now());
  const [progress, setProgress] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const ITEMS_PER_PAGE = 10;

  useEffect(() => {
    setLastUpdate(Date.now());
    setProgress(0);
  }, [data]);

  useEffect(() => {
    const updateInterval = 60000; // 60 seconds
    const timer = setInterval(() => {
      const elapsed = Date.now() - lastUpdate;
      const p = Math.min((elapsed / updateInterval) * 100, 100);
      setProgress(p);
    }, 100);

    return () => clearInterval(timer);
  }, [lastUpdate]);


  const sortedHoldings = useMemo(() => {
    if (!data?.holdings) return [];
    return [...data.holdings].sort((a, b) => {
      let aVal = a[sortConfig.key];
      let bVal = b[sortConfig.key];
      
      // Handle nested sort keys if needed
      if (sortConfig.key === 'unrealizedPlPercent') {
        aVal = a.unrealizedPlPercent;
        bVal = b.unrealizedPlPercent;
      }
      
      if (aVal < bVal) return sortConfig.direction === 'asc' ? -1 : 1;
      if (aVal > bVal) return sortConfig.direction === 'asc' ? 1 : -1;
      return 0;
    });
  }, [data?.holdings, sortConfig]);

  const requestSort = (key) => {
    let direction = 'desc';
    if (sortConfig.key === key && sortConfig.direction === 'desc') {
      direction = 'asc';
    }
    setSortConfig({ key, direction });
    setCurrentPage(1); // Reset page on sort
  };

  const SortIcon = ({ columnKey }) => {
    return (
      <ArrowUpDown 
        size={12} 
        className={`inline-block ml-1 cursor-pointer hover:text-primary transition-colors ${sortConfig.key === columnKey ? 'text-primary opacity-100' : 'opacity-30'}`} 
        onClick={() => requestSort(columnKey)}
      />
    );
  };

  const exRate = currency === 'THB' ? (data?.summary?.liveUsdThb || 1) : 1;
  const currencySymbol = currency === 'USD' ? '$' : '฿';

  const totalPages = Math.ceil((sortedHoldings?.length || 0) / ITEMS_PER_PAGE);
  const currentHoldings = useMemo(() => {
    return sortedHoldings.slice(
      (currentPage - 1) * ITEMS_PER_PAGE,
      currentPage * ITEMS_PER_PAGE
    );
  }, [sortedHoldings, currentPage]);

  if (!data?.holdings) return null;

  return (
    <section className="bg-surface-card rounded-xl border border-surface-elevated">
      <div className="px-4 py-3 border-b border-surface-elevated flex items-center justify-between">
        <div className="flex items-center gap-2">
          <h2 className="text-sm font-bold flex items-center gap-2">
            <LayoutDashboard size={16} className="text-primary"/>
            Your Assets
          </h2>
          <InfoTooltip text="ตารางสรุปรายละเอียดสินทรัพย์ทั้งหมดที่มีอยู่ในพอร์ตของคุณแบบเจาะลึก (ระบบจะดึงข้อมูลใหม่ทุกๆ 60 วินาที)" />
        </div>
        
        {/* Cooldown Bar */}
        <div className="flex items-center gap-2" title="Next auto-update">
          <span className="text-[10px] text-text-muted font-medium uppercase tracking-wider hidden sm:inline-block">Update in</span>
          <div className="w-16 sm:w-24 h-1.5 bg-canvas-dark border border-surface-elevated rounded-full overflow-hidden">
            <div 
              className="h-full bg-primary transition-all duration-100 ease-linear" 
              style={{ width: `${progress}%` }}
            ></div>
          </div>
        </div>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead className="relative z-20">
            <tr className="text-text-muted font-sans text-xs border-b border-surface-elevated">
              <th className="px-4 py-2.5 font-medium">
                <div className="flex items-center gap-1">
                  Asset <InfoTooltip text="ชื่อย่อหุ้น (Ticker) และหมวดหมู่อุตสาหกรรม" /> <SortIcon columnKey="symbol" />
                </div>
              </th>
              <th className="px-4 py-2.5 font-medium">
                <div className="flex items-center justify-end gap-1">
                  Holdings <InfoTooltip text="จำนวนหุ้นทั้งหมดที่คุณถือครองอยู่" /> <SortIcon columnKey="totalShares" />
                </div>
              </th>
              <th className="px-4 py-2.5 font-medium">
                <div className="flex items-center justify-end gap-1">
                  Avg Cost <InfoTooltip text="ต้นทุนเฉลี่ยต่อหุ้น (รวมผลกระทบจากอัตราแลกเปลี่ยน หากดูในหน่วย THB)" />
                </div>
              </th>
              <th className="px-4 py-2.5 font-medium">
                <div className="flex items-center justify-end gap-1">
                  Price <InfoTooltip text="ราคาตลาดปัจจุบันต่อหุ้น" />
                </div>
              </th>
              <th className="px-4 py-2.5 font-medium">
                <div className="flex items-center justify-end gap-1">
                  Value <InfoTooltip text="มูลค่าตลาดรวมของหุ้นตัวนี้ (ราคาปัจจุบัน × จำนวนหุ้น)" /> <SortIcon columnKey="totalValue" />
                </div>
              </th>
              <th className="px-4 py-2.5 font-medium">
                <div className="flex items-center justify-end gap-1">
                  P/L <InfoTooltip text="กำไรหรือขาดทุนที่ยังไม่เกิดขึ้นจริงของหุ้นตัวนี้" /> <SortIcon columnKey="unrealizedPlPercent" />
                </div>
              </th>
              <th className="px-4 py-2.5 font-medium">
                <div className="flex items-center justify-end gap-1">
                  YOC <InfoTooltip text="Yield on Cost: อัตราผลตอบแทนจากเงินปันผล เทียบกับต้นทุนเฉลี่ยของคุณ (ไม่ใช่เทียบกับราคาปัจจุบัน)" /> <SortIcon columnKey="yieldOnCost" />
                </div>
              </th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan="7" className="p-8 text-center text-text-muted text-sm animate-pulse">Loading holdings...</td>
              </tr>
            ) : currentHoldings.length > 0 ? (
              <>
                {currentHoldings.map((h) => (
                  <HoldingRow key={h.symbol} h={h} currencySymbol={currencySymbol} exRate={exRate} />
                ))}
                {Array.from({ length: ITEMS_PER_PAGE - currentHoldings.length }).map((_, idx) => (
                  <tr key={`empty-${idx}`} className="border-b border-surface-elevated/50">
                    <td className="px-4 py-3 flex items-center gap-3 invisible">
                      <div className="w-8 h-8"></div>
                    </td>
                    <td colSpan="6"></td>
                  </tr>
                ))}
              </>
            ) : (
              <tr>
                <td colSpan="7" className="p-8 text-center text-text-muted text-sm">
                  No holdings found. Add your first transaction.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
      
      {totalPages > 1 && !loading && (
        <div className="px-4 py-3 border-t border-surface-elevated flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-sm">
          <div className="text-text-muted font-sans text-xs">
            Showing <span className="font-tabular font-bold text-text-body">{(currentPage - 1) * ITEMS_PER_PAGE + 1}</span> to <span className="font-tabular font-bold text-text-body">{Math.min(currentPage * ITEMS_PER_PAGE, sortedHoldings.length)}</span> of <span className="font-tabular font-bold text-text-body">{sortedHoldings.length}</span> assets
          </div>
          <div className="flex items-center gap-1">
            <button
              onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
              disabled={currentPage === 1}
              className="p-1.5 rounded-md border border-surface-elevated text-text-muted hover:text-text-body hover:bg-surface-elevated transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <ChevronLeft size={16} />
            </button>
            
            {Array.from({ length: totalPages }).map((_, idx) => {
              const page = idx + 1;
              const isActive = page === currentPage;
              return (
                <button
                  key={page}
                  onClick={() => setCurrentPage(page)}
                  className={`w-7 h-7 flex items-center justify-center rounded-md font-tabular text-xs transition-colors ${
                    isActive 
                      ? 'bg-primary text-[#181a20] font-bold' 
                      : 'border border-surface-elevated text-text-muted hover:text-text-body hover:bg-surface-elevated'
                  }`}
                >
                  {page}
                </button>
              );
            })}

            <button
              onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
              disabled={currentPage === totalPages}
              className="p-1.5 rounded-md border border-surface-elevated text-text-muted hover:text-text-body hover:bg-surface-elevated transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <ChevronRight size={16} />
            </button>
          </div>
        </div>
      )}
    </section>
  );
}
