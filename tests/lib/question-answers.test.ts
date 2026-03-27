import { describe, expect, it } from "vitest";

import {
  deriveChoiceAnswerState,
  getQuestionAnswerText,
  getQuestionFollowupOption,
  isAnswerComplete,
} from "@/lib/question-answers";
import type { GeneratedQuestion, QuestionAnswer } from "@/types/prd";

const followupQuestion: GeneratedQuestion = {
  id: "q-followup",
  prompt: "Preferensi output seperti apa?",
  type: "choice",
  options: [
    {
      id: "default",
      label: "Poin-poin",
    },
    {
      id: "notes",
      label: "Sebutkan di catatan tambahan",
      followup: {
        label: "Catatan tambahan",
        placeholder: "Tulis preferensi tambahan kamu...",
      },
    },
  ],
};

describe("question follow-up helpers", () => {
  it("finds the follow-up option from explicit metadata", () => {
    const option = getQuestionFollowupOption(followupQuestion);
    expect(option?.id).toBe("notes");
  });

  it("formats answer text with follow-up note when present", () => {
    const answer: QuestionAnswer = {
      questionId: "q-followup",
      value: "Sebutkan di catatan tambahan",
      optionId: "notes",
      followupValue: "Fokus ke founder solo",
    };

    expect(getQuestionAnswerText(followupQuestion, answer)).toBe(
      "Sebutkan di catatan tambahan — Fokus ke founder solo",
    );
  });

  it("marks answer incomplete when selected option requires follow-up but note is empty", () => {
    const answer: QuestionAnswer = {
      questionId: "q-followup",
      value: "Sebutkan di catatan tambahan",
      optionId: "notes",
    };

    expect(isAnswerComplete(followupQuestion, answer)).toBe(false);
  });

  it("derives selected choice state from structured answer", () => {
    const answer: QuestionAnswer = {
      questionId: "q-followup",
      value: "Sebutkan di catatan tambahan",
      optionId: "notes",
      followupValue: "Tambahkan contoh use case",
    };

    expect(deriveChoiceAnswerState(followupQuestion, answer)).toEqual({
      selectedOptionId: "notes",
      followupValue: "Tambahkan contoh use case",
    });
  });
});
