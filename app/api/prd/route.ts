import { generateText } from "ai";
import { NextResponse } from "next/server";
import { ZodError } from "zod";

import { createLanguageModel } from "@/lib/ai-providers";
import { buildPrdPrompt, buildRevisionPrompt } from "@/lib/prompts";
import { prdRequestSchema, prdResponseSchema } from "@/lib/schemas";

function getErrorMessage(error: unknown) {
  if (error instanceof ZodError) {
    return error.issues[0]?.message ?? "Payload tidak valid.";
  }

  if (error instanceof Error) {
    return error.message;
  }

  return "Terjadi kesalahan saat membuat PRD.";
}

export async function POST(request: Request) {
  try {
    const payload = prdRequestSchema.parse(await request.json());
    const prompt =
      payload.mode === "revise" ? buildRevisionPrompt(payload) : buildPrdPrompt(payload);
    const model = createLanguageModel(payload.providerConfig);

    const result = await generateText({
      model,
      system: prompt.system,
      prompt: prompt.prompt,
      temperature: payload.mode === "revise" ? 0.35 : 0.45,
    });

    const parsed = prdResponseSchema.parse({
      markdown: result.text.trim(),
    });

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
