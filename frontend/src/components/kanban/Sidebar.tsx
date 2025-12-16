'use client';

import { 
  LayoutDashboard, 
  FileText, 
  Users, 
  UserCog, 
  BarChart3, 
  Activity, 
  Briefcase, 
  Settings 
} from 'lucide-react';
import { cn } from '@/lib/utils';

interface SidebarProps {
  activeItem?: string;
  onItemClick?: (item: string) => void;
}

const menuItems = [
  { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { id: 'requests', label: 'All Requests', icon: FileText },
  { id: 'clients', label: 'Clients', icon: Users },
  { id: 'users', label: 'User Management', icon: UserCog },
  { id: 'analytics', label: 'Analytics', icon: BarChart3 },
  { id: 'activity', label: 'Activity Log', icon: Activity },
  { id: 'workload', label: 'Workload', icon: Briefcase },
  { id: 'settings', label: 'Settings', icon: Settings },
];

export default function Sidebar({ activeItem = 'dashboard', onItemClick }: SidebarProps) {
  return (
    <aside className="fixed left-0 top-0 h-screen w-64 bg-[#0f1419] border-r border-gray-800 flex flex-col">
      <div className="p-4 border-b border-gray-800">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
            <span className="text-white font-bold text-lg">B</span>
          </div>
          <div>
            <h1 className="text-white font-semibold">Brand & Code</h1>
            <p className="text-gray-400 text-xs">Client Portal</p>
          </div>
        </div>
      </div>

      <div className="p-4">
        <span className="text-gray-500 text-xs font-medium uppercase tracking-wider">Agency</span>
      </div>

      <nav className="flex-1 px-3">
        {menuItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeItem === item.id;
          return (
            <button
              key={item.id}
              onClick={() => onItemClick?.(item.id)}
              className={cn(
                'w-full flex items-center gap-3 px-3 py-2.5 rounded-lg mb-1 transition-all duration-200',
                isActive
                  ? 'bg-blue-600 text-white'
                  : 'text-gray-400 hover:bg-gray-800 hover:text-white'
              )}
            >
              <Icon className="w-5 h-5" />
              <span className="text-sm font-medium">{item.label}</span>
            </button>
          );
        })}
      </nav>

      <div className="p-4 border-t border-gray-800">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-gradient-to-br from-orange-500 to-red-500 rounded-full flex items-center justify-center">
            <span className="text-white font-bold">AA</span>
          </div>
          <div>
            <p className="text-white text-sm font-medium">Agency Admin</p>
            <p className="text-gray-400 text-xs">Agency HQ</p>
          </div>
        </div>
      </div>
    </aside>
  );
}
