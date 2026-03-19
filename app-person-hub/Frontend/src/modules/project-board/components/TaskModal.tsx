import { useEffect, useState } from "react";
import type { ProjectColumn, ProjectTask } from "@/store/tasks";
import { BaseModal } from "@/components/shared/BaseModal";
import { sanitizeText } from "@/lib/sanitize";

interface TaskModalProps {
  open: boolean;
  task?: ProjectTask | null;
  defaultColumn: ProjectColumn;
  onClose: () => void;
  onSave: (payload: Omit<ProjectTask, "id" | "createdAt">) => void;
  onDelete?: (id: string) => void;
}

const tagColors = ["#F59E7A", "#7AB8F5", "#6FD3B0", "#F38BA8", "#B8A1F2", "#F6C36A"];

export function TaskModal({ open, task, defaultColumn, onClose, onSave, onDelete }: TaskModalProps) {
  const [title, setTitle] = useState("");
  const [tagColor, setTagColor] = useState(tagColors[0]);
  const [dueDate, setDueDate] = useState("");
  const [column, setColumn] = useState<ProjectColumn>(defaultColumn);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!open) return;
    setTitle(task?.title ?? "");
    setTagColor(task?.tagColor ?? tagColors[0]);
    setDueDate(task?.dueDate ?? "");
    setColumn(task?.column ?? defaultColumn);
    setError("");
  }, [open, task, defaultColumn]);

  if (!open) return null;

  return (
    <BaseModal
      open={open}
      title={task ? "Edit Task" : "New Task"}
      description="Manage tasks with tags and deadlines."
      onClose={onClose}
      maxWidthClassName="max-w-lg"
      footer={(
        <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
          {task && onDelete && (
            <button
              type="button"
              className="rounded-lg border border-destructive/40 px-4 py-2 text-sm text-destructive hover:bg-destructive/10"
              onClick={() => onDelete(task.id)}
            >
              Delete
            </button>
          )}
          <div className="flex flex-1 justify-end gap-2">
            <button
              type="button"
              className="rounded-lg border border-border px-4 py-2 text-sm text-muted-foreground hover:text-foreground"
              onClick={onClose}
            >
              Cancel
            </button>
            <button
              type="button"
              className="rounded-lg bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground"
              onClick={() => {
                if (!title.trim()) {
                  setError("Title is required.");
                  return;
                }
                onSave({
                  title: sanitizeText(title),
                  tagColor,
                  dueDate: dueDate || undefined,
                  column,
                });
              }}
            >
              {task ? "Save Changes" : "Add Task"}
            </button>
          </div>
        </div>
      )}
    >
      <div className="space-y-4">
          <div>
            <label className="text-xs font-semibold text-muted-foreground">Title</label>
            <input
              value={title}
              onChange={(eventInput) => setTitle(eventInput.target.value)}
              placeholder="Task title"
              className="mt-1 w-full rounded-lg border border-border bg-background px-3 py-2 text-sm outline-none focus:border-primary"
            />
          </div>

          <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
            <div>
              <label className="text-xs font-semibold text-muted-foreground">Due date</label>
              <input
                type="date"
                value={dueDate}
                onChange={(eventInput) => setDueDate(eventInput.target.value)}
                className="mt-1 w-full rounded-lg border border-border bg-background px-3 py-2 text-sm outline-none focus:border-primary"
              />
            </div>
            <div>
              <label className="text-xs font-semibold text-muted-foreground">Column</label>
              <select
                value={column}
                onChange={(eventInput) => setColumn(eventInput.target.value as ProjectColumn)}
                className="mt-1 w-full rounded-lg border border-border bg-background px-3 py-2 text-sm outline-none focus:border-primary"
              >
                <option value="todo">To Do</option>
                <option value="in-progress">In Progress</option>
                <option value="done">Done</option>
              </select>
            </div>
          </div>

          <div>
            <label className="text-xs font-semibold text-muted-foreground">Tag color</label>
            <div className="mt-2 flex flex-wrap gap-2">
              {tagColors.map((color) => (
                <button
                  type="button"
                  key={color}
                  onClick={() => setTagColor(color)}
                  className="flex items-center gap-2 rounded-full border border-border px-3 py-1 text-xs"
                  style={{
                    backgroundColor: color === tagColor ? color : "transparent",
                    color: color === tagColor ? "white" : "inherit",
                    borderColor: color,
                  }}
                >
                  <span className="h-2 w-2 rounded-full" style={{ backgroundColor: color }} />
                  {color}
                </button>
              ))}
            </div>
          </div>

          {error && <p className="text-xs text-destructive">{error}</p>}
        </div>
    </BaseModal>
  );
}
