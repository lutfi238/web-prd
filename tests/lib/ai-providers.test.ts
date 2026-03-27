import { z } from "zod";
import { describe, expect, it } from "vitest";

import {
  createLanguageModel,
  getProviderDisplayName,
  parseStructuredOutput,
  sanitizeJsonText,
} from "@/lib/ai-providers";

describe("createLanguageModel", () => {
  it("creates a Groq model without throwing", () => {
    const model = createLanguageModel({
      kind: "groq",
      apiKey: "gsk_test",
      model: "llama-3.3-70b-versatile",
    });

    expect(model).toBeTruthy();
  });

  it("creates an OpenRouter model without throwing", () => {
    const model = createLanguageModel({
      kind: "openrouter",
      apiKey: "or-key",
      model: "meta-llama/llama-3.3-70b-instruct",
      baseUrl: "https://openrouter.ai/api/v1",
    });

    expect(model).toBeTruthy();
  });

  it("returns a custom provider display name", () => {
    const label = getProviderDisplayName({
      kind: "openai-compatible",
      apiKey: "sk-test",
      model: "custom-model",
      baseUrl: "https://api.example.com/v1",
      label: "Nebula API",
    });

    expect(label).toBe("Nebula API");
  });
});

describe("structured output helpers", () => {
  it("cleans fenced json strings", () => {
    const cleaned = sanitizeJsonText("```json\n{\"ok\":true}\n```");
    expect(cleaned).toBe("{\"ok\":true}");
  });

  it("parses sanitized output against a schema", () => {
    const parsed = parseStructuredOutput(
      "```json\n{\"questions\":[{\"id\":\"q1\",\"prompt\":\"Halo\",\"type\":\"text\"}]}\n```",
      z.object({
        questions: z.array(
          z.object({
            id: z.string(),
            prompt: z.string(),
            type: z.string(),
          }),
        ),
      }),
    );

    expect(parsed.questions).toHaveLength(1);
  });
});
