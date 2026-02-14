import type { ColumnType } from '@/types/kanban';
import {
  ArrowUpDown,
  Filter,
  Moon,
  PlusCircleIcon,
  Search,
  Sun,
} from 'lucide-react';
import { useState } from 'react';
import { useTheme } from '@/hooks/useTheme';

interface ToolBarProps {
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  filterPriority: 'All' | 'Low' | 'Medium' | 'High';
  setFilterPriority: (priority: 'All' | 'Low' | 'Medium' | 'High') => void;
  sortBy: 'Manual' | 'Date' | 'Priority';
  setSortBy: (sort: 'Date' | 'Priority') => void;
  addColumn: () => void;
}

export default function ToolBar({
  searchQuery,
  setSearchQuery,
  filterPriority,
  setFilterPriority,
  sortBy,
  setSortBy,
  addColumn,
}: ToolBarProps) {
  const { theme, toggleTheme } = useTheme();

  return (
    <div className="w-10/12 mx-auto px-10 pt-10 pb-2">
      <div className="bg-white/10 backdrop-blur-md p-4 rounded-2xl border border-white/20 flex flex-col md:flex-row gap-4 items-center justify-between text-gray-800 dark:text-white transition-colors duration-300">
        {' '}
        <div className="relative w-full md:w-1/3">
          <Search
            className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 dark:text-gray-400"
            size={18}
          />
          <input
            type="text"
            placeholder="Search tasks..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2 bg-gray-100 dark:bg-black/20 border border-gray-200 dark:border-white/10 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm placeholder-gray-500 dark:placeholder-gray-400 transition-colors"
          />
        </div>
        <div className="flex gap-3 w-full md:w-auto">
          <div className="relative flex items-center bg-gray-100 dark:bg-black/20 rounded-lg px-3 border border-gray-200 dark:border-white/10 transition-colors">
            <Filter
              size={16}
              className="text-gray-500 dark:text-gray-400 mr-2"
            />
            <select
              value={filterPriority}
              onChange={(e) => setFilterPriority(e.target.value as any)}
              className="bg-transparent border-none outline-none text-sm py-2 cursor-pointer appearance-none min-w-20 text-gray-800 dark:text-white"
            >
              <option value="All" className="text-black">
                All Priorities
              </option>
              <option value="Low" className="text-black">
                Low
              </option>
              <option value="Medium" className="text-black">
                Medium
              </option>
              <option value="High" className="text-black">
                High
              </option>
            </select>
          </div>

          <div className="relative flex items-center bg-gray-100 dark:bg-black/20 rounded-lg px-3 border border-gray-200 dark:border-white/10 transition-colors">
            <ArrowUpDown
              size={16}
              className="text-gray-500 dark:text-gray-400 mr-2"
            />
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as any)}
              className="bg-transparent border-none outline-none text-sm py-2 cursor-pointer appearance-none min-w-20 text-gray-800 dark:text-white"
            >
              <option value="Manual" className="text-black">
                Sort Manually
              </option>
              <option value="Date" className="text-black">
                Sort by Date
              </option>
              <option value="Priority" className="text-black">
                Sort by Priority
              </option>
            </select>
          </div>
          <div className="relative flex items-center rounded-lg px-3">
            <button
              onClick={addColumn}
              className="mr-3 flex items-center gap-2 bg-indigo-500/80 hover:bg-indigo-500 text-white px-4 py-2 rounded-xl text-sm font-medium transition-all shadow-lg shadow-indigo-500/20 active:scale-95 h-10 cursor-pointer"
            >
              <PlusCircleIcon scale={18} /> Add Column
            </button>

            <button
              onClick={toggleTheme}
              className="flex items-center justify-center bg-gray-200 dark:bg-black/40 text-gray-800 dark:text-yellow-400 p-2 rounded-xl hover:bg-gray-300 dark:hover:bg-black/60 transition-all cursor-pointer h-10 w-10"
              title="Toggle Theme"
            >
              {theme === 'dark' ?  <Moon size={20} /> : <Sun size={20} />}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
