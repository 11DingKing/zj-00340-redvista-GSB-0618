import { useMemo } from 'react';
import ReactECharts from 'echarts-for-react';
import type { EChartsOption } from 'echarts';
import type { MartyrProgress } from '@/types';
import { Heart, Users } from 'lucide-react';
import CountUp from 'react-countup';
import { Card } from './Card';
import { useCarousel } from '@/hooks/useCarousel';

interface ProgressRingProps {
  data: MartyrProgress;
}

export function ProgressRing({ data }: ProgressRingProps) {
  const { pause, resume } = useCarousel();
  const percentage = (data.confirmed / data.total) * 100;

  const option: EChartsOption = useMemo(() => ({
    series: [
      {
        type: 'gauge',
        startAngle: 90,
        endAngle: -270,
        pointer: {
          show: false,
        },
        progress: {
          show: true,
          overlap: false,
          roundCap: true,
          clip: false,
          itemStyle: {
            color: {
              type: 'linear',
              x: 0,
              y: 0,
              x2: 1,
              y2: 1,
              colorStops: [
                { offset: 0, color: '#ffd700' },
                { offset: 1, color: '#daa520' },
              ],
            },
            shadowColor: 'rgba(255, 215, 0, 0.5)',
            shadowBlur: 20,
          },
        },
        axisLine: {
          lineStyle: {
            width: 18,
            color: [[1, 'rgba(139, 0, 0, 0.3)']],
          },
        },
        splitLine: {
          show: false,
        },
        axisTick: {
          show: false,
        },
        axisLabel: {
          show: false,
        },
        anchor: {
          show: false,
        },
        title: {
          show: false,
        },
        detail: {
          show: false,
        },
        data: [
          {
            value: percentage,
            name: '完成进度',
            title: {
              offsetCenter: ['0%', '0%'],
            },
          },
        ],
      },
    ],
  }), [percentage]);

  return (
    <Card
      title="为烈士寻亲进度"
      panelId="progress"
      className="h-full"
      onMouseEnter={pause}
      onMouseLeave={resume}
    >
      <div className="flex items-center justify-center h-[320px]">
        <div className="relative w-64 h-64">
          <ReactECharts
            option={option}
            style={{ height: '100%', width: '100%' }}
            opts={{ renderer: 'canvas' }}
          />
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <Heart className="w-10 h-10 text-red-400 mb-2 animate-pulse" />
            <div className="flex items-baseline gap-1">
              <CountUp
                end={data.confirmed}
                duration={2}
                className="font-display text-5xl text-gold-300 text-glow-gold font-bold"
              />
              <span className="text-gold-500/70 font-serif text-lg">/ {data.total}</span>
            </div>
            <p className="text-gold-400/70 font-serif text-sm mt-1">已确认对数</p>
            <div className="mt-2 px-3 py-1 bg-gold-500/20 rounded-full border border-gold-500/40">
              <span className="text-gold-300 font-serif font-semibold">
                完成 {percentage.toFixed(1)}%
              </span>
            </div>
          </div>
        </div>

        <div className="absolute bottom-4 left-4 right-4 flex justify-around">
          <div className="text-center">
            <div className="flex items-center justify-center gap-1 text-gold-400/70 text-xs mb-1">
              <Users className="w-4 h-4" />
              <span>已寻回烈士</span>
            </div>
            <p className="text-gold-300 font-display text-xl font-bold">{data.confirmed}</p>
          </div>
          <div className="text-center">
            <div className="flex items-center justify-center gap-1 text-gold-400/70 text-xs mb-1">
              <Heart className="w-4 h-4" />
              <span>待确认</span>
            </div>
            <p className="text-gold-300 font-display text-xl font-bold">{data.total - data.confirmed}</p>
          </div>
        </div>
      </div>
    </Card>
  );
}
