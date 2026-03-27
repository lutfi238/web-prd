import type { GeneratedQuestion, QuestionAnswer, QuestionOption, QuestionOptionFollowup } from "@/types/prd";

const FOLLOWUP_KEYWORD_REGEX = /(catatan tambahan|sebutkan|lainnya|other)/i;

const inferredFollowupConfig: Required<QuestionOptionFollowup> = {
  label: "Catatan tambahan",
  placeholder: "Tulis detail tambahan kamu...",
};

export function getOptionFollowupConfig(option?: QuestionOption | null) {
  if (!option) {
    return null;
  }

  if (option.followup) {
    return {
      label: option.followup.label ?? inferredFollowupConfig.label,
      placeholder: option.followup.placeholder ?? inferredFollowupConfig.placeholder,
    };
  }

  if (FOLLOWUP_KEYWORD_REGEX.test(option.label)) {
    return inferredFollowupConfig;
  }

  return null;
}

export function getQuestionFollowupOption(question: GeneratedQuestion) {
  if (question.type !== "choice") {
    return null;
  }

  return question.options?.find((option) => getOptionFollowupConfig(option)) ?? null;
}

export function deriveChoiceAnswerState(question: GeneratedQuestion, answer?: QuestionAnswer) {
  if (!answer || question.type !== "choice") {
    return {
      selectedOptionId: undefined,
      followupValue: "",
    };
  }

  if (answer.optionId) {
    return {
      selectedOptionId: answer.optionId,
      followupValue: answer.followupValue ?? "",
    };
  }

  const matchedOption = question.options?.find((option) => {
    return answer.value === option.label || answer.value.startsWith(`${option.label} — `);
  });

  if (!matchedOption) {
    return {
      selectedOptionId: undefined,
      followupValue: "",
    };
  }

  const prefix = `${matchedOption.label} — `;

  return {
    selectedOptionId: matchedOption.id,
    followupValue: answer.value.startsWith(prefix) ? answer.value.slice(prefix.length) : "",
  };
}

export function getQuestionAnswerText(question: GeneratedQuestion, answer: QuestionAnswer) {
  const selectedOption =
    question.type === "choice"
      ? question.options?.find((option) => {
          return option.id === answer.optionId || answer.value === option.label || answer.value.startsWith(`${option.label} — `);
        })
      : undefined;
  const followupConfig = getOptionFollowupConfig(selectedOption);
  const followupValue = answer.followupValue?.trim();

  if (followupConfig && followupValue) {
    return `${answer.value} — ${followupValue}`;
  }

  return answer.value.trim();
}

export function isAnswerComplete(question: GeneratedQuestion, answer?: QuestionAnswer) {
  if (!answer || !answer.value.trim()) {
    return false;
  }

  if (question.type !== "choice") {
    return true;
  }

  const selectedOption =
    question.options?.find((option) => option.id === answer.optionId) ??
    question.options?.find((option) => {
      return option.label === answer.value || answer.value.startsWith(`${option.label} — `);
    });

  if (!getOptionFollowupConfig(selectedOption)) {
    return true;
  }

  return Boolean(answer.followupValue?.trim());
}
