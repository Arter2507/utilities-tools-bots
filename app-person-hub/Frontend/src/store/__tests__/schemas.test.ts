import { describe, expect, it } from "vitest";
import { LoveDataSchema, TaskSchema, safeParseArray } from "../schemas";

describe("safeParseArray", () => {
  it("returns parsed items for valid data", () => {
    const input = [
      { id: "task-1", title: "Test", tagColor: "#fff", column: "todo" },
    ];
    const result = safeParseArray(TaskSchema, input);
    expect(result).toHaveLength(1);
    expect(result[0].id).toBe("task-1");
  });

  it("returns empty array for invalid data", () => {
    const input = [{ id: 123, title: "Bad" }];
    const result = safeParseArray(TaskSchema, input);
    expect(result).toEqual([]);
  });
});

describe("LoveDataSchema", () => {
  it("accepts valid data", () => {
    const valid = {
      startDate: "2026-03-15",
      anniversaries: [
        { id: "a-1", title: "Test", date: "2026-03-20" },
      ],
    };
    expect(LoveDataSchema.safeParse(valid).success).toBe(true);
  });

  it("rejects missing startDate", () => {
    const invalid = { anniversaries: [] };
    expect(LoveDataSchema.safeParse(invalid).success).toBe(false);
  });
});
