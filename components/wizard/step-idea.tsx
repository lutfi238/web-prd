"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

const ideaSchema = z.object({
  idea: z.string().trim().min(10, "Ceritakan idenya sedikit lebih jelas, minimal 10 karakter."),
});

type IdeaFormValues = z.infer<typeof ideaSchema>;

type StepIdeaProps = {
  initialValue: string;
  onContinue: (idea: string) => void;
};

export function StepIdea({ initialValue, onContinue }: StepIdeaProps) {
  const form = useForm<IdeaFormValues>({
    resolver: zodResolver(ideaSchema),
    defaultValues: {
      idea: initialValue,
    },
  });

  return (
    <Card className="orange-ring">
      <CardHeader className="pb-4">
        <CardTitle className="section-title">Mulai dari ide produkmu</CardTitle>
        <CardDescription className="section-copy">
          Tulis singkat ide aplikasi atau SaaS yang mau kamu validasi. Boleh pakai bahasa Indonesia santai.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form className="flex flex-col gap-5" onSubmit={form.handleSubmit((values) => onContinue(values.idea))}>
          <div className="flex flex-col gap-3">
            <Label htmlFor="idea">Ide aplikasi</Label>
            <Textarea
              id="idea"
              className="min-h-[240px] text-base sm:min-h-[280px]"
              placeholder="Ide aplikasi kamu apa? (bahasa Indonesia boleh)"
              {...form.register("idea")}
            />
            {form.formState.errors.idea ? (
              <p className="text-sm text-red-300">{form.formState.errors.idea.message}</p>
            ) : (
              <p className="text-sm text-slate-400">
                Contoh: “Aplikasi AI untuk bantu freelancer bikin proposal proyek dalam 5 menit.”
              </p>
            )}
          </div>

          <div className="flex justify-end">
            <Button size="lg" type="submit">
              Lanjut ke Preferensi Teknologi
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}
