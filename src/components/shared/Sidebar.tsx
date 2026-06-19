import { useApp } from '@/context/AppContext';
import { currentUser, categories } from '@/data/mockData';
import {
  LayoutDashboard, ClipboardList, FileText, Database, PieChart,
  Lightbulb, CheckSquare, TrendingUp, Settings, ChevronRight,
  ChevronDown, LogOut, Square, Menu
} from 'lucide-react';
import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const primaryNav = [
  { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard, page: 'dashboard' as const },
  { id: 'assessments', label: 'Assessments', icon: ClipboardList, page: 'assessments' as const },
  { id: 'templates', label: 'Templates', icon: FileText, page: 'templates' as const },
  { id: 'question-bank', label: 'Question Bank', icon: Database, page: 'question-bank' as const },
  { id: 'results', label: 'Results', icon: PieChart, page: 'results' as const },
  { id: 'recommendations', label: 'Recommendations', icon: Lightbulb, page: 'recommendations' as const },
  { id: 'tasks', label: 'Tasks', icon: CheckSquare, page: 'tasks' as const },
  { id: 'analytics', label: 'Analytics', icon: TrendingUp, page: 'analytics' as const },
  { id: 'settings', label: 'Settings', icon: Settings, page: 'settings' as const },
];

export function Sidebar() {
  const { state, navigate, toggleSidebar } = useApp();
  const ui = state.ui;
  const [expandedCategories, setExpandedCategories] = useState<string[]>(['cat1']);

  const toggleCategory = (catId: string) => {
    setExpandedCategories(prev =>
      prev.includes(catId) ? prev.filter(id => id !== catId) : [...prev, catId]
    );
  };

  const isActive = (item: typeof primaryNav[0]) => ui.currentPage === item.page;

  return (
    <aside
      className="h-full bg-[#0F172A] flex flex-col transition-all duration-250"
      style={{ width: ui.sidebarCollapsed ? 68 : 260 }}
    >
      <div className="h-14 flex items-center px-4 border-b border-[#334155]">
        <div className="flex items-center gap-3 min-w-0">
          <div className="w-4 h-4 bg-[#2563EB] rotate-45 flex-shrink-0" />
          {!ui.sidebarCollapsed && (
            <span className="text-[22px] font-semibold text-[#F1F5F9] truncate">Ulim</span>
          )}
        </div>
        <button onClick={toggleSidebar} className="ml-auto p-1.5 rounded-lg text-[#94A3B8] hover:bg-[#1E293B] hover:text-[#F1F5F9] transition-colors flex-shrink-0">
          <Menu size={18} />
        </button>
      </div>

      {!ui.sidebarCollapsed && (
        <div className="px-4 py-3 border-b border-[#334155]">
          <p className="text-xs font-medium text-[#F1F5F9]">{currentUser.name}</p>
          <p className="text-xs text-[#64748B] mt-0.5">{currentUser.role}</p>
        </div>
      )}

      <nav className="flex-1 overflow-y-auto py-2">
        {primaryNav.map(item => (
          <button
            key={item.id}
            onClick={() => navigate(item.page)}
            className={`w-full flex items-center gap-3 px-4 py-2.5 text-sm font-medium transition-colors relative ${
              isActive(item)
                ? 'bg-[#334155] text-[#F1F5F9]'
                : 'text-[#94A3B8] hover:bg-[#1E293B] hover:text-[#F1F5F9]'
            }`}
          >
            {isActive(item) && (
              <div className="absolute left-0 top-0 bottom-0 w-[3px] bg-[#2563EB]" />
            )}
            <item.icon size={20} className="flex-shrink-0" />
            {!ui.sidebarCollapsed && <span className="truncate">{item.label}</span>}
          </button>
        ))}

        {!ui.sidebarCollapsed && (
          <div className="mt-4 px-4">
            <p className="text-[10px] font-medium text-[#64748B] uppercase tracking-wider mb-2">Assessment Categories</p>
            {categories.filter(c => c.status === 'Active').map(cat => {
              const catTemplates = state.data.templates.filter(t => t.categoryId === cat.id);
              const isExpanded = expandedCategories.includes(cat.id);
              return (
                <div key={cat.id}>
                  <button onClick={() => toggleCategory(cat.id)} className="w-full flex items-center gap-2 py-1.5 text-xs text-[#94A3B8] hover:text-[#F1F5F9] transition-colors">
                    {isExpanded ? <ChevronDown size={14} /> : <ChevronRight size={14} />}
                    <span className="truncate">{cat.name}</span>
                    <span className="ml-auto text-[#64748B]">({catTemplates.length})</span>
                  </button>
                  <AnimatePresence>
                    {isExpanded && (
                      <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }} transition={{ duration: 0.2 }} className="overflow-hidden">
                        {catTemplates.map(tpl => (
                          <button key={tpl.id} onClick={() => navigate('template-builder', { templateId: tpl.id })} className="w-full flex items-center gap-2 pl-6 pr-2 py-1.5 text-xs text-[#94A3B8] hover:text-[#2563EB] transition-colors">
                            <Square size={8} className="flex-shrink-0" />
                            <span className="truncate">{tpl.name}</span>
                          </button>
                        ))}
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              );
            })}
          </div>
        )}
      </nav>

      <div className="border-t border-[#334155] p-3">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-full bg-[#2563EB] flex items-center justify-center text-white text-xs font-medium flex-shrink-0">
            {currentUser.name.split(' ').map(n => n[0]).join('')}
          </div>
          {!ui.sidebarCollapsed && (
            <>
              <span className="text-xs text-[#F1F5F9] truncate flex-1">{currentUser.name}</span>
              <button className="p-1.5 rounded-lg text-[#94A3B8] hover:bg-[#1E293B] hover:text-[#F1F5F9] transition-colors">
                <LogOut size={16} />
              </button>
            </>
          )}
        </div>
      </div>
    </aside>
  );
}
