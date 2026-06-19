import { useApp } from '@/context/AppContext';
import { CheckCircle, AlertTriangle, XCircle, Info, X } from 'lucide-react';
import { AnimatePresence, motion } from 'framer-motion';

const iconMap = { success: CheckCircle, warning: AlertTriangle, error: XCircle, info: Info };
const colorMap = { success: 'text-[#10B981]', warning: 'text-[#F59E0B]', error: 'text-[#EF4444]', info: 'text-[#2563EB]' };

export function Toasts() {
  const { state, removeToast } = useApp();
  return (
    <div className="fixed top-4 right-4 z-[100] flex flex-col gap-2">
      <AnimatePresence>
        {state.ui.toasts.map(toast => {
          const Icon = iconMap[toast.type];
          return (
            <motion.div key={toast.id} initial={{ opacity: 0, x: 100, scale: 0.95 }} animate={{ opacity: 1, x: 0, scale: 1 }} exit={{ opacity: 0, x: 50, scale: 0.95 }}
              transition={{ type: 'spring', damping: 25, stiffness: 300 }}
              className="bg-white border border-[#E2E8F0] rounded-lg shadow-layer3 p-4 flex items-start gap-3 min-w-[320px] max-w-[400px]">
              <Icon size={20} className={`${colorMap[toast.type]} flex-shrink-0 mt-0.5`} />
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-[#0F172A]">{toast.title}</p>
                <p className="text-xs text-[#64748B] mt-0.5">{toast.message}</p>
              </div>
              <button onClick={() => removeToast(toast.id)} className="p-1 rounded text-[#94A3B8] hover:text-[#0F172A] hover:bg-[#F1F5F9] transition-colors flex-shrink-0">
                <X size={16} />
              </button>
            </motion.div>
          );
        })}
      </AnimatePresence>
    </div>
  );
}
