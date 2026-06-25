import { AlertCircle, AlertTriangle, Info } from 'lucide-react';

export default function SmartAlerts({ alerts }) {
  if (!alerts || alerts.length === 0) {
    return null;
  }

  const getIcon = (type) => {
    switch (type) {
      case 'warning': return <AlertTriangle size={12} className="text-trading-down shrink-0" />;
      case 'info': return <Info size={12} className="text-primary shrink-0" />;
      default: return <AlertCircle size={12} className="text-text-muted shrink-0" />;
    }
  };

  const getBgColor = (type) => {
    switch (type) {
      case 'warning': return 'bg-trading-down/10 border-trading-down/20 text-trading-down';
      case 'info': return 'bg-primary/10 border-primary/20 text-primary';
      default: return 'bg-surface-card border-surface-elevated text-text-body';
    }
  };

  return (
    <div className="space-y-2">
      {alerts.map((alert, idx) => (
        <div key={idx} className={`flex items-start gap-2 px-3 py-2.5 rounded-lg border ${getBgColor(alert.type)}`}>
          <div className="mt-0.5">{getIcon(alert.type)}</div>
          <div className="min-w-0">
            <span className="text-[10px] font-bold font-sans uppercase tracking-wider block mb-0.5">
              {alert.type === 'warning' ? 'Action Required' : 'Insight'}
            </span>
            <span className="text-[11px] text-text-muted font-sans leading-relaxed block">{alert.message}</span>
          </div>
        </div>
      ))}
    </div>
  );
}
