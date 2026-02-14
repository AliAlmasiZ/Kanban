import type { TaskItem } from '@/types/kanban';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { X } from 'lucide-react';

interface TaskCardProps {
  task: TaskItem;
  onDelete: () => void;
}

export default function TaskCard({ task, onDelete }: TaskCardProps) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: task.id, data: { type: 'Task', task } });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  if (isDragging) {
    return (
      <div
        ref={setNodeRef}
        style={style}
        className="opacity-30 bg-gray-50 p-4 rounded-xl border-2 border-dashed border-gray-300 mb-3 w-full h-25"
      />
    );
  }

  return (
    <div ref={setNodeRef} style={style} {...attributes} {...listeners} className='touch-none mb-3 w-full'>
      <TaskCardContent task={task} onDelete={onDelete} />
    </div>
  );
}

export function TaskCardContent({ task, onDelete }: TaskCardProps) {
  return (
    <div className="group relative bg-white p-4 rounded-xl shadow-sm border border-gray-200 hover:shadow-md transition-all w-full">
      <header className="flex justify-between items-start mb-2">
        <h3 className="font-semibold text-gray-800">{task.title}</h3>
        <button
          onPointerDown={(e) => e.stopPropagation()}
          onClick={onDelete}
          className="text-gray-400 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer"
        >
          <X size={20} />
        </button>
      </header>

      <main className="space-y-1 mb-4">
        <p className="text-sm text-gray-600 whitespace-pre-wrap">
          {task.description}
        </p>
      </main>

      <footer className="flex justify-between items-center text-xs text-gray-500">
        <div className="flex gap-2 items-center">
          <span className="bg-gray-100 px-2 py-0.5 rounded text-gray-600 font-medium">
            Label
          </span>
        </div>
      </footer>
    </div>
  );
}
