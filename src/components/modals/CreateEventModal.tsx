import { useState } from 'react';
import { useApp, generateUUID } from '@/context/AppContext';
import { Rocket } from 'lucide-react';
import { ModalBase } from './CreateTemplateModal';

export function CreateEventModal({ onClose, templateId }: { onClose: () => void; templateId: string }) {
  const { state, dispatch, navigate } = useApp();
  const template = state.data.templates.find(t => t.id === templateId);
  const [eventName, setEventName] = useState('');
  const [startDate, setStartDate] = useState(new Date().toISOString().split('T')[0]);
  const [endDate, setEndDate] = useState('');
  const [targetDepartment, setTargetDepartment] = useState('');
  const [instructions, setInstructions] = useState(template?.respondentInstructions || '');
  const [errors, setErrors] = useState<Record<string, string>>({});

  const validate = () => {
    const e: Record<string, string> = {};
    if (!eventName.trim()) e.eventName = 'Event name is required';
    if (!endDate) e.endDate = 'End date is required';
    if (endDate && startDate && endDate < startDate) e.endDate = 'End date must be after start date';
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleCreate = () => {
    if (!validate()) return;
    const id = generateUUID();
    const now = new Date().toISOString();
    dispatch({
      type: 'CREATE_EVENT',
      payload: {
        id, templateId: templateId || '', templateVersion: template?.version || '1.0',
        eventName, description: '', ownerId: 'u1', assessorId: 'u1',
        startDate, endDate, status: 'Draft', targetDepartment,
        targetAudience: '', instructions, createdBy: 'u1', createdAt: now, updatedAt: now,
      },
    });
    dispatch({ type: 'ADD_ACTIVITY', payload: { id: generateUUID(), eventId: id, userId: 'u1', action: 'Created', description: `Assessment event "${eventName}" created`, entityType: 'Event', entityId: id, createdAt: now } });
    onClose();
    navigate('event-detail', { eventId: id });
  };

  return (
    <ModalBase onClose={onClose} title="Create Assessment Event" icon={<Rocket size={18} />}>
      <div className="space-y-4">
        {template && (
          <div className="bg-[#F8FAFC] rounded-lg p-3">
            <p className="text-xs text-[#64748B]">Template: <span className="font-medium text-[#0F172A]">{template.name}</span> (v{template.version})</p>
          </div>
        )}
        <div>
          <label className="label">Event Name *</label>
          <input className={`input-field w-full ${errors.eventName ? 'border-red-500' : ''}`} value={eventName} onChange={e => setEventName(e.target.value)} placeholder="e.g., Q3 2026 EA Maturity Assessment" />
          {errors.eventName && <p className="text-xs text-red-500 mt-1">{errors.eventName}</p>}
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="label">Start Date</label>
            <input type="date" className="input-field w-full" value={startDate} onChange={e => setStartDate(e.target.value)} />
          </div>
          <div>
            <label className="label">End Date *</label>
            <input type="date" className={`input-field w-full ${errors.endDate ? 'border-red-500' : ''}`} value={endDate} onChange={e => setEndDate(e.target.value)} />
            {errors.endDate && <p className="text-xs text-red-500 mt-1">{errors.endDate}</p>}
          </div>
        </div>
        <div>
          <label className="label">Target Department</label>
          <input className="input-field w-full" value={targetDepartment} onChange={e => setTargetDepartment(e.target.value)} placeholder="e.g., Enterprise Architecture" />
        </div>
        <div>
          <label className="label">Instructions for Respondents</label>
          <textarea className="input-field w-full min-h-[80px] py-2" rows={3} value={instructions} onChange={e => setInstructions(e.target.value)} />
        </div>
        <div className="flex justify-end gap-3 pt-2">
          <button onClick={onClose} className="btn-text text-sm">Cancel</button>
          <button onClick={handleCreate} className="btn-primary text-sm">Create Event</button>
        </div>
      </div>
    </ModalBase>
  );
}
