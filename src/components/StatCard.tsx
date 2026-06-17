import { Users, Mic, TrendingUp } from 'lucide-react';
import CountUp from 'react-countup';
import type { CoreStats } from '@/types';
import { cn } from '@/lib/utils';

interface StatCardProps {
  data: CoreStats;
}

interface StatItemProps {
  icon: typeof Users;
  value: number;
  label: string;
  unit: string;
  yoy: number;
  delay: number;
}

function StatItem({ icon: Icon, value, label, unit, yoy, delay }: StatItemProps) {
  return (
    <div className="relative flex-1 bg-gradient-to-br from-red-900/80 to-red-950/90 rounded-xl border border-gold-600/40 p-6 overflow-hidden">
      <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-gold-500/10 to-transparent rounded-bl-full" />
      
      <div className="relative flex items-start gap-4">
        <div className="p-3 bg-gradient-to-br from-gold-500 to-gold-600 rounded-xl shadow-glow-gold-sm">
          <Icon className="w-8 h-8 text-red-900" />
        </div>
        
        <div className="flex-1">
          <p className="text-gold-400/80 font-serif text-sm tracking-wide mb-1">{label}</p>
          <div className="flex items-baseline gap-2">
            <CountUp
              end={value}
              duration={2}
              delay={delay}
              separator=","
              className="font-display text-5xl text-gold-300 text-glow-gold font-bold animate-number-roll"
            />
            <span className="text-gold-500/80 font-serif text-lg">{unit}</span>
          </div>
          <div className={cn(
            'mt-2 flex items-center gap-1 text-sm',
            yoy >= 0 ? 'text-green-400' : 'text-red-400'
          )}>
            <TrendingUp className={cn('w-4 h-4', yoy < 0 && 'rotate-180')} />
            <span>同比 {yoy >= 0 ? '+' : ''}{yoy}%</span>
          </div>
        </div>
      </div>
    </div>
  );
}

export function StatCard({ data }: StatCardProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      <StatItem
        icon={Users}
        value={data.totalVisits}
        label="累计接待参观人次"
        unit="人次"
        yoy={data.visitsYoY}
        delay={0}
      />
      <StatItem
        icon={Mic}
        value={data.totalTours}
        label="累计讲解场次"
        unit="场"
        yoy={data.toursYoY}
        delay={0.3}
      />
    </div>
  );
}
