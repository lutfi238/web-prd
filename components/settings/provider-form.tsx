"use client";

import { useEffect } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { providerConfigSchema } from "@/lib/schemas";
import type { ProviderConfig, ProviderKind } from "@/types/provider";

const providerFormSchema = z
  .object({
    kind: z.enum(["groq", "openrouter", "openai-compatible"]),
    apiKey: z.string().trim().min(1, "API key wajib diisi."),
    model: z.string().trim().min(1, "Model wajib diisi."),
    baseUrl: z.string().trim().optional(),
    label: z.string().trim().optional(),
  })
  .superRefine((value, ctx) => {
    if ((value.kind === "openrouter" || value.kind === "openai-compatible") && !value.baseUrl) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "Base URL wajib diisi.",
        path: ["baseUrl"],
      });
    }

    if (value.kind === "openai-compatible" && !value.label) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "Nama provider wajib diisi.",
        path: ["label"],
      });
    }
  });

type ProviderFormValues = z.infer<typeof providerFormSchema>;

type ProviderFormProps = {
  providerKind: ProviderKind;
  config: ProviderConfig;
  onSave: (config: ProviderConfig) => void;
};

const helperByKind: Record<ProviderKind, string> = {
  groq: "Gunakan Groq API key pribadi kamu. Cocok untuk workflow cepat dengan model Llama atau Mixtral.",
  openrouter:
    "OpenRouter bisa dipakai untuk routing banyak model lewat satu API key. Kamu tetap bisa ganti base URL dan model manual.",
  "openai-compatible":
    "Isi provider custom apa pun yang kompatibel dengan OpenAI API, termasuk base URL, nama provider, dan model.",
};

export function ProviderForm({ providerKind, config, onSave }: ProviderFormProps) {
  const form = useForm<ProviderFormValues>({
    resolver: zodResolver(providerFormSchema),
    defaultValues: {
      kind: providerKind,
      apiKey: config.apiKey,
      model: config.model,
      baseUrl: "baseUrl" in config ? config.baseUrl : "",
      label: "label" in config ? config.label : "",
    },
  });

  useEffect(() => {
    form.reset({
      kind: providerKind,
      apiKey: config.apiKey,
      model: config.model,
      baseUrl: "baseUrl" in config ? config.baseUrl : "",
      label: "label" in config ? config.label : "",
    });
  }, [config, form, providerKind]);

  const onSubmit = (values: ProviderFormValues) => {
    const payload =
      values.kind === "groq"
        ? {
            kind: "groq" as const,
            apiKey: values.apiKey,
            model: values.model,
          }
        : values.kind === "openrouter"
          ? {
              kind: "openrouter" as const,
              apiKey: values.apiKey,
              model: values.model,
              baseUrl: values.baseUrl ?? "",
            }
          : {
              kind: "openai-compatible" as const,
              apiKey: values.apiKey,
              model: values.model,
              baseUrl: values.baseUrl ?? "",
              label: values.label ?? "",
            };

    onSave(providerConfigSchema.parse(payload));
  };

  return (
    <form className="flex flex-col gap-5" onSubmit={form.handleSubmit(onSubmit)}>
      <div className="rounded-3xl border border-white/10 bg-white/5 p-4 text-sm leading-6 text-slate-300">
        {helperByKind[providerKind]}
      </div>

      {providerKind === "openai-compatible" ? (
        <div className="flex flex-col gap-2">
          <Label htmlFor="label">Nama Provider</Label>
          <Input id="label" {...form.register("label")} placeholder="Misalnya: Nebula API" />
          {form.formState.errors.label ? (
            <p className="text-sm text-red-300">{form.formState.errors.label.message}</p>
          ) : null}
        </div>
      ) : null}

      <div className="flex flex-col gap-2">
        <Label htmlFor="apiKey">API Key</Label>
        <Input id="apiKey" type="password" {...form.register("apiKey")} placeholder="Masukkan API key" />
        {form.formState.errors.apiKey ? (
          <p className="text-sm text-red-300">{form.formState.errors.apiKey.message}</p>
        ) : null}
      </div>

      <div className="flex flex-col gap-2">
        <Label htmlFor="model">Model AI</Label>
        <Input id="model" {...form.register("model")} placeholder="Misalnya: llama-3.3-70b-versatile" />
        {form.formState.errors.model ? (
          <p className="text-sm text-red-300">{form.formState.errors.model.message}</p>
        ) : null}
      </div>

      {providerKind !== "groq" ? (
        <div className="flex flex-col gap-2">
          <Label htmlFor="baseUrl">Base URL</Label>
          <Input id="baseUrl" {...form.register("baseUrl")} placeholder="https://api.example.com/v1" />
          {form.formState.errors.baseUrl ? (
            <p className="text-sm text-red-300">{form.formState.errors.baseUrl.message}</p>
          ) : null}
        </div>
      ) : null}

      <div className="flex flex-col gap-2">
        <Label htmlFor="provider-notes">Catatan</Label>
        <Textarea
          id="provider-notes"
          value={
            providerKind === "groq"
              ? "Groq cocok untuk personal use yang cepat."
              : providerKind === "openrouter"
                ? "OpenRouter cocok kalau kamu suka ganti model lintas vendor."
                : "Provider custom cocok untuk gateway internal atau layanan kompatibel lainnya."
          }
          className="min-h-[96px] resize-none text-slate-400"
          readOnly
        />
      </div>

      <div className="flex justify-end">
        <Button type="submit">Simpan Provider</Button>
      </div>
    </form>
  );
}
