import { useMemo } from 'react';
import ReactECharts from 'echarts-for-react';
import type { EChartsOption } from 'echarts';
import { Users, UserCheck, Mic, Clock, CheckSquare, Square, Trash2 } from 'lucide-react';
import type { SchoolData } from '@/types';
import { useDashboardStore, useFilteredData } from '@/store/dashboardStore';
import { formatNumber } from '@/utils/format';
import { Card } from './Card';
import { cn } from '@/lib/utils';

interface SchoolCompareProps {
  className?: string;
}

const INDICATORS = [
  { key: 'teamCount', label: '研学团队', unit: '个', icon: Users, color: '#ffd700' },
  { key: 'studentCount', label: '学生人数', unit: '人', icon: UserCheck, color: '#cd5c5c' },
  { key: 'guideCount', label: '讲解员数', unit: '人', icon: Mic, color: '#4682b4' },
  { key: 'guideServiceHours', label: '服务时长', unit: '小时', icon: Clock, color: '#3cb371' },
] as const;

export function SchoolCompare({ className }: SchoolCompareProps) {
  const { schoolRankings } = useFilteredData();
  const { selectedSchoolIds, toggleSchoolCompare, clearSchoolCompare } = useDashboardStore();

  const selectedSchools = useMemo(() => {
    return schoolRankings.filter((s) => selectedSchoolIds.includes(s.id));
  }, [schoolRankings, selectedSchoolIds]);

  const chartOption: EChartsOption = useMemo(() => {
    if (selectedSchools.length === 0) {
      return {};
    }

    const colors = ['#ffd700', '#cd5c5c', '#4682b4', '#3cb371'];

    return {
      grid: {
        left: '3%',
        right: '4%',
        top: '15%',
        bottom: '3%',
        containLabel: true,
      },
      tooltip: {
        trigger: 'axis',
        axisPointer: {
          type: 'shadow',
        },
        backgroundColor: 'rgba(26, 5, 5, 0.95)',
        borderColor: 'rgba(218, 165, 32, 0.5)',
        textStyle: {
          color: '#fff',
          fontFamily: 'Noto Serif SC',
        },
      },
      legend: {
        data: INDICATORS.map((i) => i.label),
        top: 0,
        textStyle: {
          color: 'rgba(218, 165, 32, 0.8)',
          fontFamily: 'Noto Serif SC',
          fontSize: 12,
        },
        itemWidth: 12,
        itemHeight: 12,
      },
      xAxis: {
        type: 'category',
        data: selectedSchools.map((s) =>
          s.name.replace(/^(北京市|中国人民大学|北京师范大学|清华大学|北京大学)/, ''),
        ),
        axisLine: {
          lineStyle: {
            color: 'rgba(218, 165, 32, 0.3)',
          },
        },
        axisLabel: {
          color: 'rgba(218, 165, 32, 0.8)',
          fontFamily: 'Noto Serif SC',
          fontSize: 11,
          interval: 0,
          rotate: selectedSchools.length > 4 ? 30 : 0,
        },
        axisTick: {
          show: false,
        },
      },
      yAxis: {
        type: 'value',
        axisLine: {
          show: true,
          lineStyle: {
            color: 'rgba(218, 165, 32, 0.3)',
          },
        },
        axisLabel: {
          color: 'rgba(218, 165, 32, 0.7)',
          fontFamily: 'Noto Serif SC',
          fontSize: 11,
        },
        splitLine: {
          lineStyle: {
            color: 'rgba(218, 165, 32, 0.1)',
          },
        },
      },
      series: INDICATORS.map((indicator, idx) => ({
        name: indicator.label,
        type: 'bar',
        data: selectedSchools.map((s) => s[indicator.key as keyof SchoolData] as number),
        itemStyle: {
          color: {
            type: 'linear',
            x: 0,
            y: 0,
            x2: 0,
            y2: 1,
            colorStops: [
              { offset: 0, color: colors[idx] },
              { offset: 1, color: colors[idx] + '80' },
            ],
          },
          borderRadius: [4, 4, 0, 0],
        },
        barWidth: Math.max(8, 24 - selectedSchools.length * 2),
        barGap: '10%',
      })),
    };
  }, [selectedSchools]);

  return (
    <Card title="学校横向对比" className={className}>
      <div className="flex gap-4 h-[360px]">
        <div className="w-56 flex flex-col border-r border-gold-600/20 pr-3">
          <div className="flex items-center justify-between mb-2">
            <span className="text-gold-400/70 text-sm font-serif">选择学校</span>
            {selectedSchoolIds.length > 0 && (
              <button
                onClick={clearSchoolCompare}
                className="flex items-center gap-1 text-xs text-gold-500/60 hover:text-gold-400 transition-colors"
              >
                <Trash2 className="w-3 h-3" />
                清空
              </button>
            )}
          </div>
          <div className="text-xs text-gold-500/50 mb-2 font-serif">
            已选 {selectedSchoolIds.length} 所
          </div>
          <div className="flex-1 overflow-y-auto scrollbar-thin space-y-1 pr-1">
            {schoolRankings.map((school) => {
              const isSelected = selectedSchoolIds.includes(school.id);
              return (
                <button
                  key={school.id}
                  onClick={() => toggleSchoolCompare(school.id)}
                  className={cn(
                    'w-full flex items-center gap-2 px-2 py-1.5 rounded-md text-left transition-all duration-200',
                    isSelected
                      ? 'bg-gold-500/20 text-gold-300'
                      : 'text-gold-400/70 hover:bg-gold-500/10 hover:text-gold-300',
                  )}
                >
                  {isSelected ? (
                    <CheckSquare className="w-4 h-4 text-gold-400 flex-shrink-0" />
                  ) : (
                    <Square className="w-4 h-4 text-gold-500/40 flex-shrink-0" />
                  )}
                  <span className="text-sm font-serif truncate">{school.name}</span>
                </button>
              );
            })}
          </div>
        </div>

        <div className="flex-1 flex flex-col min-w-0">
          {selectedSchools.length === 0 ? (
            <div className="flex-1 flex items-center justify-center">
              <div className="text-center">
                <Users className="w-12 h-12 text-gold-500/30 mx-auto mb-3" />
                <p className="text-gold-500/50 font-serif text-sm">
                  请从左侧选择学校进行对比
                </p>
              </div>
            </div>
          ) : (
            <>
              <div className="grid gap-2 mb-3" style={{ gridTemplateColumns: `repeat(${Math.min(selectedSchools.length, 4)}, 1fr)` }}>
                {selectedSchools.slice(0, 4).map((school) => (
                  <div
                    key={school.id}
                    className="bg-red-900/40 rounded-lg border border-gold-600/30 p-3"
                  >
                    <div className="text-gold-300 font-serif text-sm font-semibold mb-2 truncate">
                      {school.name}
                    </div>
                    <div className="space-y-1.5">
                      {INDICATORS.map((indicator) => (
                        <div key={indicator.key} className="flex items-center justify-between">
                          <span className="text-gold-500/60 text-xs font-serif flex items-center gap-1">
                            <indicator.icon className="w-3 h-3" />
                            {indicator.label}
                          </span>
                          <span className="text-gold-300 text-sm font-bold">
                            {formatNumber(school[indicator.key as keyof SchoolData] as number)}
                            <span className="text-gold-500/60 text-xs font-normal ml-0.5">
                              {indicator.unit}
                            </span>
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>

              <div className="flex-1 min-h-0">
                <ReactECharts
                  option={chartOption}
                  style={{ height: '100%', width: '100%' }}
                  opts={{ renderer: 'canvas' }}
                />
              </div>
            </>
          )}
        </div>
      </div>
    </Card>
  );
}
