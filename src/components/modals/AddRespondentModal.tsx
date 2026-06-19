import { useState } from 'react';
import { useApp, generateUUID } from '@/context/AppContext';
import { Users } from 'lucide-react';
import { ModalBase } from './CreateTemplateModal';

export function AddRespondentModal({ onClose, eventId }: { onClose: () => void; eventId: string }) {
  const { state, dispatch } = useApp();
  const [selectedUsers, setSelectedUsers] = useState<string[]>([]);

  const availableUsers = state.data.events.filter(e => e.id === eventId).length > 0
    ? [
        { id: 'u3', name: 'Sarah Williams', department: 'Business Operations' },
        { id: 'u4', name: 'Michael Park', department: 'Digital Transformation' },
        { id: 'u5', name: 'Emily Rodriguez', department: 'Compliance' },
        { id: 'u6', name: 'David Thompson', department: 'Finance' },
        { id: 'u7', name: 'Lisa Nakamura', department: 'HR' },
        { id: 'u8', name: 'Robert Kim', department: 'IT Operations' },
        { id: 'u10', name: 'Carlos Mendez', department: 'Risk Management' },
      ].filter(u => !state.data.eventRespondents.some(er => er.eventId === eventId && er.respondentId === u.id))
    : [];

  const toggleUser = (userId: string) => {
    setSelectedUsers(prev => prev.includes(userId) ? prev.filter(id => id !== userId) : [...prev, userId]);
  };

  const handleAdd = () => {
    selectedUsers.forEach(userId => {
      dispatch({
        type: 'CREATE_RESPONDENT',
        payload: { id: generateUUID(), eventId, respondentId: userId, assignedSections: null, status: 'Not Started', progressPercentage: 0, startedAt: null, submittedAt: null },
      });
    });
    onClose();
  };

  return (
    <ModalBase onClose={onClose} title="Add Respondents" icon={<Users size={18} />}>
      <div className="space-y-3">
        {availableUsers.length === 0 ? (
          <p className="text-sm text-[#64748B] text-center py-6">All available users have been assigned.</p>
        ) : (
          <>
            <p className="text-xs text-[#64748B] mb-2">Select users to assign to this assessment:</p>
            {availableUsers.map(user => (
              <label key={user.id} className={`flex items-center gap-3 p-3 rounded-lg border cursor-pointer transition-colors ${selectedUsers.includes(user.id) ? 'border-[#2563EB] bg-[#DBEAFE]' : 'border-[#E2E8F0] hover:bg-[#F8FAFC]'}`}>
                <input type="checkbox" checked={selectedUsers.includes(user.id)} onChange={() => toggleUser(user.id)} className="w-[18px] h-[18px] rounded border-2 border-[#CBD5E1] text-[#2563EB]" />
                <div className="w-8 h-8 rounded-full bg-[#2563EB] flex items-center justify-center text-white text-xs font-medium">
                  {user.name.split(' ').map(n => n[0]).join('')}
                </div>
                <div>
                  <p className="text-sm font-medium text-[#0F172A]">{user.name}</p>
                  <p className="text-xs text-[#64748B]">{user.department}</p>
                </div>
              </label>
            ))}
            <div className="flex justify-end gap-3 pt-2">
              <button onClick={onClose} className="btn-text text-sm">Cancel</button>
              <button onClick={handleAdd} disabled={selectedUsers.length === 0} className="btn-primary text-sm disabled:opacity-50">
                Add {selectedUsers.length > 0 && `(${selectedUsers.length})`}
              </button>
            </div>
          </>
        )}
      </div>
    </ModalBase>
  );
}
