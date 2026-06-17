import { create } from 'zustand';
import type { DashboardData, TimePeriod, CarouselPanel, SchoolDetail } from '@/types';
import { loadData, saveData } from '@/data/storage';
import { generateMockData } from '@/data/mockData';
import {
  filterCoreStatsByPeriod,
  filterSchoolRankingsByPeriod,
  filterGuideDataByPeriod,
  filterMediaDataByPeriod,
} from '@/utils/period';

interface DashboardState {
  data: DashboardData | null;
  timePeriod: TimePeriod;
  activePanel: CarouselPanel;
  selectedSchool: SchoolDetail | null;
  isLoading: boolean;
  initData: () => void;
  setTimePeriod: (period: TimePeriod) => void;
  setActivePanel: (panel: CarouselPanel) => void;
  selectSchool: (schoolId: string) => void;
  closeSchoolDetail: () => void;
  regenerateData: () => void;
}

export const useDashboardStore = create<DashboardState>((set, get) => ({
  data: null,
  timePeriod: 'year',
  activePanel: 'ranking',
  selectedSchool: null,
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
    coreStats: filterCoreStatsByPeriod(data.coreStats, timePeriod),
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
