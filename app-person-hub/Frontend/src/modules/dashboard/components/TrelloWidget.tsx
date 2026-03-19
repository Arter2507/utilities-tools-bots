import { useState } from "react";
import { CheckCircle2, Circle, Clock, Plus } from "lucide-react";
import { WidgetCard } from "./WidgetCard";
import { ListTodo } from "lucide-react";
import { useTasks } from "@/store/tasks";
import type { ProjectTask } from "@/store/tasks";
import { TaskModal } from "@/modules/project-board/components/TaskModal";

export function TrelloWidget() {
  const tasks = useTasks((state) => state.tasks);
  const createTask = useTasks((state) => state.createTask);
  const updateTask = useTasks((state) => state.updateTask);
  const deleteTask = useTasks((state) => state.deleteTask);
  const [modalOpen, setModalOpen] = useState(false);
  const [activeTask, setActiveTask] = useState<ProjectTask | null>(null);

  const getIcon = (column: ProjectTask["column"]) => {
    switch (column) {
      case "done":
        return <CheckCircle2 size={16} className="text-secondary-foreground/50" />;
      case "in-progress":
        return <Clock size={16} className="text-primary" />;
      default: return <Circle size={16} className="text-muted-foreground" />;
    }
  }

  return (
    <WidgetCard
      title="Trello (Tasks)"
      icon={<ListTodo size={20} />}
      className="col-span-1 md:col-span-2 lg:col-span-1"
      action={(
        <button
          type="button"
          onClick={() => {
            setActiveTask(null);
            setModalOpen(true);
          }}
          className="flex items-center gap-1 rounded-md border border-border px-2 py-1 text-xs text-muted-foreground hover:text-foreground"
        >
          <Plus size={14} /> Quick add
        </button>
      )}
    >
      <div className="space-y-3">
        {tasks.slice(0, 4).map((task) => (
          <button
            key={task.id}
            type="button"
            onClick={() => {
              setActiveTask(task);
              setModalOpen(true);
            }}
            className="flex w-full items-start gap-3 rounded-md p-2 text-left hover:bg-secondary/50 transition-colors"
          >
            <div className="mt-0.5">{getIcon(task.column)}</div>
            <span className={`text-sm ${task.column === 'done' ? 'line-through text-muted-foreground' : ''}`}>
              {task.title}
            </span>
          </button>
        ))}
        {tasks.length === 0 && (
          <p className="text-sm text-muted-foreground">No tasks yet. Add your first task.</p>
        )}
      </div>

      <TaskModal
        open={modalOpen}
        task={activeTask}
        defaultColumn={activeTask?.column ?? "todo"}
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
    </WidgetCard>
  );
}
