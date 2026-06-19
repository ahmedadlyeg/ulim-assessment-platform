import { useState } from 'react';
import { useApp, generateUUID } from '@/context/AppContext';
import { CheckSquare } from 'lucide-react';
import { ModalBase } from './CreateTemplateModal';

export function ConvertToTaskModal({ onClose, recommendationId }: { onClose: () => void; recommendationId: string }) {
  const { state, dispatch, addToast } = useApp();
  const rec = state.data.recommendations.find(r => r.id === recommendationId);
  const [title, setTitle] = useState(rec?.title || '');
  const [description, setDescription] = useState(rec?.description || '');
  const [ownerId, setOwnerId] = useState(rec?.suggestedOwnerId || '');
  const [priority, setPriority] = useState(rec?.priority || 'Medium');
  const [dueDate, setDueDate] = useState(rec?.suggestedDueDate || '');
  const [errors, setErrors] = useState<Record<string, string>>({});

  const validate = () => {
    const e: Record<string, string> = {};
    if (!title.trim()) e.title = 'Title is required';
    if (!ownerId) e.ownerId = 'Owner is required';
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleConvert = () => {
    if (!validate()) return;
    const taskId = generateUUID();
    const now = new Date().toISOString();

    dispatch({
      type: 'CONVERT_REC_TO_TASK',
      recommendationId,
      task: {
        id: taskId,
        title,
        description,
        ownerId,
        priority: priority as 'High' | 'Medium' | 'Low',
        dueDate: dueDate || now,
        status: 'Not Started',
        completionPercentage: 0,
        sourceRecommendationId: recommendationId,
        sourceEventId: rec?.eventId || null,
        category: state.data.sections.find(s => s.id === rec?.sectionId)?.name || 'General',
        createdAt: now,
        updatedAt: now,
      },
    });

    addToast({ type: 'success', title: 'Task Created', message: 'Recommendation has been successfully converted to a task.' });
    onClose();
  };

  if (!rec) return null;

  return (
    <ModalBase onClose={onClose} title="Convert to Task" icon={<CheckSquare size={18} />}>
      <div className="space-y-4">
        <div className="bg-[#F8FAFC] rounded-lg p-3">
          <p className="text-xs text-[#64748B]">Source: <span className="font-medium text-[#0F172A]">{rec.title}</span></p>
          <p className="text-xs text-[#64748B] mt-1">Gap: <span className="font-medium text-[#EF4444]">{rec.gapSeverity}</span></p>
        </div>
        <div>
          <label className="label">Task Title *</label>
          <input className={`input-field w-full ${errors.title ? 'border-red-500' : ''}`} value={title} onChange={e => setTitle(e.target.value)} />
          {errors.title && <p className="text-xs text-red-500 mt-1">{errors.title}</p>}
        </div>
        <div>
          <label className="label">Description</label>
          <textarea className="input-field w-full min-h-[80px] py-2" rows={3} value={description} onChange={e => setDescription(e.target.value)} />
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="label">Owner *</label>
            <select className={`input-field w-full ${errors.ownerId ? 'border-red-500' : ''}`} value={ownerId} onChange={e => setOwnerId(e.target.value)}>
              <option value="">Select owner...</option>
              {[
                { id: 'u1', name: 'Alexandra Mitchell' },
                { id: 'u2', name: 'James Chen' },
                { id: 'u3', name: 'Sarah Williams' },
                { id: 'u4', name: 'Michael Park' },
                { id: 'u5', name: 'Emily Rodriguez' },
                { id: 'u8', name: 'Robert Kim' },
              ].map(u => <option key={u.id} value={u.id}>{u.name}</option>)}
            </select>
            {errors.ownerId && <p className="text-xs text-red-500 mt-1">{errors.ownerId}</p>}
          </div>
          <div>
            <label className="label">Priority</label>
            <select className="input-field w-full" value={priority} onChange={e => setPriority(e.target.value as 'High' | 'Medium' | 'Low')}>
              <option>High</option>
              <option>Medium</option>
              <option>Low</option>
            </select>
          </div>
        </div>
        <div>
          <label className="label">Due Date</label>
          <input type="date" className="input-field w-full" value={dueDate} onChange={e => setDueDate(e.target.value)} />
        </div>
        <div className="flex justify-end gap-3 pt-2">
          <button onClick={onClose} className="btn-text text-sm">Cancel</button>
          <button onClick={handleConvert} className="btn-primary text-sm">
            <CheckSquare size={14} className="mr-1.5" />
            Create Task
          </button>
        </div>
      </div>
    </ModalBase>
  );
}
