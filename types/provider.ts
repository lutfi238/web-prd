export type ProviderKind = "groq" | "openrouter" | "openai-compatible";

export type BaseProviderConfig = {
  apiKey: string;
  model: string;
};

export type GroqProviderConfig = BaseProviderConfig & {
  kind: "groq";
};

export type OpenRouterProviderConfig = BaseProviderConfig & {
  kind: "openrouter";
  baseUrl: string;
};

export type OpenAICompatibleProviderConfig = BaseProviderConfig & {
  kind: "openai-compatible";
  baseUrl: string;
  label: string;
};

export type ProviderConfig =
  | GroqProviderConfig
  | OpenRouterProviderConfig
  | OpenAICompatibleProviderConfig;

export type ProviderRecord = Record<ProviderKind, ProviderConfig>;
