'use client';

import { useState } from 'react';
import Sidebar from '@/components/kanban/Sidebar';
import KanbanBoard from '@/components/kanban/KanbanBoard';
import { Task } from '@/components/kanban/TaskCard';

const mockTasks: Task[] = [
  {
    id: '1',
    title: 'Mobile App UI Kit',
    category: 'Web-Design',
    assignee: 'Jordan',
    dueDate: '2025-12-10',
    status: 'pending',
  },
  {
    id: '2',
    title: 'Landing Page Redesign',
    category: 'Web-Design',
    assignee: 'Alex',
    dueDate: '2025-12-20',
    status: 'pending',
  },
  {
    id: '3',
    title: 'Social Media Graphics Pack',
    category: 'Branding',
    assignee: 'Morgan',
    dueDate: '2025-12-08',
    status: 'active',
  },
  {
    id: '4',
    title: 'API Integration Platform',
    category: 'Development',
    assignee: 'Morgan',
    dueDate: '2025-12-05',
    status: 'active',
  },
  {
    id: '5',
    title: 'Complete Brand Identity',
    category: 'Branding',
    assignee: 'Morgan',
    dueDate: '2025-12-18',
    status: 'active',
  },
  {
    id: '6',
    title: 'E-commerce Website...',
    category: 'Web-Design',
    assignee: 'Morgan',
    dueDate: '2025-12-03',
    status: 'active',
  },
  {
    id: '7',
    title: 'Strategic Growth...',
    category: 'Other',
    assignee: 'Morgan',
    dueDate: '2025-12-15',
    status: 'in_review',
  },
  {
    id: '8',
    title: 'React Dashboard...',
    category: 'Development',
    assignee: 'Jordan',
    dueDate: '2025-12-02',
    status: 'in_review',
  },
  {
    id: '9',
    title: 'Marketing Automation...',
    category: 'Development',
    assignee: 'Morgan',
    dueDate: '2025-12-01',
    status: 'revision',
  },
  {
    id: '10',
    title: 'Customer Portal Design',
    category: 'Web-Design',
    assignee: 'Morgan',
    dueDate: '2025-12-25',
    status: 'completed',
  },
  {
    id: '11',
    title: 'API Documentation...',
    category: 'Development',
    assignee: 'Jordan',
    dueDate: '2025-12-22',
    status: 'completed',
  },
];

export default function AdminKanbanPage() {
  const [activeMenuItem, setActiveMenuItem] = useState('dashboard');
  const [tasks, setTasks] = useState<Task[]>(mockTasks);

  const handleTaskUpdate = (updatedTasks: Task[]) => {
    setTasks(updatedTasks);
  };

  return (
    <div className="min-h-screen bg-[#0a0e14] flex">
      <Sidebar activeItem={activeMenuItem} onItemClick={setActiveMenuItem} />
      
      <main className="ml-64 flex-1">
        <div className="border-b border-gray-800 p-4">
          <div className="flex items-center justify-center">
            <div className="w-10 h-10 bg-gray-800 rounded-full flex items-center justify-center">
              <span className="text-gray-400">?</span>
            </div>
          </div>
        </div>
        
        <KanbanBoard initialTasks={tasks} onTaskUpdate={handleTaskUpdate} />
      </main>
    </div>
  );
}
