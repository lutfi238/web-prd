import { generateText } from "ai";
import { NextResponse } from "next/server";
import { ZodError } from "zod";

import { createLanguageModel, parseStructuredOutput } from "@/lib/ai-providers";
import { buildQuestionsPrompt } from "@/lib/prompts";
import { questionsRequestSchema, questionsResponseSchema } from "@/lib/schemas";

function getErrorMessage(error: unknown) {
  if (error instanceof ZodError) {
    return error.issues[0]?.message ?? "Payload tidak valid.";
  }

  if (error instanceof Error) {
    return error.message;
  }

  return "Terjadi kesalahan saat membuat pertanyaan.";
}

export async function POST(request: Request) {
  try {
    const payload = questionsRequestSchema.parse(await request.json());
    const prompt = buildQuestionsPrompt(payload);
    const model = createLanguageModel(payload.providerConfig);

    const result = await generateText({
      model,
      system: prompt.system,
      prompt: prompt.prompt,
      temperature: 0.4,
    });

    const parsed = parseStructuredOutput(result.text, questionsResponseSchema);

    return NextResponse.json(parsed);
  } catch (error) {
    const status = error instanceof ZodError ? 400 : 500;

    return NextResponse.json(
      {
        error: getErrorMessage(error),
      },
      { status },
    );
  }
}
