import { useMemo } from 'react';
import ReactECharts from 'echarts-for-react';
import type { EChartsOption } from 'echarts';
import type { GuideMonthlyData } from '@/types';
import { formatMonth } from '@/utils/format';
import { Card } from './Card';
import { useCarousel } from '@/hooks/useCarousel';

interface GuideDualAxisProps {
  data: GuideMonthlyData[];
}

export function GuideDualAxis({ data }: GuideDualAxisProps) {
  const { pause, resume } = useCarousel();

  const option: EChartsOption = useMemo(() => ({
    grid: {
      left: '3%',
      right: '8%',
      top: '12%',
      bottom: '3%',
      containLabel: true,
    },
    tooltip: {
      trigger: 'axis',
      backgroundColor: 'rgba(26, 5, 5, 0.95)',
      borderColor: 'rgba(218, 165, 32, 0.5)',
      textStyle: {
        color: '#fff',
        fontFamily: 'Noto Serif SC',
      },
      axisPointer: {
        type: 'cross',
        crossStyle: {
          color: 'rgba(218, 165, 32, 0.5)',
        },
      },
    },
    legend: {
      data: ['在册人数', '服务时长'],
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
      data: data.map((d) => formatMonth(d.month)),
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
      axisTick: {
        show: false,
      },
    },
    yAxis: [
      {
        type: 'value',
        name: '人数',
        nameTextStyle: {
          color: 'rgba(218, 165, 32, 0.7)',
          fontFamily: 'Noto Serif SC',
          fontSize: 11,
        },
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
      {
        type: 'value',
        name: '小时',
        nameTextStyle: {
          color: 'rgba(205, 92, 92, 0.7)',
          fontFamily: 'Noto Serif SC',
          fontSize: 11,
        },
        axisLine: {
          show: true,
          lineStyle: {
            color: 'rgba(205, 92, 92, 0.3)',
          },
        },
        axisLabel: {
          color: 'rgba(205, 92, 92, 0.7)',
          fontFamily: 'Noto Serif SC',
          fontSize: 11,
        },
        splitLine: {
          show: false,
        },
      },
    ],
    series: [
      {
        name: '在册人数',
        type: 'bar',
        data: data.map((d) => d.registeredCount),
        itemStyle: {
          color: {
            type: 'linear',
            x: 0,
            y: 0,
            x2: 0,
            y2: 1,
            colorStops: [
              { offset: 0, color: '#ffd700' },
              { offset: 1, color: '#daa520' },
            ],
          },
          borderRadius: [4, 4, 0, 0],
        },
        barWidth: 12,
      },
      {
        name: '服务时长',
        type: 'line',
        yAxisIndex: 1,
        data: data.map((d) => d.serviceHours),
        smooth: true,
        symbol: 'circle',
        symbolSize: 8,
        itemStyle: {
          color: '#cd5c5c',
          borderColor: '#fff',
          borderWidth: 2,
        },
        lineStyle: {
          color: '#cd5c5c',
          width: 3,
          shadowColor: 'rgba(205, 92, 92, 0.4)',
          shadowBlur: 10,
        },
        areaStyle: {
          color: {
            type: 'linear',
            x: 0,
            y: 0,
            x2: 0,
            y2: 1,
            colorStops: [
              { offset: 0, color: 'rgba(205, 92, 92, 0.4)' },
              { offset: 1, color: 'rgba(205, 92, 92, 0)' },
            ],
          },
        },
      },
    ],
  }), [data]);

  return (
    <Card
      title="红领巾讲解员统计"
      panelId="guide"
      className="h-full"
      onMouseEnter={pause}
      onMouseLeave={resume}
    >
      <div className="h-[320px]">
        <ReactECharts
          option={option}
          style={{ height: '100%', width: '100%' }}
          opts={{ renderer: 'canvas' }}
        />
      </div>
    </Card>
  );
}
