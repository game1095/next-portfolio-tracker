import { History, Pencil, Trash2 } from 'lucide-react';
import axios from 'axios';
import { format } from 'date-fns';
import InfoTooltip from './InfoTooltip';

export default function TransactionHistory({ transactions, loading, onRefresh, onEdit }) {
  if (!transactions) return null;

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
      <div className="px-4 py-3 border-b border-surface-elevated flex items-center justify-between">
        <div className="flex items-center gap-2">
          <h2 className="text-sm font-bold flex items-center gap-2">
            <History size={16} className="text-primary"/>
            Transaction History
          </h2>
          <InfoTooltip text="ประวัติการทำธุรกรรม (ซื้อ/ขาย) ทั้งหมดของคุณเรียงตามลำดับเวลา" />
        </div>
      </div>
      <div className="overflow-x-auto max-h-80 overflow-y-auto">
        <table className="w-full text-left border-collapse">
          <thead className="sticky top-0 bg-surface-card z-10">
            <tr className="text-text-muted font-sans text-xs border-b border-surface-elevated">
              <th className="px-4 py-2.5 font-medium">Date</th>
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
                <td colSpan="6" className="p-8 text-center text-text-muted text-sm animate-pulse">Loading history...</td>
              </tr>
            ) : transactions.length > 0 ? (
              transactions.map((t) => (
                <tr key={t._id} className="border-b border-surface-elevated/50 hover:bg-surface-elevated/20 transition-colors">
                  <td className="px-4 py-2.5 text-text-body font-tabular text-sm">{format(new Date(t.tradeDate), 'MMM dd, yyyy')}</td>
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
              ))
            ) : (
              <tr>
                <td colSpan="6" className="p-8 text-center text-text-muted text-sm">
                  No transactions found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </section>
  );
}
