import { describe, expect, it } from "vitest";

import {
  generatedQuestionSchema,
  providerConfigSchema,
  prdRequestSchema,
  questionsRequestSchema,
} from "@/lib/schemas";

describe("providerConfigSchema", () => {
  it("accepts a valid Groq config", () => {
    const result = providerConfigSchema.safeParse({
      kind: "groq",
      apiKey: "gsk_test",
      model: "llama-3.3-70b-versatile",
    });

    expect(result.success).toBe(true);
  });

  it("rejects invalid custom provider baseUrl", () => {
    const result = providerConfigSchema.safeParse({
      kind: "openai-compatible",
      apiKey: "sk-test",
      model: "my-model",
      baseUrl: "not-a-url",
      label: "Custom",
    });

    expect(result.success).toBe(false);
  });
});

describe("generatedQuestionSchema", () => {
  it("accepts choice options with follow-up metadata", () => {
    const result = generatedQuestionSchema.safeParse({
      id: "q-followup",
      prompt: "Kalau ada catatan tambahan, tulis di mana?",
      type: "choice",
      options: [
        {
          id: "normal",
          label: "Langsung saja",
        },
        {
          id: "followup",
          label: "Sebutkan di catatan tambahan",
          followup: {
            label: "Catatan tambahan",
            placeholder: "Tulis detail tambahan kamu...",
          },
        },
      ],
    });

    expect(result.success).toBe(true);
  });

  it("rejects choice questions without options", () => {
    const result = generatedQuestionSchema.safeParse({
      id: "q1",
      prompt: "Pilih bahasa",
      type: "choice",
    });

    expect(result.success).toBe(false);
  });

  it("accepts text questions", () => {
    const result = generatedQuestionSchema.safeParse({
      id: "q2",
      prompt: "Apa target utamanya?",
      type: "text",
      placeholder: "Misalnya: bantu admin menulis PRD lebih cepat",
    });

    expect(result.success).toBe(true);
  });
});

describe("request schemas", () => {
  it("accepts a valid questions request", () => {
    const result = questionsRequestSchema.safeParse({
      idea: "Aplikasi untuk membuat PRD otomatis dari ide bisnis sederhana",
      techPreference: "custom",
      customTechNotes: "Next.js, Supabase, dan AI SDK",
      providerConfig: {
        kind: "openrouter",
        apiKey: "or-key",
        model: "meta-llama/llama-3.3-70b-instruct",
        baseUrl: "https://openrouter.ai/api/v1",
      },
    });

    expect(result.success).toBe(true);
  });

  it("requires previous markdown in revise mode", () => {
    const result = prdRequestSchema.safeParse({
      mode: "revise",
      idea: "Aplikasi untuk membuat PRD otomatis dari ide bisnis sederhana",
      techPreference: "ai",
      answers: [],
      providerConfig: {
        kind: "groq",
        apiKey: "gsk_test",
        model: "llama-3.3-70b-versatile",
      },
      revisionNote: "Jadikan lebih teknis",
    });

    expect(result.success).toBe(false);
  });
});
