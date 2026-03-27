import { z } from "zod";

const baseProviderConfigSchema = z.object({
  apiKey: z.string().trim().min(1, "API key wajib diisi."),
  model: z.string().trim().min(1, "Model wajib diisi."),
});

export const groqProviderConfigSchema = baseProviderConfigSchema.extend({
  kind: z.literal("groq"),
});

export const openRouterProviderConfigSchema = baseProviderConfigSchema.extend({
  kind: z.literal("openrouter"),
  baseUrl: z.string().url("Base URL OpenRouter tidak valid."),
});

export const openAICompatibleProviderConfigSchema =
  baseProviderConfigSchema.extend({
    kind: z.literal("openai-compatible"),
    baseUrl: z.string().url("Base URL provider tidak valid."),
    label: z.string().trim().min(1, "Nama provider wajib diisi."),
  });

export const providerConfigSchema = z.discriminatedUnion("kind", [
  groqProviderConfigSchema,
  openRouterProviderConfigSchema,
  openAICompatibleProviderConfigSchema,
]);

export const questionOptionSchema = z.object({
  id: z.string().trim().min(1),
  label: z.string().trim().min(1),
  followup: z
    .object({
      label: z.string().trim().optional(),
      placeholder: z.string().trim().optional(),
    })
    .optional(),
});

export const generatedQuestionSchema = z
  .object({
    id: z.string().trim().min(1),
    prompt: z.string().trim().min(1),
    helperText: z.string().trim().optional(),
    type: z.enum(["choice", "text"]),
    options: z.array(questionOptionSchema).optional(),
    placeholder: z.string().trim().optional(),
    skippable: z.boolean().default(true),
  })
  .superRefine((question, ctx) => {
    if (question.type === "choice" && (!question.options || question.options.length < 2)) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "Pertanyaan pilihan harus punya minimal dua opsi.",
        path: ["options"],
      });
    }
  });

export const questionAnswerSchema = z.object({
  questionId: z.string().trim().min(1),
  value: z.string().trim().min(1),
  optionId: z.string().trim().optional(),
  followupValue: z.string().optional(),
});

export const questionsRequestSchema = z.object({
  idea: z.string().trim().min(10, "Ide aplikasi terlalu singkat."),
  techPreference: z.enum(["ai", "custom"]),
  customTechNotes: z.string().trim().optional(),
  providerConfig: providerConfigSchema,
});

export const questionsResponseSchema = z.object({
  questions: z.array(generatedQuestionSchema).min(1).max(8),
});

export const prdRequestSchema = z
  .object({
    mode: z.enum(["generate", "revise"]),
    idea: z.string().trim().min(10, "Ide aplikasi terlalu singkat."),
    techPreference: z.enum(["ai", "custom"]),
    customTechNotes: z.string().trim().optional(),
    answers: z.array(questionAnswerSchema),
    providerConfig: providerConfigSchema,
    existingPrd: z.string().trim().optional(),
    revisionNote: z.string().trim().optional(),
  })
  .superRefine((data, ctx) => {
    if (data.mode === "revise" && !data.existingPrd) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "PRD sebelumnya wajib ada untuk mode revisi.",
        path: ["existingPrd"],
      });
    }

    if (data.mode === "revise" && !data.revisionNote) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "Catatan revisi wajib diisi.",
        path: ["revisionNote"],
      });
    }
  });

export const prdResponseSchema = z.object({
  markdown: z.string().trim().min(1),
});

export type ProviderConfigInput = z.infer<typeof providerConfigSchema>;
export type GeneratedQuestionInput = z.infer<typeof generatedQuestionSchema>;
export type QuestionsRequestInput = z.infer<typeof questionsRequestSchema>;
export type QuestionsResponseInput = z.infer<typeof questionsResponseSchema>;
export type PrdRequestInput = z.infer<typeof prdRequestSchema>;
export type PrdResponseInput = z.infer<typeof prdResponseSchema>;
