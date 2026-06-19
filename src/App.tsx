import { AppProvider, useApp } from '@/context/AppContext';
import { Sidebar } from '@/components/shared/Sidebar';
import { Topbar } from '@/components/shared/Topbar';
import { Toasts } from '@/components/shared/Toasts';
import { CommandPalette } from '@/components/shared/CommandPalette';
import { ModalRenderer } from '@/components/shared/ModalRenderer';
import { Dashboard } from '@/pages/Dashboard';
import { AssessmentList } from '@/pages/AssessmentList';
import { TemplateBuilder } from '@/pages/TemplateBuilder';
import { EventDetail } from '@/pages/EventDetail';
import { Questionnaire } from '@/pages/Questionnaire';
import { RecommendationsPage } from '@/pages/RecommendationsPage';
import { Settings } from '@/pages/Settings';
import { motion, AnimatePresence } from 'framer-motion';

function AppContent() {
  const { state } = useApp();
  const ui = state.ui;

  const renderPage = () => {
    switch (ui.currentPage) {
      case 'dashboard': return <Dashboard />;
      case 'assessments': return <AssessmentList />;
      case 'template-builder': return <TemplateBuilder />;
      case 'event-detail': return <EventDetail />;
      case 'questionnaire': return <Questionnaire />;
      case 'recommendations': return <RecommendationsPage />;
      case 'settings': return <Settings />;
      default: return <Dashboard />;
    }
  };

  return (
    <div className="flex h-screen overflow-hidden bg-[#F8FAFC]">
      <div
        className="flex-shrink-0 transition-all duration-250"
        style={{ width: ui.sidebarCollapsed ? 68 : 260 }}
      >
        <Sidebar />
      </div>
      <div className="flex-1 flex flex-col min-w-0">
        <Topbar />
        <main className="flex-1 overflow-y-auto">
          <AnimatePresence mode="wait">
            <motion.div
              key={ui.currentPage + (ui.selectedEventId || '') + (ui.selectedTemplateId || '')}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.25, ease: [0.25, 0.46, 0.45, 0.94] }}
              className="p-6 lg:p-8 max-w-[1280px] mx-auto"
            >
              {renderPage()}
            </motion.div>
          </AnimatePresence>
        </main>
      </div>
      <Toasts />
      <CommandPalette />
      <ModalRenderer />
    </div>
  );
}

function App() {
  return (
    <AppProvider>
      <AppContent />
    </AppProvider>
  );
}

export default App;
