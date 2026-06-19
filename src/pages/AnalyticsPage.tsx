import { useMemo } from 'react';
import { useApp } from '@/context/AppContext';
import { motion } from 'framer-motion';
import {
  TrendingUp, BarChart3, PieChart, ClipboardCheck,
  Target, Zap, ArrowUpRight, ArrowDownRight, Activity
} from 'lucide-react';

export function AnalyticsPage() {
  const { state } = useApp();
  const { events, templates, eventRespondents, results, sectionResults, sections, recommendations, tasks } = state.data;

  // Calculate metrics
  const activeEvents = events.filter(e => e.status === 'Open' || e.status === 'In Progress').length;
  const completedEvents = events.filter(e => e.status === 'Completed').length;
  const totalRespondents = eventRespondents.length;
  const submittedRespondents = eventRespondents.filter(er => er.status === 'Submitted').length;
  const completionRate = totalRespondents > 0 ? Math.round((submittedRespondents / totalRespondents) * 100) : 0;
  // Maturity trend by event
  const maturityTrend = useMemo(() => {
    return results
      .map(r => {
        const evt = events.find(e => e.id === r.eventId);
        return { date: r.generatedAt, score: r.overallScore, name: evt?.eventName || 'Unknown' };
      })
      .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
  }, [results, events]);

  // Section performance
  const sectionPerformance = useMemo(() => {
    const map: Record<string, { name: string; total: number; count: number }> = {};
    sectionResults.forEach(sr => {
      const sec = sections.find(s => s.id === sr.sectionId);
      const name = sec?.name || 'Unknown';
      if (!map[name]) map[name] = { name, total: 0, count: 0 };
      map[name].total += sr.actualScore;
      map[name].count += 1;
    });
    return Object.values(map).map(s => ({ name: s.name, avg: s.count > 0 ? s.total / s.count : 0 })).sort((a, b) => a.avg - b.avg);
  }, [sectionResults, sections]);

  // Status distribution
  const eventStatusDist = useMemo(() => {
    const map: Record<string, number> = {};
    events.forEach(e => { map[e.status] = (map[e.status] || 0) + 1; });
    return Object.entries(map).map(([status, count]) => ({ status, count }));
  }, [events]);

  // Recommendation status
  const recStatusDist = useMemo(() => {
    const map: Record<string, number> = {};
    recommendations.forEach(r => { map[r.status] = (map[r.status] || 0) + 1; });
    return Object.entries(map).map(([status, count]) => ({ status, count }));
  }, [recommendations]);

  // Task status
  const taskStatusDist = useMemo(() => {
    const map: Record<string, number> = {};
    tasks.forEach(t => { map[t.status] = (map[t.status] || 0) + 1; });
    return Object.entries(map).map(([status, count]) => ({ status, count }));
  }, [tasks]);

  // Top templates by usage
  const templateUsage = useMemo(() => {
    return templates.map(t => ({
      name: t.name,
      count: events.filter(e => e.templateId === t.id).length,
      type: t.type
    })).sort((a, b) => b.count - a.count);
  }, [templates, events]);

  const barColor = (val: number) => {
    if (val >= 3.5) return 'bg-emerald-400';
    if (val >= 2.5) return 'bg-blue-400';
    if (val >= 1.5) return 'bg-amber-400';
    return 'bg-red-400';
  };

  const statusColors: Record<string, string> = {
    'Open': 'bg-blue-400', 'In Progress': 'bg-amber-400', 'Completed': 'bg-emerald-400',
    'Scheduled': 'bg-purple-400', 'Draft': 'bg-gray-400', 'Submitted': 'bg-cyan-400',
    'Under Review': 'bg-indigo-400', 'Closed': 'bg-gray-300',
    'Active': 'bg-emerald-400', 'Inactive': 'bg-gray-400', 'Archived': 'bg-gray-300',
    'Not Started': 'bg-gray-400', 'Cancelled': 'bg-red-400',
    'Approved': 'bg-emerald-400', 'Converted to Task': 'bg-blue-400', 'Deferred': 'bg-amber-400', 'Rejected': 'bg-red-400',
  };

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-[#0F172A]">Analytics</h1>
        <p className="text-sm text-[#64748B] mt-1">Assessment performance insights and trends</p>
      </div>

      {/* Top KPIs */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        {[
          { label: 'Active Assessments', value: activeEvents, change: '+2', up: true, icon: Activity },
          { label: 'Completed', value: completedEvents, change: '+12%', up: true, icon: ClipboardCheck },
          { label: 'Completion Rate', value: `${completionRate}%`, change: completionRate > 60 ? '+5%' : '-3%', up: completionRate > 60, icon: Target },
          { label: 'Avg Score', value: results.length > 0 ? (results.reduce((s, r) => s + r.overallScore, 0) / results.length).toFixed(1) : '0.0', change: '+0.3', up: true, icon: Zap },
        ].map((kpi, i) => (
          <motion.div key={i} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }} className="bg-white border border-[#E2E8F0] rounded-xl p-4">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-medium text-[#64748B]">{kpi.label}</span>
              <kpi.icon size={16} className="text-[#94A3B8]" />
            </div>
            <div className="text-2xl font-bold text-[#0F172A]">{kpi.value}</div>
            <div className={`flex items-center gap-1 text-xs mt-1 ${kpi.up ? 'text-emerald-600' : 'text-red-600'}`}>
              {kpi.up ? <ArrowUpRight size={12} /> : <ArrowDownRight size={12} />} {kpi.change} vs last period
            </div>
          </motion.div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Section Performance */}
        <div className="bg-white border border-[#E2E8F0] rounded-xl p-5">
          <h3 className="text-sm font-semibold text-[#0F172A] mb-4 flex items-center gap-2"><BarChart3 size={16} /> Section Performance</h3>
          <div className="space-y-3">
            {sectionPerformance.map((sec, i) => (
              <div key={i}>
                <div className="flex items-center justify-between mb-1">
                  <span className="text-xs font-medium text-[#334155] truncate max-w-[60%]">{sec.name}</span>
                  <span className="text-xs text-[#64748B]">{sec.avg.toFixed(1)}/5</span>
                </div>
                <div className="h-2.5 bg-[#F1F5F9] rounded-full overflow-hidden">
                  <motion.div initial={{ width: 0 }} animate={{ width: `${(sec.avg / 5) * 100}%` }} transition={{ duration: 0.6, delay: i * 0.05 }} className={`h-full rounded-full ${barColor(sec.avg)}`} />
                </div>
              </div>
            ))}
            {sectionPerformance.length === 0 && <p className="text-xs text-[#94A3B8] text-center py-4">No section data available</p>}
          </div>
        </div>

        {/* Maturity Trend */}
        <div className="bg-white border border-[#E2E8F0] rounded-xl p-5">
          <h3 className="text-sm font-semibold text-[#0F172A] mb-4 flex items-center gap-2"><TrendingUp size={16} /> Maturity Trend</h3>
          {maturityTrend.length > 0 ? (
            <div className="flex items-end gap-2 h-40">
              {maturityTrend.map((pt, i) => (
                <div key={i} className="flex-1 flex flex-col items-center gap-1">
                  <div className="text-[9px] text-[#64748B] font-medium">{pt.score.toFixed(1)}</div>
                  <div className="w-full flex justify-center">
                    <motion.div
                      initial={{ height: 0 }}
                      animate={{ height: `${(pt.score / 5) * 120}px` }}
                      transition={{ duration: 0.5, delay: i * 0.1 }}
                      className={`w-full max-w-[40px] rounded-t-lg ${barColor(pt.score)}`}
                    />
                  </div>
                  <div className="text-[8px] text-[#94A3B8] truncate max-w-[60px] text-center">{pt.name.substring(0, 12)}</div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-xs text-[#94A3B8] text-center py-4">Complete assessments to see maturity trends</p>
          )}
        </div>

        {/* Event Status Distribution */}
        <div className="bg-white border border-[#E2E8F0] rounded-xl p-5">
          <h3 className="text-sm font-semibold text-[#0F172A] mb-4 flex items-center gap-2"><PieChart size={16} /> Event Status</h3>
          <div className="space-y-2">
            {eventStatusDist.map((item, i) => (
              <div key={i} className="flex items-center gap-3">
                <span className="text-xs text-[#334155] w-24">{item.status}</span>
                <div className="flex-1 h-3 bg-[#F1F5F9] rounded-full overflow-hidden">
                  <motion.div initial={{ width: 0 }} animate={{ width: `${(item.count / events.length) * 100}%` }} transition={{ duration: 0.5, delay: i * 0.05 }} className={`h-full rounded-full ${statusColors[item.status] || 'bg-gray-400'}`} />
                </div>
                <span className="text-xs font-medium text-[#334155] w-6 text-right">{item.count}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Template Usage */}
        <div className="bg-white border border-[#E2E8F0] rounded-xl p-5">
          <h3 className="text-sm font-semibold text-[#0F172A] mb-4 flex items-center gap-2"><ClipboardCheck size={16} /> Template Usage</h3>
          <div className="space-y-2">
            {templateUsage.map((t, i) => (
              <div key={i} className="flex items-center gap-3">
                <span className="text-xs text-[#334155] truncate flex-1">{t.name}</span>
                <span className="text-[10px] px-2 py-0.5 rounded-full bg-[#F1F5F9] text-[#64748B]">{t.type}</span>
                <div className="w-16 h-2 bg-[#F1F5F9] rounded-full overflow-hidden">
                  <motion.div initial={{ width: 0 }} animate={{ width: `${Math.min((t.count / Math.max(...templateUsage.map(x => x.count))) * 100, 100)}%` }} transition={{ duration: 0.5, delay: i * 0.05 }} className="h-full rounded-full bg-[#2563EB]" />
                </div>
                <span className="text-xs font-medium text-[#334155] w-4 text-right">{t.count}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Recommendations & Tasks */}
        <div className="bg-white border border-[#E2E8F0] rounded-xl p-5">
          <h3 className="text-sm font-semibold text-[#0F172A] mb-4">Recommendations Status</h3>
          <div className="space-y-2">
            {recStatusDist.map((item, i) => (
              <div key={i} className="flex items-center gap-3">
                <span className="text-xs text-[#334155] w-32">{item.status}</span>
                <div className="flex-1 h-3 bg-[#F1E5F9] rounded-full overflow-hidden">
                  <motion.div initial={{ width: 0 }} animate={{ width: `${(item.count / recommendations.length) * 100}%` }} transition={{ duration: 0.5, delay: i * 0.05 }} className={`h-full rounded-full ${statusColors[item.status] || 'bg-gray-400'}`} />
                </div>
                <span className="text-xs font-medium text-[#334155] w-6 text-right">{item.count}</span>
              </div>
            ))}
            {recStatusDist.length === 0 && <p className="text-xs text-[#94A3B8] text-center py-4">No recommendations yet</p>}
          </div>
        </div>

        <div className="bg-white border border-[#E2E8F0] rounded-xl p-5">
          <h3 className="text-sm font-semibold text-[#0F172A] mb-4">Task Overview</h3>
          <div className="space-y-2">
            {taskStatusDist.map((item, i) => (
              <div key={i} className="flex items-center gap-3">
                <span className="text-xs text-[#334155] w-24">{item.status}</span>
                <div className="flex-1 h-3 bg-[#F1E5F9] rounded-full overflow-hidden">
                  <motion.div initial={{ width: 0 }} animate={{ width: `${(item.count / tasks.length) * 100}%` }} transition={{ duration: 0.5, delay: i * 0.05 }} className={`h-full rounded-full ${statusColors[item.status] || 'bg-gray-400'}`} />
                </div>
                <span className="text-xs font-medium text-[#334155] w-6 text-right">{item.count}</span>
              </div>
            ))}
            {taskStatusDist.length === 0 && <p className="text-xs text-[#94A3B8] text-center py-4">No tasks yet</p>}
          </div>
          <div className="mt-4 pt-4 border-t border-[#F1E5F9] grid grid-cols-2 gap-4">
            <div className="text-center">
              <div className="text-xl font-bold text-[#0F172A]">{tasks.length}</div>
              <div className="text-[10px] text-[#64748B]">Total Tasks</div>
            </div>
            <div className="text-center">
              <div className="text-xl font-bold text-emerald-600">{tasks.filter(t => t.status === 'Completed').length}</div>
              <div className="text-[10px] text-[#64748B]">Completed</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
