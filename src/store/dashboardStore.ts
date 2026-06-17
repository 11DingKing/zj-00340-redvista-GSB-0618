import { create } from "zustand";
import type {
  DashboardData,
  TimePeriod,
  CarouselPanel,
  SchoolDetail,
} from "@/types";
import { loadData, saveData } from "@/data/storage";
import { generateMockData } from "@/data/mockData";
import {
  filterCoreStatsByPeriod,
  filterSchoolRankingsByPeriod,
  filterGuideDataByPeriod,
  filterMediaDataByPeriod,
} from "@/utils/period";

interface DashboardState {
  data: DashboardData | null;
  timePeriod: TimePeriod;
  activePanel: CarouselPanel;
  selectedSchool: SchoolDetail | null;
  selectedSchoolIds: string[];
  isLoading: boolean;
  initData: () => void;
  setTimePeriod: (period: TimePeriod) => void;
  setActivePanel: (panel: CarouselPanel) => void;
  selectSchool: (schoolId: string) => void;
  closeSchoolDetail: () => void;
  toggleSchoolCompare: (schoolId: string) => void;
  clearSchoolCompare: () => void;
  regenerateData: () => void;
}

export const useDashboardStore = create<DashboardState>((set, get) => ({
  data: null,
  timePeriod: "year",
  activePanel: "ranking",
  selectedSchool: null,
  selectedSchoolIds: [],
  isLoading: true,

  initData: () => {
    let data = loadData();
    if (!data) {
      data = generateMockData();
      saveData(data);
    }
    set({ data, isLoading: false });
  },

  setTimePeriod: (period) => {
    set({ timePeriod: period });
  },

  setActivePanel: (panel) => {
    set({ activePanel: panel });
  },

  selectSchool: (schoolId) => {
    const { data } = get();
    if (!data) return;
    const detail = data.schoolDetails[schoolId];
    if (detail) {
      set({ selectedSchool: detail });
    }
  },

  closeSchoolDetail: () => {
    set({ selectedSchool: null });
  },

  toggleSchoolCompare: (schoolId) => {
    const { selectedSchoolIds } = get();
    if (selectedSchoolIds.includes(schoolId)) {
      set({
        selectedSchoolIds: selectedSchoolIds.filter((id) => id !== schoolId),
      });
    } else {
      set({ selectedSchoolIds: [...selectedSchoolIds, schoolId] });
    }
  },

  clearSchoolCompare: () => {
    set({ selectedSchoolIds: [] });
  },

  regenerateData: () => {
    const data = generateMockData();
    saveData(data);
    set({ data });
  },
}));

export function useFilteredData() {
  const { data, timePeriod } = useDashboardStore();

  if (!data) {
    return {
      coreStats: null,
      schoolRankings: [],
      guideData: [],
      mediaData: [],
      martyrProgress: null,
      activities: [],
    };
  }

  return {
    coreStats: filterCoreStatsByPeriod(
      data.coreStats,
      data.coreMonthlyData,
      timePeriod,
    ),
    schoolRankings: filterSchoolRankingsByPeriod(
      data.schoolRankings,
      data.schoolDetails,
      timePeriod,
    ),
    guideData: filterGuideDataByPeriod(data.guideData, timePeriod),
    mediaData: filterMediaDataByPeriod(data.mediaData, timePeriod),
    martyrProgress: data.martyrProgress,
    activities: data.activities,
  };
}
