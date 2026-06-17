import type { ReactNode } from 'react';
import { cn } from '@/lib/utils';
import type { CarouselPanel } from '@/types';
import { useDashboardStore } from '@/store/dashboardStore';

interface CardProps {
  children: ReactNode;
  title?: string;
  panelId?: CarouselPanel;
  className?: string;
  onMouseEnter?: () => void;
  onMouseLeave?: () => void;
}

export function Card({ children, title, panelId, className, onMouseEnter, onMouseLeave }: CardProps) {
  const activePanel = useDashboardStore((s) => s.activePanel);
  const isActive = panelId ? activePanel === panelId : false;

  return (
    <div
      className={cn(
        'relative bg-gradient-card rounded-lg border border-gold-600/50 shadow-card card-transition overflow-hidden',
        isActive && 'card-active',
        className
      )}
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
    >
      <div className="decoration-corner decoration-corner-tl" />
      <div className="decoration-corner decoration-corner-tr" />
      <div className="decoration-corner decoration-corner-bl" />
      <div className="decoration-corner decoration-corner-br" />

      {title && (
        <div className="relative px-4 py-2 border-b border-gold-600/30">
          <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-6 bg-gradient-to-b from-gold-400 to-gold-600 rounded-r" />
          <h3 className="pl-3 text-gold-300 font-serif text-lg font-semibold tracking-wide">
            {title}
          </h3>
        </div>
      )}

      <div className="relative p-4">{children}</div>
    </div>
  );
}
