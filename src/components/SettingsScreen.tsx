import React, { useState } from 'react';
import { 
  User, 
  Mail, 
  Sliders, 
  Bell, 
  Database, 
  FileText, 
  Check, 
  RotateCcw, 
  Download,
  AlertTriangle
} from 'lucide-react';
import { motion } from 'motion/react';
import { UserProfile } from '../types';

interface SettingsScreenProps {
  profile: UserProfile;
  onUpdateProfile: (updated: UserProfile) => void;
  onResetData: () => void;
  onExportData: () => void;
}

export default function SettingsScreen({ profile, onUpdateProfile, onResetData, onExportData }: SettingsScreenProps) {
  const [name, setName] = useState(profile.name);
  const [role, setRole] = useState(profile.role);
  const [email, setEmail] = useState(profile.email);
  const [bio, setBio] = useState(profile.bio);
  const [avatar, setAvatar] = useState(profile.avatar);
  const [savedMessage, setSavedMessage] = useState(false);

  const avatars = [
    { name: 'Sarah Connor', url: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150' },
    { name: 'Marcus Wright', url: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150' },
    { name: 'John Connor', url: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150' },
    { name: 'Grace Phillips', url: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150' }
  ];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onUpdateProfile({
      ...profile,
      name,
      role,
      email,
      bio,
      avatar
    });
    setSavedMessage(true);
    setTimeout(() => setSavedMessage(false), 3000);
  };

  const handleToggleNotification = (key: keyof UserProfile['notifications']) => {
    onUpdateProfile({
      ...profile,
      notifications: {
        ...profile.notifications,
        [key]: !profile.notifications[key]
      }
    });
  };

  return (
    <div className="space-y-8 max-w-4xl" id="settings-screen">
      {/* Header */}
      <div>
        <h1 className="font-display text-2xl md:text-3xl font-bold tracking-tight text-neutral-900">
          Account & Workspace Settings
        </h1>
        <p className="text-sm text-neutral-500 mt-1">
          Customize your workspace identity, toggle system notifications, and manage raw JSON collections.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
        {/* Left Form (2/3 width) */}
        <form onSubmit={handleSubmit} className="lg:col-span-2 space-y-6">
          {/* Profile Identity Module */}
          <div className="bg-white p-6 rounded-2xl border border-neutral-200/80 shadow-xs space-y-5">
            <h3 className="text-sm font-semibold text-neutral-900 flex items-center gap-2 pb-3 border-b border-neutral-100">
              <User className="w-4 h-4 text-blue-600" />
              <span>Workspace Profile</span>
            </h3>

            {/* Avatar Selector */}
            <div className="space-y-2.5">
              <label className="block text-[11px] font-bold uppercase tracking-wider text-neutral-500">Workspace Avatar</label>
              <div className="flex flex-wrap items-center gap-3">
                <img 
                  src={avatar} 
                  alt="active avatar"
                  referrerPolicy="no-referrer"
                  className="w-16 h-16 rounded-2xl object-cover border border-neutral-200 shadow-sm" 
                />
                <div className="flex gap-2">
                  {avatars.map((av) => (
                    <button
                      id={`select-avatar-${av.name.replace(' ', '-')}`}
                      key={av.url}
                      type="button"
                      onClick={() => setAvatar(av.url)}
                      className={`relative w-10 h-10 rounded-xl overflow-hidden border-2 transition-all ${avatar === av.url ? 'border-neutral-950 scale-95 shadow-md' : 'border-transparent hover:border-neutral-300'}`}
                    >
                      <img src={av.url} alt={av.name} referrerPolicy="no-referrer" className="w-full h-full object-cover" />
                      {avatar === av.url && (
                        <div className="absolute inset-0 bg-black/10 flex items-center justify-center">
                          <Check className="w-4 h-4 text-white drop-shadow-sm" />
                        </div>
                      )}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Inputs */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-[11px] font-bold uppercase tracking-wider text-neutral-500 mb-1.5">Full Name</label>
                <input
                  id="settings-name"
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full px-3 py-2 text-xs bg-neutral-50 border border-neutral-200 rounded-lg outline-none focus:border-neutral-400 focus:bg-white transition-colors"
                />
              </div>
              <div>
                <label className="block text-[11px] font-bold uppercase tracking-wider text-neutral-500 mb-1.5">Workspace Role</label>
                <input
                  id="settings-role"
                  type="text"
                  required
                  value={role}
                  onChange={(e) => setRole(e.target.value)}
                  className="w-full px-3 py-2 text-xs bg-neutral-50 border border-neutral-200 rounded-lg outline-none focus:border-neutral-400 focus:bg-white transition-colors"
                />
              </div>
            </div>

            <div>
              <label className="block text-[11px] font-bold uppercase tracking-wider text-neutral-500 mb-1.5">Primary Contact Email</label>
              <div className="relative">
                <Mail className="absolute left-3 top-2.5 h-4.5 w-4.5 text-neutral-400" />
                <input
                  id="settings-email"
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full pl-10 pr-3 py-2 text-xs bg-neutral-50 border border-neutral-200 rounded-lg outline-none focus:border-neutral-400 focus:bg-white transition-colors"
                />
              </div>
            </div>

            <div>
              <label className="block text-[11px] font-bold uppercase tracking-wider text-neutral-500 mb-1.5">Personal Biography</label>
              <textarea
                id="settings-bio"
                rows={3}
                value={bio}
                onChange={(e) => setBio(e.target.value)}
                className="w-full px-3 py-2 text-xs bg-neutral-50 border border-neutral-200 rounded-lg outline-none focus:border-neutral-400 focus:bg-white transition-colors resize-none"
              />
            </div>
          </div>

          {/* Form Actions bar */}
          <div className="flex items-center gap-3 justify-end">
            {savedMessage && (
              <span className="text-xs text-emerald-600 font-semibold flex items-center gap-1 animate-fade-in">
                <Check className="w-4 h-4" /> Changes saved successfully!
              </span>
            )}
            <button
              id="settings-save-button"
              type="submit"
              className="px-5 py-2.5 bg-neutral-950 text-white rounded-xl hover:bg-neutral-800 text-xs font-semibold transition-colors shadow-sm"
            >
              Save Profile Settings
            </button>
          </div>
        </form>

        {/* Right Pane Sidebar Controls */}
        <div className="space-y-6">
          {/* Notifications config */}
          <div className="bg-white p-6 rounded-2xl border border-neutral-200/80 shadow-xs space-y-4">
            <h3 className="text-sm font-semibold text-neutral-900 flex items-center gap-2 pb-3 border-b border-neutral-100">
              <Bell className="w-4 h-4 text-indigo-600" />
              <span>Workspace Notifications</span>
            </h3>

            <div className="space-y-3.5">
              <div className="flex items-center justify-between py-1.5">
                <div>
                  <span className="text-xs font-semibold text-neutral-800 leading-none block">Email notifications</span>
                  <span className="text-[10px] text-neutral-400 font-medium block mt-1">Receive daily task reminders</span>
                </div>
                <button
                  id="toggle-email-notif"
                  type="button"
                  onClick={() => handleToggleNotification('email')}
                  className={`relative inline-flex h-5 w-9 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${profile.notifications.email ? 'bg-blue-600' : 'bg-neutral-200'}`}
                >
                  <span className={`pointer-events-none inline-block h-4 w-4 transform rounded-full bg-white shadow-md ring-0 transition duration-200 ease-in-out ${profile.notifications.email ? 'translate-x-4' : 'translate-x-0'}`} />
                </button>
              </div>

              <div className="flex items-center justify-between py-1.5">
                <div>
                  <span className="text-xs font-semibold text-neutral-800 leading-none block">Push Alerts</span>
                  <span className="text-[10px] text-neutral-400 font-medium block mt-1">Instant updates inside the tab</span>
                </div>
                <button
                  id="toggle-push-notif"
                  type="button"
                  onClick={() => handleToggleNotification('push')}
                  className={`relative inline-flex h-5 w-9 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${profile.notifications.push ? 'bg-blue-600' : 'bg-neutral-200'}`}
                >
                  <span className={`pointer-events-none inline-block h-4 w-4 transform rounded-full bg-white shadow-md ring-0 transition duration-200 ease-in-out ${profile.notifications.push ? 'translate-x-4' : 'translate-x-0'}`} />
                </button>
              </div>
            </div>
          </div>

          {/* System Data Maintenance */}
          <div className="bg-white p-6 rounded-2xl border border-neutral-200/80 shadow-xs space-y-4">
            <h3 className="text-sm font-semibold text-neutral-900 flex items-center gap-2 pb-3 border-b border-neutral-100">
              <Database className="w-4 h-4 text-emerald-600" />
              <span>Data & Maintenance</span>
            </h3>

            <p className="text-[11px] text-neutral-400 font-medium leading-relaxed">
              Export your board list and hotlinked image assets as a self-contained portable database file, or trigger a complete state factory reset.
            </p>

            <div className="space-y-2 pt-2">
              <button
                id="export-workspace-data"
                type="button"
                onClick={onExportData}
                className="w-full flex items-center justify-center gap-2 py-2.5 text-xs font-semibold border border-neutral-200 hover:bg-neutral-50 rounded-xl transition-all"
              >
                <Download className="w-4 h-4 text-neutral-500" />
                <span>Export Workspace JSON</span>
              </button>

              <button
                id="reset-workspace-data"
                type="button"
                onClick={() => {
                  if (confirm("Reset Workspace?\nThis will revert all tasks and gallery assets to their factory defaults.")) {
                    onResetData();
                  }
                }}
                className="w-full flex items-center justify-center gap-2 py-2.5 text-xs font-semibold border border-rose-100 bg-rose-50/50 hover:bg-rose-50 text-rose-700 rounded-xl transition-all"
              >
                <RotateCcw className="w-4 h-4 text-rose-500" />
                <span>Reset Factory Defaults</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
