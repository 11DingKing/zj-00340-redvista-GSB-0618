import { X, Users, GraduationCap, Clock, Calendar, Award } from 'lucide-react';
import type { SchoolDetail } from '@/types';
import { useDashboardStore } from '@/store/dashboardStore';
import { formatDate, formatNumber } from '@/utils/format';
import CountUp from 'react-countup';

export function SchoolDetailModal() {
  const { selectedSchool, closeSchoolDetail } = useDashboardStore();

  if (!selectedSchool) return null;

  const { school, teams, guides } = selectedSchool;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-8">
      <div
        className="absolute inset-0 bg-black/70 backdrop-blur-sm"
        onClick={closeSchoolDetail}
      />

      <div className="relative w-full max-w-5xl max-h-[90vh] bg-gradient-to-br from-red-900 to-red-950 rounded-2xl border border-gold-500/50 shadow-2xl overflow-hidden animate-fade-in">
        <div className="decoration-corner decoration-corner-tl" />
        <div className="decoration-corner decoration-corner-tr" />
        <div className="decoration-corner decoration-corner-bl" />
        <div className="decoration-corner decoration-corner-br" />

        <div className="sticky top-0 z-10 bg-gradient-to-r from-red-800 to-red-900 border-b border-gold-500/30 px-6 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="font-display text-2xl text-gold-300 text-glow-gold font-bold tracking-wide">
                {school.name}
              </h2>
              <p className="text-gold-400/70 text-sm font-serif mt-1">
                研学详情与红领巾讲解员数据
              </p>
            </div>
            <button
              onClick={closeSchoolDetail}
              className="p-2 text-gold-400/70 hover:text-gold-300 hover:bg-gold-500/20 rounded-lg transition-all"
            >
              <X className="w-6 h-6" />
            </button>
          </div>

          <div className="grid grid-cols-4 gap-4 mt-4">
            <div className="bg-red-950/50 rounded-xl p-3 border border-gold-600/30">
              <div className="flex items-center gap-2 text-gold-400/70 text-xs mb-1">
                <Users className="w-4 h-4" />
                <span>研学团队</span>
              </div>
              <CountUp
                end={school.teamCount}
                duration={1.5}
                className="font-display text-2xl text-gold-300 font-bold"
                suffix=" 个"
              />
            </div>
            <div className="bg-red-950/50 rounded-xl p-3 border border-gold-600/30">
              <div className="flex items-center gap-2 text-gold-400/70 text-xs mb-1">
                <GraduationCap className="w-4 h-4" />
                <span>学生人数</span>
              </div>
              <CountUp
                end={school.studentCount}
                duration={1.5}
                className="font-display text-2xl text-gold-300 font-bold"
                suffix=" 人"
                formattingFn={(val) => formatNumber(val)}
              />
            </div>
            <div className="bg-red-950/50 rounded-xl p-3 border border-gold-600/30">
              <div className="flex items-center gap-2 text-gold-400/70 text-xs mb-1">
                <Award className="w-4 h-4" />
                <span>红领巾讲解员</span>
              </div>
              <CountUp
                end={school.guideCount}
                duration={1.5}
                className="font-display text-2xl text-gold-300 font-bold"
                suffix=" 名"
              />
            </div>
            <div className="bg-red-950/50 rounded-xl p-3 border border-gold-600/30">
              <div className="flex items-center gap-2 text-gold-400/70 text-xs mb-1">
                <Clock className="w-4 h-4" />
                <span>服务总时长</span>
              </div>
              <CountUp
                end={school.guideServiceHours}
                duration={1.5}
                className="font-display text-2xl text-gold-300 font-bold"
                suffix=" 小时"
              />
            </div>
          </div>
        </div>

        <div className="p-6 overflow-y-auto max-h-[calc(90vh-240px)]">
          <div className="grid grid-cols-2 gap-6">
            <div>
              <h3 className="text-gold-300 font-serif text-lg font-semibold mb-4 flex items-center gap-2">
                <span className="w-1 h-5 bg-gradient-to-b from-gold-400 to-gold-600 rounded-r" />
                研学团队明细
              </h3>
              <div className="space-y-3 max-h-[400px] overflow-y-auto scrollbar-hide pr-2">
                {teams.slice(0, 10).map((team) => (
                  <div
                    key={team.id}
                    className="bg-red-950/40 rounded-lg p-4 border border-gold-600/20 hover:border-gold-500/40 transition-all"
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <h4 className="text-gold-300 font-serif font-medium text-sm">
                          {team.theme}
                        </h4>
                        <div className="flex items-center gap-4 mt-2 text-xs">
                          <span className="flex items-center gap-1 text-gold-400/60">
                            <Calendar className="w-3.5 h-3.5" />
                            {formatDate(team.date)}
                          </span>
                          <span className="flex items-center gap-1 text-gold-400/60">
                            <Users className="w-3.5 h-3.5" />
                            {team.studentCount} 人
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div>
              <h3 className="text-gold-300 font-serif text-lg font-semibold mb-4 flex items-center gap-2">
                <span className="w-1 h-5 bg-gradient-to-b from-gold-400 to-gold-600 rounded-r" />
                红领巾讲解员
              </h3>
              <div className="space-y-3 max-h-[400px] overflow-y-auto scrollbar-hide pr-2">
                {guides.map((guide) => (
                  <div
                    key={guide.id}
                    className="bg-red-950/40 rounded-lg p-4 border border-gold-600/20 hover:border-gold-500/40 transition-all"
                  >
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 rounded-full bg-gradient-to-br from-gold-500 to-gold-600 flex items-center justify-center text-red-900 font-bold font-display text-lg shadow-glow-gold-sm">
                        {guide.name.charAt(0)}
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center gap-2">
                          <h4 className="text-gold-300 font-serif font-medium">
                            {guide.name}
                          </h4>
                          <span className="px-2 py-0.5 bg-gold-500/20 rounded text-gold-400 text-xs">
                            {guide.grade}
                          </span>
                        </div>
                        <div className="flex items-center gap-4 mt-1 text-xs">
                          <span className="flex items-center gap-1 text-gold-400/60">
                            <Clock className="w-3.5 h-3.5" />
                            服务 {guide.serviceHours} 小时
                          </span>
                          <span className="flex items-center gap-1 text-gold-400/60">
                            <Calendar className="w-3.5 h-3.5" />
                            {formatDate(guide.joinDate)} 加入
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
