import { useMemo, useState } from 'react';
import { useApp } from '@/context/AppContext';
import { motion } from 'framer-motion';
import {
  PieChart, BarChart3, TrendingUp, Trophy,
  ChevronRight, Search, FileSpreadsheet, Eye, X
} from 'lucide-react';

export function ResultsPage() {
  const { state, navigate } = useApp();
  const { results, sectionResults, sections, events, templates, eventRespondents, responses } = state.data;
  const [search, setSearch] = useState('');
  const [selectedResult, setSelectedResult] = useState<string | null>(null);

  const eventName = (eid: string) => events.find(e => e.id === eid)?.eventName || 'N/A';
  const sectionName = (sid: string) => sections.find(s => s.id === sid)?.name || 'N/A';

  const resultDetail = useMemo(() => {
    if (!selectedResult) return null;
    const r = results.find(x => x.id === selectedResult);
    if (!r) return null;
    const evt = events.find(e => e.id === r.eventId);
    const sResults = sectionResults.filter(sr => sr.resultId === r.id);
    const tmpl = evt ? templates.find(t => t.id === evt.templateId) : null;
    const respondents = eventRespondents.filter(er => er.eventId === r.eventId);
    const responseCount = responses.filter(resp => resp.eventId === r.eventId).length;
    return { result: r, event: evt, sResults, template: tmpl, respondents, responseCount };
  }, [selectedResult, results, events, sectionResults, templates, eventRespondents, responses]);

  const filtered = useMemo(() => {
    let list = [...results];
    if (search) list = list.filter(r => eventName(r.eventId).toLowerCase().includes(search.toLowerCase()));
    return list.sort((a, b) => new Date(b.generatedAt).getTime() - new Date(a.generatedAt).getTime());
  }, [results, search]);

  const avgScore = filtered.length > 0 ? (filtered.reduce((s, r) => s + r.overallScore, 0) / filtered.length).toFixed(1) : '0';
  const totalResponses = responses.length;
  const completionRate = events.length > 0
    ? Math.round(eventRespondents.filter(er => er.status === 'Submitted').length / eventRespondents.length * 100)
    : 0;

  const severityColor = (s: string) => {
    if (s === 'High') return 'bg-red-50 text-red-700';
    if (s === 'Medium') return 'bg-amber-50 text-amber-700';
    return 'bg-green-50 text-green-700';
  };

  const maturityColor = (score: number) => {
    if (score >= 4) return 'bg-emerald-500';
    if (score >= 3) return 'bg-blue-500';
    if (score >= 2) return 'bg-amber-500';
    return 'bg-red-500';
  };

  const maturityLabel = (score: number) => {
    if (score >= 4.5) return 'Level 5: Optimized';
    if (score >= 3.5) return 'Level 4: Managed';
    if (score >= 2.5) return 'Level 3: Defined';
    if (score >= 1.5) return 'Level 2: Developing';
    return 'Level 1: Initial';
  };

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-[#0F172A]">Results</h1>
        <p className="text-sm text-[#64748B] mt-1">Assessment results and maturity scoring</p>
      </div>

      {/* KPIs */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <div className="bg-white border border-[#E2E8F0] rounded-xl p-4">
          <div className="flex items-center gap-2 text-[#64748B] mb-2"><PieChart size={16} /> <span className="text-xs font-medium">Results Generated</span></div>
          <div className="text-2xl font-bold text-[#0F172A]">{results.length}</div>
        </div>
        <div className="bg-white border border-[#E2E8F0] rounded-xl p-4">
          <div className="flex items-center gap-2 text-[#64748B] mb-2"><TrendingUp size={16} /> <span className="text-xs font-medium">Avg Score</span></div>
          <div className="text-2xl font-bold text-[#0F172A]">{avgScore}<span className="text-sm font-normal text-[#94A3B8]">/5</span></div>
        </div>
        <div className="bg-white border border-[#E2E8F0] rounded-xl p-4">
          <div className="flex items-center gap-2 text-[#64748B] mb-2"><FileSpreadsheet size={16} /> <span className="text-xs font-medium">Total Responses</span></div>
          <div className="text-2xl font-bold text-[#0F172A]">{totalResponses}</div>
        </div>
        <div className="bg-white border border-[#E2E8F0] rounded-xl p-4">
          <div className="flex items-center gap-2 text-[#64748B] mb-2"><Trophy size={16} /> <span className="text-xs font-medium">Completion Rate</span></div>
          <div className="text-2xl font-bold text-[#0F172A]">{completionRate}%</div>
        </div>
      </div>

      <div className="flex flex-wrap items-center gap-3 mb-4">
        <div className="relative flex-1 min-w-[200px] max-w-[320px]">
          <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#94A3B8]" />
          <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search results..." className="w-full pl-9 pr-4 py-2 border border-[#E2E8F0] rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#2563EB]" />
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Results List */}
        <div className="lg:col-span-1 space-y-3">
          {filtered.map(r => (
            <motion.button
              key={r.id}
              onClick={() => setSelectedResult(r.id)}
              className={`w-full text-left bg-white border rounded-xl p-4 transition-all hover:shadow-md ${selectedResult === r.id ? 'border-[#2563EB] ring-1 ring-[#2563EB]' : 'border-[#E2E8F0]'}`}
            >
              <div className="flex items-center justify-between mb-2">
                <h3 className="text-sm font-semibold text-[#0F172A] truncate">{eventName(r.eventId)}</h3>
                <ChevronRight size={16} className="text-[#94A3B8] flex-shrink-0" />
              </div>
              <div className="flex items-center gap-3">
                <div className={`w-10 h-10 rounded-lg ${maturityColor(r.overallScore)} flex items-center justify-center text-white text-sm font-bold`}>
                  {r.overallScore.toFixed(1)}
                </div>
                <div>
                  <p className="text-xs text-[#64748B]">{r.maturityLevel}</p>
                  <p className="text-[10px] text-[#94A3B8]">Target: {r.targetScore} &middot; Gap: {r.gapScore.toFixed(1)}</p>
                </div>
              </div>
              <p className="text-[10px] text-[#94A3B8] mt-2">Generated {new Date(r.generatedAt).toLocaleDateString()}</p>
            </motion.button>
          ))}
          {filtered.length === 0 && (
            <div className="text-center py-12 text-[#94A3B8]">
              <BarChart3 size={40} className="mx-auto mb-3 opacity-40" />
              <p className="text-sm">No results yet</p>
              <p className="text-xs mt-1">Complete an assessment to see results</p>
            </div>
          )}
        </div>

        {/* Detail View */}
        <div className="lg:col-span-2">
          {resultDetail ? (
            <motion.div initial={{ opacity: 0, x: 8 }} animate={{ opacity: 1, x: 0 }} className="bg-white border border-[#E2E8F0] rounded-xl p-6">
              <div className="flex items-start justify-between mb-6">
                <div>
                  <h2 className="text-lg font-bold text-[#0F172A]">{resultDetail.event?.eventName}</h2>
                  <p className="text-sm text-[#64748B] mt-1">{resultDetail.template?.name} &middot; {resultDetail.respondents.length} respondents &middot; {resultDetail.responseCount} responses</p>
                </div>
                <button onClick={() => setSelectedResult(null)} className="p-1.5 rounded-lg hover:bg-[#F1F5F9]"><X size={18} /></button>
              </div>

              {/* Overall Score */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
                <div className="bg-[#F8FAFC] rounded-xl p-4 text-center">
                  <div className={`w-16 h-16 rounded-full ${maturityColor(resultDetail.result.overallScore)} flex items-center justify-center text-white text-xl font-bold mx-auto mb-2`}>
                    {resultDetail.result.overallScore.toFixed(1)}
                  </div>
                  <p className="text-sm font-medium text-[#0F172A]">{maturityLabel(resultDetail.result.overallScore)}</p>
                  <p className="text-[10px] text-[#94A3B8] mt-1">Overall Maturity</p>
                </div>
                <div className="bg-[#F8FAFC] rounded-xl p-4 text-center">
                  <div className="w-16 h-16 rounded-full bg-[#E2E8F0] flex items-center justify-center text-[#64748B] text-xl font-bold mx-auto mb-2">
                    {resultDetail.result.targetScore}
                  </div>
                  <p className="text-sm font-medium text-[#0F172A]">Target Score</p>
                  <p className="text-[10px] text-[#94A3B8] mt-1">Goal</p>
                </div>
                <div className="bg-[#F8FAFC] rounded-xl p-4 text-center">
                  <div className={`w-16 h-16 rounded-full ${resultDetail.result.gapScore > 1.5 ? 'bg-red-500' : resultDetail.result.gapScore > 0.8 ? 'bg-amber-500' : 'bg-emerald-500'} flex items-center justify-center text-white text-xl font-bold mx-auto mb-2`}>
                    {resultDetail.result.gapScore.toFixed(1)}
                  </div>
                  <p className="text-sm font-medium text-[#0F172A]">Gap Score</p>
                  <p className="text-[10px] text-[#94A3B8] mt-1">{resultDetail.result.gapScore > 1.5 ? 'Needs attention' : resultDetail.result.gapScore > 0.8 ? 'Moderate' : 'On track'}</p>
                </div>
              </div>

              {/* Section Breakdown */}
              <h3 className="text-sm font-semibold text-[#0F172A] mb-3">Section Breakdown</h3>
              <div className="space-y-3">
                {resultDetail.sResults.map(sr => (
                  <div key={sr.id} className="flex items-center gap-4">
                    <span className="text-xs font-medium text-[#334155] w-32 truncate">{sectionName(sr.sectionId)}</span>
                    <div className="flex-1 h-3 bg-[#F1F5F9] rounded-full overflow-hidden">
                      <div
                        className={`h-full rounded-full transition-all ${maturityColor(sr.actualScore)}`}
                        style={{ width: `${(sr.actualScore / 5) * 100}%` }}
                      />
                    </div>
                    <span className="text-xs font-semibold text-[#334155] w-8">{sr.actualScore.toFixed(1)}</span>
                    <span className={`px-2 py-0.5 rounded-full text-[10px] font-semibold ${severityColor(sr.gapSeverity)}`}>{sr.gapSeverity}</span>
                  </div>
                ))}
              </div>

              {/* Maturity Trend Bar */}
              <h3 className="text-sm font-semibold text-[#0F172A] mt-6 mb-3">Maturity Level Progression</h3>
              <div className="flex gap-1 h-8">
                {[1, 2, 3, 4, 5].map(level => {
                  const score = resultDetail.result.overallScore;
                  const isActive = score >= level;
                  const isPartial = score >= level - 0.5 && score < level;
                  return (
                    <div key={level} className="flex-1 flex flex-col items-center gap-1">
                      <div className={`w-full h-full rounded-lg ${isActive ? maturityColor(level) : isPartial ? maturityColor(level) + ' opacity-40' : 'bg-[#F1F5F9]'}`} />
                      <span className="text-[9px] text-[#94A3B8]">L{level}</span>
                    </div>
                  );
                })}
              </div>

              <div className="mt-6 flex gap-2">
                <button
                  onClick={() => navigate('recommendations')}
                  className="flex items-center gap-2 px-4 py-2 bg-[#0F172A] text-white rounded-lg text-sm hover:bg-[#1E293B]"
                >
                  <Eye size={14} /> View Recommendations
                </button>
              </div>
            </motion.div>
          ) : (
            <div className="flex items-center justify-center h-full min-h-[400px] bg-white border border-[#E2E8F0] rounded-xl text-[#94A3B8]">
              <div className="text-center">
                <PieChart size={48} className="mx-auto mb-4 opacity-40" />
                <p className="text-sm font-medium">Select a result to view details</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
