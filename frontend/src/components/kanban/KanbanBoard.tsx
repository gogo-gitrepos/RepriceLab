'use client';

import { useState } from 'react';
import KanbanColumn from './KanbanColumn';
import { Task } from './TaskCard';

interface KanbanBoardProps {
  initialTasks: Task[];
  onTaskUpdate?: (tasks: Task[]) => void;
}

const columns: { title: string; status: Task['status']; color: string }[] = [
  { title: 'Pending', status: 'pending', color: 'blue' },
  { title: 'Active', status: 'active', color: 'blue' },
  { title: 'In Review', status: 'in_review', color: 'purple' },
  { title: 'Revision', status: 'revision', color: 'pink' },
  { title: 'Completed', status: 'completed', color: 'teal' },
];

export default function KanbanBoard({ initialTasks, onTaskUpdate }: KanbanBoardProps) {
  const [tasks, setTasks] = useState<Task[]>(initialTasks);
  const [draggedTask, setDraggedTask] = useState<Task | null>(null);

  const handleStatusChange = (taskId: string, newStatus: Task['status']) => {
    const updatedTasks = tasks.map((task) =>
      task.id === taskId ? { ...task, status: newStatus } : task
    );
    setTasks(updatedTasks);
    onTaskUpdate?.(updatedTasks);
  };

  const handleEditTask = (updatedTask: Task) => {
    const updatedTasks = tasks.map((task) =>
      task.id === updatedTask.id ? updatedTask : task
    );
    setTasks(updatedTasks);
    onTaskUpdate?.(updatedTasks);
  };

  const handleDragStart = (e: React.DragEvent, task: Task) => {
    setDraggedTask(task);
    e.dataTransfer.setData('text/plain', task.id);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  const handleDrop = (e: React.DragEvent, status: Task['status']) => {
    e.preventDefault();
    if (draggedTask) {
      handleStatusChange(draggedTask.id, status);
      setDraggedTask(null);
    }
  };

  const getTasksByStatus = (status: Task['status']) => {
    return tasks.filter((task) => task.status === status);
  };

  const totalTasks = tasks.length;

  return (
    <div className="flex-1 p-6">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-white">Kanban Board</h1>
        <span className="text-gray-400 text-sm">{totalTasks} requests total</span>
      </div>

      <div className="flex gap-4 overflow-x-auto pb-4">
        {columns.map((column) => (
          <KanbanColumn
            key={column.status}
            title={column.title}
            status={column.status}
            tasks={getTasksByStatus(column.status)}
            color={column.color}
            onStatusChange={handleStatusChange}
            onEditTask={handleEditTask}
            onDragStart={handleDragStart}
            onDragOver={handleDragOver}
            onDrop={handleDrop}
          />
        ))}
      </div>
    </div>
  );
}
