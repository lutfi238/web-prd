import type { ProviderRecord } from "@/types/provider";

export const providerDefaults: ProviderRecord = {
  groq: {
    kind: "groq",
    apiKey: "",
    model: "llama-3.3-70b-versatile",
  },
  openrouter: {
    kind: "openrouter",
    apiKey: "",
    model: "meta-llama/llama-3.3-70b-instruct",
    baseUrl: "https://openrouter.ai/api/v1",
  },
  "openai-compatible": {
    kind: "openai-compatible",
    apiKey: "",
    model: "gpt-4o-mini",
    baseUrl: "https://api.openai.com/v1",
    label: "Provider Kustom",
  },
};

export const providerLabels = {
  groq: "Groq",
  openrouter: "OpenRouter",
  "openai-compatible": "OpenAI-Compatible",
} as const;
