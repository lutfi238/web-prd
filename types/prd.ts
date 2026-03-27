import type { ProviderConfig } from "@/types/provider";

export type TechPreferenceMode = "ai" | "custom";

export type WizardStep = 1 | 2 | 3 | 4;

export type QuestionType = "choice" | "text";

export type QuestionOptionFollowup = {
  label?: string;
  placeholder?: string;
};

export type QuestionOption = {
  id: string;
  label: string;
  followup?: QuestionOptionFollowup;
};

export type GeneratedQuestion = {
  id: string;
  prompt: string;
  helperText?: string;
  type: QuestionType;
  options?: QuestionOption[];
  placeholder?: string;
  skippable?: boolean;
};

export type QuestionAnswer = {
  questionId: string;
  value: string;
  optionId?: string;
  followupValue?: string;
};

export type QuestionsRequest = {
  idea: string;
  techPreference: TechPreferenceMode;
  customTechNotes?: string;
  providerConfig: ProviderConfig;
};

export type QuestionsResponse = {
  questions: GeneratedQuestion[];
};

export type GeneratePrdRequest = {
  mode: "generate" | "revise";
  idea: string;
  techPreference: TechPreferenceMode;
  customTechNotes?: string;
  answers: QuestionAnswer[];
  providerConfig: ProviderConfig;
  existingPrd?: string;
  revisionNote?: string;
};

export type GeneratePrdResponse = {
  markdown: string;
};
