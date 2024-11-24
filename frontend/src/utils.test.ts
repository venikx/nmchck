import { describe, test, expect, it } from "vitest";
import { translateCursorPosition } from "./utils";

// TODO move to different file
describe("bla", () => {
  test("kek", () => {
    expect(1).toBe(1);
  });
});

describe("when inputting numbers", () => {
  describe("by default, as you type", () => {
    it("cursor stays stable, when formatting is stable", () => {
      expect(translateCursorPosition("", 0, "")).toBe(0);
      expect(translateCursorPosition("0", 1, "0")).toBe(1);
      expect(translateCursorPosition("04", 2, "04")).toBe(2);
    });
    it("cursor shifts, when formatting is unstable", () => {
      expect(translateCursorPosition("047", 3, "04 7")).toBe(4);
      expect(translateCursorPosition("047", 3, "04 (7)")).toBe(5);
    });
    it("cursor stays stable, when formatting is stable again", () => {
      expect(translateCursorPosition("04 76", 5, "04 76")).toBe(5);
      expect(translateCursorPosition("04 (76)", 6, "04 (76)")).toBe(6);
    });
  });

  describe("when inserting numbers", () => {
    test("from the start, keeps the cursor stable", () => {
      expect(translateCursorPosition("047", 1, "04 7")).toBe(1);
      expect(translateCursorPosition("047 6", 1, "04 76")).toBe(1);
      expect(translateCursorPosition("047 (6)", 1, "04 (76)")).toBe(1);
    });

    test("within number set, keeps the cursor stable, despite formatting changes", () => {
      expect(translateCursorPosition("047", 2, "04 7")).toBe(2);
      expect(translateCursorPosition("047 6", 2, "04 76")).toBe(2);
      expect(translateCursorPosition("047", 2, "04 (7)")).toBe(2);
      expect(translateCursorPosition("047 (6)", 2, "04 (76)")).toBe(2);
      // international
      expect(translateCursorPosition("+358 45", 6, "+358 45")).toBe(6);
    });

    test("in front of a spacer, jumps the cursor", () => {
      expect(translateCursorPosition("047 6", 3, "04 76")).toBe(4);
      expect(translateCursorPosition("047 (6)", 3, "04 (76)")).toBe(5);
      // international
      expect(translateCursorPosition("+3584 5", 5, "+358 45")).toBe(6);
    });
  });
});

describe("when removing numbers", () => {
  describe("by default, as you type", () => {
    it("cursor stays stable, when formatting is stable", () => {
      expect(translateCursorPosition("04 76", 5, "04 76")).toBe(5);
      expect(translateCursorPosition("04 7", 4, "04 7")).toBe(4);

      expect(translateCursorPosition("04 (76)", 6, "04 (76)")).toBe(6);
      expect(translateCursorPosition("04 (7)", 5, "04 (7)")).toBe(5);
    });
    it("cursor shifts, when formatting is unstable", () => {
      expect(translateCursorPosition("04 ", 3, "04")).toBe(2);
      expect(translateCursorPosition("04 ()", 4, "04")).toBe(2);
    });
    it("cursor stays stable, when formatting is stable again", () => {
      expect(translateCursorPosition("0", 1, "0")).toBe(1);
      expect(translateCursorPosition("", 0, "")).toBe(0);
    });
  });

  describe("from the inside", () => {
    test("at the start, keeps the cursor at start", () => {
      expect(translateCursorPosition("", 0, "")).toBe(0);
      expect(translateCursorPosition("4", 0, "4")).toBe(0);
      expect(translateCursorPosition("4 76", 0, "04 7")).toBe(0);
      expect(translateCursorPosition("4 (76)", 0, "04 (7)")).toBe(0);
    });

    test("within a set, keeps the cursor stable", () => {
      expect(translateCursorPosition("0", 1, "0")).toBe(1);
      expect(translateCursorPosition("0 76", 1, "07 6")).toBe(1);
      expect(translateCursorPosition("0 (76)", 1, "07 (6)")).toBe(1);
    });

    test("removing in front of a spacer, moves the cursor", () => {
      expect(translateCursorPosition("04 6", 3, "04 6")).toBe(2);
      expect(translateCursorPosition("04 (6)", 4, "07 (76)")).toBe(2);
      expect(translateCursorPosition("04 76)", 3, "07 (76)")).toBe(2);
    });
  });
});
