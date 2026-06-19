import { useState } from 'react';
import { useApp, generateUUID } from '@/context/AppContext';
import { Layers } from 'lucide-react';
import { ModalBase } from './CreateTemplateModal';

export function CreateSectionModal({ onClose, templateId }: { onClose: () => void; templateId: string }) {
  const { dispatch } = useApp();
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [weight, setWeight] = useState(10);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const validate = () => {
    const e: Record<string, string> = {};
    if (!name.trim()) e.name = 'Section name is required';
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleCreate = () => {
    if (!validate()) return;
    const maxOrder = Math.max(0, ...useApp().state.data.sections.filter(s => s.templateId === templateId).map(s => s.displayOrder));
    dispatch({
      type: 'CREATE_SECTION',
      payload: {
        id: generateUUID(), templateId, parentSectionId: null,
        name, description, weight, displayOrder: maxOrder + 1, status: 'Active',
      },
    });
    onClose();
  };

  return (
    <ModalBase onClose={onClose} title="Add Section" icon={<Layers size={18} />}>
      <div className="space-y-4">
        <div>
          <label className="label">Section Name *</label>
          <input className={`input-field w-full ${errors.name ? 'border-red-500' : ''}`} value={name} onChange={e => setName(e.target.value)} placeholder="e.g., EA Governance" />
          {errors.name && <p className="text-xs text-red-500 mt-1">{errors.name}</p>}
        </div>
        <div>
          <label className="label">Description</label>
          <textarea className="input-field w-full min-h-[60px] py-2" rows={2} value={description} onChange={e => setDescription(e.target.value)} />
        </div>
        <div>
          <label className="label">Weight (%)</label>
          <input type="number" className="input-field w-32" min={0} max={100} value={weight} onChange={e => setWeight(Number(e.target.value))} />
        </div>
        <div className="flex justify-end gap-3 pt-2">
          <button onClick={onClose} className="btn-text text-sm">Cancel</button>
          <button onClick={handleCreate} className="btn-primary text-sm">Add Section</button>
        </div>
      </div>
    </ModalBase>
  );
}
