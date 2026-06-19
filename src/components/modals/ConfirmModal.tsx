import { useApp, generateUUID } from '@/context/AppContext';
import { AlertTriangle, CheckCircle, Trash2, XOctagon } from 'lucide-react';
import { ModalBase } from './CreateTemplateModal';

export function ConfirmModal({ onClose, data }: { onClose: () => void; data?: Record<string, unknown> | null }) {
  const { dispatch, addToast } = useApp();
  const action = (data?.action as string) || '';
  const entityType = (data?.entityType as string) || '';
  const entityId = (data?.entityId as string) || '';
  const title = (data?.title as string) || '';

  const handleConfirm = () => {
    const now = new Date().toISOString();

    switch (action) {
      case 'close-event':
        dispatch({ type: 'UPDATE_EVENT', payload: { ...dispatch as any, status: 'Closed' } as any });
        // Find and update
        dispatch({ type: 'UPDATE_EVENT', payload: { id: entityId, status: 'Closed' } as any });
        addToast({ type: 'success', title: 'Event Closed', message: `Assessment event has been closed.` });
        break;
      case 'delete-template':
        dispatch({ type: 'DELETE_TEMPLATE', id: entityId });
        addToast({ type: 'success', title: 'Template Deleted', message: `Template "${title}" has been deleted.` });
        break;
      case 'delete-event':
        dispatch({ type: 'DELETE_EVENT', id: entityId });
        addToast({ type: 'success', title: 'Event Deleted', message: `Event "${title}" has been deleted.` });
        break;
      case 'approve-recommendation':
        dispatch({ type: 'UPDATE_RECOMMENDATION', payload: { id: entityId, status: 'Approved' } as any });
        addToast({ type: 'success', title: 'Recommendation Approved', message: 'Recommendation has been approved.' });
        break;
      case 'delete-recommendation':
        dispatch({ type: 'DELETE_RECOMMENDATION', id: entityId });
        addToast({ type: 'success', title: 'Deleted', message: 'Recommendation has been deleted.' });
        break;
      case 'delete-section':
        dispatch({ type: 'DELETE_SECTION', id: entityId });
        addToast({ type: 'success', title: 'Deleted', message: 'Section has been deleted.' });
        break;
      case 'delete-question':
        dispatch({ type: 'DELETE_QUESTION', id: entityId });
        addToast({ type: 'success', title: 'Deleted', message: 'Question has been deleted.' });
        break;
    }

    dispatch({ type: 'ADD_ACTIVITY', payload: { id: generateUUID(), eventId: '', userId: 'u1', action: action === 'close-event' ? 'Closed' : 'Deleted', description: `${entityType} "${title}" ${action === 'close-event' ? 'closed' : 'deleted'}`, entityType, entityId, createdAt: now } });
    onClose();
  };

  const config: Record<string, { icon: React.ReactNode; title: string; message: string; confirmLabel: string; confirmClass: string }> = {
    'close-event': { icon: <XOctagon size={48} className="text-[#F59E0B]" />, title: 'Close Assessment Event', message: `Are you sure you want to close "${title}"? Closed events become read-only.`, confirmLabel: 'Close Event', confirmClass: 'btn-primary' },
    'delete-template': { icon: <Trash2 size={48} className="text-[#EF4444]" />, title: 'Delete Template', message: `Delete "${title}"? This action cannot be undone.`, confirmLabel: 'Delete', confirmClass: 'btn-danger' },
    'delete-event': { icon: <Trash2 size={48} className="text-[#EF4444]" />, title: 'Delete Event', message: `Delete "${title}"? All associated data will be removed.`, confirmLabel: 'Delete', confirmClass: 'btn-danger' },
    'approve-recommendation': { icon: <CheckCircle size={48} className="text-[#10B981]" />, title: 'Approve Recommendation', message: `Approve "${title}"? It can then be converted to a task.`, confirmLabel: 'Approve', confirmClass: 'btn-primary' },
    'delete-recommendation': { icon: <Trash2 size={48} className="text-[#EF4444]" />, title: 'Delete Recommendation', message: `Delete "${title}"? This action cannot be undone.`, confirmLabel: 'Delete', confirmClass: 'btn-danger' },
    'delete-section': { icon: <Trash2 size={48} className="text-[#EF4444]" />, title: 'Delete Section', message: `Delete section "${title}" and all its questions?`, confirmLabel: 'Delete', confirmClass: 'btn-danger' },
    'delete-question': { icon: <Trash2 size={48} className="text-[#EF4444]" />, title: 'Delete Question', message: `Delete "${title}"?`, confirmLabel: 'Delete', confirmClass: 'btn-danger' },
  };

  const c = config[action] || { icon: <AlertTriangle size={48} className="text-[#F59E0B]" />, title: 'Confirm Action', message: 'Are you sure?', confirmLabel: 'Confirm', confirmClass: 'btn-primary' };

  return (
    <ModalBase onClose={onClose} title={c.title}>
      <div className="text-center py-4">
        <div className="mb-4">{c.icon}</div>
        <p className="text-sm text-[#64748B] mb-6">{c.message}</p>
        <div className="flex justify-center gap-3">
          <button onClick={onClose} className="btn-text text-sm">Cancel</button>
          <button onClick={handleConfirm} className={`${c.confirmClass} text-sm`}>{c.confirmLabel}</button>
        </div>
      </div>
    </ModalBase>
  );
}
