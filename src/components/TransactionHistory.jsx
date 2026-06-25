import { History, Pencil, Trash2, Filter, ChevronLeft, ChevronRight } from 'lucide-react';
import { useState, useMemo, useEffect } from 'react';
import axios from 'axios';
import { format } from 'date-fns';
import InfoTooltip from './InfoTooltip';

export default function TransactionHistory({ transactions, loading, onRefresh, onEdit }) {
  const [filterType, setFilterType] = useState('ALL');
  const [filterAsset, setFilterAsset] = useState('ALL');
  const [filterStartDate, setFilterStartDate] = useState('');
  const [filterEndDate, setFilterEndDate] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const ITEMS_PER_PAGE = 10;

  const uniqueAssets = useMemo(() => {
    if (!transactions) return [];
    const assets = new Set(transactions.map(t => t.symbol));
    return Array.from(assets).sort();
  }, [transactions]);

  const filteredTransactions = useMemo(() => {
    if (!transactions) return [];
    return transactions.filter(t => {
      const matchType = filterType === 'ALL' || (t.type || 'BUY') === filterType;
      const matchAsset = filterAsset === 'ALL' || t.symbol === filterAsset;
      
      let matchDate = true;
      if (filterStartDate) {
        matchDate = matchDate && new Date(t.tradeDate) >= new Date(filterStartDate);
      }
      if (filterEndDate) {
        const end = new Date(filterEndDate);
        end.setHours(23, 59, 59, 999);
        matchDate = matchDate && new Date(t.tradeDate) <= end;
      }
      return matchType && matchAsset && matchDate;
    });
  }, [transactions, filterType, filterAsset, filterStartDate, filterEndDate]);

  // Reset to page 1 when filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [filterType, filterAsset, filterStartDate, filterEndDate]);

  if (!transactions) return null;

  const totalPages = Math.ceil((filteredTransactions?.length || 0) / ITEMS_PER_PAGE);
  const currentTransactions = filteredTransactions.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this transaction?')) {
      try {
        await axios.delete(`/api/transactions/${id}`);
        onRefresh();
      } catch (e) {
        alert('Failed to delete transaction');
      }
    }
  };

  return (
    <section className="bg-surface-card rounded-xl border border-surface-elevated">
      <div className="px-4 py-3 border-b border-surface-elevated flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center gap-2 whitespace-nowrap">
          <h2 className="text-sm font-bold flex items-center gap-2">
            <History size={16} className="text-primary"/>
            Transaction History
          </h2>
          <InfoTooltip text="ประวัติการทำธุรกรรม (ซื้อ/ขาย) ทั้งหมดของคุณเรียงตามลำดับเวลา" />
        </div>
        
        <div className="flex flex-wrap items-center gap-3">
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Filter size={14} className="text-text-muted" />
            </div>
            <select 
              value={filterType} 
              onChange={e => setFilterType(e.target.value)}
              className="bg-canvas-dark border border-surface-elevated rounded-lg pl-9 pr-4 py-2 text-sm text-text-body focus:outline-none focus:border-primary transition-colors cursor-pointer appearance-none"
            >
              <option value="ALL">All Types</option>
              <option value="BUY">Buy</option>
              <option value="SELL">Sell</option>
            </select>
          </div>
          
          <select 
            value={filterAsset} 
            onChange={e => setFilterAsset(e.target.value)}
            className="bg-canvas-dark border border-surface-elevated rounded-lg px-3 py-2 text-sm text-text-body focus:outline-none focus:border-primary transition-colors cursor-pointer"
          >
            <option value="ALL">All Assets</option>
            {uniqueAssets.map(asset => (
              <option key={asset} value={asset}>{asset}</option>
            ))}
          </select>

          <div className="flex items-center gap-2">
            <input 
              type="date" 
              value={filterStartDate}
              onChange={e => setFilterStartDate(e.target.value)}
              className="bg-canvas-dark border border-surface-elevated rounded-lg px-3 py-2 text-sm text-text-body focus:outline-none focus:border-primary transition-colors [color-scheme:dark] w-[130px]"
              title="Start Date"
            />
            <span className="text-text-muted text-sm font-medium">to</span>
            <input 
              type="date" 
              value={filterEndDate}
              onChange={e => setFilterEndDate(e.target.value)}
              className="bg-canvas-dark border border-surface-elevated rounded-lg px-3 py-2 text-sm text-text-body focus:outline-none focus:border-primary transition-colors [color-scheme:dark] w-[130px]"
              title="End Date"
            />
          </div>
        </div>
      </div>
      <div className="overflow-x-auto max-h-80 overflow-y-auto">
        <table className="w-full text-left border-collapse">
          <thead className="sticky top-0 bg-surface-card z-10">
            <tr className="text-text-muted font-sans text-xs border-b border-surface-elevated">
              <th className="px-4 py-2.5 font-medium">Date</th>
              <th className="px-4 py-2.5 font-medium">Type</th>
              <th className="px-4 py-2.5 font-medium">Asset</th>
              <th className="px-4 py-2.5 font-medium text-right">Shares</th>
              <th className="px-4 py-2.5 font-medium text-right">Price</th>
              <th className="px-4 py-2.5 font-medium text-right">FX Rate</th>
              <th className="px-4 py-2.5 font-medium text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan="7" className="p-8 text-center text-text-muted text-sm animate-pulse">Loading history...</td>
              </tr>
            ) : currentTransactions.length > 0 ? (
              <>
                {currentTransactions.map((t) => (
                  <tr key={t._id} className="border-b border-surface-elevated/50 hover:bg-surface-elevated/20 transition-colors">
                  <td className="px-4 py-2.5 text-text-body font-tabular text-sm">{format(new Date(t.tradeDate), 'MMM dd, yyyy')}</td>
                  <td className="px-4 py-2.5">
                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded uppercase tracking-wider ${
                      t.type === 'SELL' 
                        ? 'bg-trading-down/10 text-trading-down border border-trading-down/20' 
                        : 'bg-trading-up/10 text-trading-up border border-trading-up/20'
                    }`}>
                      {t.type || 'BUY'}
                    </span>
                  </td>
                  <td className="px-4 py-2.5 font-bold text-text-body text-sm">{t.symbol}</td>
                  <td className="px-4 py-2.5 text-right font-tabular text-sm">{t.shares.toLocaleString()}</td>
                  <td className="px-4 py-2.5 text-right font-tabular text-sm">${t.buyPrice.toLocaleString(undefined, {minimumFractionDigits: 2, maximumFractionDigits: 2})}</td>
                  <td className="px-4 py-2.5 text-right font-tabular text-sm text-text-muted">
                    {t.exchangeRateAtTrade ? `฿${t.exchangeRateAtTrade.toLocaleString(undefined, {minimumFractionDigits: 2, maximumFractionDigits: 2})}` : '-'}
                  </td>
                  <td className="px-4 py-2.5 text-right">
                    <button 
                      onClick={() => onEdit(t)}
                      className="p-1.5 hover:bg-surface-elevated rounded-md text-text-muted hover:text-text-body transition-colors inline-flex mr-1"
                      title="Edit"
                    >
                      <Pencil size={14} />
                    </button>
                    <button 
                      onClick={() => handleDelete(t._id)}
                      className="p-1.5 hover:bg-surface-elevated rounded-md text-trading-down transition-colors inline-flex"
                      title="Delete"
                    >
                      <Trash2 size={14} />
                    </button>
                  </td>
                </tr>
                ))}
                {Array.from({ length: ITEMS_PER_PAGE - currentTransactions.length }).map((_, idx) => (
                  <tr key={`empty-${idx}`} className="border-b border-surface-elevated/50">
                    <td className="px-4 py-2.5 invisible">
                      <div className="h-[28px]"></div>
                    </td>
                    <td colSpan="6"></td>
                  </tr>
                ))}
              </>
            ) : (
              <tr>
                <td colSpan="7" className="p-8 text-center text-text-muted text-sm">
                  No transactions found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
      
      {totalPages > 1 && !loading && (
        <div className="px-4 py-3 border-t border-surface-elevated flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-sm">
          <div className="text-text-muted font-sans text-xs">
            Showing <span className="font-tabular font-bold text-text-body">{(currentPage - 1) * ITEMS_PER_PAGE + 1}</span> to <span className="font-tabular font-bold text-text-body">{Math.min(currentPage * ITEMS_PER_PAGE, filteredTransactions.length)}</span> of <span className="font-tabular font-bold text-text-body">{filteredTransactions.length}</span> transactions
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
