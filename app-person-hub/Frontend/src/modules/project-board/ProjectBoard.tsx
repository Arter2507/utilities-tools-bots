import { useMemo, useState } from "react";
import { DndContext, PointerSensor, useSensor, useSensors } from "@dnd-kit/core";
import type { DragEndEvent, DragOverEvent } from "@dnd-kit/core";
import { arrayMove, SortableContext, verticalListSortingStrategy } from "@dnd-kit/sortable";
import { LayoutGrid, Plus } from "lucide-react";
import { Column } from "./components/Column";
import { TaskModal } from "./components/TaskModal";
import { TaskCardSortable } from "./components/TaskCardSortable";
import { useTasks } from "@/store/tasks";
import type { ProjectTask, ProjectColumn } from "@/store/tasks";
import { cn } from "@/lib/utils";

const columns: { id: ProjectColumn; title: string }[] = [
  { id: "todo", title: "To Do" },
  { id: "in-progress", title: "In Progress" },
  { id: "done", title: "Done" },
];

export default function ProjectBoard() {
  const tasks = useTasks((state) => state.tasks);
  const createTask = useTasks((state) => state.createTask);
  const updateTask = useTasks((state) => state.updateTask);
  const deleteTask = useTasks((state) => state.deleteTask);
  const moveTask = useTasks((state) => state.moveTask);
  const reorderTasks = useTasks((state) => state.reorderTasks);
  const [activeTask, setActiveTask] = useState<ProjectTask | null>(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [defaultColumn, setDefaultColumn] = useState<ProjectColumn>("todo");

  const sensors = useSensors(useSensor(PointerSensor, { activationConstraint: { distance: 6 } }));

  const tasksByColumn = useMemo(() => {
    return columns.reduce((acc, column) => {
      acc[column.id] = tasks.filter((task) => task.column === column.id);
      return acc;
    }, {} as Record<ProjectColumn, ProjectTask[]>);
  }, [tasks]);

  const openCreateModal = (column: ProjectColumn) => {
    setActiveTask(null);
    setDefaultColumn(column);
    setModalOpen(true);
  };

  const openEditModal = (task: ProjectTask) => {
    setActiveTask(task);
    setDefaultColumn(task.column);
    setModalOpen(true);
  };

  const handleDragOver = (event: DragOverEvent) => {
    const { active, over } = event;
    if (!over) return;
    const activeId = String(active.id);
    const overId = String(over.id);

    const activeTaskItem = tasks.find((task) => task.id === activeId);
    if (!activeTaskItem) return;

    const overColumn = columns.find((column) => column.id === overId)?.id;
    if (overColumn && activeTaskItem.column !== overColumn) {
      moveTask(activeTaskItem.id, overColumn);
    }
  };

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    if (!over) return;
    const activeId = String(active.id);
    const overId = String(over.id);

    if (activeId === overId) return;

    const activeTaskItem = tasks.find((task) => task.id === activeId);
    if (!activeTaskItem) return;

    const overColumn = columns.find((column) => column.id === overId)?.id;
    if (overColumn) {
      moveTask(activeTaskItem.id, overColumn);
      return;
    }

    const overTask = tasks.find((task) => task.id === overId);
    if (!overTask) return;

    if (activeTaskItem.column === overTask.column) {
      const columnTasks = tasksByColumn[activeTaskItem.column];
      const oldIndex = columnTasks.findIndex((task) => task.id === activeTaskItem.id);
      const newIndex = columnTasks.findIndex((task) => task.id === overTask.id);
      const reordered = arrayMove(columnTasks, oldIndex, newIndex).map((task) => task.id);
      reorderTasks(activeTaskItem.column, reordered);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <LayoutGrid className="h-4 w-4" />
            <span>Project Board</span>
          </div>
          <h1 className="mt-2 text-3xl font-bold tracking-tight">Trello Clone</h1>
          <p className="text-muted-foreground">Drag cards across columns and sync deadlines to Calendar.</p>
        </div>
        <button
          type="button"
          onClick={() => openCreateModal("todo")}
          className="flex items-center gap-2 rounded-lg bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground"
        >
          <Plus className="h-4 w-4" /> New Task
        </button>
      </div>

      <DndContext sensors={sensors} onDragOver={handleDragOver} onDragEnd={handleDragEnd}>
        <div className={cn("flex gap-4 overflow-x-auto pb-2", "snap-x snap-mandatory")}
          style={{ WebkitOverflowScrolling: "touch" }}
        >
          {columns.map((column) => (
            <div key={column.id} className="min-w-[280px] snap-start">
              <Column title={column.title} columnId={column.id} tasks={tasksByColumn[column.id]}>
                <SortableContext items={tasksByColumn[column.id].map((task) => task.id)} strategy={verticalListSortingStrategy}>
                  {tasksByColumn[column.id].map((task) => (
                    <TaskCardSortable key={task.id} task={task} onClick={openEditModal} />
                  ))}
                </SortableContext>
                <button
                  type="button"
                  onClick={() => openCreateModal(column.id)}
                  className="mt-2 rounded-lg border border-dashed border-border px-3 py-2 text-xs text-muted-foreground hover:text-foreground"
                >
                  + Quick add
                </button>
              </Column>
            </div>
          ))}
        </div>
      </DndContext>

      <TaskModal
        open={modalOpen}
        task={activeTask}
        defaultColumn={defaultColumn}
        onClose={() => setModalOpen(false)}
        onSave={(payload) => {
          if (activeTask) {
            updateTask(activeTask.id, payload);
          } else {
            createTask(payload);
          }
          setModalOpen(false);
        }}
        onDelete={(id) => {
          deleteTask(id);
          setModalOpen(false);
        }}
      />
    </div>
  );
}
