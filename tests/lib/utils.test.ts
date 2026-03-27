import { describe, expect, it } from "vitest";

import { cn } from "@/lib/utils";

describe("cn", () => {
  it("merges tailwind classes predictably", () => {
    expect(cn("px-4", "px-6", "text-sm")).toBe("px-6 text-sm");
  });
});
