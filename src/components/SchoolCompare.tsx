import { useMemo } from "react";
import ReactECharts from "echarts-for-react";
import type { EChartsOption } from "echarts";
import type { CompareMetric, BarColorPair, AxisTooltipParam } from "@/types";
import { useDashboardStore } from "@/store/dashboardStore";
import { useFilteredData } from "@/store/dashboardStore";
import { formatNumber } from "@/utils/format";
import { Card } from "./Card";
import { useCarousel } from "@/hooks/useCarousel";

const METRICS: CompareMetric[] = [
  { key: "teamCount", label: "团队数", unit: "个", color: "#ffd700" },
  { key: "studentCount", label: "学生数", unit: "人", color: "#cd5c5c" },
  { key: "guideCount", label: "讲解员数", unit: "名", color: "#4fc3f7" },
  {
    key: "guideServiceHours",
    label: "讲解服务时长",
    unit: "h",
    color: "#81c784",
  },
];

const BAR_COLORS: BarColorPair[] = [
  { from: "#ffd700", to: "#daa520" },
  { from: "#cd5c5c", to: "#8b0000" },
  { from: "#4fc3f7", to: "#0288d1" },
  { from: "#81c784", to: "#388e3c" },
  { from: "#ffb74d", to: "#f57c00" },
  { from: "#ba68c8", to: "#7b1fa2" },
  { from: "#f06292", to: "#c2185b" },
  { from: "#4db6ac", to: "#00796b" },
  { from: "#fff176", to: "#f9a825" },
  { from: "#a1887f", to: "#5d4037" },
];

function shortenName(name: string): string {
  return name
    .replace(/^北京市/, "")
    .replace(/^清华大学/, "清华")
    .replace(/^北京大学/, "北大")
    .replace(/^中国人民大学/, "人大")
    .replace(/^北京师范大学/, "北师大")
    .replace(/附属中学/, "附中")
    .replace(/实验中学/, "实验");
}

export function SchoolCompare() {
  const { selectedSchoolIds, toggleSchoolCompare, clearSchoolCompare } =
    useDashboardStore();
  const { schoolRankings } = useFilteredData();
  const { pause, resume } = useCarousel();

  const selectedSchools = useMemo(() => {
    return schoolRankings.filter((s) => selectedSchoolIds.has(s.id));
  }, [schoolRankings, selectedSchoolIds]);

  const chartOption: EChartsOption = useMemo(() => {
    if (selectedSchools.length === 0) return {};

    const schoolNames = selectedSchools.map((s) => shortenName(s.name));

    return {
      grid: {
        left: "3%",
        right: "5%",
        top: "14%",
        bottom: "3%",
        containLabel: true,
      },
      tooltip: {
        trigger: "axis",
        backgroundColor: "rgba(26, 5, 5, 0.95)",
        borderColor: "rgba(218, 165, 32, 0.5)",
        textStyle: {
          color: "#fff",
          fontFamily: "Noto Serif SC",
        },
        axisPointer: {
          type: "shadow",
        },
        formatter: (params: AxisTooltipParam | AxisTooltipParam[]) => {
          if (!Array.isArray(params)) return "";
          const rows = params
            .map((p: AxisTooltipParam) => {
              const metric = METRICS[p.seriesIndex ?? 0];
              return `<div style="display:flex;align-items:center;gap:6px;">
                <span style="display:inline-block;width:8px;height:8px;border-radius:50%;background:${p.color};"></span>
                <span>${metric.label}：</span>
                <span style="color:#ffd700;font-weight:bold;">${formatNumber(p.value as number)} ${metric.unit}</span>
              </div>`;
            })
            .join("");
          return `<div style="font-family:'Noto Serif SC',serif;">
            <div style="color:#daa520;font-weight:bold;margin-bottom:6px;">${params[0].axisValueLabel}</div>
            ${rows}
          </div>`;
        },
      },
      legend: {
        data: METRICS.map((m) => m.label),
        top: 0,
        textStyle: {
          color: "rgba(218, 165, 32, 0.8)",
          fontFamily: "Noto Serif SC",
          fontSize: 11,
        },
        itemWidth: 12,
        itemHeight: 12,
      },
      xAxis: {
        type: "category",
        data: schoolNames,
        axisLine: {
          lineStyle: { color: "rgba(218, 165, 32, 0.3)" },
        },
        axisLabel: {
          color: "rgba(218, 165, 32, 0.8)",
          fontFamily: "Noto Serif SC",
          fontSize: 11,
          interval: 0,
          rotate: schoolNames.length > 4 ? 20 : 0,
        },
        axisTick: { show: false },
      },
      yAxis: [
        {
          type: "value",
          name: "数量",
          nameTextStyle: {
            color: "rgba(218, 165, 32, 0.7)",
            fontFamily: "Noto Serif SC",
            fontSize: 11,
          },
          axisLine: {
            lineStyle: { color: "rgba(218, 165, 32, 0.3)" },
          },
          axisLabel: {
            color: "rgba(218, 165, 32, 0.7)",
            fontFamily: "Noto Serif SC",
            fontSize: 11,
          },
          splitLine: {
            lineStyle: { color: "rgba(218, 165, 32, 0.1)" },
          },
        },
        {
          type: "value",
          name: "时长(h)",
          nameTextStyle: {
            color: "rgba(129, 199, 132, 0.7)",
            fontFamily: "Noto Serif SC",
            fontSize: 11,
          },
          axisLine: {
            lineStyle: { color: "rgba(129, 199, 132, 0.3)" },
          },
          axisLabel: {
            color: "rgba(129, 199, 132, 0.7)",
            fontFamily: "Noto Serif SC",
            fontSize: 11,
          },
          splitLine: { show: false },
        },
      ],
      series: METRICS.map((metric, mi) => ({
        name: metric.label,
        type: "bar" as const,
        yAxisIndex: mi === 3 ? 1 : 0,
        data: selectedSchools.map((s) => s[metric.key]),
        itemStyle: {
          color: {
            type: "linear" as const,
            x: 0,
            y: 0,
            x2: 0,
            y2: 1,
            colorStops: [
              { offset: 0, color: metric.color },
              { offset: 1, color: metric.color + "88" },
            ],
          },
          borderRadius: [3, 3, 0, 0] as [number, number, number, number],
        },
        barMaxWidth: 24,
      })),
    };
  }, [selectedSchools]);

  return (
    <Card
      title="学校横向对比"
      className="h-full"
      onMouseEnter={pause}
      onMouseLeave={resume}
    >
      <div className="flex gap-4 h-[320px]">
        <div className="w-[180px] flex-shrink-0 flex flex-col">
          <div className="flex items-center justify-between mb-2 px-1">
            <span className="text-gold-400/80 text-xs font-serif">
              选择学校
            </span>
            {selectedSchoolIds.size > 0 && (
              <button
                onClick={clearSchoolCompare}
                className="text-red-400/70 text-xs hover:text-red-300 transition-colors font-serif"
              >
                清空
              </button>
            )}
          </div>
          <div className="flex-1 overflow-y-auto scrollbar-hide space-y-1 pr-1">
            {schoolRankings.map((school) => {
              const checked = selectedSchoolIds.has(school.id);
              return (
                <label
                  key={school.id}
                  className={`flex items-center gap-2 px-2 py-1.5 rounded cursor-pointer transition-all text-sm font-serif
                    ${
                      checked
                        ? "bg-gold-500/15 text-gold-300 border border-gold-600/40"
                        : "text-gold-400/60 hover:text-gold-300 hover:bg-gold-500/5 border border-transparent"
                    }`}
                >
                  <input
                    type="checkbox"
                    checked={checked}
                    onChange={() => toggleSchoolCompare(school.id)}
                    className="w-3.5 h-3.5 rounded border-gold-600/50 bg-transparent accent-gold-500 cursor-pointer"
                  />
                  <span className="truncate">{shortenName(school.name)}</span>
                </label>
              );
            })}
          </div>
        </div>

        <div className="flex-1 flex flex-col min-w-0 border-l border-gold-600/20 pl-4">
          {selectedSchools.length === 0 ? (
            <div className="flex-1 flex items-center justify-center">
              <p className="text-gold-500/40 font-serif text-sm">
                请在左侧勾选学校进行对比
              </p>
            </div>
          ) : (
            <>
              <div className="overflow-x-auto scrollbar-hide mb-2">
                <table className="w-full text-xs font-serif border-collapse">
                  <thead>
                    <tr className="border-b border-gold-600/20">
                      <th className="text-left text-gold-400/70 py-1.5 pr-3 font-normal">
                        学校
                      </th>
                      {METRICS.map((m) => (
                        <th
                          key={m.key}
                          className="text-right text-gold-400/70 py-1.5 px-2 font-normal whitespace-nowrap"
                        >
                          {m.label}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {selectedSchools.map((school, si) => (
                      <tr
                        key={school.id}
                        className="border-b border-gold-600/10"
                      >
                        <td className="py-1.5 pr-3">
                          <span
                            className="inline-block w-2 h-2 rounded-full mr-1.5"
                            style={{
                              backgroundColor:
                                BAR_COLORS[si % BAR_COLORS.length].from,
                            }}
                          />
                          <span className="text-gold-300">
                            {shortenName(school.name)}
                          </span>
                        </td>
                        {METRICS.map((m) => (
                          <td
                            key={m.key}
                            className="text-right text-gold-200 py-1.5 px-2 font-bold tabular-nums"
                          >
                            {formatNumber(school[m.key])}
                            <span className="text-gold-500/50 font-normal ml-0.5">
                              {m.unit}
                            </span>
                          </td>
                        ))}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <div className="flex-1 min-h-0">
                <ReactECharts
                  option={chartOption}
                  style={{ height: "100%", width: "100%" }}
                  opts={{ renderer: "canvas" }}
                />
              </div>
            </>
          )}
        </div>
      </div>
    </Card>
  );
}
