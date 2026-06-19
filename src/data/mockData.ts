import type {
  User, AssessmentCategory, AssessmentTemplate, AssessmentSection,
  AssessmentQuestion, AnswerOption, AssessmentEvent, EventRespondent,
  AssessmentResponse, AssessmentEvidence, AssessmentResult, SectionResult,
  Recommendation, Task, ActivityLog
} from '@/types';

export const currentUser: User = {
  id: 'u1',
  name: 'Alexandra Mitchell',
  email: 'alex.mitchell@ulim.io',
  role: 'Assessment Admin',
  department: 'Enterprise Architecture',
};

export const users: User[] = [
  currentUser,
  { id: 'u2', name: 'James Chen', email: 'james.chen@ulim.io', role: 'Assessor', department: 'IT Strategy' },
  { id: 'u3', name: 'Sarah Williams', email: 'sarah.w@ulim.io', role: 'Respondent', department: 'Business Operations' },
  { id: 'u4', name: 'Michael Park', email: 'm.park@ulim.io', role: 'Respondent', department: 'Digital Transformation' },
  { id: 'u5', name: 'Emily Rodriguez', email: 'emily.r@ulim.io', role: 'Respondent', department: 'Compliance' },
  { id: 'u6', name: 'David Thompson', email: 'd.thompson@ulim.io', role: 'Respondent', department: 'Finance' },
  { id: 'u7', name: 'Lisa Nakamura', email: 'lisa.n@ulim.io', role: 'Respondent', department: 'HR' },
  { id: 'u8', name: 'Robert Kim', email: 'robert.k@ulim.io', role: 'Respondent', department: 'IT Operations' },
  { id: 'u9', name: 'Anna Schmidt', email: 'anna.s@ulim.io', role: 'Viewer', department: 'Executive Office' },
  { id: 'u10', name: 'Carlos Mendez', email: 'carlos.m@ulim.io', role: 'Respondent', department: 'Risk Management' },
];

export const categories: AssessmentCategory[] = [
  { id: 'cat1', name: 'Enterprise Architecture', description: 'Assessments related to EA capability, governance, maturity, tools, and adoption.', displayOrder: 1, icon: 'Building2', status: 'Active', createdBy: 'u1', createdAt: '2025-01-15T08:00:00Z', updatedAt: '2026-05-20T10:30:00Z' },
  { id: 'cat2', name: 'Business Architecture', description: 'Business capability, value stream, and process maturity assessments.', displayOrder: 2, icon: 'Briefcase', status: 'Active', createdBy: 'u1', createdAt: '2025-01-15T08:00:00Z', updatedAt: '2026-03-10T14:00:00Z' },
  { id: 'cat3', name: 'Digital Transformation', description: 'Digital readiness, technology adoption, and innovation assessments.', displayOrder: 3, icon: 'Monitor', status: 'Active', createdBy: 'u1', createdAt: '2025-02-01T09:00:00Z', updatedAt: '2026-04-05T11:00:00Z' },
  { id: 'cat4', name: 'Governance', description: 'Governance framework, compliance, and risk management assessments.', displayOrder: 4, icon: 'Shield', status: 'Active', createdBy: 'u1', createdAt: '2025-02-15T10:00:00Z', updatedAt: '2026-01-20T09:00:00Z' },
  { id: 'cat5', name: 'Process Maturity', description: 'Business process management and optimization assessments.', displayOrder: 5, icon: 'GitBranch', status: 'Active', createdBy: 'u1', createdAt: '2025-03-01T08:00:00Z', updatedAt: '2026-02-15T13:00:00Z' },
  { id: 'cat6', name: 'Change Readiness', description: 'Organizational change readiness and adoption assessments.', displayOrder: 6, icon: 'RefreshCw', status: 'Active', createdBy: 'u1', createdAt: '2025-03-15T09:00:00Z', updatedAt: '2026-03-01T10:00:00Z' },
  { id: 'cat7', name: 'Compliance', description: 'Regulatory compliance and policy adherence assessments.', displayOrder: 7, icon: 'CheckCircle', status: 'Active', createdBy: 'u1', createdAt: '2025-04-01T08:00:00Z', updatedAt: '2026-05-01T11:00:00Z' },
];

export const templates: AssessmentTemplate[] = [
  { id: 't1', categoryId: 'cat1', name: 'EA Maturity Assessment', code: 'EA-MA-001', description: 'Comprehensive evaluation of enterprise architecture maturity across governance, methodology, repository, operating model, stakeholder engagement, compliance, and value realization domains.', objective: 'Measure and benchmark EA maturity to identify improvement areas and develop a roadmap.', type: 'Maturity', version: '2.1', scoringModel: 'Weighted Average', status: 'Active', respondentInstructions: 'Please answer all questions honestly based on current state. Upload supporting evidence where available. Your responses will be kept confidential.', assessorInstructions: 'Review all submissions for completeness. Validate evidence where provided. Calculate results and generate recommendations based on identified gaps.', createdBy: 'u1', createdAt: '2025-01-20T08:00:00Z', updatedAt: '2026-05-15T10:00:00Z' },
  { id: 't2', categoryId: 'cat1', name: 'EA Governance Assessment', code: 'EA-GOV-001', description: 'Focused assessment on EA governance structures, decision rights, architecture review boards, and compliance processes.', objective: 'Evaluate the effectiveness and maturity of EA governance frameworks.', type: 'Maturity', version: '1.3', scoringModel: 'Simple Average', status: 'Active', respondentInstructions: 'Focus on governance-specific documentation and processes. Upload charters, board minutes, and compliance records.', assessorInstructions: 'Pay special attention to evidence of formal governance structures and decision-making processes.', createdBy: 'u1', createdAt: '2025-03-10T09:00:00Z', updatedAt: '2026-04-20T11:00:00Z' },
  { id: 't3', categoryId: 'cat1', name: 'EA Tool Readiness Assessment', code: 'EA-TOOL-001', description: 'Assessment of EA tool capabilities, integration, data quality, and user adoption.', objective: 'Evaluate readiness and maturity of EA tooling infrastructure.', type: 'Readiness', version: '1.0', scoringModel: 'Section-based', status: 'Active', respondentInstructions: 'Assess current EA tools and their usage across the organization.', assessorInstructions: 'Focus on tool functionality, data quality, and integration capabilities.', createdBy: 'u2', createdAt: '2026-01-15T08:00:00Z', updatedAt: '2026-05-10T10:00:00Z' },
  { id: 't4', categoryId: 'cat2', name: 'Business Capability Maturity Assessment', code: 'BA-CAP-001', description: 'Evaluate business capabilities across all domains including strategy, operations, customer engagement, and support functions.', objective: 'Map and measure business capability maturity to inform investment decisions.', type: 'Maturity', version: '1.5', scoringModel: 'Weighted Average', status: 'Active', respondentInstructions: 'Assess each capability area based on documented processes, skills, tools, and performance metrics.', assessorInstructions: 'Look for capability maps, process documentation, and performance data as evidence.', createdBy: 'u1', createdAt: '2025-04-10T09:00:00Z', updatedAt: '2026-03-15T12:00:00Z' },
  { id: 't5', categoryId: 'cat2', name: 'Value Stream Maturity Assessment', code: 'BA-VS-001', description: 'Assess the maturity of value stream definitions, mappings, and optimization efforts.', objective: 'Evaluate value stream management practices and identify optimization opportunities.', type: 'Maturity', version: '1.2', scoringModel: 'Simple Average', status: 'Draft', respondentInstructions: 'Evaluate value stream documentation and stakeholder engagement.', assessorInstructions: 'Review value stream maps and stakeholder feedback.', createdBy: 'u2', createdAt: '2025-06-01T08:00:00Z', updatedAt: '2026-02-01T10:00:00Z' },
  { id: 't6', categoryId: 'cat3', name: 'Digital Transformation Readiness', code: 'DT-READY-001', description: 'Comprehensive readiness assessment for digital transformation initiatives covering technology, culture, skills, and leadership.', objective: 'Assess organizational readiness for digital transformation and identify preparation gaps.', type: 'Readiness', version: '1.0', scoringModel: 'Weighted Average', status: 'Active', respondentInstructions: 'Evaluate the organization\'s readiness across technology, people, process, and culture dimensions.', assessorInstructions: 'Assess both technical and cultural readiness factors.', createdBy: 'u1', createdAt: '2026-02-01T09:00:00Z', updatedAt: '2026-05-20T14:00:00Z' },
  { id: 't7', categoryId: 'cat4', name: 'Governance Maturity Assessment', code: 'GOV-MA-001', description: 'Assess governance frameworks, policies, compliance mechanisms, and oversight structures.', objective: 'Measure governance maturity and compliance effectiveness.', type: 'Maturity', version: '1.1', scoringModel: 'Maturity Level', status: 'Active', respondentInstructions: 'Evaluate governance documentation, policy adherence, and oversight effectiveness.', assessorInstructions: 'Focus on evidence of governance enforcement and compliance monitoring.', createdBy: 'u1', createdAt: '2025-05-15T10:00:00Z', updatedAt: '2026-04-10T09:00:00Z' },
  { id: 't8', categoryId: 'cat5', name: 'Process Maturity Assessment', code: 'PM-MA-001', description: 'Evaluate business process maturity using standardized process assessment models.', objective: 'Assess process documentation, standardization, measurement, and optimization.', type: 'Maturity', version: '1.0', scoringModel: 'Maturity Level', status: 'Active', respondentInstructions: 'Assess process documentation, metrics, and improvement practices.', assessorInstructions: 'Look for process models, performance dashboards, and improvement records.', createdBy: 'u2', createdAt: '2025-07-01T08:00:00Z', updatedAt: '2026-01-15T11:00:00Z' },
  { id: 't9', categoryId: 'cat7', name: 'Compliance Readiness Assessment', code: 'COMP-READY-001', description: 'Assess regulatory compliance readiness across applicable frameworks and standards.', objective: 'Evaluate compliance posture and identify remediation needs.', type: 'Compliance', version: '1.0', scoringModel: 'Pass-Fail', status: 'Active', respondentInstructions: 'Assess compliance documentation, controls, and evidence.', assessorInstructions: 'Verify compliance evidence and control effectiveness.', createdBy: 'u5', createdAt: '2026-03-01T09:00:00Z', updatedAt: '2026-05-15T10:00:00Z' },
];

export const sections: AssessmentSection[] = [
  { id: 's1', templateId: 't1', parentSectionId: null, name: 'EA Governance', description: 'Architecture governance bodies, decision rights, and compliance processes', weight: 20, displayOrder: 1, status: 'Active' },
  { id: 's2', templateId: 't1', parentSectionId: null, name: 'EA Framework & Methodology', description: 'Architecture framework adoption, methodology, and standards', weight: 15, displayOrder: 2, status: 'Active' },
  { id: 's3', templateId: 't1', parentSectionId: null, name: 'EA Repository', description: 'Architecture repository, models, and documentation management', weight: 15, displayOrder: 3, status: 'Active' },
  { id: 's4', templateId: 't1', parentSectionId: null, name: 'EA Operating Model', description: 'Architecture organization, roles, and operating model', weight: 20, displayOrder: 4, status: 'Active' },
  { id: 's5', templateId: 't1', parentSectionId: null, name: 'EA Stakeholder Engagement', description: 'Stakeholder engagement, communication, and collaboration', weight: 10, displayOrder: 5, status: 'Active' },
  { id: 's6', templateId: 't1', parentSectionId: null, name: 'EA Compliance', description: 'Architecture compliance, standards enforcement, and exception management', weight: 10, displayOrder: 6, status: 'Active' },
  { id: 's7', templateId: 't1', parentSectionId: null, name: 'EA Value Realization', description: 'Value measurement, benefits tracking, and ROI demonstration', weight: 10, displayOrder: 7, status: 'Active' },
  { id: 's8', templateId: 't4', parentSectionId: null, name: 'Strategy & Planning', description: 'Strategic planning and business capability alignment', weight: 25, displayOrder: 1, status: 'Active' },
  { id: 's9', templateId: 't4', parentSectionId: null, name: 'Customer Engagement', description: 'Customer-facing capabilities and experience management', weight: 25, displayOrder: 2, status: 'Active' },
  { id: 's10', templateId: 't4', parentSectionId: null, name: 'Operations', description: 'Core operational capabilities and process execution', weight: 25, displayOrder: 3, status: 'Active' },
  { id: 's11', templateId: 't4', parentSectionId: null, name: 'Support Functions', description: 'Enabling capabilities including HR, Finance, IT, and Legal', weight: 25, displayOrder: 4, status: 'Active' },
];

export const questions: AssessmentQuestion[] = [
  { id: 'q1', templateId: 't1', sectionId: 's1', questionText: 'Does the organization have a formally approved EA Governance Framework?', description: 'Evaluate the existence and approval status of the EA governance charter.', answerType: 'Rating Scale', weight: 1, isMandatory: true, evidenceRequirement: 'Optional', helpText: 'Upload approved EA governance charter, meeting minutes, or architecture board terms of reference if available.', displayOrder: 1, status: 'Active' },
  { id: 'q2', templateId: 't1', sectionId: 's1', questionText: 'Are architecture review boards (ARBs) established and operating regularly?', description: 'Assess the operational effectiveness of architecture review boards.', answerType: 'Rating Scale', weight: 1, isMandatory: true, evidenceRequirement: 'Optional', helpText: 'Provide ARB meeting schedules, agendas, and decision logs.', displayOrder: 2, status: 'Active' },
  { id: 'q3', templateId: 't1', sectionId: 's1', questionText: 'Is there a defined compliance process for architecture standards?', description: 'Evaluate the existence and enforcement of architecture compliance processes.', answerType: 'Rating Scale', weight: 1, isMandatory: true, evidenceRequirement: 'Optional', helpText: 'Upload compliance checklists, waiver request forms, and compliance reports.', displayOrder: 3, status: 'Active' },
  { id: 'q4', templateId: 't1', sectionId: 's1', questionText: 'Are exception management processes defined and documented?', description: 'Assess the maturity of exception handling for architecture deviations.', answerType: 'Rating Scale', weight: 1, isMandatory: false, evidenceRequirement: 'Optional', helpText: 'Provide exception request templates and approved exception records.', displayOrder: 4, status: 'Active' },
  { id: 'q5', templateId: 't1', sectionId: 's2', questionText: 'Has the organization adopted a recognized EA framework (e.g., TOGAF, Zachman, FEAF)?', description: 'Evaluate framework adoption and customization.', answerType: 'Single Choice', weight: 1, isMandatory: true, evidenceRequirement: 'Optional', helpText: 'Upload framework adoption documentation and customization guides.', displayOrder: 1, status: 'Active' },
  { id: 'q6', templateId: 't1', sectionId: 's2', questionText: 'Are EA methodologies, processes, and standards documented and accessible?', description: 'Assess documentation quality and accessibility of EA methodologies.', answerType: 'Rating Scale', weight: 1, isMandatory: true, evidenceRequirement: 'Optional', helpText: 'Provide links to methodology documentation repositories.', displayOrder: 2, status: 'Active' },
  { id: 'q7', templateId: 't1', sectionId: 's2', questionText: 'Is there a defined architecture development method (ADM) or equivalent process?', description: 'Evaluate the existence of a structured architecture development process.', answerType: 'Yes/No', weight: 1, isMandatory: true, evidenceRequirement: 'Required', helpText: 'Upload the ADM process documentation or equivalent methodology description.', displayOrder: 3, status: 'Active' },
  { id: 'q8', templateId: 't1', sectionId: 's3', questionText: 'Is there a centralized EA repository for architecture models and documentation?', description: 'Assess the existence and accessibility of the EA repository.', answerType: 'Rating Scale', weight: 1, isMandatory: true, evidenceRequirement: 'Optional', helpText: 'Provide repository URL, screenshots, or access information.', displayOrder: 1, status: 'Active' },
  { id: 'q9', templateId: 't1', sectionId: 's3', questionText: 'Are architecture models maintained and kept current?', description: 'Evaluate currency and maintenance of architecture models.', answerType: 'Rating Scale', weight: 1, isMandatory: true, evidenceRequirement: 'Optional', helpText: 'Upload recent architecture models or screenshots from the repository.', displayOrder: 2, status: 'Active' },
  { id: 'q10', templateId: 't1', sectionId: 's3', questionText: 'Is there version control and governance for architecture artifacts?', description: 'Assess version management practices for architecture deliverables.', answerType: 'Yes/No', weight: 1, isMandatory: false, evidenceRequirement: 'Optional', helpText: 'Provide version control policies or demonstrate version history.', displayOrder: 3, status: 'Active' },
  { id: 'q11', templateId: 't1', sectionId: 's4', questionText: 'Are EA roles and responsibilities clearly defined in the organization?', description: 'Evaluate role definitions and organizational structure for EA.', answerType: 'Rating Scale', weight: 1, isMandatory: true, evidenceRequirement: 'Optional', helpText: 'Upload organization charts, role descriptions, and RACI matrices.', displayOrder: 1, status: 'Active' },
  { id: 'q12', templateId: 't1', sectionId: 's4', questionText: 'Is there a Chief Architect or equivalent EA leadership role?', description: 'Assess EA leadership and executive sponsorship.', answerType: 'Single Choice', weight: 1, isMandatory: true, evidenceRequirement: 'Optional', helpText: 'Provide job descriptions or organization charts showing EA leadership.', displayOrder: 2, status: 'Active' },
  { id: 'q13', templateId: 't1', sectionId: 's5', questionText: 'Are stakeholders regularly engaged in architecture activities?', description: 'Evaluate stakeholder engagement practices and frequency.', answerType: 'Rating Scale', weight: 1, isMandatory: true, evidenceRequirement: 'Optional', helpText: 'Upload stakeholder maps, communication plans, and meeting records.', displayOrder: 1, status: 'Active' },
  { id: 'q14', templateId: 't1', sectionId: 's5', questionText: 'Is there a stakeholder communication plan for architecture?', description: 'Assess communication planning for EA activities.', answerType: 'Yes/No', weight: 1, isMandatory: false, evidenceRequirement: 'Optional', helpText: 'Provide communication plans and recent communications.', displayOrder: 2, status: 'Active' },
  { id: 'q15', templateId: 't1', sectionId: 's6', questionText: 'Are architecture standards documented and enforced?', description: 'Evaluate standards documentation and enforcement mechanisms.', answerType: 'Rating Scale', weight: 1, isMandatory: true, evidenceRequirement: 'Required', helpText: 'Upload standards catalogs, compliance reports, and enforcement procedures.', displayOrder: 1, status: 'Active' },
  { id: 'q16', templateId: 't1', sectionId: 's6', questionText: 'Is there regular compliance reporting on architecture adherence?', description: 'Assess compliance monitoring and reporting practices.', answerType: 'Yes/No', weight: 1, isMandatory: false, evidenceRequirement: 'Optional', helpText: 'Provide compliance dashboards or reports.', displayOrder: 2, status: 'Active' },
  { id: 'q17', templateId: 't1', sectionId: 's7', questionText: 'Are EA value metrics defined and tracked?', description: 'Evaluate value measurement practices for EA.', answerType: 'Rating Scale', weight: 1, isMandatory: true, evidenceRequirement: 'Optional', helpText: 'Upload value measurement frameworks, KPI dashboards, or benefits registers.', displayOrder: 1, status: 'Active' },
  { id: 'q18', templateId: 't1', sectionId: 's7', questionText: 'Is there a benefits realization process for architecture initiatives?', description: 'Assess benefits tracking and realization practices.', answerType: 'Rating Scale', weight: 1, isMandatory: true, evidenceRequirement: 'Optional', helpText: 'Provide benefits realization documentation and evidence.', displayOrder: 2, status: 'Active' },
  { id: 'q19', templateId: 't4', sectionId: 's8', questionText: 'Are business capabilities mapped and documented?', description: 'Evaluate the existence and quality of business capability maps.', answerType: 'Rating Scale', weight: 1, isMandatory: true, evidenceRequirement: 'Optional', helpText: 'Upload capability maps, heatmaps, and assessment documentation.', displayOrder: 1, status: 'Active' },
  { id: 'q20', templateId: 't4', sectionId: 's8', questionText: 'Is capability maturity assessed on a regular basis?', description: 'Assess the frequency and rigor of capability maturity evaluations.', answerType: 'Single Choice', weight: 1, isMandatory: true, evidenceRequirement: 'Optional', helpText: 'Provide maturity assessment schedules and recent results.', displayOrder: 2, status: 'Active' },
  { id: 'q21', templateId: 't4', sectionId: 's9', questionText: 'Are customer-facing capabilities clearly defined and measured?', description: 'Evaluate customer capability definitions and measurement practices.', answerType: 'Rating Scale', weight: 1, isMandatory: true, evidenceRequirement: 'Optional', helpText: 'Upload customer journey maps and capability metrics.', displayOrder: 1, status: 'Active' },
  { id: 'q22', templateId: 't4', sectionId: 's9', questionText: 'Is customer satisfaction measured and linked to capabilities?', description: 'Assess the linkage between customer satisfaction and capability maturity.', answerType: 'Rating Scale', weight: 1, isMandatory: false, evidenceRequirement: 'Optional', helpText: 'Provide satisfaction survey results and capability correlation analysis.', displayOrder: 2, status: 'Active' },
  { id: 'q23', templateId: 't4', sectionId: 's10', questionText: 'Are core operational processes documented and standardized?', description: 'Evaluate process documentation and standardization.', answerType: 'Rating Scale', weight: 1, isMandatory: true, evidenceRequirement: 'Optional', helpText: 'Upload process documentation, flowcharts, and standard operating procedures.', displayOrder: 1, status: 'Active' },
  { id: 'q24', templateId: 't4', sectionId: 's10', questionText: 'Are process performance metrics collected and reviewed?', description: 'Assess process measurement and improvement practices.', answerType: 'Yes/No', weight: 1, isMandatory: true, evidenceRequirement: 'Required', helpText: 'Provide process dashboards, KPI reports, and review meeting records.', displayOrder: 2, status: 'Active' },
];

export const answerOptions: AnswerOption[] = [
  { id: 'ao1', questionId: 'q1', label: 'Not available', description: 'No governance framework exists', score: 1, displayOrder: 1, recommendationTrigger: 'High' },
  { id: 'ao2', questionId: 'q1', label: 'Drafted but not approved', description: 'Framework drafted but awaiting approval', score: 2, displayOrder: 2, recommendationTrigger: 'Medium' },
  { id: 'ao3', questionId: 'q1', label: 'Approved but not fully implemented', description: 'Framework approved but implementation partial', score: 3, displayOrder: 3, recommendationTrigger: null },
  { id: 'ao4', questionId: 'q1', label: 'Implemented and regularly used', description: 'Framework in active use', score: 4, displayOrder: 4, recommendationTrigger: null },
  { id: 'ao5', questionId: 'q1', label: 'Optimized and continuously improved', description: 'Framework optimized with continuous improvement', score: 5, displayOrder: 5, recommendationTrigger: null },
  { id: 'ao6', questionId: 'q5', label: 'No framework adopted', description: 'No formal EA framework in use', score: 1, displayOrder: 1, recommendationTrigger: 'High' },
  { id: 'ao7', questionId: 'q5', label: 'Under evaluation', description: 'Framework selection in progress', score: 2, displayOrder: 2, recommendationTrigger: 'Medium' },
  { id: 'ao8', questionId: 'q5', label: 'Partially adopted', description: 'Framework adopted for some domains', score: 3, displayOrder: 3, recommendationTrigger: null },
  { id: 'ao9', questionId: 'q5', label: 'Fully adopted', description: 'Framework adopted organization-wide', score: 4, displayOrder: 4, recommendationTrigger: null },
  { id: 'ao10', questionId: 'q5', label: 'Customized and optimized', description: 'Framework customized to organization needs', score: 5, displayOrder: 5, recommendationTrigger: null },
  { id: 'ao11', questionId: 'q12', label: 'No formal role', description: 'No EA leadership role defined', score: 1, displayOrder: 1, recommendationTrigger: 'High' },
  { id: 'ao12', questionId: 'q12', label: 'Informal leadership', description: 'Leadership exists but not formalized', score: 2, displayOrder: 2, recommendationTrigger: 'Medium' },
  { id: 'ao13', questionId: 'q12', label: 'Role defined but vacant', description: 'Position defined but not filled', score: 3, displayOrder: 3, recommendationTrigger: null },
  { id: 'ao14', questionId: 'q12', label: 'Role filled', description: 'Position filled and operating', score: 4, displayOrder: 4, recommendationTrigger: null },
  { id: 'ao15', questionId: 'q12', label: 'Role with executive sponsorship', description: 'Position with C-level sponsorship', score: 5, displayOrder: 5, recommendationTrigger: null },
  { id: 'ao16', questionId: 'q20', label: 'Never assessed', description: 'No maturity assessments conducted', score: 1, displayOrder: 1, recommendationTrigger: 'High' },
  { id: 'ao17', questionId: 'q20', label: 'Ad-hoc assessment', description: 'Irregular, informal assessments', score: 2, displayOrder: 2, recommendationTrigger: 'Medium' },
  { id: 'ao18', questionId: 'q20', label: 'Annual assessment', description: 'Formal annual maturity assessment', score: 3, displayOrder: 3, recommendationTrigger: null },
  { id: 'ao19', questionId: 'q20', label: 'Bi-annual assessment', description: 'Twice-yearly formal assessments', score: 4, displayOrder: 4, recommendationTrigger: null },
  { id: 'ao20', questionId: 'q20', label: 'Continuous assessment', description: 'Ongoing, real-time maturity monitoring', score: 5, displayOrder: 5, recommendationTrigger: null },
];

// Generate rating scale options 1-5 for all rating scale questions
const ratingScaleQuestions = questions.filter(q => q.answerType === 'Rating Scale');
ratingScaleQuestions.forEach(q => {
  if (!answerOptions.some(ao => ao.questionId === q.id)) {
    const labels = ['Not implemented', 'Partially implemented', 'Defined but not institutionalized', 'Implemented and monitored', 'Optimized and continuously improved'];
    for (let i = 1; i <= 5; i++) {
      answerOptions.push({
        id: `ao-rs-${q.id}-${i}`,
        questionId: q.id,
        label: labels[i - 1],
        description: labels[i - 1],
        score: i,
        displayOrder: i,
        recommendationTrigger: i <= 2 ? 'High' as const : i === 3 ? 'Medium' as const : null,
      });
    }
  }
});

// Generate Yes/No options for yes/no questions
const yesNoQuestions = questions.filter(q => q.answerType === 'Yes/No');
yesNoQuestions.forEach(q => {
  answerOptions.push(
    { id: `ao-yn-${q.id}-yes`, questionId: q.id, label: 'Yes', description: 'Yes', score: 5, displayOrder: 1, recommendationTrigger: null },
    { id: `ao-yn-${q.id}-no`, questionId: q.id, label: 'No', description: 'No', score: 1, displayOrder: 2, recommendationTrigger: 'High' },
  );
});

export const events: AssessmentEvent[] = [
  { id: 'e1', templateId: 't1', templateVersion: '2.1', eventName: 'EA Maturity Assessment — Q3 2026', description: 'Quarterly enterprise architecture maturity assessment for the GTA division.', ownerId: 'u1', assessorId: 'u1', startDate: '2026-07-01', endDate: '2026-09-30', status: 'Open', targetDepartment: 'Enterprise Architecture', targetAudience: 'Architecture team, IT leadership', instructions: 'Please complete all sections. Upload evidence where available.', createdBy: 'u1', createdAt: '2026-06-15T08:00:00Z', updatedAt: '2026-06-15T08:00:00Z' },
  { id: 'e2', templateId: 't1', templateVersion: '2.1', eventName: 'EA Maturity Assessment — Q2 2026', description: 'Previous quarter assessment — completed and under review.', ownerId: 'u1', assessorId: 'u2', startDate: '2026-04-01', endDate: '2026-06-30', status: 'Completed', targetDepartment: 'Enterprise Architecture', targetAudience: 'Architecture team, IT leadership', instructions: 'Complete all sections with evidence uploads.', createdBy: 'u1', createdAt: '2026-03-20T09:00:00Z', updatedAt: '2026-06-20T10:00:00Z' },
  { id: 'e3', templateId: 't4', templateVersion: '1.5', eventName: 'Business Capability Assessment — 2026', description: 'Annual business capability maturity assessment across all domains.', ownerId: 'u2', assessorId: 'u1', startDate: '2026-06-01', endDate: '2026-08-31', status: 'In Progress', targetDepartment: 'Business Operations', targetAudience: 'Business unit leaders, process owners', instructions: 'Assess each capability domain thoroughly.', createdBy: 'u1', createdAt: '2026-05-15T10:00:00Z', updatedAt: '2026-06-10T14:00:00Z' },
  { id: 'e4', templateId: 't6', templateVersion: '1.0', eventName: 'Digital Transformation Readiness — 2026', description: 'Organization-wide digital transformation readiness evaluation.', ownerId: 'u1', assessorId: 'u2', startDate: '2026-08-01', endDate: '2026-10-31', status: 'Scheduled', targetDepartment: 'Digital Transformation Office', targetAudience: 'All departments', instructions: 'Evaluate readiness across all dimensions.', createdBy: 'u2', createdAt: '2026-06-10T08:00:00Z', updatedAt: '2026-06-10T08:00:00Z' },
  { id: 'e5', templateId: 't7', templateVersion: '1.1', eventName: 'Governance Maturity — H1 2026', description: 'First half governance maturity assessment.', ownerId: 'u1', assessorId: 'u1', startDate: '2026-01-15', endDate: '2026-06-30', status: 'Completed', targetDepartment: 'Governance & Risk', targetAudience: 'Governance team, compliance officers', instructions: 'Assess governance framework maturity.', createdBy: 'u1', createdAt: '2026-01-10T09:00:00Z', updatedAt: '2026-06-25T11:00:00Z' },
  { id: 'e6', templateId: 't9', templateVersion: '1.0', eventName: 'Compliance Readiness — SOX 2026', description: 'SOX compliance readiness assessment.', ownerId: 'u5', assessorId: 'u1', startDate: '2026-09-01', endDate: '2026-11-30', status: 'Draft', targetDepartment: 'Finance & Compliance', targetAudience: 'Finance team, compliance officers', instructions: 'Assess SOX compliance controls and documentation.', createdBy: 'u5', createdAt: '2026-06-20T10:00:00Z', updatedAt: '2026-06-20T10:00:00Z' },
];

export const eventRespondents: EventRespondent[] = [
  { id: 'er1', eventId: 'e1', respondentId: 'u3', assignedSections: null, status: 'In Progress', progressPercentage: 65, startedAt: '2026-07-05T09:00:00Z', submittedAt: null },
  { id: 'er2', eventId: 'e1', respondentId: 'u4', assignedSections: null, status: 'Submitted', progressPercentage: 100, startedAt: '2026-07-02T10:00:00Z', submittedAt: '2026-07-20T14:00:00Z' },
  { id: 'er3', eventId: 'e1', respondentId: 'u5', assignedSections: null, status: 'Submitted', progressPercentage: 100, startedAt: '2026-07-03T11:00:00Z', submittedAt: '2026-07-18T16:00:00Z' },
  { id: 'er4', eventId: 'e1', respondentId: 'u6', assignedSections: null, status: 'In Progress', progressPercentage: 40, startedAt: '2026-07-10T08:00:00Z', submittedAt: null },
  { id: 'er5', eventId: 'e1', respondentId: 'u7', assignedSections: null, status: 'Not Started', progressPercentage: 0, startedAt: null, submittedAt: null },
  { id: 'er6', eventId: 'e1', respondentId: 'u8', assignedSections: null, status: 'Submitted', progressPercentage: 100, startedAt: '2026-07-01T09:00:00Z', submittedAt: '2026-07-15T12:00:00Z' },
  { id: 'er7', eventId: 'e1', respondentId: 'u10', assignedSections: null, status: 'In Progress', progressPercentage: 80, startedAt: '2026-07-08T10:00:00Z', submittedAt: null },
  { id: 'er8', eventId: 'e1', respondentId: 'u2', assignedSections: null, status: 'Submitted', progressPercentage: 100, startedAt: '2026-07-01T08:00:00Z', submittedAt: '2026-07-12T11:00:00Z' },
  { id: 'er9', eventId: 'e3', respondentId: 'u3', assignedSections: null, status: 'In Progress', progressPercentage: 45, startedAt: '2026-06-15T09:00:00Z', submittedAt: null },
  { id: 'er10', eventId: 'e3', respondentId: 'u6', assignedSections: null, status: 'Submitted', progressPercentage: 100, startedAt: '2026-06-10T08:00:00Z', submittedAt: '2026-06-28T14:00:00Z' },
  { id: 'er11', eventId: 'e3', respondentId: 'u7', assignedSections: null, status: 'Not Started', progressPercentage: 0, startedAt: null, submittedAt: null },
  { id: 'er12', eventId: 'e3', respondentId: 'u4', assignedSections: null, status: 'In Progress', progressPercentage: 30, startedAt: '2026-06-20T10:00:00Z', submittedAt: null },
];

export const responses: AssessmentResponse[] = [
  // Responses for event e1 (EA Maturity)
  { id: 'resp1', eventId: 'e1', respondentId: 'u4', questionId: 'q1', answerValue: 'Approved but not fully implemented', selectedOptionId: 'ao3', score: 3, comment: 'Framework was approved in Q1 but rollout is still ongoing.', submittedAt: '2026-07-20T14:00:00Z' },
  { id: 'resp2', eventId: 'e1', respondentId: 'u4', questionId: 'q2', answerValue: 'Implemented and regularly used', selectedOptionId: 'ao-rs-q2-4', score: 4, comment: 'ARB meets bi-weekly with good attendance.', submittedAt: '2026-07-20T14:00:00Z' },
  { id: 'resp3', eventId: 'e1', respondentId: 'u4', questionId: 'q3', answerValue: 'Defined but not institutionalized', selectedOptionId: 'ao-rs-q3-3', score: 3, comment: 'Compliance process exists but not consistently enforced.', submittedAt: '2026-07-20T14:00:00Z' },
  { id: 'resp4', eventId: 'e1', respondentId: 'u4', questionId: 'q5', answerValue: 'Fully adopted', selectedOptionId: 'ao9', score: 4, comment: 'TOGAF adopted organization-wide since 2024.', submittedAt: '2026-07-20T14:00:00Z' },
  { id: 'resp5', eventId: 'e1', respondentId: 'u4', questionId: 'q6', answerValue: 'Implemented and monitored', selectedOptionId: 'ao-rs-q6-4', score: 4, comment: 'Well documented in Confluence.', submittedAt: '2026-07-20T14:00:00Z' },
  { id: 'resp6', eventId: 'e1', respondentId: 'u4', questionId: 'q7', answerValue: 'Yes', selectedOptionId: 'ao-yn-q7-yes', score: 5, comment: null, submittedAt: '2026-07-20T14:00:00Z' },
  { id: 'resp7', eventId: 'e1', respondentId: 'u4', questionId: 'q8', answerValue: 'Implemented and monitored', selectedOptionId: 'ao-rs-q8-4', score: 4, comment: 'Using LeanIX as primary repository.', submittedAt: '2026-07-20T14:00:00Z' },
  { id: 'resp8', eventId: 'e1', respondentId: 'u4', questionId: 'q9', answerValue: 'Implemented and monitored', selectedOptionId: 'ao-rs-q9-4', score: 4, comment: 'Models updated quarterly.', submittedAt: '2026-07-20T14:00:00Z' },
  { id: 'resp9', eventId: 'e1', respondentId: 'u4', questionId: 'q11', answerValue: 'Implemented and monitored', selectedOptionId: 'ao-rs-q11-4', score: 4, comment: 'Clear RACI matrix in place.', submittedAt: '2026-07-20T14:00:00Z' },
  { id: 'resp10', eventId: 'e1', respondentId: 'u4', questionId: 'q12', answerValue: 'Role with executive sponsorship', selectedOptionId: 'ao15', score: 5, comment: 'CIO directly sponsors EA initiatives.', submittedAt: '2026-07-20T14:00:00Z' },
  { id: 'resp11', eventId: 'e1', respondentId: 'u4', questionId: 'q13', answerValue: 'Partially implemented', selectedOptionId: 'ao-rs-q13-2', score: 2, comment: 'Stakeholder engagement is ad-hoc.', submittedAt: '2026-07-20T14:00:00Z' },
  { id: 'resp12', eventId: 'e1', respondentId: 'u4', questionId: 'q15', answerValue: 'Implemented and monitored', selectedOptionId: 'ao-rs-q15-4', score: 4, comment: 'Standards catalog published and maintained.', submittedAt: '2026-07-20T14:00:00Z' },
  { id: 'resp13', eventId: 'e1', respondentId: 'u4', questionId: 'q17', answerValue: 'Defined but not institutionalized', selectedOptionId: 'ao-rs-q17-3', score: 3, comment: 'Metrics defined but not consistently tracked.', submittedAt: '2026-07-20T14:00:00Z' },
  { id: 'resp14', eventId: 'e1', respondentId: 'u4', questionId: 'q18', answerValue: 'Partially implemented', selectedOptionId: 'ao-rs-q18-2', score: 2, comment: 'Benefits tracking is informal.', submittedAt: '2026-07-20T14:00:00Z' },
];

export const evidence: AssessmentEvidence[] = [
  { id: 'ev1', responseId: 'resp1', fileName: 'EA_Governance_Charter_v2.1.pdf', fileType: 'PDF', fileUrl: '#', uploadedBy: 'u4', uploadedAt: '2026-07-20T14:00:00Z' },
  { id: 'ev2', responseId: 'resp2', fileName: 'ARB_Meeting_Minutes_Q2.xlsx', fileType: 'Excel', fileUrl: '#', uploadedBy: 'u4', uploadedAt: '2026-07-20T14:00:00Z' },
  { id: 'ev3', responseId: 'resp8', fileName: 'Architecture_Repository_Screenshot.png', fileType: 'Image', fileUrl: '#', uploadedBy: 'u4', uploadedAt: '2026-07-20T14:00:00Z' },
];

export const results: AssessmentResult[] = [
  { id: 'r1', eventId: 'e2', overallScore: 2.6, maturityLevel: 'Level 3: Defined', targetScore: 4.0, gapScore: 1.4, generatedAt: '2026-06-25T10:00:00Z', generatedBy: 'u1' },
  { id: 'r2', eventId: 'e5', overallScore: 3.1, maturityLevel: 'Level 3: Defined', targetScore: 4.0, gapScore: 0.9, generatedAt: '2026-06-20T11:00:00Z', generatedBy: 'u1' },
];

export const sectionResults: SectionResult[] = [
  { id: 'sr1', resultId: 'r1', sectionId: 's1', actualScore: 2.4, targetScore: 4.0, gapScore: 1.6, gapSeverity: 'Medium' },
  { id: 'sr2', resultId: 'r1', sectionId: 's2', actualScore: 3.1, targetScore: 4.0, gapScore: 0.9, gapSeverity: 'Low' },
  { id: 'sr3', resultId: 'r1', sectionId: 's3', actualScore: 2.0, targetScore: 4.0, gapScore: 2.0, gapSeverity: 'Medium' },
  { id: 'sr4', resultId: 'r1', sectionId: 's4', actualScore: 3.5, targetScore: 4.0, gapScore: 0.5, gapSeverity: 'Low' },
  { id: 'sr5', resultId: 'r1', sectionId: 's5', actualScore: 1.8, targetScore: 4.0, gapScore: 2.2, gapSeverity: 'High' },
  { id: 'sr6', resultId: 'r1', sectionId: 's6', actualScore: 2.8, targetScore: 4.0, gapScore: 1.2, gapSeverity: 'Medium' },
  { id: 'sr7', resultId: 'r1', sectionId: 's7', actualScore: 2.2, targetScore: 4.0, gapScore: 1.8, gapSeverity: 'Medium' },
];

export const recommendations: Recommendation[] = [
  { id: 'rec1', eventId: 'e2', sectionId: 's5', questionId: 'q13', title: 'Establish formal stakeholder engagement program', description: 'Create a structured stakeholder engagement program with regular communication, defined touchpoints, and feedback mechanisms. Current ad-hoc engagement (score 2.0) indicates significant gap in stakeholder management practices.', priority: 'High', gapSeverity: 'High', suggestedOwnerId: 'u1', suggestedDueDate: '2026-09-30', status: 'Approved', linkedTaskId: null, createdBy: 'u1', createdAt: '2026-06-25T12:00:00Z' },
  { id: 'rec2', eventId: 'e2', sectionId: 's3', questionId: null, title: 'Improve EA repository data quality and governance', description: 'Implement data quality standards and governance processes for the EA repository. Establish regular data validation cycles and assign data stewards for each architecture domain.', priority: 'Medium', gapSeverity: 'Medium', suggestedOwnerId: 'u8', suggestedDueDate: '2026-10-15', status: 'Converted to Task', linkedTaskId: 'task1', createdBy: 'u1', createdAt: '2026-06-25T12:00:00Z' },
  { id: 'rec3', eventId: 'e2', sectionId: 's7', questionId: null, title: 'Define and implement EA value measurement framework', description: 'Develop a comprehensive value measurement framework with KPIs, benefits tracking, and regular reporting to demonstrate EA value to stakeholders.', priority: 'Medium', gapSeverity: 'Medium', suggestedOwnerId: 'u2', suggestedDueDate: '2026-11-30', status: 'Draft', linkedTaskId: null, createdBy: 'u1', createdAt: '2026-06-25T12:00:00Z' },
  { id: 'rec4', eventId: 'e2', sectionId: 's1', questionId: 'q1', title: 'Accelerate EA Governance Framework rollout', description: 'While the governance framework is approved, implementation is incomplete. Develop a detailed rollout plan with milestones and accountability.', priority: 'High', gapSeverity: 'Medium', suggestedOwnerId: 'u1', suggestedDueDate: '2026-08-31', status: 'Approved', linkedTaskId: null, createdBy: 'u1', createdAt: '2026-06-25T12:00:00Z' },
  { id: 'rec5', eventId: 'e2', sectionId: 's6', questionId: null, title: 'Implement automated compliance monitoring', description: 'Introduce automated tools and dashboards for continuous architecture compliance monitoring to replace manual compliance checks.', priority: 'Low', gapSeverity: 'Medium', suggestedOwnerId: 'u8', suggestedDueDate: '2026-12-31', status: 'Draft', linkedTaskId: null, createdBy: 'u1', createdAt: '2026-06-25T12:00:00Z' },
  { id: 'rec6', eventId: 'e2', sectionId: 's2', questionId: 'q7', title: 'Document and socialize ADM process across all teams', description: 'While an ADM process exists, awareness and adoption across all project teams is inconsistent. Conduct training sessions and integrate ADM into project lifecycle.', priority: 'Medium', gapSeverity: 'Low', suggestedOwnerId: 'u2', suggestedDueDate: '2026-09-15', status: 'Converted to Task', linkedTaskId: 'task2', createdBy: 'u1', createdAt: '2026-06-25T12:00:00Z' },
  { id: 'rec7', eventId: 'e5', sectionId: 's1', questionId: null, title: 'Strengthen governance board decision tracking', description: 'Enhance decision logging and tracking mechanisms for governance boards to ensure accountability and traceability.', priority: 'Medium', gapSeverity: 'Low', suggestedOwnerId: 'u5', suggestedDueDate: '2026-08-15', status: 'Approved', linkedTaskId: null, createdBy: 'u1', createdAt: '2026-06-20T13:00:00Z' },
  { id: 'rec8', eventId: 'e5', sectionId: 's5', questionId: null, title: 'Develop stakeholder communication plan', description: 'Create a comprehensive communication plan for governance stakeholders with regular updates and feedback channels.', priority: 'High', gapSeverity: 'High', suggestedOwnerId: 'u1', suggestedDueDate: '2026-07-31', status: 'Approved', linkedTaskId: null, createdBy: 'u1', createdAt: '2026-06-20T13:00:00Z' },
];

export const tasks: Task[] = [
  { id: 'task1', title: 'Improve EA repository data quality and governance', description: 'Implement data quality standards and governance processes for the EA repository. Establish regular data validation cycles and assign data stewards.', ownerId: 'u8', priority: 'Medium', dueDate: '2026-10-15', status: 'In Progress', completionPercentage: 35, sourceRecommendationId: 'rec2', sourceEventId: 'e2', category: 'EA Repository', createdAt: '2026-06-26T10:00:00Z', updatedAt: '2026-07-10T14:00:00Z' },
  { id: 'task2', title: 'Document and socialize ADM process', description: 'Conduct training sessions on the Architecture Development Method and integrate into project lifecycle.', ownerId: 'u2', priority: 'Medium', dueDate: '2026-09-15', status: 'Not Started', completionPercentage: 0, sourceRecommendationId: 'rec6', sourceEventId: 'e2', category: 'EA Framework & Methodology', createdAt: '2026-06-26T10:00:00Z', updatedAt: '2026-06-26T10:00:00Z' },
  { id: 'task3', title: 'Quarterly architecture review preparation', description: 'Prepare materials and agenda for the quarterly enterprise architecture review board meeting.', ownerId: 'u1', priority: 'High', dueDate: '2026-07-30', status: 'In Progress', completionPercentage: 60, sourceRecommendationId: null, sourceEventId: null, category: 'EA Governance', createdAt: '2026-07-01T08:00:00Z', updatedAt: '2026-07-15T10:00:00Z' },
];

export const activityLogs: ActivityLog[] = [
  { id: 'al1', eventId: 'e1', userId: 'u1', action: 'Created', description: 'Assessment event created', entityType: 'Event', entityId: 'e1', createdAt: '2026-06-15T08:00:00Z' },
  { id: 'al2', eventId: 'e1', userId: 'u1', action: 'Launched', description: 'Assessment event launched', entityType: 'Event', entityId: 'e1', createdAt: '2026-07-01T08:00:00Z' },
  { id: 'al3', eventId: 'e1', userId: 'u4', action: 'Submitted', description: 'Assessment response submitted', entityType: 'Response', entityId: 'resp1', createdAt: '2026-07-20T14:00:00Z' },
  { id: 'al4', eventId: 'e1', userId: 'u5', action: 'Submitted', description: 'Assessment response submitted', entityType: 'Response', entityId: 'resp2', createdAt: '2026-07-18T16:00:00Z' },
  { id: 'al5', eventId: 'e1', userId: 'u8', action: 'Submitted', description: 'Assessment response submitted', entityType: 'Response', entityId: 'resp3', createdAt: '2026-07-15T12:00:00Z' },
  { id: 'al6', eventId: 'e2', userId: 'u1', action: 'Generated Results', description: 'Assessment results calculated and generated', entityType: 'Result', entityId: 'r1', createdAt: '2026-06-25T10:00:00Z' },
  { id: 'al7', eventId: 'e2', userId: 'u1', action: 'Generated Recommendations', description: 'Recommendations auto-generated from results', entityType: 'Recommendation', entityId: 'rec1', createdAt: '2026-06-25T12:00:00Z' },
  { id: 'al8', eventId: 'e2', userId: 'u1', action: 'Converted to Task', description: 'Recommendation converted to task', entityType: 'Task', entityId: 'task1', createdAt: '2026-06-26T10:00:00Z' },
];
