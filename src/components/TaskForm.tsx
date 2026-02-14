import { useState } from 'react';
import type { Priority, TaskItem } from '@/types/kanban';
import { Plus, X } from 'lucide-react';

interface TaskFormProps {
  initialData?: Partial<TaskItem>;
  onSubmit: (data: {
    title: string;
    description: string;
    priority: Priority;
    labels: string[];
  }) => void;
  onCancel: () => void;
}

export default function TaskForm({
  initialData,
  onSubmit,
  onCancel,
}: TaskFormProps) {
  const [title, setTitle] = useState(initialData?.title || '');
  const [description, setDescription] = useState(
    initialData?.description || ''
  );
  const [priority, setPriority] = useState<Priority>(
    initialData?.priority || 'Low'
  );
  const [tags, setTags] = useState<string[]>(initialData?.labels || []);
  const [tagInput, setTagInput] = useState('');

  const handleAddTag = () => {
    if (tagInput.trim() && !tags.includes(tagInput.trim())) {
      setTags([...tags, tagInput.trim()]);
      setTagInput('');
    }
  };

  const removeTag = (tagToRemove: string) => {
    setTags(tags.filter((tag) => tag !== tagToRemove));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;

    onSubmit({
      title,
      description,
      priority,
      labels: tags,
    });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
          Title
        </label>
        <input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Task title"
          className="w-full px-3 py-2 border border-gray-300 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all bg-white dark:bg-slate-800 dark:text-white"
          autoFocus
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
          Description
        </label>
        <textarea
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="Task description"
          rows={3}
          className="w-full px-3 py-2 border border-gray-300 dark:border-slate-600 rounded-lg outline-none bg-white dark:bg-slate-800 dark:text-white"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
          Priority
        </label>
        <select
          value={priority}
          onChange={(e) => setPriority(e.target.value as Priority)}
          className="w-full px-3 py-2 border border-gray-300 dark:border-slate-600 rounded-lg outline-none bg-white dark:bg-slate-800 dark:text-white"
        >
          <option value="Low">Low</option>
          <option value="Medium">Medium</option>
          <option value="High">High</option>
        </select>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
          Labels
        </label>
        <div className="flex gap-2 mb-2">
          <input
            type="text"
            value={tagInput}
            onChange={(e) => setTagInput(e.target.value)}
            onKeyDown={(e) =>
              e.key === 'Enter' && (e.preventDefault(), handleAddTag())
            }
            placeholder="Type and press Enter"
            className="flex-1 px-3 py-2 border border-gray-300 dark:border-slate-600 rounded-lg text-sm outline-none bg-white dark:bg-slate-800 dark:text-white"
          />
          <button
            type="button"
            onClick={handleAddTag}
            className="px-3 py-2 bg-gray-100 dark:bg-slate-700 text-gray-600 dark:text-gray-300 rounded-lg hover:bg-gray-200 dark:hover:bg-slate-600 cursor-pointer"
          >
            <Plus size={18} />
          </button>
        </div>

        <div className="flex flex-wrap gap-2">
          {tags.map((tag) => (
            <span
              key={tag}
              className="flex items-center gap-1 px-2 py-1 bg-blue-50 dark:bg-slate-700 text-blue-600 dark:text-blue-300 text-xs rounded-full font-medium"
            >
              {tag}
              <button
                type="button"
                onClick={() => removeTag(tag)}
                className="hover:text-red-500 cursor-pointer"
              >
                <X size={12} />
              </button>
            </span>
          ))}
        </div>
      </div>

      <div className="flex gap-3 justify-end pt-2">
        <button
          type="button"
          onClick={onCancel}
          className="px-4 py-2 text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-slate-700 rounded-lg transition-colors cursor-pointer"
        >
          Cancel
        </button>
        <button
          type="submit"
          disabled={!title.trim()}
          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors cursor-pointer"
        >
          Submit
        </button>
      </div>
    </form>
  );
}
