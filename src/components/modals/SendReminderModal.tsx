import { useState } from 'react';
import { useApp } from '@/context/AppContext';
import { Send } from 'lucide-react';
import { ModalBase } from './CreateTemplateModal';

export function SendReminderModal({ onClose, eventId }: { onClose: () => void; eventId: string }) {
  const { state, addToast } = useApp();
  const [message, setMessage] = useState('');
  const [sendToAll, setSendToAll] = useState(true);

  const respondents = state.data.eventRespondents.filter(er => er.eventId === eventId && (er.status === 'Not Started' || er.status === 'In Progress'));
  const event = state.data.events.find(e => e.id === eventId);

  const handleSend = () => {
    addToast({ type: 'success', title: 'Reminder Sent', message: `Reminder sent to ${respondents.length} respondent${respondents.length > 1 ? 's' : ''} for "${event?.eventName}".` });
    onClose();
  };

  return (
    <ModalBase onClose={onClose} title="Send Reminder" icon={<Send size={18} />}>
      <div className="space-y-4">
        <p className="text-sm text-[#64748B]">Send a reminder to respondents who haven&apos;t completed the assessment.</p>
        <div className="bg-[#F8FAFC] rounded-lg p-3">
          <p className="text-xs text-[#64748B]">Event: <span className="font-medium text-[#0F172A]">{event?.eventName}</span></p>
          <p className="text-xs text-[#64748B] mt-1">Recipients: <span className="font-medium text-[#0F172A]">{respondents.length} pending</span></p>
        </div>
        <div>
          <label className="label">Custom Message (optional)</label>
          <textarea className="input-field w-full min-h-[80px] py-2" rows={3} value={message} onChange={e => setMessage(e.target.value)} placeholder="Enter a custom reminder message..." />
        </div>
        <label className="flex items-center gap-2 text-sm text-[#0F172A]">
          <input type="checkbox" checked={sendToAll} onChange={e => setSendToAll(e.target.checked)} className="w-[18px] h-[18px] rounded border-2 border-[#CBD5E1] text-[#2563EB]" />
          Send to all incomplete respondents
        </label>
        <div className="flex justify-end gap-3 pt-2">
          <button onClick={onClose} className="btn-text text-sm">Cancel</button>
          <button onClick={handleSend} className="btn-primary text-sm">
            <Send size={14} className="mr-1.5" />
            Send Reminder
          </button>
        </div>
      </div>
    </ModalBase>
  );
}
