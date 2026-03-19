import { describe, expect, it } from "vitest";
import { sanitizeMultiline, sanitizeText, sanitizeUrl } from "../sanitize";

describe("sanitizeText", () => {
  it("removes angle brackets and trims", () => {
    expect(sanitizeText("  <script>hello</script>  ")).toBe("scripthello/script");
  });

  it("normalizes whitespace", () => {
    expect(sanitizeText("hello    world")).toBe("hello world");
  });
});

describe("sanitizeMultiline", () => {
  it("removes angle brackets and keeps newlines", () => {
    const input = "Line 1\r\nLine <b>2</b>";
    expect(sanitizeMultiline(input)).toBe("Line 1\nLine b2/b");
  });
});

describe("sanitizeUrl", () => {
  it("accepts http/https urls", () => {
    expect(sanitizeUrl("https://example.com")).toBe("https://example.com/");
  });

  it("rejects non-http protocols", () => {
    expect(sanitizeUrl("javascript:alert(1)")).toBeUndefined();
  });

  it("returns undefined for empty input", () => {
    expect(sanitizeUrl("   ")).toBeUndefined();
  });
});
