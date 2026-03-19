import { CSS } from "@dnd-kit/utilities";
import { useSortable } from "@dnd-kit/sortable";
import type { ProjectTask } from "@/store/tasks";
import { TaskCard } from "./TaskCard";

interface TaskCardSortableProps {
  task: ProjectTask;
  onClick: (task: ProjectTask) => void;
}

export function TaskCardSortable({ task, onClick }: TaskCardSortableProps) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({ id: task.id });

  return (
    <div
      ref={setNodeRef}
      style={{
        transform: CSS.Transform.toString(transform),
        transition,
        opacity: isDragging ? 0.7 : 1,
      }}
      {...attributes}
      {...listeners}
    >
      <TaskCard task={task} onClick={onClick} />
    </div>
  );
}
