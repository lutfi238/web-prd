import { Check } from "lucide-react";

import { Progress } from "@/components/ui/progress";
import { cn } from "@/lib/utils";
import type { WizardStep } from "@/types/prd";

type ProgressHeaderProps = {
  step: WizardStep;
};

const stepLabels = [
  { id: 1, label: "Ide" },
  { id: 2, label: "Preferensi" },
  { id: 3, label: "Pertanyaan" },
  { id: 4, label: "PRD" },
];

export function ProgressHeader({ step }: ProgressHeaderProps) {
  const progressValue = (step / stepLabels.length) * 100;

  return (
    <div className="app-surface mb-6 rounded-[28px] px-4 py-5 sm:px-6">
      <div className="mb-4 flex items-center justify-between gap-4">
        <div>
          <div className="text-sm font-medium text-orange-200">Progress Wizard</div>
          <div className="mt-1 text-xs text-slate-400">Langkah {step} dari 4 untuk menyusun PRD lengkap kamu.</div>
        </div>
        <div className="text-sm font-semibold text-white">{Math.round(progressValue)}%</div>
      </div>
      <Progress value={progressValue} />
      <div className="mt-4 grid grid-cols-4 gap-2">
        {stepLabels.map((item) => {
          const done = item.id < step;
          const active = item.id === step;

          return (
            <div
              key={item.id}
              className={cn(
                "flex items-center gap-2 rounded-2xl border px-3 py-2 text-xs transition sm:text-sm",
                active
                  ? "border-primary/40 bg-primary/10 text-white"
                  : done
                    ? "border-white/10 bg-white/6 text-slate-200"
                    : "border-white/5 bg-transparent text-slate-500",
              )}
            >
              <div
                className={cn(
                  "flex size-5 items-center justify-center rounded-full text-[10px]",
                  active ? "bg-primary text-primary-foreground" : done ? "bg-white/10 text-slate-100" : "bg-white/6",
                )}
              >
                {done ? <Check className="size-3" /> : item.id}
              </div>
              <span className="truncate">{item.label}</span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
