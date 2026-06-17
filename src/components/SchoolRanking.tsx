import { useMemo, useCallback } from 'react';
import ReactECharts from 'echarts-for-react';
import type { EChartsOption } from 'echarts';
import type { SchoolData } from '@/types';
import { useDashboardStore } from '@/store/dashboardStore';
import { formatNumber } from '@/utils/format';
import { Card } from './Card';
import { useCarousel } from '@/hooks/useCarousel';

interface SchoolRankingProps {
  data: SchoolData[];
}

export function SchoolRanking({ data }: SchoolRankingProps) {
  const { selectSchool } = useDashboardStore();
  const { pause, resume } = useCarousel();

  const topSchools = useMemo(() => {
    return [...data].sort((a, b) => b.teamCount - a.teamCount).slice(0, 8);
  }, [data]);

  const handleClick = useCallback((params: { name: string; dataIndex: number }) => {
    const school = topSchools[params.dataIndex];
    if (school) {
      selectSchool(school.id);
    }
  }, [topSchools, selectSchool]);

  const option: EChartsOption = useMemo(() => ({
    grid: {
      left: '3%',
      right: '8%',
      top: '3%',
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
      formatter: (params: any) => {
        const item = params[0];
        const school = topSchools[item.dataIndex];
        return `
          <div style="font-family: 'Noto Serif SC', serif;">
            <div style="color: #daa520; font-weight: bold; margin-bottom: 8px;">${school.name}</div>
            <div style="color: #fff;">研学团队：<span style="color: #ffd700; font-weight: bold;">${formatNumber(school.teamCount)} 个</span></div>
            <div style="color: #fff;">学生人数：<span style="color: #ffd700; font-weight: bold;">${formatNumber(school.studentCount)} 人</span></div>
            <div style="color: #aaa; font-size: 12px; margin-top: 4px;">点击查看详情</div>
          </div>
        `;
      },
    },
    xAxis: {
      type: 'value',
      axisLine: {
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
    yAxis: {
      type: 'category',
      data: topSchools.map((s) => s.name.replace(/^(北京市|中国人民大学|北京师范大学|清华大学|北京大学)/, '')),
      inverse: true,
      axisLine: {
        lineStyle: {
          color: 'rgba(218, 165, 32, 0.3)',
        },
      },
      axisLabel: {
        color: 'rgba(218, 165, 32, 0.8)',
        fontFamily: 'Noto Serif SC',
        fontSize: 12,
        margin: 8,
      },
      splitLine: {
        show: false,
      },
    },
    series: [
      {
        type: 'bar',
        data: topSchools.map((s, idx) => ({
          value: s.teamCount,
          itemStyle: {
            color: {
              type: 'linear',
              x: 0,
              y: 0,
              x2: 1,
              y2: 0,
              colorStops: [
                { offset: 0, color: idx === 0 ? '#ffd700' : '#cd5c5c' },
                { offset: 1, color: idx === 0 ? '#daa520' : '#8b0000' },
              ],
            },
            borderRadius: [0, 4, 4, 0],
            shadowColor: 'rgba(218, 165, 32, 0.3)',
            shadowBlur: 10,
          },
        })),
        barWidth: 16,
        label: {
          show: true,
          position: 'right',
          color: '#ffd700',
          fontFamily: 'Noto Serif SC',
          fontWeight: 'bold',
          fontSize: 12,
          formatter: '{c} 个',
        },
        emphasis: {
          itemStyle: {
            color: {
              type: 'linear',
              x: 0,
              y: 0,
              x2: 1,
              y2: 0,
              colorStops: [
                { offset: 0, color: '#ffd700' },
                { offset: 1, color: '#ffb700' },
              ],
            },
            shadowColor: 'rgba(255, 215, 0, 0.6)',
            shadowBlur: 20,
          },
        },
      },
    ],
  }), [topSchools]);

  const onEvents = useMemo(() => ({
    click: handleClick,
    mouseover: pause,
    mouseout: resume,
  }), [handleClick, pause, resume]);

  return (
    <Card
      title="研学团队学校来源分布 TOP8"
      panelId="ranking"
      className="h-full"
      onMouseEnter={pause}
      onMouseLeave={resume}
    >
      <div className="h-[320px] cursor-pointer">
        <ReactECharts
          option={option}
          onEvents={onEvents}
          style={{ height: '100%', width: '100%' }}
          opts={{ renderer: 'canvas' }}
        />
      </div>
      <p className="text-center text-gold-500/50 text-xs mt-1 font-serif">
        点击学校名称可查看详细数据
      </p>
    </Card>
  );
}
