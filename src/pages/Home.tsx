import type { ColumnType, TaskItem } from '@/types/kanban';
import { act, useEffect, useState } from 'react';
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
import Modal from '@/components/Modal';
import TaskForm from '@/components/TaskForm';
import SearchBar from '@/components/SearchBar';

// I HATE STYLING

// Initial Dummy Columns and Tasks - Just for testing.
const initialColumns: ColumnType[] = [
  {
    id: 'col-1',
    title: 'TODO',
    tasks: [
      {
        id: 'task-1',
        title: 'Task One',
        description: 'This is task one\nsdkfsfdskfk',
        createdAt: new Date().toDateString(),
        labels: [],
      },
      {
        id: 'task-3',
        title: 'Task Three',
        description: 'This is task three',
        createdAt: new Date().toDateString(),
        labels: [],
      },
      {
        id: 'task-4',
        title: 'Task Four',
        description: 'This is task four',
        createdAt: new Date().toDateString(),
        labels: [],
      },
      {
        id: 'task-5',
        title: 'Task Five',
        description: 'This is task five',
        createdAt: new Date().toDateString(),
        labels: [],
      },
      {
        id: 'task-6',
        title: 'Task Six',
        description: 'This is task six',
        createdAt: new Date().toDateString(),
        labels: [],
      },
      {
        id: 'task-7',
        title: 'Task Seven',
        description: 'This is task seven',
        createdAt: new Date().toDateString(),
        labels: [],
      },
      {
        id: 'task-8',
        title: 'Task Eight',
        description: 'This is task eight',
        createdAt: new Date().toDateString(),
        labels: [],
      },
      {
        id: 'task-9',
        title: 'Task Nine',
        description: 'This is task nine',
        createdAt: new Date().toDateString(),
        labels: [],
      },
      {
        id: 'task-10',
        title: 'Task Ten',
        description: 'This is task ten',
        createdAt: new Date().toDateString(),
        labels: [],
      },
      {
        id: 'task-11',
        title: 'Task Eleven',
        description: 'This is task eleven',
        createdAt: new Date().toDateString(),
        labels: [],
      },
      {
        id: 'task-12',
        title: 'Task Twelve',
        description: 'This is task twelve',
        createdAt: new Date().toDateString(),
        labels: [],
      },
    ],
  },
  {
    id: 'col-2',
    title: 'DONE',
    tasks: [
      {
        id: 'task-2',
        title: 'Task Two',
        description: 'This is task two',
        createdAt: new Date().toDateString(),
        labels: [],
      },
    ],
  },
  {
    id: 'col-3',
    title: 'IN PROGRESS',
    tasks: [],
  },
];

function getInitialColumns(): ColumnType[] {
  const storedColumns = localStorage.getItem('columns');
  if (storedColumns) {
    return JSON.parse(storedColumns);
  }
  return initialColumns;
}

export default function Home() {
  // States
  const [columns, setColumns] = useState<ColumnType[]>(getInitialColumns());
  const [activeTask, setActiveTask] = useState<TaskItem | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [addingToColumnId, setAddingToColumnId] = useState<string | null>(null);
  const [editingTask, setEditingTask] = useState<TaskItem | null>(null);
  const [deletingTask, setDeletingTask] = useState<TaskItem | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterPriority, setFilterPriority] = useState<
    'All' | 'Low' | 'Medium' | 'High'
  >('All');
  const [sortBy, setSortBy] = useState<'Manual' | 'Date' | 'Priority'>(
    'Manual'
  );

  useEffect(() => {
    localStorage.setItem('columns', JSON.stringify(columns));
  }, [columns]);


  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 5,
      },
    })
  );

  /* Drag & Drop functions */

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
        setSearchQuery('');
        setFilterPriority('All');
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

  /* ---- */

  function openAddTaskModal(columnId: string) {
    setAddingToColumnId(columnId);
    setIsModalOpen(true);
  }

  function closeModal() {
    setIsModalOpen(false);
    setAddingToColumnId(null);
  }

  function handleCreatTask(formData: any) {
    if (!addingToColumnId) return;

    const newTask: TaskItem = {
      id: `task-${crypto.randomUUID()}`,
      title: formData.title,
      description: formData.description,
      priority: formData.priority,
      labels: formData.labels,
      createdAt: new Date().toISOString(),
    };

    setColumns((prev) =>
      prev.map((col) => {
        if (col.id === addingToColumnId) {
          return {
            ...col,
            tasks: [...col.tasks, newTask],
          };
        }
        return col;
      })
    );
    closeModal();
  }

  function handleUpdateTask(updatedData: any) {
    if (!editingTask) return;

    const containerCol = findColumnContainingTask(editingTask.id);
    if (!containerCol) return;

    setColumns((prev) =>
      prev.map((col) => {
        if (col.id === containerCol.id) {
          return {
            ...col,
            tasks: col.tasks.map((t) =>
              t.id === editingTask.id ? { ...t, ...updatedData } : t
            ),
          };
        }
        return col;
      })
    );
    setEditingTask(null);
  }

  function confirmDeleteTask() {
    if (!deletingTask) return;

    const containerCol = findColumnContainingTask(deletingTask.id);
    if (!containerCol) return;

    setColumns((prev) =>
      prev.map((col) => {
        if (col.id === containerCol.id) {
          return {
            ...col,
            tasks: col.tasks.filter((t) => t.id !== deletingTask.id),
          };
        }
        return col;
      })
    );
    setDeletingTask(null);
  }

  const filteredColumns = columns.map((col) => {
    const filteredTasks = col.tasks.filter((task) => {
      const matchesSearch =
        task.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        task.description?.toLowerCase().includes(searchQuery.toLowerCase());

      const matchesPriority =
        filterPriority === 'All' || task.priority === filterPriority;
      return matchesSearch && matchesPriority;
    });

    const sortedTasks = [...filteredTasks].sort((a, b) => {
      if (sortBy === 'Manual') return 0;
      if (sortBy === 'Date') {
        return (
          new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
        );
      }
      if (sortBy === 'Priority') {
        const priorityOrder = { Low: 1, Medium: 2, High: 3 };
        return (
          priorityOrder[a.priority || 'Low'] -
          priorityOrder[b.priority || 'Low']
        );
      }
      return 0;
    });

    return {
      ...col,
      tasks: sortedTasks,
    };
  });

  function deleteColumn(columnId: string) {
    // setColumns((prevColumns) =>
    //   prevColumns.filter((col) => col.id !== columnId)
    // );
  }

  return (
    <div className="flex flex-col h-screen w-full overflow-hidden">
      <BackgroundCanvas />
      <SearchBar
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        filterPriority={filterPriority}
        setFilterPriority={setFilterPriority}
        sortBy={sortBy}
        setSortBy={setSortBy}
      />
      <DndContext
        sensors={sensors}
        collisionDetection={closestCenter}
        onDragStart={handleDragStart}
        onDragOver={handleDragOver}
        onDragEnd={handleDragEnd}
      >
        <div className="container mx-auto pb-16  gap-5 h-full grid grid-cols-1 lg:grid-cols-3 items-stretch">
          {filteredColumns.map((column) => (
            <Column
              column={column}
              key={column.id}
              onAddTask={() => openAddTaskModal(column.id)}
              onDeleteColumn={() => {
                deleteColumn(column.id);
              }}
            >
              {column.tasks.map((task: TaskItem) => (
                <TaskCard
                  key={task.id}
                  task={task}
                  dragDisabled={sortBy !== 'Manual'}
                  onDelete={() => {
                    setDeletingTask(task);
                  }}
                  onClick={() => setEditingTask(task)}
                />
              ))}
            </Column>
          ))}
        </div>

        {createPortal(
          <DragOverlay>
            {activeTask ? <TaskCardContent task={activeTask} /> : null}
          </DragOverlay>,
          document.body
        )}

        {/* Add new Task */}
        <Modal isOpen={isModalOpen} onClose={closeModal} title="Add New Task">
          <TaskForm onSubmit={handleCreatTask} onCancel={closeModal} />
        </Modal>

        {/* Edit Task */}
        <Modal
          isOpen={!!editingTask}
          onClose={() => setEditingTask(null)}
          title="Edit Task"
        >
          {editingTask && (
            <TaskForm
              initialData={editingTask}
              onSubmit={handleUpdateTask}
              onCancel={() => setEditingTask(null)}
            />
          )}
        </Modal>

        {/* Delete Task */}
        <Modal
          isOpen={!!deletingTask}
          onClose={() => setDeletingTask(null)}
          title="Delete Task"
        >
          <div className="space-y-4">
            <p className="text-gray-600">
              Are you sure you want to delete this item? This action cannot be
              undone.
            </p>
            <div className="flex justify-center gap-3">
              <button
                onClick={() => setDeletingTask(null)}
                className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-lg cursor-pointer"
              >
                Cancel
              </button>
              <button
                onClick={confirmDeleteTask}
                className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 cursor-pointer"
              >
                Delete
              </button>
            </div>
          </div>
        </Modal>
      </DndContext>
    </div>
  );
}
