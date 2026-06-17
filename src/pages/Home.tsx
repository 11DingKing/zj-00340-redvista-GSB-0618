import { useEffect } from 'react';
import { useDashboardStore, useFilteredData } from '@/store/dashboardStore';
import { useCarousel } from '@/hooks/useCarousel';
import { Header } from '@/components/Header';
import { StatCard } from '@/components/StatCard';
import { SchoolRanking } from '@/components/SchoolRanking';
import { GuideDualAxis } from '@/components/GuideDualAxis';
import { MediaTrend } from '@/components/MediaTrend';
import { ProgressRing } from '@/components/ProgressRing';
import { ActivityList } from '@/components/ActivityList';
import { SchoolDetailModal } from '@/components/SchoolDetailModal';

export default function Home() {
  const { initData, isLoading } = useDashboardStore();
  const { coreStats, schoolRankings, guideData, mediaData, martyrProgress, activities } =
    useFilteredData();
  useCarousel();

  useEffect(() => {
    initData();
  }, [initData]);

  if (isLoading || !coreStats || !martyrProgress) {
    return (
      <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-red-950 to-red-900">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-gold-500/30 border-t-gold-500 rounded-full animate-spin mx-auto mb-4" />
          <p className="text-gold-400 font-serif text-lg">数据加载中...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="relative w-full h-full flex flex-col overflow-hidden">
      <Header />

      <main className="relative z-10 flex-1 overflow-y-auto scrollbar-hide p-6">
        <div className="max-w-[1920px] mx-auto space-y-6">
          <div className="animate-fade-in" style={{ animationDelay: '0.1s' }}>
            <StatCard data={coreStats} />
          </div>

          <div
            className="grid grid-cols-1 lg:grid-cols-2 gap-6"
            style={{ animationDelay: '0.2s' }}
          >
            <div className="animate-fade-in" style={{ animationDelay: '0.3s' }}>
              <SchoolRanking data={schoolRankings} />
            </div>
            <div className="animate-fade-in" style={{ animationDelay: '0.4s' }}>
              <GuideDualAxis data={guideData} />
            </div>
          </div>

          <div
            className="grid grid-cols-1 lg:grid-cols-3 gap-6"
            style={{ animationDelay: '0.5s' }}
          >
            <div className="lg:col-span-2 animate-fade-in" style={{ animationDelay: '0.6s' }}>
              <MediaTrend data={mediaData} />
            </div>
            <div className="animate-fade-in" style={{ animationDelay: '0.7s' }}>
              <ProgressRing data={martyrProgress} />
            </div>
          </div>

          <div className="animate-fade-in" style={{ animationDelay: '0.8s' }}>
            <ActivityList data={activities} />
          </div>
        </div>
      </main>

      <SchoolDetailModal />
    </div>
  );
}
