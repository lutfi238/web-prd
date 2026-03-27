import { createGroq } from "@ai-sdk/groq";
import { createOpenAICompatible } from "@ai-sdk/openai-compatible";
import type { LanguageModel } from "ai";
import { ZodSchema } from "zod";

import type { ProviderConfig } from "@/types/provider";

const APP_NAME = "PRD Generator Personal";
const APP_REFERER = "https://prd-generator-personal.local";

export function getProviderDisplayName(config: ProviderConfig) {
  switch (config.kind) {
    case "groq":
      return "Groq";
    case "openrouter":
      return "OpenRouter";
    case "openai-compatible":
      return config.label;
    default:
      return "Provider AI";
  }
}

export function createLanguageModel(config: ProviderConfig): LanguageModel {
  switch (config.kind) {
    case "groq": {
      const provider = createGroq({
        apiKey: config.apiKey,
      });

      return provider(config.model);
    }
    case "openrouter": {
      const provider = createOpenAICompatible({
        name: "openrouter",
        apiKey: config.apiKey,
        baseURL: config.baseUrl,
        headers: {
          "HTTP-Referer": APP_REFERER,
          "X-Title": APP_NAME,
        },
      });

      return provider(config.model);
    }
    case "openai-compatible": {
      const provider = createOpenAICompatible({
        name: config.label.toLowerCase().replace(/\s+/g, "-"),
        apiKey: config.apiKey,
        baseURL: config.baseUrl,
      });

      return provider(config.model);
    }
    default: {
      const exhaustiveCheck: never = config;
      throw new Error(`Provider belum didukung: ${String(exhaustiveCheck)}`);
    }
  }
}

export function sanitizeJsonText(rawText: string) {
  const trimmed = rawText.trim();
  const withoutFence = trimmed
    .replace(/^```json\s*/i, "")
    .replace(/^```\s*/i, "")
    .replace(/\s*```$/i, "")
    .trim();

  const firstObject = withoutFence.indexOf("{");
  const lastObject = withoutFence.lastIndexOf("}");

  if (firstObject >= 0 && lastObject > firstObject) {
    return withoutFence.slice(firstObject, lastObject + 1);
  }

  const firstArray = withoutFence.indexOf("[");
  const lastArray = withoutFence.lastIndexOf("]");

  if (firstArray >= 0 && lastArray > firstArray) {
    return withoutFence.slice(firstArray, lastArray + 1);
  }

  return withoutFence;
}

export function parseStructuredOutput<T>(rawText: string, schema: ZodSchema<T>): T {
  const sanitized = sanitizeJsonText(rawText);
  const parsed = JSON.parse(sanitized) as unknown;
  return schema.parse(parsed);
}
