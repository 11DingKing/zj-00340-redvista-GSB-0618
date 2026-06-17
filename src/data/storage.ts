import type { DashboardData } from '@/types';

const STORAGE_KEY = 'red_education_dashboard_data_v1';

export function loadData(): DashboardData | null {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    const data = JSON.parse(raw) as DashboardData;
    if (data.dataVersion !== '1.0') return null;
    return data;
  } catch {
    return null;
  }
}

export function saveData(data: DashboardData): void {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  } catch (e) {
    console.error('Failed to save data to localStorage:', e);
  }
}

export function clearData(): void {
  localStorage.removeItem(STORAGE_KEY);
}
