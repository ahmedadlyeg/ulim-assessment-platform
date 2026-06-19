import { useState } from 'react';
import { useApp, generateUUID } from '@/context/AppContext';
import { X, FileText } from 'lucide-react';
import { motion } from 'framer-motion';

export function CreateTemplateModal({ onClose }: { onClose: () => void }) {
  const { state, dispatch, navigate } = useApp();
  const [name, setName] = useState('');
  const [code, setCode] = useState('');
  const [categoryId, setCategoryId] = useState(state.data.categories[0]?.id || '');
  const [type, setType] = useState<'Maturity' | 'Readiness' | 'Compliance' | 'Risk' | 'Capability' | 'Custom'>('Maturity');
  const [scoringModel, setScoringModel] = useState('Weighted Average');
  const [description, setDescription] = useState('');
  const [errors, setErrors] = useState<Record<string, string>>({});

  const validate = () => {
    const e: Record<string, string> = {};
    if (!name.trim()) e.name = 'Name is required';
    if (!code.trim()) e.code = 'Code is required';
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleCreate = () => {
    if (!validate()) return;
    const id = generateUUID();
    const now = new Date().toISOString();
    dispatch({
      type: 'CREATE_TEMPLATE',
      payload: {
        id, categoryId, name, code: code.toUpperCase(), description,
        objective: '', type: type as any, version: '1.0', scoringModel: scoringModel as any,
        status: 'Draft', respondentInstructions: '', assessorInstructions: '',
        createdBy: 'u1', createdAt: now, updatedAt: now,
      },
    });
    dispatch({ type: 'ADD_ACTIVITY', payload: { id: generateUUID(), eventId: '', userId: 'u1', action: 'Created', description: `Assessment template "${name}" created`, entityType: 'Template', entityId: id, createdAt: now } });
    onClose();
    navigate('template-builder', { templateId: id });
  };

  return (
    <ModalBase onClose={onClose} title="Create Assessment Template" icon={<FileText size={18} />}>
      <div className="space-y-4">
        <div>
          <label className="label">Assessment Name *</label>
          <input className={`input-field w-full ${errors.name ? 'border-red-500' : ''}`} value={name} onChange={e => setName(e.target.value)} placeholder="e.g., EA Maturity Assessment" />
          {errors.name && <p className="text-xs text-red-500 mt-1">{errors.name}</p>}
        </div>
        <div>
          <label className="label">Assessment Code *</label>
          <input className={`input-field w-full ${errors.code ? 'border-red-500' : ''}`} value={code} onChange={e => setCode(e.target.value)} placeholder="e.g., EA-MA-001" />
          {errors.code && <p className="text-xs text-red-500 mt-1">{errors.code}</p>}
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="label">Category</label>
            <select className="input-field w-full" value={categoryId} onChange={e => setCategoryId(e.target.value)}>
              {state.data.categories.filter(c => c.status === 'Active').map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
            </select>
          </div>
          <div>
            <label className="label">Type</label>
            <select className="input-field w-full" value={type} onChange={e => setType(e.target.value as typeof type)}>
              {['Maturity', 'Readiness', 'Compliance', 'Risk', 'Capability', 'Custom'].map(t => <option key={t} value={t}>{t}</option>)}
            </select>
          </div>
        </div>
        <div>
          <label className="label">Scoring Model</label>
          <select className="input-field w-full" value={scoringModel} onChange={e => setScoringModel(e.target.value)}>
            {['Simple Average', 'Weighted Average', 'Section-based', 'Maturity Level', 'Percentage', 'Pass-Fail'].map(s => <option key={s} value={s}>{s}</option>)}
          </select>
        </div>
        <div>
          <label className="label">Description</label>
          <textarea className="input-field w-full min-h-[80px] py-2" rows={3} value={description} onChange={e => setDescription(e.target.value)} placeholder="Brief description of the assessment..." />
        </div>
        <div className="flex justify-end gap-3 pt-2">
          <button onClick={onClose} className="btn-text text-sm">Cancel</button>
          <button onClick={handleCreate} className="btn-primary text-sm">Create Template</button>
        </div>
      </div>
    </ModalBase>
  );
}

export function ModalBase({ onClose, title, icon, children }: { onClose: () => void; title: string; icon?: React.ReactNode; children: React.ReactNode }) {
  return (
    <motion.div
      initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
      className="fixed inset-0 z-[100] flex items-center justify-center"
      onClick={onClose}
    >
      <div className="absolute inset-0 bg-[rgba(15,23,42,0.4)] backdrop-blur-[4px]" />
      <motion.div
        initial={{ scale: 0.95, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.95, opacity: 0 }}
        transition={{ type: 'spring', damping: 25, stiffness: 300 }}
        className="relative bg-white rounded-xl shadow-layer4 border border-[#E2E8F0] w-full max-w-[560px] mx-4 max-h-[85vh] flex flex-col"
        onClick={e => e.stopPropagation()}
      >
        <div className="flex items-center gap-2 px-5 py-4 border-b border-[#E2E8F0]">
          {icon && <span className="text-[#64748B]">{icon}</span>}
          <h3 className="text-base font-semibold text-[#0F172A] flex-1">{title}</h3>
          <button onClick={onClose} className="btn-ghost h-8 w-8"><X size={18} /></button>
        </div>
        <div className="p-5 overflow-y-auto scrollbar-thin">{children}</div>
      </motion.div>
    </motion.div>
  );
}

// Shared label style
export function Label({ children }: { children: React.ReactNode }) {
  return <label className="block text-xs font-semibold text-[#0F172A] mb-1.5">{children}</label>;
}
