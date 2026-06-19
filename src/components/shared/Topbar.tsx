import { useApp } from '@/context/AppContext';
import { Search, Bell, Plus } from 'lucide-react';

export function Topbar() {
  const { state, openCommandPalette, navigate, openModal } = useApp();
  const ui = state.ui;

  const getBreadcrumb = () => {
    switch (ui.currentPage) {
      case 'dashboard': return ['Dashboard'];
      case 'assessments': return ['Dashboard', 'Assessments'];
      case 'template-builder': return ['Dashboard', 'Assessments', 'Template Builder'];
      case 'event-detail': return ['Dashboard', 'Assessments', 'Event Detail'];
      case 'questionnaire': return ['Dashboard', 'Questionnaire'];
      case 'recommendations': return ['Dashboard', 'Recommendations'];
      case 'settings': return ['Dashboard', 'Settings'];
      default: return ['Dashboard'];
    }
  };

  const breadcrumbs = getBreadcrumb();
  const showNewButton = ['assessments', 'dashboard', 'recommendations'].includes(ui.currentPage);

  return (
    <header className="h-[56px] bg-white border-b border-[#E2E8F0] flex items-center justify-between px-4 lg:px-6 flex-shrink-0">
      <nav className="flex items-center gap-1 text-xs text-[#64748B]">
        {breadcrumbs.map((crumb, i) => (
          <span key={i} className="flex items-center gap-1">
            {i > 0 && <span className="text-[#CBD5E1]">/</span>}
            {i === breadcrumbs.length - 1 ? (
              <span className="font-medium text-[#0F172A]">{crumb}</span>
            ) : (
              <button onClick={() => navigate('dashboard')} className="hover:text-[#2563EB] transition-colors">{crumb}</button>
            )}
          </span>
        ))}
      </nav>

      <div className="flex items-center gap-2">
        <button onClick={openCommandPalette} className="flex items-center gap-2 h-9 px-3 rounded-lg border border-[#E2E8F0] text-[#94A3B8] hover:border-[#2563EB] hover:text-[#2563EB] transition-all text-sm">
          <Search size={16} />
          <span className="hidden lg:inline text-xs">Search...</span>
          <kbd className="hidden lg:inline-flex items-center gap-1 text-[10px] text-[#94A3B8] bg-[#F1F5F9] px-1.5 py-0.5 rounded">Ctrl+K</kbd>
        </button>

        <button className="relative p-2 rounded-lg text-[#64748B] hover:bg-[#F1F5F9] hover:text-[#0F172A] transition-colors">
          <Bell size={20} />
          <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-[#EF4444] rounded-full" />
        </button>

        {showNewButton && (
          <button onClick={() => {
            if (ui.currentPage === 'assessments' || ui.currentPage === 'dashboard') {
              openModal('create-template');
            } else if (ui.currentPage === 'recommendations') {
              // Will add manual recommendation
            }
          }} className="btn-primary">
            <Plus size={16} className="mr-1.5" />
            <span className="hidden lg:inline">New Assessment</span>
          </button>
        )}
      </div>
    </header>
  );
}
