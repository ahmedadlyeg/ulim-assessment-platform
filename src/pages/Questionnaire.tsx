import { useState } from 'react';
import { useApp, generateUUID } from '@/context/AppContext';
import { events, templates, sections, questions, answerOptions } from '@/data/mockData';
import { ArrowLeft, CheckCircle, HelpCircle, UploadCloud, ChevronRight, ChevronLeft, Send, AlertTriangle } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';

export function Questionnaire() {
  const { state, navigate, dispatch, addToast } = useApp();
  const [activeSection, setActiveSection] = useState('s1');
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [comments, setComments] = useState<Record<string, string>>({});
  const [showSubmitConfirm, setShowSubmitConfirm] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [savedIndicator, setSavedIndicator] = useState(false);

  const event = state.ui.selectedEventId ? events.find(e => e.id === state.ui.selectedEventId) : events[0];
  if (!event) return null;

  const template = templates.find(t => t.id === event.templateId);
  const eventSections = template ? sections.filter(s => s.templateId === template.id) : [];
  const currentSection = eventSections.find(s => s.id === activeSection);
  const sectionQuestions = currentSection ? questions.filter(q => q.sectionId === currentSection.id) : [];
  const allQuestions = questions.filter(q => sections.find(s => s.id === q.sectionId)?.templateId === template?.id);
  const answeredCount = Object.keys(answers).length;
  const totalQuestions = allQuestions.length;
  const progress = Math.round((answeredCount / totalQuestions) * 100);
  const getAnswerOptions = (questionId: string) => answerOptions.filter(ao => ao.questionId === questionId);

  const handleAnswer = (questionId: string, value: string) => {
    setAnswers(prev => ({ ...prev, [questionId]: value }));
    setSavedIndicator(true);
    setTimeout(() => setSavedIndicator(false), 2000);
  };

  const handleSubmit = () => {
    setShowSubmitConfirm(false);
    setSubmitted(true);
    // Save all responses
    allQuestions.forEach(q => {
      if (answers[q.id]) {
        const option = getAnswerOptions(q.id).find(o => o.id === answers[q.id]);
        dispatch({ type: 'ADD_RESPONSE', payload: { id: generateUUID(), eventId: event.id, respondentId: 'u3', questionId: q.id, answerValue: option?.label || answers[q.id], selectedOptionId: option?.id || null, score: option?.score || null, comment: comments[q.id] || null, submittedAt: new Date().toISOString() } });
      }
    });
    dispatch({ type: 'ADD_ACTIVITY', payload: { id: generateUUID(), eventId: event.id, userId: 'u3', action: 'Submitted', description: 'Assessment response submitted', entityType: 'Response', entityId: generateUUID(), createdAt: new Date().toISOString() } });
    addToast({ type: 'success', title: 'Submitted', message: 'Your assessment has been submitted successfully.' });
  };

  const sectionProgress = (sectionId: string) => {
    const sq = questions.filter(q => q.sectionId === sectionId);
    const ans = sq.filter(q => answers[q.id]).length;
    return { answered: ans, total: sq.length };
  };

  if (submitted) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="bg-white rounded-xl border border-[#E2E8F0] shadow-layer2 p-12 text-center max-w-md">
          <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ type: 'spring', damping: 15, stiffness: 200, delay: 0.2 }}>
            <CheckCircle size={64} className="mx-auto text-[#10B981] mb-4" />
          </motion.div>
          <h2 className="text-2xl font-semibold text-[#0F172A] mb-2">Assessment Submitted</h2>
          <p className="text-sm text-[#64748B] mb-6">Your responses have been recorded. You will be notified once the assessor reviews your submission.</p>
          <button onClick={() => navigate('dashboard')} className="btn-primary">Return to Dashboard</button>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <button onClick={() => navigate('dashboard')} className="p-2 rounded-lg text-[#64748B] hover:bg-[#F1F5F9] hover:text-[#0F172A] transition-colors"><ArrowLeft size={20} /></button>
          <div>
            <h1 className="text-lg font-semibold text-[#0F172A]">{event.eventName}</h1>
            <p className="text-xs text-[#64748B]">Due {new Date(event.endDate).toLocaleDateString()}</p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <AnimatePresence>
            {savedIndicator && <motion.span initial={{ opacity: 0, x: 10 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0 }} className="text-xs text-[#10B981] font-medium flex items-center gap-1"><CheckCircle size={12} /> All changes saved</motion.span>}
          </AnimatePresence>
          <div className="w-8 h-8 rounded-full bg-[#2563EB] flex items-center justify-center text-white text-xs font-medium">SC</div>
        </div>
      </div>

      <div className="flex gap-6">
        <div className="w-64 flex-shrink-0">
          <div className="bg-white rounded-xl border border-[#E2E8F0] shadow-layer1 p-4 sticky top-6">
            <h3 className="text-sm font-semibold text-[#0F172A] mb-3">Sections</h3>
            <div className="space-y-1">
              {eventSections.map(section => {
                const sp = sectionProgress(section.id);
                const isActive = activeSection === section.id;
                const complete = sp.answered === sp.total && sp.total > 0;
                const partial = sp.answered > 0 && sp.answered < sp.total;
                return (
                  <button key={section.id} onClick={() => setActiveSection(section.id)} className={`w-full flex items-center gap-2.5 px-3 py-2.5 rounded-lg text-left transition-colors ${isActive ? 'bg-[#DBEAFE] border-l-[3px] border-[#2563EB]' : 'hover:bg-[#F8FAFC]'}`}>
                    <div className={`w-2.5 h-2.5 rounded-full flex-shrink-0 ${complete ? 'bg-[#10B981]' : partial ? 'bg-[#F59E0B]' : 'bg-[#E2E8F0]'}`} />
                    <span className={`text-xs flex-1 truncate ${isActive ? 'font-medium text-[#0F172A]' : 'text-[#64748B]'}`}>{section.name}</span>
                    <span className="text-[10px] text-[#94A3B8] flex-shrink-0">{sp.answered}/{sp.total}</span>
                  </button>
                );
              })}
            </div>
            <button onClick={() => setShowSubmitConfirm(true)} disabled={answeredCount < totalQuestions} className={`w-full mt-4 h-10 rounded-lg text-sm font-medium transition-colors flex items-center justify-center gap-2 ${answeredCount >= totalQuestions ? 'bg-[#2563EB] text-white hover:bg-[#1D4ED8]' : 'bg-[#E2E8F0] text-[#94A3B8] cursor-not-allowed'}`}>
              <Send size={14} />Submit Assessment
            </button>
          </div>
        </div>

        <div className="flex-1 min-w-0">
          <div className="bg-[#F8FAFC] border-l-4 border-[#2563EB] rounded-r-lg p-4 mb-6">
            <p className="text-sm text-[#64748B]">{template?.respondentInstructions}</p>
          </div>
          {currentSection && <div className="mb-6"><h2 className="text-xl font-bold text-[#0F172A]">{currentSection.name}</h2><p className="text-sm text-[#64748B] mt-1">{currentSection.description}</p></div>}
          <div className="space-y-6">
            <AnimatePresence mode="wait">
              <motion.div key={activeSection} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} transition={{ duration: 0.3 }}>
                {sectionQuestions.map((question, qIdx) => {
                  const options = getAnswerOptions(question.id);
                  const currentAnswer = answers[question.id];
                  return (
                    <motion.div key={question.id} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: qIdx * 0.05 }}
                      className="bg-white rounded-xl border border-[#E2E8F0] shadow-layer1 p-6 mb-4">
                      <div className="flex items-start justify-between mb-3">
                        <div className="flex items-center gap-2">
                          <span className="text-xs text-[#94A3B8] font-medium">Q{qIdx + 1}</span>
                          {question.isMandatory && <span className="text-[#EF4444] text-sm">*</span>}
                        </div>
                        {question.helpText && <div className="group relative"><HelpCircle size={18} className="text-[#94A3B8] cursor-help" /><div className="absolute right-0 top-8 w-64 bg-white rounded-lg shadow-layer3 border border-[#E2E8F0] p-3 text-xs text-[#64748B] opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all z-10">{question.helpText}</div></div>}
                      </div>
                      <p className="text-sm font-medium text-[#0F172A] mb-4">{question.questionText}</p>
                      <div>
                        {question.answerType === 'Rating Scale' && options.length > 0 && (
                          <div>
                            <div className="flex gap-2">
                              {options.sort((a, b) => a.score - b.score).map(opt => (
                                <button key={opt.id} onClick={() => handleAnswer(question.id, opt.id)} className={`w-11 h-11 rounded-lg border text-sm font-medium transition-all ${currentAnswer === opt.id ? 'bg-[#2563EB] border-[#2563EB] text-white scale-105' : 'border-[#E2E8F0] text-[#64748B] hover:bg-[#DBEAFE] hover:border-[#2563EB]'}`}>{opt.score}</button>
                              ))}
                            </div>
                            <div className="flex justify-between mt-2">
                              <span className="text-[10px] text-[#94A3B8]">{options.find(o => o.score === 1)?.label}</span>
                              <span className="text-[10px] text-[#94A3B8]">{options.find(o => o.score === 5)?.label}</span>
                            </div>
                          </div>
                        )}
                        {question.answerType === 'Single Choice' && options.length > 0 && (
                          <div className="space-y-2">
                            {options.map(opt => <label key={opt.id} className={`flex items-center gap-3 p-3 rounded-lg border cursor-pointer transition-colors ${currentAnswer === opt.id ? 'border-[#2563EB] bg-[#DBEAFE]' : 'border-[#E2E8F0] hover:bg-[#F8FAFC]'}`}><input type="radio" name={question.id} checked={currentAnswer === opt.id} onChange={() => handleAnswer(question.id, opt.id)} className="w-4 h-4 text-[#2563EB]" /><span className="text-sm text-[#0F172A]">{opt.label}</span></label>)}
                          </div>
                        )}
                        {question.answerType === 'Yes/No' && (
                          <div className="flex gap-2">
                            {['Yes', 'No'].map(val => <button key={val} onClick={() => handleAnswer(question.id, val)} className={`px-8 py-2.5 rounded-lg border text-sm font-medium transition-all ${currentAnswer === val ? 'bg-[#2563EB] border-[#2563EB] text-white' : 'border-[#E2E8F0] text-[#0F172A] hover:bg-[#F8FAFC]'}`}>{val}</button>)}
                          </div>
                        )}
                        {(question.answerType === 'Text' || question.answerType === 'Number') && <input type={question.answerType === 'Number' ? 'number' : 'text'} value={currentAnswer || ''} onChange={e => handleAnswer(question.id, e.target.value)} className="input-field w-full max-w-md" placeholder="Enter your answer..." />}
                      </div>
                      {currentAnswer && options.find(o => o.id === currentAnswer) && <p className="text-xs text-[#64748B] mt-2">Score: {options.find(o => o.id === currentAnswer)?.score}/5</p>}
                      <div className="mt-4">
                        {comments[question.id] !== undefined ? (
                          <textarea value={comments[question.id]} onChange={e => setComments(prev => ({ ...prev, [question.id]: e.target.value }))} placeholder="Add any additional context or notes..." className="input-field w-full min-h-[80px] py-2 mt-2 text-sm" rows={3} />
                        ) : <button onClick={() => setComments(prev => ({ ...prev, [question.id]: '' }))} className="text-xs text-[#2563EB] font-medium hover:underline">+ Add Comment</button>}
                      </div>
                      {(question.evidenceRequirement === 'Optional' || question.evidenceRequirement === 'Required') && (
                        <div className="mt-4">
                          <div className="border-2 border-dashed border-[#CBD5E1] rounded-xl p-6 text-center hover:border-[#2563EB] hover:bg-[rgba(37,99,235,0.02)] transition-all cursor-pointer">
                            <UploadCloud size={36} className="mx-auto text-[#94A3B8] mb-2" />
                            <p className="text-sm text-[#64748B]">Drag and drop files here, or click to browse</p>
                            {question.evidenceRequirement === 'Required' && <span className="text-xs text-[#EF4444] mt-1 inline-block">* Required</span>}
                          </div>
                        </div>
                      )}
                    </motion.div>
                  );
                })}
              </motion.div>
            </AnimatePresence>
          </div>
          <div className="sticky bottom-0 bg-white border-t border-[#E2E8F0] mt-6 -mx-6 px-6 py-4 flex items-center justify-between">
            <button onClick={() => { const idx = eventSections.findIndex(s => s.id === activeSection); if (idx > 0) setActiveSection(eventSections[idx - 1].id); }} disabled={eventSections.findIndex(s => s.id === activeSection) === 0} className="btn-text text-sm disabled:opacity-50"><ChevronLeft size={16} className="mr-1" />Previous</button>
            <span className="text-xs text-[#64748B]">{answeredCount} of {totalQuestions} answered</span>
            <button onClick={() => { const idx = eventSections.findIndex(s => s.id === activeSection); if (idx < eventSections.length - 1) setActiveSection(eventSections[idx + 1].id); }} disabled={eventSections.findIndex(s => s.id === activeSection) === eventSections.length - 1} className="btn-primary text-sm disabled:opacity-50">Next<ChevronRight size={16} className="ml-1" /></button>
          </div>
        </div>

        <div className="w-48 flex-shrink-0 hidden xl:block">
          <div className="bg-white rounded-xl border border-[#E2E8F0] shadow-layer1 p-4 sticky top-6">
            <div className="flex justify-center mb-3">
              <ResponsiveContainer width={60} height={60}><PieChart><Pie data={[{ value: answeredCount }, { value: totalQuestions - answeredCount }]} cx="50%" cy="50%" innerRadius={18} outerRadius={28} dataKey="value"><Cell fill="#2563EB" /><Cell fill="#E2E8F0" /></Pie></PieChart></ResponsiveContainer>
            </div>
            <p className="text-center text-sm font-bold text-[#0F172A] mb-1">{progress}%</p>
            <p className="text-center text-xs text-[#64748B] mb-4">{answeredCount} of {totalQuestions} answered</p>
            <div className="space-y-2">
              {eventSections.map(section => { const sp = sectionProgress(section.id); return <div key={section.id} className="flex items-center justify-between"><span className="text-[10px] text-[#64748B] truncate flex-1">{section.name}</span><span className="text-[10px] text-[#94A3B8] ml-2">{sp.answered}/{sp.total}</span></div>; })}
            </div>
          </div>
        </div>
      </div>

      <AnimatePresence>
        {showSubmitConfirm && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-[100] flex items-center justify-center" onClick={() => setShowSubmitConfirm(false)}>
            <div className="absolute inset-0 bg-[rgba(15,23,42,0.4)] backdrop-blur-[4px]" />
            <motion.div initial={{ scale: 0.95, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.95, opacity: 0 }} transition={{ type: 'spring', damping: 25, stiffness: 300 }} className="relative bg-white rounded-xl shadow-layer4 border border-[#E2E8F0] w-full max-w-[480px] mx-4 p-8" onClick={e => e.stopPropagation()}>
              <div className="text-center">
                <CheckCircle size={48} className="mx-auto text-[#10B981] mb-4" />
                <h2 className="text-xl font-semibold text-[#0F172A] mb-2">Ready to Submit?</h2>
                <p className="text-sm text-[#64748B] mb-6">You have answered {answeredCount} of {totalQuestions} questions.</p>
                <div className="bg-[#F8FAFC] rounded-lg p-4 mb-6 text-left space-y-2">
                  <div className="flex items-center gap-2"><CheckCircle size={16} className="text-[#10B981]" /><span className="text-sm text-[#0F172A]">{allQuestions.filter(q => q.isMandatory).length} mandatory questions answered</span></div>
                </div>
                <p className="text-xs text-[#F59E0B] mb-6 flex items-center justify-center gap-1"><AlertTriangle size={14} />Once submitted, you cannot edit your responses.</p>
                <div className="flex gap-3 justify-center">
                  <button onClick={() => setShowSubmitConfirm(false)} className="btn-secondary text-sm">Go Back</button>
                  <button onClick={handleSubmit} className="btn-primary text-sm"><Send size={14} className="mr-1.5" />Submit Assessment</button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
