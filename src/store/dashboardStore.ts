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
  toggleCompareSchool: (schoolId: string) => void;
  clearCompareSchools: () => void;
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
    const defaultSelected = data.schoolRankings.slice(0, 3).map((s) => s.id);
    set({ data, isLoading: false, selectedSchoolIds: defaultSelected });
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

  toggleCompareSchool: (schoolId) => {
    const { selectedSchoolIds } = get();
    const exists = selectedSchoolIds.includes(schoolId);
    if (exists) {
      set({
        selectedSchoolIds: selectedSchoolIds.filter((id) => id !== schoolId),
      });
    } else {
      set({ selectedSchoolIds: [...selectedSchoolIds, schoolId] });
    }
  },

  clearCompareSchools: () => {
    set({ selectedSchoolIds: [] });
  },

  regenerateData: () => {
    const data = generateMockData();
    saveData(data);
    const defaultSelected = data.schoolRankings.slice(0, 3).map((s) => s.id);
    set({ data, selectedSchoolIds: defaultSelected });
  },
}));

export function useFilteredData() {
  const { data, timePeriod, selectedSchoolIds } = useDashboardStore();

  if (!data) {
    return {
      coreStats: null,
      schoolRankings: [],
      guideData: [],
      mediaData: [],
      martyrProgress: null,
      activities: [],
      selectedSchoolData: [],
    };
  }

  const schoolRankings = filterSchoolRankingsByPeriod(
    data.schoolRankings,
    data.schoolDetails,
    timePeriod,
  );

  const selectedSchoolData = schoolRankings.filter((s) =>
    selectedSchoolIds.includes(s.id),
  );

  return {
    coreStats: filterCoreStatsByPeriod(
      data.coreStats,
      data.coreMonthlyStats,
      timePeriod,
    ),
    schoolRankings,
    guideData: filterGuideDataByPeriod(data.guideData, timePeriod),
    mediaData: filterMediaDataByPeriod(data.mediaData, timePeriod),
    martyrProgress: data.martyrProgress,
    activities: data.activities,
    selectedSchoolData,
  };
}
