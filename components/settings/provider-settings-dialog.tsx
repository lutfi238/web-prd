"use client";

import { useState } from "react";
import { Cpu, Settings2 } from "lucide-react";
import { toast } from "sonner";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { providerLabels } from "@/lib/provider-defaults";
import { cn } from "@/lib/utils";
import { usePrdWizardStore } from "@/store/prd-wizard-store";
import type { ProviderConfig, ProviderKind } from "@/types/provider";
import { ProviderForm } from "./provider-form";

const providerKinds: ProviderKind[] = ["groq", "openrouter", "openai-compatible"];

export function ProviderSettingsDialog() {
  const activeProvider = usePrdWizardStore((state) => state.activeProvider);
  const providers = usePrdWizardStore((state) => state.providers);
  const updateProviderConfig = usePrdWizardStore((state) => state.updateProviderConfig);
  const setActiveProvider = usePrdWizardStore((state) => state.setActiveProvider);

  const [open, setOpen] = useState(false);
  const [selectedKind, setSelectedKind] = useState<ProviderKind>(activeProvider);

  const handleSave = (config: ProviderConfig) => {
    updateProviderConfig(selectedKind, config);
    setActiveProvider(selectedKind);
    toast.success(`Provider aktif disimpan: ${providerLabels[selectedKind]}`);
    setOpen(false);
  };

  return (
    <Dialog
      open={open}
      onOpenChange={(nextOpen) => {
        setOpen(nextOpen);
        if (nextOpen) {
          setSelectedKind(activeProvider);
        }
      }}
    >
      <DialogTrigger asChild>
        <Button variant="outline">
          <Settings2 data-icon="inline-start" />
          Pengaturan AI
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <div className="flex items-center gap-3">
            <div className="flex size-11 items-center justify-center rounded-2xl bg-primary/15 text-primary">
              <Cpu className="size-5" />
            </div>
            <div className="space-y-1">
              <DialogTitle>Pengaturan Provider AI</DialogTitle>
              <DialogDescription>
                Pilih provider aktif, atur API key, model, dan base URL sesuai kebutuhan personal kamu.
              </DialogDescription>
            </div>
          </div>
        </DialogHeader>

        <div className="grid gap-3 sm:grid-cols-3">
          {providerKinds.map((kind) => {
            const isSelected = kind === selectedKind;
            const isActive = kind === activeProvider;

            return (
              <button
                key={kind}
                type="button"
                className={cn(
                  "rounded-[24px] border px-4 py-4 text-left transition",
                  isSelected
                    ? "border-primary/40 bg-primary/10"
                    : "border-white/10 bg-white/5 hover:border-primary/25 hover:bg-white/7",
                )}
                onClick={() => setSelectedKind(kind)}
              >
                <div className="mb-3 flex items-center justify-between gap-2">
                  <div className="text-sm font-semibold text-white">{providerLabels[kind]}</div>
                  {isActive ? <Badge>Aktif</Badge> : null}
                </div>
                <p className="text-xs leading-5 text-slate-300">
                  {kind === "groq"
                    ? "Simple dan cepat untuk personal workflow."
                    : kind === "openrouter"
                      ? "Fleksibel untuk banyak model lintas vendor."
                      : "Cocok untuk provider custom yang kompatibel."}
                </p>
              </button>
            );
          })}
        </div>

        <ProviderForm providerKind={selectedKind} config={providers[selectedKind]} onSave={handleSave} />
      </DialogContent>
    </Dialog>
  );
}
