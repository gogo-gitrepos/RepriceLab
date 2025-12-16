'use client';

import { cn } from '@/lib/utils';
import TaskCard, { Task } from './TaskCard';

interface KanbanColumnProps {
  title: string;
  status: Task['status'];
  tasks: Task[];
  color: string;
  onStatusChange?: (taskId: string, newStatus: Task['status']) => void;
  onEditTask?: (task: Task) => void;
  onDragStart?: (e: React.DragEvent, task: Task) => void;
  onDragOver?: (e: React.DragEvent) => void;
  onDrop?: (e: React.DragEvent, status: Task['status']) => void;
}

const columnColors: Record<string, { bg: string; border: string; header: string }> = {
  pending: {
    bg: 'bg-[#0f1a2a]',
    border: 'border-blue-900/50',
    header: 'text-blue-400',
  },
  active: {
    bg: 'bg-[#0f1a2a]',
    border: 'border-blue-900/50',
    header: 'text-blue-400',
  },
  in_review: {
    bg: 'bg-[#1a1525]',
    border: 'border-purple-900/50',
    header: 'text-purple-400',
  },
  revision: {
    bg: 'bg-[#1a1520]',
    border: 'border-pink-900/50',
    header: 'text-pink-400',
  },
  completed: {
    bg: 'bg-[#0f1a1a]',
    border: 'border-teal-900/50',
    header: 'text-teal-400',
  },
};

export default function KanbanColumn({
  title,
  status,
  tasks,
  color,
  onStatusChange,
  onEditTask,
  onDragStart,
  onDragOver,
  onDrop,
}: KanbanColumnProps) {
  const colors = columnColors[status] || columnColors.pending;
  const taskCount = tasks.length;

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    onDragOver?.(e);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    onDrop?.(e, status);
  };

  return (
    <div
      className={cn(
        'flex-shrink-0 w-72 rounded-xl',
        colors.bg,
        'border',
        colors.border
      )}
      onDragOver={handleDragOver}
      onDrop={handleDrop}
    >
      <div className="p-4 border-b border-gray-800/50">
        <div className="flex items-center justify-between">
          <h2 className={cn('font-semibold', colors.header)}>{title}</h2>
          <span
            className={cn(
              'w-6 h-6 rounded-full flex items-center justify-center text-xs font-medium',
              'bg-gray-800 text-gray-300'
            )}
          >
            {taskCount}
          </span>
        </div>
      </div>

      <div className="p-3 space-y-3 max-h-[calc(100vh-200px)] overflow-y-auto custom-scrollbar">
        {tasks.map((task) => (
          <TaskCard
            key={task.id}
            task={task}
            onStatusChange={onStatusChange}
            onEdit={onEditTask}
            onDragStart={onDragStart}
          />
        ))}
        
        {tasks.length === 0 && (
          <div className="text-center py-8 text-gray-500 text-sm">
            No tasks
          </div>
        )}
      </div>
    </div>
  );
}
