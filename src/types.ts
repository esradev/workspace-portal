export type ScreenType = 'dashboard' | 'tasks' | 'gallery' | 'settings';

export interface MetricCard {
  id: string;
  title: string;
  value: string;
  change: string;
  isPositive: boolean;
  timeframe: string;
}

export interface ActivityItem {
  id: string;
  user: {
    name: string;
    avatar: string;
    initials: string;
  };
  action: string;
  target: string;
  time: string;
  category: 'task' | 'gallery' | 'system' | 'settings';
}

export interface Task {
  id: string;
  title: string;
  description: string;
  status: 'todo' | 'in-progress' | 'review' | 'done';
  priority: 'low' | 'medium' | 'high';
  dueDate: string;
  assignee: {
    name: string;
    avatar: string;
    initials: string;
  };
  tags: string[];
}

export interface GalleryItem {
  id: string;
  title: string;
  description: string;
  category: 'architecture' | 'tech' | 'nature';
  imageUrl: string;
  photographer: string;
  likes: number;
  tags: string[];
}

export interface UserProfile {
  name: string;
  role: string;
  email: string;
  bio: string;
  avatar: string;
  notifications: {
    email: boolean;
    push: boolean;
    marketing: boolean;
  };
  theme: string;
}
