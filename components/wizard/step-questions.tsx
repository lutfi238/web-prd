"use client";

import { useMemo } from "react";

import { EmptyState } from "@/components/common/empty-state";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { isAnswerComplete } from "@/lib/question-answers";
import type { GeneratedQuestion, QuestionAnswer } from "@/types/prd";
import { QuestionCard } from "./question-card";

type StepQuestionsProps = {
  questions: GeneratedQuestion[];
  answers: QuestionAnswer[];
  isGenerating: boolean;
  onRetry: () => void;
  onAnswerChange: (answer: QuestionAnswer) => void;
  onSkip: (questionId: string) => void;
  onGeneratePrd: () => void;
};

export function StepQuestions({
  questions,
  answers,
  isGenerating,
  onRetry,
  onAnswerChange,
  onSkip,
  onGeneratePrd,
}: StepQuestionsProps) {
  const structuredAnswerMap = useMemo(
    () => new Map(answers.map((answer) => [answer.questionId, answer])),
    [answers],
  );
  const completed = questions.filter((question) => isAnswerComplete(question, structuredAnswerMap.get(question.id))).length;
  const progressValue = questions.length === 0 ? 0 : (completed / questions.length) * 100;

  if (!isGenerating && questions.length === 0) {
    return (
      <EmptyState
        title="Pertanyaannya belum tersedia"
        description="Belum ada daftar pertanyaan yang bisa ditampilkan. Kamu bisa mencoba generate ulang dari konfigurasi sekarang."
        actionLabel="Generate Ulang Pertanyaan"
        onAction={onRetry}
      />
    );
  }

  return (
    <div className="flex flex-col gap-5">
      <Card>
        <CardHeader>
          <CardTitle className="section-title">Beberapa pertanyaan</CardTitle>
          <CardDescription className="section-copy">
            Biar PRD-nya lebih akurat. Jawab semua pertanyaan di bawah.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between gap-4">
            <div className="text-sm text-slate-300">
              Progress jawaban <span className="font-semibold text-white">{completed}</span>/{questions.length}
            </div>
            <div className="text-sm font-semibold text-white">{Math.round(progressValue)}%</div>
          </div>
          <Progress value={progressValue} />
        </CardContent>
      </Card>

      {questions.map((question, index) => (
        <QuestionCard
          key={question.id}
          index={index}
          question={question}
          answer={structuredAnswerMap.get(question.id)}
          onChange={onAnswerChange}
          onSkip={onSkip}
        />
      ))}

      <div className="flex justify-end">
        <Button size="lg" onClick={onGeneratePrd} disabled={isGenerating}>
          {isGenerating ? "Menyusun PRD..." : "Generate PRD Sekarang"}
        </Button>
      </div>
    </div>
  );
}
