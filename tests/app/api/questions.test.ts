import { beforeEach, describe, expect, it, vi } from "vitest";

const { generateTextMock } = vi.hoisted(() => ({
  generateTextMock: vi.fn(),
}));

vi.mock("ai", () => ({
  generateText: generateTextMock,
}));

import { POST } from "@/app/api/questions/route";

describe("POST /api/questions", () => {
  beforeEach(() => {
    generateTextMock.mockReset();
  });

  it("returns 400 for invalid payload", async () => {
    const response = await POST(
      new Request("http://localhost/api/questions", {
        method: "POST",
        body: JSON.stringify({ idea: "terlalu pendek" }),
      }),
    );

    expect(response.status).toBe(400);
  });

  it("returns parsed questions for a valid request", async () => {
    generateTextMock.mockResolvedValue({
      text: JSON.stringify({
        questions: [
          {
            id: "q-1",
            prompt: "Siapa target utamanya?",
            type: "text",
          },
        ],
      }),
    });

    const response = await POST(
      new Request("http://localhost/api/questions", {
        method: "POST",
        body: JSON.stringify({
          idea: "Aplikasi untuk membuat PRD otomatis dari ide bisnis sederhana",
          techPreference: "ai",
          providerConfig: {
            kind: "groq",
            apiKey: "gsk_test",
            model: "llama-3.3-70b-versatile",
          },
        }),
      }),
    );

    const json = await response.json();

    expect(response.status).toBe(200);
    expect(json.questions).toHaveLength(1);
  });

  it("returns 500 when AI output is not valid JSON", async () => {
    generateTextMock.mockResolvedValue({
      text: "hasil tidak valid",
    });

    const response = await POST(
      new Request("http://localhost/api/questions", {
        method: "POST",
        body: JSON.stringify({
          idea: "Aplikasi untuk membuat PRD otomatis dari ide bisnis sederhana",
          techPreference: "ai",
          providerConfig: {
            kind: "groq",
            apiKey: "gsk_test",
            model: "llama-3.3-70b-versatile",
          },
        }),
      }),
    );

    expect(response.status).toBe(500);
  });
});
