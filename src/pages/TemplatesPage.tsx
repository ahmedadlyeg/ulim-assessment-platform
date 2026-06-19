import { useState, useMemo } from 'react';
import { useApp } from '@/context/AppContext';
import { generateUUID } from '@/context/AppContext';
import { motion } from 'framer-motion';
import {
  FileText, Plus, Search, MoreHorizontal,
  Copy, Trash2, Edit, Eye, ArrowUpDown, X
} from 'lucide-react';
import type { AssessmentTemplate } from '@/types';

export function TemplatesPage() {
  const { state, dispatch, navigate, addToast } = useApp();
  const { templates, categories } = state.data;
  const [search, setSearch] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');
  const [sortBy, setSortBy] = useState<'name' | 'updatedAt'>('updatedAt');
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [editingTemplate, setEditingTemplate] = useState<AssessmentTemplate | null>(null);

  // Form state
  const [formName, setFormName] = useState('');
  const [formCode, setFormCode] = useState('');
  const [formDesc, setFormDesc] = useState('');
  const [formCategory, setFormCategory] = useState('');
  const [formType, setFormType] = useState<'Maturity' | 'Readiness' | 'Compliance' | 'Risk' | 'Capability' | 'Custom'>('Maturity');
  const [formScoring, setFormScoring] = useState<'Simple Average' | 'Weighted Average' | 'Section-based' | 'Maturity Level' | 'Percentage' | 'Pass-Fail'>('Weighted Average');

  const filtered = useMemo(() => {
    let list = [...templates];
    if (search) list = list.filter(t => t.name.toLowerCase().includes(search.toLowerCase()) || t.code.toLowerCase().includes(search.toLowerCase()) || t.description.toLowerCase().includes(search.toLowerCase()));
    if (categoryFilter !== 'all') list = list.filter(t => t.categoryId === categoryFilter);
    if (statusFilter !== 'all') list = list.filter(t => t.status === statusFilter);
    list.sort((a, b) => {
      if (sortBy === 'name') return a.name.localeCompare(b.name);
      return new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime();
    });
    return list;
  }, [templates, search, categoryFilter, statusFilter, sortBy]);

  const categoryName = (catId: string) => categories.find(c => c.id === catId)?.name || 'N/A';

  const resetForm = () => {
    setFormName(''); setFormCode(''); setFormDesc(''); setFormCategory(categories[0]?.id || '');
    setFormType('Maturity'); setFormScoring('Weighted Average');
    setEditingTemplate(null);
  };

  const openCreate = () => { resetForm(); setShowCreateModal(true); };
  const openEdit = (t: AssessmentTemplate) => {
    setEditingTemplate(t);
    setFormName(t.name); setFormCode(t.code); setFormDesc(t.description);
    setFormCategory(t.categoryId); setFormType(t.type); setFormScoring(t.scoringModel);
    setShowCreateModal(true);
  };

  const handleSave = () => {
    if (!formName.trim() || !formCode.trim() || !formCategory) {
      addToast({ type: 'error', title: 'Validation Error', message: 'Name, code and category are required' });
      return;
    }
    if (editingTemplate) {
      dispatch({
        type: 'UPDATE_TEMPLATE',
        payload: { ...editingTemplate, name: formName, code: formCode, description: formDesc, categoryId: formCategory, type: formType, scoringModel: formScoring, updatedAt: new Date().toISOString() }
      });
      addToast({ type: 'success', title: 'Updated', message: 'Template updated successfully' });
    } else {
      const newTmpl: AssessmentTemplate = {
        id: generateUUID(), name: formName, code: formCode, description: formDesc,
        categoryId: formCategory, type: formType, scoringModel: formScoring,
        status: 'Draft', version: '1.0', objective: '',
        respondentInstructions: '', assessorInstructions: '',
        createdBy: 'u1', createdAt: new Date().toISOString(), updatedAt: new Date().toISOString()
      };
      dispatch({ type: 'CREATE_TEMPLATE', payload: newTmpl });
      addToast({ type: 'success', title: 'Created', message: 'Template created successfully' });
    }
    setShowCreateModal(false);
    resetForm();
  };

  const handleClone = (t: AssessmentTemplate) => {
    const cloned: AssessmentTemplate = {
      ...t, id: generateUUID(), name: t.name + ' (Copy)', code: t.code + '-COPY',
      status: 'Draft', version: '1.0', createdAt: new Date().toISOString(), updatedAt: new Date().toISOString(), createdBy: 'u1'
    };
    dispatch({ type: 'CREATE_TEMPLATE', payload: cloned });
    // Clone sections and questions too
    const srcSections = state.data.sections.filter(s => s.templateId === t.id);
    srcSections.forEach(sec => {
      const newSecId = generateUUID();
      dispatch({ type: 'CREATE_SECTION', payload: { ...sec, id: newSecId, templateId: cloned.id } });
      state.data.questions.filter(q => q.sectionId === sec.id).forEach(q => {
        dispatch({ type: 'CREATE_QUESTION', payload: { ...q, id: generateUUID(), templateId: cloned.id, sectionId: newSecId } });
      });
    });
    addToast({ type: 'success', title: 'Cloned', message: 'Template cloned successfully' });
  };

  const handleDelete = (id: string) => {
    if (confirm('Delete this template? This cannot be undone.')) {
      dispatch({ type: 'DELETE_TEMPLATE', id });
      addToast({ type: 'success', title: 'Deleted', message: 'Template deleted' });
    }
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-[#0F172A]">Templates</h1>
          <p className="text-sm text-[#64748B] mt-1">{templates.length} assessment templates</p>
        </div>
        <button onClick={openCreate} className="flex items-center gap-2 px-4 py-2 bg-[#0F172A] text-white rounded-lg text-sm font-medium hover:bg-[#1E293B] transition-colors">
          <Plus size={16} /> New Template
        </button>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap items-center gap-3 mb-4">
        <div className="relative flex-1 min-w-[200px] max-w-[320px]">
          <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#94A3B8]" />
          <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search templates..." className="w-full pl-9 pr-4 py-2 border border-[#E2E8F0] rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#2563EB]" />
        </div>
        <select value={categoryFilter} onChange={e => setCategoryFilter(e.target.value)} className="px-3 py-2 border border-[#E2E8F0] rounded-lg text-sm bg-white focus:outline-none focus:ring-2 focus:ring-[#2563EB]">
          <option value="all">All Categories</option>
          {categories.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
        </select>
        <select value={statusFilter} onChange={e => setStatusFilter(e.target.value)} className="px-3 py-2 border border-[#E2E8F0] rounded-lg text-sm bg-white focus:outline-none focus:ring-2 focus:ring-[#2563EB]">
          <option value="all">All Status</option>
          <option value="Active">Active</option>
          <option value="Draft">Draft</option>
          <option value="Inactive">Inactive</option>
        </select>
        <button onClick={() => setSortBy(sortBy === 'name' ? 'updatedAt' : 'name')} className="flex items-center gap-1 px-3 py-2 border border-[#E2E8F0] rounded-lg text-sm hover:bg-[#F1F5F9]">
          <ArrowUpDown size={14} /> {sortBy === 'name' ? 'Name' : 'Updated'}
        </button>
      </div>

      {/* Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
        {filtered.map(t => (
          <motion.div key={t.id} layout initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} className="bg-white border border-[#E2E8F0] rounded-xl p-5 hover:shadow-md transition-shadow">
            <div className="flex items-start justify-between mb-3">
              <div className="flex items-center gap-2">
                <div className={`px-2 py-0.5 rounded-full text-[10px] font-semibold ${t.status === 'Active' ? 'bg-green-100 text-green-700' : t.status === 'Draft' ? 'bg-amber-100 text-amber-700' : 'bg-gray-100 text-gray-600'}`}>{t.status}</div>
                <span className="text-[10px] text-[#94A3B8] font-medium">v{t.version}</span>
              </div>
              <div className="relative group">
                <button className="p-1.5 rounded-lg hover:bg-[#F1F5F9] text-[#64748B]"><MoreHorizontal size={16} /></button>
                <div className="absolute right-0 top-full mt-1 w-40 bg-white border border-[#E2E8F0] rounded-lg shadow-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all z-10">
                  <button onClick={() => navigate('template-builder', { templateId: t.id })} className="w-full flex items-center gap-2 px-3 py-2 text-sm text-[#334155] hover:bg-[#F1F5F9]"><Eye size={14} /> Open</button>
                  <button onClick={() => openEdit(t)} className="w-full flex items-center gap-2 px-3 py-2 text-sm text-[#334155] hover:bg-[#F1F5F9]"><Edit size={14} /> Edit</button>
                  <button onClick={() => handleClone(t)} className="w-full flex items-center gap-2 px-3 py-2 text-sm text-[#334155] hover:bg-[#F1F5F9]"><Copy size={14} /> Clone</button>
                  <button onClick={() => handleDelete(t.id)} className="w-full flex items-center gap-2 px-3 py-2 text-sm text-red-600 hover:bg-red-50"><Trash2 size={14} /> Delete</button>
                </div>
              </div>
            </div>
            <h3 className="font-semibold text-[#0F172A] text-sm mb-1 cursor-pointer hover:text-[#2563EB]" onClick={() => navigate('template-builder', { templateId: t.id })}>{t.name}</h3>
            <p className="text-xs text-[#64748B] mb-3 line-clamp-2">{t.description}</p>
            <div className="flex items-center gap-3 text-[11px] text-[#94A3B8]">
              <span className="flex items-center gap-1"><FileText size={12} /> {categoryName(t.categoryId)}</span>
              <span>{t.scoringModel}</span>
              <span>{state.data.sections.filter(s => s.templateId === t.id).length} sections</span>
            </div>
          </motion.div>
        ))}
      </div>

      {filtered.length === 0 && (
        <div className="text-center py-16 text-[#94A3B8]">
          <FileText size={48} className="mx-auto mb-4 opacity-40" />
          <p className="text-lg font-medium">No templates found</p>
          <p className="text-sm mt-1">Try adjusting your filters or create a new template</p>
        </div>
      )}

      {/* Create/Edit Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/50" onClick={() => { setShowCreateModal(false); resetForm(); }} />
          <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="relative bg-white rounded-xl shadow-xl w-full max-w-lg max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between p-5 border-b border-[#E2E8F0]">
              <h2 className="text-lg font-semibold">{editingTemplate ? 'Edit Template' : 'New Template'}</h2>
              <button onClick={() => { setShowCreateModal(false); resetForm(); }} className="p-1.5 rounded-lg hover:bg-[#F1F5F9]"><X size={18} /></button>
            </div>
            <div className="p-5 space-y-4">
              <div>
                <label className="block text-sm font-medium text-[#334155] mb-1">Template Name *</label>
                <input value={formName} onChange={e => setFormName(e.target.value)} className="w-full px-3 py-2 border border-[#E2E8F0] rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#2563EB]" placeholder="e.g., EA Maturity Assessment" />
              </div>
              <div>
                <label className="block text-sm font-medium text-[#334155] mb-1">Code *</label>
                <input value={formCode} onChange={e => setFormCode(e.target.value)} className="w-full px-3 py-2 border border-[#E2E8F0] rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#2563EB]" placeholder="e.g., EA-MA-001" />
              </div>
              <div>
                <label className="block text-sm font-medium text-[#334155] mb-1">Description</label>
                <textarea value={formDesc} onChange={e => setFormDesc(e.target.value)} rows={3} className="w-full px-3 py-2 border border-[#E2E8F0] rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#2563EB]" placeholder="Brief description..." />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-sm font-medium text-[#334155] mb-1">Category</label>
                  <select value={formCategory} onChange={e => setFormCategory(e.target.value)} className="w-full px-3 py-2 border border-[#E2E8F0] rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#2563EB]">
                    {categories.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-[#334155] mb-1">Type</label>
                  <select value={formType} onChange={e => setFormType(e.target.value as any)} className="w-full px-3 py-2 border border-[#E2E8F0] rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#2563EB]">
                    <option value="Maturity">Maturity</option>
                    <option value="Readiness">Readiness</option>
                    <option value="Compliance">Compliance</option>
                    <option value="Risk">Risk</option>
                    <option value="Capability">Capability</option>
                    <option value="Custom">Custom</option>
                  </select>
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-[#334155] mb-1">Scoring Model</label>
                <select value={formScoring} onChange={e => setFormScoring(e.target.value as any)} className="w-full px-3 py-2 border border-[#E2E8F0] rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#2563EB]">
                  <option value="Simple Average">Simple Average</option>
                  <option value="Weighted Average">Weighted Average</option>
                  <option value="Section-based">Section-based</option>
                  <option value="Maturity Level">Maturity Level</option>
                  <option value="Percentage">Percentage</option>
                  <option value="Pass-Fail">Pass-Fail</option>
                </select>
              </div>
            </div>
            <div className="flex justify-end gap-2 p-5 border-t border-[#E2E8F0] bg-[#F8FAFC]">
              <button onClick={() => { setShowCreateModal(false); resetForm(); }} className="px-4 py-2 border border-[#E2E8F0] rounded-lg text-sm hover:bg-[#F1F5F9]">Cancel</button>
              <button onClick={handleSave} className="px-4 py-2 bg-[#0F172A] text-white rounded-lg text-sm hover:bg-[#1E293B]">{editingTemplate ? 'Save Changes' : 'Create Template'}</button>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  );
}
