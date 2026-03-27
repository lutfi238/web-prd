"use client";

import { Bot, Braces } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";
import type { TechPreferenceMode } from "@/types/prd";

type StepTechPreferenceProps = {
  value: TechPreferenceMode;
  customNotes: string;
  isLoading: boolean;
  onModeChange: (mode: TechPreferenceMode) => void;
  onNotesChange: (value: string) => void;
  onContinue: () => void;
};

export function StepTechPreference({
  value,
  customNotes,
  isLoading,
  onModeChange,
  onNotesChange,
  onContinue,
}: StepTechPreferenceProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="section-title">Preferensi teknologi</CardTitle>
        <CardDescription className="section-copy">
          Udah punya pilihan tech stack, atau mau AI yang tentuin?
        </CardDescription>
      </CardHeader>
      <CardContent className="flex flex-col gap-6">
        <div className="grid gap-4 md:grid-cols-2">
          <button
            type="button"
            className={cn(
              "rounded-[28px] border p-5 text-left transition",
              value === "ai"
                ? "orange-ring border-primary/30 bg-primary/10"
                : "border-primary/25 bg-slate-950/60 hover:border-primary/40 hover:bg-primary/8",
            )}
            onClick={() => onModeChange("ai")}
          >
            <div className="mb-5 flex size-12 items-center justify-center rounded-2xl bg-primary/15 text-primary">
              <Bot className="size-5" />
            </div>
            <div className="mb-2 text-lg font-semibold text-white">🤖 Biarkan AI pilih</div>
            <p className="text-sm leading-6 text-slate-300">AI rekomendasikan stack yang paling cocok</p>
          </button>

          <button
            type="button"
            className={cn(
              "rounded-[28px] border p-5 text-left transition",
              value === "custom"
                ? "orange-ring border-primary/30 bg-white/8"
                : "border-white/10 bg-white/5 hover:border-primary/30 hover:bg-white/7",
            )}
            onClick={() => onModeChange("custom")}
          >
            <div className="mb-5 flex size-12 items-center justify-center rounded-2xl bg-white/8 text-white">
              <Braces className="size-5" />
            </div>
            <div className="mb-2 text-lg font-semibold text-white">🛠️ Pilih sendiri</div>
            <p className="text-sm leading-6 text-slate-300">Kamu tentuin teknologi yang mau dipakai</p>
          </button>
        </div>

        {value === "custom" ? (
          <div className="flex flex-col gap-3">
            <Label htmlFor="customTechNotes">Preferensi stack kamu</Label>
            <Textarea
              id="customTechNotes"
              className="min-h-[140px]"
              placeholder="Contoh: frontend Next.js, backend Supabase, AI pakai OpenRouter model Claude / Llama, deployment di Vercel."
              value={customNotes}
              onChange={(event) => onNotesChange(event.target.value)}
            />
            <p className="text-sm text-slate-400">
              Boleh tulis framework, database, provider AI, model, atau constraint teknis yang kamu suka.
            </p>
          </div>
        ) : null}

        <div className="flex justify-end">
          <Button size="lg" onClick={onContinue} disabled={isLoading}>
            {isLoading ? "Menyusun pertanyaan..." : "Lanjut"}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
