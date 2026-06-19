import { useState, useMemo } from 'react';
import { useApp } from '@/context/AppContext';
import { generateUUID } from '@/context/AppContext';
import { users } from '@/data/mockData';
import { motion } from 'framer-motion';
import {
  CheckSquare, Plus, Search, Trash2, Edit, X,
  Clock, User, CheckCircle2, Circle
} from 'lucide-react';
import type { Task } from '@/types';

export function TasksPage() {
  const { state, dispatch, addToast } = useApp();
  const { tasks } = state.data;
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [priorityFilter, setPriorityFilter] = useState('all');
  const [showModal, setShowModal] = useState(false);
  const [editingTask, setEditingTask] = useState<Task | null>(null);

  // Form state
  const [tTitle, setTTitle] = useState('');
  const [tDesc, setTDesc] = useState('');
  const [tOwner, setTOwner] = useState('');
  const [tPriority, setTPriority] = useState<'High' | 'Medium' | 'Low'>('Medium');
  const [tDueDate, setTDueDate] = useState('');
  const [tStatus, setTStatus] = useState<Task['status']>('Not Started');
  const [tCategory, setTCategory] = useState('');
  const [tProgress, setTProgress] = useState(0);

  const ownerName = (oid: string) => users.find((u: typeof users[0]) => u.id === oid)?.name || 'Unassigned';

  const filtered = useMemo(() => {
    let list = [...tasks];
    if (search) list = list.filter(t => t.title.toLowerCase().includes(search.toLowerCase()) || t.description.toLowerCase().includes(search.toLowerCase()));
    if (statusFilter !== 'all') list = list.filter(t => t.status === statusFilter);
    if (priorityFilter !== 'all') list = list.filter(t => t.priority === priorityFilter);
    return list.sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime());
  }, [tasks, search, statusFilter, priorityFilter]);

  const statusCounts = useMemo(() => ({
    'Not Started': tasks.filter(t => t.status === 'Not Started').length,
    'In Progress': tasks.filter(t => t.status === 'In Progress').length,
    'Completed': tasks.filter(t => t.status === 'Completed').length,
  }), [tasks]);

  const resetForm = () => {
    setTTitle(''); setTDesc(''); setTOwner(users[0]?.id || ''); setTPriority('Medium');
    setTDueDate(''); setTStatus('Not Started'); setTCategory(''); setTProgress(0); setEditingTask(null);
  };

  const openCreate = () => { resetForm(); setShowModal(true); };
  const openEdit = (t: Task) => {
    setEditingTask(t); setTTitle(t.title); setTDesc(t.description); setTOwner(t.ownerId);
    setTPriority(t.priority); setTDueDate(t.dueDate); setTStatus(t.status); setTCategory(t.category); setTProgress(t.completionPercentage);
    setShowModal(true);
  };

  const handleSave = () => {
    if (!tTitle.trim()) { addToast({ type: 'error', title: 'Validation', message: 'Title is required' }); return; }
    if (editingTask) {
      dispatch({
        type: 'UPDATE_TASK',
        payload: { ...editingTask, title: tTitle, description: tDesc, ownerId: tOwner, priority: tPriority, dueDate: tDueDate, status: tStatus, category: tCategory, completionPercentage: tProgress, updatedAt: new Date().toISOString() }
      });
      addToast({ type: 'success', title: 'Updated', message: 'Task updated successfully' });
    } else {
      const newTask: Task = {
        id: generateUUID(), title: tTitle, description: tDesc, ownerId: tOwner,
        priority: tPriority, dueDate: tDueDate || new Date().toISOString().split('T')[0],
        status: tStatus, completionPercentage: tProgress, category: tCategory,
        sourceRecommendationId: null, sourceEventId: null,
        createdAt: new Date().toISOString(), updatedAt: new Date().toISOString()
      };
      dispatch({ type: 'CREATE_TASK', payload: newTask });
      addToast({ type: 'success', title: 'Created', message: 'Task created' });
    }
    setShowModal(false); resetForm();
  };

  const handleDelete = (id: string) => {
    if (confirm('Delete this task?')) { dispatch({ type: 'DELETE_TASK', id }); addToast({ type: 'success', title: 'Deleted', message: 'Task removed' }); }
  };

  const handleQuickStatus = (task: Task, newStatus: Task['status']) => {
    const newProgress = newStatus === 'Completed' ? 100 : newStatus === 'Not Started' ? 0 : task.completionPercentage;
    dispatch({ type: 'UPDATE_TASK', payload: { ...task, status: newStatus, completionPercentage: newProgress, updatedAt: new Date().toISOString() } });
    addToast({ type: 'success', title: 'Updated', message: `Task marked as ${newStatus}` });
  };

  const statusClass = (s: string) => {
    if (s === 'Completed') return 'bg-emerald-50 text-emerald-700';
    if (s === 'In Progress') return 'bg-blue-50 text-blue-700';
    if (s === 'Cancelled') return 'bg-red-50 text-red-700';
    return 'bg-gray-50 text-gray-600';
  };
  const priorityClass = (p: string) => {
    if (p === 'High') return 'bg-red-50 text-red-700';
    if (p === 'Medium') return 'bg-amber-50 text-amber-700';
    return 'bg-green-50 text-green-700';
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-[#0F172A]">Tasks</h1>
          <p className="text-sm text-[#64748B] mt-1">{tasks.length} tasks from recommendations</p>
        </div>
        <button onClick={openCreate} className="flex items-center gap-2 px-4 py-2 bg-[#0F172A] text-white rounded-lg text-sm font-medium hover:bg-[#1E293B]">
          <Plus size={16} /> New Task
        </button>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
        <div className="bg-white border border-[#E2E8F0] rounded-xl p-4 flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-gray-100 flex items-center justify-center"><Circle size={20} className="text-gray-500" /></div>
          <div><div className="text-2xl font-bold text-[#0F172A]">{statusCounts['Not Started']}</div><div className="text-xs text-[#64748B]">Not Started</div></div>
        </div>
        <div className="bg-white border border-[#E2E8F0] rounded-xl p-4 flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-blue-100 flex items-center justify-center"><Clock size={20} className="text-blue-500" /></div>
          <div><div className="text-2xl font-bold text-[#0F172A]">{statusCounts['In Progress']}</div><div className="text-xs text-[#64748B]">In Progress</div></div>
        </div>
        <div className="bg-white border border-[#E2E8F0] rounded-xl p-4 flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-emerald-100 flex items-center justify-center"><CheckCircle2 size={20} className="text-emerald-500" /></div>
          <div><div className="text-2xl font-bold text-[#0F172A]">{statusCounts['Completed']}</div><div className="text-xs text-[#64748B]">Completed</div></div>
        </div>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap items-center gap-3 mb-4">
        <div className="relative flex-1 min-w-[200px] max-w-[320px]">
          <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#94A3B8]" />
          <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search tasks..." className="w-full pl-9 pr-4 py-2 border border-[#E2E8F0] rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#2563EB]" />
        </div>
        <select value={statusFilter} onChange={e => setStatusFilter(e.target.value)} className="px-3 py-2 border border-[#E2E8F0] rounded-lg text-sm bg-white focus:outline-none">
          <option value="all">All Status</option>
          <option value="Not Started">Not Started</option>
          <option value="In Progress">In Progress</option>
          <option value="Completed">Completed</option>
          <option value="Cancelled">Cancelled</option>
        </select>
        <select value={priorityFilter} onChange={e => setPriorityFilter(e.target.value)} className="px-3 py-2 border border-[#E2E8F0] rounded-lg text-sm bg-white focus:outline-none">
          <option value="all">All Priorities</option>
          <option value="High">High</option>
          <option value="Medium">Medium</option>
          <option value="Low">Low</option>
        </select>
      </div>

      {/* Task Cards */}
      <div className="space-y-3">
        {filtered.map(t => (
          <motion.div key={t.id} layout initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="bg-white border border-[#E2E8F0] rounded-xl p-4 hover:shadow-sm transition-shadow">
            <div className="flex items-start gap-3">
              <button onClick={() => handleQuickStatus(t, t.status === 'Completed' ? 'Not Started' : 'Completed')} className="mt-1">
                {t.status === 'Completed' ? <CheckCircle2 size={20} className="text-emerald-500" /> : <Circle size={20} className="text-gray-300 hover:text-gray-500" />}
              </button>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  <h3 className={`text-sm font-semibold ${t.status === 'Completed' ? 'text-[#94A3B8] line-through' : 'text-[#0F172A]'}`}>{t.title}</h3>
                  <span className={`px-2 py-0.5 rounded-full text-[10px] font-semibold ${priorityClass(t.priority)}`}>{t.priority}</span>
                  <span className={`px-2 py-0.5 rounded-full text-[10px] font-semibold ${statusClass(t.status)}`}>{t.status}</span>
                </div>
                <p className="text-xs text-[#64748B] mb-2 line-clamp-2">{t.description}</p>
                <div className="flex items-center gap-4 text-[11px] text-[#94A3B8]">
                  <span className="flex items-center gap-1"><User size={12} /> {ownerName(t.ownerId)}</span>
                  <span className="flex items-center gap-1"><Clock size={12} /> Due {new Date(t.dueDate).toLocaleDateString()}</span>
                  <span>{t.category}</span>
                </div>
                {t.status === 'In Progress' && (
                  <div className="mt-2 flex items-center gap-2">
                    <div className="flex-1 h-1.5 bg-[#F1E5F9] rounded-full overflow-hidden">
                      <div className="h-full bg-blue-500 rounded-full transition-all" style={{ width: `${t.completionPercentage}%` }} />
                    </div>
                    <span className="text-[10px] text-[#64748B]">{t.completionPercentage}%</span>
                  </div>
                )}
              </div>
              <div className="flex items-center gap-1 flex-shrink-0">
                {t.status === 'Not Started' && <button onClick={() => handleQuickStatus(t, 'In Progress')} className="p-1.5 rounded-lg hover:bg-blue-50 text-[#64748B] hover:text-blue-600" title="Start"><Clock size={14} /></button>}
                {t.status === 'In Progress' && <button onClick={() => handleQuickStatus(t, 'Completed')} className="p-1.5 rounded-lg hover:bg-emerald-50 text-[#64748B] hover:text-emerald-600" title="Complete"><CheckCircle2 size={14} /></button>}
                <button onClick={() => openEdit(t)} className="p-1.5 rounded-lg hover:bg-[#F1E5F9] text-[#64748B]"><Edit size={14} /></button>
                <button onClick={() => handleDelete(t.id)} className="p-1.5 rounded-lg hover:bg-red-50 text-[#64748B] hover:text-red-600"><Trash2 size={14} /></button>
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {filtered.length === 0 && (
        <div className="text-center py-16 text-[#94A3B8]">
          <CheckSquare size={48} className="mx-auto mb-4 opacity-40" />
          <p className="text-lg font-medium">No tasks found</p>
          <p className="text-sm mt-1">Create a task or convert a recommendation</p>
        </div>
      )}

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/50" onClick={() => { setShowModal(false); resetForm(); }} />
          <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="relative bg-white rounded-xl shadow-xl w-full max-w-lg max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between p-5 border-b border-[#E2E8F0]">
              <h2 className="text-lg font-semibold">{editingTask ? 'Edit Task' : 'New Task'}</h2>
              <button onClick={() => { setShowModal(false); resetForm(); }} className="p-1.5 rounded-lg hover:bg-[#F1E5F9]"><X size={18} /></button>
            </div>
            <div className="p-5 space-y-4">
              <div><label className="block text-sm font-medium text-[#334155] mb-1">Title *</label><input value={tTitle} onChange={e => setTTitle(e.target.value)} className="w-full px-3 py-2 border border-[#E2E8F0] rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#2563EB]" placeholder="Task title..." /></div>
              <div><label className="block text-sm font-medium text-[#334155] mb-1">Description</label><textarea value={tDesc} onChange={e => setTDesc(e.target.value)} rows={3} className="w-full px-3 py-2 border border-[#E2E8F0] rounded-lg text-sm focus:outline-none" placeholder="Details..." /></div>
              <div className="grid grid-cols-2 gap-3">
                <div><label className="block text-sm font-medium text-[#334155] mb-1">Owner</label><select value={tOwner} onChange={e => setTOwner(e.target.value)} className="w-full px-3 py-2 border border-[#E2E8F0] rounded-lg text-sm">{users.map((u: typeof users[0]) => <option key={u.id} value={u.id}>{u.name}</option>)}</select></div>
                <div><label className="block text-sm font-medium text-[#334155] mb-1">Priority</label><select value={tPriority} onChange={e => setTPriority(e.target.value as any)} className="w-full px-3 py-2 border border-[#E2E8F0] rounded-lg text-sm"><option>High</option><option>Medium</option><option>Low</option></select></div>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div><label className="block text-sm font-medium text-[#334155] mb-1">Due Date</label><input type="date" value={tDueDate} onChange={e => setTDueDate(e.target.value)} className="w-full px-3 py-2 border border-[#E2E8F0] rounded-lg text-sm" /></div>
                <div><label className="block text-sm font-medium text-[#334155] mb-1">Status</label><select value={tStatus} onChange={e => setTStatus(e.target.value as any)} className="w-full px-3 py-2 border border-[#E2E8F0] rounded-lg text-sm"><option>Not Started</option><option>In Progress</option><option>Completed</option><option>Cancelled</option></select></div>
              </div>
              <div><label className="block text-sm font-medium text-[#334155] mb-1">Category</label><input value={tCategory} onChange={e => setTCategory(e.target.value)} className="w-full px-3 py-2 border border-[#E2E8F0] rounded-lg text-sm" placeholder="e.g., EA Governance" /></div>
              {tStatus === 'In Progress' && (
                <div><label className="block text-sm font-medium text-[#334155] mb-1">Progress ({tProgress}%)</label><input type="range" min={0} max={100} value={tProgress} onChange={e => setTProgress(Number(e.target.value))} className="w-full" /></div>
              )}
            </div>
            <div className="flex justify-end gap-2 p-5 border-t border-[#E2E8F0] bg-[#F8FAFC]">
              <button onClick={() => { setShowModal(false); resetForm(); }} className="px-4 py-2 border border-[#E2E8F0] rounded-lg text-sm hover:bg-[#F1E5F9]">Cancel</button>
              <button onClick={handleSave} className="px-4 py-2 bg-[#0F172A] text-white rounded-lg text-sm hover:bg-[#1E293B]">{editingTask ? 'Save Changes' : 'Create Task'}</button>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  );
}
