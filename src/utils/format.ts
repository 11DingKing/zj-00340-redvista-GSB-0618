import { format } from 'date-fns';
import { zhCN } from 'date-fns/locale';

export function formatNumber(num: number): string {
  return num.toLocaleString('zh-CN');
}

export function formatDate(dateStr: string): string {
  return format(new Date(dateStr), 'yyyy年MM月dd日', { locale: zhCN });
}

export function formatMonth(monthStr: string): string {
  const [year, month] = monthStr.split('-');
  return `${month}月`;
}

export function formatCurrentDate(): string {
  return format(new Date(), 'yyyy年MM月dd日 EEEE', { locale: zhCN });
}

export function formatPercent(value: number, total: number): string {
  if (total === 0) return '0%';
  return `${((value / total) * 100).toFixed(1)}%`;
}
