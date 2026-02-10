import type { ColumnType, TaskItem } from '@/types/kanban';
import { useState } from 'react';
import BackgroundCanvas from '@/components/BackgroundCanvas';
import Column from '../components/Column';
import TaskCard from '@/components/TaskCard';

// I HATE STYLING

const initialColumns: ColumnType[] = [
  {
    id: 'col-1',
    title: 'TODO',
    tasks: [
      { id: 'task-1', title: 'Task One', description: 'This is task one' },
      { id: 'task-2', title: 'Task Two', description: 'This is task two' },
      { id: 'task-2', title: 'Task Two', description: 'This is task two' },
      { id: 'task-2', title: 'Task Two', description: 'This is task two' },
      { id: 'task-2', title: 'Task Two', description: 'This is task two' },
      { id: 'task-2', title: 'Task Two', description: 'This is task two' },
      { id: 'task-2', title: 'Task Two', description: 'This is task two' },
      { id: 'task-2', title: 'Task Two', description: 'This is task two' },
      { id: 'task-2', title: 'Task Two', description: 'This is task two' },
      { id: 'task-2', title: 'Task Two', description: 'This is task two' },
      { id: 'task-2', title: 'Task Two', description: 'This is task two' },
    ],
  },
  {
    id: 'col-2',
    title: 'DONE',
    tasks: [
      { id: 'task-3', title: 'Task Three', description: 'This is task three' },
    ],
  },
  {
    id: 'col-3',
    title: 'IN PROGRESS',
    tasks: [],
  },
];

export default function Home() {
  const [columns, setColumns] = useState<ColumnType[]>(initialColumns);

  function handleAddTask(columnId: string, task: TaskItem) {
    // TODO: Open a modal to get task details and then add the task to the column
  }

  function deleteColumn(columnId: string) {
    setColumns((prevColumns) =>
      prevColumns.filter((col) => col.id !== columnId)
    );
  }

  function deleteTask(colomnId: string, taskId: string) {

  }
  return (
    <>
      <BackgroundCanvas />
      <div className="container mx-auto p-10 pb-16  gap-5 h-screen grid grid-cols-1 lg:grid-cols-3 items-stretch">
        {columns.map((column) => (
          <Column
            key={column.id}
            title={column.title}
            count={column.tasks.length}
            onAddTask={() => {}}
            onDeleteColumn={() => {
              deleteColumn(column.id);
            }}
          >
            {column.tasks.map((task: TaskItem) => (
              <TaskCard key={task.id} task={task} onDelete={() => {deleteTask(column.id, task.id)}}/>
            ))}
          </Column>
        ))}
      </div>
    </>
  );
}
