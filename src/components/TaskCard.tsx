import type { TaskItem } from '@/types/kanban';

interface TaskCardProps {
  task: TaskItem;
}

export default function TaskCard({ task }: TaskCardProps) {
  return (
    <div className="group relative bg-white p-4 rounded-xl shadow-sm border border-gray-200 mb-3 hover:shadow-md transition-all">
        ttt
    </div>
  );
}
