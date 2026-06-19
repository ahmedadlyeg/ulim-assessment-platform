import { useState, useMemo } from 'react';
import { useApp } from '@/context/AppContext';
import { users } from '@/data/mockData';
import { Search, Lightbulb, Filter, CheckSquare, Trash2 } from 'lucide-react';
import { motion } from 'framer-motion';

const priorityClasses: Record<string, string> = { High: 'status-badge-high', Medium: 'status-badge-medium', Low: 'status-badge-low' };
const gapClasses: Record<string, string> = { High: 'status-badge-high', Medium: 'status-badge-medium', Low: 'status-badge-low', None: 'status-badge-none' };
const statusClasses: Record<string, string> = { Draft: 'status-badge-draft', Approved: 'status-badge-active', 'Converted to Task': 'status-badge-completed', Deferred: 'status-badge-closed', Rejected: 'status-badge-cancelled' };

export function RecommendationsPage() {
  const { state, openModal, dispatch, addToast } = useApp();
  const { recommendations, sections } = state.data;
  const [searchQuery, setSearchQuery] = useState('');
  const [priorityFilter, setPriorityFilter] = useState('All');
  const [statusFilter, setStatusFilter] = useState('All');
  const [selectedRecId, setSelectedRecId] = useState<string | null>(null);

  const filteredRecommendations = useMemo(() => recommendations.filter(rec => {
    if (searchQuery) { const q = searchQuery.toLowerCase(); if (!rec.title.toLowerCase().includes(q) && !rec.description.toLowerCase().includes(q)) return false; }
    if (priorityFilter !== 'All' && rec.priority !== priorityFilter) return false;
    if (statusFilter !== 'All' && rec.status !== statusFilter) return false;
    return true;
  }), [recommendations, searchQuery, priorityFilter, statusFilter]);

  const selectedRec = recommendations.find(r => r.id === selectedRecId);

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="font-display text-4xl font-semibold text-[#0F172A] tracking-tight">Recommendations</h1>
          <p className="text-sm text-[#64748B] mt-1">Manage assessment recommendations and convert to tasks</p>
        </div>
        <button onClick={() => addToast({ type: 'info', title: 'Coming Soon', message: 'Bulk actions will be available in the next release.' })} className="btn-secondary text-sm h-9"><Filter size={14} className="mr-1.5" />Bulk Actions</button>
      </div>

      <div className="flex gap-6">
        <div className="w-[400px] flex-shrink-0">
          <div className="bg-white rounded-xl border border-[#E2E8F0] shadow-layer1 p-4 mb-4">
            <div className="relative mb-3">
              <Search size={14} className="absolute left-2.5 top-1/2 -translate-y-1/2 text-[#94A3B8]" />
              <input type="text" value={searchQuery} onChange={e => setSearchQuery(e.target.value)} placeholder="Search recommendations..." className="input-field w-full pl-8 h-8 text-xs" />
            </div>
            <div className="flex gap-2">
              <select value={priorityFilter} onChange={e => setPriorityFilter(e.target.value)} className="input-field h-8 text-xs flex-1"><option>All Priorities</option><option>High</option><option>Medium</option><option>Low</option></select>
              <select value={statusFilter} onChange={e => setStatusFilter(e.target.value)} className="input-field h-8 text-xs flex-1"><option>All Statuses</option><option>Draft</option><option>Approved</option><option>Converted to Task</option></select>
            </div>
          </div>
          <div className="bg-white rounded-xl border border-[#E2E8F0] shadow-layer1 overflow-hidden max-h-[calc(100vh-280px)] overflow-y-auto scrollbar-thin">
            {filteredRecommendations.length === 0 ? <div className="p-8 text-center"><Lightbulb size={48} className="mx-auto text-[#CBD5E1] mb-3" /><p className="text-sm text-[#64748B]">No recommendations found</p></div> : filteredRecommendations.map(rec => {
              const section = sections.find(s => s.id === rec.sectionId);
              const isSelected = selectedRecId === rec.id;
              return (
                <button key={rec.id} onClick={() => setSelectedRecId(rec.id)} className={`w-full text-left px-4 py-3 border-b border-[#F1F5F9] transition-colors ${isSelected ? 'bg-[#F8FAFC] border-l-[3px] border-l-[#2563EB]' : 'hover:bg-[#F8FAFC]'}`}>
                  <div className="flex items-center gap-2 mb-1.5">
                    <div className={`w-2 h-2 rounded-full ${rec.priority === 'High' ? 'bg-[#EF4444]' : rec.priority === 'Medium' ? 'bg-[#F59E0B]' : 'bg-[#2563EB]'}`} />
                    <span className="text-sm font-medium text-[#0F172A] truncate flex-1">{rec.title}</span>
                  </div>
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-[10px] text-[#64748B]">{section?.name}</span>
                    <span className={`status-badge text-[9px] py-0 px-1.5 ${gapClasses[rec.gapSeverity]}`}>{rec.gapSeverity}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className={`status-badge text-[9px] py-0 px-1.5 ${statusClasses[rec.status]}`}>{rec.status}</span>
                    {rec.suggestedDueDate && <span className="text-[10px] text-[#94A3B8]">{new Date(rec.suggestedDueDate).toLocaleDateString()}</span>}
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        <div className="flex-1 min-w-0">
          {selectedRec ? (
            <motion.div key={selectedRec.id} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.2 }}>
              <div className="bg-white rounded-xl border border-[#E2E8F0] shadow-layer1 p-6">
                <div className="flex items-start justify-between mb-5">
                  <h2 className="text-lg font-semibold text-[#0F172A] flex-1 mr-4">{selectedRec.title}</h2>
                  <div className="flex items-center gap-2 flex-shrink-0">
                    {selectedRec.status === 'Draft' && <button onClick={() => { dispatch({ type: 'UPDATE_RECOMMENDATION', payload: { ...selectedRec, status: 'Approved' } }); addToast({ type: 'success', title: 'Approved', message: 'Recommendation approved.' }); }} className="btn-secondary text-xs h-7 px-2">Approve</button>}
                    {selectedRec.status !== 'Converted to Task' && selectedRec.status !== 'Completed' && <button onClick={() => openModal('convert-to-task', { recommendationId: selectedRec.id })} className="btn-primary text-xs h-7 px-2"><CheckSquare size={12} className="mr-1" />Convert to Task</button>}
                    <button onClick={() => { if (confirm('Delete this recommendation?')) { dispatch({ type: 'DELETE_RECOMMENDATION', id: selectedRec.id }); setSelectedRecId(null); addToast({ type: 'success', title: 'Deleted', message: 'Recommendation deleted.' }); } }} className="btn-ghost text-xs h-7 w-7 text-[#EF4444]"><Trash2 size={14} /></button>
                  </div>
                </div>
                <div className="grid grid-cols-4 gap-4 mb-5">
                  {[{ label: 'Priority', value: selectedRec.priority, cls: priorityClasses[selectedRec.priority] }, { label: 'Gap Severity', value: selectedRec.gapSeverity, cls: gapClasses[selectedRec.gapSeverity] }, { label: 'Status', value: selectedRec.status, cls: statusClasses[selectedRec.status] }, { label: 'Created', value: new Date(selectedRec.createdAt).toLocaleDateString(), cls: '' }].map(item => (
                    <div key={item.label}>
                      <span className="text-[10px] text-[#64748B] uppercase font-medium">{item.label}</span>
                      <div className="mt-1">{item.cls ? <span className={`status-badge text-[10px] py-0.5 px-2 ${item.cls}`}>{item.value}</span> : <p className="text-xs text-[#0F172A] mt-1">{item.value}</p>}</div>
                    </div>
                  ))}
                </div>
                <div className="grid grid-cols-2 gap-4 mb-5">
                  <div>
                    <span className="text-[10px] text-[#64748B] uppercase font-medium">Section</span>
                    <p className="text-sm text-[#0F172A] mt-1">{sections.find(s => s.id === selectedRec.sectionId)?.name}</p>
                  </div>
                  <div>
                    <span className="text-[10px] text-[#64748B] uppercase font-medium">Suggested Owner</span>
                    <div className="flex items-center gap-2 mt-1">
                      {selectedRec.suggestedOwnerId ? <><div className="w-5 h-5 rounded-full bg-[#2563EB] flex items-center justify-center text-white text-[8px] font-medium">{users.find(u => u.id === selectedRec.suggestedOwnerId)?.name.split(' ').map(n => n[0]).join('')}</div><span className="text-sm text-[#0F172A]">{users.find(u => u.id === selectedRec.suggestedOwnerId)?.name}</span></> : <span className="text-sm text-[#94A3B8]">Unassigned</span>}
                    </div>
                  </div>
                </div>
                {selectedRec.suggestedDueDate && <div className="mb-5"><span className="text-[10px] text-[#64748B] uppercase font-medium">Suggested Due Date</span><p className="text-sm text-[#0F172A] mt-1">{new Date(selectedRec.suggestedDueDate).toLocaleDateString()}</p></div>}
                <div className="bg-[#F8FAFC] rounded-lg p-4 mb-5"><span className="text-[10px] text-[#64748B] uppercase font-medium">Description</span><p className="text-sm text-[#0F172A] mt-2 leading-relaxed">{selectedRec.description}</p></div>
                {selectedRec.linkedTaskId && <div className="border border-[#E2E8F0] rounded-lg p-4 bg-[#F8FAFC]"><div className="flex items-center gap-2 mb-2"><CheckSquare size={16} className="text-[#10B981]" /><span className="text-sm font-medium text-[#0F172A]">Linked Task</span></div><button onClick={() => addToast({ type: 'info', title: 'Task', message: `Viewing task ${selectedRec.linkedTaskId?.substring(0, 8)}` })} className="text-xs text-[#2563EB] font-medium hover:underline">View Task Details</button></div>}
              </div>
            </motion.div>
          ) : <div className="bg-white rounded-xl border border-[#E2E8F0] shadow-layer1 p-12 text-center"><Lightbulb size={64} className="mx-auto text-[#CBD5E1] mb-4" /><h3 className="text-lg font-semibold text-[#0F172A] mb-2">Select a Recommendation</h3><p className="text-sm text-[#64748B]">Choose a recommendation from the list to view details and take action.</p></div>}
        </div>
      </div>
    </div>
  );
}
