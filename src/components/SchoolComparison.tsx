import { useMemo, useCallback } from 'react';
import ReactECharts from 'echarts-for-react';
import type { EChartsOption } from 'echarts';
import { Users, GraduationCap, Mic, Clock, CheckSquare, Square } from 'lucide-react';
import type { SchoolData } from '@/types';
import { useDashboardStore, useFilteredData } from '@/store/dashboardStore';
import { formatNumber } from '@/utils/format';
import { Card } from './Card';
import { cn } from '@/lib/utils';

const METRIC_COLORS = [
  { from: '#ffd700', to: '#daa520' },
  { from: '#cd5c5c', to: '#8b0000' },
  { from: '#4682b4', to: '#1e3a5f' },
  { from: '#6b8e23', to: '#2f4f2f' },
];

const METRICS = [
  { key: 'teamCount', label: '团队数', unit: '个', icon: Users },
  { key: 'studentCount', label: '学生数', unit: '人', icon: GraduationCap },
  { key: 'guideCount', label: '讲解员数', unit: '人', icon: Mic },
  { key: 'guideServiceHours', label: '服务时长', unit: '小时', icon: Clock },
] as const;

export function SchoolComparison() {
  const { schoolRankings, selectedSchoolData } = useFilteredData();
  const { selectedSchoolIds, toggleCompareSchool, clearCompareSchools } = useDashboardStore();

  const chartOption = useMemo(() => {
    if (selectedSchoolData.length === 0) {
      return {};
    }

    const series = METRICS.map((metric, mIdx) => ({
      name: metric.label,
      type: 'bar' as const,
      data: selectedSchoolData.map((s) => s[metric.key as keyof SchoolData] as number),
      itemStyle: {
        color: {
          type: 'linear' as const,
          x: 0,
          y: 0,
          x2: 0,
          y2: 1,
          colorStops: [
            { offset: 0, color: METRIC_COLORS[mIdx].from },
            { offset: 1, color: METRIC_COLORS[mIdx].to },
          ],
        },
        borderRadius: [4, 4, 0, 0],
      },
      barGap: '10%',
      barCategoryGap: '30%',
    }));

    return {
      grid: {
        left: '3%',
        right: '4%',
        top: '12%',
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
        formatter: (params: unknown[]) => {
          const first = params[0] as { dataIndex: number };
          const school = selectedSchoolData[first.dataIndex];
          let html = `<div style="font-family: 'Noto Serif SC', serif;"><div style="color: #daa520; font-weight: bold; margin-bottom: 8px;">${school.name}</div>`;
          params.forEach((p, idx) => {
            const item = p as { marker: string; value: number };
            const metric = METRICS[idx];
            html += `<div style="color: #fff;">${item.marker}${metric.label}：<span style="color: #ffd700; font-weight: bold;">${formatNumber(item.value)} ${metric.unit}</span></div>`;
          });
          html += '</div>';
          return html;
        },
      },
      legend: {
        data: METRICS.map((m) => m.label),
        top: 0,
        textStyle: {
          color: 'rgba(218, 165, 32, 0.8)',
          fontFamily: 'Noto Serif SC',
          fontSize: 12,
        },
        itemWidth: 16,
        itemHeight: 8,
      },
      xAxis: {
        type: 'category',
        data: selectedSchoolData.map((s) =>
          s.name.replace(/^(北京市|中国人民大学|北京师范大学|清华大学|北京大学)/, ''),
        ),
        axisLine: {
          lineStyle: {
            color: 'rgba(218, 165, 32, 0.3)',
          },
        },
        axisLabel: {
          color: 'rgba(218, 165, 32, 0.7)',
          fontFamily: 'Noto Serif SC',
          fontSize: 11,
          interval: 0,
          rotate: selectedSchoolData.length > 4 ? 20 : 0,
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
          formatter: (value: number) => {
            if (value >= 10000) return `${(value / 10000).toFixed(1)}万`;
            return formatNumber(value);
          },
        },
        splitLine: {
          lineStyle: {
            color: 'rgba(218, 165, 32, 0.1)',
          },
        },
      },
      series,
    };
  }, [selectedSchoolData]);

  const maxValues = useMemo(() => {
    if (selectedSchoolData.length === 0) return {} as Record<string, number>;
    const result: Record<string, number> = {};
    METRICS.forEach((metric) => {
      const values = selectedSchoolData.map((s) => s[metric.key as keyof SchoolData] as number);
      result[metric.key] = Math.max(...values);
    });
    return result;
  }, [selectedSchoolData]);

  const handleToggle = useCallback(
    (schoolId: string) => {
      toggleCompareSchool(schoolId);
    },
    [toggleCompareSchool],
  );

  return (
    <Card title="学校横向对比" className="h-full">
      <div className="flex gap-4 h-[380px]">
        <div className="w-[220px] flex-shrink-0 flex flex-col border-r border-gold-600/20 pr-3">
          <div className="flex items-center justify-between mb-2">
            <span className="text-gold-400/80 font-serif text-sm">选择学校</span>
            <button
              onClick={clearCompareSchools}
              className="text-gold-500/60 hover:text-gold-400 text-xs font-serif transition-colors"
            >
              清空
            </button>
          </div>
          <div className="flex-1 overflow-y-auto scrollbar-hide space-y-1">
            {schoolRankings.map((school) => {
              const isSelected = selectedSchoolIds.includes(school.id);
              const CheckIcon = isSelected ? CheckSquare : Square;
              return (
                <button
                  key={school.id}
                  onClick={() => handleToggle(school.id)}
                  className={cn(
                    'w-full flex items-center gap-2 px-2 py-1.5 rounded-md transition-all text-left',
                    isSelected
                      ? 'bg-gold-500/20 text-gold-300'
                      : 'hover:bg-gold-500/10 text-gold-400/70',
                  )}
                >
                  <CheckIcon
                    className={cn(
                      'w-4 h-4 flex-shrink-0',
                      isSelected ? 'text-gold-400' : 'text-gold-500/40',
                    )}
                  />
                  <span className="font-serif text-sm truncate">{school.name}</span>
                </button>
              );
            })}
          </div>
          <div className="mt-2 pt-2 border-t border-gold-600/20">
            <span className="text-gold-500/50 text-xs font-serif">
              已选 {selectedSchoolIds.length} 所学校
            </span>
          </div>
        </div>

        <div className="flex-1 flex flex-col min-w-0">
          {selectedSchoolData.length === 0 ? (
            <div className="flex-1 flex items-center justify-center">
              <p className="text-gold-500/50 font-serif text-sm">请在左侧勾选学校进行对比</p>
            </div>
          ) : (
            <>
              <div className="grid gap-3 mb-3" style={{ gridTemplateColumns: `repeat(${Math.min(selectedSchoolData.length, 4)}, 1fr)` }}>
                {selectedSchoolData.map((school) => (
                  <div
                    key={school.id}
                    className="bg-gradient-to-br from-red-900/50 to-red-950/70 rounded-lg border border-gold-600/30 p-3"
                  >
                    <div className="text-gold-300 font-serif text-sm font-semibold truncate mb-2">
                      {school.name.replace(/^(北京市|中国人民大学|北京师范大学|清华大学|北京大学)/, '')}
                    </div>
                    <div className="space-y-1.5">
                      {METRICS.slice(0, 2).map((metric) => {
                        const value = school[metric.key as keyof SchoolData] as number;
                        const max = maxValues[metric.key] || 1;
                        const percent = (value / max) * 100;
                        return (
                          <div key={metric.key}>
                            <div className="flex items-center justify-between mb-0.5">
                              <span className="text-gold-400/60 text-xs font-serif">
                                {metric.label}
                              </span>
                              <span className="text-gold-300 text-xs font-semibold">
                                {formatNumber(value)}
                                <span className="text-gold-500/60 font-normal ml-0.5">
                                  {metric.unit}
                                </span>
                              </span>
                            </div>
                            <div className="h-1 bg-gold-500/10 rounded-full overflow-hidden">
                              <div
                                className="h-full bg-gradient-to-r from-gold-500 to-gold-400 rounded-full"
                                style={{ width: `${percent}%` }}
                              />
                            </div>
                          </div>
                        );
                      })}
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
