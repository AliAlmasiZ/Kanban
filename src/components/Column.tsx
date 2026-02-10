import { Trash2, Plus } from 'lucide-react';
import type { ReactNode } from 'react';

interface ColumnProps {
  title: string;
  count: number;
  children: ReactNode;
  onDeleteColumn: () => void;
  onAddTask: () => void;
}

export default function Column({
  title,
  count,
  children,
  onAddTask,
  onDeleteColumn,
}: ColumnProps) {
  return (
    <div className="relative flex flex-col min-w-75 h-[80vh] m-5 p-6 bg-white/10 shadow-lg rounded-2xl border border-white/10  transition-all duration-300 backdrop-blur-lg text-white bg-linear-to-b from-white/10 to-transparent items-center overflow-hidden">
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
      <main className='flex-1 w-full p-3 overflow-y-auto no-scrollbar'>
        {children}

      </main>
    </div>
  );
}
