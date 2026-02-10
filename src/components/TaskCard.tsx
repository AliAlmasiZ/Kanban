import type { TaskItem } from '@/types/kanban';
import { X } from 'lucide-react';

interface TaskCardProps {
  task: TaskItem;
  onDelete: () => void;
}

export default function TaskCard({ task, onDelete }: TaskCardProps) {
  return (
    <div className="group relative bg-white p-4 rounded-xl shadow-sm border border-gray-200 mb-3 hover:shadow-md transition-all w-full">
      <header className="flex justify-between items-start mb-2">
        <h3 className="font-semibold text-gray-800">{task.title}</h3>
        <button
          onClick={onDelete}
          className="text-gray-400 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer"
        >
          <X size={20} />
        </button>
      </header>

      <main className="space-y-1 mb-4">
        <div className="h-1.5 w-full bg-gray-100 rounded-full"></div>
        <div className="h-1.5 w-2/3 bg-gray-100 rounded-full"></div>
      </main>

      <footer className="flex justify-between items-center text-xs text-gray-500">
        <div className="flex gap-2 items-center">
          <span className='bg-gray-100 px-2 py-0.5 rounded text-gray-600 font-medium'>Label</span>
        </div>
      </footer>
    </div>
  );
}
