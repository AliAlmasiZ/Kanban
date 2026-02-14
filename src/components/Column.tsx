import type { ColumnType } from '@/types/kanban';
import { useDroppable } from '@dnd-kit/core';
import {
  SortableContext,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable';
import { Trash2, Plus } from 'lucide-react';
import { useMemo, type ReactNode, useState } from 'react';

interface ColumnProps {
  column: ColumnType;
  children: ReactNode;
  onDeleteColumn: () => void;
  onAddTask: () => void;
  onUpdateTitle: (newTitle: string) => void;
}

export default function Column({
  column: { id, title, tasks },
  children,
  onAddTask,
  onDeleteColumn,
  onUpdateTitle,
}: ColumnProps) {
  const { setNodeRef, isOver } = useDroppable({
    id: id,
    data: { type: 'Column', columnId: id },
  });
  const [isEditing, setIsEditing] = useState(false);
  const [editTitle, setEditTitle] = useState(title);
  const taskIds = useMemo(() => tasks.map((task) => task.id), [tasks]);

  const handleTitleSubmit = () => {
    setIsEditing(false);
    if (editTitle.trim() && editTitle !== title) {
      onUpdateTitle(editTitle);
    } else {
      setEditTitle(title);
    }
  };

  return (
    <div
      ref={setNodeRef}
      className={`relative flex flex-col min-w-100 h-[80vh] m-5 p-6
      bg-white/10 shadow-lg rounded-2xl border border-white/10
        transition-all duration-300 backdrop-blur-lg text-white bg-linear-to-b from-white/10 to-transparent 
        items-center overflow-hidden shrink-0
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

        <div className="flex-1 mx-2 text-center min-w-0">
          {isEditing ? (
            <input
              autoFocus
              value={editTitle}
              onChange={(e) => setEditTitle(e.target.value)}
              onBlur={handleTitleSubmit}
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  handleTitleSubmit();
                } else if (e.key === 'Escape') {
                  setIsEditing(false);
                  setEditTitle(title);
                }
              }}
              maxLength={25}
              className="w-full bg-black/20 text-white text-center rounded px-2 py-1 outline-none border border-blue-500/50 truncate"
            />
          ) : (
            <h1
              onClick={() => setIsEditing(true)}
              title="Click To Edit"
              className="absolute text-center left-1/2 -translate-x-1/2 font-bold bg-gray-400/20 hover:bg-gray-400/50 py-2 px-4 rounded-full text-nowrap"
            >
              {title}
              <span className="ml-2 text-sm font-normal text-white/50 bg-white/10 px-2 py-0.5 rounded-full">
                {tasks.length}
              </span>
            </h1>
          )}
        </div>

        <button
          onClick={onAddTask}
          className="ml-auto text-white hover:text-green-500 transition-colors p-1 cursor-pointer"
          title="Add Column"
        >
          <Plus />
        </button>
      </header>
      <main className="flex-1 w-full p-3 overflow-y-auto no-scrollbar">
        <SortableContext items={taskIds} strategy={verticalListSortingStrategy}>
          {children}
        </SortableContext>
      </main>
    </div>
  );
}
