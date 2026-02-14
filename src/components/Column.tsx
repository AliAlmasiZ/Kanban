import type { ColumnType } from '@/types/kanban';
import { useDroppable } from '@dnd-kit/core';
import {
  SortableContext,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable';
import { Trash2, Plus } from 'lucide-react';
import { useMemo, type ReactNode } from 'react';

interface ColumnProps {
  column: ColumnType;
  children: ReactNode;
  onDeleteColumn: () => void;
  onAddTask: () => void;
}

export default function Column({
  column: { id, title, tasks},
  children,
  onAddTask,
  onDeleteColumn,
}: ColumnProps) {
  const { setNodeRef, isOver } = useDroppable({
    id: id,
    data: { type: 'Column', columnId: id },
  });
  const taskIds = useMemo(() => tasks.map((task) => task.id), [tasks]);

  return (
    <div
      ref={setNodeRef}
      className={`relative flex flex-col min-w-75 h-[80vh] m-5 p-6
      bg-white/10 shadow-lg rounded-2xl border border-white/10
        transition-all duration-300 backdrop-blur-lg text-white bg-linear-to-b from-white/10 to-transparent 
        items-center overflow-hidden
        ${isOver ? 'bg-white/20 border-green-400/50 scale-[1.02]' : 'hover:bg-white/5 hover:border-white/20'}
        `}
    >
      <header className="relative flex flex-row w-11/12 p-2 transparent">
        <button
          onClick={onDeleteColumn}
          className="text-white hover:text-red-500 transition-colors p-1 cursor-pointer"
          title="Delete Column"
        >
          <Trash2 />
        </button>
        <h1 className="absolute text-center left-1/2 -translate-x-1/2 font-bold bg-gray-400/20 hover:bg-gray-400/50 py-2 px-4 rounded-full">
          {title}
        </h1>
        <button
          onClick={onAddTask}
          className="ml-auto text-white hover:text-green-500 transition-colors p-1 cursor-pointer"
          title="Add Column"
        >
          <Plus />
        </button>
      </header>
      <main className="flex-1 w-full p-3 overflow-y-auto no-scrollbar">
        <SortableContext
          items={taskIds}
          strategy={verticalListSortingStrategy}
        >
          {children}
        </SortableContext>
      </main>
    </div>
  );
}
