"use client";

import * as React from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { Copy, Download, FileText, MessageSquarePlus, PencilLine, RefreshCcw } from "lucide-react";
import { useForm } from "react-hook-form";
import { z } from "zod";

import { LoadingPanel } from "@/components/common/loading-panel";
import { MarkdownPreview } from "@/components/common/markdown-preview";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";

const revisionSchema = z.object({
  revisionNote: z.string().trim().min(8, "Tulis arahan revisi yang lebih spesifik."),
});

type RevisionValues = z.infer<typeof revisionSchema>;

type StepPrdResultProps = {
  markdown: string;
  isGenerating: boolean;
  isRevising: boolean;
  onCopy: () => void;
  onDownload: () => void;
  onRevise: (note: string) => void;
};

const workspaceHighlights = [
  {
    icon: FileText,
    label: "Workspace dokumen",
    value: "Siap untuk handoff ke tim atau langsung dicopy.",
  },
  {
    icon: Download,
    label: "Format markdown profesional",
    value: "Tetap enak dibaca saat diunduh maupun ditempel ke Notion atau repo.",
  },
  {
    icon: PencilLine,
    label: "Revisi iteratif",
    value: "Bisa lanjutkan penyempurnaan tanpa mengulang wizard dari awal.",
  },
];

export function StepPrdResult({
  markdown,
  isGenerating,
  isRevising,
  onCopy,
  onDownload,
  onRevise,
}: StepPrdResultProps) {
  const deferredMarkdown = React.useDeferredValue(markdown);
  const [revisionOpen, setRevisionOpen] = React.useState(false);
  const form = useForm<RevisionValues>({
    resolver: zodResolver(revisionSchema),
    defaultValues: {
      revisionNote: "",
    },
  });

  if (isGenerating) {
    return (
      <LoadingPanel
        title="AI sedang menyusun PRD profesional..."
        description="Kami lagi merangkai tujuan produk, user persona, feature set, tech stack, dan timeline yang rapi berdasarkan ide serta jawaban kamu."
      />
    );
  }

  return (
    <Card className="orange-ring overflow-hidden">
      <CardHeader className="gap-6 border-b border-white/10 pb-6">
        <div className="flex flex-col gap-6 xl:flex-row xl:items-start xl:justify-between">
          <div className="space-y-4">
            <div className="inline-flex items-center rounded-full border border-orange-500/20 bg-orange-500/[0.08] px-3 py-1 text-xs font-medium uppercase tracking-[0.2em] text-orange-200">
              Workspace dokumen
            </div>
            <div className="space-y-2">
              <CardTitle className="section-title">PRD siap dipakai</CardTitle>
              <CardDescription className="section-copy max-w-2xl">
                Hasil ini sudah dipoles untuk dibaca seperti dokumen kerja yang siap dibawa ke diskusi produk, handoff engineering,
                atau iterasi berikutnya.
              </CardDescription>
            </div>
            <div className="flex flex-wrap gap-2">
              <div className="document-pill">Format markdown profesional</div>
              <div className="document-pill">Siap copy, download, dan revisi</div>
              <div className="document-pill">Bahasa Indonesia yang rapi</div>
            </div>
          </div>

          <div className="grid gap-3 sm:grid-cols-2 xl:w-[430px]">
            <Button variant="outline" className="justify-start sm:justify-center" onClick={onDownload}>
              <Download data-icon="inline-start" />
              Download PRD Markdown
            </Button>
            <Button variant="outline" className="justify-start sm:justify-center" onClick={onCopy}>
              <Copy data-icon="inline-start" />
              Copy ke Clipboard
            </Button>
            <Button
              className="sm:col-span-2"
              onClick={() => {
                setRevisionOpen((current) => !current);
              }}
            >
              <MessageSquarePlus data-icon="inline-start" />
              Revisi PRD
            </Button>
          </div>
        </div>

        <div className="grid gap-3 lg:grid-cols-3">
          {workspaceHighlights.map((item) => (
            <div key={item.label} className="document-highlight">
              <div className="document-highlight-icon">
                <item.icon className="size-4" />
              </div>
              <div className="space-y-1">
                <p className="text-sm font-medium text-white">{item.label}</p>
                <p className="text-sm leading-6 text-slate-300">{item.value}</p>
              </div>
            </div>
          ))}
        </div>
      </CardHeader>

      <CardContent className="p-0">
        <div
          className={cn(
            "grid gap-0",
            revisionOpen ? "xl:grid-cols-[minmax(0,1fr)_340px]" : "grid-cols-1",
          )}
        >
          <section aria-label="Dokumen PRD" className="space-y-4 p-5 sm:p-7">
            <div className="document-toolbar">
              <div>
                <p className="text-xs font-medium uppercase tracking-[0.18em] text-slate-400">Dokumen aktif</p>
                <p className="mt-1 text-sm leading-6 text-slate-300">
                  Preview ini sudah dioptimalkan untuk membaca heading, tabel, bullet list, dan struktur PRD yang panjang.
                </p>
              </div>
              <div className="rounded-full border border-emerald-400/20 bg-emerald-400/10 px-3 py-1 text-xs font-medium text-emerald-200">
                Siap dibagikan
              </div>
            </div>

            <div className="document-frame">
              <div className="document-page">
                <MarkdownPreview content={deferredMarkdown} />
              </div>
            </div>
          </section>

          {revisionOpen ? (
            <aside className="revision-dock">
              <div className="space-y-2">
                <p className="text-xs font-medium uppercase tracking-[0.18em] text-orange-200">Revision dock</p>
                <h3 className="text-xl font-semibold tracking-tight text-white">Catatan revisi untuk versi berikutnya</h3>
                <p className="text-sm leading-6 text-slate-300">
                  Tulis arahan seperti “buat versi MVP 2 minggu”, “lebih teknis untuk tim backend”, atau “tambahkan matriks
                  prioritas fitur”.
                </p>
              </div>

              <form
                className="mt-6 flex flex-col gap-4"
                onSubmit={form.handleSubmit((values) => {
                  onRevise(values.revisionNote);
                  form.reset();
                })}
              >
                <div className="flex flex-col gap-2">
                  <Label htmlFor="revisionNote">Arahan revisi</Label>
                  <Textarea
                    id="revisionNote"
                    className="min-h-[180px] bg-slate-950/80"
                    placeholder="Contoh: fokuskan ke use case B2B dan sederhanakan scope jadi MVP 14 hari."
                    {...form.register("revisionNote")}
                  />
                  {form.formState.errors.revisionNote ? (
                    <p className="text-sm text-red-300">{form.formState.errors.revisionNote.message}</p>
                  ) : null}
                </div>

                <Button type="submit" disabled={isRevising}>
                  {isRevising ? (
                    <>
                      <RefreshCcw data-icon="inline-start" className="animate-spin" />
                      Merevisi PRD...
                    </>
                  ) : (
                    "Kirim Revisi"
                  )}
                </Button>
              </form>
            </aside>
          ) : null}
        </div>
      </CardContent>
    </Card>
  );
}
