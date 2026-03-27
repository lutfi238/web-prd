import { beforeEach, describe, expect, it, vi } from "vitest";

const { generateTextMock } = vi.hoisted(() => ({
  generateTextMock: vi.fn(),
}));

vi.mock("ai", () => ({
  generateText: generateTextMock,
}));

import { POST } from "@/app/api/prd/route";

describe("POST /api/prd", () => {
  beforeEach(() => {
    generateTextMock.mockReset();
  });

  it("returns 400 for invalid revise payload", async () => {
    const response = await POST(
      new Request("http://localhost/api/prd", {
        method: "POST",
        body: JSON.stringify({
          mode: "revise",
          idea: "Aplikasi untuk membuat PRD otomatis dari ide bisnis sederhana",
          techPreference: "ai",
          answers: [],
          revisionNote: "Tambah detail teknis",
          providerConfig: {
            kind: "groq",
            apiKey: "gsk_test",
            model: "llama-3.3-70b-versatile",
          },
        }),
      }),
    );

    expect(response.status).toBe(400);
  });

  it("returns generated markdown for a valid request", async () => {
    generateTextMock.mockResolvedValue({
      text: "# Project Overview & Goals\n\nIsi PRD.",
    });

    const response = await POST(
      new Request("http://localhost/api/prd", {
        method: "POST",
        body: JSON.stringify({
          mode: "generate",
          idea: "Aplikasi untuk membuat PRD otomatis dari ide bisnis sederhana",
          techPreference: "custom",
          customTechNotes: "Next.js, AI SDK, PostgreSQL",
          answers: [],
          providerConfig: {
            kind: "openrouter",
            apiKey: "or-key",
            model: "meta-llama/llama-3.3-70b-instruct",
            baseUrl: "https://openrouter.ai/api/v1",
          },
        }),
      }),
    );

    const json = await response.json();

    expect(response.status).toBe(200);
    expect(json.markdown).toContain("Project Overview");
  });
});
