"use client";

import * as React from "react";
import { MessageSquareMore } from "lucide-react";

import { deriveChoiceAnswerState, getOptionFollowupConfig, getQuestionFollowupOption } from "@/lib/question-answers";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import type { GeneratedQuestion, QuestionAnswer } from "@/types/prd";

type QuestionCardProps = {
  question: GeneratedQuestion;
  answer?: QuestionAnswer;
  index: number;
  onChange: (answer: QuestionAnswer) => void;
  onSkip: (questionId: string) => void;
};

export function QuestionCard({ question, answer, index, onChange, onSkip }: QuestionCardProps) {
  const followupFieldId = React.useId();
  const { selectedOptionId, followupValue } = deriveChoiceAnswerState(question, answer);
  const selectedOption =
    question.type === "choice" ? question.options?.find((option) => option.id === selectedOptionId) : undefined;
  const selectedFollowupConfig = getOptionFollowupConfig(selectedOption);
  const fallbackFollowupConfig = getOptionFollowupConfig(getQuestionFollowupOption(question));
  const [isFollowupRendered, setIsFollowupRendered] = React.useState(Boolean(selectedFollowupConfig));

  React.useEffect(() => {
    if (selectedFollowupConfig) {
      setIsFollowupRendered(true);
      return;
    }

    const timeoutId = window.setTimeout(() => {
      setIsFollowupRendered(false);
    }, 220);

    return () => window.clearTimeout(timeoutId);
  }, [selectedFollowupConfig]);

  return (
    <Card>
      <CardHeader className="gap-4">
        <div className="flex items-start justify-between gap-3">
          <div className="space-y-2">
            <div className="text-xs font-medium uppercase tracking-[0.22em] text-orange-200">
              Pertanyaan {index + 1}
            </div>
            <CardTitle className="text-xl">{question.prompt}</CardTitle>
            {question.helperText ? <p className="text-sm leading-6 text-slate-300">{question.helperText}</p> : null}
          </div>
          <Button variant="ghost" size="sm" onClick={() => onSkip(question.id)}>
            Lewati
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        {question.type === "choice" ? (
          <>
            <ToggleGroup
              type="single"
              value={selectedOptionId ?? ""}
              onValueChange={(nextOptionId) => {
                if (!nextOptionId) {
                  onSkip(question.id);
                  return;
                }

                const nextOption = question.options?.find((option) => option.id === nextOptionId);

                if (!nextOption) {
                  return;
                }

                onChange({
                  questionId: question.id,
                  value: nextOption.label,
                  optionId: nextOption.id,
                  followupValue: "",
                });
              }}
              className="gap-3"
            >
            {question.options?.map((option) => (
              <ToggleGroupItem key={option.id} value={option.id}>
                {option.label}
              </ToggleGroupItem>
            ))}
            </ToggleGroup>

            {isFollowupRendered && (selectedFollowupConfig || fallbackFollowupConfig) ? (
              <div
                aria-hidden={!selectedFollowupConfig}
                className={[
                  "grid overflow-hidden transition-all duration-200 ease-out",
                  selectedFollowupConfig ? "mt-4 grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0",
                ].join(" ")}
              >
                <div className="overflow-hidden">
                  <div className="space-y-3 rounded-[24px] border border-white/10 bg-white/[0.03] p-4">
                    <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs text-slate-300">
                      <MessageSquareMore className="size-3.5" />
                      Detail tambahan
                    </div>
                    <div className="flex flex-col gap-2">
                      <Label htmlFor={followupFieldId}>
                        {selectedFollowupConfig?.label ?? fallbackFollowupConfig?.label ?? "Catatan tambahan"}
                      </Label>
                      <Textarea
                        id={followupFieldId}
                        className="min-h-[110px]"
                        disabled={!selectedFollowupConfig}
                        placeholder={
                          selectedFollowupConfig?.placeholder ??
                          fallbackFollowupConfig?.placeholder ??
                          "Tulis detail tambahan kamu..."
                        }
                        value={selectedFollowupConfig ? followupValue : ""}
                        onChange={(event) => {
                          if (!selectedOption) {
                            return;
                          }

                          onChange({
                            questionId: question.id,
                            value: selectedOption.label,
                            optionId: selectedOption.id,
                            followupValue: event.target.value,
                          });
                        }}
                      />
                    </div>
                  </div>
                </div>
              </div>
            ) : null}
          </>
        ) : (
          <div className="space-y-3">
            <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs text-slate-300">
              <MessageSquareMore className="size-3.5" />
              Jawaban bebas
            </div>
            <Textarea
              className="min-h-[120px]"
              placeholder={question.placeholder ?? "Tulis jawabanmu di sini..."}
              value={answer?.value ?? ""}
              onChange={(event) =>
                onChange({
                  questionId: question.id,
                  value: event.target.value,
                })
              }
            />
          </div>
        )}
      </CardContent>
    </Card>
  );
}
