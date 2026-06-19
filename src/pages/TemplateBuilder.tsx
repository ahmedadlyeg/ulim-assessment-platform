import { useState, useCallback } from 'react';
import { useApp, generateUUID } from '@/context/AppContext';
import { categories } from '@/data/mockData';
import { GripVertical, Plus, ChevronRight, ChevronDown, Save, Play, FileText, Layers, HelpCircle, BarChart3, Lightbulb, Eye, Trash2, Copy } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const tabs = [
  { id: 'info', label: 'Template Info', icon: FileText },
  { id: 'sections', label: 'Sections', icon: Layers },
  { id: 'questions', label: 'Questions', icon: HelpCircle },
  { id: 'scoring', label: 'Scoring', icon: BarChart3 },
  { id: 'recommendations', label: 'Recommendations', icon: Lightbulb },
  { id: 'preview', label: 'Preview', icon: Eye },
];

export function TemplateBuilder() {
  const { state, dispatch, navigate, openModal, addToast } = useApp();
  const [activeTab, setActiveTab] = useState('info');
  const [selectedSectionId, setSelectedSectionId] = useState<string | null>(null);
  const [selectedQuestionId, setSelectedQuestionId] = useState<string | null>(null);
  const [expandedSections, setExpandedSections] = useState<string[]>([]);

  const template = state.ui.selectedTemplateId
    ? state.data.templates.find(t => t.id === state.ui.selectedTemplateId)
    : null;

  const templateSections = template ? state.data.sections.filter(s => s.templateId === template.id) : [];

  const toggleSection = (id: string) => setExpandedSections(prev => prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]);
  const getSectionQuestions = useCallback((sid: string) => state.data.questions.filter(q => q.sectionId === sid), [state.data.questions]);
  const getAnswerOptions = useCallback((qid: string) => state.data.answerOptions.filter(ao => ao.questionId === qid), [state.data.answerOptions]);

  const handleSave = () => {
    if (!template) return;
    dispatch({ type: 'UPDATE_TEMPLATE', payload: { ...template, updatedAt: new Date().toISOString() } });
    addToast({ type: 'success', title: 'Saved', message: `Template "${template.name}" saved successfully.` });
  };

  const handleActivate = () => {
    if (!template) return;
    dispatch({ type: 'UPDATE_TEMPLATE', payload: { ...template, status: 'Active', updatedAt: new Date().toISOString() } });
    addToast({ type: 'success', title: 'Activated', message: `Template "${template.name}" is now active.` });
  };

  const handleDeleteSection = (sectionId: string) => {
    if (!confirm('Delete this section and all its questions?')) return;
    dispatch({ type: 'DELETE_SECTION', id: sectionId });
    state.data.questions.filter(q => q.sectionId === sectionId).forEach(q => dispatch({ type: 'DELETE_QUESTION', id: q.id }));
    addToast({ type: 'success', title: 'Deleted', message: 'Section deleted.' });
  };

  const handleDeleteQuestion = (questionId: string) => {
    if (!confirm('Delete this question?')) return;
    dispatch({ type: 'DELETE_QUESTION', id: questionId });
    addToast({ type: 'success', title: 'Deleted', message: 'Question deleted.' });
  };

  const handleCloneTemplate = () => {
    if (!template) return;
    const newId = generateUUID();
    const now = new Date().toISOString();
    const newTemplate = { ...template, id: newId, name: `${template.name} (Copy)`, code: `${template.code}-COPY`, version: '1.0', status: 'Draft' as const, createdAt: now, updatedAt: now };
    dispatch({ type: 'CREATE_TEMPLATE', payload: newTemplate });
    templateSections.forEach(s => {
      const newSid = generateUUID();
      dispatch({ type: 'CREATE_SECTION', payload: { ...s, id: newSid, templateId: newId, parentSectionId: null } });
      getSectionQuestions(s.id).forEach(q => {
        const newQid = generateUUID();
        dispatch({ type: 'CREATE_QUESTION', payload: { ...q, id: newQid, templateId: newId, sectionId: newSid } });
        getAnswerOptions(q.id).forEach(ao => dispatch({ type: 'CREATE_OPTION', payload: { ...ao, id: generateUUID(), questionId: newQid } }));
      });
    });
    addToast({ type: 'success', title: 'Cloned', message: `Template "${template.name}" cloned.` });
    navigate('assessments');
  };

  if (!template) {
    return (
      <div className="text-center py-20">
        <FileText size={64} className="mx-auto text-[#CBD5E1] mb-4" />
        <h2 className="text-xl font-semibold text-[#0F172A] mb-2">No Template Selected</h2>
        <p className="text-sm text-[#64748B] mb-4">Select a template from the assessments list or create a new one.</p>
        <button onClick={() => navigate('assessments')} className="btn-primary">View Assessments</button>
      </div>
    );
  }

  return (
    <div>
      <div className="flex items-start justify-between mb-4">
        <div>
          <h1 className="font-display text-3xl font-semibold text-[#0F172A] tracking-tight">{template.name}</h1>
          <p className="text-sm text-[#64748B] mt-1">{template.code} — v{template.version}</p>
        </div>
        <div className="flex items-center gap-2">
          <button onClick={handleSave} className="btn-secondary text-sm h-9"><Save size={16} className="mr-1.5" />Save</button>
          {template.status === 'Draft' && <button onClick={handleActivate} className="btn-primary text-sm h-9"><Play size={16} className="mr-1.5" />Activate</button>}
          <button onClick={handleCloneTemplate} className="btn-ghost h-9 w-9" title="Clone"><Copy size={18} /></button>
          <button onClick={() => { if (confirm(`Delete "${template.name}"?`)) { dispatch({ type: 'DELETE_TEMPLATE', id: template.id }); addToast({ type: 'success', title: 'Deleted', message: 'Template deleted.' }); navigate('assessments'); } }} className="btn-ghost h-9 w-9 text-[#EF4444]" title="Delete"><Trash2 size={18} /></button>
        </div>
      </div>

      <div className="bg-white rounded-lg border border-[#E2E8F0] shadow-layer1 px-4 py-2.5 flex items-center gap-6 mb-6 flex-wrap">
        <span className="text-xs text-[#64748B]"><span className="font-medium text-[#0F172A]">Category:</span> {categories.find(c => c.id === template.categoryId)?.name}</span>
        <span className="text-xs text-[#64748B]"><span className="font-medium text-[#0F172A]">Type:</span> {template.type}</span>
        <span className="text-xs text-[#64748B]"><span className="font-medium text-[#0F172A]">Scoring:</span> {template.scoringModel}</span>
        <span className="text-xs text-[#64748B]"><span className="font-medium text-[#0F172A]">Version:</span> {template.version}</span>
        <span className="text-xs text-[#94A3B8] ml-auto">Last saved just now</span>
      </div>

      <div className="flex gap-6">
        <div className="w-80 flex-shrink-0">
          <div className="bg-white rounded-xl border border-[#E2E8F0] shadow-layer1 p-4 sticky top-6 max-h-[calc(100vh-200px)] overflow-y-auto scrollbar-thin">
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-sm font-semibold text-[#0F172A]">Structure</h3>
              <button onClick={() => openModal('create-section', { templateId: template.id })} className="btn-text text-xs h-7 px-2"><Plus size={14} className="mr-1" />Add</button>
            </div>
            {templateSections.map(section => {
              const isExpanded = expandedSections.includes(section.id);
              const sectionQuestions = getSectionQuestions(section.id);
              const isSelected = selectedSectionId === section.id;
              return (
                <div key={section.id} className="mb-1">
                  <button onClick={() => { setSelectedSectionId(section.id); setSelectedQuestionId(null); toggleSection(section.id); }}
                    className={`w-full flex items-center gap-2 px-2.5 py-2 rounded-lg text-left transition-colors ${isSelected && !selectedQuestionId ? 'bg-[#DBEAFE] border-l-[3px] border-[#2563EB]' : 'hover:bg-[#F8FAFC]'}`}>
                    {isExpanded ? <ChevronDown size={14} className="text-[#94A3B8]" /> : <ChevronRight size={14} className="text-[#94A3B8]" />}
                    <span className="text-sm font-medium text-[#0F172A] flex-1 truncate">{section.name}</span>
                    <span className="text-[10px] text-[#64748B]">{section.weight}%</span>
                    <button onClick={e => { e.stopPropagation(); handleDeleteSection(section.id); }} className="opacity-0 group-hover:opacity-100 hover:text-[#EF4444]"><Trash2 size={12} /></button>
                  </button>
                  <AnimatePresence>
                    {isExpanded && (
                      <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }} transition={{ duration: 0.25 }} className="overflow-hidden">
                        {sectionQuestions.map((question, qIdx) => {
                          const isQSelected = selectedQuestionId === question.id;
                          return (
                            <button key={question.id}
                              onClick={() => { setSelectedQuestionId(question.id); setSelectedSectionId(section.id); setActiveTab('questions'); }}
                              className={`w-full flex items-center gap-2 pl-8 pr-2 py-1.5 rounded-lg text-left transition-colors ${isQSelected ? 'bg-[#DBEAFE] border-l-[3px] border-[#2563EB]' : 'hover:bg-[#F8FAFC]'}`}>
                              <GripVertical size={14} className="text-[#CBD5E1] flex-shrink-0" />
                              <span className="text-xs text-[#0F172A] flex-1 truncate">{qIdx + 1}. {question.questionText.substring(0, 40)}...</span>
                              <button onClick={e => { e.stopPropagation(); handleDeleteQuestion(question.id); }} className="text-[#CBD5E1] hover:text-[#EF4444]"><Trash2 size={10} /></button>
                            </button>
                          );
                        })}
                        <button onClick={() => openModal('create-question', { templateId: template.id, sectionId: section.id })} className="w-full flex items-center gap-2 pl-8 pr-2 py-1.5 text-xs text-[#94A3B8] hover:text-[#2563EB] transition-colors">
                          <Plus size={12} />Add Question
                        </button>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              );
            })}
          </div>
        </div>

        <div className="flex-1 min-w-0">
          <div className="flex gap-0 border-b-2 border-[#E2E8F0] mb-6 overflow-x-auto">
            {tabs.map(tab => (
              <button key={tab.id} onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-2 px-4 py-3 text-sm font-medium whitespace-nowrap transition-colors relative -mb-[2px] ${activeTab === tab.id ? 'text-[#2563EB] border-b-2 border-[#2563EB]' : 'text-[#64748B] hover:text-[#0F172A] hover:bg-[#F8FAFC]'}`}>
                <tab.icon size={16} />{tab.label}
              </button>
            ))}
          </div>

          <AnimatePresence mode="wait">
            <motion.div key={activeTab} initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.2 }}>
              {activeTab === 'info' && <TemplateInfoTab template={template} dispatch={dispatch} />}
              {activeTab === 'sections' && <SectionsTab sections={templateSections} selectedSectionId={selectedSectionId} dispatch={dispatch} addToast={addToast} />}
              {activeTab === 'questions' && <QuestionsTab template={template} sections={templateSections} selectedQuestionId={selectedQuestionId} getAnswerOptions={getAnswerOptions} dispatch={dispatch} addToast={addToast} allQuestions={state.data.questions} />}
              {activeTab === 'scoring' && <ScoringTab sections={templateSections} />}
              {activeTab === 'recommendations' && <RecommendationsTab />}
              {activeTab === 'preview' && <PreviewTab template={template} sections={templateSections} getSectionQuestions={getSectionQuestions} getAnswerOptions={getAnswerOptions} />}
            </motion.div>
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}

/* Template Info Tab */
function TemplateInfoTab({ template, dispatch }: { template: any; dispatch: any }) {
  const [form, setForm] = useState({
    name: template.name, code: template.code, categoryId: template.categoryId,
    type: template.type, scoringModel: template.scoringModel,
    description: template.description, objective: template.objective,
    respondentInstructions: template.respondentInstructions, assessorInstructions: template.assessorInstructions,
  });

  const update = (field: string, value: string) => {
    setForm(prev => ({ ...prev, [field]: value }));
    dispatch({ type: 'UPDATE_TEMPLATE', payload: { ...template, ...form, [field]: value, updatedAt: new Date().toISOString() } });
  };

  return (
    <div className="bg-white rounded-xl border border-[#E2E8F0] shadow-layer1 p-6">
      <div className="grid grid-cols-2 gap-5">
        <div className="col-span-2">
          <label className="label">Assessment Name</label>
          <input className="input-field w-full" value={form.name} onChange={e => update('name', e.target.value)} />
        </div>
        <div>
          <label className="label">Assessment Code</label>
          <input className="input-field w-full" value={form.code} onChange={e => update('code', e.target.value)} />
        </div>
        <div>
          <label className="label">Category</label>
          <select className="input-field w-full" value={form.categoryId} onChange={e => update('categoryId', e.target.value)}>
            {categories.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
          </select>
        </div>
        <div>
          <label className="label">Type</label>
          <select className="input-field w-full" value={form.type} onChange={e => update('type', e.target.value)}>
            {['Maturity', 'Readiness', 'Compliance', 'Risk', 'Capability', 'Custom'].map(t => <option key={t} value={t}>{t}</option>)}
          </select>
        </div>
        <div>
          <label className="label">Scoring Model</label>
          <select className="input-field w-full" value={form.scoringModel} onChange={e => update('scoringModel', e.target.value)}>
            {['Simple Average', 'Weighted Average', 'Section-based', 'Maturity Level', 'Percentage', 'Pass-Fail'].map(s => <option key={s} value={s}>{s}</option>)}
          </select>
        </div>
        <div className="col-span-2">
          <label className="label">Description</label>
          <textarea className="input-field w-full min-h-[80px] py-2" rows={3} value={form.description} onChange={e => update('description', e.target.value)} />
        </div>
        <div className="col-span-2">
          <label className="label">Objective</label>
          <textarea className="input-field w-full min-h-[60px] py-2" rows={2} value={form.objective} onChange={e => update('objective', e.target.value)} />
        </div>
        <div className="col-span-2">
          <label className="label">Respondent Instructions</label>
          <textarea className="input-field w-full min-h-[100px] py-2" rows={4} value={form.respondentInstructions} onChange={e => update('respondentInstructions', e.target.value)} />
        </div>
        <div className="col-span-2">
          <label className="label">Assessor Instructions</label>
          <textarea className="input-field w-full min-h-[100px] py-2" rows={4} value={form.assessorInstructions} onChange={e => update('assessorInstructions', e.target.value)} />
        </div>
      </div>
    </div>
  );
}

/* Sections Tab */
function SectionsTab({ sections, selectedSectionId, dispatch, addToast }: { sections: any[]; selectedSectionId: string | null; dispatch: any; addToast: any }) {
  const selected = sections.find(s => s.id === selectedSectionId);
  const [name, setName] = useState('');
  const [desc, setDesc] = useState('');
  const [weight, setWeight] = useState(10);

  const handleUpdate = () => {
    if (!selected) return;
    dispatch({ type: 'UPDATE_SECTION', payload: { ...selected, name: name || selected.name, description: desc, weight } });
    addToast({ type: 'success', title: 'Updated', message: 'Section updated.' });
  };

  return (
    <div className="space-y-5">
      <div className="bg-white rounded-xl border border-[#E2E8F0] shadow-layer1 p-6">
        <h3 className="text-base font-semibold text-[#0F172A] mb-4">Section Configuration</h3>
        {selected ? (
          <div className="space-y-4">
            <div>
              <label className="label">Section Name</label>
              <input className="input-field w-full" defaultValue={selected.name} onChange={e => setName(e.target.value)} />
            </div>
            <div>
              <label className="label">Description</label>
              <textarea className="input-field w-full min-h-[60px] py-2" rows={2} defaultValue={selected.description} onChange={e => setDesc(e.target.value)} />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="label">Weight (%)</label>
                <input type="number" className="input-field w-full" min={0} max={100} defaultValue={selected.weight} onChange={e => setWeight(Number(e.target.value))} />
              </div>
              <div>
                <label className="label">Display Order</label>
                <input type="number" className="input-field w-full" defaultValue={selected.displayOrder} readOnly />
              </div>
            </div>
            <div className="flex items-center gap-3">
              <label className="flex items-center gap-2 text-sm text-[#0F172A]">
                <input type="checkbox" defaultChecked={selected.status === 'Active'} className="w-[18px] h-[18px] rounded border-2 border-[#CBD5E1] text-[#2563EB]" />
                Active
              </label>
            </div>
            <button onClick={handleUpdate} className="btn-primary text-sm">Save Changes</button>
          </div>
        ) : <p className="text-sm text-[#64748B] text-center py-8">Select a section from the structure tree.</p>}
      </div>
      <div className="bg-white rounded-xl border border-[#E2E8F0] shadow-layer1 p-4">
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm font-medium text-[#0F172A]">Total Section Weight</span>
          <span className="text-sm font-bold text-[#0F172A]">{sections.reduce((sum, s) => sum + s.weight, 0)}%</span>
        </div>
        <div className="h-2 bg-[#E2E8F0] rounded-full overflow-hidden">
          {sections.map((s, i) => <div key={s.id} className="h-full float-left" style={{ width: `${s.weight}%`, background: ['#2563EB', '#10B981', '#F59E0B', '#EF4444', '#8B5CF6', '#06B6D4', '#EC4899'][i % 7] }} />)}
        </div>
      </div>
    </div>
  );
}

/* Questions Tab */
function QuestionsTab({ template, sections, selectedQuestionId, getAnswerOptions, dispatch, addToast, allQuestions }: any) {
  const selected = template ? allQuestions.find((q: any) => q.id === selectedQuestionId) : null;
  const options = selected ? getAnswerOptions(selected.id) : [];
  const [questionText, setQuestionText] = useState('');
  const [answerType, setAnswerType] = useState('Rating Scale');
  const [isMandatory, setIsMandatory] = useState(true);
  const [evidenceReq, setEvidenceReq] = useState('Optional');
  const [helpText, setHelpText] = useState('');

  const handleUpdate = () => {
    if (!selected) return;
    dispatch({ type: 'UPDATE_QUESTION', payload: { ...selected, questionText: questionText || selected.questionText, answerType, isMandatory, evidenceRequirement: evidenceReq, helpText } });
    addToast({ type: 'success', title: 'Updated', message: 'Question updated.' });
  };

  if (!selected) {
    return <div className="bg-white rounded-xl border border-[#E2E8F0] shadow-layer1 p-8 text-center"><HelpCircle size={48} className="mx-auto text-[#CBD5E1] mb-4" /><h3 className="text-lg font-semibold text-[#0F172A] mb-2">Select a Question</h3><p className="text-sm text-[#64748B]">Choose a question from the structure tree.</p></div>;
  }

  return (
    <div className="space-y-5">
      <div className="bg-white rounded-xl border border-[#E2E8F0] shadow-layer1 p-6">
        <h3 className="text-base font-semibold text-[#0F172A] mb-4">Question Configuration</h3>
        <div className="space-y-4">
          <div>
            <label className="label">Question Text</label>
            <textarea className="input-field w-full min-h-[60px] py-2" rows={2} defaultValue={selected.questionText} onChange={e => setQuestionText(e.target.value)} />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="label">Section</label>
              <select className="input-field w-full" value={selected.sectionId} onChange={() => {}}>
                {sections.map((s: any) => <option key={s.id} value={s.id}>{s.name}</option>)}
              </select>
            </div>
            <div>
              <label className="label">Answer Type</label>
              <select className="input-field w-full" value={answerType} onChange={e => setAnswerType(e.target.value)}>
                {['Single Choice', 'Multiple Choice', 'Rating Scale', 'Yes/No', 'Text', 'Number', 'Dropdown'].map(t => <option key={t} value={t}>{t}</option>)}
              </select>
            </div>
          </div>
          <div className="grid grid-cols-3 gap-4">
            <div>
              <label className="label">Weight</label>
              <input type="number" className="input-field w-full" step={0.1} defaultValue={selected.weight} />
            </div>
            <div>
              <label className="label">Evidence</label>
              <select className="input-field w-full" value={evidenceReq} onChange={e => setEvidenceReq(e.target.value)}>
                <option>Not Required</option><option>Optional</option><option>Required</option>
              </select>
            </div>
            <div>
              <label className="label">Display Order</label>
              <input type="number" className="input-field w-full" defaultValue={selected.displayOrder} readOnly />
            </div>
          </div>
          <div>
            <label className="label">Help Text</label>
            <textarea className="input-field w-full min-h-[60px] py-2" rows={2} defaultValue={selected.helpText} onChange={e => setHelpText(e.target.value)} />
          </div>
          <div className="flex items-center gap-4">
            <label className="flex items-center gap-2 text-sm text-[#0F172A]">
              <input type="checkbox" checked={isMandatory} onChange={e => setIsMandatory(e.target.checked)} className="w-[18px] h-[18px] rounded border-2 border-[#CBD5E1] text-[#2563EB]" />
              Mandatory
            </label>
          </div>
          <button onClick={handleUpdate} className="btn-primary text-sm">Save Changes</button>
        </div>
      </div>
      {options.length > 0 && (
        <div className="bg-white rounded-xl border border-[#E2E8F0] shadow-layer1 p-6">
          <h3 className="text-base font-semibold text-[#0F172A] mb-4">Answer Options</h3>
          <table className="w-full">
            <thead><tr className="border-b-2 border-[#E2E8F0]">{['Label', 'Description', 'Score', 'Trigger'].map(h => <th key={h} className="text-left text-xs font-semibold text-[#64748B] uppercase pb-2 pr-4">{h}</th>)}</tr></thead>
            <tbody>
              {options.map((opt: any) => (
                <tr key={opt.id} className="border-b border-[#F1F5F9] hover:bg-[#F8FAFC]">
                  <td className="py-2.5 pr-4 text-sm text-[#0F172A]">{opt.label}</td>
                  <td className="py-2.5 pr-4 text-xs text-[#64748B]">{opt.description}</td>
                  <td className="py-2.5 pr-4 text-sm font-medium text-[#0F172A]">{opt.score}</td>
                  <td className="py-2.5">{opt.recommendationTrigger ? <span className={`status-badge text-[10px] py-0.5 px-2 status-badge-${opt.recommendationTrigger.toLowerCase()}`}>{opt.recommendationTrigger}</span> : <span className="text-xs text-[#94A3B8]">None</span>}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

/* Scoring Tab */
function ScoringTab({ sections }: { sections: any[] }) {
  const maturityLevels = [
    { min: 0, max: 1.49, name: 'Level 1: Initial', desc: 'Ad hoc, inconsistent' },
    { min: 1.5, max: 2.49, name: 'Level 2: Developing', desc: 'Some practices exist' },
    { min: 2.5, max: 3.49, name: 'Level 3: Defined', desc: 'Documented and repeatable' },
    { min: 3.5, max: 4.49, name: 'Level 4: Managed', desc: 'Measured and governed' },
    { min: 4.5, max: 5, name: 'Level 5: Optimized', desc: 'Continuously improved' },
  ];
  return (
    <div className="space-y-5">
      <div className="bg-white rounded-xl border border-[#E2E8F0] shadow-layer1 p-6">
        <h3 className="text-base font-semibold text-[#0F172A] mb-4">Maturity Level Mapping</h3>
        <table className="w-full">
          <thead><tr className="border-b-2 border-[#E2E8F0]">{['Score Range', 'Maturity Level', 'Description'].map(h => <th key={h} className="text-left text-xs font-semibold text-[#64748B] uppercase pb-2 pr-4">{h}</th>)}</tr></thead>
          <tbody>
            {maturityLevels.map((level, i) => (
              <tr key={i} className="border-b border-[#F1F5F9] hover:bg-[#F8FAFC]">
                <td className="py-3 pr-4"><div className="flex items-center gap-2"><input type="number" defaultValue={level.min} className="input-field w-16 text-center" step={0.01} /><span className="text-[#94A3B8]">—</span><input type="number" defaultValue={level.max} className="input-field w-16 text-center" step={0.01} /></div></td>
                <td className="py-3 pr-4 text-sm font-medium text-[#0F172A]">{level.name}</td>
                <td className="py-3 text-xs text-[#64748B]">{level.desc}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className="bg-white rounded-xl border border-[#E2E8F0] shadow-layer1 p-6">
        <h3 className="text-base font-semibold text-[#0F172A] mb-4">Target Scores</h3>
        <div className="mb-4">
          <label className="label">Overall Target Score</label>
          <input type="number" defaultValue={4.0} min={0} max={5} step={0.1} className="input-field w-32" />
        </div>
        <table className="w-full">
          <thead><tr className="border-b-2 border-[#E2E8F0]">{['Section', 'Weight', 'Target Score'].map(h => <th key={h} className="text-left text-xs font-semibold text-[#64748B] uppercase pb-2 pr-4">{h}</th>)}</tr></thead>
          <tbody>
            {sections.map(s => (
              <tr key={s.id} className="border-b border-[#F1F5F9] hover:bg-[#F8FAFC]">
                <td className="py-2.5 pr-4 text-sm text-[#0F172A]">{s.name}</td>
                <td className="py-2.5 pr-4 text-xs text-[#64748B]">{s.weight}%</td>
                <td className="py-2.5"><input type="number" defaultValue={4.0} min={0} max={5} step={0.1} className="input-field w-24" /></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

/* Recommendations Tab */
function RecommendationsTab() {
  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between">
        <h3 className="text-base font-semibold text-[#0F172A]">Recommendation Rules</h3>
        <button className="btn-primary text-xs h-8"><Plus size={14} className="mr-1" />Add Rule</button>
      </div>
      <div className="bg-white rounded-xl border border-[#E2E8F0] shadow-layer1 p-6 space-y-4">
        {[
          { condition: 'EA Governance score < 3.0', action: 'Establish a formal EA Governance Framework including architecture review boards, compliance checkpoints, and exception management.', priority: 'High' },
          { condition: 'EA Repository score < 2.5', action: 'Implement a centralized EA repository with data quality governance and regular model maintenance processes.', priority: 'Medium' },
          { condition: 'Stakeholder Engagement score < 2.0', action: 'Create a structured stakeholder engagement program with regular communication, defined touchpoints, and feedback mechanisms.', priority: 'High' },
        ].map((rule, i) => (
          <div key={i} className="border border-[#E2E8F0] rounded-lg p-4">
            <div className="flex items-start justify-between mb-2">
              <span className="text-xs font-medium text-[#64748B] uppercase tracking-wider">Rule {i + 1}</span>
              <span className={`status-badge text-[10px] py-0.5 px-2 status-badge-${rule.priority.toLowerCase()}`}>{rule.priority}</span>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div><label className="label text-[10px]">If</label><input type="text" defaultValue={rule.condition} className="input-field w-full text-sm" /></div>
              <div><label className="label text-[10px]">Then</label><textarea defaultValue={rule.action} className="input-field w-full min-h-[60px] py-2 text-sm" rows={2} /></div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

/* Preview Tab */
function PreviewTab({ template, sections, getSectionQuestions, getAnswerOptions }: any) {
  const [expanded, setExpanded] = useState<string[]>(['s1']);
  const toggle = (id: string) => setExpanded(p => p.includes(id) ? p.filter(x => x !== id) : [...p, id]);
  if (!template) return null;
  return (
    <div className="max-w-2xl mx-auto">
      <div className="bg-white rounded-xl border border-[#E2E8F0] shadow-layer1 p-8">
        <h2 className="font-display text-2xl font-semibold text-[#0F172A] mb-2">{template.name}</h2>
        <div className="bg-[#F8FAFC] border-l-4 border-[#2563EB] rounded-r-lg p-4 mb-8"><p className="text-sm text-[#64748B]">{template.respondentInstructions}</p></div>
        {sections.map((section: any) => {
          const sq = getSectionQuestions(section.id);
          const isExpanded = expanded.includes(section.id);
          return (
            <div key={section.id} className="mb-4 border border-[#E2E8F0] rounded-lg overflow-hidden">
              <button onClick={() => toggle(section.id)} className="w-full flex items-center justify-between px-4 py-3 bg-[#F8FAFC] hover:bg-[#F1F5F9] transition-colors">
                <span className="text-sm font-semibold text-[#0F172A]">{section.name}</span>
                {isExpanded ? <ChevronDown size={16} className="text-[#94A3B8]" /> : <ChevronRight size={16} className="text-[#94A3B8]" />}
              </button>
              <AnimatePresence>
                {isExpanded && (
                  <motion.div initial={{ height: 0 }} animate={{ height: 'auto' }} exit={{ height: 0 }} transition={{ duration: 0.25 }} className="overflow-hidden">
                    {sq.map((question: any, qIdx: number) => {
                      const opts = getAnswerOptions(question.id);
                      return (
                        <div key={question.id} className="px-4 py-4 border-t border-[#F1F5F9]">
                          <div className="flex items-start gap-2 mb-3">
                            <span className="text-xs text-[#94A3B8] font-medium mt-0.5">Q{qIdx + 1}</span>
                            {question.isMandatory && <span className="text-[#EF4444] text-sm">*</span>}
                            <span className="text-sm font-medium text-[#0F172A]">{question.questionText}</span>
                          </div>
                          <div className="ml-6">
                            {question.answerType === 'Rating Scale' && opts.length > 0 && (
                              <div>
                                <div className="flex gap-2">
                                  {[1, 2, 3, 4, 5].map(score => (
                                    <button key={score} className="w-11 h-11 rounded-lg border border-[#E2E8F0] text-sm font-medium text-[#64748B] hover:bg-[#DBEAFE] hover:border-[#2563EB] hover:text-[#2563EB] transition-all">{score}</button>
                                  ))}
                                </div>
                                <div className="flex justify-between mt-2">
                                  <span className="text-[10px] text-[#94A3B8]">{opts.find((o: any) => o.score === 1)?.label}</span>
                                  <span className="text-[10px] text-[#94A3B8]">{opts.find((o: any) => o.score === 5)?.label}</span>
                                </div>
                              </div>
                            )}
                            {question.answerType === 'Single Choice' && opts.length > 0 && (
                              <div className="space-y-2">
                                {opts.map((opt: any) => <label key={opt.id} className="flex items-center gap-3 p-3 rounded-lg border border-[#E2E8F0] cursor-pointer hover:bg-[#F8FAFC]"><input type="radio" name={question.id} className="w-4 h-4 text-[#2563EB]" /><span className="text-sm text-[#0F172A]">{opt.label}</span></label>)}
                              </div>
                            )}
                            {question.answerType === 'Yes/No' && (
                              <div className="flex gap-2">
                                <button className="px-8 py-2.5 rounded-lg border border-[#E2E8F0] text-sm text-[#0F172A]">Yes</button>
                                <button className="px-8 py-2.5 rounded-lg border border-[#E2E8F0] text-sm text-[#0F172A]">No</button>
                              </div>
                            )}
                          </div>
                        </div>
                      );
                    })}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          );
        })}
        <div className="flex justify-end mt-6 pt-4 border-t border-[#E2E8F0]">
          <button className="btn-secondary text-sm mr-2">Save Progress</button>
          <button className="btn-primary text-sm">Submit Assessment</button>
        </div>
      </div>
    </div>
  );
}
