import React, { useState } from 'react';
import { 
  Plus, 
  Search, 
  Filter, 
  Trash2, 
  Calendar, 
  Tag, 
  ChevronRight, 
  ArrowLeftRight,
  Info,
  CheckCircle,
  X
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { Task } from '../types';

interface TasksScreenProps {
  tasks: Task[];
  onAddTask: (task: Omit<Task, 'id'>) => void;
  onUpdateTaskStatus: (id: string, newStatus: Task['status']) => void;
  onDeleteTask: (id: string) => void;
}

export default function TasksScreen({ tasks, onAddTask, onUpdateTaskStatus, onDeleteTask }: TasksScreenProps) {
  const [search, setSearch] = useState('');
  const [priorityFilter, setPriorityFilter] = useState<string>('all');
  const [showAddModal, setShowAddModal] = useState(false);

  // Form states
  const [newTitle, setNewTitle] = useState('');
  const [newDesc, setNewDesc] = useState('');
  const [newPriority, setNewPriority] = useState<Task['priority']>('medium');
  const [newDueDate, setNewDueDate] = useState('2026-07-10');
  const [newTags, setNewTags] = useState('');

  // Status lists
  const columns: { id: Task['status']; label: string; color: string }[] = [
    { id: 'todo', label: 'To Do', color: 'bg-neutral-100 text-neutral-800 border-neutral-200' },
    { id: 'in-progress', label: 'In Progress', color: 'bg-blue-50 text-blue-800 border-blue-200' },
    { id: 'review', label: 'Under Review', color: 'bg-amber-50 text-amber-800 border-amber-200' },
    { id: 'done', label: 'Completed', color: 'bg-emerald-50 text-emerald-800 border-emerald-200' },
  ];

  // Filter tasks
  const filteredTasks = tasks.filter(task => {
    const matchesSearch = task.title.toLowerCase().includes(search.toLowerCase()) || 
                          task.description.toLowerCase().includes(search.toLowerCase()) ||
                          task.tags.some(tag => tag.toLowerCase().includes(search.toLowerCase()));
    const matchesPriority = priorityFilter === 'all' || task.priority === priorityFilter;
    return matchesSearch && matchesPriority;
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim()) return;

    const tagsArray = newTags
      ? newTags.split(',').map(tag => tag.trim()).filter(Boolean)
      : ['General'];

    onAddTask({
      title: newTitle,
      description: newDesc,
      status: 'todo',
      priority: newPriority,
      dueDate: newDueDate,
      assignee: {
        name: 'Sarah Connor',
        avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150',
        initials: 'SC'
      },
      tags: tagsArray
    });

    // Reset Form
    setNewTitle('');
    setNewDesc('');
    setNewPriority('medium');
    setNewDueDate('2026-07-10');
    setNewTags('');
    setShowAddModal(false);
  };

  const getPriorityColor = (p: Task['priority']) => {
    switch (p) {
      case 'high': return 'bg-rose-50 text-rose-700 border-rose-100';
      case 'medium': return 'bg-amber-50 text-amber-700 border-amber-100';
      case 'low': return 'bg-neutral-50 text-neutral-600 border-neutral-200';
    }
  };

  const cycleStatus = (id: string, current: Task['status']) => {
    const sequence: Task['status'][] = ['todo', 'in-progress', 'review', 'done'];
    const nextIdx = (sequence.indexOf(current) + 1) % sequence.length;
    onUpdateTaskStatus(id, sequence[nextIdx]);
  };

  return (
    <div className="space-y-8" id="tasks-screen">
      {/* Top action header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="font-display text-2xl md:text-3xl font-bold tracking-tight text-neutral-900">
            Task Workspace
          </h1>
          <p className="text-sm text-neutral-500 mt-1">
            Organize work items, adjust priority, and move tasks across columns.
          </p>
        </div>
        <button
          id="add-task-trigger"
          onClick={() => setShowAddModal(true)}
          className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-neutral-950 text-white font-medium hover:bg-neutral-800 transition-colors shadow-sm self-start md:self-auto text-sm"
        >
          <Plus className="w-4.5 h-4.5" />
          <span>New Task</span>
        </button>
      </div>

      {/* Filter and search bar */}
      <div className="bg-white p-4 rounded-xl border border-neutral-200/80 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-2.5 h-4.5 w-4.5 text-neutral-400" />
          <input
            id="task-search-input"
            type="text"
            placeholder="Search tasks, descriptions, or tags..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2 text-sm bg-neutral-50/60 hover:bg-neutral-50 focus:bg-white border border-neutral-200 rounded-xl outline-none focus:border-neutral-400 focus:ring-1 focus:ring-neutral-400 transition-all placeholder:text-neutral-400"
          />
        </div>

        <div className="flex items-center gap-3">
          <span className="text-xs font-semibold text-neutral-500 flex items-center gap-1.5">
            <Filter className="w-3.5 h-3.5" />
            Priority:
          </span>
          <div className="flex bg-neutral-100 p-0.5 rounded-lg border border-neutral-200/30 text-xs font-medium">
            {['all', 'low', 'medium', 'high'].map((p) => (
              <button
                key={p}
                onClick={() => setPriorityFilter(p)}
                className={`px-3 py-1 rounded-md capitalize transition-all ${priorityFilter === p ? 'bg-white text-neutral-900 shadow-xs' : 'text-neutral-500 hover:text-neutral-900'}`}
              >
                {p}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Task Board Columns */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
        {columns.map((col) => {
          const colTasks = filteredTasks.filter(t => t.status === col.id);
          return (
            <div key={col.id} className="flex flex-col h-full bg-neutral-50/60 p-4 rounded-2xl border border-neutral-200/50 min-h-[400px]">
              {/* Column Title */}
              <div className="flex justify-between items-center mb-4 pb-2 border-b border-neutral-200/40">
                <div className="flex items-center gap-2">
                  <span className={`w-2.5 h-2.5 rounded-full ${
                    col.id === 'todo' ? 'bg-neutral-400' :
                    col.id === 'in-progress' ? 'bg-blue-500' :
                    col.id === 'review' ? 'bg-amber-500' : 'bg-emerald-500'
                  }`} />
                  <span className="text-xs font-bold text-neutral-800 uppercase tracking-wider">{col.label}</span>
                </div>
                <span className="text-xs font-mono font-bold bg-white border border-neutral-200/80 text-neutral-500 px-2 py-0.5 rounded-md shadow-2xs">
                  {colTasks.length}
                </span>
              </div>

              {/* Column Tasks list */}
              <div className="space-y-3.5 flex-1 overflow-y-auto">
                <AnimatePresence mode="popLayout">
                  {colTasks.map((task) => (
                    <motion.div
                      layout
                      key={task.id}
                      initial={{ opacity: 0, scale: 0.95 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, y: 15 }}
                      transition={{ duration: 0.2 }}
                      className="bg-white p-4 rounded-xl border border-neutral-200/80 shadow-3xs hover:shadow-2xs hover:border-neutral-300 transition-all group flex flex-col justify-between"
                    >
                      <div>
                        {/* Tags and Delete row */}
                        <div className="flex justify-between items-start gap-2 mb-2.5">
                          <div className="flex gap-1 flex-wrap">
                            {task.tags.map(t => (
                              <span key={t} className="text-[9px] font-bold font-mono px-1.5 py-0.5 rounded-md bg-neutral-50 text-neutral-500 border border-neutral-100">
                                {t}
                              </span>
                            ))}
                          </div>
                          <button
                            id={`delete-task-${task.id}`}
                            onClick={() => onDeleteTask(task.id)}
                            className="text-neutral-300 hover:text-rose-600 p-1 rounded-lg hover:bg-rose-50 transition-colors opacity-0 group-hover:opacity-100"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>

                        {/* Title & description */}
                        <h4 className="text-xs font-bold text-neutral-900 group-hover:text-blue-600 transition-colors leading-tight">
                          {task.title}
                        </h4>
                        <p className="text-[11px] text-neutral-400 mt-1 line-clamp-2 leading-relaxed">
                          {task.description}
                        </p>
                      </div>

                      {/* Footer Info Row */}
                      <div className="border-t border-neutral-100 pt-3 mt-3 flex justify-between items-center gap-2">
                        {/* Due date and Priority */}
                        <div className="flex flex-col gap-1.5">
                          <span className={`text-[9px] font-bold uppercase tracking-wider px-1.5 py-0.5 border rounded-md ${getPriorityColor(task.priority)}`}>
                            {task.priority}
                          </span>
                          <span className="text-[9px] text-neutral-400 font-medium flex items-center gap-1">
                            <Calendar className="w-3 h-3 text-neutral-300" />
                            {task.dueDate}
                          </span>
                        </div>

                        {/* Status switcher & Assignee avatar */}
                        <div className="flex items-center gap-2">
                          <button
                            id={`cycle-status-${task.id}`}
                            onClick={() => cycleStatus(task.id, task.status)}
                            title="Cycle workflow stage"
                            className="p-1 rounded bg-neutral-50 text-neutral-400 hover:text-blue-600 hover:bg-blue-50 border border-neutral-100 hover:border-blue-100 transition-all"
                          >
                            <ArrowLeftRight className="w-3.5 h-3.5" />
                          </button>
                          <img 
                            src={task.assignee.avatar} 
                            alt={task.assignee.name}
                            referrerPolicy="no-referrer"
                            className="w-6.5 h-6.5 rounded-full border border-neutral-200" 
                          />
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </AnimatePresence>

                {colTasks.length === 0 && (
                  <div className="text-center py-10 border border-dashed border-neutral-200 rounded-xl text-[11px] text-neutral-400 font-medium">
                    No items here
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Task Creation Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-neutral-950/40 backdrop-blur-xs flex items-center justify-center z-50 p-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            className="bg-white rounded-2xl border border-neutral-200 w-full max-w-md shadow-xl overflow-hidden"
          >
            <div className="px-5 py-4 bg-neutral-50 border-b border-neutral-100 flex justify-between items-center">
              <h3 className="font-display font-semibold text-sm text-neutral-900">Create New Workspace Task</h3>
              <button 
                id="close-task-modal"
                onClick={() => setShowAddModal(false)} 
                className="p-1 hover:bg-neutral-200 rounded-lg text-neutral-400 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="p-5 space-y-4">
              {/* Title */}
              <div>
                <label className="block text-[11px] font-bold uppercase tracking-wider text-neutral-500 mb-1.5">Task Title</label>
                <input
                  id="task-title-input"
                  type="text"
                  required
                  placeholder="Review creative mockups"
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  className="w-full px-3 py-2 text-xs bg-neutral-50 border border-neutral-200 rounded-lg outline-none focus:border-neutral-400 focus:bg-white transition-colors placeholder:text-neutral-400"
                />
              </div>

              {/* Description */}
              <div>
                <label className="block text-[11px] font-bold uppercase tracking-wider text-neutral-500 mb-1.5">Description</label>
                <textarea
                  id="task-desc-input"
                  rows={3}
                  placeholder="Provide context and details about requirements..."
                  value={newDesc}
                  onChange={(e) => setNewDesc(e.target.value)}
                  className="w-full px-3 py-2 text-xs bg-neutral-50 border border-neutral-200 rounded-lg outline-none focus:border-neutral-400 focus:bg-white transition-colors placeholder:text-neutral-400 resize-none"
                />
              </div>

              {/* Priority & Due Date Row */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-[11px] font-bold uppercase tracking-wider text-neutral-500 mb-1.5">Priority</label>
                  <select
                    id="task-priority-select"
                    value={newPriority}
                    onChange={(e) => setNewPriority(e.target.value as Task['priority'])}
                    className="w-full px-3 py-2 text-xs bg-neutral-50 border border-neutral-200 rounded-lg outline-none focus:border-neutral-400 focus:bg-white transition-colors"
                  >
                    <option value="low">Low Priority</option>
                    <option value="medium">Medium Priority</option>
                    <option value="high">High Priority</option>
                  </select>
                </div>
                <div>
                  <label className="block text-[11px] font-bold uppercase tracking-wider text-neutral-500 mb-1.5">Due Date</label>
                  <input
                    id="task-due-date"
                    type="date"
                    value={newDueDate}
                    onChange={(e) => setNewDueDate(e.target.value)}
                    className="w-full px-3 py-2 text-xs bg-neutral-50 border border-neutral-200 rounded-lg outline-none focus:border-neutral-400 focus:bg-white transition-colors"
                  />
                </div>
              </div>

              {/* Tags */}
              <div>
                <label className="block text-[11px] font-bold uppercase tracking-wider text-neutral-500 mb-1.5">Tags (comma separated)</label>
                <input
                  id="task-tags-input"
                  type="text"
                  placeholder="Design, Creative, Marketing"
                  value={newTags}
                  onChange={(e) => setNewTags(e.target.value)}
                  className="w-full px-3 py-2 text-xs bg-neutral-50 border border-neutral-200 rounded-lg outline-none focus:border-neutral-400 focus:bg-white transition-colors placeholder:text-neutral-400"
                />
              </div>

              {/* Actions */}
              <div className="border-t border-neutral-100 pt-4 mt-6 flex justify-end gap-3 text-xs font-semibold">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-4 py-2 border border-neutral-200 hover:bg-neutral-50 rounded-lg transition-colors"
                >
                  Cancel
                </button>
                <button
                  id="add-task-submit"
                  type="submit"
                  className="px-4 py-2 bg-neutral-950 text-white hover:bg-neutral-800 rounded-lg transition-colors shadow-sm"
                >
                  Create Task
                </button>
              </div>
            </form>
          </motion.div>
        </div>
      )}
    </div>
  );
}
