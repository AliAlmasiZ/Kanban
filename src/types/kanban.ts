export type Priority = 'Low' | 'Medium' | 'High';

export interface TaskItem {
  id: string;
  title: string;
  description?: string;
  priority?: Priority;
  labels: string[];
  dueDate?: string;
  createdAt: string;
}

export interface ColumnType {
  id: string;
  title: string;
  tasks: TaskItem[];
}
