import { useState, useMemo } from 'react';
import { useApp } from '@/context/AppContext';
import { generateUUID } from '@/context/AppContext';
import { motion } from 'framer-motion';
import {
  Database, Plus, Search, Trash2, Edit, X,
  ChevronDown, ChevronRight, MessageSquare
} from 'lucide-react';
import type { AssessmentQuestion } from '@/types';

export function QuestionBankPage() {
  const { state, dispatch, addToast } = useApp();
  const { questions, sections, templates, answerOptions } = state.data;
  const [search, setSearch] = useState('');
  const [typeFilter, setTypeFilter] = useState('all');
  const [templateFilter, setTemplateFilter] = useState('all');
  const [expandedQuestions, setExpandedQuestions] = useState<string[]>([]);
  const [showModal, setShowModal] = useState(false);
  const [editingQ, setEditingQ] = useState<AssessmentQuestion | null>(null);

  // Form state
  const [qText, setQText] = useState('');
  const [qDesc, setQDesc] = useState('');
  const [qType, setQType] = useState('Rating Scale');
  const [qTemplate, setQTemplate] = useState('');
  const [qSection, setQSection] = useState('');
  const [qMandatory, setQMandatory] = useState(true);
  const [qEvidence, setQEvidence] = useState<'Not Required' | 'Optional' | 'Required'>('Optional');
  const [qHelp, setQHelp] = useState('');

  const availableSections = useMemo(() =>
    qTemplate ? sections.filter(s => s.templateId === qTemplate) : []
  , [sections, qTemplate]);

  const filtered = useMemo(() => {
    let list = [...questions];
    if (search) list = list.filter(q => q.questionText.toLowerCase().includes(search.toLowerCase()) || q.description.toLowerCase().includes(search.toLowerCase()));
    if (typeFilter !== 'all') list = list.filter(q => q.answerType === typeFilter);
    if (templateFilter !== 'all') list = list.filter(q => q.templateId === templateFilter);
    return list;
  }, [questions, search, typeFilter, templateFilter]);

  const toggleExpand = (id: string) => {
    setExpandedQuestions(prev => prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]);
  };

  const resetForm = () => {
    setQText(''); setQDesc(''); setQType('Rating Scale'); setQTemplate(''); setQSection('');
    setQMandatory(true); setQEvidence('Optional'); setQHelp(''); setEditingQ(null);
  };

  const openCreate = () => { resetForm(); setShowModal(true); };
  const openEdit = (q: AssessmentQuestion) => {
    setEditingQ(q); setQText(q.questionText); setQDesc(q.description); setQType(q.answerType);
    setQTemplate(q.templateId); setQSection(q.sectionId); setQMandatory(q.isMandatory);
    setQEvidence(q.evidenceRequirement); setQHelp(q.helpText); setShowModal(true);
  };

  const handleSave = () => {
    if (!qText.trim() || !qTemplate || !qSection) {
      addToast({ type: 'error', title: 'Validation', message: 'Question text, template and section are required' });
      return;
    }
    if (editingQ) {
      dispatch({
        type: 'UPDATE_QUESTION',
        payload: { ...editingQ, questionText: qText, description: qDesc, answerType: qType as any, templateId: qTemplate, sectionId: qSection, isMandatory: qMandatory, evidenceRequirement: qEvidence, helpText: qHelp }
      });
      addToast({ type: 'success', title: 'Updated', message: 'Question updated' });
    } else {
      const order = questions.filter(q => q.sectionId === qSection).length + 1;
      const newQ: AssessmentQuestion = {
        id: generateUUID(), templateId: qTemplate, sectionId: qSection,
        questionText: qText, description: qDesc, answerType: qType as any,
        weight: 1, isMandatory: qMandatory, evidenceRequirement: qEvidence,
        helpText: qHelp, displayOrder: order, status: 'Active'
      };
      dispatch({ type: 'CREATE_QUESTION', payload: newQ });
      addToast({ type: 'success', title: 'Created', message: 'Question added to bank' });
    }
    setShowModal(false); resetForm();
  };

  const handleDelete = (id: string) => {
    if (confirm('Delete this question?')) {
      dispatch({ type: 'DELETE_QUESTION', id });
      addToast({ type: 'success', title: 'Deleted', message: 'Question removed' });
    }
  };

  const getOpts = (qId: string) => answerOptions.filter(ao => ao.questionId === qId);
  const getTmplName = (tid: string) => templates.find(t => t.id === tid)?.name || 'N/A';
  const getSecName = (sid: string) => sections.find(s => s.id === sid)?.name || 'N/A';

  const typeColors: Record<string, string> = {
    'Single Choice': 'bg-blue-50 text-blue-700',
    'Multiple Choice': 'bg-indigo-50 text-indigo-700',
    'Rating Scale': 'bg-purple-50 text-purple-700',
    'Yes/No': 'bg-green-50 text-green-700',
    'Text': 'bg-gray-50 text-gray-700',
    'Number': 'bg-amber-50 text-amber-700',
    'Dropdown': 'bg-cyan-50 text-cyan-700',
    'Matrix': 'bg-pink-50 text-pink-700',
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-[#0F172A]">Question Bank</h1>
          <p className="text-sm text-[#64748B] mt-1">{questions.length} questions across {templates.length} templates</p>
        </div>
        <button onClick={openCreate} className="flex items-center gap-2 px-4 py-2 bg-[#0F172A] text-white rounded-lg text-sm font-medium hover:bg-[#1E293B]">
          <Plus size={16} /> Add Question
        </button>
      </div>

      <div className="flex flex-wrap items-center gap-3 mb-4">
        <div className="relative flex-1 min-w-[200px] max-w-[320px]">
          <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#94A3B8]" />
          <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search questions..." className="w-full pl-9 pr-4 py-2 border border-[#E2E8F0] rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#2563EB]" />
        </div>
        <select value={typeFilter} onChange={e => setTypeFilter(e.target.value)} className="px-3 py-2 border border-[#E2E8F0] rounded-lg text-sm bg-white focus:outline-none">
          <option value="all">All Types</option>
          <option value="Rating Scale">Rating Scale</option>
          <option value="Single Choice">Single Choice</option>
          <option value="Yes/No">Yes/No</option>
          <option value="Text">Text</option>
          <option value="Multiple Choice">Multiple Choice</option>
          <option value="Number">Number</option>
        </select>
        <select value={templateFilter} onChange={e => setTemplateFilter(e.target.value)} className="px-3 py-2 border border-[#E2E8F0] rounded-lg text-sm bg-white focus:outline-none">
          <option value="all">All Templates</option>
          {templates.map(t => <option key={t.id} value={t.id}>{t.name}</option>)}
        </select>
      </div>

      <div className="space-y-3">
        {filtered.map(q => {
          const isExpanded = expandedQuestions.includes(q.id);
          const opts = getOpts(q.id);
          return (
            <motion.div key={q.id} layout initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="bg-white border border-[#E2E8F0] rounded-xl overflow-hidden">
              <div className="flex items-start gap-3 p-4">
                <button onClick={() => toggleExpand(q.id)} className="mt-0.5 text-[#94A3B8] hover:text-[#334155]">
                  {isExpanded ? <ChevronDown size={18} /> : <ChevronRight size={18} />}
                </button>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <span className={`px-2 py-0.5 rounded-full text-[10px] font-semibold ${typeColors[q.answerType] || 'bg-gray-50 text-gray-700'}`}>{q.answerType}</span>
                    {q.isMandatory && <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-red-50 text-red-600">Required</span>}
                    <span className="text-[10px] text-[#94A3B8]">{getTmplName(q.templateId)} &gt; {getSecName(q.sectionId)}</span>
                  </div>
                  <p className="text-sm font-medium text-[#0F172A]">{q.questionText}</p>
                  {q.description && <p className="text-xs text-[#64748B] mt-1">{q.description}</p>}
                </div>
                <div className="flex items-center gap-1">
                  <button onClick={() => openEdit(q)} className="p-1.5 rounded-lg hover:bg-[#F1F5F9] text-[#64748B]"><Edit size={14} /></button>
                  <button onClick={() => handleDelete(q.id)} className="p-1.5 rounded-lg hover:bg-red-50 text-[#64748B] hover:text-red-600"><Trash2 size={14} /></button>
                </div>
              </div>
              {isExpanded && (
                <div className="px-4 pb-4 pl-10 border-t border-[#F1F5F9]">
                  {opts.length > 0 ? (
                    <div className="mt-3">
                      <p className="text-xs font-medium text-[#64748B] mb-2">Answer Options ({opts.length})</p>
                      <div className="space-y-1.5">
                        {opts.sort((a, b) => a.displayOrder - b.displayOrder).map(opt => (
                          <div key={opt.id} className="flex items-center gap-3 px-3 py-2 bg-[#F8FAFC] rounded-lg text-sm">
                            <span className="text-xs font-semibold text-[#2563EB] w-6">{opt.score}</span>
                            <span className="text-[#334155]">{opt.label}</span>
                            {opt.recommendationTrigger && (
                              <span className={`ml-auto px-2 py-0.5 rounded-full text-[10px] font-semibold ${opt.recommendationTrigger === 'High' ? 'bg-red-50 text-red-600' : 'bg-amber-50 text-amber-600'}`}>
                                {opt.recommendationTrigger} trigger
                              </span>
                            )}
                          </div>
                        ))}
                      </div>
                    </div>
                  ) : (
                    <p className="text-xs text-[#94A3B8] mt-3">No predefined options (free-text or auto-generated)</p>
                  )}
                  {q.helpText && (
                    <div className="mt-3 flex items-start gap-2 text-xs text-[#64748B]">
                      <MessageSquare size={14} className="mt-0.5 flex-shrink-0" />
                      <span>{q.helpText}</span>
                    </div>
                  )}
                  <div className="mt-3 flex items-center gap-4 text-[11px] text-[#94A3B8]">
                    <span>Evidence: {q.evidenceRequirement}</span>
                    <span>Weight: {q.weight}</span>
                    <span>Order: {q.displayOrder}</span>
                  </div>
                </div>
              )}
            </motion.div>
          );
        })}
      </div>

      {filtered.length === 0 && (
        <div className="text-center py-16 text-[#94A3B8]">
          <Database size={48} className="mx-auto mb-4 opacity-40" />
          <p className="text-lg font-medium">No questions found</p>
          <p className="text-sm mt-1">Try adjusting filters or add a new question</p>
        </div>
      )}

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/50" onClick={() => { setShowModal(false); resetForm(); }} />
          <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="relative bg-white rounded-xl shadow-xl w-full max-w-lg max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between p-5 border-b border-[#E2E8F0]">
              <h2 className="text-lg font-semibold">{editingQ ? 'Edit Question' : 'New Question'}</h2>
              <button onClick={() => { setShowModal(false); resetForm(); }} className="p-1.5 rounded-lg hover:bg-[#F1F5F9]"><X size={18} /></button>
            </div>
            <div className="p-5 space-y-4">
              <div>
                <label className="block text-sm font-medium text-[#334155] mb-1">Question Text *</label>
                <textarea value={qText} onChange={e => setQText(e.target.value)} rows={3} className="w-full px-3 py-2 border border-[#E2E8F0] rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#2563EB]" placeholder="Enter the question..." />
              </div>
              <div>
                <label className="block text-sm font-medium text-[#334155] mb-1">Description</label>
                <input value={qDesc} onChange={e => setQDesc(e.target.value)} className="w-full px-3 py-2 border border-[#E2E8F0] rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#2563EB]" placeholder="Additional context..." />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-sm font-medium text-[#334155] mb-1">Template *</label>
                  <select value={qTemplate} onChange={e => { setQTemplate(e.target.value); setQSection(''); }} className="w-full px-3 py-2 border border-[#E2E8F0] rounded-lg text-sm focus:outline-none">
                    <option value="">Select...</option>
                    {templates.map(t => <option key={t.id} value={t.id}>{t.name}</option>)}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-[#334155] mb-1">Section *</label>
                  <select value={qSection} onChange={e => setQSection(e.target.value)} className="w-full px-3 py-2 border border-[#E2E8F0] rounded-lg text-sm focus:outline-none" disabled={!qTemplate}>
                    <option value="">Select...</option>
                    {availableSections.map(s => <option key={s.id} value={s.id}>{s.name}</option>)}
                  </select>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-sm font-medium text-[#334155] mb-1">Answer Type</label>
                  <select value={qType} onChange={e => setQType(e.target.value)} className="w-full px-3 py-2 border border-[#E2E8F0] rounded-lg text-sm focus:outline-none">
                    <option value="Rating Scale">Rating Scale</option>
                    <option value="Single Choice">Single Choice</option>
                    <option value="Multiple Choice">Multiple Choice</option>
                    <option value="Yes/No">Yes/No</option>
                    <option value="Text">Text</option>
                    <option value="Number">Number</option>
                    <option value="Dropdown">Dropdown</option>
                    <option value="Matrix">Matrix</option>
                    <option value="Date">Date</option>
                    <option value="File Upload">File Upload</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-[#334155] mb-1">Evidence</label>
                  <select value={qEvidence} onChange={e => setQEvidence(e.target.value as any)} className="w-full px-3 py-2 border border-[#E2E8F0] rounded-lg text-sm focus:outline-none">
                    <option value="Not Required">Not Required</option>
                    <option value="Optional">Optional</option>
                    <option value="Required">Required</option>
                  </select>
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-[#334155] mb-1">Help Text</label>
                <input value={qHelp} onChange={e => setQHelp(e.target.value)} className="w-full px-3 py-2 border border-[#E2E8F0] rounded-lg text-sm focus:outline-none" placeholder="Guidance for respondents..." />
              </div>
              <label className="flex items-center gap-2 text-sm text-[#334155]">
                <input type="checkbox" checked={qMandatory} onChange={e => setQMandatory(e.target.checked)} className="rounded" />
                Mandatory question
              </label>
            </div>
            <div className="flex justify-end gap-2 p-5 border-t border-[#E2E8F0] bg-[#F8FAFC]">
              <button onClick={() => { setShowModal(false); resetForm(); }} className="px-4 py-2 border border-[#E2E8F0] rounded-lg text-sm hover:bg-[#F1F5F9]">Cancel</button>
              <button onClick={handleSave} className="px-4 py-2 bg-[#0F172A] text-white rounded-lg text-sm hover:bg-[#1E293B]">{editingQ ? 'Save Changes' : 'Add Question'}</button>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  );
}
