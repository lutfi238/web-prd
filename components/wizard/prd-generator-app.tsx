"use client";

import { startTransition } from "react";
import { toast } from "sonner";

import { useMounted } from "@/hooks/use-mounted";
import { getProviderDisplayName } from "@/lib/ai-providers";
import { getActiveProviderConfig, usePrdWizardStore } from "@/store/prd-wizard-store";
import type { GeneratePrdResponse, QuestionsResponse, TechPreferenceMode } from "@/types/prd";
import { AppFooter } from "../common/app-footer";
import { LoadingPanel } from "../common/loading-panel";
import { AppShell } from "../layout/app-shell";
import { ProviderSettingsDialog } from "../settings/provider-settings-dialog";
import { ProgressHeader } from "./progress-header";
import { StepIdea } from "./step-idea";
import { StepPrdResult } from "./step-prd-result";
import { StepQuestions } from "./step-questions";
import { StepTechPreference } from "./step-tech-preference";

async function postJson<TResponse>(url: string, body: unknown): Promise<TResponse> {
  const response = await fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(body),
  });

  const json = (await response.json()) as TResponse & { error?: string };

  if (!response.ok) {
    throw new Error(json.error ?? "Request gagal diproses.");
  }

  return json;
}

export function PrdGeneratorApp() {
  const mounted = useMounted();

  const step = usePrdWizardStore((state) => state.step);
  const idea = usePrdWizardStore((state) => state.idea);
  const techPreference = usePrdWizardStore((state) => state.techPreference);
  const customTechNotes = usePrdWizardStore((state) => state.customTechNotes);
  const questions = usePrdWizardStore((state) => state.questions);
  const answers = usePrdWizardStore((state) => state.answers);
  const prdMarkdown = usePrdWizardStore((state) => state.prdMarkdown);
  const activeProvider = usePrdWizardStore((state) => state.activeProvider);
  const providers = usePrdWizardStore((state) => state.providers);
  const isGeneratingQuestions = usePrdWizardStore((state) => state.isGeneratingQuestions);
  const isGeneratingPrd = usePrdWizardStore((state) => state.isGeneratingPrd);
  const isRevisingPrd = usePrdWizardStore((state) => state.isRevisingPrd);
  const setStep = usePrdWizardStore((state) => state.setStep);
  const resetWizard = usePrdWizardStore((state) => state.resetWizard);
  const setIdea = usePrdWizardStore((state) => state.setIdea);
  const setTechPreference = usePrdWizardStore((state) => state.setTechPreference);
  const setCustomTechNotes = usePrdWizardStore((state) => state.setCustomTechNotes);
  const setQuestions = usePrdWizardStore((state) => state.setQuestions);
  const upsertAnswer = usePrdWizardStore((state) => state.upsertAnswer);
  const skipQuestion = usePrdWizardStore((state) => state.skipQuestion);
  const setPrdMarkdown = usePrdWizardStore((state) => state.setPrdMarkdown);
  const setIsGeneratingQuestions = usePrdWizardStore((state) => state.setIsGeneratingQuestions);
  const setIsGeneratingPrd = usePrdWizardStore((state) => state.setIsGeneratingPrd);
  const setIsRevisingPrd = usePrdWizardStore((state) => state.setIsRevisingPrd);

  const activeProviderConfig = getActiveProviderConfig({ activeProvider, providers });
  const activeProviderName = getProviderDisplayName(activeProviderConfig);

  const ensureProviderReady = () => {
    if (!activeProviderConfig.apiKey.trim()) {
      toast.error(`API key untuk ${activeProviderName} belum diisi. Buka Pengaturan AI dulu.`);
      return false;
    }

    if (!activeProviderConfig.model.trim()) {
      toast.error(`Model untuk ${activeProviderName} belum diisi.`);
      return false;
    }

    return true;
  };

  const handleIdeaContinue = (nextIdea: string) => {
    resetWizard();
    setIdea(nextIdea);
    setStep(2);
  };

  const generateQuestions = async (modeOverride?: TechPreferenceMode, notesOverride?: string) => {
    if (!ensureProviderReady()) {
      return;
    }

    const nextMode = modeOverride ?? techPreference;
    const nextNotes = notesOverride ?? customTechNotes;

    setTechPreference(nextMode);
    setCustomTechNotes(nextNotes);
    setIsGeneratingQuestions(true);

    try {
      const response = await postJson<QuestionsResponse>("/api/questions", {
        idea,
        techPreference: nextMode,
        customTechNotes: nextNotes || undefined,
        providerConfig: activeProviderConfig,
      });

      startTransition(() => {
        setQuestions(response.questions);
        setStep(3);
      });
      toast.success("Pertanyaan berhasil disusun.");
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Gagal membuat pertanyaan.");
      setStep(2);
    } finally {
      setIsGeneratingQuestions(false);
    }
  };

  const handleGeneratePrd = async () => {
    if (!ensureProviderReady()) {
      return;
    }

    setStep(4);
    setIsGeneratingPrd(true);

    try {
      const response = await postJson<GeneratePrdResponse>("/api/prd", {
        mode: "generate",
        idea,
        techPreference,
        customTechNotes: customTechNotes || undefined,
        answers,
        providerConfig: activeProviderConfig,
      });

      startTransition(() => {
        setPrdMarkdown(response.markdown);
        setStep(4);
      });
      toast.success("PRD berhasil dibuat.");
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Gagal membuat PRD.");
      setStep(3);
    } finally {
      setIsGeneratingPrd(false);
    }
  };

  const handleRevisePrd = async (revisionNote: string) => {
    if (!ensureProviderReady()) {
      return;
    }

    setIsRevisingPrd(true);

    try {
      const response = await postJson<GeneratePrdResponse>("/api/prd", {
        mode: "revise",
        idea,
        techPreference,
        customTechNotes: customTechNotes || undefined,
        answers,
        providerConfig: activeProviderConfig,
        existingPrd: prdMarkdown,
        revisionNote,
      });

      startTransition(() => {
        setPrdMarkdown(response.markdown);
      });
      toast.success("PRD berhasil direvisi.");
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Gagal merevisi PRD.");
    } finally {
      setIsRevisingPrd(false);
    }
  };

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(prdMarkdown);
      toast.success("PRD berhasil disalin ke clipboard.");
    } catch {
      toast.error("Clipboard tidak tersedia di browser ini.");
    }
  };

  const handleDownload = () => {
    const blob = new Blob([prdMarkdown], { type: "text/markdown;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const anchor = document.createElement("a");
    anchor.href = url;
    anchor.download = "prd-generator-personal.md";
    anchor.click();
    URL.revokeObjectURL(url);
    toast.success("File markdown berhasil diunduh.");
  };

  if (!mounted) {
    return (
      <AppShell action={<ProviderSettingsDialog />}>
        <LoadingPanel
          title="Menyiapkan workspace lokal..."
          description="Kami sedang memuat state wizard dan provider AI yang tersimpan di browser kamu."
        />
      </AppShell>
    );
  }

  return (
    <AppShell action={<ProviderSettingsDialog />}>
      <div className="mx-auto max-w-4xl">
        <ProgressHeader step={step} />

        <div className="mb-5 flex flex-wrap items-center gap-2 text-xs text-slate-400">
          <span className="rounded-full border border-white/10 bg-white/5 px-3 py-1.5">
            Provider aktif: <span className="font-semibold text-slate-100">{activeProviderName}</span>
          </span>
          <span className="rounded-full border border-white/10 bg-white/5 px-3 py-1.5 font-mono text-[11px] text-slate-300">
            {activeProviderConfig.model}
          </span>
        </div>

        {step === 1 ? <StepIdea initialValue={idea} onContinue={handleIdeaContinue} /> : null}

        {step === 2 ? (
          <StepTechPreference
            value={techPreference}
            customNotes={customTechNotes}
            isLoading={isGeneratingQuestions}
            onModeChange={setTechPreference}
            onNotesChange={setCustomTechNotes}
            onContinue={() => generateQuestions(techPreference, customTechNotes)}
          />
        ) : null}

        {step === 3 ? (
          <StepQuestions
            questions={questions}
            answers={answers}
            isGenerating={isGeneratingPrd}
            onRetry={() => generateQuestions()}
            onAnswerChange={upsertAnswer}
            onSkip={skipQuestion}
            onGeneratePrd={handleGeneratePrd}
          />
        ) : null}

        {step === 4 ? (
          <StepPrdResult
            markdown={prdMarkdown}
            isGenerating={isGeneratingPrd}
            isRevising={isRevisingPrd}
            onCopy={handleCopy}
            onDownload={handleDownload}
            onRevise={handleRevisePrd}
          />
        ) : null}

        <AppFooter />
      </div>
    </AppShell>
  );
}
