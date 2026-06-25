import { Target } from 'lucide-react';
import { useState, useEffect } from 'react';
import InfoTooltip from './InfoTooltip';

export default function MonthlyDCATracker({ invested = 0, target = 1000, onTargetChange }) {
  const percent = Math.min((invested / target) * 100, 100);
  const [displayedPercent, setDisplayedPercent] = useState(0);
  const [isEditing, setIsEditing] = useState(false);
  const [editValue, setEditValue] = useState(target);

  useEffect(() => {
    const timer = setTimeout(() => {
      setDisplayedPercent(percent);
    }, 100);
    return () => clearTimeout(timer);
  }, [percent]);

  const handleSave = () => {
    if (editValue > 0) {
      onTargetChange(editValue);
    } else {
      setEditValue(target);
    }
    setIsEditing(false);
  };
  
  return (
    <div className="bg-surface-card p-4 rounded-xl border border-surface-elevated relative">
      {/* Subtle background glow if reached */}
      {percent >= 100 && (
        <div className="absolute inset-0 bg-trading-up/5 rounded-xl pointer-events-none"></div>
      )}

      <div className="relative z-10 space-y-3">
        
        {/* Header */}
        <div className="flex items-center gap-2">
          <Target size={14} className="text-primary" />
          <h3 className="text-text-muted font-sans text-xs font-bold uppercase tracking-wider">Monthly DCA</h3>
          <InfoTooltip text="เป้าหมายการลงทุน (DCA) ประจำเดือนของคุณ" />
        </div>

        {/* Amount Display */}
        <div className="flex items-baseline gap-1.5">
          <span className="text-text-body text-lg font-bold font-tabular">${invested.toLocaleString(undefined, {minimumFractionDigits: 0, maximumFractionDigits: 0})}</span> 
          <span className="text-text-muted text-xs">/</span>
          
          {isEditing ? (
            <div className="flex items-baseline gap-0.5">
              <span className="text-text-muted text-sm font-tabular">$</span>
              <input 
                type="number" 
                className="bg-transparent text-text-body w-16 outline-none text-sm font-bold font-tabular border-b border-primary [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                value={editValue || ''}
                onChange={(e) => setEditValue(Number(e.target.value))}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') handleSave();
                  if (e.key === 'Escape') { setEditValue(target); setIsEditing(false); }
                }}
                onBlur={handleSave}
                autoFocus
              />
            </div>
          ) : (
            <div 
              className="flex items-baseline cursor-pointer group rounded transition-colors"
              onClick={() => { setEditValue(target); setIsEditing(true); }}
              title="Click to edit target"
            >
              <span className="text-text-muted font-tabular text-sm group-hover:text-primary transition-all border-b border-dashed border-transparent group-hover:border-primary">
                ${target.toLocaleString()}
              </span>
            </div>
          )}
        </div>

        {/* Progress Bar */}
        <div className="flex items-center gap-2">
          <div className="h-1.5 flex-1 bg-surface-elevated rounded-full relative">
            <div 
              className={`h-full rounded-full transition-all duration-[2000ms] ease-out relative ${displayedPercent >= 100 ? 'bg-trading-up' : 'bg-primary animate-progress'}`}
              style={{ width: `${displayedPercent}%` }}
            >
              {displayedPercent < 100 && displayedPercent > 0 && (
                <div className="absolute top-1/2 right-0 z-20 select-none" style={{ transform: 'translate(50%, -50%) scaleX(-1)' }}>
                  <div className="text-base animate-run drop-shadow-md">
                    🏃‍♂️
                  </div>
                </div>
              )}
            </div>
            {/* Finish Line Flag */}
            <div className="absolute top-1/2 right-0 translate-x-1/2 -translate-y-1/2 text-sm z-10 select-none opacity-30 grayscale">
              🏁
            </div>
          </div>
          <span className="text-xs font-tabular font-bold w-10 text-right">
            {percent >= 100 ? (
              <span className="text-trading-up">DONE</span>
            ) : (
              <span className="text-text-muted">{percent.toFixed(0)}%</span>
            )}
          </span>
        </div>
        
      </div>
    </div>
  );
}
