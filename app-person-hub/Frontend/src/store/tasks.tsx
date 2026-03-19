import { createContext, useContextSelector } from "use-context-selector";
import { useEffect, useMemo, useState } from "react";
import { TaskSchema, safeParseArray } from "./schemas";
import { useNotifications } from "./notifications";

export type ProjectColumn = "todo" | "in-progress" | "done";

export interface ProjectTask {
  id: string;
  title: string;
  tagColor: string;
  dueDate?: string;
  column: ProjectColumn;
  createdAt: string;
}

interface TaskContextValue {
  tasks: ProjectTask[];
  createTask: (payload: Omit<ProjectTask, "id" | "createdAt">) => void;
  updateTask: (id: string, payload: Omit<ProjectTask, "id" | "createdAt">) => void;
  deleteTask: (id: string) => void;
  moveTask: (id: string, column: ProjectColumn, index?: number) => void;
  reorderTasks: (column: ProjectColumn, orderedIds: string[]) => void;
}

const TaskContext = createContext<TaskContextValue>({} as TaskContextValue);

const STORAGE_KEY = "project_board_tasks_v1";

const defaultTasks: ProjectTask[] = [
  {
    id: "task-1",
    title: "Set sprint priorities",
    tagColor: "#F59E7A",
    dueDate: "2026-03-20",
    column: "todo",
    createdAt: "2026-03-15T09:20:00.000Z",
  },
  {
    id: "task-2",
    title: "Review Calendar UX",
    tagColor: "#7AB8F5",
    dueDate: "2026-03-22",
    column: "in-progress",
    createdAt: "2026-03-15T10:00:00.000Z",
  },
  {
    id: "task-3",
    title: "Ship ProjectBoard",
    tagColor: "#6FD3B0",
    dueDate: "2026-03-25",
    column: "done",
    createdAt: "2026-03-15T11:30:00.000Z",
  },
];

function readTasks(): ProjectTask[] {
  const raw = localStorage.getItem(STORAGE_KEY);
  if (!raw) return [];
  try {
    const parsed = JSON.parse(raw) as unknown;
    const tasks = safeParseArray(TaskSchema, parsed);
    return tasks.map((task) => ({
      ...task,
      createdAt: task.createdAt ?? new Date().toISOString(),
    }));
  } catch {
    return [];
  }
}

function writeTasks(tasks: ProjectTask[]) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(tasks));
}

export function TaskProvider({ children }: { children: React.ReactNode }) {
  const addNotification = useNotifications((state) => state.addNotification);
  const [tasks, setTasks] = useState<ProjectTask[]>([]);

  useEffect(() => {
    const stored = readTasks();
    if (stored.length > 0) {
      setTasks(stored);
    } else {
      setTasks(defaultTasks);
      writeTasks(defaultTasks);
    }
  }, []);

  const createTask = (payload: Omit<ProjectTask, "id" | "createdAt">) => {
    const created: ProjectTask = {
      ...payload,
      id: `task-${Date.now()}`,
      createdAt: new Date().toISOString(),
    };
    setTasks((prev) => {
      const next = [...prev, created];
      writeTasks(next);
      return next;
    });
    addNotification("New task", created.title);
  };

  const updateTask = (id: string, payload: Omit<ProjectTask, "id" | "createdAt">) => {
    setTasks((prev) => {
      const next = prev.map((task) => (task.id === id ? { ...payload, id, createdAt: task.createdAt } : task));
      writeTasks(next);
      return next;
    });
  };

  const deleteTask = (id: string) => {
    setTasks((prev) => {
      const next = prev.filter((task) => task.id !== id);
      writeTasks(next);
      return next;
    });
  };

  const moveTask = (id: string, column: ProjectColumn, index?: number) => {
    setTasks((prev) => {
      const moving = prev.find((task) => task.id === id);
      if (!moving) return prev;
      const remaining = prev.filter((task) => task.id !== id);
      const updated: ProjectTask = { ...moving, column };
      let next = remaining;
      if (typeof index === "number") {
        const columnTasks = remaining.filter((task) => task.column === column);
        const otherTasks = remaining.filter((task) => task.column !== column);
        const boundedIndex = Math.max(0, Math.min(index, columnTasks.length));
        const newColumnTasks = [...columnTasks.slice(0, boundedIndex), updated, ...columnTasks.slice(boundedIndex)];
        next = [...otherTasks, ...newColumnTasks];
      } else {
        next = [...remaining, updated];
      }
      writeTasks(next);
      return next;
    });
  };

  const reorderTasks = (column: ProjectColumn, orderedIds: string[]) => {
    setTasks((prev) => {
      const columnTasks = prev.filter((task) => task.column === column);
      const otherTasks = prev.filter((task) => task.column !== column);
      const ordered = orderedIds
        .map((id) => columnTasks.find((task) => task.id === id))
        .filter(Boolean) as ProjectTask[];
      const next = [...otherTasks, ...ordered];
      writeTasks(next);
      return next;
    });
  };

  const value = useMemo(
    () => ({ tasks, createTask, updateTask, deleteTask, moveTask, reorderTasks }),
    [tasks]
  );

  return <TaskContext.Provider value={value}>{children}</TaskContext.Provider>;
}

export function useTasks<T>(selector: (value: TaskContextValue) => T) {
  return useContextSelector(TaskContext, selector);
}
