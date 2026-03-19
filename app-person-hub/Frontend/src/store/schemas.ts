import { z } from "zod";

export const TaskSchema = z.object({
  id: z.string(),
  title: z.string(),
  tagColor: z.string(),
  dueDate: z.string().optional(),
  column: z.enum(["todo", "in-progress", "done"]),
  createdAt: z.string().optional(),
});

export const TransactionSchema = z.object({
  id: z.string(),
  title: z.string(),
  amount: z.number(),
  type: z.enum(["income", "expense"]),
  category: z.string(),
  date: z.string(),
  createdAt: z.string().optional(),
});

export const CycleSchema = z.object({
  id: z.string(),
  startDate: z.string(),
  lengthDays: z.number(),
  createdAt: z.string().optional(),
});

export const LogSchema = z.object({
  id: z.string(),
  date: z.string(),
  weight: z.number(),
  mood: z.number(),
  note: z.string().optional(),
  createdAt: z.string().optional(),
});

export const JourneySchema = z.object({
  id: z.string(),
  title: z.string(),
  content: z.string(),
  date: z.string(),
  imageUrl: z.string().optional(),
  createdAt: z.string().optional(),
});

export const LoveDataSchema = z.object({
  startDate: z.string(),
  anniversaries: z.array(z.object({
    id: z.string(),
    title: z.string(),
    date: z.string(),
    note: z.string().optional(),
    createdAt: z.string().optional(),
  })),
});

export const NotificationSchema = z.object({
  id: z.string(),
  title: z.string(),
  body: z.string().optional(),
  createdAt: z.string(),
  read: z.boolean(),
});

export function safeParseArray<T>(schema: z.ZodType<T>, data: unknown): T[] {
  const result = z.array(schema).safeParse(data);
  return result.success ? result.data : [];
}
