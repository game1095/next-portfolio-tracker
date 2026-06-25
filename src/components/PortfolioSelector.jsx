import { useState, useRef, useEffect } from 'react';
import { ChevronDown, Globe, Folder } from 'lucide-react';

export default function PortfolioSelector({ portfolios, activeId, onChange }) {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);

  // Close on outside click
  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const activePortfolio = activeId === 'global' 
    ? { name: 'Global Portfolio', _id: 'global' } 
    : portfolios.find(p => p._id === activeId);

  return (
    <div className="relative" ref={dropdownRef}>
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className={`flex items-center gap-2 bg-transparent transition-colors px-4 py-2 rounded-lg font-bold text-sm min-w-[200px] justify-between
          ${isOpen ? 'text-primary' : 'text-text-body hover:text-primary/80'}`}
      >
        <div className="flex items-center gap-2">
           {activeId === 'global' ? <Globe size={16} className="text-primary" /> : <Folder size={16} className="text-primary" />}
           <span className="truncate max-w-[140px]">{activePortfolio?.name || 'Loading...'}</span>
        </div>
        <ChevronDown size={16} className={`text-text-muted transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`} />
      </button>

      {isOpen && (
        <div className="absolute top-[calc(100%+8px)] right-0 w-[260px] bg-surface-card border border-surface-elevated rounded-xl overflow-hidden z-50 animate-in fade-in slide-in-from-top-2 duration-150">
          <div className="p-1.5">
            <button
              onClick={() => { onChange('global'); setIsOpen(false); }}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-bold transition-all
                ${activeId === 'global' ? 'bg-primary/10 text-primary' : 'text-text-body hover:bg-surface-elevated'}`}
            >
              <Globe size={16} className={activeId === 'global' ? 'text-primary' : 'text-text-muted'} />
              Global Portfolio
            </button>
            
            {portfolios.length > 0 && (
              <>
                <div className="h-px bg-surface-elevated my-2 mx-2"></div>
                <div className="text-xs font-bold text-text-muted uppercase px-3 pb-1.5 pt-1 tracking-wider">Sub-Portfolios</div>
              </>
            )}

            <div className="max-h-60 overflow-y-auto pr-1">
              {portfolios.map(p => (
                <button
                  key={p._id}
                  onClick={() => { onChange(p._id); setIsOpen(false); }}
                  className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-bold transition-all mb-1 last:mb-0
                    ${activeId === p._id ? 'bg-primary/10 text-primary' : 'text-text-body hover:bg-surface-elevated'}`}
                >
                  <Folder size={16} className={activeId === p._id ? 'text-primary' : 'text-text-muted'} />
                  <span className="truncate text-left">{p.name}</span>
                </button>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
