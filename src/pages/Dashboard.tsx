import { useApp } from '@/context/AppContext';
import { currentUser, users } from '@/data/mockData';
import { ArrowUp, ArrowDown, ChevronRight, TrendingUp } from 'lucide-react';
import { motion } from 'framer-motion';
import { PieChart, Pie, Cell, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

const fadeInUp = { initial: { opacity: 0, y: 20 }, animate: { opacity: 1, y: 0 }, transition: { duration: 0.3, ease: [0.25, 0.46, 0.45, 0.94] } };
const staggerContainer = { animate: { transition: { staggerChildren: 0.08 } } };

const maturityTrendData = [
  { month: 'Jan', ea: 2.1, ba: 2.4, dt: 1.8, gov: 2.6 },
  { month: 'Feb', ea: 2.2, ba: 2.5, dt: 1.9, gov: 2.6 },
  { month: 'Mar', ea: 2.3, ba: 2.5, dt: 2.0, gov: 2.7 },
  { month: 'Apr', ea: 2.4, ba: 2.6, dt: 2.1, gov: 2.8 },
  { month: 'May', ea: 2.5, ba: 2.7, dt: 2.2, gov: 2.9 },
  { month: 'Jun', ea: 2.6, ba: 2.8, dt: 2.3, gov: 3.1 },
];

const chartColors = ['#2563EB', '#10B981', '#F59E0B', '#8B5CF6'];

export function Dashboard() {
  const { state, navigate } = useApp();
  const { events, results, recommendations, activityLogs, eventRespondents } = state.data;

  const activeEvents = events.filter(e => e.status === 'Open' || e.status === 'In Progress').length;
  const completedEvents = events.filter(e => e.status === 'Completed').length;
  const completionRate = events.length > 0 ? Math.round((completedEvents / events.length) * 100) : 0;
  const avgScore = results.length > 0 ? (results.reduce((sum, r) => sum + r.overallScore, 0) / results.length).toFixed(1) : '3.2';
  const openRecommendations = recommendations.filter(r => r.status === 'Draft' || r.status === 'Approved').length;
  const activeEventsList = events.filter(e => e.status === 'Open' || e.status === 'In Progress').slice(0, 4);
  const recentActivity = [...activityLogs].sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()).slice(0, 6);

  const getUserById = (id: string) => users.find(u => u.id === id);

  return (
    <div>
      <div className="mb-6">
        <h1 className="font-display text-4xl font-semibold text-[#0F172A] tracking-tight">Dashboard</h1>
        <p className="text-sm text-[#64748B] mt-1">Welcome back, {currentUser.name.split(' ')[0]}. Here&apos;s what&apos;s happening.</p>
      </div>

      <motion.div variants={staggerContainer} initial="initial" animate="animate" className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 mb-6">
        <motion.div variants={fadeInUp} className="bg-white rounded-xl border border-[#E2E8F0] shadow-layer1 p-5">
          <span className="text-[32px] font-bold text-[#0F172A]">{activeEvents}</span>
          <p className="text-xs text-[#64748B] mt-1 font-medium">Active Assessments</p>
          <div className="flex items-center gap-1 mt-2"><ArrowUp size={14} className="text-[#10B981]" /><span className="text-xs text-[#10B981] font-medium">+3 this month</span></div>
          <div className="flex items-end gap-1 mt-3 h-5">
            {[4, 6, 5, 8, 7, 9, 10, 12].map((h, i) => <div key={i} className="flex-1 rounded-sm bg-[#2563EB]" style={{ height: `${(h / 12) * 100}%`, opacity: 0.4 + (i / 8) * 0.6 }} />)}
          </div>
        </motion.div>

        <motion.div variants={fadeInUp} className="bg-white rounded-xl border border-[#E2E8F0] shadow-layer1 p-5">
          <div className="flex items-center gap-4">
            <div>
              <span className="text-[32px] font-bold text-[#0F172A]">{completionRate}%</span>
              <p className="text-xs text-[#64748B] mt-1 font-medium">Avg. Completion Rate</p>
              <div className="flex items-center gap-1 mt-2"><ArrowUp size={14} className="text-[#10B981]" /><span className="text-xs text-[#10B981] font-medium">+12% vs last quarter</span></div>
            </div>
            <div className="ml-auto">
              <ResponsiveContainer width={48} height={48}><PieChart><Pie data={[{ value: completionRate }, { value: 100 - completionRate }]} cx="50%" cy="50%" innerRadius={14} outerRadius={22} dataKey="value"><Cell fill="#2563EB" /><Cell fill="#E2E8F0" /></Pie></PieChart></ResponsiveContainer>
            </div>
          </div>
        </motion.div>

        <motion.div variants={fadeInUp} className="bg-white rounded-xl border border-[#E2E8F0] shadow-layer1 p-5">
          <span className="text-[32px] font-bold text-[#0F172A]">{avgScore}</span>
          <p className="text-xs text-[#64748B] mt-1 font-medium">Avg. Maturity Score</p>
          <div className="flex items-center gap-1 mt-2"><ArrowUp size={14} className="text-[#10B981]" /><span className="text-xs text-[#10B981] font-medium">+0.4</span></div>
          <div className="flex gap-1 mt-3">
            {[1, 2, 3, 4, 5].map(level => <div key={level} className={`flex-1 h-2 rounded-full ${level <= 3 ? 'bg-[#2563EB]' : 'bg-[#E2E8F0]'}`} />)}
          </div>
          <p className="text-[10px] text-[#64748B] mt-1">Level 3: Defined</p>
        </motion.div>

        <motion.div variants={fadeInUp} className="bg-white rounded-xl border border-[#E2E8F0] shadow-layer1 p-5">
          <span className="text-[32px] font-bold text-[#0F172A]">{openRecommendations}</span>
          <p className="text-xs text-[#64748B] mt-1 font-medium">Open Recommendations</p>
          <div className="flex items-center gap-1 mt-2"><ArrowDown size={14} className="text-[#10B981]" /><span className="text-xs text-[#10B981] font-medium">-5 this month</span></div>
          <div className="flex gap-0.5 mt-3 h-3 rounded-full overflow-hidden">
            <div className="bg-[#EF4444]" style={{ width: `${(8 / Math.max(openRecommendations, 1)) * 100}%` }} />
            <div className="bg-[#F59E0B]" style={{ width: `${(10 / Math.max(openRecommendations, 1)) * 100}%` }} />
            <div className="bg-[#2563EB]" style={{ width: `${(6 / Math.max(openRecommendations, 1)) * 100}%` }} />
          </div>
        </motion.div>
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
        <motion.div variants={fadeInUp} initial="initial" animate="animate" transition={{ delay: 0.3 }} className="lg:col-span-2 bg-white rounded-xl border border-[#E2E8F0] shadow-layer1">
          <div className="flex items-center justify-between px-6 py-4 border-b border-[#F1F5F9]">
            <h2 className="text-lg font-semibold text-[#0F172A]">Active Assessment Events</h2>
            <button onClick={() => navigate('assessments')} className="btn-text text-xs">View All</button>
          </div>
          <div className="divide-y divide-[#F1F5F9]">
            {activeEventsList.length === 0 && <p className="text-sm text-[#64748B] text-center py-8">No active events</p>}
            {activeEventsList.map(event => {
              const evRespondents = eventRespondents.filter(er => er.eventId === event.id);
              const completedCount = evRespondents.filter(er => er.status === 'Submitted' || er.status === 'Accepted').length;
              const progress = evRespondents.length > 0 ? Math.round(evRespondents.reduce((sum, er) => sum + er.progressPercentage, 0) / evRespondents.length) : 0;
              return (
                <button key={event.id} onClick={() => navigate('event-detail', { eventId: event.id })} className="w-full flex items-center gap-4 px-6 py-4 hover:bg-[#F8FAFC] transition-colors group text-left">
                  <div className={`w-2 h-2 rounded-full flex-shrink-0 ${event.status === 'Open' ? 'bg-[#10B981]' : event.status === 'In Progress' ? 'bg-[#F59E0B]' : 'bg-[#2563EB]'}`} />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-[#0F172A] truncate">{event.eventName}</p>
                    <p className="text-xs text-[#64748B]">{completedCount}/{evRespondents.length} completed</p>
                  </div>
                  <div className="w-32 flex-shrink-0">
                    <div className="h-1.5 bg-[#E2E8F0] rounded-full overflow-hidden"><div className="h-full bg-[#2563EB] rounded-full transition-all" style={{ width: `${progress}%` }} /></div>
                    <p className="text-[10px] text-[#64748B] mt-1 text-right">{progress}%</p>
                  </div>
                  <span className="text-xs text-[#64748B] flex-shrink-0">Due {new Date(event.endDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}</span>
                  <ChevronRight size={16} className="text-[#CBD5E1] group-hover:text-[#64748B] transition-colors flex-shrink-0" />
                </button>
              );
            })}
          </div>
        </motion.div>

        <motion.div variants={fadeInUp} initial="initial" animate="animate" transition={{ delay: 0.4 }} className="bg-white rounded-xl border border-[#E2E8F0] shadow-layer1">
          <div className="px-6 py-4 border-b border-[#F1F5F9]"><h2 className="text-lg font-semibold text-[#0F172A]">Recent Activity</h2></div>
          <div className="p-4">
            <div className="relative">
              <div className="absolute left-[11px] top-2 bottom-2 w-[2px] bg-[#E2E8F0]" />
              {recentActivity.map((activity, i) => {
                const user = getUserById(activity.userId);
                const actionColors: Record<string, string> = { Submitted: 'bg-[#10B981]', Completed: 'bg-[#10B981]', Created: 'bg-[#2563EB]', Launched: 'bg-[#2563EB]', Generated: 'bg-[#8B5CF6]', Converted: 'bg-[#F59E0B]' };
                return (
                  <motion.div key={activity.id} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.5 + i * 0.05 }} className="relative flex gap-3 mb-4 last:mb-0">
                    <div className={`w-6 h-6 rounded-full ${actionColors[activity.action] || 'bg-[#94A3B8]'} flex items-center justify-center flex-shrink-0 relative z-10`}><div className="w-2 h-2 bg-white rounded-full" /></div>
                    <div className="flex-1 min-w-0 pt-0.5">
                      <p className="text-xs text-[#0F172A]"><span className="font-medium">{user?.name}</span> <span className="text-[#64748B]">{activity.action.toLowerCase()}</span> {activity.entityType.toLowerCase()}</p>
                      <p className="text-[10px] text-[#94A3B8] mt-0.5">{new Date(activity.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })}</p>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          </div>
        </motion.div>
      </div>

      <motion.div variants={fadeInUp} initial="initial" animate="animate" transition={{ delay: 0.5 }} className="bg-white rounded-xl border border-[#E2E8F0] shadow-layer1 p-6">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-2"><TrendingUp size={18} className="text-[#64748B]" /><h2 className="text-lg font-semibold text-[#0F172A]">Maturity Score Trends</h2></div>
          <div className="flex items-center gap-1 bg-[#F8FAFC] rounded-lg p-0.5">
            {['Last 6 Months', 'Last Year', 'All Time'].map((range, i) => (
              <button key={range} className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors ${i === 0 ? 'bg-white text-[#0F172A] shadow-sm' : 'text-[#64748B] hover:text-[#0F172A]'}`}>{range}</button>
            ))}
          </div>
        </div>
        <ResponsiveContainer width="100%" height={320}>
          <LineChart data={maturityTrendData} margin={{ top: 5, right: 30, left: 0, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#F1F5F9" vertical={false} />
            <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{ fill: '#94A3B8', fontSize: 12 }} />
            <YAxis domain={[0, 5]} axisLine={false} tickLine={false} tick={{ fill: '#94A3B8', fontSize: 12 }} />
            <Tooltip contentStyle={{ fontSize: 12, borderRadius: 8, border: '1px solid #E2E8F0' }} />
            {['ea', 'ba', 'dt', 'gov'].map((key, i) => <Line key={key} type="monotone" dataKey={key} stroke={chartColors[i]} strokeWidth={2} dot={{ r: 4, fill: chartColors[i] }} activeDot={{ r: 6 }} />)}
          </LineChart>
        </ResponsiveContainer>
        <div className="flex items-center justify-end gap-4 mt-4">
          {[{ label: 'Enterprise Architecture', color: '#2563EB' }, { label: 'Business Architecture', color: '#10B981' }, { label: 'Digital Transformation', color: '#F59E0B' }, { label: 'Governance', color: '#8B5CF6' }].map(item => (
            <div key={item.label} className="flex items-center gap-1.5"><div className="w-2.5 h-2.5 rounded-full" style={{ background: item.color }} /><span className="text-xs text-[#64748B]">{item.label}</span></div>
          ))}
        </div>
      </motion.div>
    </div>
  );
}
