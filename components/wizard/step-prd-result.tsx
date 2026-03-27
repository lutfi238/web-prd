"use client";

import { useDeferredValue, useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Copy, Download, MessageSquarePlus, RefreshCcw } from "lucide-react";
import { z } from "zod";

import { LoadingPanel } from "@/components/common/loading-panel";
import { MarkdownPreview } from "@/components/common/markdown-preview";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

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

export function StepPrdResult({
  markdown,
  isGenerating,
  isRevising,
  onCopy,
  onDownload,
  onRevise,
}: StepPrdResultProps) {
  const deferredMarkdown = useDeferredValue(markdown);
  const [revisionOpen, setRevisionOpen] = useState(false);
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
    <div className="flex flex-col gap-5">
      <Card className="orange-ring">
        <CardHeader className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
          <div className="space-y-2">
            <CardTitle className="section-title">PRD siap dipakai</CardTitle>
            <CardDescription className="section-copy">
              Hasil ini sudah dalam format markdown dan bisa langsung kamu salin, download, atau revisi.
            </CardDescription>
          </div>
          <div className="flex flex-wrap gap-3">
            <Button variant="outline" onClick={onDownload}>
              <Download data-icon="inline-start" />
              Download PRD Markdown
            </Button>
            <Button variant="outline" onClick={onCopy}>
              <Copy data-icon="inline-start" />
              Copy ke Clipboard
            </Button>
            <Button onClick={() => setRevisionOpen((current) => !current)}>
              <MessageSquarePlus data-icon="inline-start" />
              Revisi PRD
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="rounded-[28px] border border-white/10 bg-slate-950/70 p-5 sm:p-7">
            <MarkdownPreview content={deferredMarkdown} />
          </div>
        </CardContent>
      </Card>

      {revisionOpen ? (
        <Card>
          <CardHeader>
            <CardTitle>Revisi PRD</CardTitle>
            <CardDescription>
              Tulis arahan revisi seperti “fokus ke MVP 2 minggu”, “lebih teknis”, atau “tambahkan skema database”.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form
              className="flex flex-col gap-4"
              onSubmit={form.handleSubmit((values) => {
                onRevise(values.revisionNote);
                form.reset();
              })}
            >
              <div className="flex flex-col gap-2">
                <Label htmlFor="revisionNote">Arahan revisi</Label>
                <Textarea id="revisionNote" className="min-h-[140px]" {...form.register("revisionNote")} />
                {form.formState.errors.revisionNote ? (
                  <p className="text-sm text-red-300">{form.formState.errors.revisionNote.message}</p>
                ) : null}
              </div>
              <div className="flex justify-end">
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
              </div>
            </form>
          </CardContent>
        </Card>
      ) : null}
    </div>
  );
}
