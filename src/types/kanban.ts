export interface TaskItem {
    id: string;
    title: string;
    description: string;
    
}

export interface ColumnType {
  id: string;
  title: string;
  tasks: TaskItem[];
}