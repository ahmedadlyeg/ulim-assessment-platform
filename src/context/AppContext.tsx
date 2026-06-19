import React, { createContext, useContext, useReducer, useCallback } from 'react';
import type {
  AppState, PageType, Toast, AssessmentCategory, AssessmentTemplate,
  AssessmentSection, AssessmentQuestion, AnswerOption, AssessmentEvent,
  EventRespondent, AssessmentResponse, AssessmentEvidence, AssessmentResult,
  SectionResult, Recommendation, Task, ActivityLog
} from '@/types';
import * as mockData from '@/data/mockData';

// ===== FULL DATA STATE =====
export interface DataState {
  categories: AssessmentCategory[];
  templates: AssessmentTemplate[];
  sections: AssessmentSection[];
  questions: AssessmentQuestion[];
  answerOptions: AnswerOption[];
  events: AssessmentEvent[];
  eventRespondents: EventRespondent[];
  responses: AssessmentResponse[];
  evidence: AssessmentEvidence[];
  results: AssessmentResult[];
  sectionResults: SectionResult[];
  recommendations: Recommendation[];
  tasks: Task[];
  activityLogs: ActivityLog[];
}

const initialData: DataState = {
  categories: [...mockData.categories],
  templates: [...mockData.templates],
  sections: [...mockData.sections],
  questions: [...mockData.questions],
  answerOptions: [...mockData.answerOptions],
  events: [...mockData.events],
  eventRespondents: [...mockData.eventRespondents],
  responses: [...mockData.responses],
  evidence: [...mockData.evidence],
  results: [...mockData.results],
  sectionResults: [...mockData.sectionResults],
  recommendations: [...mockData.recommendations],
  tasks: [...mockData.tasks],
  activityLogs: [...mockData.activityLogs],
};

const initialState: AppState = {
  currentPage: 'dashboard',
  selectedTemplateId: null,
  selectedEventId: null,
  sidebarCollapsed: false,
  commandPaletteOpen: false,
  activeModal: null,
  modalData: null,
  toasts: [],
};

// ===== ACTION TYPES =====
type UIAction =
  | { type: 'NAVIGATE'; page: PageType; templateId?: string; eventId?: string }
  | { type: 'TOGGLE_SIDEBAR' }
  | { type: 'OPEN_MODAL'; modal: string; data?: Record<string, unknown> }
  | { type: 'CLOSE_MODAL' }
  | { type: 'ADD_TOAST'; toast: Toast }
  | { type: 'REMOVE_TOAST'; id: string }
  | { type: 'OPEN_COMMAND_PALETTE' }
  | { type: 'CLOSE_COMMAND_PALETTE' };

type CRUDAction =
  | { type: 'CREATE_CATEGORY'; payload: AssessmentCategory }
  | { type: 'UPDATE_CATEGORY'; payload: AssessmentCategory }
  | { type: 'DELETE_CATEGORY'; id: string }
  | { type: 'CREATE_TEMPLATE'; payload: AssessmentTemplate }
  | { type: 'UPDATE_TEMPLATE'; payload: AssessmentTemplate }
  | { type: 'DELETE_TEMPLATE'; id: string }
  | { type: 'CLONE_TEMPLATE'; originalId: string; newTemplate: AssessmentTemplate; newSections: AssessmentSection[]; newQuestions: AssessmentQuestion[]; newOptions: AnswerOption[] }
  | { type: 'CREATE_SECTION'; payload: AssessmentSection }
  | { type: 'UPDATE_SECTION'; payload: AssessmentSection }
  | { type: 'DELETE_SECTION'; id: string }
  | { type: 'CREATE_QUESTION'; payload: AssessmentQuestion }
  | { type: 'UPDATE_QUESTION'; payload: AssessmentQuestion }
  | { type: 'DELETE_QUESTION'; id: string }
  | { type: 'CREATE_OPTION'; payload: AnswerOption }
  | { type: 'UPDATE_OPTION'; payload: AnswerOption }
  | { type: 'DELETE_OPTION'; id: string }
  | { type: 'CREATE_EVENT'; payload: AssessmentEvent }
  | { type: 'UPDATE_EVENT'; payload: AssessmentEvent }
  | { type: 'DELETE_EVENT'; id: string }
  | { type: 'CREATE_RESPONDENT'; payload: EventRespondent }
  | { type: 'UPDATE_RESPONDENT'; payload: EventRespondent }
  | { type: 'DELETE_RESPONDENT'; id: string }
  | { type: 'ADD_RESPONSE'; payload: AssessmentResponse }
  | { type: 'CREATE_RESULT'; payload: AssessmentResult; sectionResults: SectionResult[] }
  | { type: 'CREATE_RECOMMENDATION'; payload: Recommendation }
  | { type: 'UPDATE_RECOMMENDATION'; payload: Recommendation }
  | { type: 'DELETE_RECOMMENDATION'; id: string }
  | { type: 'CONVERT_REC_TO_TASK'; recommendationId: string; task: Task }
  | { type: 'CREATE_TASK'; payload: Task }
  | { type: 'UPDATE_TASK'; payload: Task }
  | { type: 'DELETE_TASK'; id: string }
  | { type: 'ADD_ACTIVITY'; payload: ActivityLog };

type Action = UIAction | CRUDAction;

// ===== HELPER: generate UUID =====
function generateId(): string {
  return Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
}

// ===== REDUCER =====
function dataReducer(state: DataState, action: CRUDAction): DataState {
  switch (action.type) {
    // CATEGORIES
    case 'CREATE_CATEGORY':
      return { ...state, categories: [...state.categories, action.payload] };
    case 'UPDATE_CATEGORY':
      return { ...state, categories: state.categories.map(c => c.id === action.payload.id ? action.payload : c) };
    case 'DELETE_CATEGORY':
      return { ...state, categories: state.categories.filter(c => c.id !== action.id) };

    // TEMPLATES
    case 'CREATE_TEMPLATE':
      return { ...state, templates: [...state.templates, action.payload] };
    case 'UPDATE_TEMPLATE':
      return { ...state, templates: state.templates.map(t => t.id === action.payload.id ? action.payload : t) };
    case 'DELETE_TEMPLATE':
      return { ...state, templates: state.templates.filter(t => t.id !== action.id) };
    case 'CLONE_TEMPLATE': {
      const { originalId, newTemplate, newSections, newQuestions, newOptions } = action;
      const origSections = state.sections.filter(s => s.templateId === originalId);
      const sectionIdMap: Record<string, string> = {};
      origSections.forEach((s, i) => { sectionIdMap[s.id] = newSections[i].id; });
      const origQuestions = state.questions.filter(q => q.templateId === originalId);
      const questionIdMap: Record<string, string> = {};
      origQuestions.forEach((q, i) => { questionIdMap[q.id] = newQuestions[i].id; });
      const origOptions = state.answerOptions.filter(ao => origQuestions.some(q => q.id === ao.questionId));
      const updatedSections = newSections.map(s => ({
        ...s,
        templateId: newTemplate.id,
        parentSectionId: s.parentSectionId ? sectionIdMap[s.parentSectionId] || null : null,
      }));
      const updatedQuestions = newQuestions.map(q => ({
        ...q,
        templateId: newTemplate.id,
        sectionId: sectionIdMap[q.sectionId] || q.sectionId,
      }));
      const updatedOptions = newOptions.map((ao, i) => ({
        ...ao,
        questionId: questionIdMap[origOptions[i]?.questionId] || ao.questionId,
      }));
      return {
        ...state,
        templates: [...state.templates, newTemplate],
        sections: [...state.sections, ...updatedSections],
        questions: [...state.questions, ...updatedQuestions],
        answerOptions: [...state.answerOptions, ...updatedOptions],
      };
    }

    // SECTIONS
    case 'CREATE_SECTION':
      return { ...state, sections: [...state.sections, action.payload] };
    case 'UPDATE_SECTION':
      return { ...state, sections: state.sections.map(s => s.id === action.payload.id ? action.payload : s) };
    case 'DELETE_SECTION':
      return { ...state, sections: state.sections.filter(s => s.id !== action.id) };

    // QUESTIONS
    case 'CREATE_QUESTION':
      return { ...state, questions: [...state.questions, action.payload] };
    case 'UPDATE_QUESTION':
      return { ...state, questions: state.questions.map(q => q.id === action.payload.id ? action.payload : q) };
    case 'DELETE_QUESTION':
      return { ...state, questions: state.questions.filter(q => q.id !== action.id) };

    // OPTIONS
    case 'CREATE_OPTION':
      return { ...state, answerOptions: [...state.answerOptions, action.payload] };
    case 'UPDATE_OPTION':
      return { ...state, answerOptions: state.answerOptions.map(o => o.id === action.payload.id ? action.payload : o) };
    case 'DELETE_OPTION':
      return { ...state, answerOptions: state.answerOptions.filter(o => o.id !== action.id) };

    // EVENTS
    case 'CREATE_EVENT':
      return { ...state, events: [...state.events, action.payload] };
    case 'UPDATE_EVENT':
      return { ...state, events: state.events.map(e => e.id === action.payload.id ? action.payload : e) };
    case 'DELETE_EVENT':
      return { ...state, events: state.events.filter(e => e.id !== action.id) };

    // RESPONDENTS
    case 'CREATE_RESPONDENT':
      return { ...state, eventRespondents: [...state.eventRespondents, action.payload] };
    case 'UPDATE_RESPONDENT':
      return { ...state, eventRespondents: state.eventRespondents.map(er => er.id === action.payload.id ? action.payload : er) };
    case 'DELETE_RESPONDENT':
      return { ...state, eventRespondents: state.eventRespondents.filter(er => er.id !== action.id) };

    // RESPONSES
    case 'ADD_RESPONSE':
      return { ...state, responses: [...state.responses, action.payload] };

    // RESULTS
    case 'CREATE_RESULT':
      return {
        ...state,
        results: [...state.results, action.payload],
        sectionResults: [...state.sectionResults, ...action.sectionResults],
      };

    // RECOMMENDATIONS
    case 'CREATE_RECOMMENDATION':
      return { ...state, recommendations: [...state.recommendations, action.payload] };
    case 'UPDATE_RECOMMENDATION':
      return { ...state, recommendations: state.recommendations.map(r => r.id === action.payload.id ? action.payload : r) };
    case 'DELETE_RECOMMENDATION':
      return { ...state, recommendations: state.recommendations.filter(r => r.id !== action.id) };
    case 'CONVERT_REC_TO_TASK':
      return {
        ...state,
        tasks: [...state.tasks, action.task],
        recommendations: state.recommendations.map(r =>
          r.id === action.recommendationId
            ? { ...r, status: 'Converted to Task' as const, linkedTaskId: action.task.id }
            : r
        ),
      };

    // TASKS
    case 'CREATE_TASK':
      return { ...state, tasks: [...state.tasks, action.payload] };
    case 'UPDATE_TASK':
      return { ...state, tasks: state.tasks.map(t => t.id === action.payload.id ? action.payload : t) };
    case 'DELETE_TASK':
      return { ...state, tasks: state.tasks.filter(t => t.id !== action.id) };

    // ACTIVITY
    case 'ADD_ACTIVITY':
      return { ...state, activityLogs: [...state.activityLogs, action.payload] };

    default:
      return state;
  }
}

function uiReducer(state: AppState, action: UIAction): AppState {
  switch (action.type) {
    case 'NAVIGATE':
      return {
        ...state,
        currentPage: action.page,
        selectedTemplateId: action.templateId ?? state.selectedTemplateId,
        selectedEventId: action.eventId ?? state.selectedEventId,
      };
    case 'TOGGLE_SIDEBAR':
      return { ...state, sidebarCollapsed: !state.sidebarCollapsed };
    case 'OPEN_MODAL':
      return { ...state, activeModal: action.modal, modalData: action.data ?? null };
    case 'CLOSE_MODAL':
      return { ...state, activeModal: null, modalData: null };
    case 'ADD_TOAST':
      return { ...state, toasts: [...state.toasts, action.toast] };
    case 'REMOVE_TOAST':
      return { ...state, toasts: state.toasts.filter(t => t.id !== action.id) };
    case 'OPEN_COMMAND_PALETTE':
      return { ...state, commandPaletteOpen: true };
    case 'CLOSE_COMMAND_PALETTE':
      return { ...state, commandPaletteOpen: false };
    default:
      return state;
  }
}

// ===== COMBINED CONTEXT =====
interface FullState {
  ui: AppState;
  data: DataState;
}

const AppContext = createContext<{
  state: FullState;
  dispatch: React.Dispatch<Action>;
  navigate: (page: PageType, params?: { templateId?: string; eventId?: string }) => void;
  toggleSidebar: () => void;
  openModal: (modal: string, data?: Record<string, unknown>) => void;
  closeModal: () => void;
  addToast: (toast: Omit<Toast, 'id'>) => void;
  removeToast: (id: string) => void;
  openCommandPalette: () => void;
  closeCommandPalette: () => void;
} | null>(null);

export function AppProvider({ children }: { children: React.ReactNode }) {
  const [uiState, uiDispatch] = useReducer(uiReducer, initialState);
  const [dataState, dataDispatch] = useReducer(dataReducer, initialData);

  const dispatch = useCallback((action: Action) => {
    if ('payload' in action || 'id' in action || 'type' in action) {
      if (['CREATE_', 'UPDATE_', 'DELETE_', 'CLONE_', 'ADD_', 'CONVERT_'].some(p => (action as any).type?.startsWith(p))) {
        dataDispatch(action as CRUDAction);
        return;
      }
    }
    uiDispatch(action as UIAction);
  }, []);

  const navigate = useCallback((page: PageType, params?: { templateId?: string; eventId?: string }) => {
    uiDispatch({ type: 'NAVIGATE', page, ...params });
  }, []);

  const toggleSidebar = useCallback(() => uiDispatch({ type: 'TOGGLE_SIDEBAR' }), []);
  const openModal = useCallback((modal: string, data?: Record<string, unknown>) => uiDispatch({ type: 'OPEN_MODAL', modal, data }), []);
  const closeModal = useCallback(() => uiDispatch({ type: 'CLOSE_MODAL' }), []);
  const removeToast = useCallback((id: string) => uiDispatch({ type: 'REMOVE_TOAST', id }), []);
  const openCommandPalette = useCallback(() => uiDispatch({ type: 'OPEN_COMMAND_PALETTE' }), []);
  const closeCommandPalette = useCallback(() => uiDispatch({ type: 'CLOSE_COMMAND_PALETTE' }), []);

  const addToast = useCallback((toast: Omit<Toast, 'id'>) => {
    const id = generateId().substring(0, 8);
    uiDispatch({ type: 'ADD_TOAST', toast: { ...toast, id } });
    setTimeout(() => uiDispatch({ type: 'REMOVE_TOAST', id }), 4000);
  }, []);

  const state: FullState = { ui: uiState, data: dataState };

  return (
    <AppContext.Provider value={{
      state, dispatch, navigate, toggleSidebar, openModal, closeModal,
      addToast, removeToast, openCommandPalette, closeCommandPalette,
    }}>
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error('useApp must be within AppProvider');
  return ctx;
}

export function generateUUID(): string {
  return generateId();
}

// Re-export for convenience
export { generateId as generateIdRaw };
