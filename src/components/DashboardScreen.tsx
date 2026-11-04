import React, { useState } from 'react';
import { 
  TrendingUp, 
  TrendingDown, 
  Calendar, 
  CheckCircle, 
  Clock, 
  Image as ImageIcon,
  Activity,
  ArrowRight,
  Filter
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { MetricCard, ActivityItem, Task, GalleryItem } from '../types';

interface DashboardScreenProps {
  tasks: Task[];
  galleryItems: GalleryItem[];
  activities: ActivityItem[];
  onNavigate: (screen: 'tasks' | 'gallery') => void;
}

export default function DashboardScreen({ tasks, galleryItems, activities, onNavigate }: DashboardScreenProps) {
  const [chartTimeframe, setChartTimeframe] = useState<'7days' | '30days'>('7days');
  const [activityFilter, setActivityFilter] = useState<string>('all');
  const [hoveredPoint, setHoveredPoint] = useState<{ x: number; y: number; val: number; label: string } | null>(null);

  // Derive metrics
  const totalTasks = tasks.length;
  const completedTasks = tasks.filter(t => t.status === 'done').length;
  const completionRate = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;
  const totalImages = galleryItems.length;
  const pendingTasks = tasks.filter(t => t.status !== 'done').length;

  const metrics: MetricCard[] = [
    {
      id: 'completion',
      title: 'Task Completion Rate',
      value: `${completionRate}%`,
      change: '+4.2%',
      isPositive: true,
      timeframe: 'vs last week'
    },
    {
      id: 'pending',
      title: 'Active Workload',
      value: `${pendingTasks} tasks`,
      change: '-2 today',
      isPositive: true,
      timeframe: 'vs yesterday'
    },
    {
      id: 'assets',
      title: 'Media Library',
      value: `${totalImages} items`,
      change: '+14% total',
      isPositive: true,
      timeframe: 'growth rate'
    },
    {
      id: 'productivity',
      title: 'Workforce Velocity',
      value: '94.8',
      change: '-0.3%',
      isPositive: false,
      timeframe: 'vs peak'
    }
  ];

  // SVG Chart Data
  const chartData7Days = [
    { label: 'Mon', val: 4 },
    { label: 'Tue', val: 7 },
    { label: 'Wed', val: 5 },
    { label: 'Thu', val: 12 },
    { label: 'Fri', val: 9 },
    { label: 'Sat', val: 15 },
    { label: 'Sun', val: 14 }
  ];

  const chartData30Days = [
    { label: 'Wk 1', val: 12 },
    { label: 'Wk 2', val: 24 },
    { label: 'Wk 3', val: 18 },
    { label: 'Wk 4', val: 38 },
  ];

  const activeChartData = chartTimeframe === '7days' ? chartData7Days : chartData30Days;
  const maxVal = Math.max(...activeChartData.map(d => d.val));

  // Filtered activities
  const filteredActivities = activities.filter(activity => {
    if (activityFilter === 'all') return true;
    return activity.category === activityFilter;
  });

  return (
    <div className="space-y-8" id="dashboard-screen">
      {/* Welcome / Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="font-display text-2xl md:text-3xl font-bold tracking-tight text-neutral-900">
            Workspace Overview
          </h1>
          <p className="text-sm text-neutral-500 mt-1">
            Real-time status, activity monitoring, and assets statistics.
          </p>
        </div>
        <div className="flex items-center gap-2 bg-white px-3.5 py-2 rounded-xl border border-neutral-200/80 shadow-xs self-start md:self-auto text-xs text-neutral-600 font-medium">
          <Calendar className="w-4 h-4 text-neutral-400" />
          <span>Last updated: July 5, 2026</span>
        </div>
      </div>

      {/* Metrics Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {metrics.map((metric, idx) => (
          <motion.div
            key={metric.id}
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: idx * 0.05 }}
            className="bg-white p-5 rounded-2xl border border-neutral-200/80 shadow-xs hover:border-neutral-300 transition-all duration-200 group flex flex-col justify-between h-[128px]"
          >
            <div className="flex justify-between items-start">
              <span className="text-xs font-medium text-neutral-500">{metric.title}</span>
              <span className={`flex items-center gap-0.5 text-xs font-semibold px-2 py-0.5 rounded-full ${
                metric.isPositive 
                  ? 'bg-emerald-50 text-emerald-700' 
                  : 'bg-rose-50 text-rose-700'
              }`}>
                {metric.isPositive ? <TrendingUp className="w-3 h-3" /> : <TrendingDown className="w-3 h-3" />}
                {metric.change}
              </span>
            </div>
            <div className="mt-2.5">
              <span className="text-2xl md:text-3xl font-bold font-display tracking-tight text-neutral-900 group-hover:text-blue-600 transition-colors">
                {metric.value}
              </span>
              <p className="text-[11px] text-neutral-400 mt-1 font-medium">{metric.timeframe}</p>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Interactive Chart and Short-cuts */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Chart Column (2/3 width on desktop) */}
        <div className="lg:col-span-2 bg-white p-6 rounded-2xl border border-neutral-200/80 shadow-xs flex flex-col justify-between">
          <div className="flex items-center justify-between border-b border-neutral-100 pb-4 mb-4">
            <div className="flex items-center gap-2.5">
              <div className="p-2 rounded-lg bg-neutral-50 text-neutral-900">
                <Activity className="w-4 h-4 text-blue-600" />
              </div>
              <div>
                <h3 className="text-sm font-semibold text-neutral-900 leading-none">Task Completion Velocity</h3>
                <span className="text-[11px] text-neutral-400 font-medium mt-1 inline-block">Visualizing tasks processed over time</span>
              </div>
            </div>
            {/* Chart toggle buttons */}
            <div className="flex bg-neutral-100/80 p-0.5 rounded-lg border border-neutral-200/20 text-xs font-medium">
              <button 
                onClick={() => { setChartTimeframe('7days'); setHoveredPoint(null); }}
                className={`px-2.5 py-1 rounded-md transition-all ${chartTimeframe === '7days' ? 'bg-white text-neutral-900 shadow-xs' : 'text-neutral-500 hover:text-neutral-900'}`}
              >
                7 Days
              </button>
              <button 
                onClick={() => { setChartTimeframe('30days'); setHoveredPoint(null); }}
                className={`px-2.5 py-1 rounded-md transition-all ${chartTimeframe === '30days' ? 'bg-white text-neutral-900 shadow-xs' : 'text-neutral-500 hover:text-neutral-900'}`}
              >
                30 Days
              </button>
            </div>
          </div>

          {/* SVG Line Chart */}
          <div className="relative h-60 w-full mt-4 flex flex-col justify-end">
            {/* Tooltip Overlay */}
            {hoveredPoint && (
              <div 
                className="absolute bg-neutral-900 text-white rounded-lg px-2.5 py-1.5 text-[11px] shadow-lg pointer-events-none z-10 font-medium -translate-x-1/2 -translate-y-full transition-all duration-150"
                style={{ left: hoveredPoint.x, top: hoveredPoint.y - 12 }}
              >
                <div className="font-semibold text-blue-400">{hoveredPoint.label}</div>
                <div>Completed: <span className="font-mono">{hoveredPoint.val}</span></div>
              </div>
            )}

            {/* Custom SVG Drawing */}
            <div className="w-full h-44 relative">
              <svg className="w-full h-full overflow-visible" viewBox="0 0 500 150" preserveAspectRatio="none">
                {/* Horizontal grid lines */}
                <line x1="0" y1="0" x2="500" y2="0" stroke="#f4f4f5" strokeWidth="1" strokeDasharray="3,3" />
                <line x1="0" y1="50" x2="500" y2="50" stroke="#f4f4f5" strokeWidth="1" strokeDasharray="3,3" />
                <line x1="0" y1="100" x2="500" y2="100" stroke="#f4f4f5" strokeWidth="1" strokeDasharray="3,3" />
                <line x1="0" y1="150" x2="500" y2="150" stroke="#e4e4e7" strokeWidth="1.5" />

                {/* Draw SVG Path based on data */}
                {activeChartData.length > 1 && (
                  <>
                    {/* Fill Gradient path */}
                    <path
                      d={`
                        M 0,150
                        ${activeChartData.map((d, index) => {
                          const x = (index / (activeChartData.length - 1)) * 500;
                          const y = 150 - (d.val / maxVal) * 120;
                          return `L ${x},${y}`;
                        }).join(' ')}
                        L 500,150 Z
                      `}
                      fill="url(#gradient)"
                      className="transition-all duration-500 ease-in-out"
                    />

                    {/* Smooth curve Line path */}
                    <path
                      d={activeChartData.map((d, index) => {
                        const x = (index / (activeChartData.length - 1)) * 500;
                        const y = 150 - (d.val / maxVal) * 120;
                        return `${index === 0 ? 'M' : 'L'} ${x},${y}`;
                      }).join(' ')}
                      fill="none"
                      stroke="#2563eb"
                      strokeWidth="2.5"
                      className="transition-all duration-500 ease-in-out"
                    />

                    {/* Interactive dots */}
                    {activeChartData.map((d, index) => {
                      const x = (index / (activeChartData.length - 1)) * 500;
                      const y = 150 - (d.val / maxVal) * 120;
                      return (
                        <circle
                          key={index}
                          cx={x}
                          cy={y}
                          r={hoveredPoint?.label === d.label ? "6" : "4"}
                          fill={hoveredPoint?.label === d.label ? "#2563eb" : "#ffffff"}
                          stroke="#2563eb"
                          strokeWidth="2.5"
                          className="cursor-pointer transition-all duration-150"
                          onMouseEnter={(e) => {
                            const rect = e.currentTarget.getBoundingClientRect();
                            const containerRect = e.currentTarget.parentElement?.parentElement?.getBoundingClientRect();
                            if (containerRect) {
                              setHoveredPoint({
                                x: rect.left - containerRect.left + (rect.width / 2),
                                y: rect.top - containerRect.top,
                                val: d.val,
                                label: d.label
                              });
                            }
                          }}
                          onMouseLeave={() => setHoveredPoint(null)}
                        />
                      );
                    })}
                  </>
                )}

                {/* Gradient Definition */}
                <defs>
                  <linearGradient id="gradient" x1="0%" y1="0%" x2="0%" y2="100%">
                    <stop offset="0%" stopColor="#3b82f6" stopOpacity="0.2" />
                    <stop offset="100%" stopColor="#3b82f6" stopOpacity="0.0" />
                  </linearGradient>
                </defs>
              </svg>
            </div>

            {/* X-axis labels */}
            <div className="flex justify-between text-[11px] text-neutral-400 px-1 font-mono mt-3">
              {activeChartData.map((d, index) => (
                <span key={index} className="w-12 text-center">{d.label}</span>
              ))}
            </div>
          </div>
        </div>

        {/* Quick Launchpad Column */}
        <div className="bg-white p-6 rounded-2xl border border-neutral-200/80 shadow-xs flex flex-col justify-between">
          <div className="border-b border-neutral-100 pb-4 mb-4">
            <h3 className="text-sm font-semibold text-neutral-900">Workspace Shortcuts</h3>
            <p className="text-[11px] text-neutral-400 mt-1 font-medium">Quick links to active board and collections</p>
          </div>

          <div className="flex flex-col gap-3.5 my-4">
            <button 
              onClick={() => onNavigate('tasks')}
              className="group flex items-center justify-between p-3.5 rounded-xl border border-neutral-200/80 hover:border-neutral-300 hover:bg-neutral-50/50 transition-all text-left"
            >
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-indigo-50 text-indigo-600 flex items-center justify-center">
                  <CheckCircle className="w-4 h-4" />
                </div>
                <div>
                  <span className="text-xs font-semibold text-neutral-900 group-hover:text-indigo-600 transition-colors">Manage Board</span>
                  <p className="text-[10px] text-neutral-400 mt-0.5">{pendingTasks} unfinished items pending</p>
                </div>
              </div>
              <ArrowRight className="w-4 h-4 text-neutral-300 group-hover:text-indigo-600 group-hover:translate-x-0.5 transition-all" />
            </button>

            <button 
              onClick={() => onNavigate('gallery')}
              className="group flex items-center justify-between p-3.5 rounded-xl border border-neutral-200/80 hover:border-neutral-300 hover:bg-neutral-50/50 transition-all text-left"
            >
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center">
                  <ImageIcon className="w-4 h-4" />
                </div>
                <div>
                  <span className="text-xs font-semibold text-neutral-900 group-hover:text-blue-600 transition-colors">Media Library</span>
                  <p className="text-[10px] text-neutral-400 mt-0.5">{totalImages} high-quality hotlinked cards</p>
                </div>
              </div>
              <ArrowRight className="w-4 h-4 text-neutral-300 group-hover:text-blue-600 group-hover:translate-x-0.5 transition-all" />
            </button>
          </div>

          <div className="bg-neutral-50 p-4 rounded-xl border border-neutral-200/60 text-[11px] text-neutral-500 leading-relaxed font-medium">
            💡 <strong className="text-neutral-700">Design tip:</strong> Every visual module uses high-contrast typography, delicate borders, and micro-animations to create a premium, balanced layout.
          </div>
        </div>
      </div>

      {/* Recent Activity Stream */}
      <div className="bg-white p-6 rounded-2xl border border-neutral-200/80 shadow-xs">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-neutral-100 pb-4 mb-5">
          <div>
            <h3 className="text-sm font-semibold text-neutral-900">Recent Activity Timeline</h3>
            <p className="text-[11px] text-neutral-400 mt-1 font-medium">Tracking system, task edits, and settings modifications</p>
          </div>
          {/* Filter Pills */}
          <div className="flex items-center gap-1.5 flex-wrap">
            <Filter className="w-3.5 h-3.5 text-neutral-400 mr-1 hidden sm:inline" />
            {['all', 'task', 'gallery', 'system', 'settings'].map((cat) => (
              <button
                key={cat}
                onClick={() => setActivityFilter(cat)}
                className={`px-2.5 py-1 rounded-lg text-[10px] font-semibold uppercase tracking-wider border transition-all ${
                  activityFilter === cat
                    ? 'bg-neutral-900 border-neutral-900 text-white shadow-xs'
                    : 'bg-neutral-50 border-neutral-200 text-neutral-500 hover:text-neutral-900'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* Timeline List */}
        <div className="relative border-l border-neutral-100 pl-4 ml-2.5 space-y-6">
          <AnimatePresence mode="popLayout">
            {filteredActivities.map((act) => (
              <motion.div
                key={act.id}
                layout
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ duration: 0.2 }}
                className="relative flex gap-3 items-start group"
              >
                {/* Connector Dot */}
                <span className="absolute -left-[21px] top-1.5 w-2.5 h-2.5 rounded-full border-2 border-white bg-neutral-900 ring-4 ring-neutral-50 group-hover:bg-blue-600 transition-colors" />

                <img 
                  src={act.user.avatar} 
                  alt={act.user.name}
                  referrerPolicy="no-referrer"
                  className="w-8 h-8 rounded-lg object-cover border border-neutral-100" 
                />

                <div className="flex-1 min-w-0">
                  <div className="text-xs text-neutral-600 leading-normal">
                    <span className="font-semibold text-neutral-900 mr-1.5">{act.user.name}</span>
                    <span className="text-neutral-500">{act.action}</span>
                    <span className="font-medium text-neutral-800 ml-1.5 underline decoration-neutral-200 decoration-wavy">{act.target}</span>
                  </div>
                  <span className="text-[10px] text-neutral-400 font-mono mt-1.5 inline-block">{act.time}</span>
                </div>

                <span className={`text-[9px] font-bold font-mono px-1.5 py-0.5 rounded-md uppercase border tracking-wider self-center ${
                  act.category === 'task' ? 'bg-indigo-50 border-indigo-100 text-indigo-700' :
                  act.category === 'gallery' ? 'bg-blue-50 border-blue-100 text-blue-700' :
                  act.category === 'settings' ? 'bg-amber-50 border-amber-100 text-amber-700' :
                  'bg-neutral-50 border-neutral-200 text-neutral-600'
                }`}>
                  {act.category}
                </span>
              </motion.div>
            ))}
          </AnimatePresence>

          {filteredActivities.length === 0 && (
            <div className="text-center py-8 text-xs text-neutral-400 font-medium">
              No recent activities match this category filter.
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
