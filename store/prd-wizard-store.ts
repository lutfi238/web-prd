"use client";

import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";

import { providerDefaults } from "@/lib/provider-defaults";
import type {
  GeneratePrdResponse,
  GeneratedQuestion,
  QuestionAnswer,
  TechPreferenceMode,
  WizardStep,
} from "@/types/prd";
import type { ProviderConfig, ProviderKind, ProviderRecord } from "@/types/provider";

type PrdWizardState = {
  step: WizardStep;
  idea: string;
  techPreference: TechPreferenceMode;
  customTechNotes: string;
  questions: GeneratedQuestion[];
  answers: QuestionAnswer[];
  prdMarkdown: GeneratePrdResponse["markdown"];
  activeProvider: ProviderKind;
  providers: ProviderRecord;
  isGeneratingQuestions: boolean;
  isGeneratingPrd: boolean;
  isRevisingPrd: boolean;
};

type PrdWizardActions = {
  setStep: (step: WizardStep) => void;
  nextStep: () => void;
  previousStep: () => void;
  setIdea: (idea: string) => void;
  setTechPreference: (mode: TechPreferenceMode) => void;
  setCustomTechNotes: (notes: string) => void;
  setQuestions: (questions: GeneratedQuestion[]) => void;
  upsertAnswer: (answer: QuestionAnswer) => void;
  skipQuestion: (questionId: string) => void;
  setPrdMarkdown: (markdown: string) => void;
  setIsGeneratingQuestions: (value: boolean) => void;
  setIsGeneratingPrd: (value: boolean) => void;
  setIsRevisingPrd: (value: boolean) => void;
  updateProviderConfig: (kind: ProviderKind, config: ProviderConfig) => void;
  setActiveProvider: (kind: ProviderKind) => void;
  resetWizard: () => void;
};

export type PrdWizardStore = PrdWizardState & PrdWizardActions;

const initialState: PrdWizardState = {
  step: 1,
  idea: "",
  techPreference: "ai",
  customTechNotes: "",
  questions: [],
  answers: [],
  prdMarkdown: "",
  activeProvider: "groq",
  providers: providerDefaults,
  isGeneratingQuestions: false,
  isGeneratingPrd: false,
  isRevisingPrd: false,
};

export const usePrdWizardStore = create<PrdWizardStore>()(
  persist(
    (set) => ({
      ...initialState,
      setStep: (step) => set({ step }),
      nextStep: () =>
        set((state) => ({
          step: Math.min(4, state.step + 1) as WizardStep,
        })),
      previousStep: () =>
        set((state) => ({
          step: Math.max(1, state.step - 1) as WizardStep,
        })),
      setIdea: (idea) => set({ idea }),
      setTechPreference: (techPreference) => set({ techPreference }),
      setCustomTechNotes: (customTechNotes) => set({ customTechNotes }),
      setQuestions: (questions) =>
        set({
          questions,
          answers: [],
        }),
      upsertAnswer: (incomingAnswer) =>
        set((state) => {
          const hasValue = incomingAnswer.value.trim().length > 0;
          const normalizedAnswer: QuestionAnswer = {
            ...incomingAnswer,
            followupValue: incomingAnswer.followupValue ?? "",
          };
          const existing = state.answers.find((answer) => answer.questionId === incomingAnswer.questionId);

          if (!hasValue) {
            return {
              answers: state.answers.filter((answer) => answer.questionId !== incomingAnswer.questionId),
            };
          }

          if (existing) {
            return {
              answers: state.answers.map((answer) =>
                answer.questionId === incomingAnswer.questionId ? normalizedAnswer : answer,
              ),
            };
          }

          return {
            answers: [...state.answers, normalizedAnswer],
          };
        }),
      skipQuestion: (questionId) =>
        set((state) => ({
          answers: state.answers.filter((answer) => answer.questionId !== questionId),
        })),
      setPrdMarkdown: (prdMarkdown) => set({ prdMarkdown }),
      setIsGeneratingQuestions: (isGeneratingQuestions) => set({ isGeneratingQuestions }),
      setIsGeneratingPrd: (isGeneratingPrd) => set({ isGeneratingPrd }),
      setIsRevisingPrd: (isRevisingPrd) => set({ isRevisingPrd }),
      updateProviderConfig: (kind, config) =>
        set((state) => ({
          providers: {
            ...state.providers,
            [kind]: config,
          },
        })),
      setActiveProvider: (activeProvider) => set({ activeProvider }),
      resetWizard: () =>
        set((state) => ({
          ...initialState,
          activeProvider: state.activeProvider,
          providers: state.providers,
        })),
    }),
    {
      name: "prd-generator-personal-store",
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({
        step: state.step,
        idea: state.idea,
        techPreference: state.techPreference,
        customTechNotes: state.customTechNotes,
        questions: state.questions,
        answers: state.answers,
        prdMarkdown: state.prdMarkdown,
        activeProvider: state.activeProvider,
        providers: state.providers,
      }),
    },
  ),
);

export function getActiveProviderConfig(state: Pick<PrdWizardState, "activeProvider" | "providers">) {
  return state.providers[state.activeProvider];
}
