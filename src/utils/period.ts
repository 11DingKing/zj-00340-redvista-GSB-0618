import type {
  TimePeriod,
  CoreStats,
  SchoolData,
  SchoolDetail,
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
  details: Record<string, SchoolDetail>,
  period: TimePeriod,
): CoreStats {
  if (period === "year") return stats;

  let filteredTeamCount = 0;
  let totalTeamCount = 0;

  Object.values(details).forEach((detail) => {
    totalTeamCount += detail.teams.length;
    filteredTeamCount += detail.teams.filter((t) =>
      isInPeriod(t.date, period),
    ).length;
  });

  const ratio = totalTeamCount > 0 ? filteredTeamCount / totalTeamCount : 1;

  return {
    totalVisits: Math.round(stats.totalVisits * ratio),
    totalTours: Math.round(stats.totalTours * ratio),
    visitsYoY: stats.visitsYoY,
    toursYoY: stats.toursYoY,
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
