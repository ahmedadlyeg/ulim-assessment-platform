import { useState } from 'react';
import { useApp } from '@/context/AppContext';
import { users } from '@/data/mockData';
import { FileText, Users, ClipboardCheck, Paperclip, BarChart3, Lightbulb, CheckSquare, Clock, Download, Send, Eye, CheckCircle, ArrowUp } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { RadarChart, Radar, PolarGrid, PolarAngleAxis, PolarRadiusAxis, BarChart as ReBarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, PieChart, Pie, Cell, ResponsiveContainer } from 'recharts';

const tabs = [
  { id: 'overview', label: 'Overview', icon: FileText },
  { id: 'respondents', label: 'Respondents', icon: Users },
  { id: 'submissions', label: 'Submissions', icon: ClipboardCheck },
  { id: 'evidence', label: 'Evidence', icon: Paperclip },
  { id: 'results', label: 'Results', icon: BarChart3 },
  { id: 'recommendations', label: 'Recommendations', icon: Lightbulb },
  { id: 'tasks', label: 'Tasks', icon: CheckSquare },
  { id: 'activity', label: 'Activity Log', icon: Clock },
];

const statusClasses: Record<string, string> = { Open: 'status-badge-active', 'In Progress': 'status-badge-in-progress', Completed: 'status-badge-completed', Scheduled: 'status-badge-draft', Draft: 'status-badge-draft', Closed: 'status-badge-closed', Cancelled: 'status-badge-cancelled' };
const recStatusClasses: Record<string, string> = { Draft: 'status-badge-draft', Approved: 'status-badge-active', 'Converted to Task': 'status-badge-completed', Deferred: 'status-badge-closed', Rejected: 'status-badge-cancelled' };

export function EventDetail() {
  const { state, dispatch, openModal, addToast } = useApp();
  const [activeTab, setActiveTab] = useState('overview');

  const event = state.ui.selectedEventId ? state.data.events.find(e => e.id === state.ui.selectedEventId) : state.data.events[0];
  if (!event) return <div className="text-center py-20 text-[#64748B]">No event selected</div>;

  const template = state.data.templates.find(t => t.id === event.templateId);
  const category = state.data.categories.find(c => c.id === template?.categoryId);
  const assessor = users.find(u => u.id === event.assessorId);
  const owner = users.find(u => u.id === event.ownerId);
  const eventResult = state.data.results.find(r => r.eventId === event.id);
  const eventRespondentsList = state.data.eventRespondents.filter(er => er.eventId === event.id);
  const eventRecommendations = state.data.recommendations.filter(r => r.eventId === event.id);
  const eventTasks = state.data.tasks.filter(t => t.sourceEventId === event.id);
  const eventActivities = state.data.activityLogs.filter(a => a.eventId === event.id);
  const completedCount = eventRespondentsList.filter(er => er.status === 'Submitted' || er.status === 'Accepted').length;
  const progress = eventRespondentsList.length > 0 ? Math.round(eventRespondentsList.reduce((sum, er) => sum + er.progressPercentage, 0) / eventRespondentsList.length) : 0;
  const eventSections = template ? state.data.sections.filter(s => s.templateId === template.id) : [];
  const eventSectionResults = eventResult ? state.data.sectionResults.filter(sr => sr.resultId === eventResult.id) : [];

  const radarData = eventSections.map(s => {
    const sr = eventSectionResults.find(r => r.sectionId === s.id);
    return { section: s.name.split(' ').slice(0, 2).join(' '), actual: sr ? sr.actualScore : 0, target: sr ? sr.targetScore : 4.0 };
  });
  const barData = eventSections.map(s => {
    const sr = eventSectionResults.find(r => r.sectionId === s.id);
    return { section: s.name.split(' ').slice(0, 2).join(' '), score: sr ? sr.actualScore : 0, target: sr ? sr.targetScore : 4.0, gap: sr ? sr.gapScore : 4.0 };
  });

  const handleCloseEvent = () => {
    dispatch({ type: 'UPDATE_EVENT', payload: { ...event, status: 'Closed' } });
    addToast({ type: 'success', title: 'Event Closed', message: `Assessment event has been closed.` });
  };

  const handleLaunch = () => {
    dispatch({ type: 'UPDATE_EVENT', payload: { ...event, status: 'Open' } });
    addToast({ type: 'success', title: 'Event Launched', message: `Assessment event is now open for responses.` });
  };

  return (
    <div>
      <div className="flex items-start justify-between mb-4">
        <div>
          <div className="flex items-center gap-3 mb-1">
            <h1 className="font-display text-3xl font-semibold text-[#0F172A] tracking-tight">{event.eventName}</h1>
            <span className={`status-badge text-xs ${statusClasses[event.status] || 'status-badge-draft'}`}>{event.status}</span>
          </div>
          <p className="text-sm text-[#64748B]">{template?.name} — v{event.templateVersion}</p>
        </div>
        <div className="flex items-center gap-2">
          {event.status === 'Draft' && <button onClick={handleLaunch} className="btn-primary text-sm h-9"><Send size={14} className="mr-1.5" />Launch</button>}
          {event.status === 'Open' && <button onClick={handleCloseEvent} className="btn-danger text-sm h-9">Close Event</button>}
        </div>
      </div>

      <div className="bg-white rounded-lg border border-[#E2E8F0] shadow-layer1 px-4 py-3 flex items-center gap-6 mb-6 flex-wrap">
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-full bg-[#2563EB] flex items-center justify-center text-white text-xs font-medium">{assessor?.name.split(' ').map(n => n[0]).join('')}</div>
          <span className="text-xs text-[#64748B]">{assessor?.name}</span>
        </div>
        <span className="text-xs text-[#64748B]"><span className="font-medium text-[#0F172A]">Start:</span> {new Date(event.startDate).toLocaleDateString()}</span>
        <span className="text-xs text-[#64748B]"><span className="font-medium text-[#0F172A]">End:</span> {new Date(event.endDate).toLocaleDateString()}</span>
        <div className="flex items-center gap-2">
          <div className="w-24 h-1.5 bg-[#E2E8F0] rounded-full overflow-hidden"><div className="h-full bg-[#2563EB] rounded-full" style={{ width: `${progress}%` }} /></div>
          <span className="text-xs text-[#64748B]">{progress}%</span>
        </div>
        <span className="text-xs text-[#64748B] ml-auto">{completedCount}/{eventRespondentsList.length} completed</span>
      </div>

      <div className="flex gap-0 border-b-2 border-[#E2E8F0] mb-6 overflow-x-auto">
        {tabs.map(tab => (
          <button key={tab.id} onClick={() => setActiveTab(tab.id)} className={`flex items-center gap-2 px-4 py-3 text-sm font-medium whitespace-nowrap transition-colors relative -mb-[2px] ${activeTab === tab.id ? 'text-[#2563EB] border-b-2 border-[#2563EB]' : 'text-[#64748B] hover:text-[#0F172A] hover:bg-[#F8FAFC]'}`}>
            <tab.icon size={16} />{tab.label}
          </button>
        ))}
      </div>

      <AnimatePresence mode="wait">
        <motion.div key={activeTab} initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.2 }}>
          {activeTab === 'overview' && <OverviewTab event={event} template={template} category={category} owner={owner} assessor={assessor} eventResult={eventResult} eventRespondentsList={eventRespondentsList} completedCount={completedCount} progress={progress} openModal={openModal} eventId={event.id} />}
          {activeTab === 'respondents' && <RespondentsTab eventRespondentsList={eventRespondentsList} openModal={openModal} eventId={event.id} />}
          {activeTab === 'submissions' && <SubmissionsTab eventRespondentsList={eventRespondentsList} responses={state.data.responses} evidence={state.data.evidence} />}
          {activeTab === 'evidence' && <EvidenceTab evidence={state.data.evidence} />}
          {activeTab === 'results' && <ResultsTab eventResult={eventResult} eventSections={eventSections} eventSectionResults={eventSectionResults} radarData={radarData} barData={barData} />}
          {activeTab === 'recommendations' && <RecommendationsTabContent eventRecommendations={eventRecommendations} sections={state.data.sections} openModal={openModal} dispatch={dispatch} addToast={addToast} />}
          {activeTab === 'tasks' && <TasksTab eventTasks={eventTasks} />}
          {activeTab === 'activity' && <ActivityTab eventActivities={eventActivities} />}
        </motion.div>
      </AnimatePresence>
    </div>
  );
}

function OverviewTab({ event, template, category, owner, assessor, eventRespondentsList, completedCount, progress, openModal, eventId }: any) {
  const notStartedCount = eventRespondentsList.filter((er: any) => er.status === 'Not Started').length;
  const inProgressCount = eventRespondentsList.filter((er: any) => er.status === 'In Progress').length;
  return (
    <div className="space-y-5">
      <div className="bg-white rounded-xl border border-[#E2E8F0] shadow-layer1 p-6">
        <h3 className="text-base font-semibold text-[#0F172A] mb-4">Event Information</h3>
        <div className="grid grid-cols-2 gap-x-8 gap-y-3">
          {[{ label: 'Event Name', value: event.eventName }, { label: 'Assessment Template', value: template?.name }, { label: 'Category', value: category?.name }, { label: 'Type', value: template?.type }, { label: 'Owner', value: owner?.name }, { label: 'Assessor', value: assessor?.name }, { label: 'Target Department', value: event.targetDepartment }, { label: 'Target Audience', value: event.targetAudience }, { label: 'Start Date', value: new Date(event.startDate).toLocaleDateString() }, { label: 'End Date', value: new Date(event.endDate).toLocaleDateString() }, { label: 'Created', value: new Date(event.createdAt).toLocaleDateString() }, { label: 'Status', value: event.status }].map(item => (
            <div key={item.label}><span className="text-xs text-[#64748B]">{item.label}</span><p className="text-sm font-medium text-[#0F172A]">{item.value || '—'}</p></div>
          ))}
        </div>
        <div className="mt-4 pt-4 border-t border-[#F1F5F9]"><span className="text-xs text-[#64748B]">Instructions</span><p className="text-sm text-[#0F172A] mt-1">{event.instructions}</p></div>
      </div>
      <div className="bg-white rounded-xl border border-[#E2E8F0] shadow-layer1 p-6">
        <h3 className="text-base font-semibold text-[#0F172A] mb-4">Progress Overview</h3>
        <div className="flex items-center gap-8">
          <div className="flex-shrink-0">
            <ResponsiveContainer width={120} height={120}><PieChart><Pie data={[{ value: completedCount }, { value: inProgressCount }, { value: notStartedCount }]} cx="50%" cy="50%" innerRadius={35} outerRadius={55} dataKey="value"><Cell fill="#10B981" /><Cell fill="#F59E0B" /><Cell fill="#E2E8F0" /></Pie></PieChart></ResponsiveContainer>
            <p className="text-center text-lg font-bold text-[#0F172A] -mt-6">{progress}%</p>
          </div>
          <div className="flex-1 grid grid-cols-2 gap-4">
            <div className="flex items-center gap-2"><div className="w-2.5 h-2.5 rounded-full bg-[#2563EB]" /><span className="text-sm text-[#64748B]">{eventRespondentsList.length} Assigned</span></div>
            <div className="flex items-center gap-2"><div className="w-2.5 h-2.5 rounded-full bg-[#10B981]" /><span className="text-sm text-[#64748B]">{completedCount} Completed</span></div>
            <div className="flex items-center gap-2"><div className="w-2.5 h-2.5 rounded-full bg-[#F59E0B]" /><span className="text-sm text-[#64748B]">{inProgressCount} In Progress</span></div>
            <div className="flex items-center gap-2"><div className="w-2.5 h-2.5 rounded-full bg-[#E2E8F0]" /><span className="text-sm text-[#64748B]">{notStartedCount} Not Started</span></div>
          </div>
        </div>
      </div>
      <div className="flex gap-3">
        <button onClick={() => openModal('send-reminder', { eventId })} className="btn-secondary text-sm"><Send size={14} className="mr-1.5" />Send Reminder</button>
        <button onClick={() => { alert('Results exported to PDF/Excel (demo)'); }} className="btn-secondary text-sm"><Download size={14} className="mr-1.5" />Export Results</button>
      </div>
    </div>
  );
}

function RespondentsTab({ eventRespondentsList, openModal, eventId }: any) {
  const statusMap: Record<string, string> = { 'Not Started': 'status-badge-draft', 'In Progress': 'status-badge-in-progress', Submitted: 'status-badge-submitted', Accepted: 'status-badge-completed' };
  return (
    <div className="bg-white rounded-xl border border-[#E2E8F0] shadow-layer1">
      <div className="flex items-center justify-between px-6 py-4 border-b border-[#F1F5F9]">
        <h3 className="text-base font-semibold text-[#0F172A]">Respondents</h3>
        <button onClick={() => openModal('add-respondent', { eventId })} className="btn-primary text-xs h-8"><Send size={12} className="mr-1" />Add Respondents</button>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead><tr className="border-b-2 border-[#E2E8F0] bg-[#F8FAFC]">{['Respondent', 'Department', 'Status', 'Progress', 'Started', 'Submitted', 'Actions'].map(h => <th key={h} className="text-left text-xs font-semibold text-[#64748B] uppercase px-4 py-3">{h}</th>)}</tr></thead>
          <tbody>
            {eventRespondentsList.map((er: any) => {
              const user = users.find(u => u.id === er.respondentId);
              return (
                <tr key={er.id} className="border-b border-[#F1F5F9] hover:bg-[#F8FAFC] transition-colors">
                  <td className="px-4 py-3"><div className="flex items-center gap-2"><div className="w-7 h-7 rounded-full bg-[#2563EB] flex items-center justify-center text-white text-xs font-medium">{user?.name.split(' ').map(n => n[0]).join('')}</div><span className="text-sm text-[#0F172A]">{user?.name}</span></div></td>
                  <td className="px-4 py-3 text-sm text-[#64748B]">{user?.department}</td>
                  <td className="px-4 py-3"><span className={`status-badge text-[10px] py-0.5 px-2 ${statusMap[er.status] || 'status-badge-draft'}`}>{er.status}</span></td>
                  <td className="px-4 py-3"><div className="flex items-center gap-2"><div className="w-20 h-1.5 bg-[#E2E8F0] rounded-full overflow-hidden"><div className="h-full bg-[#2563EB] rounded-full" style={{ width: `${er.progressPercentage}%` }} /></div><span className="text-xs text-[#64748B]">{er.progressPercentage}%</span></div></td>
                  <td className="px-4 py-3 text-xs text-[#64748B]">{er.startedAt ? new Date(er.startedAt).toLocaleDateString() : '—'}</td>
                  <td className="px-4 py-3 text-xs text-[#64748B]">{er.submittedAt ? new Date(er.submittedAt).toLocaleDateString() : '—'}</td>
                  <td className="px-4 py-3"><button className="btn-ghost h-7 w-7"><Eye size={14} /></button></td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function SubmissionsTab({ eventRespondentsList, responses, evidence }: any) {
  return (
    <div className="bg-white rounded-xl border border-[#E2E8F0] shadow-layer1">
      <div className="px-6 py-4 border-b border-[#F1F5F9]"><h3 className="text-base font-semibold text-[#0F172A]">Submissions</h3></div>
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead><tr className="border-b-2 border-[#E2E8F0] bg-[#F8FAFC]">{['Respondent', 'Status', 'Completion', 'Submitted', 'Evidence', 'Actions'].map(h => <th key={h} className="text-left text-xs font-semibold text-[#64748B] uppercase px-4 py-3">{h}</th>)}</tr></thead>
          <tbody>
            {eventRespondentsList.filter((er: any) => er.status !== 'Not Started').map((er: any) => {
              const user = users.find(u => u.id === er.respondentId);
              const evCount = evidence.filter((e: any) => responses.some((r: any) => r.respondentId === er.respondentId && r.id === e.responseId)).length;
              return (
                <tr key={er.id} className="border-b border-[#F1F5F9] hover:bg-[#F8FAFC] transition-colors">
                  <td className="px-4 py-3 text-sm text-[#0F172A]">{user?.name}</td>
                  <td className="px-4 py-3"><span className={`status-badge text-[10px] py-0.5 px-2 ${er.status === 'Submitted' ? 'status-badge-submitted' : er.status === 'Accepted' ? 'status-badge-completed' : 'status-badge-in-progress'}`}>{er.status}</span></td>
                  <td className="px-4 py-3 text-sm text-[#0F172A]">{er.progressPercentage}%</td>
                  <td className="px-4 py-3 text-xs text-[#64748B]">{er.submittedAt ? new Date(er.submittedAt).toLocaleDateString() : '—'}</td>
                  <td className="px-4 py-3 text-sm text-[#64748B]">{evCount}</td>
                  <td className="px-4 py-3"><button className="btn-ghost h-7 w-7"><Eye size={14} /></button></td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function EvidenceTab({ evidence }: { evidence: any[] }) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      {evidence.map((ev: any) => {
        const user = users.find(u => u.id === ev.uploadedBy);
        return (
          <div key={ev.id} className="bg-white rounded-xl border border-[#E2E8F0] shadow-layer1 p-4 flex items-start gap-4">
            <div className="w-12 h-12 rounded-lg bg-[#F8FAFC] flex items-center justify-center text-[#64748B] flex-shrink-0"><Paperclip size={24} /></div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-[#0F172A] truncate">{ev.fileName}</p>
              <p className="text-xs text-[#64748B] mt-1">Uploaded by {user?.name}</p>
              <p className="text-xs text-[#94A3B8]">{new Date(ev.uploadedAt).toLocaleDateString()}</p>
            </div>
            <button onClick={() => { /* download triggered */ }} className="btn-ghost h-8 w-8 flex-shrink-0"><Download size={14} /></button>
          </div>
        );
      })}
    </div>
  );
}

function ResultsTab({ eventResult, eventSections, eventSectionResults, radarData, barData }: any) {
  return (
    <div className="space-y-5">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white rounded-xl border border-[#E2E8F0] shadow-layer2 p-5">
          <p className="text-xs text-[#64748B] font-medium mb-2">Overall Score</p>
          <div className="flex items-baseline gap-1"><span className="text-[32px] font-bold text-[#0F172A]">{eventResult?.overallScore ?? '2.6'}</span><span className="text-lg text-[#94A3B8]">/5</span></div>
          <span className="status-badge status-badge-active text-[10px] py-0.5 px-2 mt-2">{eventResult?.maturityLevel ?? 'Level 3: Defined'}</span>
          <div className="mt-3 pt-3 border-t border-[#F1F5F9]"><div className="flex items-center justify-between text-xs"><span className="text-[#64748B]">Target: {eventResult?.targetScore ?? 4.0}</span><span className="text-[#EF4444] font-medium">Gap: -{eventResult?.gapScore ?? 1.4}</span></div></div>
        </div>
        <div className="md:col-span-2 bg-white rounded-xl border border-[#E2E8F0] shadow-layer2 p-5">
          <p className="text-xs text-[#64748B] font-medium mb-2">Section Scores</p>
          <ResponsiveContainer width="100%" height={120}><ReBarChart data={barData} barSize={20}><CartesianGrid strokeDasharray="3 3" stroke="#F1F5F9" vertical={false} /><XAxis dataKey="section" axisLine={false} tickLine={false} tick={{ fill: '#94A3B8', fontSize: 10 }} /><YAxis domain={[0, 5]} axisLine={false} tickLine={false} tick={{ fill: '#94A3B8', fontSize: 10 }} /><Tooltip contentStyle={{ fontSize: 12, borderRadius: 8 }} /><Bar dataKey="score" fill="#2563EB" radius={[4, 4, 0, 0]} /></ReBarChart></ResponsiveContainer>
        </div>
        <div className="bg-white rounded-xl border border-[#E2E8F0] shadow-layer2 p-5">
          <p className="text-xs text-[#64748B] font-medium mb-3">Top Strengths</p>
          {eventSectionResults.sort((a: any, b: any) => b.actualScore - a.actualScore).slice(0, 3).map((sr: any) => {
            const section = eventSections.find((s: any) => s.id === sr.sectionId);
            return <div key={sr.id} className="flex items-center gap-2 mb-2"><CheckCircle size={14} className="text-[#10B981] flex-shrink-0" /><span className="text-xs text-[#0F172A] truncate">{section?.name}</span><span className="text-xs text-[#10B981] font-medium ml-auto">{sr.actualScore}</span></div>;
          })}
          <div className="border-t border-[#F1F5F9] my-3" />
          <p className="text-xs text-[#64748B] font-medium mb-3">Improvement Areas</p>
          {eventSectionResults.sort((a: any, b: any) => a.actualScore - b.actualScore).slice(0, 3).map((sr: any) => {
            const section = eventSections.find((s: any) => s.id === sr.sectionId);
            return <div key={sr.id} className="flex items-center gap-2 mb-2"><ArrowUp size={14} className="text-[#EF4444] flex-shrink-0" /><span className="text-xs text-[#0F172A] truncate">{section?.name}</span><span className="text-xs text-[#EF4444] font-medium ml-auto">{sr.actualScore}</span></div>;
          })}
        </div>
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        <div className="bg-white rounded-xl border border-[#E2E8F0] shadow-layer1 p-6">
          <h3 className="text-base font-semibold text-[#0F172A] mb-4">Maturity Radar</h3>
          <ResponsiveContainer width="100%" height={300}><RadarChart data={radarData}><PolarGrid stroke="#E2E8F0" /><PolarAngleAxis dataKey="section" tick={{ fill: '#64748B', fontSize: 11 }} /><PolarRadiusAxis domain={[0, 5]} tick={{ fill: '#94A3B8', fontSize: 10 }} /><Radar name="Actual" dataKey="actual" stroke="#2563EB" fill="#2563EB" fillOpacity={0.1} strokeWidth={2} /><Radar name="Target" dataKey="target" stroke="#94A3B8" fill="#94A3B8" fillOpacity={0} strokeWidth={2} strokeDasharray="5 5" /><Tooltip contentStyle={{ fontSize: 12, borderRadius: 8 }} /></RadarChart></ResponsiveContainer>
        </div>
        <div className="bg-white rounded-xl border border-[#E2E8F0] shadow-layer1 p-6">
          <h3 className="text-base font-semibold text-[#0F172A] mb-4">Section Score Breakdown</h3>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead><tr className="border-b-2 border-[#E2E8F0]">{['Section', 'Score', 'Target', 'Gap', 'Severity'].map(h => <th key={h} className="text-left text-xs font-semibold text-[#64748B] uppercase pb-2 pr-4">{h}</th>)}</tr></thead>
              <tbody>
                {eventSectionResults.map((sr: any) => {
                  const section = eventSections.find((s: any) => s.id === sr.sectionId);
                  return <tr key={sr.id} className="border-b border-[#F1F5F9] hover:bg-[#F8FAFC]"><td className="py-2.5 pr-4 text-sm text-[#0F172A]">{section?.name}</td><td className="py-2.5 pr-4 text-sm font-medium text-[#0F172A]">{sr.actualScore}</td><td className="py-2.5 pr-4 text-sm text-[#64748B]">{sr.targetScore}</td><td className="py-2.5 pr-4 text-sm font-medium text-[#EF4444]">-{sr.gapScore}</td><td className="py-2.5"><span className={`status-badge text-[10px] py-0.5 px-2 status-badge-${sr.gapSeverity.toLowerCase()}`}>{sr.gapSeverity}</span></td></tr>;
                })}
              </tbody>
            </table>
          </div>
        </div>
      </div>
      <div className="bg-white rounded-xl border border-[#E2E8F0] shadow-layer1 p-6">
        <h3 className="text-base font-semibold text-[#0F172A] mb-3">Result Narrative</h3>
        <p className="text-sm text-[#0F172A] leading-relaxed">
          The overall EA maturity score is <span className="text-[#2563EB] font-medium">{eventResult?.overallScore ?? 2.6} out of 5</span>, which indicates a <span className="text-[#2563EB] font-medium">Defined but not fully managed</span> capability. The highest gap appears in <span className="text-[#EF4444] font-medium">Stakeholder Engagement</span> and <span className="text-[#EF4444] font-medium">Repository Management</span>. Strengths include EA Operating Model and Framework & Methodology.
        </p>
      </div>
    </div>
  );
}

function RecommendationsTabContent({ eventRecommendations, sections, openModal, dispatch, addToast }: any) {
  const priorityClasses: Record<string, string> = { High: 'status-badge-high', Medium: 'status-badge-medium', Low: 'status-badge-low' };
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-base font-semibold text-[#0F172A]">Recommendations</h3>
        <div className="flex gap-2">
          <button onClick={() => { eventRecommendations.forEach((r: any) => { if (r.status === 'Draft') dispatch({ type: 'UPDATE_RECOMMENDATION', payload: { ...r, status: 'Approved' } }); }); addToast({ type: 'success', title: 'Generated', message: 'All recommendations approved.' }); }} className="btn-secondary text-xs h-8"><Lightbulb size={12} className="mr-1" />Approve All</button>
        </div>
      </div>
      {eventRecommendations.map((rec: any) => {
        const section = sections.find((s: any) => s.id === rec.sectionId);
        const owner = users.find(u => u.id === rec.suggestedOwnerId);
        return (
          <div key={rec.id} className="bg-white rounded-xl border border-[#E2E8F0] shadow-layer1 p-5">
            <div className="flex items-start justify-between mb-3">
              <div className="flex items-center gap-2 flex-wrap">
                <span className={`status-badge text-[10px] py-0.5 px-2 ${priorityClasses[rec.priority]}`}>{rec.priority}</span>
                <span className={`status-badge text-[10px] py-0.5 px-2 status-badge-${rec.gapSeverity.toLowerCase()}`}>{rec.gapSeverity}</span>
                <span className={`status-badge text-[10px] py-0.5 px-2 ${recStatusClasses[rec.status] || 'status-badge-draft'}`}>{rec.status}</span>
              </div>
              <span className="text-xs text-[#94A3B8]">{new Date(rec.createdAt).toLocaleDateString()}</span>
            </div>
            <h4 className="text-sm font-semibold text-[#0F172A] mb-2">{rec.title}</h4>
            <p className="text-xs text-[#64748B] line-clamp-3 mb-3">{rec.description}</p>
            <div className="flex items-center gap-4 text-xs text-[#64748B] mb-3">
              <span>Section: {section?.name}</span>
              <span>Owner: {owner?.name || 'Unassigned'}</span>
              {rec.suggestedDueDate && <span>Due: {new Date(rec.suggestedDueDate).toLocaleDateString()}</span>}
            </div>
            <div className="flex gap-2">
              {rec.status === 'Draft' && <button onClick={() => { dispatch({ type: 'UPDATE_RECOMMENDATION', payload: { ...rec, status: 'Approved' } }); addToast({ type: 'success', title: 'Approved', message: 'Recommendation approved.' }); }} className="btn-secondary text-xs h-7 px-2">Approve</button>}
              {rec.status !== 'Converted to Task' && rec.status !== 'Completed' && <button onClick={() => openModal('convert-to-task', { recommendationId: rec.id })} className="btn-primary text-xs h-7 px-2"><CheckSquare size={12} className="mr-1" />Convert to Task</button>}
              {rec.linkedTaskId && <button onClick={() => addToast({ type: 'info', title: 'Task', message: 'Linked task: ' + rec.linkedTaskId.substring(0, 8) })} className="btn-text text-xs h-7 px-2">View Task</button>}
              <button onClick={() => { if (confirm('Delete this recommendation?')) { dispatch({ type: 'DELETE_RECOMMENDATION', id: rec.id }); addToast({ type: 'success', title: 'Deleted', message: 'Recommendation deleted.' }); } }} className="btn-ghost text-xs h-7 px-2 text-[#EF4444]">Delete</button>
            </div>
          </div>
        );
      })}
    </div>
  );
}

function TasksTab({ eventTasks }: { eventTasks: any[] }) {
  const taskStatusClasses: Record<string, string> = { 'Not Started': 'status-badge-draft', 'In Progress': 'status-badge-in-progress', Completed: 'status-badge-completed', Cancelled: 'status-badge-cancelled' };
  return (
    <div className="bg-white rounded-xl border border-[#E2E8F0] shadow-layer1">
      <div className="px-6 py-4 border-b border-[#F1F5F9]"><h3 className="text-base font-semibold text-[#0F172A]">Linked Tasks</h3></div>
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead><tr className="border-b-2 border-[#E2E8F0] bg-[#F8FAFC]">{['Task', 'Owner', 'Priority', 'Due Date', 'Status', 'Progress', 'Actions'].map(h => <th key={h} className="text-left text-xs font-semibold text-[#64748B] uppercase px-4 py-3">{h}</th>)}</tr></thead>
          <tbody>
            {eventTasks.map(task => {
              const owner = users.find(u => u.id === task.ownerId);
              const priorityClasses: Record<string, string> = { High: 'status-badge-high', Medium: 'status-badge-medium', Low: 'status-badge-low' };
              return (
                <tr key={task.id} className="border-b border-[#F1F5F9] hover:bg-[#F8FAFC] transition-colors">
                  <td className="px-4 py-3 text-sm font-medium text-[#0F172A]">{task.title}</td>
                  <td className="px-4 py-3"><div className="flex items-center gap-2"><div className="w-6 h-6 rounded-full bg-[#2563EB] flex items-center justify-center text-white text-[10px] font-medium">{owner?.name.split(' ').map(n => n[0]).join('')}</div><span className="text-xs text-[#64748B]">{owner?.name}</span></div></td>
                  <td className="px-4 py-3"><span className={`status-badge text-[10px] py-0.5 px-2 ${priorityClasses[task.priority]}`}>{task.priority}</span></td>
                  <td className="px-4 py-3 text-xs text-[#64748B]">{new Date(task.dueDate).toLocaleDateString()}</td>
                  <td className="px-4 py-3"><span className={`status-badge text-[10px] py-0.5 px-2 ${taskStatusClasses[task.status]}`}>{task.status}</span></td>
                  <td className="px-4 py-3"><div className="flex items-center gap-2"><div className="w-16 h-1.5 bg-[#E2E8F0] rounded-full overflow-hidden"><div className="h-full bg-[#2563EB] rounded-full" style={{ width: `${task.completionPercentage}%` }} /></div><span className="text-xs text-[#64748B]">{task.completionPercentage}%</span></div></td>
                  <td className="px-4 py-3"><button className="btn-ghost h-7 w-7"><Eye size={14} /></button></td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function ActivityTab({ eventActivities }: { eventActivities: any[] }) {
  const actionColors: Record<string, string> = { Submitted: 'bg-[#10B981]', Completed: 'bg-[#10B981]', Created: 'bg-[#2563EB]', Launched: 'bg-[#2563EB]', Generated: 'bg-[#8B5CF6]', Converted: 'bg-[#F59E0B]', Closed: 'bg-[#EF4444]', Deleted: 'bg-[#EF4444]' };
  return (
    <div className="bg-white rounded-xl border border-[#E2E8F0] shadow-layer1 p-6">
      <div className="relative">
        <div className="absolute left-[11px] top-2 bottom-2 w-[2px] bg-[#E2E8F0]" />
        {eventActivities.map(activity => {
          const user = users.find(u => u.id === activity.userId);
          return (
            <div key={activity.id} className="relative flex gap-3 mb-5 last:mb-0">
              <div className={`w-6 h-6 rounded-full ${actionColors[activity.action] || 'bg-[#94A3B8]'} flex items-center justify-center flex-shrink-0 relative z-10`}><div className="w-2 h-2 bg-white rounded-full" /></div>
              <div className="flex-1 pt-0.5">
                <p className="text-sm text-[#0F172A]"><span className="font-medium">{user?.name}</span> <span className="text-[#64748B]">{activity.action.toLowerCase()}</span> {activity.description}</p>
                <p className="text-xs text-[#94A3B8] mt-1">{new Date(activity.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric', hour: '2-digit', minute: '2-digit' })}</p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
