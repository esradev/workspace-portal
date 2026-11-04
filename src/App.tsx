import React, { useState, useEffect } from 'react';
import { ScreenType, Task, GalleryItem, ActivityItem, UserProfile } from './types';
import Sidebar from './components/Sidebar';
import DashboardScreen from './components/DashboardScreen';
import TasksScreen from './components/TasksScreen';
import GalleryScreen from './components/GalleryScreen';
import SettingsScreen from './components/SettingsScreen';
import { motion, AnimatePresence } from 'motion/react';

// Default initial database states
const DEFAULT_PROFILE: UserProfile = {
  name: 'Sarah Connor',
  role: 'Lead Visual Designer',
  email: 'sarah.c@sphere.io',
  bio: 'Visual developer focusing on high-contrast typography grids, fluid micro-interactions, and responsive layout structures.',
  avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150',
  notifications: {
    email: true,
    push: true,
    marketing: false
  },
  theme: 'default'
};

const DEFAULT_TASKS: Task[] = [
  {
    id: 't-1',
    title: 'Polish Workspace Typography',
    description: 'Integrate elegant Space Grotesk headings paired with Inter body fonts to build high scannability.',
    status: 'done',
    priority: 'high',
    dueDate: '2026-07-06',
    assignee: { name: 'Sarah Connor', avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150', initials: 'SC' },
    tags: ['Design', 'UX/UI']
  },
  {
    id: 't-2',
    title: 'Assemble Media Assets Library',
    description: 'Gather high-quality Unsplash image URLs to hotlink within the layout screen, ensuring referrer policies are set.',
    status: 'in-progress',
    priority: 'medium',
    dueDate: '2026-07-08',
    assignee: { name: 'Sarah Connor', avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150', initials: 'SC' },
    tags: ['Media', 'Assets']
  },
  {
    id: 't-3',
    title: 'Draft Project Architecture PDF',
    description: 'Compile core file trees and module interactions to share with stakeholders before development phases.',
    status: 'todo',
    priority: 'low',
    dueDate: '2026-07-12',
    assignee: { name: 'Sarah Connor', avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150', initials: 'SC' },
    tags: ['Documentation']
  },
  {
    id: 't-4',
    title: 'Audit Interactive Lightbox Modal',
    description: 'Perform visual quality checks on the full-screen photo detail popup. Check transitions and metadata bindings.',
    status: 'review',
    priority: 'high',
    dueDate: '2026-07-07',
    assignee: { name: 'Sarah Connor', avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150', initials: 'SC' },
    tags: ['Quality', 'UI']
  }
];

const DEFAULT_GALLERY: GalleryItem[] = [
  {
    id: 'g-1',
    title: 'Modernist Brutalist Facade',
    description: 'Minimal concrete architectural forms featuring bold geometry and striking shadows at sunset.',
    category: 'architecture',
    imageUrl: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=600',
    photographer: 'Sven Brandsma',
    likes: 42,
    tags: ['Concrete', 'Shadows', 'Modernism']
  },
  {
    id: 'g-2',
    title: 'Minimalist Studio Desk setup',
    description: 'Monochrome workbench with mechanical keyboard, secondary display, and ambient spotlighting.',
    category: 'tech',
    imageUrl: 'https://images.unsplash.com/photo-1498050108023-c5249f4df085?w=600',
    photographer: 'Christopher Gower',
    likes: 28,
    tags: ['Workspace', 'Setup', 'Minimalist']
  },
  {
    id: 'g-3',
    title: 'Reflection Lake Morning',
    description: 'Mirror reflection of pine forests and snowy peak mountain ranges under mist.',
    category: 'nature',
    imageUrl: 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?w=600',
    photographer: 'Jay Mantri',
    likes: 56,
    tags: ['Scenic', 'Reflections', 'Lake']
  },
  {
    id: 'g-4',
    title: 'Brutalist Swimming Pool',
    description: 'Crisp blue water pool recessed beneath cantilevering raw architectural platforms.',
    category: 'architecture',
    imageUrl: 'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=600',
    photographer: 'Federico Respini',
    likes: 31,
    tags: ['Pool', 'Brutalist', 'Water']
  },
  {
    id: 'g-5',
    title: 'Source Editor Close-up',
    description: 'High-contrast development window showing clean functional styling and code loops.',
    category: 'tech',
    imageUrl: 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=600',
    photographer: 'Artem Sapegin',
    likes: 19,
    tags: ['Development', 'TypeScript', 'Syntax']
  },
  {
    id: 'g-6',
    title: 'Golden Hour Tuscany Hills',
    description: 'Rolling clay farm slopes covered by olive rows basking in vibrant warm orange sunset rays.',
    category: 'nature',
    imageUrl: 'https://images.unsplash.com/photo-1472214222541-d510753a4907?w=600',
    photographer: 'Karsten Würth',
    likes: 67,
    tags: ['Sunset', 'Tuscany', 'Valley']
  }
];

const DEFAULT_ACTIVITIES: ActivityItem[] = [
  {
    id: 'a-1',
    user: { name: 'Sarah Connor', avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150', initials: 'SC' },
    action: 'marked as completed',
    target: 'Polish Workspace Typography',
    time: '3 hours ago',
    category: 'task'
  },
  {
    id: 'a-2',
    user: { name: 'Sarah Connor', avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150', initials: 'SC' },
    action: 'hotlinked new image',
    target: 'Golden Hour Tuscany Hills',
    time: 'Yesterday',
    category: 'gallery'
  },
  {
    id: 'a-3',
    user: { name: 'Sarah Connor', avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150', initials: 'SC' },
    action: 'updated notification rules in',
    target: 'System Settings',
    time: '2 days ago',
    category: 'settings'
  }
];

export default function App() {
  const [activeScreen, setActiveScreen] = useState<ScreenType>('dashboard');

  // Lazy initialize state from localStorage
  const [profile, setProfile] = useState<UserProfile>(() => {
    const saved = localStorage.getItem('sphere_profile');
    return saved ? JSON.parse(saved) : DEFAULT_PROFILE;
  });

  const [tasks, setTasks] = useState<Task[]>(() => {
    const saved = localStorage.getItem('sphere_tasks');
    return saved ? JSON.parse(saved) : DEFAULT_TASKS;
  });

  const [galleryItems, setGalleryItems] = useState<GalleryItem[]>(() => {
    const saved = localStorage.getItem('sphere_gallery');
    return saved ? JSON.parse(saved) : DEFAULT_GALLERY;
  });

  const [activities, setActivities] = useState<ActivityItem[]>(() => {
    const saved = localStorage.getItem('sphere_activities');
    return saved ? JSON.parse(saved) : DEFAULT_ACTIVITIES;
  });

  // Save states on updates
  useEffect(() => {
    localStorage.setItem('sphere_profile', JSON.stringify(profile));
  }, [profile]);

  useEffect(() => {
    localStorage.setItem('sphere_tasks', JSON.stringify(tasks));
  }, [tasks]);

  useEffect(() => {
    localStorage.setItem('sphere_gallery', JSON.stringify(galleryItems));
  }, [galleryItems]);

  useEffect(() => {
    localStorage.setItem('sphere_activities', JSON.stringify(activities));
  }, [activities]);

  // Log new activities helper
  const addActivity = (action: string, target: string, category: ActivityItem['category']) => {
    const newAct: ActivityItem = {
      id: `a-${Date.now()}`,
      user: { name: profile.name, avatar: profile.avatar, initials: 'SC' },
      action,
      target,
      time: 'Just now',
      category
    };
    setActivities(prev => [newAct, ...prev]);
  };

  // Task Handlers
  const handleAddTask = (taskData: Omit<Task, 'id'>) => {
    const newTask: Task = {
      ...taskData,
      id: `t-${Date.now()}`
    };
    setTasks(prev => [newTask, ...prev]);
    addActivity('created work item', newTask.title, 'task');
  };

  const handleUpdateTaskStatus = (id: string, newStatus: Task['status']) => {
    setTasks(prev => prev.map(t => {
      if (t.id === id) {
        addActivity(`moved task status to ${newStatus}`, t.title, 'task');
        return { ...t, status: newStatus };
      }
      return t;
    }));
  };

  const handleDeleteTask = (id: string) => {
    const taskToDelete = tasks.find(t => t.id === id);
    if (taskToDelete) {
      setTasks(prev => prev.filter(t => t.id !== id));
      addActivity('archived task card', taskToDelete.title, 'task');
    }
  };

  // Gallery Handlers
  const handleAddGalleryItem = (itemData: Omit<GalleryItem, 'id'>) => {
    const newItem: GalleryItem = {
      ...itemData,
      id: `g-${Date.now()}`
    };
    setGalleryItems(prev => [newItem, ...prev]);
    addActivity('hotlinked fresh card', newItem.title, 'gallery');
  };

  const handleLikeGalleryItem = (id: string) => {
    setGalleryItems(prev => prev.map(item => {
      if (item.id === id) {
        return { ...item, likes: item.likes + 1 };
      }
      return item;
    }));
  };

  // Maintenance Handlers
  const handleResetData = () => {
    localStorage.clear();
    setProfile(DEFAULT_PROFILE);
    setTasks(DEFAULT_TASKS);
    setGalleryItems(DEFAULT_GALLERY);
    setActivities(DEFAULT_ACTIVITIES);
    setActiveScreen('dashboard');
  };

  const handleExportData = () => {
    const dataPackage = {
      exporter: profile.name,
      exportTimestamp: new Date().toISOString(),
      profile,
      tasks,
      galleryItems,
      activities
    };

    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(dataPackage, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute("href", dataStr);
    downloadAnchor.setAttribute("download", `sphere-workspace-export-${Date.now()}.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
  };

  return (
    <div className="flex flex-col lg:flex-row min-h-screen bg-[#fcfcfd]" id="app-container">
      {/* Navigation Sidebar */}
      <Sidebar 
        activeScreen={activeScreen} 
        setActiveScreen={setActiveScreen} 
        profile={profile} 
      />

      {/* Main Workspace Frame */}
      <main className="flex-1 px-4 py-8 md:p-8 lg:p-10 overflow-y-auto max-w-7xl mx-auto w-full">
        <AnimatePresence mode="wait">
          <motion.div
            key={activeScreen}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.25 }}
            className="h-full"
          >
            {activeScreen === 'dashboard' && (
              <DashboardScreen 
                tasks={tasks} 
                galleryItems={galleryItems} 
                activities={activities}
                onNavigate={(scr) => setActiveScreen(scr)}
              />
            )}
            {activeScreen === 'tasks' && (
              <TasksScreen 
                tasks={tasks} 
                onAddTask={handleAddTask} 
                onUpdateTaskStatus={handleUpdateTaskStatus} 
                onDeleteTask={handleDeleteTask} 
              />
            )}
            {activeScreen === 'gallery' && (
              <GalleryScreen 
                items={galleryItems} 
                onAddItem={handleAddGalleryItem} 
                onLikeItem={handleLikeGalleryItem} 
              />
            )}
            {activeScreen === 'settings' && (
              <SettingsScreen 
                profile={profile} 
                onUpdateProfile={setProfile} 
                onResetData={handleResetData} 
                onExportData={handleExportData} 
              />
            )}
          </motion.div>
        </AnimatePresence>
      </main>
    </div>
  );
}
