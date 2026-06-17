import { useEffect, useState } from 'react';
import { Calendar, RefreshCw } from 'lucide-react';
import { formatCurrentDate } from '@/utils/format';
import { useDashboardStore } from '@/store/dashboardStore';
import { getPeriodLabel } from '@/utils/period';
import { cn } from '@/lib/utils';

export function Header() {
  const [currentDate, setCurrentDate] = useState(formatCurrentDate());
  const { timePeriod, setTimePeriod, regenerateData } = useDashboardStore();

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentDate(formatCurrentDate());
    }, 60000);
    return () => clearInterval(timer);
  }, []);

  return (
    <header className="relative z-10 bg-gradient-header border-b border-gold-600/40">
      <div className="relative px-6 py-4">
        <div className="absolute inset-x-0 bottom-0 h-px bg-gradient-to-r from-transparent via-gold-500/50 to-transparent" />
        
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3 text-gold-300/80">
            <Calendar className="w-5 h-5" />
            <span className="font-serif text-sm tracking-wide">{currentDate}</span>
          </div>

          <div className="text-center">
            <h1 className="font-display text-3xl md:text-4xl text-gold-300 tracking-widest text-glow-gold font-bold">
              红色教育传承成效数据大屏
            </h1>
            <div className="mt-1 flex items-center justify-center gap-2">
              <div className="h-px w-16 bg-gradient-to-r from-transparent to-gold-500/60" />
              <span className="text-gold-500/60 text-xs tracking-[0.3em]">传承红色基因 赓续精神血脉</span>
              <div className="h-px w-16 bg-gradient-to-l from-transparent to-gold-500/60" />
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="flex items-center gap-1 p-1 bg-red-900/50 rounded-lg border border-gold-600/30">
              <button
                onClick={() => setTimePeriod('quarter')}
                className={cn(
                  'px-4 py-1.5 rounded-md text-sm font-serif transition-all duration-300',
                  timePeriod === 'quarter'
                    ? 'bg-gold-500 text-red-900 font-semibold shadow-glow-gold-sm'
                    : 'text-gold-400/70 hover:text-gold-300'
                )}
              >
                {getPeriodLabel('quarter')}
              </button>
              <button
                onClick={() => setTimePeriod('year')}
                className={cn(
                  'px-4 py-1.5 rounded-md text-sm font-serif transition-all duration-300',
                  timePeriod === 'year'
                    ? 'bg-gold-500 text-red-900 font-semibold shadow-glow-gold-sm'
                    : 'text-gold-400/70 hover:text-gold-300'
                )}
              >
                {getPeriodLabel('year')}
              </button>
            </div>

            <button
              onClick={regenerateData}
              className="p-2 text-gold-400/70 hover:text-gold-300 transition-colors rounded-lg hover:bg-gold-500/10"
              title="重新生成数据"
            >
              <RefreshCw className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>
    </header>
  );
}
