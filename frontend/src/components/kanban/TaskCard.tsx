'use client';

import { useState } from 'react';
import { cn } from '@/lib/utils';

export interface Task {
  id: string;
  title: string;
  category: string;
  assignee: string;
  assigneeColor?: string;
  dueDate: string;
  status: 'pending' | 'active' | 'in_review' | 'revision' | 'completed';
  priority?: 'low' | 'medium' | 'high';
}

interface TaskCardProps {
  task: Task;
  onStatusChange?: (taskId: string, newStatus: Task['status']) => void;
  onEdit?: (task: Task) => void;
  draggable?: boolean;
  onDragStart?: (e: React.DragEvent, task: Task) => void;
}

const categoryColors: Record<string, string> = {
  'Web-Design': 'bg-blue-600',
  'Branding': 'bg-purple-600',
  'Development': 'bg-green-600',
  'Other': 'bg-gray-600',
};

const assigneeColors = [
  'bg-blue-500',
  'bg-purple-500',
  'bg-green-500',
  'bg-orange-500',
  'bg-pink-500',
  'bg-cyan-500',
];

function getAssigneeColor(name: string): string {
  const index = name.charCodeAt(0) % assigneeColors.length;
  return assigneeColors[index];
}

function isOverdue(dueDate: string): boolean {
  return new Date(dueDate) < new Date();
}

export default function TaskCard({ 
  task, 
  onStatusChange, 
  onEdit,
  draggable = true,
  onDragStart 
}: TaskCardProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [editedTask, setEditedTask] = useState(task);
  const overdue = isOverdue(task.dueDate) && task.status !== 'completed';
  
  const handleSave = () => {
    onEdit?.(editedTask);
    setIsEditing(false);
  };

  const handleDragStart = (e: React.DragEvent) => {
    e.dataTransfer.effectAllowed = 'move';
    onDragStart?.(e, task);
  };

  return (
    <div
      draggable={draggable}
      onDragStart={handleDragStart}
      className={cn(
        'bg-[#1a2332] rounded-xl p-4 cursor-grab active:cursor-grabbing',
        'hover:bg-[#1e2940] transition-all duration-200',
        'border border-transparent hover:border-gray-700',
        'shadow-lg'
      )}
    >
      {isEditing ? (
        <div className="space-y-3">
          <input
            type="text"
            value={editedTask.title}
            onChange={(e) => setEditedTask({ ...editedTask, title: e.target.value })}
            className="w-full bg-gray-800 text-white rounded px-2 py-1 text-sm"
          />
          <select
            value={editedTask.category}
            onChange={(e) => setEditedTask({ ...editedTask, category: e.target.value })}
            className="w-full bg-gray-800 text-white rounded px-2 py-1 text-sm"
          >
            <option value="Web-Design">Web-Design</option>
            <option value="Branding">Branding</option>
            <option value="Development">Development</option>
            <option value="Other">Other</option>
          </select>
          <input
            type="text"
            placeholder="Assignee name"
            value={editedTask.assignee}
            onChange={(e) => setEditedTask({ ...editedTask, assignee: e.target.value })}
            className="w-full bg-gray-800 text-white rounded px-2 py-1 text-sm"
          />
          <input
            type="date"
            value={editedTask.dueDate}
            onChange={(e) => setEditedTask({ ...editedTask, dueDate: e.target.value })}
            className="w-full bg-gray-800 text-white rounded px-2 py-1 text-sm"
          />
          <div className="flex gap-2">
            <button
              onClick={handleSave}
              className="flex-1 bg-blue-600 text-white text-xs py-1 rounded hover:bg-blue-700"
            >
              Save
            </button>
            <button
              onClick={() => setIsEditing(false)}
              className="flex-1 bg-gray-700 text-white text-xs py-1 rounded hover:bg-gray-600"
            >
              Cancel
            </button>
          </div>
        </div>
      ) : (
        <>
          <h3 
            className="text-white font-medium text-sm mb-3 cursor-pointer hover:text-blue-400"
            onClick={() => setIsEditing(true)}
          >
            {task.title}
          </h3>
          
          <div className="flex items-center justify-between">
            <span
              className={cn(
                'text-xs px-2 py-1 rounded-md text-white',
                categoryColors[task.category] || categoryColors['Other']
              )}
            >
              {task.category}
            </span>
          </div>

          <div className="flex items-center justify-between mt-3">
            <div className="flex items-center gap-2">
              <div
                className={cn(
                  'w-6 h-6 rounded-full flex items-center justify-center text-white text-xs font-medium',
                  task.assigneeColor || getAssigneeColor(task.assignee)
                )}
              >
                {task.assignee.charAt(0).toUpperCase()}
              </div>
              <span className="text-gray-400 text-xs">{task.assignee}</span>
            </div>

            {overdue && (
              <span className="bg-red-500/20 text-red-400 text-xs px-2 py-1 rounded-full flex items-center gap-1">
                <span className="w-1.5 h-1.5 bg-red-500 rounded-full"></span>
                Overdue
              </span>
            )}
          </div>

          {task.status !== 'completed' && (
            <select
              value={task.status}
              onChange={(e) => onStatusChange?.(task.id, e.target.value as Task['status'])}
              className="mt-3 w-full bg-gray-800/50 text-gray-300 text-xs rounded px-2 py-1.5 border border-gray-700"
            >
              <option value="pending">Pending</option>
              <option value="active">Active</option>
              <option value="in_review">In Review</option>
              <option value="revision">Revision</option>
              <option value="completed">Completed</option>
            </select>
          )}
        </>
      )}
    </div>
  );
}
