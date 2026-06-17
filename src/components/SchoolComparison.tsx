import { useMemo, useState } from 'react';
import ReactECharts from 'echarts-for-react';
import type { EChartsOption, TooltipComponentFormatterCallbackParams } from 'echarts';
import { Users, GraduationCap, Mic, Clock, Check, X } from 'lucide-react';
import { Card } from './Card';
import { useDashboardStore, useFilteredData } from '@/store/dashboardStore';
import { formatNumber } from '@/utils/format';
import { cn } from '@/lib/utils';
import type { SchoolMetricKey, SchoolMetricConfig } from '@/types';

interface MetricConfigItem extends SchoolMetricConfig {
  icon: typeof Users;
}

const METRIC_CONFIG: Record<SchoolMetricKey, MetricConfigItem> = {
  teamCount: { label: '团队数', unit: '个', icon: Users, color: '#ffd700' },
  studentCount: { label: '学生数', unit: '人', icon: GraduationCap, color: '#cd5c5c' },
  guideCount: { label: '讲解员数', unit: '名', icon: Mic, color: '#daa520' },
  guideServiceHours: { label: '讲解服务时长', unit: '小时', icon: Clock, color: '#b8860b' },
};

const BAR_COLORS = [
  ['#ffd700', '#daa520'],
  ['#cd5c5c', '#8b0000'],
  ['#daa520', '#b8860b'],
  ['#cd853f', '#8b4513'],
  ['#d2691e', '#a0522d'],
  ['#bc8f8f', '#8b6914'],
  ['#f0e68c', '#daa520'],
  ['#d2b48c', '#8b7355'],
  ['#f4a460', '#cd853f'],
  ['#deb887', '#d2691e'],
];

export function SchoolComparison() {
  const { schoolRankings } = useFilteredData();
  const { selectedSchoolIds, toggleSchoolSelection, clearSchoolSelection } = useDashboardStore();
  const [activeMetric, setActiveMetric] = useState<SchoolMetricKey>('teamCount');

  const selectedSchools = useMemo(() => {
    return schoolRankings.filter((s) => selectedSchoolIds.includes(s.id));
  }, [schoolRankings, selectedSchoolIds]);

  const chartOption: EChartsOption = useMemo(() => {
    const metricLabels: SchoolMetricKey[] = ['teamCount', 'studentCount', 'guideCount', 'guideServiceHours'];

    const series = selectedSchools.map((school, idx) => ({
      name: school.name,
      type: 'bar' as const,
      barWidth: Math.max(12, 80 / Math.max(selectedSchools.length, 1)),
      data: metricLabels.map((key) => school[key]),
      itemStyle: {
        color: {
          type: 'linear' as const,
          x: 0,
          y: 0,
          x2: 0,
          y2: 1,
          colorStops: [
            { offset: 0, color: BAR_COLORS[idx % BAR_COLORS.length][0] },
            { offset: 1, color: BAR_COLORS[idx % BAR_COLORS.length][1] },
          ],
        },
        borderRadius: [4, 4, 0, 0],
      },
      emphasis: {
        itemStyle: {
          shadowColor: 'rgba(255, 215, 0, 0.5)',
          shadowBlur: 15,
        },
      },
    }));

    const tooltipFormatter = (params: TooltipComponentFormatterCallbackParams): string => {
      const paramArray = Array.isArray(params) ? params : [params];
      if (!paramArray.length) return '';
      const firstItem = paramArray[0];
      const metricKey = metricLabels[firstItem.dataIndex] as SchoolMetricKey;
      const config = METRIC_CONFIG[metricKey];
      let html = `<div style="font-family: 'Noto Serif SC', serif; margin-bottom: 8px;"><strong style="color: #daa520;">${config.label}</strong></div>`;
      paramArray.forEach((item) => {
        const value = typeof item.value === 'number' ? item.value : 0;
        html += `<div style="display: flex; justify-content: space-between; gap: 20px; margin: 4px 0;">
          <span style="color: #aaa;">${item.seriesName}</span>
          <span style="color: #ffd700; font-weight: bold;">${formatNumber(value)} ${config.unit}</span>
        </div>`;
      });
      return html;
    };

    return {
      tooltip: {
        trigger: 'axis',
        axisPointer: { type: 'shadow' },
        backgroundColor: 'rgba(26, 5, 5, 0.95)',
        borderColor: 'rgba(218, 165, 32, 0.5)',
        textStyle: {
          color: '#fff',
          fontFamily: 'Noto Serif SC',
        },
        formatter: tooltipFormatter,
      },
      legend: {
        show: selectedSchools.length > 0,
        top: 0,
        right: 0,
        textStyle: {
          color: 'rgba(218, 165, 32, 0.8)',
          fontFamily: 'Noto Serif SC',
          fontSize: 11,
        },
        itemWidth: 14,
        itemHeight: 8,
        itemGap: 12,
      },
      grid: {
        left: '3%',
        right: '3%',
        top: selectedSchools.length > 0 ? '18%' : '5%',
        bottom: '3%',
        containLabel: true,
      },
      xAxis: {
        type: 'category',
        data: metricLabels.map((k) => METRIC_CONFIG[k].label),
        axisLine: {
          lineStyle: { color: 'rgba(218, 165, 32, 0.3)' },
        },
        axisLabel: {
          color: 'rgba(218, 165, 32, 0.8)',
          fontFamily: 'Noto Serif SC',
          fontSize: 12,
        },
        axisTick: { show: false },
      },
      yAxis: {
        type: 'value',
        axisLine: { show: false },
        axisLabel: {
          color: 'rgba(218, 165, 32, 0.6)',
          fontFamily: 'Noto Serif SC',
          fontSize: 10,
        },
        splitLine: {
          lineStyle: { color: 'rgba(218, 165, 32, 0.1)' },
        },
      },
      series,
    };
  }, [selectedSchools]);

  const activeMetricConfig = METRIC_CONFIG[activeMetric];

  return (
    <Card title="学校横向对比" className="h-full">
      <div className="flex h-full min-h-[400px] gap-4">
        <div className="w-56 flex-shrink-0 border-r border-gold-600/30 pr-4">
          <div className="flex items-center justify-between mb-3">
            <span className="text-gold-400/80 font-serif text-sm">选择学校</span>
            <button
              onClick={clearSchoolSelection}
              className="text-gold-500/60 text-xs hover:text-gold-400 transition-colors"
            >
              清空
            </button>
          </div>
          <div className="space-y-1.5 max-h-[360px] overflow-y-auto scrollbar-hide pr-1">
            {schoolRankings.map((school) => {
              const isSelected = selectedSchoolIds.includes(school.id);
              return (
                <button
                  key={school.id}
                  onClick={() => toggleSchoolSelection(school.id)}
                  className={cn(
                    'w-full flex items-center gap-2 px-3 py-2 rounded-md text-left transition-all duration-200',
                    isSelected
                      ? 'bg-gold-500/20 border border-gold-500/50'
                      : 'hover:bg-gold-500/10 border border-transparent'
                  )}
                >
                  <div
                    className={cn(
                      'w-4 h-4 rounded-sm flex items-center justify-center flex-shrink-0 transition-colors',
                      isSelected
                        ? 'bg-gold-500 text-red-900'
                        : 'border border-gold-500/40'
                    )}
                  >
                    {isSelected && <Check className="w-3 h-3" strokeWidth={3} />}
                  </div>
                  <span
                    className={cn(
                      'font-serif text-sm truncate flex-1',
                      isSelected ? 'text-gold-300' : 'text-gold-400/70'
                    )}
                  >
                    {school.name}
                  </span>
                </button>
              );
            })}
          </div>
          <div className="mt-3 pt-3 border-t border-gold-600/30">
            <p className="text-gold-500/50 text-xs font-serif">
              已选 {selectedSchoolIds.length} / {schoolRankings.length} 所学校
            </p>
          </div>
        </div>

        <div className="flex-1 flex flex-col min-w-0">
          <div className="mb-4">
            <div className="flex items-center gap-2 mb-3">
              {(Object.keys(METRIC_CONFIG) as SchoolMetricKey[]).map((key) => {
                const config = METRIC_CONFIG[key];
                const Icon = config.icon;
                return (
                  <button
                    key={key}
                    onClick={() => setActiveMetric(key)}
                    className={cn(
                      'flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-serif transition-all',
                      activeMetric === key
                        ? 'bg-gold-500/20 text-gold-300 border border-gold-500/50'
                        : 'text-gold-400/60 hover:text-gold-400 hover:bg-gold-500/10 border border-transparent'
                    )}
                  >
                    <Icon className="w-3.5 h-3.5" />
                    {config.label}
                  </button>
                );
              })}
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              {selectedSchools.slice(0, 4).map((school, idx) => {
                const value = school[activeMetric];
                return (
                  <div
                    key={school.id}
                    className="relative bg-gradient-to-br from-red-900/60 to-red-950/80 rounded-lg border border-gold-600/40 p-3 overflow-hidden"
                  >
                    <div className="absolute top-0 right-0 w-16 h-16 bg-gradient-to-br from-gold-500/10 to-transparent rounded-bl-full" />
                    <div className="relative">
                      <div className="flex items-center gap-1.5 mb-2">
                        <div
                          className="w-2 h-2 rounded-full"
                          style={{ backgroundColor: BAR_COLORS[idx % BAR_COLORS.length][0] }}
                        />
                        <p className="text-gold-400/80 font-serif text-xs truncate">{school.name}</p>
                      </div>
                      <div className="flex items-baseline gap-1">
                        <span className="font-display text-2xl text-gold-300 font-bold">
                          {formatNumber(value)}
                        </span>
                        <span className="text-gold-500/70 text-xs">{activeMetricConfig.unit}</span>
                      </div>
                    </div>
                  </div>
                );
              })}
              {selectedSchools.length === 0 && (
                <div className="col-span-full flex flex-col items-center justify-center py-8 text-gold-500/40">
                  <X className="w-8 h-8 mb-2" />
                  <p className="font-serif text-sm">请在左侧选择要对比的学校</p>
                </div>
              )}
            </div>
          </div>

          <div className="flex-1 min-h-0">
            {selectedSchools.length > 0 ? (
              <ReactECharts
                option={chartOption}
                style={{ height: '100%', width: '100%' }}
                opts={{ renderer: 'canvas' }}
              />
            ) : (
              <div className="h-full flex items-center justify-center border border-dashed border-gold-600/30 rounded-lg">
                <p className="text-gold-500/40 font-serif">选择学校后将显示对比柱状图</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </Card>
  );
}
