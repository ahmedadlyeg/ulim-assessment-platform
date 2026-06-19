import { useState, useMemo } from 'react';
import { useApp } from '@/context/AppContext';
import { categories } from '@/data/mockData';
import { Search, FileText, Layers, BarChart, Plus, ClipboardList, Copy, Trash2, Eye } from 'lucide-react';
import { motion } from 'framer-motion';

const typeColors: Record<string, string> = { Maturity: 'bg-[#2563EB]', Readiness: 'bg-[#10B981]', Compliance: 'bg-[#F59E0B]', Risk: 'bg-[#EF4444]', Capability: 'bg-[#8B5CF6]', Custom: 'bg-[#06B6D4]' };
const statusClasses: Record<string, string> = { Active: 'status-badge-active', Draft: 'status-badge-draft', Archived: 'status-badge-closed' };

export function AssessmentList() {
  const { state, navigate, openModal, dispatch, addToast } = useApp();
  const { templates } = state.data;
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [statusFilter, setStatusFilter] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');

  const filteredTemplates = useMemo(() => templates.filter(t => {
    if (selectedCategories.length > 0 && !selectedCategories.includes(t.categoryId)) return false;
    if (statusFilter !== 'All' && t.status !== statusFilter) return false;
    if (searchQuery) { const q = searchQuery.toLowerCase(); return t.name.toLowerCase().includes(q) || t.code.toLowerCase().includes(q); }
    return true;
  }), [templates, selectedCategories, statusFilter, searchQuery]);

  const toggleCategory = (catId: string) => setSelectedCategories(prev => prev.includes(catId) ? prev.filter(id => id !== catId) : [...prev, catId]);

  const handleClone = (e: React.MouseEvent, template: typeof templates[0]) => {
    e.stopPropagation();
    const id = 'tpl-' + Math.random().toString(36).substring(2, 15);
    const newTemplate = { ...template, id, name: `${template.name} (Copy)`, code: `${template.code}-COPY`, version: '1.0', status: 'Draft' as const, createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() };
    dispatch({ type: 'CREATE_TEMPLATE', payload: newTemplate });
    addToast({ type: 'success', title: 'Template Cloned', message: `"${template.name}" has been cloned.` });
  };

  const handleDelete = (e: React.MouseEvent, template: typeof templates[0]) => {
    e.stopPropagation();
    if (confirm(`Delete "${template.name}"? This cannot be undone.`)) {
      dispatch({ type: 'DELETE_TEMPLATE', id: template.id });
      addToast({ type: 'success', title: 'Deleted', message: `Template "${template.name}" has been deleted.` });
    }
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="font-display text-4xl font-semibold text-[#0F172A] tracking-tight">Assessments</h1>
          <p className="text-sm text-[#64748B] mt-1">Manage assessment templates and categories</p>
        </div>
        <button onClick={() => openModal('create-template')} className="btn-primary"><Plus size={16} className="mr-1.5" />New Assessment</button>
      </div>

      <div className="flex gap-6">
        <div className="w-60 flex-shrink-0">
          <div className="bg-white rounded-xl border border-[#E2E8F0] shadow-layer1 p-5 sticky top-6">
            <h3 className="text-sm font-semibold text-[#0F172A] mb-3">Categories</h3>
            <div className="relative mb-3">
              <Search size={14} className="absolute left-2.5 top-1/2 -translate-y-1/2 text-[#94A3B8]" />
              <input type="text" placeholder="Filter categories..." className="input-field w-full pl-8 h-8 text-xs" />
            </div>
            <div className="space-y-1.5">
              {categories.filter(c => c.status === 'Active').map(cat => (
                <label key={cat.id} className="flex items-center gap-2.5 px-2 py-1.5 rounded-lg hover:bg-[#F8FAFC] cursor-pointer transition-colors">
                  <input type="checkbox" checked={selectedCategories.includes(cat.id)} onChange={() => toggleCategory(cat.id)} className="w-[18px] h-[18px] rounded border-2 border-[#CBD5E1] text-[#2563EB]" />
                  <span className="text-sm text-[#0F172A] flex-1 truncate">{cat.name}</span>
                  <span className="text-xs text-[#64748B]">({templates.filter(t => t.categoryId === cat.id).length})</span>
                </label>
              ))}
            </div>
            <div className="border-t border-[#E2E8F0] my-4" />
            <h3 className="text-sm font-semibold text-[#0F172A] mb-3">Status</h3>
            <div className="space-y-1">
              {['All', 'Active', 'Draft', 'Archived'].map(status => (
                <label key={status} className="flex items-center gap-2.5 px-2 py-1.5 rounded-lg hover:bg-[#F8FAFC] cursor-pointer transition-colors">
                  <input type="radio" name="status" checked={statusFilter === status} onChange={() => setStatusFilter(status)} className="w-[18px] h-[18px] text-[#2563EB]" />
                  <span className="text-sm text-[#0F172A]">{status}</span>
                </label>
              ))}
            </div>
          </div>
        </div>

        <div className="flex-1 min-w-0">
          <div className="mb-4">
            <div className="relative">
              <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#94A3B8]" />
              <input type="text" value={searchQuery} onChange={e => setSearchQuery(e.target.value)} placeholder="Search templates by name or code..." className="input-field w-full pl-10" />
            </div>
          </div>

          {filteredTemplates.length === 0 ? (
            <div className="bg-white rounded-xl border border-[#E2E8F0] shadow-layer1 p-12 text-center">
              <ClipboardList size={64} className="mx-auto text-[#CBD5E1] mb-4" />
              <h3 className="text-lg font-semibold text-[#0F172A] mb-2">No assessment templates found</h3>
              <p className="text-sm text-[#64748B] mb-4">Try adjusting your filters or create a new template.</p>
              <button onClick={() => openModal('create-template')} className="btn-primary"><Plus size={16} className="mr-1.5" />Create Template</button>
            </div>
          ) : (
            <div className="grid grid-cols-1 xl:grid-cols-2 gap-5">
              {filteredTemplates.map((template, i) => {
                const category = categories.find(c => c.id === template.categoryId);
                const sectionCount = state.data.sections.filter(s => s.templateId === template.id).length;
                const questionCount = state.data.questions.filter(q => q.templateId === template.id).length;
                return (
                  <motion.div key={template.id} initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.06, duration: 0.25 }}
                    className="bg-white rounded-xl border border-[#E2E8F0] shadow-layer1 hover:shadow-layer2 hover:-translate-y-0.5 transition-all cursor-pointer overflow-hidden group"
                    onClick={() => navigate('template-builder', { templateId: template.id })}>
                    <div className={`h-1 ${typeColors[template.type] || 'bg-[#94A3B8]'}`} />
                    <div className="p-5">
                      <div className="flex items-start justify-between mb-2">
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 mb-1">
                            <span className={`status-badge text-[10px] py-0.5 px-2 ${statusClasses[template.status] || 'status-badge-draft'}`}>{template.status}</span>
                            <span className="text-[10px] text-[#94A3B8]">{template.code}</span>
                          </div>
                          <h3 className="text-base font-semibold text-[#0F172A] truncate">{template.name}</h3>
                          <span className="text-xs text-[#94A3B8]">v{template.version}</span>
                        </div>
                        <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                          <button onClick={e => { e.stopPropagation(); navigate('template-builder', { templateId: template.id }); }} className="btn-ghost h-7 w-7" title="View"><Eye size={14} /></button>
                          <button onClick={e => handleClone(e, template)} className="btn-ghost h-7 w-7" title="Clone"><Copy size={14} /></button>
                          <button onClick={e => handleDelete(e, template)} className="btn-ghost h-7 w-7 text-[#EF4444] hover:text-[#DC2626]" title="Delete"><Trash2 size={14} /></button>
                        </div>
                      </div>
                      <p className="text-sm text-[#64748B] line-clamp-2 mb-3">{template.description}</p>
                      <p className="text-xs text-[#94A3B8] mb-3">{category?.name}</p>
                      <div className="flex items-center gap-4 text-xs text-[#64748B]">
                        <span className="flex items-center gap-1"><FileText size={14} />{questionCount} questions</span>
                        <span className="flex items-center gap-1"><Layers size={14} />{sectionCount} sections</span>
                        <span className="flex items-center gap-1"><BarChart size={14} />{template.scoringModel}</span>
                      </div>
                      <div className="flex items-center justify-between mt-4 pt-3 border-t border-[#F1F5F9]">
                        <span className="text-xs text-[#94A3B8]">{template.type}</span>
                        <button onClick={e => { e.stopPropagation(); openModal('create-event', { templateId: template.id }); }} className="btn-text text-xs h-7 px-2">Create Event</button>
                      </div>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
