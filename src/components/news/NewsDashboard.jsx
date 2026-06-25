import { useState, useEffect } from 'react';
import axios from 'axios';
import { Newspaper, Filter } from 'lucide-react';
import NewsCard from './NewsCard';
import InfoTooltip from '../InfoTooltip';

export default function NewsDashboard({ holdings }) {
  const [news, setNews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filterSymbol, setFilterSymbol] = useState('ALL');

  useEffect(() => {
    let isMounted = true;

    const fetchNews = async () => {
      if (!holdings || holdings.length === 0) {
        setLoading(false);
        return;
      }

      setLoading(true);
      setError(null);

      const symbols = [...new Set(holdings.filter(h => h.totalShares > 0).map(h => h.symbol))];

      if (symbols.length === 0) {
        setLoading(false);
        return;
      }

      try {
        const response = await axios.post('/api/market/news', { symbols });
        if (isMounted) {
          setNews(response.data.news || []);
        }
      } catch (err) {
        console.error('Failed to fetch news:', err);
        if (isMounted) {
          setError('Failed to load portfolio news. Please try again later.');
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    fetchNews();

    return () => {
      isMounted = false;
    };
  }, [holdings]);

  const activeHoldings = holdings?.filter(h => h.totalShares > 0) || [];
  const uniqueSymbols = [...new Set(activeHoldings.map(h => h.symbol))];

  if (loading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 animate-pulse">
        {[1, 2, 3, 4, 5, 6].map((i) => (
          <div key={i} className="bg-surface-card border border-surface-elevated rounded-xl p-4 h-32"></div>
        ))}
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-8 text-center bg-surface-card border border-surface-elevated rounded-xl">
        <p className="text-trading-down text-sm">{error}</p>
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

  const filteredNews = filterSymbol === 'ALL' 
    ? news 
    : news.filter(article => article.relatedSymbol === filterSymbol);

  return (
    <section className="bg-surface-card rounded-xl border border-surface-elevated">
      
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
        <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-hide">
          <Filter size={14} className="text-text-muted shrink-0 mr-1" />
          <button 
            onClick={() => setFilterSymbol('ALL')}
            className={`shrink-0 px-3 py-1.5 text-xs font-bold rounded-lg transition-colors ${filterSymbol === 'ALL' ? 'bg-primary text-text-on-primary' : 'bg-canvas-dark border border-surface-elevated text-text-muted hover:text-text-body'}`}
          >
            All News
          </button>
          {uniqueSymbols.map(sym => (
            <button 
              key={sym}
              onClick={() => setFilterSymbol(sym)}
              className={`shrink-0 px-3 py-1.5 text-xs font-bold rounded-lg transition-colors ${filterSymbol === sym ? 'bg-primary text-text-on-primary' : 'bg-canvas-dark border border-surface-elevated text-text-muted hover:text-text-body'}`}
            >
              {sym}
            </button>
          ))}
        </div>
      )}

      {/* News Grid */}
      {filteredNews.length === 0 ? (
        <div className="p-8 text-center bg-surface-card border border-surface-elevated rounded-xl">
          <p className="text-text-muted text-sm">No recent news found for {filterSymbol === 'ALL' ? 'your portfolio assets' : filterSymbol}.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {filteredNews.map((article) => (
            <NewsCard key={article.uuid} article={article} />
          ))}
        </div>
      )}
      
        {news.length > 0 && (
          <div className="text-center pt-2">
            <p className="text-[10px] text-text-muted">News aggregated from Yahoo Finance</p>
          </div>
        )}

      </div>
    </section>
  );
}
