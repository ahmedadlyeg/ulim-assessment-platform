import { useState } from 'react';
import { useApp, generateUUID } from '@/context/AppContext';
import { HelpCircle } from 'lucide-react';
import { ModalBase } from './CreateTemplateModal';
import type { AnswerType, EvidenceRequirement } from '@/types';

export function CreateQuestionModal({ onClose, templateId, sectionId }: { onClose: () => void; templateId: string; sectionId: string }) {
  const { dispatch, state } = useApp();
  const section = state.data.sections.find(s => s.id === sectionId);
  const [questionText, setQuestionText] = useState('');
  const [answerType, setAnswerType] = useState<AnswerType>('Rating Scale');
  const [isMandatory, setIsMandatory] = useState(true);
  const [evidenceRequirement, setEvidenceRequirement] = useState<EvidenceRequirement>('Optional');
  const [helpText, setHelpText] = useState('');
  const [errors, setErrors] = useState<Record<string, string>>({});

  const validate = () => {
    const e: Record<string, string> = {};
    if (!questionText.trim()) e.questionText = 'Question text is required';
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleCreate = () => {
    if (!validate()) return;
    const qId = generateUUID();
    const maxOrder = Math.max(0, ...state.data.questions.filter(q => q.sectionId === sectionId).map(q => q.displayOrder));

    dispatch({
      type: 'CREATE_QUESTION',
      payload: {
        id: qId, templateId, sectionId,
        questionText, description: '', answerType,
        weight: 1, isMandatory, evidenceRequirement, helpText,
        displayOrder: maxOrder + 1, status: 'Active',
      },
    });

    // Auto-create rating scale options
    if (answerType === 'Rating Scale') {
      const labels = ['Not implemented', 'Partially implemented', 'Defined but not institutionalized', 'Implemented and monitored', 'Optimized and continuously improved'];
      labels.forEach((label, i) => {
        dispatch({
          type: 'CREATE_OPTION',
          payload: {
            id: generateUUID(), questionId: qId, label, description: label,
            score: i + 1, displayOrder: i + 1,
            recommendationTrigger: i <= 2 ? 'High' : i === 3 ? 'Medium' : null,
          },
        });
      });
    }

    onClose();
  };

  return (
    <ModalBase onClose={onClose} title="Add Question" icon={<HelpCircle size={18} />}>
      <div className="space-y-4">
        <p className="text-xs text-[#64748B]">Section: <span className="font-medium text-[#0F172A]">{section?.name}</span></p>
        <div>
          <label className="label">Question Text *</label>
          <textarea className={`input-field w-full min-h-[60px] py-2 ${errors.questionText ? 'border-red-500' : ''}`} rows={2} value={questionText} onChange={e => setQuestionText(e.target.value)} placeholder="Enter your question..." />
          {errors.questionText && <p className="text-xs text-red-500 mt-1">{errors.questionText}</p>}
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="label">Answer Type</label>
            <select className="input-field w-full" value={answerType} onChange={e => setAnswerType(e.target.value as AnswerType)}>
              {['Single Choice', 'Multiple Choice', 'Rating Scale', 'Yes/No', 'Text', 'Number', 'Dropdown'].map(t => <option key={t} value={t}>{t}</option>)}
            </select>
          </div>
          <div>
            <label className="label">Evidence</label>
            <select className="input-field w-full" value={evidenceRequirement} onChange={e => setEvidenceRequirement(e.target.value as EvidenceRequirement)}>
              <option>Not Required</option>
              <option>Optional</option>
              <option>Required</option>
            </select>
          </div>
        </div>
        <div>
          <label className="label">Help Text</label>
          <textarea className="input-field w-full min-h-[60px] py-2" rows={2} value={helpText} onChange={e => setHelpText(e.target.value)} placeholder="Instructions or examples for respondents..." />
        </div>
        <label className="flex items-center gap-2 text-sm text-[#0F172A]">
          <input type="checkbox" checked={isMandatory} onChange={e => setIsMandatory(e.target.checked)} className="w-[18px] h-[18px] rounded border-2 border-[#CBD5E1] text-[#2563EB]" />
          Mandatory Question
        </label>
        <div className="flex justify-end gap-3 pt-2">
          <button onClick={onClose} className="btn-text text-sm">Cancel</button>
          <button onClick={handleCreate} className="btn-primary text-sm">Add Question</button>
        </div>
      </div>
    </ModalBase>
  );
}
