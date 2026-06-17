import type {
  TimePeriod,
  CoreStats,
  CoreMonthlyStats,
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
  stats: CoreStats,
  monthlyStats: CoreMonthlyStats[],
  period: TimePeriod,
): CoreStats {
  if (period === "year") {
    return stats;
  }

  const filtered = monthlyStats.filter((m) => isInPeriod(m.month, period));
  const totalVisits = filtered.reduce((sum, m) => sum + m.visits, 0);
  const totalTours = filtered.reduce((sum, m) => sum + m.tours, 0);

  const ratio = totalVisits / Math.max(stats.totalVisits, 1);
  const visitsYoY = Math.round(stats.visitsYoY * ratio * 10) / 10;
  const toursYoY = Math.round(stats.toursYoY * ratio * 10) / 10;

  return {
    totalVisits,
    totalTours,
    visitsYoY,
    toursYoY,
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
      if (!schoolDetail) return { ...school, teamCount: 0, studentCount: 0 };

      const filteredTeams = schoolDetail.teams.filter((t) =>
        isInPeriod(t.date, period),
      );
      const avgStudentsPerTeam =
        school.studentCount / Math.max(school.teamCount, 1);

      return {
        ...school,
        teamCount: filteredTeams.length,
        studentCount: Math.round(filteredTeams.length * avgStudentsPerTeam),
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
