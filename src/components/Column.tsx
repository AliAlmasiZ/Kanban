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
      className={`relative flex flex-col h-[80vh] m-5 p-6
        w-10/12 md:min-w-100 md:max-w-110 
      shadow-lg rounded-2xl border bg-gray-100/80 border-gray-200 text-gray-800
       dark:bg-white/10 dark:border-white/10 dark:text-white dark:bg-linear-to-b dark:from-white/10 dark:to-transparent 
       transition-all duration-300 backdrop-blur-lg items-center overflow-hidden shrink-0
        ${isOver ? 'bg-green-50/50 border-green-400/50 scale-[1.02] dark:bg-white/20' :
         'hover:bg-gray-200/50 hover:border-gray-300 dark:hover:bg-white/5 dark:hover:border-white/20'}`}
      // className={`relative flex flex-col min-w-100 h-[80vh] m-5 p-6
      // bg-white/10 shadow-lg rounded-2xl border border-white/10
      //   transition-all duration-300 backdrop-blur-lg text-white bg-linear-to-b from-white/10 to-transparent
      //   items-center overflow-hidden shrink-0
      //   ${isOver ? 'bg-white/20 border-green-400/50 scale-[1.02]' : 'hover:bg-white/5 hover:border-white/20'}
      //   `}
    >
      <header className="relative flex flex-row w-11/12 p-2 transparent">
        <button
          onClick={onDeleteColumn}
          className="text-gray-500 hover:text-red-500 dark:text-white dark:hover:text-red-500 transition-colors p-1 cursor-pointer"
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
              className="w-full bg-white dark:bg-black/20 text-gray-900 dark:text-white text-center rounded px-2 py-1 outline-none border border-blue-500/50 truncate"
            />
          ) : (
            <h1
              onClick={() => setIsEditing(true)}
              title="Click To Edit"
              className="absolute text-center left-1/2 -translate-x-1/2 font-bold bg-gray-200/50 hover:bg-gray-200 dark:bg-gray-400/20 dark:hover:bg-gray-400/50 py-2 px-4 rounded-full text-nowrap transition-colors"
            >
              {title}
              <span className="ml-2 text-sm font-normal text-gray-600 dark:text-white/50 bg-white/50 dark:bg-white/10 px-2 py-0.5 rounded-full">
                {' '}
                {tasks.length}
              </span>
            </h1>
          )}
        </div>

        <button
          onClick={onAddTask}
          className="ml-auto text-gray-500 hover:text-green-500 dark:text-white dark:hover:text-green-500 transition-colors p-1 cursor-pointer"
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
