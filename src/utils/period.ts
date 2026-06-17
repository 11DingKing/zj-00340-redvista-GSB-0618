import type {
  TimePeriod,
  CoreStats,
  CoreStatsMonthly,
  SchoolData,
  GuideMonthlyData,
  MediaMonthlyData,
} from "@/types";

function isInPeriod(dateStr: string, period: TimePeriod): boolean {
  const now = new Date();
  const currentYear = now.getFullYear();
  const [year, month] = dateStr.split("-").map(Number);

  if (year !== currentYear) return false;

  if (period === "year") return true;

  const currentQuarter = Math.floor(now.getMonth() / 3);
  const monthQuarter = Math.floor((month - 1) / 3);
  return monthQuarter === currentQuarter;
}

export function filterCoreStatsByPeriod(
  monthlyStats: CoreStatsMonthly[],
  annualStats: CoreStats,
  period: TimePeriod,
): CoreStats {
  if (period === "year") {
    return annualStats;
  }

  const filtered = monthlyStats.filter((m) => isInPeriod(m.month, period));
  const totalVisits = filtered.reduce((sum, m) => sum + m.totalVisits, 0);
  const totalTours = filtered.reduce((sum, m) => sum + m.totalTours, 0);

  return {
    ...annualStats,
    totalVisits,
    totalTours,
  };
}

export function filterSchoolRankingsByPeriod(
  rankings: SchoolData[],
  details: Record<string, { teams: { date: string }[] }>,
  period: TimePeriod,
): SchoolData[] {
  return rankings
    .map((school) => {
      const schoolDetail = details[school.id];
      if (!schoolDetail)
        return {
          ...school,
          teamCount: 0,
          studentCount: 0,
          guideCount: 0,
          guideServiceHours: 0,
        };

      const filteredTeams = schoolDetail.teams.filter((t) =>
        isInPeriod(t.date, period),
      );
      const ratio =
        school.teamCount > 0 ? filteredTeams.length / school.teamCount : 0;
      const avgStudentsPerTeam =
        school.studentCount / Math.max(school.teamCount, 1);

      return {
        ...school,
        teamCount: filteredTeams.length,
        studentCount: Math.round(filteredTeams.length * avgStudentsPerTeam),
        guideCount: Math.round(school.guideCount * ratio),
        guideServiceHours: Math.round(school.guideServiceHours * ratio),
      };
    })
    .sort((a, b) => b.teamCount - a.teamCount);
}

export function filterGuideDataByPeriod(
  data: GuideMonthlyData[],
  period: TimePeriod,
): GuideMonthlyData[] {
  return data.filter((d) => isInPeriod(d.month, period));
}

export function filterMediaDataByPeriod(
  data: MediaMonthlyData[],
  period: TimePeriod,
): MediaMonthlyData[] {
  return data.filter((d) => isInPeriod(d.month, period));
}

export function getPeriodLabel(period: TimePeriod): string {
  return period === "year" ? "本年" : "本季";
}

export function getCurrentQuarterMonths(): number[] {
  const now = new Date();
  const quarter = Math.floor(now.getMonth() / 3);
  return [quarter * 3 + 1, quarter * 3 + 2, quarter * 3 + 3];
}
