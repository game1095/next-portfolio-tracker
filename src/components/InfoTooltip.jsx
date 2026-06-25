import { Info } from 'lucide-react';

export default function InfoTooltip({ text }) {
  return (
    <div className="relative flex items-center group ml-1 cursor-help">
      <Info size={14} className="text-text-muted hover:text-primary transition-colors" />
      <div className="absolute top-full left-1/2 -translate-x-1/2 mt-2 hidden group-hover:block w-48 sm:w-64 p-3 bg-surface-elevated border border-surface-card text-xs text-text-body font-sans rounded-lg z-[100] pointer-events-none normal-case font-normal text-left">
        {text}
        {/* Triangle arrow */}
        <div className="absolute bottom-full left-1/2 -translate-x-1/2 border-[6px] border-transparent border-b-surface-elevated"></div>
      </div>
    </div>
  );
}
