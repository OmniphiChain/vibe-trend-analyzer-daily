import React from 'react';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';

interface TickerInteractionHelperProps {
  show: boolean;
  className?: string;
}

export const TickerInteractionHelper: React.FC<TickerInteractionHelperProps> = ({ 
  show, 
  className 
}) => {
  if (!show) return null;

  return (
    <div className={cn(
      "fixed bottom-4 right-4 z-50 transition-all duration-300",
      "animate-in slide-in-from-bottom-2 fade-in",
      className
    )}>
      <Badge 
        variant="outline" 
        className="bg-slate-800/90 backdrop-blur-xl border-slate-600 text-slate-300 px-3 py-2 text-xs"
      >
        💡 <strong>Tip:</strong> Click ticker for analytics, Ctrl+Click to filter
      </Badge>
    </div>
  );
};

// Hook to show helper tooltip on first ticker interaction
export const useTickerInteractionHelper = () => {
  const [showHelper, setShowHelper] = React.useState(false);
  const [hasInteracted, setHasInteracted] = React.useState(false);

  React.useEffect(() => {
    const hasSeenHelper = localStorage.getItem('ticker-interaction-helper-seen');
    if (!hasSeenHelper && !hasInteracted) {
      const timer = setTimeout(() => {
        setShowHelper(true);
        setTimeout(() => {
          setShowHelper(false);
          localStorage.setItem('ticker-interaction-helper-seen', 'true');
        }, 5000);
      }, 2000);
      return () => clearTimeout(timer);
    }
  }, [hasInteracted]);

  const markAsInteracted = () => {
    setHasInteracted(true);
    setShowHelper(false);
  };

  return { showHelper, markAsInteracted };
};
