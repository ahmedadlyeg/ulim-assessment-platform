import { useApp } from '@/context/AppContext';
import { CreateTemplateModal } from '@/components/modals/CreateTemplateModal';
import { CreateEventModal } from '@/components/modals/CreateEventModal';
import { CreateSectionModal } from '@/components/modals/CreateSectionModal';
import { CreateQuestionModal } from '@/components/modals/CreateQuestionModal';
import { AddRespondentModal } from '@/components/modals/AddRespondentModal';
import { SendReminderModal } from '@/components/modals/SendReminderModal';
import { ConfirmModal } from '@/components/modals/ConfirmModal';
import { ConvertToTaskModal } from '@/components/modals/ConvertToTaskModal';

export function ModalRenderer() {
  const { state, closeModal } = useApp();
  const modal = state.ui.activeModal;
  const data = state.ui.modalData;

  if (!modal) return null;

  const modals: Record<string, React.ReactNode> = {
    'create-template': <CreateTemplateModal onClose={closeModal} />,
    'create-event': <CreateEventModal onClose={closeModal} templateId={data?.templateId as string} />,
    'create-section': <CreateSectionModal onClose={closeModal} templateId={data?.templateId as string} />,
    'create-question': <CreateQuestionModal onClose={closeModal} templateId={data?.templateId as string} sectionId={data?.sectionId as string} />,
    'add-respondent': <AddRespondentModal onClose={closeModal} eventId={data?.eventId as string} />,
    'send-reminder': <SendReminderModal onClose={closeModal} eventId={data?.eventId as string} />,
    'confirm-close-event': <ConfirmModal onClose={closeModal} data={data} />,
    'confirm-delete': <ConfirmModal onClose={closeModal} data={data} />,
    'confirm-approve-rec': <ConfirmModal onClose={closeModal} data={data} />,
    'convert-to-task': <ConvertToTaskModal onClose={closeModal} recommendationId={data?.recommendationId as string} />,
  };

  return modals[modal] || null;
}
