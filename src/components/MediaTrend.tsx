import { useMemo } from 'react';
import ReactECharts from 'echarts-for-react';
import type { EChartsOption } from 'echarts';
import type { MediaMonthlyData } from '@/types';
import { formatMonth, formatNumber } from '@/utils/format';
import { Card } from './Card';
import { useCarousel } from '@/hooks/useCarousel';

interface MediaTrendProps {
  data: MediaMonthlyData[];
}

export function MediaTrend({ data }: MediaTrendProps) {
  const { pause, resume } = useCarousel();

  const option: EChartsOption = useMemo(() => ({
    grid: {
      left: '3%',
      right: '4%',
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
      formatter: (params: any) => {
        let html = `<div style="font-family: 'Noto Serif SC', serif;"><div style="color: #daa520; font-weight: bold; margin-bottom: 8px;">${params[0].axisValue}</div>`;
        params.forEach((p: any) => {
          const color = p.seriesName === '微视频' ? '#ffd700' : '#cd5c5c';
          html += `<div style="color: #fff;">${p.marker}${p.seriesName}：<span style="color: ${color}; font-weight: bold;">${formatNumber(p.value)}</span></div>`;
        });
        html += '</div>';
        return html;
      },
    },
    legend: {
      data: ['微视频播放量', '直播观看量'],
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
      data: data.map((d) => formatMonth(d.month)),
      boundaryGap: false,
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
    series: [
      {
        name: '微视频播放量',
        type: 'line',
        data: data.map((d) => d.videoViews),
        smooth: true,
        symbol: 'circle',
        symbolSize: 10,
        itemStyle: {
          color: '#ffd700',
          borderColor: '#fff',
          borderWidth: 2,
        },
        lineStyle: {
          color: '#ffd700',
          width: 3,
          shadowColor: 'rgba(255, 215, 0, 0.4)',
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
              { offset: 0, color: 'rgba(255, 215, 0, 0.3)' },
              { offset: 1, color: 'rgba(255, 215, 0, 0)' },
            ],
          },
        },
      },
      {
        name: '直播观看量',
        type: 'line',
        data: data.map((d) => d.liveViews),
        smooth: true,
        symbol: 'diamond',
        symbolSize: 10,
        itemStyle: {
          color: '#cd5c5c',
          borderColor: '#fff',
          borderWidth: 2,
        },
        lineStyle: {
          color: '#cd5c5c',
          width: 3,
          type: 'dashed',
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
              { offset: 0, color: 'rgba(205, 92, 92, 0.2)' },
              { offset: 1, color: 'rgba(205, 92, 92, 0)' },
            ],
          },
        },
      },
    ],
  }), [data]);

  return (
    <Card
      title="微视频与直播传播量趋势"
      panelId="media"
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
