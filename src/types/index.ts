export interface CoreStats {
  totalVisits: number;
  totalTours: number;
  visitsYoY: number;
  toursYoY: number;
}

export interface CoreMonthlyData {
  month: string;
  visits: number;
  tours: number;
}

export interface SchoolData {
  id: string;
  name: string;
  teamCount: number;
  studentCount: number;
  guideCount: number;
  guideServiceHours: number;
}

export interface GuideMonthlyData {
  month: string;
  registeredCount: number;
  serviceHours: number;
}

export interface MediaMonthlyData {
  month: string;
  videoViews: number;
  liveViews: number;
}

export interface MartyrProgress {
  confirmed: number;
  total: number;
}

export interface Activity {
  id: string;
  title: string;
  date: string;
  image: string;
  description: string;
}

export interface GuideDetail {
  id: string;
  name: string;
  school: string;
  grade: string;
  serviceHours: number;
  joinDate: string;
}

export interface SchoolDetail {
  school: SchoolData;
  teams: {
    id: string;
    date: string;
    studentCount: number;
    theme: string;
  }[];
  guides: GuideDetail[];
}

export interface DashboardData {
  coreStats: CoreStats;
  coreMonthlyData: CoreMonthlyData[];
  schoolRankings: SchoolData[];
  guideData: GuideMonthlyData[];
  mediaData: MediaMonthlyData[];
  martyrProgress: MartyrProgress;
  activities: Activity[];
  schoolDetails: Record<string, SchoolDetail>;
  lastGenerated: string;
  dataVersion: string;
}

export type TimePeriod = "quarter" | "year";

export type CarouselPanel = "ranking" | "guide" | "media" | "progress";
