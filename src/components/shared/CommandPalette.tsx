import { useApp } from '@/context/AppContext';
import { Search, X } from 'lucide-react';
import { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

export function CommandPalette() {
  const { state, closeCommandPalette, navigate } = useApp();
  const isOpen = state.ui.commandPaletteOpen;
  const [query, setQuery] = useState('');
  const [selectedIndex, setSelectedIndex] = useState(0);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        if (isOpen) closeCommandPalette();
        // The open is triggered via button, not here
      }
      if (e.key === 'Escape' && isOpen) closeCommandPalette();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, closeCommandPalette]);

  const results = useMemo(() => {
    if (!query.trim()) return [];
    const q = query.toLowerCase();
    const items: Array<{ id: string; label: string; category: string; action: () => void }> = [];

    state.data.templates.forEach(t => {
      if (t.name.toLowerCase().includes(q) || t.code.toLowerCase().includes(q))
        items.push({ id: `tpl-${t.id}`, label: `${t.name} (${t.code})`, category: 'Templates', action: () => { navigate('template-builder', { templateId: t.id }); closeCommandPalette(); } });
    });
    state.data.events.forEach(ev => {
      if (ev.eventName.toLowerCase().includes(q))
        items.push({ id: `evt-${ev.id}`, label: ev.eventName, category: 'Events', action: () => { navigate('event-detail', { eventId: ev.id }); closeCommandPalette(); } });
    });
    if ('recommendations'.includes(q))
      items.push({ id: 'nav-rec', label: 'Recommendations', category: 'Navigation', action: () => { navigate('recommendations'); closeCommandPalette(); } });
    if ('settings'.includes(q))
      items.push({ id: 'nav-set', label: 'Settings', category: 'Navigation', action: () => { navigate('settings'); closeCommandPalette(); } });
    if ('dashboard'.includes(q))
      items.push({ id: 'nav-dash', label: 'Dashboard', category: 'Navigation', action: () => { navigate('dashboard'); closeCommandPalette(); } });
    if ('assessments'.includes(q))
      items.push({ id: 'nav-asmt', label: 'Assessments', category: 'Navigation', action: () => { navigate('assessments'); closeCommandPalette(); } });

    return items;
  }, [query, state.data.templates, state.data.events, navigate, closeCommandPalette]);

  const grouped = useMemo(() => {
    const cats: Record<string, typeof results> = {};
    results.forEach(r => { if (!cats[r.category]) cats[r.category] = []; cats[r.category].push(r); });
    return cats;
  }, [results]);

  useEffect(() => { setSelectedIndex(0); }, [query]);

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'ArrowDown') { e.preventDefault(); setSelectedIndex(i => Math.min(i + 1, results.length - 1)); }
    else if (e.key === 'ArrowUp') { e.preventDefault(); setSelectedIndex(i => Math.max(i - 1, 0)); }
    else if (e.key === 'Enter' && results[selectedIndex]) { results[selectedIndex].action(); }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.2 }}
          className="fixed inset-0 z-[90] flex items-start justify-center pt-[15vh]" onClick={closeCommandPalette}>
          <div className="absolute inset-0 bg-[rgba(15,23,42,0.4)] backdrop-blur-[4px]" />
          <motion.div initial={{ opacity: 0, y: -10, scale: 0.98 }} animate={{ opacity: 1, y: 0, scale: 1 }} exit={{ opacity: 0, y: -10, scale: 0.98 }}
            transition={{ type: 'spring', damping: 25, stiffness: 300 }}
            className="relative bg-white rounded-xl shadow-layer4 border border-[#E2E8F0] w-full max-w-[640px] mx-4 overflow-hidden"
            onClick={e => e.stopPropagation()}>
            <div className="flex items-center gap-3 px-4 h-[52px] border-b border-[#E2E8F0]">
              <Search size={20} className="text-[#94A3B8] flex-shrink-0" />
              <input autoFocus type="text" value={query} onChange={e => setQuery(e.target.value)} onKeyDown={handleKeyDown}
                placeholder="Search assessments, templates, events, people..."
                className="flex-1 text-base bg-transparent outline-none text-[#0F172A] placeholder:text-[#94A3B8]" />
              <button onClick={closeCommandPalette} className="p-1.5 rounded-lg text-[#94A3B8] hover:bg-[#F1F5F9] hover:text-[#0F172A] transition-colors">
                <X size={16} />
              </button>
            </div>
            <div className="max-h-[400px] overflow-y-auto">
              {results.length === 0 && query.trim() && (
                <div className="p-8 text-center"><p className="text-sm text-[#64748B]">No results found for &quot;{query}&quot;</p></div>
              )}
              {Object.entries(grouped).map(([category, items]) => (
                <div key={category}>
                  <div className="px-4 py-2 text-[10px] font-semibold text-[#94A3B8] uppercase tracking-wider bg-[#F8FAFC]">{category}</div>
                  {items.map((item) => {
                    const globalIdx = results.indexOf(item);
                    return (
                      <button key={item.id} onClick={item.action}
                        className={`w-full flex items-center gap-3 px-4 py-2.5 text-sm transition-colors ${globalIdx === selectedIndex ? 'bg-[#F8FAFC]' : 'hover:bg-[#F8FAFC]'}`}>
                        <span className="text-[#0F172A] font-medium">{item.label}</span>
                      </button>
                    );
                  })}
                </div>
              ))}
            </div>
            <div className="flex items-center gap-4 px-4 py-2.5 border-t border-[#E2E8F0] bg-[#F8FAFC]">
              <span className="text-[10px] text-[#94A3B8]"><kbd className="bg-white px-1 rounded border text-[9px]">↑↓</kbd> Navigate</span>
              <span className="text-[10px] text-[#94A3B8]"><kbd className="bg-white px-1 rounded border text-[9px]">↵</kbd> Select</span>
              <span className="text-[10px] text-[#94A3B8] ml-auto"><kbd className="bg-white px-1 rounded border text-[9px]">Esc</kbd> Close</span>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
