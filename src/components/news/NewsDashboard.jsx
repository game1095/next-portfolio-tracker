import { useState, useEffect } from 'react';
import { Newspaper, Filter, ChevronLeft, ChevronRight } from 'lucide-react';
import NewsCard from './NewsCard';
import InfoTooltip from '../InfoTooltip';

export default function NewsDashboard({ holdings, newsData }) {
  const [filterSymbol, setFilterSymbol] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const ITEMS_PER_PAGE = 16;

  useEffect(() => {
    if (filterSymbol === null && holdings && holdings.length > 0) {
      const active = holdings.filter(h => h.totalShares > 0);
      if (active.length > 0) {
        const top = [...active].sort((a, b) => b.totalValue - a.totalValue)[0];
        setFilterSymbol(top.symbol);
      } else {
        setFilterSymbol('ALL');
      }
    }
  }, [holdings, filterSymbol]);

  // Reset to first page when filter changes
  useEffect(() => {
    setCurrentPage(1);
  }, [filterSymbol]);

  const activeHoldings = holdings?.filter(h => h.totalShares > 0) || [];
  const uniqueSymbols = [...new Set(activeHoldings.map(h => h.symbol))];

  if (!newsData) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 animate-pulse">
        {[1, 2, 3, 4, 5, 6].map((i) => (
          <div key={i} className="bg-surface-card border border-surface-elevated rounded-xl p-4 h-32"></div>
        ))}
      </div>
    );
  }

  if (activeHoldings.length === 0) {
    return (
      <div className="p-8 text-center bg-surface-card border border-surface-elevated rounded-xl">
        <Newspaper size={48} className="mx-auto text-surface-elevated mb-4" />
        <h3 className="text-text-body font-bold text-sm mb-2">No Active Holdings</h3>
        <p className="text-text-muted text-xs">Add transactions to your portfolio to start receiving a personalized news feed.</p>
      </div>
    );
  }

  const currentFilter = filterSymbol || 'ALL';
  const filteredNews = currentFilter === 'ALL' 
    ? newsData 
    : newsData.filter(article => article.relatedSymbol === currentFilter);

  const totalPages = Math.ceil(filteredNews.length / ITEMS_PER_PAGE);
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const paginatedNews = filteredNews.slice(startIndex, startIndex + ITEMS_PER_PAGE);

  return (
    <section className="bg-surface-card rounded-xl border border-surface-elevated pb-2">
      
      {/* Header */}
      <div className="px-4 py-3 border-b border-surface-elevated flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Newspaper size={16} className="text-primary" />
          <h2 className="text-sm font-bold font-sans text-text-body">Personalized News Feed</h2>
          <InfoTooltip text="รวมข่าวสารล่าสุดที่เกี่ยวข้องกับหุ้นที่คุณมีอยู่ในพอร์ตการลงทุนปัจจุบันแบบอัตโนมัติ" />
        </div>
        <div className="text-xs text-text-muted">
          Tracking {uniqueSymbols.length} asset{uniqueSymbols.length !== 1 ? 's' : ''}
        </div>
      </div>

      <div className="p-4 space-y-4">
        {/* Filter Bar */}
        {uniqueSymbols.length > 0 && (
          <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-hide border-b border-surface-elevated/50">
            <Filter size={14} className="text-text-muted shrink-0 mr-1" />
            <button 
              onClick={() => setFilterSymbol('ALL')}
              className={`shrink-0 px-3 py-1.5 text-xs font-bold rounded-lg transition-colors ${currentFilter === 'ALL' ? 'bg-primary text-text-on-primary' : 'bg-canvas-dark border border-surface-elevated text-text-muted hover:text-text-body'}`}
            >
              All News
            </button>
            {uniqueSymbols.map(sym => (
              <button 
                key={sym}
                onClick={() => setFilterSymbol(sym)}
                className={`shrink-0 px-3 py-1.5 text-xs font-bold rounded-lg transition-colors ${currentFilter === sym ? 'bg-primary text-text-on-primary' : 'bg-canvas-dark border border-surface-elevated text-text-muted hover:text-text-body'}`}
              >
                {sym}
              </button>
            ))}
          </div>
        )}

        {/* News Grid */}
        {filteredNews.length === 0 ? (
          <div className="p-8 text-center bg-surface-card border border-surface-elevated rounded-xl">
            <p className="text-text-muted text-sm">No recent news found for {currentFilter === 'ALL' ? 'your portfolio assets' : currentFilter}.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {paginatedNews.map((article) => (
              <NewsCard key={article.uuid} article={article} />
            ))}
          </div>
        )}

        {/* Pagination Controls */}
        {totalPages > 1 && (
          <div className="flex items-center justify-center gap-2 mt-6 pt-4">
            <button
              onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
              disabled={currentPage === 1}
              className="flex items-center gap-1 px-3 py-1.5 text-xs font-bold rounded-md bg-canvas-dark border border-surface-elevated text-text-body hover:bg-surface-elevated disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              <ChevronLeft size={14} />
              Prev
            </button>
            
            <div className="flex items-center gap-1">
              {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
                <button
                  key={page}
                  onClick={() => setCurrentPage(page)}
                  className={`w-8 h-8 flex items-center justify-center text-xs font-bold rounded-md transition-colors ${
                    currentPage === page 
                      ? 'bg-primary text-text-on-primary' 
                      : 'bg-canvas-dark border border-surface-elevated text-text-muted hover:text-text-body hover:bg-surface-elevated'
                  }`}
                >
                  {page}
                </button>
              ))}
            </div>

            <button
              onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
              disabled={currentPage === totalPages}
              className="flex items-center gap-1 px-3 py-1.5 text-xs font-bold rounded-md bg-canvas-dark border border-surface-elevated text-text-body hover:bg-surface-elevated disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              Next
              <ChevronRight size={14} />
            </button>
          </div>
        )}
        
        {newsData && newsData.length > 0 && (
          <div className="text-center pt-4">
            <p className="text-[10px] text-text-muted">News aggregated from Yahoo Finance</p>
          </div>
        )}
      </div>
    </section>
  );
}
