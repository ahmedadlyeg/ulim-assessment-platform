export type AssessmentStatus = 'Draft' | 'Active' | 'Inactive' | 'Archived';
export type EventStatus = 'Draft' | 'Scheduled' | 'Open' | 'In Progress' | 'Submitted' | 'Under Review' | 'Completed' | 'Closed' | 'Cancelled';
export type RespondentStatus = 'Not Started' | 'In Progress' | 'Submitted' | 'Returned for Update' | 'Resubmitted' | 'Accepted';
export type AnswerType = 'Single Choice' | 'Multiple Choice' | 'Rating Scale' | 'Yes/No' | 'Text' | 'Number' | 'Date' | 'File Upload' | 'Matrix' | 'Dropdown';
export type ScoringModel = 'Simple Average' | 'Weighted Average' | 'Section-based' | 'Maturity Level' | 'Percentage' | 'Pass-Fail';
export type AssessmentType = 'Maturity' | 'Readiness' | 'Compliance' | 'Risk' | 'Capability' | 'Custom';
export type EvidenceRequirement = 'Not Required' | 'Optional' | 'Required';
export type GapSeverity = 'High' | 'Medium' | 'Low' | 'None';
export type Priority = 'High' | 'Medium' | 'Low';
export type RecommendationStatus = 'Draft' | 'Approved' | 'Converted to Task' | 'Deferred' | 'Rejected' | 'Completed';

export interface User {
  id: string;
  name: string;
  email: string;
  role: string;
  avatar?: string;
  department?: string;
}

export interface AssessmentCategory {
  id: string;
  name: string;
  description: string;
  displayOrder: number;
  icon: string;
  status: AssessmentStatus;
  createdBy: string;
  createdAt: string;
  updatedAt: string;
}

export interface AssessmentTemplate {
  id: string;
  categoryId: string;
  name: string;
  code: string;
  description: string;
  objective: string;
  type: AssessmentType;
  version: string;
  scoringModel: ScoringModel;
  status: AssessmentStatus;
  respondentInstructions: string;
  assessorInstructions: string;
  createdBy: string;
  createdAt: string;
  updatedAt: string;
}

export interface AssessmentSection {
  id: string;
  templateId: string;
  parentSectionId: string | null;
  name: string;
  description: string;
  weight: number;
  displayOrder: number;
  status: 'Active' | 'Inactive';
}

export interface AssessmentQuestion {
  id: string;
  templateId: string;
  sectionId: string;
  questionText: string;
  description: string;
  answerType: AnswerType;
  weight: number;
  isMandatory: boolean;
  evidenceRequirement: EvidenceRequirement;
  helpText: string;
  displayOrder: number;
  status: 'Active' | 'Inactive';
}

export interface AnswerOption {
  id: string;
  questionId: string;
  label: string;
  description: string;
  score: number;
  displayOrder: number;
  recommendationTrigger: Priority | null;
}

export interface AssessmentEvent {
  id: string;
  templateId: string;
  templateVersion: string;
  eventName: string;
  description: string;
  ownerId: string;
  assessorId: string;
  startDate: string;
  endDate: string;
  status: EventStatus;
  targetDepartment: string;
  targetAudience: string;
  instructions: string;
  createdBy: string;
  createdAt: string;
  updatedAt: string;
}

export interface EventRespondent {
  id: string;
  eventId: string;
  respondentId: string;
  assignedSections: string[] | null;
  status: RespondentStatus;
  progressPercentage: number;
  startedAt: string | null;
  submittedAt: string | null;
}

export interface AssessmentResponse {
  id: string;
  eventId: string;
  respondentId: string;
  questionId: string;
  answerValue: string;
  selectedOptionId: string | null;
  score: number | null;
  comment: string | null;
  submittedAt: string | null;
}

export interface AssessmentEvidence {
  id: string;
  responseId: string;
  fileName: string;
  fileType: string;
  fileUrl: string;
  uploadedBy: string;
  uploadedAt: string;
}

export interface AssessmentResult {
  id: string;
  eventId: string;
  overallScore: number;
  maturityLevel: string;
  targetScore: number;
  gapScore: number;
  generatedAt: string;
  generatedBy: string;
}

export interface SectionResult {
  id: string;
  resultId: string;
  sectionId: string;
  actualScore: number;
  targetScore: number;
  gapScore: number;
  gapSeverity: GapSeverity;
}

export interface Recommendation {
  id: string;
  eventId: string;
  sectionId: string;
  questionId: string | null;
  title: string;
  description: string;
  priority: Priority;
  gapSeverity: GapSeverity;
  suggestedOwnerId: string | null;
  suggestedDueDate: string | null;
  status: RecommendationStatus;
  linkedTaskId: string | null;
  createdBy: string;
  createdAt: string;
}

export interface Task {
  id: string;
  title: string;
  description: string;
  ownerId: string;
  priority: Priority;
  dueDate: string;
  status: 'Not Started' | 'In Progress' | 'Completed' | 'Cancelled';
  completionPercentage: number;
  sourceRecommendationId: string | null;
  sourceEventId: string | null;
  category: string;
  createdAt: string;
  updatedAt: string;
}

export interface ActivityLog {
  id: string;
  eventId: string;
  userId: string;
  action: string;
  description: string;
  entityType: string;
  entityId: string;
  createdAt: string;
}

export type PageType =
  | 'dashboard'
  | 'assessments'
  | 'templates'
  | 'template-builder'
  | 'event-detail'
  | 'questionnaire'
  | 'question-bank'
  | 'results'
  | 'recommendations'
  | 'tasks'
  | 'analytics'
  | 'settings';

export interface AppState {
  currentPage: PageType;
  selectedTemplateId: string | null;
  selectedEventId: string | null;
  sidebarCollapsed: boolean;
  commandPaletteOpen: boolean;
  activeModal: string | null;
  modalData: Record<string, unknown> | null;
  toasts: Toast[];
}

export interface Toast {
  id: string;
  type: 'success' | 'warning' | 'error' | 'info';
  title: string;
  message: string;
}
