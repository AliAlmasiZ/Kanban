import type { ColumnType, TaskItem } from '@/types/kanban';
import { act, useState } from 'react';
import BackgroundCanvas from '@/components/BackgroundCanvas';
import Column from '../components/Column';
import TaskCard, { TaskCardContent } from '@/components/TaskCard';
import {
  closestCenter,
  closestCorners,
  DndContext,
  DragOverlay,
  PointerSensor,
  useSensor,
  useSensors,
  type DragEndEvent,
  type DragOverEvent,
  type DragStartEvent,
} from '@dnd-kit/core';
import { arrayMove } from '@dnd-kit/sortable';
import { createPortal } from 'react-dom';

// I HATE STYLING

const initialColumns: ColumnType[] = [
  {
    id: 'col-1',
    title: 'TODO',
    tasks: [
      {
        id: 'task-1',
        title: 'Task One',
        description: 'This is task one\nsdkfsfdskfk',
      },
      { id: 'task-3', title: 'Task Three', description: 'This is task three' },
      { id: 'task-4', title: 'Task Four', description: 'This is task four' },
      { id: 'task-5', title: 'Task Five', description: 'This is task five' },
      { id: 'task-6', title: 'Task Six', description: 'This is task six' },
      { id: 'task-7', title: 'Task Seven', description: 'This is task seven' },
      { id: 'task-8', title: 'Task Eight', description: 'This is task eight' },
      { id: 'task-9', title: 'Task Nine', description: 'This is task nine' },
      { id: 'task-10', title: 'Task Ten', description: 'This is task ten' },
      { id: 'task-11', title: 'Task Eleven', description: 'This is task eleven' },
      { id: 'task-12', title: 'Task Twelve', description: 'This is task twelve' },
    ],
  },
  {
    id: 'col-2',
    title: 'DONE',
    tasks: [
      { id: 'task-2', title: 'Task Two', description: 'This is task two' },
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
  const [activeTask, setActiveTask] = useState<TaskItem | null>(null);
  const [activeColumnId, setActiveColumnId] = useState<string | null>(null);

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 5,
      },
    })
  );

  function findColumnContainingTask(taskId: string) {
    return columns.find((col) => col.tasks.some((t) => t.id === taskId));
  }

  function handleDragStart(event: DragStartEvent) {
    const { active } = event;
    const activeId = active.id as string;

    const col = findColumnContainingTask(activeId);

    if (col) {
      const task = col.tasks.find((t) => t.id === activeId);
      if (task) {
        setActiveTask(task);
        setActiveColumnId(col.id);
      }
    }
  }
  /* 
  https://docs.dndkit.com/presets/sortable
  to detect when a draggable element is moved over a different container to insert it in that new container while dragging
  */
  function handleDragOver(event: DragOverEvent) {
    const { active, over } = event;
    if (!over) return;

    const activeId = active.id as string;
    const overId = over.id as string;

    const activeCol = findColumnContainingTask(activeId);
    const overCol = columns.find((col) => col.id === overId);

    if (!activeCol || !overCol) return;
    if (activeCol.id === overCol.id) return;

    setColumns((prev) => {
      const activeItems = activeCol.tasks;
      const overItems = overCol.tasks;

      const activeIndex = activeItems.findIndex((t) => t.id === activeId);
      const overIndex = overItems.findIndex((t) => t.id === overId);

      let newIndex;
      if (overItems.some((t) => t.id === overId)) {
        newIndex =
          overIndex >= 0
            ? overIndex +
              (active.rect.current.translated &&
              active.rect.current.translated.top >
                over.rect.top + over.rect.height
                ? 1
                : 0)
            : overItems.length + 1;
      } else {
        newIndex = overItems.length + 1;
      }

      return prev.map((col) => {
        if (col.id == activeCol.id) {
          return {
            ...col,
            tasks: activeItems.filter((t) => t.id !== activeId),
          };
        }
        if (col.id == overCol.id) {
          return {
            ...col,
            tasks: [
              ...overItems.slice(0, newIndex),
              activeItems[activeIndex],
              ...overItems.slice(newIndex, overItems.length),
            ],
          };
        }
        return col;
      });
    });
  }

  function handleDragEnd(event: DragEndEvent) {
    const { active, over } = event;
    const activeCol = findColumnContainingTask(active.id as string);
    const overCol = findColumnContainingTask(over?.id as string);

    if (!activeCol || !overCol || overCol !== activeCol) {
      setActiveTask(null);
      return;
    }

    const activeIndex = activeCol.tasks.findIndex((t) => t.id === active.id);
    const overIndex = overCol.tasks.findIndex((t) => t.id === over?.id);

    if (activeIndex !== overIndex) {
      setColumns((prev) => {
        return prev.map((col) => {
          if (col.id == activeCol.id) {
            return {
              ...col,
              tasks: arrayMove(col.tasks, activeIndex, overIndex),
            };
          }
          return col;
        });
      });
    }

    setActiveTask(null);
  }

  function handleAddTask(columnId: string, task: TaskItem) {
    // TODO: Open a modal to get task details and then add the task to the column
  }

  function deleteColumn(columnId: string) {
    setColumns((prevColumns) =>
      prevColumns.filter((col) => col.id !== columnId)
    );
  }

  function deleteTask(colomnId: string, taskId: string) {}
  return (
    <>
      <BackgroundCanvas />
      <DndContext
        sensors={sensors}
        collisionDetection={closestCenter}
        onDragStart={handleDragStart}
        onDragOver={handleDragOver}
        onDragEnd={handleDragEnd}
      >
        <div className="container mx-auto p-10 pb-16  gap-5 h-screen grid grid-cols-1 lg:grid-cols-3 items-stretch">
          {columns.map((column) => (
            <Column
              column={column}
              key={column.id}
              onAddTask={() => {}}
              onDeleteColumn={() => {
                deleteColumn(column.id);
              }}
            >
              {column.tasks.map((task: TaskItem) => (
                <TaskCard
                  key={task.id}
                  task={task}
                  onDelete={() => {
                    deleteTask(column.id, task.id);
                  }}
                />
              ))}
            </Column>
          ))}
        </div>

        {createPortal(
          <DragOverlay>
            {activeTask ? (
              <TaskCardContent
                task={activeTask}
                onDelete={() => {
                  deleteTask(
                    findColumnContainingTask(activeTask.id)!.id,
                    activeTask.id
                  );
                }}
              />
            ) : null}
          </DragOverlay>,
          document.body
        )}
      </DndContext>
    </>
  );
}
