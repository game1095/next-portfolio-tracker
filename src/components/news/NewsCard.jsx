import { ExternalLink } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';

export default function NewsCard({ article }) {
  const publishDate = article.providerPublishTime 
    ? new Date(article.providerPublishTime) 
    : new Date();

  const timeAgo = formatDistanceToNow(publishDate, { addSuffix: true });

  return (
    <a 
      href={article.link} 
      target="_blank" 
      rel="noopener noreferrer"
      className="block bg-canvas-dark border border-surface-elevated rounded-lg p-4 hover:bg-surface-elevated/30 transition-colors group"
    >
      <div className="flex items-start gap-4">
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-2">
            <span className="inline-block px-1.5 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider bg-primary/10 text-primary">
              {article.relatedSymbol}
            </span>
            <span className="text-xs text-text-muted font-sans line-clamp-1">
              {article.publisher}
            </span>
            <span className="text-xs text-text-muted">•</span>
            <span className="text-xs text-text-muted font-tabular">
              {timeAgo}
            </span>
          </div>
          <h3 className="text-sm font-bold text-text-body font-sans leading-snug group-hover:text-primary transition-colors line-clamp-3">
            {article.title}
          </h3>
        </div>
        
        {/* Optional Thumbnail if provided by Yahoo Finance */}
        {article.thumbnail && article.thumbnail.resolutions && article.thumbnail.resolutions.length > 0 && (
          <div className="shrink-0">
            <img 
              src={article.thumbnail.resolutions[0].url} 
              alt="" 
              className="w-16 h-16 object-cover rounded-lg border border-surface-elevated"
              loading="lazy"
            />
          </div>
        )}
        
        {(!article.thumbnail || !article.thumbnail.resolutions || article.thumbnail.resolutions.length === 0) && (
          <div className="flex shrink-0 w-16 h-16 items-center justify-center rounded-lg border border-surface-elevated bg-canvas-dark text-surface-elevated">
            <ExternalLink size={20} />
          </div>
        )}
      </div>
    </a>
  );
}
