import { useEffect, useRef, useState } from 'react';
import { Calendar, ChevronLeft, ChevronRight } from 'lucide-react';
import type { Activity } from '@/types';
import { formatDate } from '@/utils/format';
import { cn } from '@/lib/utils';

interface ActivityListProps {
  data: Activity[];
}

export function ActivityList({ data }: ActivityListProps) {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [isPaused, setIsPaused] = useState(false);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);

  useEffect(() => {
    const scrollEl = scrollRef.current;
    if (!scrollEl) return;

    const checkScroll = () => {
      setCanScrollLeft(scrollEl.scrollLeft > 0);
      setCanScrollRight(
        scrollEl.scrollLeft < scrollEl.scrollWidth - scrollEl.clientWidth - 10
      );
    };

    scrollEl.addEventListener('scroll', checkScroll);
    checkScroll();

    return () => scrollEl.removeEventListener('scroll', checkScroll);
  }, [data]);

  useEffect(() => {
    if (isPaused) return;

    const interval = setInterval(() => {
      const scrollEl = scrollRef.current;
      if (!scrollEl) return;

      if (scrollEl.scrollLeft >= scrollEl.scrollWidth - scrollEl.clientWidth) {
        scrollEl.scrollTo({ left: 0, behavior: 'smooth' });
      } else {
        scrollEl.scrollBy({ left: 300, behavior: 'smooth' });
      }
    }, 4000);

    return () => clearInterval(interval);
  }, [isPaused]);

  const scroll = (direction: 'left' | 'right') => {
    const scrollEl = scrollRef.current;
    if (!scrollEl) return;
    scrollEl.scrollBy({
      left: direction === 'left' ? -300 : 300,
      behavior: 'smooth',
    });
  };

  return (
    <div className="relative">
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-gold-300 font-serif text-lg font-semibold tracking-wide flex items-center gap-2">
          <span className="w-1 h-6 bg-gradient-to-b from-gold-400 to-gold-600 rounded-r" />
          近期活动剪影
        </h3>
        <div className="flex items-center gap-2">
          <button
            onClick={() => scroll('left')}
            disabled={!canScrollLeft}
            className={cn(
              'p-1.5 rounded-lg border border-gold-600/30 transition-all',
              canScrollLeft
                ? 'text-gold-400 hover:bg-gold-500/20 hover:border-gold-500/50'
                : 'text-gold-600/30 cursor-not-allowed'
            )}
          >
            <ChevronLeft className="w-5 h-5" />
          </button>
          <button
            onClick={() => scroll('right')}
            disabled={!canScrollRight}
            className={cn(
              'p-1.5 rounded-lg border border-gold-600/30 transition-all',
              canScrollRight
                ? 'text-gold-400 hover:bg-gold-500/20 hover:border-gold-500/50'
                : 'text-gold-600/30 cursor-not-allowed'
            )}
          >
            <ChevronRight className="w-5 h-5" />
          </button>
        </div>
      </div>

      <div
        ref={scrollRef}
        className="flex gap-4 overflow-x-auto scrollbar-hide pb-2"
        onMouseEnter={() => setIsPaused(true)}
        onMouseLeave={() => setIsPaused(false)}
      >
        {data.map((activity, index) => (
          <div
            key={activity.id}
            className="flex-shrink-0 w-72 group cursor-pointer"
            style={{ animationDelay: `${index * 0.1}s` }}
          >
            <div className="relative bg-gradient-to-br from-red-900/60 to-red-950/80 rounded-xl border border-gold-600/30 overflow-hidden transition-all duration-300 group-hover:border-gold-500/60 group-hover:shadow-glow-gold-sm">
              <div className="relative h-40 overflow-hidden">
                <img
                  src={activity.image}
                  alt={activity.title}
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-red-950 via-red-950/50 to-transparent" />
                <div className="absolute bottom-2 left-3 flex items-center gap-1 text-gold-300/90 text-xs">
                  <Calendar className="w-3.5 h-3.5" />
                  {formatDate(activity.date)}
                </div>
              </div>
              <div className="p-4">
                <h4 className="text-gold-300 font-serif font-semibold text-base mb-2 line-clamp-1 group-hover:text-gold-200 transition-colors">
                  {activity.title}
                </h4>
                <p className="text-gold-400/60 text-sm line-clamp-2 leading-relaxed">
                  {activity.description}
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
