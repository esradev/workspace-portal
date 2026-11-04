import React, { useState } from 'react';
import { 
  LayoutDashboard, 
  CheckSquare, 
  Image as ImageIcon, 
  Settings, 
  Menu, 
  X,
  Sparkles
} from 'lucide-react';
import { ScreenType, UserProfile } from '../types';

interface SidebarProps {
  activeScreen: ScreenType;
  setActiveScreen: (screen: ScreenType) => void;
  profile: UserProfile;
}

export default function Sidebar({ activeScreen, setActiveScreen, profile }: SidebarProps) {
  const [isOpen, setIsOpen] = useState(false);

  const menuItems = [
    { id: 'dashboard' as ScreenType, label: 'Dashboard', icon: LayoutDashboard },
    { id: 'tasks' as ScreenType, label: 'Task Workspace', icon: CheckSquare },
    { id: 'gallery' as ScreenType, label: 'Media Gallery', icon: ImageIcon },
    { id: 'settings' as ScreenType, label: 'Settings', icon: Settings },
  ];

  const handleScreenChange = (screenId: ScreenType) => {
    setActiveScreen(screenId);
    setIsOpen(false);
  };

  return (
    <>
      {/* Mobile Top Header */}
      <header className="lg:hidden h-16 border-b border-neutral-200/80 bg-white/95 backdrop-blur-md px-4 flex items-center justify-between sticky top-0 z-40">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-neutral-900 flex items-center justify-center text-white font-semibold">
            <Sparkles className="w-4.5 h-4.5 text-blue-400" />
          </div>
          <span className="font-display font-bold tracking-tight text-lg text-neutral-900">Sphere Hub</span>
        </div>
        <button 
          id="mobile-menu-toggle"
          onClick={() => setIsOpen(!isOpen)}
          className="p-1.5 hover:bg-neutral-100 rounded-lg text-neutral-600 transition-colors focus:outline-none"
        >
          {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </header>

      {/* Backdrop for Mobile Drawer */}
      {isOpen && (
        <div 
          className="lg:hidden fixed inset-0 bg-neutral-900/30 backdrop-blur-xs z-40 transition-opacity"
          onClick={() => setIsOpen(false)}
        />
      )}

      {/* Sidebar Container */}
      <aside className={`
        fixed inset-y-0 left-0 z-50 w-64 border-r border-neutral-200/80 bg-white px-5 py-6 flex flex-col justify-between
        transform transition-transform duration-300 ease-in-out lg:translate-x-0 lg:static lg:h-screen
        ${isOpen ? 'translate-x-0' : '-translate-x-full'}
      `}>
        <div className="flex flex-col gap-8">
          {/* Header branding */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-neutral-950 flex items-center justify-center text-white shadow-md shadow-neutral-950/10">
                <Sparkles className="w-5 h-5 text-blue-400" />
              </div>
              <div className="flex flex-col">
                <span className="font-display font-bold tracking-tight text-md text-neutral-900 leading-none">Sphere Workspace</span>
                <span className="font-mono text-[10px] text-neutral-400 font-medium mt-1">v1.4.0-STABLE</span>
              </div>
            </div>
            <button 
              id="close-sidebar-button"
              onClick={() => setIsOpen(false)} 
              className="lg:hidden p-1 hover:bg-neutral-100 rounded-lg text-neutral-500"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Navigation Links */}
          <nav className="flex flex-col gap-1.5" id="sidebar-nav">
            {menuItems.map((item) => {
              const IconComponent = item.icon;
              const isActive = activeScreen === item.id;
              return (
                <button
                  id={`nav-item-${item.id}`}
                  key={item.id}
                  onClick={() => handleScreenChange(item.id)}
                  className={`
                    w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 group
                    ${isActive 
                      ? 'bg-neutral-900 text-white shadow-sm shadow-neutral-900/10' 
                      : 'text-neutral-600 hover:bg-neutral-50 hover:text-neutral-900'}
                  `}
                >
                  <IconComponent className={`
                    w-4.5 h-4.5 transition-transform duration-200 group-hover:scale-105
                    ${isActive ? 'text-white' : 'text-neutral-400 group-hover:text-neutral-600'}
                  `} />
                  <span>{item.label}</span>
                </button>
              );
            })}
          </nav>
        </div>

        {/* Profile Card at bottom */}
        <div className="border-t border-neutral-100 pt-5 mt-auto">
          <div className="flex items-center gap-3 px-1.5">
            <img 
              src={profile.avatar} 
              alt={profile.name}
              referrerPolicy="no-referrer"
              className="w-10 h-10 rounded-xl object-cover border border-neutral-200 shadow-xs" 
            />
            <div className="flex flex-col min-w-0">
              <span className="text-sm font-semibold text-neutral-900 truncate leading-none">{profile.name}</span>
              <span className="text-[11px] text-neutral-400 truncate mt-1 leading-none">{profile.role}</span>
            </div>
          </div>
        </div>
      </aside>
    </>
  );
}
